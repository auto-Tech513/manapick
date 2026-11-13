// IndexNow 送信用に、push 前後の差分から変更のあった公開 URL を組み立てる。
// 使い方: node scripts/indexnow-diff.mjs <beforeSha> <afterSha>
// before が無い（初回・手動）場合はトップと /news/ のみ返す。
import { execFileSync } from "node:child_process";

const SITE = "https://manapick.app";
const before = process.argv[2];
const after = process.argv[3] || "HEAD";
const urls = new Set([SITE + "/", SITE + "/news/"]);

function readJsonAt(rev, path) {
  try {
    const raw = execFileSync("git", ["show", rev + ":" + path], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
    return JSON.parse(raw);
  } catch { return null; }
}

if (before && !/^0+$/.test(before)) {
  const beforeVideos = readJsonAt(before, "content/videos.json");
  const afterVideos = readJsonAt(after, "content/videos.json");
  if (Array.isArray(beforeVideos) && Array.isArray(afterVideos)) {
    const bMap = new Map(beforeVideos.map((v) => [v.ytid, JSON.stringify(v)]));
    const aMap = new Map(afterVideos.map((v) => [v.ytid, JSON.stringify(v)]));
    const changed = new Set();
    for (const [id, s] of aMap) if (bMap.get(id) !== s) changed.add(id);
    for (const id of bMap.keys()) if (!aMap.has(id)) changed.add(id);
    const byId = new Map(afterVideos.map((v) => [v.ytid, v]));
    const genres = new Set(), subs = new Set();
    for (const id of changed) {
      urls.add(SITE + "/video/" + encodeURIComponent(id) + "/");
      const v = byId.get(id) ?? beforeVideos.find((x) => x.ytid === id);
      if (v) { genres.add(v.genre); subs.add(v.genre + "/" + v.sub); }
    }
    for (const g of genres) urls.add(SITE + "/genre/" + g + "/");
    for (const s of subs) { const [g, sub] = s.split("/"); urls.add(SITE + "/genre/" + g + "/" + encodeURIComponent(sub) + "/"); }
  }
  const beforeNews = readJsonAt(before, "content/news.json");
  const afterNews = readJsonAt(after, "content/news.json");
  const items = (j) => (Array.isArray(j) ? j : j?.items ?? []);
  if (beforeNews && afterNews) {
    const bMap = new Map(items(beforeNews).map((n) => [n.id, JSON.stringify(n)]));
    for (const n of items(afterNews)) if (bMap.get(n.id) !== JSON.stringify(n)) urls.add(SITE + "/news/" + n.id + "/");
  }
}
console.log(JSON.stringify([...urls]));
