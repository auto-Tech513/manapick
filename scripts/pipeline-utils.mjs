import fs from "node:fs/promises";
import path from "node:path";

export const rootDir = process.cwd();
export const dataDir = path.join(rootDir, "data");
export const contentDir = path.join(rootDir, "content");

export async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

export async function readJson(filePath, fallback = null) {
  try {
    return JSON.parse(await fs.readFile(filePath, "utf8"));
  } catch (error) {
    if (error.code === "ENOENT" && fallback !== null) return fallback;
    throw error;
  }
}

export async function writeJson(filePath, data) {
  await ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, JSON.stringify(data, null, 2) + "\n");
}

export async function loadEnvFile(filePath = null) {
  const paths = filePath ? [filePath] : [path.join(rootDir, ".env"), path.join(rootDir, ".env.local")];

  for (const candidatePath of paths) {
    try {
      const text = await fs.readFile(candidatePath, "utf8");
      for (const rawLine of text.split(/\r?\n/)) {
        const line = rawLine.trim();
        if (!line || line.startsWith("#")) continue;
        const index = line.indexOf("=");
        if (index < 1) continue;
        const key = line.slice(0, index).trim();
        let value = line.slice(index + 1).trim();
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        if (!process.env[key]) process.env[key] = value;
      }
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
  }
}

export function parseArgs(argv = process.argv.slice(2)) {
  const args = { _: [] };
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith("--")) {
      args._.push(token);
      continue;
    }
    const body = token.slice(2);
    const eq = body.indexOf("=");
    if (eq >= 0) {
      args[body.slice(0, eq)] = body.slice(eq + 1);
      continue;
    }
    const next = argv[index + 1];
    if (next && !next.startsWith("--")) {
      args[body] = next;
      index += 1;
    } else {
      args[body] = true;
    }
  }
  return args;
}

export function toNumber(value, fallback) {
  if (value === undefined || value === null || value === "") return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function parseIsoDurationToMinutes(duration) {
  const match = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/.exec(duration || "");
  if (!match) return 0;
  const hours = Number(match[1] || 0);
  const minutes = Number(match[2] || 0);
  const seconds = Number(match[3] || 0);
  return Math.max(1, Math.round(hours * 60 + minutes + seconds / 60));
}

export function isLikelyJapanese(text = "") {
  return /[ぁ-んァ-ン一-龯]/.test(text);
}

export function yearsSince(dateText, now = new Date()) {
  const date = new Date(dateText);
  if (Number.isNaN(date.getTime())) return Infinity;
  return (now.getTime() - date.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
}

export function youtubeUrl(ytid) {
  return `https://www.youtube.com/watch?v=${ytid}`;
}

export async function existingVideoIds() {
  const videos = await readJson(path.join(contentDir, "videos.json"), []);
  return new Set(videos.map((video) => video.ytid));
}

export function unwrapItems(payload) {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.items)) return payload.items;
  return [];
}
