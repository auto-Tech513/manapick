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

function usage() {
  console.log(`Usage: node scripts/score-draft.mjs [options]

Options:
  --in path                 Default: data/candidates.json
  --out path                Default: data/drafts.json
  --config path             Default: scripts/pipeline-config.json
  --min-score 28            Excellent candidate threshold
  --limit n                 Score only the first n candidates
  --no-ollama               Disable local Ollama review generation
  --ollama-model name       Default: OLLAMA_MODEL or qwen3.6:35b-a3b
  --ollama-timeout ms       Default: 120000
  --ollama-excellent-only   Limit Ollama generation to excellent drafts

Candidates are scored locally. Ollama is tried by default on http://localhost:11434/api/generate.`);
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

function findTitleRiskTerms(title, terms = []) {
  const normalized = String(title || "").toLowerCase();
  return terms.filter((term) => normalized.includes(String(term).toLowerCase()));
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
  if (viewCount >= 1_000_000) return { score: 5, note: "広く視聴されている候補" };
  if (viewCount >= 200_000) return { score: 4, note: "視聴実績があり候補として有望" };
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

function genreFocus(genre) {
  const map = {
    ai: "仕事で使うAI活用の最初の型",
    prog: "手を動かして作れる実感",
    video: "編集作業を前に進める具体操作",
    english: "続けやすい学習順序",
    data: "Excelやデータを実務に結びつける入口",
    marke: "Web集客の全体像と実践への橋渡し",
    biz: "明日使える資料作成・伝え方の型",
    shikaku: "学習計画を迷わず組むための地図",
    kaikei: "会計・経営知識を段階的に固める入口",
    money: "制度と家計管理を落ち着いて理解する入口"
  };
  return map[genre] || "学び直しの次の一歩";
}

function candidateDurationMin(candidate) {
  if (Number.isFinite(Number(candidate.durationMin))) return Number(candidate.durationMin);
  if (Number.isFinite(Number(candidate.durationSeconds))) return Math.max(1, Math.round(Number(candidate.durationSeconds) / 60));
  return 0;
}

function durationCue(minutes) {
  if (!minutes) return "視聴時間に左右されず要点を追いやすい構成";
  if (minutes <= 15) return "短時間で要点を拾いやすい軽めの入口";
  if (minutes <= 40) return "仕事の合間にも見切りやすい標準的な長さ";
  if (minutes <= 90) return "腰を据えて流れを追える体系的な構成";
  return "分割視聴でじっくり理解を深めやすい長尺講義";
}


function stableIndex(seed, length) {
  const text = String(seed || "");
  let hash = 0;
  for (const char of text) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return length ? hash % length : 0;
}

function templateReview(candidate) {
  const level = candidate.level || inferLevel(candidate);
  const focus = genreFocus(candidate.genre);
  const sub = candidate.sub || "このテーマ";
  const title = candidate.title || sub;
  const minutes = candidateDurationMin(candidate);
  const duration = durationCue(minutes);
  const openerLines = [
    `${sub}を学ぶ理由が見えやすく、${focus}として使いやすい。`,
    `${sub}の最初の迷いを減らし、学ぶ順番を作りやすい一本。`,
    `${sub}を仕事や実践に結びつける観点をつかみやすい。`,
    `${sub}の要点を整理し、次に試すことを決めやすい。`
  ];
  const levelLines = {
    初級: [
      "最初に全体像をつかみ、次に試すことを決めやすい構成。",
      "入口で迷いやすいポイントをほどき、学習の順番を作りやすい。",
      "基礎を短時間で見渡し、手を動かす前の準備に向いている。",
      "初学者がつまずきやすい前提を整えながら見進めやすい。"
    ],
    中級: [
      "基礎を一周した後、実践へ進む橋渡しとして見やすい一本。",
      "知識を使う場面まで想像しやすく、実務前の確認にも合う。",
      "断片的な理解を整理し、次の演習へ移りやすくしてくれる。",
      "学んだ内容を具体的な作業へ移す前の復習に向いている。"
    ],
    上級: [
      "基礎の先で実務に近い使い方まで広げたい人に向く一本。",
      "既に学んだ内容を、現場で使う判断や手順へつなげやすい。",
      "応用に進む前の確認として、見る観点を整えやすい。",
      "より実践的な使い分けを考える材料として活用しやすい。"
    ]
  };
  const durationLines = [
    `${duration}なので、ロードマップ上の前後の動画とも組み合わせやすい。`,
    `${duration}で、忙しい日でも学習のリズムを戻しやすい。`,
    `${duration}として、次の学習テーマへ自然につなげやすい。`,
    `${duration}のため、目的を決めて見ると吸収しやすい。`
  ];
  const levelSet = levelLines[level] || levelLines.初級;
  return [
    openerLines[stableIndex(`${title}:${sub}:open`, openerLines.length)],
    levelSet[stableIndex(`${title}:${level}:level`, levelSet.length)],
    durationLines[stableIndex(`${title}:${minutes}:duration`, durationLines.length)]
  ];
}
function stripThinking(text) {
  return String(text || "")
    .replace(/<think>[\s\S]*?<\/think>/gi, "")
    .replace(/```(?:json)?/gi, "")
    .replace(/```/g, "")
    .trim();
}

function normalizeReviewLine(line) {
  return String(line)
    .replace(/^[-・*\d.、)）\s]+/, "")
    .replace(/^"|"$/g, "")
    .replace(/一冊/g, "一本の動画")
    .replace(/入門書/g, "入門講座")
    .replace(/書籍/g, "動画コンテンツ")
    .replace(/本書/g, "この動画")
    .trim();
}

function sanitizeReview(lines, fallback) {
  const hardForbidden = /(公開前|人間|確認する|再生数|回再生|視聴実績|情報商材誘導|必ず稼げ|絶対|爆速|最強|神動画|すぐに?(?:話せる|稼げる|できる|使える)|最短で|誰でも.*なれる)/;
  const cleaned = lines
    .flatMap((line) => String(line).split(/\n/))
    .map(normalizeReviewLine)
    .filter((line) => line && !hardForbidden.test(line))
    .slice(0, 3);
  return cleaned.length >= 3 ? cleaned : fallback;
}

function parseReviewResponse(rawText, fallback) {
  const text = stripThinking(rawText);
  try {
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed)) return sanitizeReview(parsed, fallback);
    if (Array.isArray(parsed.review)) return sanitizeReview(parsed.review, fallback);
    if (typeof parsed.review === "string") return sanitizeReview(parsed.review.split(/\r?\n|。(?=\S)/), fallback);
    if (typeof parsed.text === "string") return sanitizeReview(parsed.text.split(/\r?\n|。(?=\S)/), fallback);
  } catch {
    // Fall through to line-based parsing.
  }
  return sanitizeReview(text.split(/\r?\n|。(?=\S)/), fallback);
}

function describeError(error) {
  const details = [error.message || String(error)];
  if (error.cause?.code) details.push(error.cause.code);
  if (error.cause?.address || error.cause?.port) {
    details.push(`${error.cause.address || "localhost"}:${error.cause.port || 11434}`);
  }
  return details.join(" / ");
}

async function ollamaReview(candidate, model, timeoutMs) {
  const fallback = templateReview(candidate);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  const level = candidate.level || inferLevel(candidate);
  const prompt = `/no_think
Manapickの編集者として、YouTube動画をすすめる3行レビューを日本語で書く。
対象は必ず「動画」。一冊、入門書、書籍、本書など本を指す語は禁止。動画、講座、コンテンツと表現する。
タイトル・ジャンル・サブジャンル・レベルから「なぜこの動画が良いか」を事実ベースで具体化する。
タイトルが煽り調でも、レビューは中立で落ち着いた編集者トーンにする。
動画ごとに異なる自然な表現にし、定型文の使い回しは禁止。
「初心者が迷わず」「網羅」などの決まり文句を多用せず、タイトルから読み取れる具体的特徴を1つは入れる。
各行40字前後、レビュー本文3行だけ。番号、JSON、説明文は禁止。
煽り、誇大表現、収益断定、効果保証は禁止。「すぐ」「最短で」「誰でも〇〇になれる」のような断定は禁止。
内部メモ、公開前確認、再生数への言及は禁止。

タイトル: ${candidate.title}
ジャンル: ${candidate.genre || "未設定"}
サブジャンル: ${candidate.sub || "未設定"}
レベル: ${level}`;

  try {
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "content-type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        model,
        prompt,
        stream: false,
        think: false,
        options: {
          temperature: 0.6,
          top_p: 0.85,
          num_ctx: 2048,
          num_predict: 180
        }
      })
    });
    if (!response.ok) {
      const body = await response.text().catch(() => "");
      throw new Error(`HTTP ${response.status}${body ? `: ${body.slice(0, 160)}` : ""}`);
    }
    const data = await response.json();
    const review = parseReviewResponse(data.response, fallback);
    if (review === fallback) {
      const snippet = stripThinking(data.response).replace(/\s+/g, " ").slice(0, 180);
      throw new Error(`response did not contain three usable public review lines: ${snippet || "empty response"}`);
    }
    return review;
  } catch (error) {
    if (error.name === "AbortError") throw new Error(`timeout after ${timeoutMs}ms`);
    throw new Error(describeError(error));
  } finally {
    clearTimeout(timeout);
  }
}

function scoreCandidate(candidate, minScore, weakTitleTerms) {
  const title = candidate.title || "";
  const riskTerms = Array.from(new Set([...(candidate.riskTerms || []), ...findTitleRiskTerms(title, weakTitleTerms)]));
  let practical = keywordScore(title, ["実務", "使い方", "作り方", "勉強法", "ロードマップ"], ["入門", "基礎", "講座", "解説"]);
  const clarity = keywordScore(title, ["初心者", "超入門", "わかる", "やさしい"], ["入門", "基礎", "解説"]);
  const systematic = keywordScore(title, ["完全", "総集編", "保存版", "ロードマップ", "講座"], ["入門", "基礎", "まとめ"]);
  const freshness = scoreFreshness(candidate);
  const viewing = scoreViewing(candidate.durationMin);
  let reliability = scoreReliability(candidate.viewCount);
  const rights = { score: 5, note: "公式YouTubeリンク/埋め込み前提で扱う" };

  if (riskTerms.length) {
    practical = Math.max(1, practical - 1);
    reliability = { score: Math.max(1, reliability.score - 1), note: `訴求語(${riskTerms.join("/")})が強く、編集確認を優先` };
  }

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
  if (riskTerms.length) cutoffReasons.push(`タイトルリスク語: ${riskTerms.join("/")}`);
  const excellent = scoreTotal >= minScore && cutoffReasons.length === 0;

  return { axisScores, scoreTotal, cutoffReasons, excellent, level: inferLevel(candidate), riskTerms };
}

async function main() {
  const args = parseArgs();
  if (args.help) {
    usage();
    return;
  }
  const inputPath = path.resolve(rootDir, args.in || "data/candidates.json");
  const outPath = path.resolve(rootDir, args.out || "data/drafts.json");
  const config = await readJson(path.resolve(rootDir, args.config || "scripts/pipeline-config.json"), {});
  const minScore = toNumber(args["min-score"], 28);
  const payload = await readJson(inputPath);
  const candidates = unwrapItems(payload);
  const limit = toNumber(args.limit, 0);
  const candidatesToScore = limit > 0 ? candidates.slice(0, limit) : candidates;
  const model = args["ollama-model"] || process.env.OLLAMA_MODEL || "qwen3.6:35b-a3b";
  const useOllama = !args["no-ollama"];
  const ollamaExcellentOnly = Boolean(args["ollama-excellent-only"]);
  const ollamaTimeoutMs = toNumber(args["ollama-timeout"], 120_000);
  const weakTitleTerms = config.weak_title_terms || [];
  const excludeIds = new Set(config.exclude_ytids || []);

  const drafts = [];
  let ollamaTargets = 0;
  let ollamaSuccesses = 0;
  for (const candidate of candidatesToScore) {
    if (excludeIds.has(candidate.ytid)) continue;
    const scored = scoreCandidate(candidate, minScore, weakTitleTerms);
    const draftBase = { ...candidate, level: candidate.level || scored.level };
    let review = templateReview(draftBase);
    let reviewSource = "template";
    const shouldUseOllama = useOllama && (!ollamaExcellentOnly || scored.excellent);
    if (shouldUseOllama) {
      ollamaTargets += 1;
      const logId = candidate.ytid || "unknown";
      try {
        review = await ollamaReview(draftBase, model, ollamaTimeoutMs);
        reviewSource = `ollama:${model}`;
        ollamaSuccesses += 1;
        console.error(`OLLAMA ok ytid=${logId}`);
      } catch (error) {
        const reason = describeError(error);
        console.error(`OLLAMA fail ytid=${logId} reason=${reason}`);
        reviewSource = `template (ollama failed: ${reason})`;
      }
    }

    drafts.push({
      ...draftBase,
      score: scored.scoreTotal,
      axisScores: scored.axisScores,
      cutoffReasons: scored.cutoffReasons,
      riskTerms: scored.riskTerms,
      excellent: scored.excellent,
      accepted: false,
      review,
      reviewSource
    });
  }

  if (useOllama) console.error(`ollama成功 ${ollamaSuccesses} / 対象 ${ollamaTargets}`);
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
