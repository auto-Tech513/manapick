#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { dataDir, parseArgs, readJson, rootDir, toNumber, unwrapItems, writeJson } from "./pipeline-utils.mjs";

function usage() {
  console.log(`Usage: node scripts/ingest.mjs [options]

Options:
  --in path       Default: data/drafts.json
  --out path      Default: content/videos.json
  --min-score n   Auto-ingest drafts with score >= n and no cutoff reasons
  --report path   Default: data/ingest-report-YYYY-MM-DD.md (JST)
  --all-good      Ingest excellent drafts even if accepted is false
  --dry-run       Show what would be ingested without writing

Human review contract:
  Edit data/drafts.json and set accepted:true, status:"accepted",
  or decision:"accept" on drafts to ingest. With --min-score, high-scoring
  drafts are auto-ingested after denylist/risk/cap checks. Denylisted ytid
  values and risky titles are always skipped.`);
}

function isAccepted(draft, allowAllGood) {
  if (draft.accepted === true) return true;
  if (draft.status === "accepted") return true;
  if (draft.decision === "accept") return true;
  if (allowAllGood && draft.excellent === true) return true;
  return false;
}

function scoreOf(draft) {
  const score = draft.finalScore ?? draft.score ?? draft.scoreTotal;
  return Number.isFinite(Number(score)) ? Number(score) : null;
}

function isAutoAccepted(draft, minScore) {
  const score = scoreOf(draft);
  if (minScore === null || score === null || score < minScore) return false;
  if (Array.isArray(draft.cutoffReasons) && draft.cutoffReasons.length) return false;
  return true;
}

function findTitleRiskTerms(title, terms = []) {
  const normalized = String(title || "").toLowerCase();
  return terms.filter((term) => normalized.includes(String(term).toLowerCase()));
}

function compileDenyPatterns(patterns = []) {
  return patterns.flatMap((pattern) => {
    try {
      return [new RegExp(pattern, "i")];
    } catch {
      return [];
    }
  });
}

function matchesDenyPattern(title, denyPatterns) {
  const text = String(title || "");
  return denyPatterns.find((pattern) => pattern.test(text))?.source || null;
}

function isMoneySafeTitle(title) {
  const text = String(title || "");
  return /(NISA|ニーサ|iDeCo|イデコ|投資信託|インデックス|家計|節約|制度|仕組み|入門|初心者|資産形成|長期|積立|分散)/i.test(text);
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
  const score = scoreOf(draft);
  const video = {
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
    ],
    scoreStatus: draft.scoreStatus || "provisional"
  };
  if (Number.isFinite(Number(draft.viewCount))) video.viewCount = Number(draft.viewCount);
  if (draft.publishedAt) video.publishedAt = draft.publishedAt;
  if (draft.scoreConfirmedAt) video.scoreConfirmedAt = draft.scoreConfirmedAt;
  if (draft.editorNote) video.editorNote = draft.editorNote;
  return video;
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

function incrementNested(map, key, subKey, amount = 1) {
  if (!map.has(key)) map.set(key, new Map());
  const inner = map.get(key);
  inner.set(subKey, (inner.get(subKey) || 0) + amount);
}

function nestedCount(map, key, subKey) {
  return map.get(key)?.get(subKey) || 0;
}

function incrementObject(object, key) {
  object[key] = (object[key] || 0) + 1;
}

function mdEscape(value) {
  return String(value ?? "").replace(/\|/g, "\\|").replace(/\r?\n/g, " ");
}

function reportRows(items, mapper) {
  if (!items.length) return "_なし_";
  return items.map(mapper).join("\n");
}

function jstDateStamp(date = new Date()) {
  return new Date(date.getTime() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

async function writeReport(reportPath, payload) {
  const skippedSummary = payload.skipped.reduce((acc, item) => {
    incrementObject(acc, item.reason);
    return acc;
  }, {});
  const lines = [
    `# Manapick ingest report ${jstDateStamp()}`,
    "",
    `- generatedAt: ${new Date().toISOString()}`,
    `- input: ${payload.input}`,
    `- output: ${payload.output}`,
    `- minScore: ${payload.minScore ?? "manual"}`,
    `- currentBefore: ${payload.currentBefore}`,
    `- additions: ${payload.additions.length}`,
    `- skipped: ${payload.skipped.length}`,
    "",
    "## Skipped summary",
    "",
    ...Object.entries(skippedSummary).map(([reason, count]) => `- ${reason}: ${count}`),
    "",
    "## Adopted",
    "",
    "| ytid | genre | sub | score | channel | title |",
    "|---|---:|---:|---:|---|---|",
    reportRows(payload.additions, (video) => `| ${mdEscape(video.ytid)} | ${mdEscape(video.genre)} | ${mdEscape(video.sub)} | ${mdEscape(video.score)} | ${mdEscape(video.channel)} | ${mdEscape(video.title)} |`),
    "",
    "## Skipped",
    "",
    "| ytid | reason | score | genre | sub | channel | title |",
    "|---|---|---:|---:|---:|---|---|",
    reportRows(payload.skipped, (item) => `| ${mdEscape(item.ytid)} | ${mdEscape(item.reason)} | ${mdEscape(item.score ?? "")} | ${mdEscape(item.genre ?? "")} | ${mdEscape(item.sub ?? "")} | ${mdEscape(item.channel ?? "")} | ${mdEscape(item.title ?? "")} |`),
    ""
  ];
  await writeJson(reportPath.replace(/\.md$/, ".json"), payload);
  await fs.writeFile(reportPath, lines.join("\n"));
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
  const outPath = path.resolve(rootDir, args.out || "content/videos.json");
  const reportPath = path.resolve(rootDir, args.report || path.join(dataDir, `ingest-report-${jstDateStamp()}.md`));
  const config = await readJson(path.resolve(rootDir, args.config || "scripts/pipeline-config.json"), {});
  const excludeIds = new Set(config.exclude_ytids || []);
  const weakTitleTerms = config.weak_title_terms || [];
  const denyPatterns = compileDenyPatterns(config.deny_title_patterns || []);
  const moneyDenyPatterns = compileDenyPatterns(config.money_deny_title_patterns || []);
  const minScore = args["min-score"] === undefined ? null : toNumber(args["min-score"], 28);
  const drafts = unwrapItems(await readJson(inputPath));
  const skipped = [];
  const current = await readJson(outPath, []);
  const existingIds = new Set(current.map((video) => video.ytid));
  const channelCounts = new Map();
  const kaikeiSubCounts = new Map();
  const additions = [];
  const candidates = [];

  for (const video of current) {
    incrementNested(channelCounts, video.genre, video.channel || "");
    if (video.genre === "kaikei" && ["税理士", "中小企業診断士"].includes(video.sub)) {
      kaikeiSubCounts.set(video.sub, (kaikeiSubCounts.get(video.sub) || 0) + 1);
    }
  }

  for (const draft of drafts) {
    const score = scoreOf(draft);
    const skippedBase = {
      ytid: draft.ytid,
      title: draft.title,
      score,
      genre: draft.genre,
      sub: draft.sub,
      channel: draft.channel || draft.channelTitle || ""
    };
    if (existingIds.has(draft.ytid)) {
      skipped.push({ ...skippedBase, reason: "already_exists" });
      continue;
    }
    const accepted = isAccepted(draft, Boolean(args["all-good"])) || isAutoAccepted(draft, minScore);
    if (!accepted) {
      skipped.push({ ...skippedBase, reason: minScore === null ? "not_accepted" : "below_min_score_or_cutoff" });
      continue;
    }
    if (excludeIds.has(draft.ytid)) {
      skipped.push({ ...skippedBase, reason: "denylist" });
      continue;
    }
    const denyPattern = matchesDenyPattern(draft.title, denyPatterns);
    if (denyPattern) {
      skipped.push({ ...skippedBase, reason: `deny_title:${denyPattern}` });
      continue;
    }
    const riskTerms = Array.from(new Set([...(draft.riskTerms || []), ...findTitleRiskTerms(draft.title, weakTitleTerms)]));
    if (riskTerms.length && draft.overrideRisk !== true) {
      skipped.push({ ...skippedBase, reason: `title_risk:${riskTerms.join("/")}` });
      continue;
    }
    if (draft.genre === "money") {
      const moneyDenyPattern = matchesDenyPattern(draft.title, moneyDenyPatterns);
      if (moneyDenyPattern) {
        skipped.push({ ...skippedBase, reason: `money_deny_title:${moneyDenyPattern}` });
        continue;
      }
      if (!isMoneySafeTitle(draft.title)) {
        skipped.push({ ...skippedBase, reason: "money_safety_scope" });
        continue;
      }
    }
    const video = toVideo(draft);
    validateVideo(video);
    candidates.push(video);
  }

  candidates.sort((a, b) => (b.score ?? -1) - (a.score ?? -1) || (b.viewCount ?? 0) - (a.viewCount ?? 0));
  for (const video of candidates) {
    const channel = video.channel || "";
    if (nestedCount(channelCounts, video.genre, channel) >= 5) {
      skipped.push({ ytid: video.ytid, title: video.title, score: video.score, genre: video.genre, sub: video.sub, channel, reason: "channel_cap" });
      continue;
    }
    if (video.genre === "kaikei" && ["税理士", "中小企業診断士"].includes(video.sub) && (kaikeiSubCounts.get(video.sub) || 0) >= 2) {
      skipped.push({ ytid: video.ytid, title: video.title, score: video.score, genre: video.genre, sub: video.sub, channel, reason: "kaikei_upper_qualification_cap" });
      continue;
    }
    additions.push(video);
    existingIds.add(video.ytid);
    incrementNested(channelCounts, video.genre, channel);
    if (video.genre === "kaikei" && ["税理士", "中小企業診断士"].includes(video.sub)) {
      kaikeiSubCounts.set(video.sub, (kaikeiSubCounts.get(video.sub) || 0) + 1);
    }
  }

  const reportPayload = {
    input: path.relative(rootDir, inputPath),
    output: path.relative(rootDir, outPath),
    minScore,
    currentBefore: current.length,
    additions,
    skipped
  };

  if (args["dry-run"]) {
    console.log(JSON.stringify({
      input: reportPayload.input,
      additions: additions.map((video) => ({ ytid: video.ytid, title: video.title, score: video.score })),
      skipped
    }, null, 2));
    return;
  }

  if (additions.length === 0) {
    console.log("No accepted new drafts to ingest.");
    await writeReport(reportPath, reportPayload);
    return;
  }

  await backup(outPath);
  await writeJson(outPath, [...current, ...additions]);
  await writeReport(reportPath, reportPayload);
  console.log(`Merged ${additions.length} videos into ${path.relative(rootDir, outPath)}`);
  console.log(`Wrote ingest report to ${path.relative(rootDir, reportPath)}`);
  if (skipped.length) console.log(`Skipped ${skipped.length} drafts.`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
