import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

async function readJson(relativePath) {
  return JSON.parse(await readFile(path.join(repoRoot, relativePath), "utf8"));
}

const [videos, genres, roadmaps] = await Promise.all([
  readJson("content/videos.json"),
  readJson("content/genres.json"),
  readJson("content/roadmaps.json")
]);

const errors = [];
const warnings = [];
const ids = new Set();
const genreKeys = new Set(genres.map((genre) => genre.key));

for (const [index, video] of videos.entries()) {
  const label = video.ytid || `index:${index}`;
  if (!video.ytid || !video.title || !video.genre || !video.url) {
    errors.push(`${label}: required video fields are missing`);
  }
  if (ids.has(video.ytid)) errors.push(`${label}: duplicate ytid`);
  ids.add(video.ytid);
  if (!genreKeys.has(video.genre)) errors.push(`${label}: unknown genre ${video.genre}`);
  if (video.scoreStatus !== "confirmed") errors.push(`${label}: scoreStatus must be confirmed`);
  if (!Number.isFinite(video.score) || video.score < 0 || video.score > 35) {
    errors.push(`${label}: score must be a number from 0 to 35`);
  }
  if (!Array.isArray(video.review) || video.review.length < 3 || video.review.some((line) => !String(line).trim())) {
    errors.push(`${label}: three non-empty review lines are required`);
  }
  if (!video.publishedAt || Number.isNaN(Date.parse(video.publishedAt))) {
    errors.push(`${label}: valid publishedAt is required`);
  }
  if (!Array.isArray(video.axisScores)) {
    errors.push(`${label}: axisScores must be an array`);
  } else if (video.axisScores.length === 0) {
    warnings.push(`${label}: stored axis breakdown is unavailable`);
  } else if (video.axisScores.length !== 7) {
    errors.push(`${label}: axisScores must contain seven axes when present`);
  } else {
    const sum = video.axisScores.reduce((total, axis) => total + Number(axis.score || 0), 0);
    if (sum !== video.score) errors.push(`${label}: axis score sum ${sum} does not match total ${video.score}`);
  }
}

for (const roadmap of roadmaps) {
  if (!genreKeys.has(roadmap.genre)) errors.push(`roadmap:${roadmap.genre}: unknown genre`);
  for (const step of roadmap.steps || []) {
    for (const ytid of step.videos || []) {
      if (!ids.has(ytid)) errors.push(`roadmap:${roadmap.genre}: missing video ${ytid}`);
    }
  }
}

const publishedGenres = genres.filter((genre) => genre.status === "published");
for (const genre of publishedGenres) {
  if (!videos.some((video) => video.genre === genre.key)) {
    errors.push(`genre:${genre.key}: published genre has no videos`);
  }
  if (!roadmaps.some((roadmap) => roadmap.genre === genre.key)) {
    errors.push(`genre:${genre.key}: published genre has no roadmap`);
  }
}

if (warnings.length > 0) {
  console.warn(`[content:audit] warnings=${warnings.length}`);
  for (const warning of warnings.slice(0, 20)) console.warn(`- ${warning}`);
}

if (errors.length > 0) {
  console.error(`[content:audit] failed errors=${errors.length}`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(
  `[content:audit] ok videos=${videos.length} genres=${publishedGenres.length} roadmaps=${roadmaps.length} warnings=${warnings.length}`
);
