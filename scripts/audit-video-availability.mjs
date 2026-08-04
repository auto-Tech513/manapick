#!/usr/bin/env node
import path from "node:path";
import { loadEnvFile, readJson, rootDir, writeJson } from "./pipeline-utils.mjs";

const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3";
const BATCH_SIZE = 50;

function parseArgs(argv = process.argv.slice(2)) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith("--")) continue;
    const key = token.slice(2);
    if (key === "help") {
      args.help = true;
      continue;
    }
    const next = argv[index + 1];
    if (next && !next.startsWith("--")) {
      args[key] = next;
      index += 1;
    } else {
      args[key] = true;
    }
  }
  return args;
}

function usage() {
  console.log(`Usage: node scripts/audit-video-availability.mjs [options]

Options:
  --videos path      Default: content/videos.json
  --report path      Optionally write the JSON result

Checks all stored YouTube IDs in batches of 50. The command fails when an ID is
missing, non-public, not processed, not embeddable, or has a different publishedAt.
API keys are read from the shell, .env.local, or .env and are never printed.`);
}

function batchesOf(items, size) {
  const batches = [];
  for (let index = 0; index < items.length; index += size) batches.push(items.slice(index, index + size));
  return batches;
}

async function fetchBatch(ids, apiKey) {
  const url = new URL(`${YOUTUBE_API_BASE}/videos`);
  url.searchParams.set("part", "status,snippet");
  url.searchParams.set("id", ids.join(","));
  url.searchParams.set("key", apiKey);
  const response = await fetch(url);
  if (!response.ok) throw new Error(`YouTube videos.list failed: ${response.status}`);
  return response.json();
}

async function main() {
  const args = parseArgs();
  if (args.help) {
    usage();
    return;
  }

  await loadEnvFile(path.join(rootDir, ".env.local"));
  await loadEnvFile(path.join(rootDir, ".env"));
  const apiKey = process.env.YOUTUBE_API_KEY || process.env.YT_API_KEY;
  if (!apiKey) throw new Error("YOUTUBE_API_KEY or YT_API_KEY is required.");

  const videosPath = path.resolve(rootDir, args.videos || "content/videos.json");
  const videos = await readJson(videosPath);
  const byId = new Map(videos.map((video) => [video.ytid, video]));
  if (byId.size !== videos.length) throw new Error("Duplicate ytid values exist in videos.json.");

  const ids = [...byId.keys()];
  const seen = new Set();
  const unavailable = [];
  const publishedAtMismatches = [];
  const batches = batchesOf(ids, BATCH_SIZE);

  for (let index = 0; index < batches.length; index += 1) {
    const batch = batches[index];
    const payload = await fetchBatch(batch, apiKey);
    for (const item of payload.items || []) {
      seen.add(item.id);
      const source = byId.get(item.id);
      const status = item.status || {};
      if (status.privacyStatus !== "public" || status.embeddable !== true || status.uploadStatus !== "processed") {
        unavailable.push({
          ytid: item.id,
          privacyStatus: status.privacyStatus,
          embeddable: status.embeddable,
          uploadStatus: status.uploadStatus
        });
      }
      if (source?.publishedAt && item.snippet?.publishedAt !== source.publishedAt) {
        publishedAtMismatches.push({
          ytid: item.id,
          stored: source.publishedAt,
          api: item.snippet?.publishedAt || null
        });
      }
    }
    console.log(`[video:availability] checked ${Math.min((index + 1) * BATCH_SIZE, ids.length)}/${ids.length}`);
  }

  const missing = ids.filter((id) => !seen.has(id));
  const result = {
    checkedAt: new Date().toISOString(),
    source: "youtube-data-api-v3 videos.list(part=status,snippet)",
    total: ids.length,
    apiReturned: seen.size,
    missing,
    unavailable,
    publishedAtMismatches
  };

  if (args.report) await writeJson(path.resolve(rootDir, args.report), result);
  console.log(JSON.stringify(result, null, 2));

  if (missing.length || unavailable.length || publishedAtMismatches.length) {
    throw new Error(
      `Video availability audit failed: missing=${missing.length} unavailable=${unavailable.length} publishedAtMismatches=${publishedAtMismatches.length}`
    );
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
