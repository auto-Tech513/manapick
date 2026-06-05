#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { contentDir, parseArgs, readJson, rootDir, unwrapItems, writeJson } from "./pipeline-utils.mjs";

function usage() {
  console.log(`Usage: node scripts/ingest.mjs [options]\n\nOptions:\n  --in path       Default: data/drafts.json\n  --out path      Default: content/videos.json\n  --all-good      Ingest excellent drafts even if accepted is false\n  --dry-run       Show what would be ingested without writing\n\nHuman review contract:\n  Edit data/drafts.json and set accepted:true, status:"accepted",\n  or decision:"accept" on drafts to ingest. Final score/channel/review\n  can be edited in the draft before running this script. Denylisted
  ytid values are always skipped. Title risk terms require overrideRisk:true.`);
}

function isAccepted(draft, allowAllGood) {
  if (draft.accepted === true) return true;
  if (draft.status === "accepted") return true;
  if (draft.decision === "accept") return true;
  if (allowAllGood && draft.excellent === true) return true;
  return false;
}

function findTitleRiskTerms(title, terms = []) {
  const normalized = String(title || "").toLowerCase();
  return terms.filter((term) => normalized.includes(String(term).toLowerCase()));
}

function normalizeTags(draft) {
  const tags = new Set();
  if (draft.sub) tags.add(draft.sub);
  if (draft.keyword) {
    for (const token of String(draft.keyword).split(/[\s/・,、]+/)) {
      const clean = token.trim();
      if (clean && clean.length <= 18 && !["日本語", "初心者"].includes(clean)) tags.add(clean);
    }
  }
  return Array.from(tags).slice(0, 5);
}

function toVideo(draft) {
  const score = draft.finalScore ?? draft.score ?? draft.scoreTotal ?? null;
  return {
    genre: draft.genre,
    sub: draft.sub,
    ytid: draft.ytid,
    level: draft.level || "初級",
    minutes: draft.minutes ?? draft.durationMin,
    channel: draft.channel || draft.channelTitle || "（公開前に確認）",
    score,
    axisScores: Array.isArray(draft.axisScores) ? draft.axisScores : [],
    title: draft.title,
    url: draft.url || `https://www.youtube.com/watch?v=${draft.ytid}`,
    tags: Array.isArray(draft.tags) && draft.tags.length ? draft.tags : normalizeTags(draft),
    review: Array.isArray(draft.review) && draft.review.length ? draft.review.slice(0, 3) : [
      `${draft.sub || "このテーマ"}の全体像をつかみやすい学習候補。`,
      "基礎から次の一歩へ進む流れを作りやすい一本。",
      "ロードマップ上の前後の動画と組み合わせて学びやすい。"
    ]
  };
}

function validateVideo(video) {
  const missing = [];
  for (const key of ["genre", "sub", "ytid", "level", "minutes", "channel", "score", "axisScores", "title", "url", "tags", "review"]) {
    if (!(key in video)) missing.push(key);
  }
  if (missing.length) throw new Error(`Draft ${video.ytid || "(unknown)"} missing fields: ${missing.join(", ")}`);
  if (!Array.isArray(video.axisScores)) throw new Error(`Draft ${video.ytid} axisScores must be an array`);
  if (!Array.isArray(video.tags)) throw new Error(`Draft ${video.ytid} tags must be an array`);
  if (!Array.isArray(video.review)) throw new Error(`Draft ${video.ytid} review must be an array`);
}

async function backup(filePath) {
  try {
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    await fs.copyFile(filePath, `${filePath}.${stamp}.bak`);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
}

async function main() {
  const args = parseArgs();
  if (args.help) {
    usage();
    return;
  }

  const inputPath = path.resolve(rootDir, args.in || "data/drafts.json");
  const outPath = path.resolve(rootDir, args.out || path.join(contentDir, "videos.json"));
  const config = await readJson(path.resolve(rootDir, args.config || "scripts/pipeline-config.json"), {});
  const excludeIds = new Set(config.exclude_ytids || []);
  const weakTitleTerms = config.weak_title_terms || [];
  const drafts = unwrapItems(await readJson(inputPath));
  const accepted = drafts.filter((draft) => isAccepted(draft, Boolean(args["all-good"])));
  const skipped = [];
  const current = await readJson(outPath, []);
  const existingIds = new Set(current.map((video) => video.ytid));
  const additions = [];

  for (const draft of accepted) {
    if (existingIds.has(draft.ytid)) continue;
    if (excludeIds.has(draft.ytid)) {
      skipped.push({ ytid: draft.ytid, reason: "denylist" });
      continue;
    }
    const riskTerms = Array.from(new Set([...(draft.riskTerms || []), ...findTitleRiskTerms(draft.title, weakTitleTerms)]));
    if (riskTerms.length && draft.overrideRisk !== true) {
      skipped.push({ ytid: draft.ytid, reason: `title risk: ${riskTerms.join("/")}` });
      continue;
    }
    const video = toVideo(draft);
    validateVideo(video);
    additions.push(video);
    existingIds.add(video.ytid);
  }

  if (args["dry-run"]) {
    console.log(JSON.stringify({
      input: path.relative(rootDir, inputPath),
      additions: additions.map((video) => ({ ytid: video.ytid, title: video.title, score: video.score })),
      skipped
    }, null, 2));
    return;
  }

  if (additions.length === 0) {
    console.log("No accepted new drafts to ingest.");
    return;
  }

  await backup(outPath);
  await writeJson(outPath, [...current, ...additions]);
  console.log(`Merged ${additions.length} videos into ${path.relative(rootDir, outPath)}`);
  if (skipped.length) console.log(`Skipped ${skipped.length} denied/risky drafts.`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
