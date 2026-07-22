import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputDir = path.join(repoRoot, "public/og/news");
const items = JSON.parse(await readFile(path.join(repoRoot, "content/news.json"), "utf8"));

const categoryColors = {
  ai: { accent: "#cf493b", soft: "#fff1ef" },
  data: { accent: "#0f766e", soft: "#ecfdf8" },
  work: { accent: "#a45a16", soft: "#fff7ed" }
};
const fontFamily = "'Noto Sans CJK JP','Noto Sans JP','Hiragino Sans','Yu Gothic','Meiryo',sans-serif";

function escapeXml(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&apos;");
}

function visualLength(value) {
  return [...value].reduce((sum, char) => sum + (/^[\u0000-\u00ff]$/.test(char) ? 0.62 : 1), 0);
}

export function wrapJapanese(value, limit) {
  const segmenter = new Intl.Segmenter("ja", { granularity: "word" });
  const tokens = [...segmenter.segment(value)].map((part) => part.segment);
  const lines = [];
  let current = "";
  for (const token of tokens) {
    if (current && visualLength(current + token) > limit) {
      lines.push(current.trim());
      current = token;
    } else {
      current += token;
    }
  }
  if (current.trim()) lines.push(current.trim());
  return lines;
}

function renderSvg(item) {
  const palette = categoryColors[item.category] || { accent: "#1f3a8a", soft: "#eef3ff" };
  let fontSize = 54;
  let lines = wrapJapanese(item.headline, 17);
  if (lines.length > 4) {
    fontSize = 48;
    lines = wrapJapanese(item.headline, 19.5);
  }
  if (lines.length > 4) {
    fontSize = 43;
    lines = wrapJapanese(item.headline, 22);
  }
  const categoryWidth = Math.max(132, Math.ceil(visualLength(item.categoryLabel) * 22 + 42));
  const titleLines = lines.slice(0, 4).map((line, index) =>
    `<text x="86" y="${216 + index * (fontSize * 1.34)}" class="headline" font-size="${fontSize}">${escapeXml(line)}</text>`
  ).join("\n");
  const descriptionLines = wrapJapanese(item.description, 43.5).slice(0, 2).map((line, index) =>
    `<text x="86" y="${505 + index * 31}" class="description">${escapeXml(line)}</text>`
  ).join("\n");

  return `
  <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <rect width="1200" height="630" fill="#f7f9fc"/>
    <rect x="38" y="38" width="1124" height="554" rx="18" fill="#ffffff" stroke="#d9e1ec" stroke-width="2"/>
    <rect x="38" y="38" width="12" height="554" rx="6" fill="${palette.accent}"/>
    <rect x="86" y="78" width="${categoryWidth}" height="42" rx="21" fill="${palette.soft}"/>
    <text x="${86 + categoryWidth / 2}" y="106" class="category" text-anchor="middle">${escapeXml(item.categoryLabel)}</text>
    <text x="1120" y="106" class="date" text-anchor="end">${escapeXml(item.publishedAt.replaceAll("-", "/"))}</text>
    ${titleLines}
    <line x1="86" y1="464" x2="1112" y2="464" stroke="#e2e8f0" stroke-width="2"/>
    ${descriptionLines}
    <circle cx="91" cy="566" r="18" fill="#1f3a8a"/>
    <path d="M81 566l7 7 14-18" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
    <text x="122" y="575" class="brand">Manapick</text>
    <text x="1112" y="575" class="site" text-anchor="end">manapick.app/news</text>
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

await mkdir(outputDir, { recursive: true });
for (const item of items) {
  await sharp(Buffer.from(renderSvg(item))).png({ compressionLevel: 9 }).toFile(path.join(outputDir, `${item.id}.png`));
}
console.log(`news OG: generated ${items.length} images with Japanese font fallback stack`);
