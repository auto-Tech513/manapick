#!/usr/bin/env node
// maxres サムネイルが無い動画向けの大きな画像（1280×720、16:9）を生成する。
// Discover の大きな画像要件（幅1200px以上・16:9）を満たすフォールバックで、
// lib/manapick.ts の videoLargeImage がこのパスを返す。maxres がある動画は生成しない。
import { mkdir, readFile, readdir, unlink } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { genreColors, wrapJapanese } from "./generate-guide-og-helpers.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputDir = path.join(repoRoot, "public/og/videos");
const videos = JSON.parse(await readFile(path.join(repoRoot, "content/videos.json"), "utf8"));
const genres = JSON.parse(await readFile(path.join(repoRoot, "content/genres.json"), "utf8"));
const genreLabels = Object.fromEntries(genres.map((genre) => [genre.key, genre.label]));
const fontFamily = "'Noto Sans CJK JP','Noto Sans JP','Hiragino Sans','Yu Gothic','Meiryo',sans-serif";

function escapeXml(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&apos;");
}
function visualLength(value) {
  return [...value].reduce((sum, char) => sum + (/^[\u0000-\u00ff]$/.test(char) ? 0.62 : 1), 0);
}

function renderSvg(video) {
  const palette = genreColors[video.genre] || { accent: "#1f3a8a", soft: "#eef3ff" };
  const label = genreLabels[video.genre] || video.genre;
  let fontSize = 56;
  let lines = wrapJapanese(video.title, 19);
  if (lines.length > 4) {
    fontSize = 48;
    lines = wrapJapanese(video.title, 22);
  }
  if (lines.length > 4) {
    fontSize = 42;
    lines = wrapJapanese(video.title, 25);
  }
  const chipText = `${label}の学習動画`;
  const categoryWidth = Math.max(170, Math.ceil(visualLength(chipText) * 23 + 44));
  const titleLines = lines.slice(0, 4).map((line, index) =>
    `<text x="92" y="${238 + index * (fontSize * 1.32)}" class="headline" font-size="${fontSize}">${escapeXml(line)}</text>`
  ).join("\n");
  const scoreText = video.score != null ? `Manapick スコア ${video.score}/35` : "";
  const scoreWidth = scoreText ? Math.ceil(visualLength(scoreText) * 24 + 44) : 0;

  return `
  <svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">
    <rect width="1280" height="720" fill="#f7f9fc"/>
    <rect x="40" y="40" width="1200" height="640" rx="20" fill="#ffffff" stroke="#d9e1ec" stroke-width="2"/>
    <rect x="40" y="40" width="14" height="640" rx="7" fill="${palette.accent}"/>
    <rect x="92" y="86" width="${categoryWidth}" height="46" rx="23" fill="${palette.soft}"/>
    <text x="${92 + categoryWidth / 2}" y="117" class="category" text-anchor="middle">${escapeXml(chipText)}</text>
    ${scoreText ? `<rect x="${1188 - scoreWidth}" y="86" width="${scoreWidth}" height="46" rx="23" fill="#1f3a8a"/><text x="${1188 - scoreWidth / 2}" y="117" class="score" text-anchor="middle">${escapeXml(scoreText)}</text>` : ""}
    ${titleLines}
    <line x1="92" y1="540" x2="1188" y2="540" stroke="#e2e8f0" stroke-width="2"/>
    <text x="92" y="592" class="channel">${escapeXml(video.channel)}</text>
    <circle cx="97" cy="648" r="18" fill="#1f3a8a"/>
    <path d="M87 648l7 7 14-18" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
    <text x="128" y="657" class="brand">Manapick</text>
    <text x="1188" y="657" class="site" text-anchor="end">manapick.app</text>
    <style>
      text { font-family: ${fontFamily}; letter-spacing: 0; }
      .category { fill: ${palette.accent}; font-size: 23px; font-weight: 800; }
      .score { fill: #ffffff; font-size: 23px; font-weight: 800; }
      .headline { fill: #111827; font-weight: 900; }
      .channel { fill: #4b586b; font-size: 26px; font-weight: 700; }
      .brand { fill: #1f3a8a; font-size: 28px; font-weight: 900; }
      .site { fill: #64748b; font-size: 20px; font-weight: 700; }
    </style>
  </svg>`;
}

const targets = videos.filter((video) => !video.hasMaxresThumbnail);
await mkdir(outputDir, { recursive: true });
// maxres が使えるようになった動画の旧カードは残さない（生成集合と一致させる）。
const targetNames = new Set(targets.map((video) => `${video.ytid}.png`));
for (const name of await readdir(outputDir)) {
  if (name.endsWith(".png") && !targetNames.has(name)) await unlink(path.join(outputDir, name));
}
for (const video of targets) {
  await sharp(Buffer.from(renderSvg(video))).png({ compressionLevel: 9 }).toFile(path.join(outputDir, `${video.ytid}.png`));
}
console.log(`video OG: generated ${targets.length} fallback images (maxres available: ${videos.length - targets.length})`);
