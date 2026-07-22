import { readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { validateNewsItems } from "./news-quality.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const newsPath = path.join(repoRoot, "content/news.json");
const candidatesPath = path.join(repoRoot, "data/news-watch-candidates.json");
const allowedRelatedLinks = new Set([
  "/study-plan/", "/learn/", "/youtube-learning/", "/guide/", "/guide/office-skills/",
  "/guide/excel-data/", "/guide/web-marketing/", "/guide/generative-ai/", "/learn/excel-statistics/",
  "/learn/python-hard/", "/learn/web-marketing-youtube/", "/learn/power-bi/", "/shop/",
  "https://ai.manapick.app/", "https://career.manapick.app/", "https://license.manapick.app/"
]);

export function numericTokens(value) {
  return [...new Set(String(value).match(/\d+(?:[.,:/-]\d+)*/g) || [])];
}

export function unsupportedNumericTokens(article, sourceText) {
  const body = [article.whyCare, ...(article.facts || []), ...(article.sections || []).flatMap((section) => [
    section.heading, ...(section.paragraphs || []), ...(section.bullets || [])
  ])].join(" ");
  return numericTokens(body).filter((token) => !sourceText.includes(token));
}

function slugify(value) {
  return value.toLowerCase().normalize("NFKC").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 54);
}

function extractJson(value) {
  const fenced = value.match(/```(?:json)?\s*([\s\S]*?)```/i)?.[1];
  const raw = fenced || value.slice(value.indexOf("{"), value.lastIndexOf("}") + 1);
  return JSON.parse(raw);
}

async function createArticle(candidate, token) {
  const today = new Date().toISOString().slice(0, 10);
  const prompt = `あなたはManapickのニュース編集者です。以下の公式一次情報だけを根拠に、日本語の記事JSONを1件作成してください。

厳守:
- 一次情報に書かれていない事実・数値・提供対象・日付を作らない。
- headlineは事実が分かる70字以内。煽り、断定、誇張は禁止。
- descriptionは70〜180字。
- whyCareは学び直しや仕事への関係を100〜180字で説明。
- factsは一次情報から確認できる事実を3〜5件。
- sectionsは4〜5件。合計本文は日本語1,200〜1,800字。各sectionにheadingとparagraphsを2件以上。必要ならbullets。
- 事実の説明とManapick編集部の活用提案を混同しない。
- 効果を保証しない。価格や制度は書かない unless source textに明記。
- relatedLinksは下の許可リストから2〜3件だけ選ぶ。
- 出力はJSONのみ。

許可するrelatedLinks:
${[...allowedRelatedLinks].join("\n")}

必須JSON schema:
{"headline":"","description":"","category":"ai|data|work","categoryLabel":"生成AI|Excel・データ|仕事・整理","whyCare":"","facts":[""],"sections":[{"heading":"","paragraphs":["",""]}],"relatedLinks":[{"label":"","href":"許可リストのURL","kind":"guide|intent|video|ai|career"}]}

公式タイトル: ${candidate.title}
公式公開日: ${candidate.publishedAt}
公式本文:
${candidate.sourceText}`;

  const response = await fetch("https://models.github.ai/inference/chat/completions", {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
    body: JSON.stringify({
      model: "openai/gpt-4.1",
      temperature: 0.15,
      max_tokens: 5000,
      messages: [
        { role: "system", content: "Use only the supplied official source. Return valid JSON and no markdown." },
        { role: "user", content: prompt }
      ]
    }),
    signal: AbortSignal.timeout(120000)
  });
  if (!response.ok) throw new Error(`GitHub Models HTTP ${response.status}: ${(await response.text()).slice(0, 500)}`);
  const payload = await response.json();
  const generated = extractJson(payload.choices?.[0]?.message?.content || "");
  const sourceHash = createHash("sha256").update(candidate.sourceUrl).digest("hex").slice(0, 10);
  const titleSlug = slugify(candidate.title);
  const suffix = titleSlug ? `${titleSlug}-${sourceHash}` : `${candidate.sourceId}-${sourceHash}`;
  return {
    id: `${candidate.publishedAt}-${suffix}`,
    ...generated,
    publishedAt: candidate.publishedAt,
    lastChecked: today,
    sourceName: candidate.sourceName,
    sourceUrl: candidate.sourceUrl
  };
}

async function main() {
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  if (!token) throw new Error("GITHUB_TOKEN is required for automatic publication");
  const current = JSON.parse(await readFile(newsPath, "utf8"));
  const watch = JSON.parse(await readFile(candidatesPath, "utf8"));
  const candidate = watch.candidates.find((item) => item.autoPublish);
  if (!candidate) {
    console.log("news publish: no qualifying official update today");
    return;
  }

  const article = await createArticle(candidate, token);
  const badLinks = article.relatedLinks.filter((link) => !allowedRelatedLinks.has(link.href));
  if (badLinks.length) throw new Error(`generated article contains unapproved related links: ${badLinks.map((link) => link.href).join(", ")}`);
  const unsupported = unsupportedNumericTokens(article, candidate.sourceText);
  if (unsupported.length) throw new Error(`generated article contains numeric claims absent from source: ${unsupported.join(", ")}`);
  const next = [article, ...current].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt) || b.id.localeCompare(a.id));
  const errors = validateNewsItems(next);
  if (errors.length) throw new Error(`generated article failed quality gate:\n${errors.join("\n")}`);
  await writeFile(newsPath, JSON.stringify(next, null, 2) + "\n", "utf8");
  console.log(`news publish: added ${article.id}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await main();
