import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

async function readJson(relativePath) {
  return JSON.parse(await readFile(path.join(repoRoot, relativePath), "utf8"));
}

const [videos, genres, roadmaps, newsItems] = await Promise.all([
  readJson("content/videos.json"),
  readJson("content/genres.json"),
  readJson("content/roadmaps.json"),
  readJson("content/news.json")
]);

const errors = [];
const warnings = [];
const strictFreshness = process.argv.includes("--strict-freshness");
const ids = new Set();
const genreKeys = new Set(genres.map((genre) => genre.key));
const dayMs = 24 * 60 * 60 * 1000;
const now = Date.now();
const newestByGenre = new Map();
let newestPublishedAt = 0;
let recent90Days = 0;

for (const [index, video] of videos.entries()) {
  const label = video.ytid || `index:${index}`;
  if (!video.ytid || !video.title || !video.genre || !video.url) {
    errors.push(`${label}: required video fields are missing`);
  }
  if (ids.has(video.ytid)) errors.push(`${label}: duplicate ytid`);
  ids.add(video.ytid);
  if (!genreKeys.has(video.genre)) errors.push(`${label}: unknown genre ${video.genre}`);
  if (video.scoreStatus !== "confirmed") errors.push(`${label}: scoreStatus must be confirmed`);
  if (!Number.isFinite(video.score) || video.score < 0 || video.score > 35) {
    errors.push(`${label}: score must be a number from 0 to 35`);
  }
  if (!Array.isArray(video.review) || video.review.length < 3 || video.review.some((line) => !String(line).trim())) {
    errors.push(`${label}: three non-empty review lines are required`);
  }
  if (!video.publishedAt || Number.isNaN(Date.parse(video.publishedAt))) {
    errors.push(`${label}: valid publishedAt is required`);
  } else {
    const publishedAt = Date.parse(video.publishedAt);
    if (publishedAt > now + dayMs) errors.push(`${label}: publishedAt is in the future`);
    newestPublishedAt = Math.max(newestPublishedAt, publishedAt);
    if (now - publishedAt <= 90 * dayMs) recent90Days += 1;
    newestByGenre.set(video.genre, Math.max(newestByGenre.get(video.genre) || 0, publishedAt));
  }
  if (!Array.isArray(video.axisScores)) {
    errors.push(`${label}: axisScores must be an array`);
  } else if (video.axisScores.length === 0) {
    warnings.push(`${label}: stored axis breakdown is unavailable`);
  } else if (video.axisScores.length !== 7) {
    errors.push(`${label}: axisScores must contain seven axes when present`);
  } else {
    const sum = video.axisScores.reduce((total, axis) => total + Number(axis.score || 0), 0);
    if (sum !== video.score) errors.push(`${label}: axis score sum ${sum} does not match total ${video.score}`);
  }
}

for (const roadmap of roadmaps) {
  if (!genreKeys.has(roadmap.genre)) errors.push(`roadmap:${roadmap.genre}: unknown genre`);
  for (const step of roadmap.steps || []) {
    for (const ytid of step.videos || []) {
      if (!ids.has(ytid)) errors.push(`roadmap:${roadmap.genre}: missing video ${ytid}`);
    }
  }
}

const publishedGenres = genres.filter((genre) => genre.status === "published");
for (const genre of publishedGenres) {
  if (!videos.some((video) => video.genre === genre.key)) {
    errors.push(`genre:${genre.key}: published genre has no videos`);
  }
  if (!roadmaps.some((roadmap) => roadmap.genre === genre.key)) {
    errors.push(`genre:${genre.key}: published genre has no roadmap`);
  }
}

// 軸コメントの汎用化チェック（2026-11-04 横断評価 Phase 0-1）。
// 同じ（軸・点数・コメント）が多数の動画に出現するコメントは、動画固有の
// 観察文とは言えない。件数を警告として可視化し、固有化の進捗を測れるようにする。
const GENERIC_NOTE_THRESHOLD = 10;
const noteKeyCounts = new Map();
for (const video of videos) {
  for (const axis of video.axisScores || []) {
    // 「規約・権利」の定型文は採点コメントではなく共通注記に近いため、汎用判定から除く。
    if (axis.axis === "規約・権利") continue;
    const key = `${axis.axis}|${axis.score}|${String(axis.note || "").trim().replace(/。$/, "")}`;
    noteKeyCounts.set(key, (noteKeyCounts.get(key) || 0) + 1);
  }
}
const genericKeys = [...noteKeyCounts.entries()].filter(([, count]) => count >= GENERIC_NOTE_THRESHOLD);
if (genericKeys.length > 0) {
  const genericInstances = genericKeys.reduce((total, [, count]) => total + count, 0);
  const totalNotes = [...noteKeyCounts.values()].reduce((total, count) => total + count, 0);
  const affectedIds = new Set();
  for (const video of videos) {
    const hasGeneric = (video.axisScores || []).some((axis) => {
      if (axis.axis === "規約・権利") return false;
      const key = `${axis.axis}|${axis.score}|${String(axis.note || "").trim().replace(/。$/, "")}`;
      return (noteKeyCounts.get(key) || 0) >= GENERIC_NOTE_THRESHOLD;
    });
    if (hasGeneric) affectedIds.add(video.ytid);
  }
  warnings.push(
    `axis-notes: generic notes (same axis/score/text in >=${GENERIC_NOTE_THRESHOLD} videos): keys=${genericKeys.length} instances=${genericInstances}/${totalNotes} videos-affected=${affectedIds.size}/${videos.length}`
  );
  const topGeneric = genericKeys.sort((a, b) => b[1] - a[1]).slice(0, 5);
  for (const [key, count] of topGeneric) {
    warnings.push(`axis-notes: x${count} ${key.split("|").slice(0, 2).join(" ")} ${key.split("|")[2]?.slice(0, 40) ?? ""}`);
  }
}

// 固有化の後退検出（2026-11-04 第2ラウンド）。
// 汎用プール（同一キー >=10本）に属するコメントを1つも持たない動画の数を数え、
// 実績値を下限として固定する。固有化済み動画のコメントが汎用文へ差し戻されたり、
// 固有化済み動画が削除されたりすると、この数が減ってエラーになる。
// 固有化がさらに進んだら、この下限を引き上げること（引き下げは後退の隠蔽になる）。
const FULLY_UNIQUE_FLOOR = 132; // 2026-11-05 実測: 軸内訳を持ち汎用コメントが無い動画は132本（軸内訳なしの動画は数えない）
const genericKeySet = new Set(genericKeys.map(([key]) => key));
let fullyUniqueVideos = 0;
for (const video of videos) {
  const axes = (video.axisScores || []).filter((axis) => axis.axis !== "規約・権利");
  if (axes.length === 0) continue;
  const hasGeneric = axes.some((axis) => {
    const key = `${axis.axis}|${axis.score}|${String(axis.note || "").trim().replace(/。$/, "")}`;
    return genericKeySet.has(key);
  });
  if (!hasGeneric) fullyUniqueVideos += 1;
}
if (fullyUniqueVideos < FULLY_UNIQUE_FLOOR) {
  errors.push(
    `axis-notes: fully-unique videos regressed: ${fullyUniqueVideos} < floor ${FULLY_UNIQUE_FLOOR} (generic-note individualization must not regress)`
  );
}

// 定型句フラグメントの混入チェック（同ラウンド、コンテンツ方法論レビュー）。
// 汎用プール外（＝固有のはず）のコメントに定型断片が残っていると、固有化の
// 見かけだけが進む。件数と実例を警告する。
const TEMPLATE_FRAGMENTS = [
  "期待できる",
  "可能性が高い",
  "要確認",
  "タイトル上は",
  "扱いやすい内容",
  "つなげやすい",
  "確認しやすい",
  "追いやすい構成",
  "見切りやすい長さ"
];
const fragmentHits = [];
for (const video of videos) {
  for (const axis of video.axisScores || []) {
    if (axis.axis === "規約・権利") continue;
    const note = String(axis.note || "");
    const key = `${axis.axis}|${axis.score}|${note.trim().replace(/。$/, "")}`;
    if (genericKeySet.has(key)) continue;
    const hit = TEMPLATE_FRAGMENTS.find((fragment) => note.includes(fragment));
    if (hit) fragmentHits.push(`${video.ytid}/${axis.axis}: 「${hit}」 ${note.slice(0, 40)}`);
  }
}
if (fragmentHits.length > 0) {
  warnings.push(`axis-notes: template fragments inside non-generic notes: ${fragmentHits.length}`);
  for (const hit of fragmentHits.slice(0, 5)) warnings.push(`axis-notes: ${hit}`);
}

// ニュースの鮮度警告（同ラウンド P7）。学びニュースは鮮度が価値そのものなので、
// 最新記事の日齢が開いたら警告する（動画側の --strict-freshness と同じ考え方）。
const newestNewsAt = newsItems.reduce((max, item) => {
  const t = Date.parse(item.publishedAt || "");
  return Number.isNaN(t) ? max : Math.max(max, t);
}, 0);
if (newestNewsAt > 0) {
  const newsAgeDays = Math.floor((now - newestNewsAt) / dayMs);
  if (newsAgeDays > 30) {
    warnings.push(`news: newest article is ${newsAgeDays} days old (limit: 30)`);
  }
}

const newestAgeDays = newestPublishedAt ? Math.floor((now - newestPublishedAt) / dayMs) : Infinity;
if (newestAgeDays > 60) {
  const message = `freshness: newest published video is ${newestAgeDays} days old (limit: 60)`;
  (strictFreshness ? errors : warnings).push(message);
}
for (const genre of publishedGenres) {
  const newest = newestByGenre.get(genre.key) || 0;
  const ageDays = newest ? Math.floor((now - newest) / dayMs) : Infinity;
  if (ageDays > 180) {
    const message = `genre:${genre.key}: newest published video is ${ageDays} days old`;
    (strictFreshness ? errors : warnings).push(message);
  }
}

if (warnings.length > 0) {
  console.warn(`[content:audit] warnings=${warnings.length}`);
  for (const warning of warnings.slice(0, 20)) console.warn(`- ${warning}`);
}

if (errors.length > 0) {
  console.error(`[content:audit] failed errors=${errors.length}`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(
  `[content:audit] ok videos=${videos.length} genres=${publishedGenres.length} roadmaps=${roadmaps.length} recent90=${recent90Days} newestAgeDays=${newestAgeDays} warnings=${warnings.length} strictFreshness=${strictFreshness}`
);
