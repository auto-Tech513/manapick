import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const items = JSON.parse(await readFile(path.join(repoRoot, "content/news.json"), "utf8"));
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://manapick.app").replace(/\/$/, "");

function xml(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&apos;");
}

const entries = items
  .slice()
  .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
  .map((item) => {
    const url = `${siteUrl}/news/${item.id}/`;
    return [
      "    <item>",
      `      <title>${xml(item.headline)}</title>`,
      `      <link>${xml(url)}</link>`,
      `      <guid isPermaLink="true">${xml(url)}</guid>`,
      `      <description>${xml(item.description)}</description>`,
      `      <category>${xml(item.categoryLabel)}</category>`,
      `      <pubDate>${new Date(`${item.publishedAt}T00:00:00+09:00`).toUTCString()}</pubDate>`,
      "    </item>"
    ].join("\n");
  }).join("\n");

const latestPublishedAt = items
  .map((item) => item.publishedAt)
  .sort((a, b) => b.localeCompare(a))[0];
const lastBuildDate = latestPublishedAt
  ? new Date(`${latestPublishedAt}T00:00:00+09:00`).toUTCString()
  : new Date(0).toUTCString();

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Manapick 学びニュース</title>
    <link>${siteUrl}/news/</link>
    <description>公式発表を、学びと仕事に使える形へ整理します。</description>
    <language>ja</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
${entries}
  </channel>
</rss>
`;

await mkdir(path.join(repoRoot, "public"), { recursive: true });
await writeFile(path.join(repoRoot, "public/news-feed.xml"), rss, "utf8");
console.log(`news feed: ${items.length} items`);
