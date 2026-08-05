import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const fallbackSiteUrl = "https://manapick.app";

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
    // .env.local is optional; fall back to the public custom domain.
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
const news = JSON.parse(await readFile(path.join(repoRoot, "content/news.json"), "utf8"));
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
  ["YouTubeサムネイルの作り方", "/learn/youtube-thumbnail/"],
  ["Pythonは難しい", "/learn/python-hard/"],
  ["Python入門本の選び方", "/learn/python-beginner-book/"],
  ["エクセル統計の使い方", "/learn/excel-statistics/"],
  ["Copilot活用事例", "/learn/copilot-use-cases/"],
  ["AIプロンプトのコツ", "/learn/ai-prompt-tips/"],
  ["社労士 YouTube おすすめ・1年学習計画", "/learn/sharoshi-1year/"],
  ["マーケティング YouTube おすすめ", "/learn/web-marketing-youtube/"],
  ["Power BIの使い方", "/learn/power-bi/"],
  ["資産運用を無料で勉強", "/learn/money-study-free/"],
  ["FP3級 過去問", "/learn/fp3-past-questions/"],
  ["ビジネス会計検定3級の勉強時間", "/learn/business-accounting-3-study-time/"],
  ["秘書検定2級の日程と勉強法", "/learn/secretary-test-schedule/"],
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

const newsLines = news
  .slice()
  .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt) || b.id.localeCompare(a.id))
  .slice(0, 10)
  .map((item) => `- ${item.publishedAt} ${item.headline}: ${absoluteUrl(siteUrl, `/news/${item.id}/`)} | 出典 ${item.sourceName}`);

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
  `- 学習ロードマップ一覧: ${absoluteUrl(siteUrl, "/guide/")}`,
  ...guideLines,
  "",
  "## 学びニュース",
  `- 一覧: ${absoluteUrl(siteUrl, "/news/")}`,
  "- Google Workspaceや生成AIなど、社会人の学びと仕事に関係する公式一次情報を確認し、変更点と実務への影響を整理します。",
  ...newsLines,
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
  "- Q. 関連する資格の要件や費用を比較したい場合は？ A. manapick licenseで、受験要件・費用・申込方法を公式情報から確認できます。",
  "- Q. 学んだ先の仕事内容を調べたい場合は？ A. manapick careerで、仕事内容・必要スキル・注意点・学ぶ順番を公式情報から確認できます。",
  "- Q. 広告やアフィリエイトで順位は変わりますか？ A. 紹介料で掲載順位を操作せず、Manapick独自基準と視聴確認を優先します。",
  "",
  "## 主要URL",
  `- トップ: ${absoluteUrl(siteUrl, "/")}`,
  `- YouTube学習動画おすすめ: ${absoluteUrl(siteUrl, "/youtube-learning/")}`,
  `- YouTube学習動画${videos.length}本の独自集計: ${absoluteUrl(siteUrl, "/research/youtube-learning-data/")}`,
  `- 7日学習プラン: ${absoluteUrl(siteUrl, "/study-plan/")}`,
  `- Manapick Network（学ぶ・AI・資格・仕事）: ${absoluteUrl(siteUrl, "/network/")}`,
  `- 学習ロードマップ一覧: ${absoluteUrl(siteUrl, "/guide/")}`,
  `- ランキング: ${absoluteUrl(siteUrl, "/ranking/")}`,
  `- 最近追加・更新した動画: ${absoluteUrl(siteUrl, "/new/")}`,
  `- 学びニュース: ${absoluteUrl(siteUrl, "/news/")}`,
  `- 学びニュースRSS: ${absoluteUrl(siteUrl, "/news-feed.xml")}`,
  `- よくある質問: ${absoluteUrl(siteUrl, "/faq/")}`,
  `- 用語集: ${absoluteUrl(siteUrl, "/glossary/")}`,
  `- 採点方法: ${absoluteUrl(siteUrl, "/about-score/")}`,
  `- お問い合わせ: ${absoluteUrl(siteUrl, "/contact/")}`,
  `- 運営者情報: ${absoluteUrl(siteUrl, "/operator/")}`,
  `- 免責事項: ${absoluteUrl(siteUrl, "/disclaimer/")}`,
  `- プライバシーポリシー: ${absoluteUrl(siteUrl, "/privacy/")}`,
  `- サイトマップ: ${absoluteUrl(siteUrl, "/sitemap.xml")}`,
  "- 姉妹サイト（AIツール比較）: https://ai.manapick.app/",
  "- 姉妹サイト（資格・検定比較）: https://license.manapick.app/",
  "- 姉妹サイト（職業情報）: https://career.manapick.app/",
  "",
  "## クローラー向け補足",
  "Manapickの本文、見出し、動画タイトル、レビューはHTMLテキストとして提供しています。検索・絞り込みUIは補助機能であり、主要な動画詳細ページは静的URLで参照できます。",
  ""
];

await mkdir(path.join(repoRoot, "public"), { recursive: true });
await writeFile(path.join(repoRoot, "public/llms.txt"), lines.join("\n"));
