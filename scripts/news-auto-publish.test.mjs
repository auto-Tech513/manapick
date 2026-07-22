import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { validateNewsItems } from "./news-quality.mjs";
import { isAllowedBySource, normalizeSourceUrl, parseAtom, parseRss } from "./news-watch.mjs";
import { unsupportedNumericTokens } from "./news-auto-publish.mjs";

test("current news corpus passes the strict quality gate", async () => {
  const items = JSON.parse(await readFile(new URL("../content/news.json", import.meta.url), "utf8"));
  assert.deepEqual(validateNewsItems(items, { today: "2026-07-23" }), []);
});

test("short articles are rejected", () => {
  const errors = validateNewsItems([{ id: "short" }], { today: "2026-07-23" });
  assert.ok(errors.some((error) => error.includes("shorter than 1,000")));
});

test("Atom parser keeps official entry facts", () => {
  const xml = `<feed><entry><title>Test update</title><published>2026-07-23T01:00:00Z</published><link rel="alternate" href="https://example.com/post"/><content>${"Official source text ".repeat(40)}</content></entry></feed>`;
  const items = parseAtom(xml, { id: "test", name: "Test", autoPublish: true });
  assert.equal(items[0].title, "Test update");
  assert.equal(items[0].publishedAt, "2026-07-23");
});

test("RSS parser keeps official entry facts and decodes CDATA", () => {
  const xml = `<rss><channel><item><title><![CDATA[ChatGPT for small business]]></title><pubDate>Tue, 21 Jul 2026 15:00:00 GMT</pubDate><link>https://openai.com/index/small-business/</link><description><![CDATA[<p>Official program details.</p>]]></description></item></channel></rss>`;
  const items = parseRss(xml, { id: "openai", name: "OpenAI", autoPublish: false });
  assert.equal(items[0].title, "ChatGPT for small business");
  assert.equal(items[0].publishedAt, "2026-07-21");
  assert.equal(items[0].sourceText, "Official program details.");
  assert.equal(items[0].autoPublish, false);
});

test("source URLs normalize protocol, fragments, and trailing slashes", () => {
  assert.equal(
    normalizeSourceUrl("http://example.com/post/?b=2&a=1#section"),
    "https://example.com/post?a=1&b=2"
  );
});

test("source-specific title filters reject recap posts", () => {
  const source = { excludeTitlePatterns: ["^Google Workspace Weekly Recap"] };
  assert.equal(isAllowedBySource({ title: "Google Workspace Weekly Recap - July 17, 2026" }, source), false);
  assert.equal(isAllowedBySource({ title: "Import and create combo charts in Google Sheets" }, source), true);
});

test("numeric claims absent from the source are rejected", () => {
  const article = { whyCare: "10分で確認", facts: [], sections: [], relatedLinks: [] };
  assert.deepEqual(unsupportedNumericTokens(article, "公式では20分と案内"), ["10"]);
});
