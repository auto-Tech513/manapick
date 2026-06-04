#!/usr/bin/env node
import path from "node:path";
import {
  dataDir,
  ensureDir,
  isLikelyJapanese,
  parseArgs,
  readJson,
  rootDir,
  toNumber,
  unwrapItems,
  writeJson,
  yearsSince
} from "./pipeline-utils.mjs";

const AXES = ["実用性", "正確性・鮮度", "分かりやすさ", "体系性", "信頼性", "視聴体験", "規約・権利"];

function usage() {
  console.log(`Usage: node scripts/score-draft.mjs [options]\n\nOptions:\n  --in path           Default: data/candidates.json\n  --out path          Default: data/drafts.json\n  --min-score 28      Excellent candidate threshold\n  --ollama            Try local Ollama review generation\n  --ollama-model name Default: qwen3.6 or OLLAMA_MODEL\n\nCandidates are scored locally. Ollama is optional and only called on localhost.`);
}

function clampScore(score) {
  return Math.max(1, Math.min(5, Math.round(score)));
}

function keywordScore(title, strongWords, mediumWords) {
  const text = title.toLowerCase();
  if (strongWords.some((word) => text.includes(word.toLowerCase()))) return 5;
  if (mediumWords.some((word) => text.includes(word.toLowerCase()))) return 4;
  return 3;
}

function scoreFreshness(candidate) {
  const age = yearsSince(candidate.publishedAt);
  if (age <= 1.5) return { score: 5, note: "公開から約1年半以内で鮮度が高い" };
  if (age <= 3) return { score: 4, note: "近年の内容として扱いやすい" };
  if (age <= 5) return { score: 3, note: "基礎内容なら利用可能だが要確認" };
  return { score: 2, note: "古い可能性があり公開前確認が必要" };
}

function scoreViewing(durationMin) {
  if (durationMin >= 8 && durationMin <= 40) return { score: 5, note: "社会人が見切りやすい長さ" };
  if (durationMin > 40 && durationMin <= 90) return { score: 4, note: "やや長いが体系学習に向く" };
  if ((durationMin >= 4 && durationMin < 8) || (durationMin > 90 && durationMin <= 150)) return { score: 3, note: "目的を絞れば使いやすい" };
  return { score: 2, note: "短すぎる/長すぎるため分割視聴や補足が必要" };
}

function scoreReliability(viewCount) {
  if (viewCount >= 1_000_000) return { score: 5, note: "再生数が非常に多く一定の信頼シグナルがある" };
  if (viewCount >= 200_000) return { score: 4, note: "再生数が多く候補として有望" };
  if (viewCount >= 50_000) return { score: 3, note: "一定の視聴実績がある" };
  if (viewCount >= 10_000) return { score: 2, note: "最低限の視聴実績。内容確認が必要" };
  return { score: 1, note: "視聴実績が少なく慎重に確認" };
}

function inferLevel(candidate) {
  const title = candidate.title || "";
  if (/上級|応用|実践|発展|Advanced|完全攻略/i.test(title)) return "上級";
  if (/中級|実務|具体|Webアプリ|応用/i.test(title)) return "中級";
  if (/初心者|初級|入門|基礎|はじめて|超入門/i.test(title)) return "初級";
  if (candidate.durationMin >= 90) return "中級";
  return "初級";
}

function templateReview(candidate) {
  return [
    `${candidate.sub}を学び始める人が、全体像と最初の手順をつかみやすい候補。`,
    `${candidate.durationMin}分で視聴でき、${candidate.viewCount.toLocaleString("ja-JP")}回再生の実績がある。`,
    "公開前に内容の正確性・情報商材誘導・最新性を人間が確認する。"
  ];
}

async function ollamaReview(candidate, model) {
  const prompt = `Manapick用に、次のYouTube学習動画の3行レビュー草案を日本語で作ってください。各行は40字前後。誇張せず、公開前確認が必要な点も避けずに書く。\nタイトル: ${candidate.title}\nジャンル: ${candidate.genre}/${candidate.sub}\n長さ: ${candidate.durationMin}分\n再生数: ${candidate.viewCount}\n公開日: ${candidate.publishedAt}`;
  const response = await fetch("http://127.0.0.1:11434/api/generate", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ model, prompt, stream: false })
  });
  if (!response.ok) throw new Error(`Ollama failed: ${response.status}`);
  const data = await response.json();
  const lines = String(data.response || "")
    .split(/\r?\n/)
    .map((line) => line.replace(/^[-・\d.\s]+/, "").trim())
    .filter(Boolean)
    .slice(0, 3);
  return lines.length >= 2 ? lines : templateReview(candidate);
}

function scoreCandidate(candidate, minScore) {
  const title = candidate.title || "";
  const practical = keywordScore(title, ["実務", "使い方", "作り方", "勉強法", "ロードマップ"], ["入門", "基礎", "講座", "解説"]);
  const clarity = keywordScore(title, ["初心者", "超入門", "わかる", "やさしい"], ["入門", "基礎", "解説"]);
  const systematic = keywordScore(title, ["完全", "総集編", "保存版", "ロードマップ", "講座"], ["入門", "基礎", "まとめ"]);
  const freshness = scoreFreshness(candidate);
  const viewing = scoreViewing(candidate.durationMin);
  const reliability = scoreReliability(candidate.viewCount);
  const rights = { score: 5, note: "公式YouTubeリンク/埋め込み前提で扱う" };

  const axisScores = [
    { axis: "実用性", score: practical, note: practical >= 4 ? "タイトル上は実務・手順に結びつきやすい" : "実用性は視聴確認が必要" },
    { axis: "正確性・鮮度", ...freshness },
    { axis: "分かりやすさ", score: clarity, note: clarity >= 4 ? "初心者向けの説明が期待できる" : "説明の分かりやすさは要確認" },
    { axis: "体系性", score: systematic, note: systematic >= 4 ? "体系的に学べる可能性が高い" : "単発Tipsの可能性があり要確認" },
    { axis: "信頼性", ...reliability },
    { axis: "視聴体験", ...viewing },
    { axis: "規約・権利", ...rights }
  ].map((axis) => ({ ...axis, score: clampScore(axis.score) }));

  const scoreTotal = axisScores.reduce((sum, axis) => sum + axis.score, 0);
  const cutoffReasons = [];
  if (!isLikelyJapanese(title)) cutoffReasons.push("日本語判定が弱い");
  if (freshness.score <= 2) cutoffReasons.push("鮮度足切り候補");
  if (candidate.durationMin < 4) cutoffReasons.push("短すぎる");
  const excellent = scoreTotal >= minScore && cutoffReasons.length === 0;

  return { axisScores, scoreTotal, cutoffReasons, excellent, level: inferLevel(candidate) };
}

async function main() {
  const args = parseArgs();
  if (args.help) {
    usage();
    return;
  }
  const inputPath = path.resolve(rootDir, args.in || "data/candidates.json");
  const outPath = path.resolve(rootDir, args.out || "data/drafts.json");
  const minScore = toNumber(args["min-score"], 28);
  const payload = await readJson(inputPath);
  const candidates = unwrapItems(payload);
  const model = args["ollama-model"] || process.env.OLLAMA_MODEL || "qwen3.6";
  const useOllama = Boolean(args.ollama);

  const drafts = [];
  for (const candidate of candidates) {
    const scored = scoreCandidate(candidate, minScore);
    let review = templateReview(candidate);
    let reviewSource = "template";
    if (useOllama) {
      try {
        review = await ollamaReview(candidate, model);
        reviewSource = `ollama:${model}`;
      } catch (error) {
        reviewSource = `template (ollama unavailable: ${error.message})`;
      }
    }

    drafts.push({
      ...candidate,
      level: candidate.level || scored.level,
      score: scored.scoreTotal,
      axisScores: scored.axisScores,
      cutoffReasons: scored.cutoffReasons,
      excellent: scored.excellent,
      accepted: false,
      review,
      reviewSource
    });
  }

  drafts.sort((a, b) => Number(b.excellent) - Number(a.excellent) || b.score - a.score || b.viewCount - a.viewCount);
  await ensureDir(dataDir);
  await writeJson(outPath, {
    generatedAt: new Date().toISOString(),
    source: path.relative(rootDir, inputPath),
    minScore,
    total: drafts.length,
    excellent: drafts.filter((draft) => draft.excellent).length,
    items: drafts
  });
  console.log(`Wrote ${drafts.length} drafts to ${path.relative(rootDir, outPath)}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
