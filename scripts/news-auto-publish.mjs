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

export function newsProviderConfig(env = process.env) {
  const apiKey = env.NEWS_LLM_API_KEY || env.OPENAI_API_KEY || "";
  const apiUrl = env.NEWS_LLM_API_URL || (env.OPENAI_API_KEY ? "https://api.openai.com/v1/chat/completions" : "");
  const model = env.NEWS_LLM_MODEL || "";
  const missing = [
    !apiKey && "NEWS_LLM_API_KEY",
    !apiUrl && "NEWS_LLM_API_URL",
    !model && "NEWS_LLM_MODEL"
  ].filter(Boolean);
  if (missing.length) {
    throw new Error(`news publish: provider is not configured (${missing.join(", ")}). Official-source monitoring completed; no article was generated.`);
  }
  return { apiKey, apiUrl, model };
}

async function createArticle(candidate, provider) {
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

  const requestBody = JSON.stringify({
    model: provider.model,
    temperature: 0.15,
    max_tokens: 7000,
    messages: [
      { role: "system", content: "Use only the supplied official source. Return valid JSON and no markdown." },
      { role: "user", content: prompt }
    ]
  });
  // The free-tier provider intermittently needs longer than 120s for a full
  // article; a single 120s cap silently dropped whole days (2026-11-09..11).
  // Allow up to 240s per attempt and retry up to 3 attempts on timeout /
  // 429 / 5xx, and on an empty or malformed generated JSON (503 on 11-19,
  // empty response on 11-20, truncated JSON on 11-17). A persistently bad
  // generation still throws, so no unverified article is ever published.
  const maxAttempts = 3;
  let generated;
  let lastError;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await fetch(provider.apiUrl, {
        method: "POST",
        headers: { "content-type": "application/json", authorization: `Bearer ${provider.apiKey}` },
        body: requestBody,
        signal: AbortSignal.timeout(240000)
      });
      if (!response.ok) {
        if (response.status !== 429 && response.status < 500) {
          throw new Error(`news provider HTTP ${response.status}: ${(await response.text()).slice(0, 500)}`);
        }
        throw new Error(`news provider HTTP ${response.status}: ${(await response.text()).slice(0, 500)}`);
      }
      const payload = await response.json();
      const content = payload.choices?.[0]?.message?.content || "";
      if (!content.trim()) throw new Error("news provider returned an empty response");
      generated = extractJson(content);
      break;
    } catch (error) {
      lastError = error;
      // Non-retryable provider errors (auth, bad request, etc.) fail fast.
      if (/news provider HTTP (4\d\d)/.test(error.message) && !/429/.test(error.message)) throw error;
      if (attempt < maxAttempts) {
        console.log(`news publish: generation attempt ${attempt} failed (${error.message}); retrying in 15s`);
        await new Promise((resolve) => setTimeout(resolve, 15000));
      }
    }
  }
  if (!generated) throw lastError ?? new Error("news provider request failed");
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

const MAX_DAILY_ARTICLES = 3;

async function main() {
  const current = JSON.parse(await readFile(newsPath, "utf8"));
  const watch = JSON.parse(await readFile(candidatesPath, "utf8"));
  const qualifying = watch.candidates.filter((item) => item.autoPublish).slice(0, MAX_DAILY_ARTICLES);
  if (!qualifying.length) {
    console.log("news publish: no qualifying official update today");
    return;
  }

  // Provider misconfiguration is a setup failure, not a per-article failure:
  // resolve it once up front so it still fails the step (and opens the
  // existing "generator needs attention" issue) exactly as before.
  const provider = newsProviderConfig();
  let next = current;
  const added = [];
  const failures = [];
  for (const candidate of qualifying) {
    try {
      const article = await createArticle(candidate, provider);
      const badLinks = article.relatedLinks.filter((link) => !allowedRelatedLinks.has(link.href));
      if (badLinks.length) throw new Error(`generated article contains unapproved related links: ${badLinks.map((link) => link.href).join(", ")}`);
      const unsupported = unsupportedNumericTokens(article, candidate.sourceText);
      if (unsupported.length) throw new Error(`generated article contains numeric claims absent from source: ${unsupported.join(", ")}`);
      const merged = [article, ...next].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt) || b.id.localeCompare(a.id));
      const errors = validateNewsItems(merged);
      if (errors.length) throw new Error(`generated article failed quality gate:\n${errors.join("\n")}`);
      next = merged;
      added.push(article.id);
      console.log(`news publish: added ${article.id}`);
    } catch (error) {
      // A failed candidate never publishes anything unverified; skip it and
      // continue with the remaining candidates for today.
      failures.push(`${candidate.sourceUrl}: ${error.message}`);
      console.log(`news publish: skipped candidate ${candidate.sourceUrl} (${error.message})`);
    }
  }
  if (!added.length) {
    // Every qualifying candidate failed: surface it like the previous
    // single-article flow did, so the failure alerting still fires.
    throw new Error(`news publish: all ${qualifying.length} qualifying candidate(s) failed:\n${failures.join("\n")}`);
  }
  await writeFile(newsPath, JSON.stringify(next, null, 2) + "\n", "utf8");
  console.log(`news publish: ${added.length} article(s) published, ${failures.length} candidate(s) skipped`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await main();
