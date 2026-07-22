import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputPath = path.join(repoRoot, "data/news-watch-candidates.json");

function decodeEntities(value) {
  return String(value)
    .replaceAll("&amp;", "&").replaceAll("&lt;", "<").replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"').replaceAll("&#39;", "'").replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)));
}

function stripHtml(value) {
  return decodeEntities(String(value)
    .replace(/<!\[CDATA\[/g, "")
    .replace(/\]\]>/g, "")
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

function tag(block, name) {
  return block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)<\\/${name}>`, "i"))?.[1] || "";
}

function dateOnly(value) {
  const raw = stripHtml(value);
  const timestamp = Date.parse(raw);
  return Number.isFinite(timestamp) ? new Date(timestamp).toISOString().slice(0, 10) : raw.slice(0, 10);
}

export function normalizeSourceUrl(value) {
  const url = new URL(String(value).split("#")[0]);
  url.protocol = "https:";
  url.pathname = url.pathname.replace(/\/+$/, "") || "/";
  url.searchParams.sort();
  return url.toString();
}

export function isAllowedBySource(candidate, source) {
  return !(source.excludeTitlePatterns || []).some((pattern) => new RegExp(pattern, "i").test(candidate.title));
}

export function parseAtom(xml, source) {
  return [...xml.matchAll(/<entry\b[^>]*>([\s\S]*?)<\/entry>/gi)].map((match) => {
    const entry = match[1];
    const rawLink = entry.match(/<link\b[^>]*rel=["']alternate["'][^>]*href=["']([^"']+)["']/i)?.[1]
      || entry.match(/<link\b[^>]*href=["']([^"']+)["']/i)?.[1]
      || "";
    const sourceText = stripHtml(tag(entry, "content") || tag(entry, "summary"));
    return {
      sourceId: source.id,
      sourceName: source.name,
      sourceUrl: decodeEntities(rawLink),
      title: stripHtml(tag(entry, "title")),
      publishedAt: (stripHtml(tag(entry, "published")) || stripHtml(tag(entry, "updated"))).slice(0, 10),
      sourceText: sourceText.slice(0, 18000),
      autoPublish: Boolean(source.autoPublish)
    };
  });
}

export function parseRss(xml, source) {
  return [...xml.matchAll(/<item\b[^>]*>([\s\S]*?)<\/item>/gi)].map((match) => {
    const item = match[1];
    const sourceText = stripHtml(tag(item, "content:encoded") || tag(item, "description"));
    return {
      sourceId: source.id,
      sourceName: source.name,
      sourceUrl: stripHtml(tag(item, "link")),
      title: stripHtml(tag(item, "title")),
      publishedAt: dateOnly(tag(item, "pubDate") || tag(item, "dc:date")),
      sourceText: sourceText.slice(0, 18000),
      autoPublish: Boolean(source.autoPublish)
    };
  });
}

async function main() {
  const config = JSON.parse(await readFile(path.join(repoRoot, "content/news-watch.json"), "utf8"));
  const published = JSON.parse(await readFile(path.join(repoRoot, "content/news.json"), "utf8"));
  const publishedUrls = new Set(published.map((item) => normalizeSourceUrl(item.sourceUrl)));
  const today = new Date();
  const cutoff = new Date(today.getTime() - config.lookbackDays * 86400000).toISOString().slice(0, 10);
  const candidates = [];
  const checks = [];
  let successfulSources = 0;

  for (const source of config.sources) {
    try {
      const response = await fetch(source.url, {
        headers: { "user-agent": "ManapickNewsBot/1.0 (+https://manapick.app/news/)" },
        signal: AbortSignal.timeout(20000)
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const body = await response.text();
      successfulSources += 1;
      checks.push({ sourceId: source.id, status: "ok", httpStatus: response.status, checkedAt: new Date().toISOString() });

      const parsed = source.mode === "atom"
        ? parseAtom(body, source)
        : source.mode === "rss"
          ? parseRss(body, source)
          : [];

      for (const candidate of parsed) {
        if (!candidate.sourceUrl || !candidate.title || candidate.publishedAt < cutoff) continue;
        if (!isAllowedBySource(candidate, source)) continue;
        const url = new URL(candidate.sourceUrl);
        if (url.hostname !== source.allowedHost) continue;
        const normalizedUrl = normalizeSourceUrl(candidate.sourceUrl);
        if (publishedUrls.has(normalizedUrl)) continue;
        candidate.sourceUrl = normalizedUrl;
        if (candidate.sourceText.length < (source.minSourceText ?? 500)) continue;
        candidates.push(candidate);
      }
    } catch (error) {
      checks.push({
        sourceId: source.id,
        status: "failed",
        error: error instanceof Error ? error.message : String(error),
        checkedAt: new Date().toISOString()
      });
    }
  }

  if (successfulSources === 0) throw new Error("news watch: all configured sources failed");

  const result = {
    checkedAt: new Date().toISOString(),
    cutoff,
    checks,
    candidates: candidates.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)).slice(0, 12)
  };

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, JSON.stringify(result, null, 2) + "\n", "utf8");
  console.log(`news watch: ${checks.length} sources checked; ${result.candidates.length} unpublished candidates`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await main();
