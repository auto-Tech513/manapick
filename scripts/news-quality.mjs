import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const newsFile = path.join(repoRoot, "content/news.json");
const officialHosts = new Set([
  "workspaceupdates.googleblog.com",
  "help.openai.com",
  "openai.com",
  "blog.google",
  "developers.google.com",
  "support.google.com",
  "learn.microsoft.com",
  "techcommunity.microsoft.com"
]);
const overclaimPatterns = [
  /誰でも必ず/,
  /絶対に(合格|成功|稼げる)/,
  /これだけで(合格|完全|完璧)/,
  /世界一/,
  /最強の方法/
];

export function articleBodyText(item) {
  return [
    item.whyCare,
    ...(item.facts || []),
    ...(item.sections || []).flatMap((section) => [
      section.heading,
      ...(section.paragraphs || []),
      ...(section.bullets || [])
    ])
  ].join("").replace(/\s/g, "");
}

// 既定の判定日はJST。toISOString()は常にUTCを返すため、CI(UTC)がJST 06:23に走ると
// UTCではまだ前日となり、JST当日付の記事が "future publication date" で誤判定される。
const jstToday = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Tokyo" }).format(new Date());

export function validateNewsItems(items, { today = jstToday() } = {}) {
  const errors = [];
  const ids = new Set();
  const headlines = new Set();

  if (!Array.isArray(items) || items.length === 0) return ["content/news.json must contain at least one article"];

  for (const [index, item] of items.entries()) {
    const label = item?.id || `index ${index}`;
    const requiredStrings = [
      "id", "headline", "description", "category", "categoryLabel", "publishedAt",
      "lastChecked", "sourceName", "sourceUrl", "whyCare"
    ];
    for (const field of requiredStrings) {
      if (typeof item?.[field] !== "string" || !item[field].trim()) errors.push(`${label}: ${field} is required`);
    }

    if (!/^[a-z0-9-]+$/.test(item?.id || "")) errors.push(`${label}: id must be lowercase kebab-case`);
    if (ids.has(item?.id)) errors.push(`${label}: duplicate id`);
    ids.add(item?.id);
    if (headlines.has(item?.headline)) errors.push(`${label}: duplicate headline`);
    headlines.add(item?.headline);

    if (!/^\d{4}-\d{2}-\d{2}$/.test(item?.publishedAt || "")) errors.push(`${label}: invalid publishedAt`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(item?.lastChecked || "")) errors.push(`${label}: invalid lastChecked`);
    if (item?.publishedAt > today) errors.push(`${label}: future publication date is not allowed`);
    if (item?.lastChecked < item?.publishedAt) errors.push(`${label}: lastChecked is earlier than publishedAt`);

    try {
      const source = new URL(item.sourceUrl);
      if (source.protocol !== "https:") errors.push(`${label}: sourceUrl must use https`);
      if (!officialHosts.has(source.hostname)) errors.push(`${label}: source host is not on the official allowlist (${source.hostname})`);
    } catch {
      errors.push(`${label}: sourceUrl is invalid`);
    }

    if ((item?.description || "").length < 70 || (item?.description || "").length > 180) {
      errors.push(`${label}: description must be 70-180 characters`);
    }
    if (!Array.isArray(item?.facts) || item.facts.length < 3) errors.push(`${label}: at least 3 verified facts are required`);
    if (!Array.isArray(item?.sections) || item.sections.length < 4) errors.push(`${label}: at least 4 sections are required`);
    const paragraphCount = (item?.sections || []).reduce((sum, section) => sum + (section.paragraphs?.length || 0), 0);
    if (paragraphCount < 7) errors.push(`${label}: at least 7 explanatory paragraphs are required`);
    if (articleBodyText(item).length < 1000) errors.push(`${label}: article body is shorter than 1,000 Japanese characters`);
    if (!Array.isArray(item?.relatedLinks) || item.relatedLinks.length < 2) errors.push(`${label}: at least 2 related links are required`);

    const fullText = JSON.stringify(item);
    for (const pattern of overclaimPatterns) {
      if (pattern.test(fullText)) errors.push(`${label}: overclaim detected (${pattern})`);
    }
  }

  return errors;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const items = JSON.parse(await readFile(newsFile, "utf8"));
  const errors = validateNewsItems(items);
  if (errors.length) {
    console.error(errors.map((error) => `- ${error}`).join("\n"));
    process.exit(1);
  }
  const shortest = Math.min(...items.map((item) => articleBodyText(item).length));
  console.log(`news quality: ${items.length} articles passed; shortest body ${shortest} characters`);
}
