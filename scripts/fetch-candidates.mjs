#!/usr/bin/env node
import path from "node:path";
import {
  dataDir,
  ensureDir,
  existingVideoIds,
  isLikelyJapanese,
  loadEnvFile,
  parseArgs,
  parseIsoDurationToMinutes,
  readJson,
  rootDir,
  toNumber,
  writeJson,
  yearsSince,
  youtubeUrl
} from "./pipeline-utils.mjs";

const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3";

function usage() {
  console.log(`Usage: node scripts/fetch-candidates.mjs [options]\n\nOptions:\n  --genre ai,data       Comma-separated genre keys to fetch\n  --config path         Default: scripts/pipeline-config.json\n  --out path            Default: data/candidates.json\n  --max-results 40      YouTube search.list maxResults per query\n  --min-views 10000     Minimum view count\n  --fresh-years 8       Exclude videos older than this many years\n  --dry-run             Print planned queries without calling YouTube\n\nRequires YT_API_KEY or YOUTUBE_API_KEY in env/local .env/.env.local. Env files are ignored by git.`);
}

function chunk(array, size) {
  const chunks = [];
  for (let index = 0; index < array.length; index += size) chunks.push(array.slice(index, index + size));
  return chunks;
}

async function youtubeGet(endpoint, params, apiKey) {
  const url = new URL(`${YOUTUBE_API_BASE}/${endpoint}`);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") url.searchParams.set(key, String(value));
  }
  url.searchParams.set("key", apiKey);
  const response = await fetch(url);
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`YouTube API ${endpoint} failed: ${response.status} ${body}`);
  }
  return response.json();
}

function flattenQueries(config, selectedGenres) {
  const selected = selectedGenres ? new Set(selectedGenres.split(",").map((item) => item.trim()).filter(Boolean)) : null;
  return config.genres
    .filter((genre) => !selected || selected.has(genre.genre))
    .flatMap((genre) => genre.queries.map((query) => ({ ...query, genre: genre.genre, genreLabel: genre.label })));
}

function findTitleRiskTerms(title, terms = []) {
  const normalized = String(title || "").toLowerCase();
  return terms.filter((term) => normalized.includes(String(term).toLowerCase()));
}

function passesFilters(video, query, options) {
  const snippet = video.snippet || {};
  const stats = video.statistics || {};
  const details = video.contentDetails || {};
  const title = snippet.title || "";
  const description = snippet.description || "";
  const durationMin = parseIsoDurationToMinutes(details.duration);
  const viewCount = Number(stats.viewCount || 0);
  const ageYears = yearsSince(snippet.publishedAt);
  const languageHint = snippet.defaultAudioLanguage || snippet.defaultLanguage || "";
  const japanese = languageHint.startsWith("ja") || isLikelyJapanese(`${title} ${description}`);

  const riskTerms = findTitleRiskTerms(title, options.weakTitleTerms);
  const reasons = [];
  if (!japanese) reasons.push("not_japanese");
  if (viewCount < options.minViews) reasons.push("low_views");
  if (ageYears > options.freshYears) reasons.push("too_old");
  if (durationMin < options.minDurationMin) reasons.push("too_short");
  if (durationMin > options.maxDurationMin) reasons.push("too_long");

  return {
    ok: reasons.length === 0,
    reasons,
    candidate: {
      ytid: video.id,
      title,
      channelTitle: snippet.channelTitle || "",
      durationMin,
      viewCount,
      publishedAt: snippet.publishedAt || "",
      genre: query.genre,
      sub: query.sub,
      keyword: query.keyword,
      url: youtubeUrl(video.id),
      riskTerms
    }
  };
}

async function main() {
  const args = parseArgs();
  if (args.help) {
    usage();
    return;
  }

  await loadEnvFile();
  const configPath = path.resolve(rootDir, args.config || "scripts/pipeline-config.json");
  const outPath = path.resolve(rootDir, args.out || "data/candidates.json");
  const config = await readJson(configPath);
  const defaults = config.defaults || {};
  const options = {
    regionCode: args["region-code"] || defaults.regionCode || "JP",
    relevanceLanguage: args.language || defaults.relevanceLanguage || "ja",
    maxResults: toNumber(args["max-results"], defaults.maxResults || 25),
    minViews: toNumber(args["min-views"], defaults.minViews || 10000),
    freshYears: toNumber(args["fresh-years"], defaults.freshYears || 8),
    minDurationMin: toNumber(args["min-duration"], defaults.minDurationMin || 4),
    maxDurationMin: toNumber(args["max-duration"], defaults.maxDurationMin || 240),
    weakTitleTerms: config.weak_title_terms || defaults.weakTitleTerms || []
  };
  const queries = flattenQueries(config, args.genre);

  if (args["dry-run"]) {
    console.log(JSON.stringify({ options, queries }, null, 2));
    return;
  }

  const apiKey = process.env.YT_API_KEY || process.env.YOUTUBE_API_KEY;
  if (!apiKey) throw new Error("YT_API_KEY or YOUTUBE_API_KEY is required. Set it in your shell/local env file (not committed).");

  const knownIds = await existingVideoIds();
  const denyIds = new Set(config.exclude_ytids || []);
  const seenIds = new Set([...knownIds, ...denyIds]);
  const searchHits = [];

  for (const query of queries) {
    const search = await youtubeGet("search", {
      part: "snippet",
      q: query.keyword,
      type: "video",
      relevanceLanguage: options.relevanceLanguage,
      regionCode: options.regionCode,
      maxResults: options.maxResults,
      safeSearch: "none",
      videoEmbeddable: "true"
    }, apiKey);

    for (const item of search.items || []) {
      const id = item.id?.videoId;
      if (!id || seenIds.has(id)) continue;
      seenIds.add(id);
      searchHits.push({ id, query });
    }
  }

  const candidates = [];
  const rejected = [];
  for (const group of chunk(searchHits, 50)) {
    const videoData = await youtubeGet("videos", {
      part: "contentDetails,statistics,snippet,status",
      id: group.map((item) => item.id).join(",")
    }, apiKey);
    const queryById = new Map(group.map((item) => [item.id, item.query]));
    for (const video of videoData.items || []) {
      const query = queryById.get(video.id);
      if (!query) continue;
      const filtered = passesFilters(video, query, options);
      if (filtered.ok) candidates.push(filtered.candidate);
      else rejected.push({ ytid: video.id, title: video.snippet?.title || "", reasons: filtered.reasons, genre: query.genre, sub: query.sub });
    }
  }

  candidates.sort((a, b) => b.viewCount - a.viewCount);
  await ensureDir(dataDir);
  await writeJson(outPath, {
    generatedAt: new Date().toISOString(),
    source: "youtube-data-api-v3",
    filters: options,
    total: candidates.length,
    items: candidates,
    rejectedSummary: rejected.reduce((acc, item) => {
      for (const reason of item.reasons) acc[reason] = (acc[reason] || 0) + 1;
      return acc;
    }, {})
  });
  console.log(`Wrote ${candidates.length} candidates to ${path.relative(rootDir, outPath)}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
