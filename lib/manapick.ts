import genresData from "@/content/genres.json";
import videosData from "@/content/videos.json";

export const SITE_URL = "https://manapick.pages.dev";

export type GenreStatus = "published" | "preparing" | "checking";

export type Genre = {
  key: string;
  label: string;
  icon: string;
  status: GenreStatus;
  note?: string;
  subgenres: string[];
  monetization: string;
  prItems: string[];
};

export type AxisScore = {
  axis: string;
  score: number;
  note: string;
};

export type ScoreStatus = "confirmed" | "provisional";

export type Video = {
  genre: string;
  sub: string;
  ytid: string;
  level: "初級" | "中級" | "上級";
  minutes: number;
  channel: string;
  score: number | null;
  viewCount?: number;
  publishedAt?: string;
  scoreStatus?: ScoreStatus;
  editorNote?: string;
  axisScores: AxisScore[];
  title: string;
  url: string;
  tags: string[];
  review: string[];
};

export const genres = genresData as Genre[];
export const videos = videosData as Video[];

export const publishedGenreKeys = genres
  .filter((genre) => genre.status === "published")
  .map((genre) => genre.key);

export function videoPath(ytid: string) {
  return "/video/" + ytid + "/";
}

export function absoluteUrl(path: string) {
  return new URL(path, SITE_URL).toString();
}

export function youtubeThumbnail(ytid: string) {
  return "https://i.ytimg.com/vi/" + ytid + "/hqdefault.jpg";
}

export function youtubeEmbedUrl(ytid: string) {
  return "https://www.youtube.com/embed/" + ytid;
}

export function genreDisplayName(key: string) {
  if (key === "biz") return "Office・資料作成";
  const genre = genres.find((item) => item.key === key);
  return genre ? genre.label : key;
}

export function genreLabel(key: string) {
  const shortLabels: Record<string, string> = {
    ai: "生成AI",
    prog: "プログラミング",
    video: "動画編集",
    english: "英語",
    data: "データ分析",
    marke: "Webマーケ",
    biz: "Office・資料",
    shikaku: "資格"
  };
  return shortLabels[key] ?? genreDisplayName(key);
}

export function scoreStatus(video: Video): ScoreStatus {
  return video.scoreStatus === "confirmed" ? "confirmed" : "provisional";
}

export function scoreText(video: Video) {
  return video.score === null ? "スコア準備中" : video.score + "/35";
}

export function scoreLabel(video: Video) {
  return scoreStatus(video) === "confirmed" ? scoreText(video) + " ✓確認済" : scoreText(video) + " 暫定";
}

export function displayChannel(video: Video) {
  const channel = video.channel?.trim();
  if (!channel || channel.includes("確認")) return null;
  return channel;
}

export function videoDescription(video: Video) {
  return (video.review[0] ?? video.title).replace(/\s+/g, " ").slice(0, 150);
}

export function findVideo(ytid: string) {
  return videos.find((video) => video.ytid === ytid) ?? null;
}

export function relatedVideos(video: Video, limit = 6) {
  const candidates = videos
    .filter((item) => item.ytid !== video.ytid)
    .filter((item) => publishedGenreKeys.includes(item.genre));

  const sameSub = candidates
    .filter((item) => item.sub === video.sub)
    .sort((a, b) => (b.score ?? -1) - (a.score ?? -1));
  const sameGenre = candidates
    .filter((item) => item.sub !== video.sub && item.genre === video.genre)
    .sort((a, b) => (b.score ?? -1) - (a.score ?? -1));
  const fallback = candidates
    .filter((item) => item.genre !== video.genre)
    .sort((a, b) => (b.score ?? -1) - (a.score ?? -1));

  const seen = new Set<string>();
  return [...sameSub, ...sameGenre, ...fallback].filter((item) => {
    if (seen.has(item.ytid)) return false;
    seen.add(item.ytid);
    return true;
  }).slice(0, limit);
}

export function isoDuration(minutes: number) {
  return "PT" + Math.max(1, Math.round(minutes)) + "M";
}
