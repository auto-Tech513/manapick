#!/usr/bin/env node
// YouTube Data API v3 の snippet.thumbnails.maxres の有無を
// content/videos.json の hasMaxresThumbnail に記録する（Discover の大きな画像用）。
// 判定は API の公式データのみ。HTTP ステータスでの推測はしない。
import path from "node:path";
import { loadEnvFile, readJson, rootDir, writeJson } from "./pipeline-utils.mjs";

const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3";
const BATCH_SIZE = 50;

async function fetchBatch(ids, apiKey) {
  const url = new URL(`${YOUTUBE_API_BASE}/videos`);
  url.searchParams.set("part", "snippet");
  url.searchParams.set("id", ids.join(","));
  url.searchParams.set("key", apiKey);
  const response = await fetch(url);
  if (!response.ok) throw new Error(`YouTube videos.list failed: ${response.status}`);
  return response.json();
}

await loadEnvFile(path.join(rootDir, ".env.local"));
await loadEnvFile(path.join(rootDir, ".env"));
const apiKey = process.env.YOUTUBE_API_KEY || process.env.YT_API_KEY;
if (!apiKey) throw new Error("YOUTUBE_API_KEY or YT_API_KEY is required.");

const videosPath = path.join(rootDir, "content/videos.json");
const videos = await readJson(videosPath);
const ids = videos.map((video) => video.ytid);
const maxres = new Map();

for (let index = 0; index < ids.length; index += BATCH_SIZE) {
  const batch = ids.slice(index, index + BATCH_SIZE);
  const payload = await fetchBatch(batch, apiKey);
  for (const item of payload.items || []) {
    maxres.set(item.id, Boolean(item.snippet?.thumbnails?.maxres));
  }
  console.log(`[backfill-maxres] checked ${Math.min(index + BATCH_SIZE, ids.length)}/${ids.length}`);
}

let withMaxres = 0;
let missing = 0;
for (const video of videos) {
  if (!maxres.has(video.ytid)) {
    missing += 1;
    video.hasMaxresThumbnail = false;
  } else {
    video.hasMaxresThumbnail = maxres.get(video.ytid);
    if (video.hasMaxresThumbnail) withMaxres += 1;
  }
}
await writeJson(videosPath, videos);
console.log(`[backfill-maxres] total=${videos.length} withMaxres=${withMaxres} without=${videos.length - withMaxres} apiMissing=${missing}`);
