import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const fallbackSiteUrl = "https://manapick.pages.dev";

async function loadLocalEnv() {
  try {
    const raw = await readFile(path.join(repoRoot, ".env.local"), "utf8");
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
      const index = trimmed.indexOf("=");
      const key = trimmed.slice(0, index).trim();
      const value = trimmed.slice(index + 1).trim().replace(/^['"]|['"]$/g, "");
      if (key && process.env[key] === undefined) process.env[key] = value;
    }
  } catch {
    // .env.local is optional; fall back to the public Pages URL.
  }
}

function normalizeSiteUrl(value) {
  const raw = value?.trim() || fallbackSiteUrl;

  try {
    return new URL(raw).origin;
  } catch {
    return fallbackSiteUrl;
  }
}

function absoluteUrl(siteUrl, route) {
  return new URL(route, siteUrl).toString();
}

function displayGenreName(genre) {
  if (genre.key === "biz") return "Office・資料作成";
  return genre.label;
}

await loadLocalEnv();

const siteUrl = normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);
const genres = JSON.parse(await readFile(path.join(repoRoot, "content/genres.json"), "utf8"));
const videos = JSON.parse(await readFile(path.join(repoRoot, "content/videos.json"), "utf8"));
const roadmaps = JSON.parse(await readFile(path.join(repoRoot, "content/roadmaps.json"), "utf8"));
const publishedGenreKeys = new Set(genres.filter((genre) => genre.status === "published").map((genre) => genre.key));
const publishedVideos = videos.filter((video) => publishedGenreKeys.has(video.genre));
const genreCounts = publishedVideos.reduce((counts, video) => {
  counts[video.genre] = (counts[video.genre] || 0) + 1;
  return counts;
}, {});
const subtopicsByGenre = publishedVideos.reduce((topics, video) => {
  topics[video.genre] ||= new Set();
  topics[video.genre].add(video.sub);
  return topics;
}, {});
const publishedGenres = genres.filter((genre) => publishedGenreKeys.has(genre.key) && genreCounts[genre.key] > 0);
const guideRoutesByGenre = {
  ai: "/guide/generative-ai/",
  prog: "/guide/python/",
  video: "/guide/video-editing/",
  english: "/guide/english/",
  data: "/guide/excel-data/",
  marke: "/guide/web-marketing/",
  biz: "/guide/office-skills/",
  shikaku: "/guide/certification/",
  kaikei: "/guide/bookkeeping/",
  money: "/guide/money-basics/"
};

const genreLines = publishedGenres.map((genre) => {
  const subgenres = [...(subtopicsByGenre[genre.key] || [])].sort();
  const subgenreText = subgenres.length > 0 ? `: ${subgenres.join(" / ")}` : "";
  return `- ${displayGenreName(genre)}（${genreCounts[genre.key]}本）${subgenreText}`;
});

function videoPath(ytid) {
  return `/video/${ytid}/`;
}

function topVideosForGenre(genreKey, limit = 5) {
  return publishedVideos
    .filter((video) => video.genre === genreKey)
    .sort((a, b) => (b.score ?? -1) - (a.score ?? -1) || (b.viewCount ?? 0) - (a.viewCount ?? 0))
    .slice(0, limit);
}

function videoSummaryLine(video, index) {
  const score = video.score === null ? "スコア準備中" : `${video.score}/35`;
  const published = video.publishedAt ? ` / publishedAt=${video.publishedAt}` : "";
  return `${index + 1}. ${video.title}（${displayGenreName(genres.find((genre) => genre.key === video.genre) || { key: video.genre, label: video.genre })} / ${video.sub} / ${score} / ${video.minutes}分${published}） ${absoluteUrl(siteUrl, videoPath(video.ytid))}`;
}

function roadmapLinesForGenre(genreKey) {
  const roadmap = roadmaps.find((item) => item.genre === genreKey);
  if (!roadmap) return ["- ロードマップ: 準備中"];
  return [
    `- ロードマップ: ${roadmap.title}`,
    ...roadmap.steps.map((step) => {
      const titles = step.videos
        .map((ytid) => videos.find((video) => video.ytid === ytid)?.title)
        .filter(Boolean)
        .join(" / ");
      return `  - ${step.label}（${step.level}）: ${step.goal}${titles ? `｜動画: ${titles}` : ""}`;
    })
  ];
}

function genreIndexLines() {
  return publishedGenres.flatMap((genre) => {
    const guideRoute = guideRoutesByGenre[genre.key];
    const subgenres = [...(subtopicsByGenre[genre.key] || [])].sort();
    return [
      `### ${displayGenreName(genre)}（${genreCounts[genre.key]}本）`,
      `- ジャンルURL: ${absoluteUrl(siteUrl, `/genre/${genre.key}/`)}`,
      guideRoute ? `- ガイドURL: ${absoluteUrl(siteUrl, guideRoute)}` : "- ガイドURL: 準備中",
      `- 主なトピック: ${subgenres.join(" / ") || "未設定"}`,
      ...roadmapLinesForGenre(genre.key),
      "- 代表動画:",
      ...topVideosForGenre(genre.key, 5).map(videoSummaryLine),
      ""
    ];
  });
}

const queryIntentLines = [
  ["YouTube学習動画おすすめ", "/youtube-learning/"],
  ["動画 勉強 無料", "/youtube-learning/"],
  ["リスキリング 何から始める", "/youtube-learning/#youtube-steps-title"],
  ["YouTubeサムネイルの作り方", "/genre/video/%E3%83%87%E3%82%B6%E3%82%A4%E3%83%B3/"],
  ["Pythonは難しい", "/guide/python/"],
  ["エクセル統計の使い方", "/guide/excel-data/"],
  ["Copilot活用事例", "/genre/ai/Copilot/"],
  ["AIプロンプトのコツ", "/genre/ai/%E3%83%97%E3%83%AD%E3%83%B3%E3%83%97%E3%83%88/"],
  ["社労士試験 独学", "/genre/shikaku/%E7%A4%BE%E5%8A%B4%E5%A3%AB/"],
  ["マーケティング YouTube おすすめ", "/guide/web-marketing/"],
  ["Canva 初心者", "/genre/marke/SNS/"]
].map(([label, route]) => `- ${label}: ${absoluteUrl(siteUrl, route)}`);

const guideLines = [
  ["生成AIロードマップ記事", "/guide/generative-ai/"],
  ["Pythonロードマップ記事", "/guide/python/"],
  ["動画編集ロードマップ記事", "/guide/video-editing/"],
  ["英語ロードマップ記事", "/guide/english/"],
  ["Excelデータ分析ロードマップ記事", "/guide/excel-data/"],
  ["Webマーケティングロードマップ記事", "/guide/web-marketing/"],
  ["Office・資料作成ロードマップ記事", "/guide/office-skills/"],
  ["資格勉強ロードマップ記事", "/guide/certification/"],
  ["会計資格ロードマップ記事", "/guide/bookkeeping/"],
  ["お金・投資ロードマップ記事", "/guide/money-basics/"]
].map(([label, route]) => `- ${label}: ${absoluteUrl(siteUrl, route)}`);

const lines = [
  "# Manapick",
  "",
  "Manapickは、社会人の学び直し・リスキリングに役立つYouTube学習動画を、独自レビューとManapickスコアで整理するキュレーションサイトです。",
  "動画は公式YouTubeへのリンクまたは公式埋め込みを前提に紹介し、ダウンロードや再配布は扱いません。",
  "",
  `## 公開中の${publishedGenres.length}ジャンル`,
  ...genreLines,
  "",
  "## 採点方法",
  "- Manapickスコアは7軸×5点=35点満点です。",
  "- 評価軸は実用性、正確性・鮮度、分かりやすさ、体系性、信頼性、視聴体験、規約・権利です。",
  "- 誤情報、釣り、情報商材誘導、過度な成果保証を含む動画は不採用にします。",
  "- 掲載している全動画を運営者が視聴確認し、7軸35点で採点しています。",
  "",
  "## ガイド記事",
  ...guideLines,
  "",
  "## ジャンル別AEOインデックス",
  ...genreIndexLines(),
  "## 検索意図別の主要導線",
  ...queryIntentLines,
  "",
  "## よくある質問",
  "- Q. Manapickは無料ですか？ A. 無料で閲覧できます。紹介している動画はYouTube公式動画で、会員登録は不要です。",
  "- Q. Manapickスコアとは？ A. 実用性、正確性・鮮度、分かりやすさ、体系性、信頼性、視聴体験、規約・権利の7軸×5点で採点した35点満点の評価です。",
  "- Q. どの順番で見ればいいですか？ A. 各ジャンルのロードマップにSTEP1〜STEP3の見る順をまとめています。迷う場合はトップの今日の1本やジャンル別の入口から始められます。",
  "- Q. AIツール自体を比較したい場合は？ A. 公式AI版のmanapick AIで、料金・無料枠・使い方を7軸で確認できます。",
  "- Q. 広告やアフィリエイトで順位は変わりますか？ A. 紹介料で掲載順位を操作せず、Manapick独自基準と視聴確認を優先します。",
  "",
  "## 主要URL",
  `- トップ: ${absoluteUrl(siteUrl, "/")}`,
  `- YouTube学習動画おすすめ: ${absoluteUrl(siteUrl, "/youtube-learning/")}`,
  `- ランキング: ${absoluteUrl(siteUrl, "/ranking/")}`,
  `- 最近追加・更新した動画: ${absoluteUrl(siteUrl, "/new/")}`,
  `- よくある質問: ${absoluteUrl(siteUrl, "/faq/")}`,
  `- 用語集: ${absoluteUrl(siteUrl, "/glossary/")}`,
  `- 採点方法: ${absoluteUrl(siteUrl, "/about-score/")}`,
  `- お問い合わせ: ${absoluteUrl(siteUrl, "/contact/")}`,
  `- 運営者情報: ${absoluteUrl(siteUrl, "/operator/")}`,
  `- 免責事項: ${absoluteUrl(siteUrl, "/disclaimer/")}`,
  `- プライバシーポリシー: ${absoluteUrl(siteUrl, "/privacy/")}`,
  `- サイトマップ: ${absoluteUrl(siteUrl, "/sitemap.xml")}`,
  "",
  "## クローラー向け補足",
  "Manapickの本文、見出し、動画タイトル、レビューはHTMLテキストとして提供しています。検索・絞り込みUIは補助機能であり、主要な動画詳細ページは静的URLで参照できます。",
  ""
];

await mkdir(path.join(repoRoot, "public"), { recursive: true });
await writeFile(path.join(repoRoot, "public/llms.txt"), lines.join("\n"));
