import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const fallbackSiteUrl = "https://manapick.pages.dev";

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

const siteUrl = normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);
const genres = JSON.parse(await readFile(path.join(repoRoot, "content/genres.json"), "utf8"));
const publishedGenres = genres.filter((genre) => genre.status === "published");

const genreLines = publishedGenres.map((genre) => {
  const subgenres = genre.subgenres.length > 0 ? `: ${genre.subgenres.join(" / ")}` : "";
  return `- ${displayGenreName(genre)}${subgenres}`;
});

const lines = [
  "# Manapick",
  "",
  "Manapickは、社会人の学び直し・リスキリングに役立つYouTube学習動画を、独自レビューとManapickスコアで整理するキュレーションサイトです。",
  "動画は公式YouTubeへのリンクまたは公式埋め込みを前提に紹介し、ダウンロードや再配布は扱いません。",
  "",
  "## 公開中の8ジャンル",
  ...genreLines,
  "",
  "## 採点方法",
  "- Manapickスコアは7軸×5点=35点満点です。",
  "- 評価軸は実用性、正確性・鮮度、分かりやすさ、体系性、信頼性、視聴体験、規約・権利です。",
  "- 誤情報、釣り、情報商材誘導、過度な成果保証を含む動画は不採用にします。",
  "- スコアには確認済と暫定があり、暫定動画は順次、人の視聴確認で確定します。",
  "",
  "## ガイド記事",
  `- 生成AIロードマップ記事: ${absoluteUrl(siteUrl, "/guide/generative-ai/")}`,
  `- Pythonロードマップ記事: ${absoluteUrl(siteUrl, "/guide/python/")}`,
  `- Excelデータ分析ロードマップ記事: ${absoluteUrl(siteUrl, "/guide/excel-data/")}`,
  `- 英語ロードマップ記事: ${absoluteUrl(siteUrl, "/guide/english/")}`,
  "",
  "## 主要URL",
  `- トップ: ${absoluteUrl(siteUrl, "/")}`,
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
