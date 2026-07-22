import { existsSync } from "node:fs";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

const outputDir = path.resolve("out");

async function collectHtml(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) return collectHtml(target);
    return entry.name.endsWith(".html") ? [target] : [];
  }));
  return nested.flat();
}

function localTargetExists(href) {
  const cleanHref = decodeURI(href.split(/[?#]/, 1)[0]);
  const relative = cleanHref.replace(/^\/+|\/+$/g, "");
  const candidates = relative
    ? [
        path.join(outputDir, relative, "index.html"),
        path.join(outputDir, `${relative}.html`),
        path.join(outputDir, relative),
      ]
    : [path.join(outputDir, "index.html")];
  return candidates.some((candidate) => existsSync(candidate));
}

const htmlFiles = await collectHtml(outputDir);
const broken = [];
let checkedLinks = 0;

for (const file of htmlFiles) {
  const html = await readFile(file, "utf8");
  for (const match of html.matchAll(/href=["']([^"']+)["']/g)) {
    const href = match[1];
    if (!href.startsWith("/") || href.startsWith("//")) continue;
    if (/^\/(?:_next|images|icons|fonts|og|api)\//.test(href)) continue;
    checkedLinks += 1;
    if (!localTargetExists(href)) {
      broken.push({ from: path.relative(outputDir, file), href });
    }
  }
}

if (broken.length) {
  console.error(`static links: ${broken.length} broken of ${checkedLinks} checked`);
  for (const item of broken.slice(0, 30)) console.error(`${item.from}: ${item.href}`);
  process.exit(1);
}

console.log(`static links: ${checkedLinks} internal links passed across ${htmlFiles.length} HTML files`);
