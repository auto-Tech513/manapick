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
  console.log(`Usage: node scripts/fetch-candidates.mjs [options]\n\nOptions:\n  --genre ai,data       Comma-separated genre keys to fetch (skips weekly rotation)\n  --config path         Default: scripts/pipeline-config.json\n  --out path            Default: data/candidates.json\n  --max-results 40      YouTube search.list maxResults per query\n  --max-queries 90      Maximum search queries per run\n  --rotation-week 27    Override ISO week number for the 2-week genre rotation\n  --no-rotation         Fetch configured genres in order, still capped by --max-queries\n  --min-views 10000     Minimum view count\n  --fresh-years 8       Exclude videos older than this many years\n  --dry-run             Print planned queries without calling YouTube\n\nDefault runs a 2-week genre rotation so all 10 genres are covered across two executions while each run stays under 90 queries.\nRequires YT_API_KEY or YOUTUBE_API_KEY in env/local .env/.env.local. Env files are ignored by git.`);
}

function chunk(array, size) {
  const chunks = [];
  for (let index = 0; index < array.length; index += size) chunks.push(array.slice(index, index + size));
  return chunks;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

class YoutubeApiError extends Error {
  constructor(endpoint, status, body, reason) {
    super(`YouTube API ${endpoint} failed: ${status}${reason ? ` ${reason}` : ""} ${body}`.trim());
    this.name = "YoutubeApiError";
    this.endpoint = endpoint;
    this.status = status;
    this.body = body;
    this.reason = reason || "";
  }
}

function parseYoutubeError(body) {
  try {
    const parsed = JSON.parse(body);
    const error = parsed.error || {};
    const first = Array.isArray(error.errors) ? error.errors[0] : null;
    return {
      message: error.message || first?.message || body,
      reason: first?.reason || error.status || ""
    };
  } catch {
    return { message: body, reason: "" };
  }
}

function isQuotaOrDailyLimit(error) {
  if (!(error instanceof YoutubeApiError)) return false;
  const reason = `${error.reason} ${error.body}`.toLowerCase();
  return error.status === 429 || (error.status === 403 && /(quota|daily|ratelimit|rate limit|user-rate)/i.test(reason));
}

function isRetryableYoutubeError(error) {
  if (!(error instanceof YoutubeApiError)) return false;
  return error.status === 429 || [500, 502, 503, 504].includes(error.status);
}

async function youtubeGet(endpoint, params, apiKey, retryOptions = {}) {
  const maxRetries = retryOptions.maxRetries ?? 4;
  const baseDelayMs = retryOptions.baseDelayMs ?? 1000;
  const url = new URL(`${YOUTUBE_API_BASE}/${endpoint}`);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") url.searchParams.set(key, String(value));
  }
  url.searchParams.set("key", apiKey);

  for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
    const response = await fetch(url);
    if (response.ok) return response.json();

    const body = await response.text();
    const parsed = parseYoutubeError(body);
    const error = new YoutubeApiError(endpoint, response.status, parsed.message, parsed.reason);
    if (isRetryableYoutubeError(error) && attempt < maxRetries) {
      const delayMs = Math.round(baseDelayMs * 2 ** attempt + Math.random() * 250);
      console.warn(`YouTube API ${endpoint} ${response.status}${parsed.reason ? `/${parsed.reason}` : ""}; retry ${attempt + 1}/${maxRetries} in ${delayMs}ms`);
      await sleep(delayMs);
      continue;
    }
    throw error;
  }

  throw new Error(`YouTube API ${endpoint} failed unexpectedly`);
}

function flattenGenreQueries(genres) {
  return genres.flatMap((genre) => genre.queries.map((query) => ({ ...query, genre: genre.genre, genreLabel: genre.label })));
}

function flattenQueries(config, selectedGenres) {
  const selected = selectedGenres ? new Set(selectedGenres.split(",").map((item) => item.trim()).filter(Boolean)) : null;
  return flattenGenreQueries(config.genres.filter((genre) => !selected || selected.has(genre.genre)));
}

function genreQueryCount(genre) {
  return Array.isArray(genre.queries) ? genre.queries.length : 0;
}

function isoWeekNumber(date = new Date()) {
  const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = utcDate.getUTCDay() || 7;
  utcDate.setUTCDate(utcDate.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(utcDate.getUTCFullYear(), 0, 1));
  return Math.ceil((((utcDate - yearStart) / 86400000) + 1) / 7);
}

function buildTwoWeekGenreBatches(genres, maxQueries) {
  const total = genres.reduce((sum, genre) => sum + genreQueryCount(genre), 0);
  const target = Math.ceil(total / 2);
  const first = [];
  let firstCount = 0;
  for (const genre of genres) {
    const nextCount = firstCount + genreQueryCount(genre);
    const remainingIfMoved = total - firstCount;
    if (first.length > 0 && nextCount > target && remainingIfMoved <= maxQueries) break;
    first.push(genre);
    firstCount = nextCount;
  }
  const second = genres.slice(first.length);
  return [first, second];
}

function capQueries(queries, maxQueries) {
  if (!Number.isFinite(maxQueries) || maxQueries <= 0 || queries.length <= maxQueries) return { queries, truncated: false };
  return { queries: queries.slice(0, maxQueries), truncated: true };
}

function plannedQueries(config, args, maxQueries) {
  if (args.genre || args["no-rotation"]) {
    const selected = flattenQueries(config, args.genre);
    const capped = capQueries(selected, maxQueries);
    return {
      queries: capped.queries,
      plan: {
        mode: args.genre ? "selected-genres" : "no-rotation",
        selectedGenres: args.genre || null,
        totalConfiguredQueries: selected.length,
        maxQueries,
        truncated: capped.truncated
      }
    };
  }

  const batches = buildTwoWeekGenreBatches(config.genres, maxQueries);
  const week = toNumber(args["rotation-week"], isoWeekNumber());
  const batchIndex = Math.abs(week) % 2;
  const rotatedGenres = batches[batchIndex] || [];
  const selected = flattenGenreQueries(rotatedGenres);
  const capped = capQueries(selected, maxQueries);
  return {
    queries: capped.queries,
    plan: {
      mode: "two-week-genre-rotation",
      isoWeek: week,
      rotationIndex: batchIndex,
      selectedGenres: rotatedGenres.map((genre) => genre.genre),
      selectedGenreLabels: rotatedGenres.map((genre) => genre.label),
      batchQueryCounts: batches.map((batch) => batch.reduce((sum, genre) => sum + genreQueryCount(genre), 0)),
      totalConfiguredQueries: config.genres.reduce((sum, genre) => sum + genreQueryCount(genre), 0),
      maxQueries,
      truncated: capped.truncated
    }
  };
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

function rejectedSummary(rejected) {
  return rejected.reduce((acc, item) => {
    for (const reason of item.reasons) acc[reason] = (acc[reason] || 0) + 1;
    return acc;
  }, {});
}

async function saveCandidates(outPath, state) {
  const sortedCandidates = [...state.candidates].sort((a, b) => b.viewCount - a.viewCount);
  await ensureDir(path.dirname(outPath));
  await writeJson(outPath, {
    generatedAt: new Date().toISOString(),
    source: "youtube-data-api-v3",
    filters: state.options,
    queryPlan: state.queryPlan,
    progress: {
      totalQueries: state.queries.length,
      processedQueries: state.processedQueries,
      stoppedReason: state.stoppedReason || null
    },
    total: sortedCandidates.length,
    items: sortedCandidates,
    rejectedSummary: rejectedSummary(state.rejected)
  });
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
    maxQueries: toNumber(args["max-queries"], defaults.maxQueries || 90),
    minViews: toNumber(args["min-views"], defaults.minViews || 10000),
    freshYears: toNumber(args["fresh-years"], defaults.freshYears || 8),
    minDurationMin: toNumber(args["min-duration"], defaults.minDurationMin || 4),
    maxDurationMin: toNumber(args["max-duration"], defaults.maxDurationMin || 240),
    weakTitleTerms: config.weak_title_terms || defaults.weakTitleTerms || []
  };
  const { queries, plan: queryPlan } = plannedQueries(config, args, options.maxQueries);

  if (args["dry-run"]) {
    console.log(JSON.stringify({ options, queryPlan, queries }, null, 2));
    return;
  }

  const apiKey = process.env.YT_API_KEY || process.env.YOUTUBE_API_KEY;
  if (!apiKey) throw new Error("YT_API_KEY or YOUTUBE_API_KEY is required. Set it in your shell/local env file (not committed).");

  const knownIds = await existingVideoIds();
  const denyIds = new Set(config.exclude_ytids || []);
  const seenIds = new Set([...knownIds, ...denyIds]);
  const candidates = [];
  const rejected = [];

  const state = {
    options,
    queryPlan,
    queries,
    candidates,
    rejected,
    processedQueries: 0,
    stoppedReason: null
  };

  console.log(`Fetch plan: ${queryPlan.mode}; ${queries.length}/${queryPlan.totalConfiguredQueries} queries this run; genres=${queryPlan.selectedGenres || "custom"}`);
  if (queryPlan.truncated) console.warn(`Query plan truncated to maxQueries=${options.maxQueries}.`);
  await ensureDir(dataDir);

  for (let index = 0; index < queries.length; index += 1) {
    const query = queries[index];
    const beforeCandidates = candidates.length;
    const beforeRejected = rejected.length;
    try {
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

      const searchHits = [];
      for (const item of search.items || []) {
        const id = item.id?.videoId;
        if (!id || seenIds.has(id)) continue;
        seenIds.add(id);
        searchHits.push({ id, query });
      }

      for (const group of chunk(searchHits, 50)) {
        const videoData = await youtubeGet("videos", {
          part: "contentDetails,statistics,snippet,status",
          id: group.map((item) => item.id).join(",")
        }, apiKey);
        const queryById = new Map(group.map((item) => [item.id, item.query]));
        for (const video of videoData.items || []) {
          const matchedQuery = queryById.get(video.id);
          if (!matchedQuery) continue;
          const filtered = passesFilters(video, matchedQuery, options);
          if (filtered.ok) candidates.push(filtered.candidate);
          else rejected.push({ ytid: video.id, title: video.snippet?.title || "", reasons: filtered.reasons, genre: matchedQuery.genre, sub: matchedQuery.sub });
        }
      }

      state.processedQueries += 1;
      await saveCandidates(outPath, state);
      console.log(`[${state.processedQueries}/${queries.length}] ${query.genre}/${query.sub} "${query.keyword}" -> +${candidates.length - beforeCandidates} candidates, +${rejected.length - beforeRejected} rejected; saved ${path.relative(rootDir, outPath)}`);
    } catch (error) {
      if (isQuotaOrDailyLimit(error)) {
        state.stoppedReason = `quota_or_rate_limit:${error.status}${error.reason ? `:${error.reason}` : ""}`;
        if (state.processedQueries > 0 || candidates.length > 0 || rejected.length > 0) {
          await saveCandidates(outPath, state);
          console.warn(`YouTube API quota/rate limit reached. Stopping normally with ${candidates.length} fetched candidates saved to ${path.relative(rootDir, outPath)}.`);
        } else {
          console.warn("YouTube API quota/rate limit reached before any query completed. Existing candidates file was left untouched.");
        }
        return;
      }
      throw error;
    }
  }

  await saveCandidates(outPath, state);
  console.log(`Completed ${state.processedQueries}/${queries.length} queries. Wrote ${candidates.length} candidates to ${path.relative(rootDir, outPath)}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
