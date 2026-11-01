// content/inbound-redirects.json から public/_redirects を生成する。
// Cloudflare Pages の _redirects は「同じパスに実ファイルがあっても常に優先」されるため、
// ビルドで生成されるページ（掲載中の動画・3本以上のサブカテゴリ）と重なるルールは出力しない。
// Cloudflare 側のビルドは `npx next build`（prebuild 非実行）なので、生成物はコミットして使う。
// 使い方: node scripts/generate-redirects.mjs [--check]
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const MIN_SUB_PAGE_VIDEOS = 3; // lib/sub-pages.ts と同じ基準
const readJson = async (rel) => JSON.parse(await readFile(path.join(repoRoot, rel), "utf8"));

const [rules, videos, genres] = await Promise.all([
  readJson("content/inbound-redirects.json"),
  readJson("content/videos.json"),
  readJson("content/genres.json")
]);

const published = new Set(genres.filter((g) => g.status === "published").map((g) => g.key));
const videoIds = new Set(videos.map((v) => v.ytid));
const subCounts = new Map();
for (const v of videos) {
  if (!published.has(v.genre)) continue;
  const id = `${v.genre}\t${v.sub}`;
  subCounts.set(id, (subCounts.get(id) ?? 0) + 1);
}

function generatedByBuild(p) {
  const video = p.match(/^\/video\/([^/]+)\/$/);
  if (video) return videoIds.has(video[1]);
  const sub = p.match(/^\/genre\/([^/]+)\/([^/]+)\/$/);
  if (sub) return published.has(sub[1]) && (subCounts.get(`${sub[1]}\t${sub[2]}`) ?? 0) >= MIN_SUB_PAGE_VIDEOS;
  const genre = p.match(/^\/genre\/([^/]+)\/$/);
  if (genre) return published.has(genre[1]);
  return p === "/";
}

const errors = [];
const lines = [
  "# 自動生成: node scripts/generate-redirects.mjs（元データ: content/inbound-redirects.json）。手で編集しない。",
  "# 姉妹サイト等から参照されるが、Manapick側で生成されないURLの受け皿。"
];
const seen = new Set();
for (const rule of rules) {
  const { from, to } = rule;
  if (!/^\/.*\/$/.test(from) || !/^\/.*\/$/.test(to)) errors.push(`末尾スラッシュ付きの絶対パスが必要: ${from} -> ${to}`);
  if (!generatedByBuild(to)) errors.push(`転送先がビルドで生成されない: ${to}`);
  if (generatedByBuild(from)) {
    console.warn(`[redirects] skip (ページが生成されるため): ${from}`);
    continue;
  }
  const variants = new Set([from, encodeURI(from)]);
  for (const f of variants) {
    for (const src of [f, f.slice(0, -1)]) {
      if (seen.has(src)) continue;
      seen.add(src);
      lines.push(`${src} ${to} 301`);
    }
  }
}
if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

const output = lines.join("\n") + "\n";
const target = path.join(repoRoot, "public/_redirects");
if (process.argv.includes("--check")) {
  const current = await readFile(target, "utf8").catch(() => "");
  if (current !== output) {
    console.error("[redirects] public/_redirects が最新ではありません。npm run redirects:generate を実行してください。");
    process.exit(1);
  }
  console.log(`[redirects] OK (${lines.length - 2} rules)`);
} else {
  await writeFile(target, output);
  console.log(`[redirects] wrote ${lines.length - 2} rules to public/_redirects`);
}
