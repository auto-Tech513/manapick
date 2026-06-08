#!/usr/bin/env node
import path from "node:path";
import { loadEnvFile, readJson, rootDir, writeJson } from "./pipeline-utils.mjs";

const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3";
const BATCH_SIZE = 50;

function usage() {
  console.log(`Usage: node scripts/backfill-video-published-at.mjs [options]

Options:
  --videos path      Default: content/videos.json
  --dry-run          Fetch and report, but do not write videos.json

Reads YOUTUBE_API_KEY from .env.local/env first. YT_API_KEY is also accepted for compatibility.
API keys are never printed.`);
}

function chunk(array, size) {
  const chunks = [];
  for (let index = 0; index < array.length; index += size) chunks.push(array.slice(index, index + size));
  return chunks;
}

function parseArgs(argv = process.argv.slice(2)) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith("--")) continue;
    const key = token.slice(2);
    if (key === "dry-run" || key === "help") {
      args[key] = true;
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

async function youtubeVideosList(ids, apiKey) {
  const url = new URL(`${YOUTUBE_API_BASE}/videos`);
  url.searchParams.set("part", "snippet");
  url.searchParams.set("id", ids.join(","));
  url.searchParams.set("key", apiKey);

  const response = await fetch(url);
  if (!response.ok) {
    let message = "";
    try {
      const body = await response.json();
      message = body?.error?.message ? ` ${body.error.message}` : "";
    } catch {
      message = "";
    }
    throw new Error(`YouTube videos.list failed: ${response.status}${message}`);
  }
  return response.json();
}

function withPublishedAt(video, publishedAt) {
  if (video.publishedAt === publishedAt) return video;
  const next = {};
  for (const [key, value] of Object.entries(video)) {
    if (key === "scoreStatus" && !Object.hasOwn(next, "publishedAt")) {
      next.publishedAt = publishedAt;
    }
    next[key] = value;
  }
  if (!Object.hasOwn(next, "publishedAt")) next.publishedAt = publishedAt;
  return next;
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
  if (!apiKey) {
    throw new Error("YOUTUBE_API_KEY is required in .env.local or env. YT_API_KEY is accepted as a fallback.");
  }

  const videosPath = path.resolve(rootDir, args.videos || "content/videos.json");
  const videos = await readJson(videosPath);
  const ids = videos.map((video) => video.ytid).filter(Boolean);
  const uniqueIds = Array.from(new Set(ids));
  const beforeMissing = videos.filter((video) => !video.publishedAt).length;
  const publishedAtById = new Map();
  const failedIds = new Set(uniqueIds);
  const batches = chunk(uniqueIds, BATCH_SIZE);

  for (let index = 0; index < batches.length; index += 1) {
    const batch = batches[index];
    const payload = await youtubeVideosList(batch, apiKey);
    for (const item of payload.items || []) {
      const publishedAt = item.snippet?.publishedAt;
      if (!item.id || !publishedAt) continue;
      publishedAtById.set(item.id, publishedAt);
      failedIds.delete(item.id);
    }
    console.log(`Fetched batch ${index + 1}/${batches.length}: requested ${batch.length}, received ${(payload.items || []).length}`);
  }

  const nextVideos = videos.map((video) => {
    const publishedAt = publishedAtById.get(video.ytid);
    return publishedAt ? withPublishedAt(video, publishedAt) : video;
  });
  const afterMissing = nextVideos.filter((video) => !video.publishedAt).length;
  const changed = nextVideos.filter((video, index) => video.publishedAt !== videos[index].publishedAt).length;

  if (failedIds.size > 0) {
    console.warn(`publishedAt fetch failed or unavailable for ${failedIds.size} ytid(s): ${Array.from(failedIds).join(",")}`);
  }

  if (!args["dry-run"]) {
    await writeJson(videosPath, nextVideos);
  }

  console.log(JSON.stringify({
    source: "youtube-data-api-v3 videos.list(part=snippet)",
    totalVideos: videos.length,
    batches: batches.length,
    beforeMissing,
    afterMissing,
    changed,
    dryRun: Boolean(args["dry-run"])
  }, null, 2));
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
