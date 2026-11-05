#!/usr/bin/env node
// ガイドページ固有の OG 画像（1200×630）を生成する。共通ブランド画像の使い回しをやめ、
// Discover の「汎用画像をメインにしない」要件に合わせる（ニュース OG と同方式）。
import { mkdir, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const guidesDir = path.join(repoRoot, "content/guides");
const outputDir = path.join(repoRoot, "public/og/guides");

import { genreColors, visualLength, wrapJapanese } from "./generate-guide-og-helpers.mjs";
const genreLabels = {
  ai: "生成AI", prog: "プログラミング・IT", data: "データ・Excel", money: "お金・投資",
  biz: "ビジネススキル", kaikei: "会計・財務", shikaku: "資格・検定", english: "語学・英語",
  video: "動画編集", marke: "マーケティング"
};
const fontFamily = "'Noto Sans CJK JP','Noto Sans JP','Hiragino Sans','Yu Gothic','Meiryo',sans-serif";

function escapeXml(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&apos;");
}

function extractField(source, field) {
  const match = source.match(new RegExp(`${field}:\\s*\\n?\\s*"((?:[^"\\\\]|\\\\.)*)"`));
  if (!match) throw new Error(`guide field not found: ${field}`);
  return match[1].replaceAll('\\"', '"');
}

function renderSvg(guide) {
  const palette = genreColors[guide.genre] || { accent: "#1f3a8a", soft: "#eef3ff" };
  const label = genreLabels[guide.genre] || guide.genre;
  let fontSize = 50;
  let lines = wrapJapanese(guide.title, 18.5);
  if (lines.length > 4) {
    fontSize = 44;
    lines = wrapJapanese(guide.title, 21);
  }
  if (lines.length > 4) {
    fontSize = 40;
    lines = wrapJapanese(guide.title, 23);
  }
  const chipText = `${label}ガイド`;
  const categoryWidth = Math.max(150, Math.ceil(visualLength(chipText) * 22 + 42));
  const titleLines = lines.slice(0, 4).map((line, index) =>
    `<text x="86" y="${216 + index * (fontSize * 1.34)}" class="headline" font-size="${fontSize}">${escapeXml(line)}</text>`
  ).join("\n");
  const descriptionLines = wrapJapanese(guide.description, 43.5).slice(0, 2).map((line, index) =>
    `<text x="86" y="${505 + index * 31}" class="description">${escapeXml(line)}</text>`
  ).join("\n");

  return `
  <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <rect width="1200" height="630" fill="#f7f9fc"/>
    <rect x="38" y="38" width="1124" height="554" rx="18" fill="#ffffff" stroke="#d9e1ec" stroke-width="2"/>
    <rect x="38" y="38" width="12" height="554" rx="6" fill="${palette.accent}"/>
    <rect x="86" y="78" width="${categoryWidth}" height="42" rx="21" fill="${palette.soft}"/>
    <text x="${86 + categoryWidth / 2}" y="106" class="category" text-anchor="middle">${escapeXml(chipText)}</text>
    <text x="1120" y="106" class="date" text-anchor="end">${escapeXml(guide.publishedAt.replaceAll("-", "/"))}</text>
    ${titleLines}
    <line x1="86" y1="464" x2="1112" y2="464" stroke="#e2e8f0" stroke-width="2"/>
    ${descriptionLines}
    <circle cx="91" cy="566" r="18" fill="#1f3a8a"/>
    <path d="M81 566l7 7 14-18" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
    <text x="122" y="575" class="brand">Manapick</text>
    <text x="1112" y="575" class="site" text-anchor="end">manapick.app/guide</text>
    <style>
      text { font-family: ${fontFamily}; letter-spacing: 0; }
      .category { fill: ${palette.accent}; font-size: 22px; font-weight: 800; }
      .date { fill: #64748b; font-size: 21px; font-weight: 700; }
      .headline { fill: #111827; font-weight: 900; }
      .description { fill: #4b586b; font-size: 22px; font-weight: 650; }
      .brand { fill: #1f3a8a; font-size: 28px; font-weight: 900; }
      .site { fill: #64748b; font-size: 20px; font-weight: 700; }
    </style>
  </svg>`;
}

const files = (await readdir(guidesDir)).filter((name) => name.endsWith(".ts"));
await mkdir(outputDir, { recursive: true });
let count = 0;
for (const file of files) {
  const source = await readFile(path.join(guidesDir, file), "utf8");
  const guide = {
    slug: extractField(source, "slug"),
    genre: extractField(source, "genre"),
    title: extractField(source, "title"),
    description: extractField(source, "description"),
    publishedAt: extractField(source, "publishedAt")
  };
  await sharp(Buffer.from(renderSvg(guide))).png({ compressionLevel: 9 }).toFile(path.join(outputDir, `${guide.slug}.png`));
  count += 1;
}
console.log(`guide OG: generated ${count} images`);
