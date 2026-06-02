import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const publicDir = path.join(root, "public");
const brandDir = path.join(publicDir, "brand");

const colorMarkSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Manapick logo mark">
  <defs>
    <linearGradient id="g" x1="18" y1="76" x2="78" y2="22" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#1F3A8A"/>
      <stop offset="1" stop-color="#0FA98B"/>
    </linearGradient>
  </defs>
  <path d="M18 55 L34 72 L75 28" fill="none" stroke="url(#g)" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M57 29 L76 25 L74 48" fill="none" stroke="#0FA98B" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M80 10 L84 21 L95 25 L84 29 L80 40 L76 29 L65 25 L76 21 Z" fill="#F59E0B"/>
</svg>`;

const whiteMarkSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Manapick logo mark">
  <path d="M18 55 L34 72 L75 28" fill="none" stroke="#FFFFFF" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M57 29 L76 25 L74 48" fill="none" stroke="#FFFFFF" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M80 10 L84 21 L95 25 L84 29 L80 40 L76 29 L65 25 L76 21 Z" fill="#F59E0B"/>
</svg>`;

const faviconSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect x="0" y="0" width="512" height="512" rx="112" fill="#1F3A8A"/>
  <g transform="translate(64 64) scale(4)">
    <path d="M18 55 L34 72 L75 28" fill="none" stroke="#FFFFFF" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M57 29 L76 25 L74 48" fill="none" stroke="#FFFFFF" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M80 10 L84 21 L95 25 L84 29 L80 40 L76 29 L65 25 L76 21 Z" fill="#F59E0B"/>
  </g>
</svg>`;

const ogSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#FAF7EF"/>
  <rect x="56" y="56" width="1088" height="518" rx="32" fill="#FFFFFF" stroke="#E7EEE8" stroke-width="2"/>
  <g transform="translate(112 144) scale(2.3)">
    <defs>
      <linearGradient id="og-g" x1="18" y1="76" x2="78" y2="22" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#1F3A8A"/>
        <stop offset="1" stop-color="#0FA98B"/>
      </linearGradient>
    </defs>
    <path d="M18 55 L34 72 L75 28" fill="none" stroke="url(#og-g)" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M57 29 L76 25 L74 48" fill="none" stroke="#0FA98B" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M80 10 L84 21 L95 25 L84 29 L80 40 L76 29 L65 25 L76 21 Z" fill="#F59E0B"/>
  </g>
  <text x="365" y="256" fill="#1F3A8A" font-family="Arial, Helvetica, sans-serif" font-size="92" font-weight="800">Manapick</text>
  <text x="370" y="340" fill="#17211C" font-family="Arial, Helvetica, sans-serif" font-size="42" font-weight="700">学び直しを、最短ルートに。</text>
  <text x="370" y="410" fill="#50745F" font-family="Arial, Helvetica, sans-serif" font-size="26" font-weight="700">社会人のための学習動画キュレーション</text>
</svg>`;

await fs.mkdir(brandDir, { recursive: true });

await fs.writeFile(path.join(brandDir, "manapick-mark.svg"), colorMarkSvg);
await fs.writeFile(path.join(brandDir, "manapick-mark-white.svg"), whiteMarkSvg);
await fs.writeFile(path.join(brandDir, "ogp-manapick.svg"), ogSvg);

await sharp(Buffer.from(faviconSvg)).resize(32, 32).png().toFile(path.join(publicDir, "favicon-32.png"));
await sharp(Buffer.from(faviconSvg)).resize(180, 180).png().toFile(path.join(publicDir, "apple-touch-icon.png"));
await sharp(Buffer.from(faviconSvg)).resize(192, 192).png().toFile(path.join(publicDir, "icon-192.png"));
await sharp(Buffer.from(faviconSvg)).resize(512, 512).png().toFile(path.join(publicDir, "icon-512.png"));
await sharp(Buffer.from(ogSvg)).png().toFile(path.join(brandDir, "ogp-manapick.png"));
