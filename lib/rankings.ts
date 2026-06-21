import roadmapsData from "@/content/roadmaps.json";
import { publishedGenreKeys, type Video, videos } from "@/lib/manapick";

export type RankingMode = "popular" | "score" | "new";

type RoadmapStep = {
  label: string;
  level: string;
  goal: string;
  videos: string[];
};

type Roadmap = {
  genre: string;
  title: string;
  steps: RoadmapStep[];
};

const roadmaps = roadmapsData as Roadmap[];

export function publishedTime(video: Video) {
  if (!video.publishedAt) return 0;
  const time = new Date(video.publishedAt).getTime();
  return Number.isNaN(time) ? 0 : time;
}

export function monthsSincePublished(video: Video) {
  const time = publishedTime(video);
  if (time <= 0) return 36;
  const diff = Date.now() - time;
  return Math.max(0, diff / (1000 * 60 * 60 * 24 * 30.4375));
}

export function popularityScore(video: Video) {
  const viewCount = Math.max(0, Number(video.viewCount || 0));
  if (viewCount <= 0) return 0;
  return Math.log10(viewCount) / Math.pow(monthsSincePublished(video) + 2, 0.6);
}

export function rankedVideos(mode: RankingMode, limit?: number) {
  const ranked = videos.filter((video) => publishedGenreKeys.includes(video.genre));
  if (mode === "new") {
    ranked.sort((a, b) => publishedTime(b) - publishedTime(a) || (b.score ?? -1) - (a.score ?? -1));
  } else if (mode === "score") {
    ranked.sort((a, b) => (b.score ?? -1) - (a.score ?? -1) || popularityScore(b) - popularityScore(a));
  } else {
    ranked.sort((a, b) => popularityScore(b) - popularityScore(a) || (b.score ?? -1) - (a.score ?? -1));
  }
  return typeof limit === "number" ? ranked.slice(0, limit) : ranked;
}

export function recentVideos(limit = 8) {
  return rankedVideos("new", limit);
}

function roadmapNext(video: Video) {
  const roadmap = roadmaps.find((item) => item.genre === video.genre);
  if (!roadmap) return null;
  const sequence = roadmap.steps.flatMap((step) => step.videos);
  const index = sequence.indexOf(video.ytid);
  if (index < 0) return null;
  const nextId = sequence.slice(index + 1).find((ytid) => ytid !== video.ytid);
  if (!nextId) return null;
  return videos.find((item) => item.ytid === nextId) ?? null;
}

export function nextWatchVideo(video: Video) {
  const nextInRoadmap = roadmapNext(video);
  if (nextInRoadmap) {
    return {
      video: nextInRoadmap,
      reason: "ロードマップ上で次に進む1本です。前の動画で見たテーマを、次の段階へつなげます。"
    };
  }

  const sameSub = videos
    .filter((item) => item.ytid !== video.ytid && item.sub === video.sub && publishedGenreKeys.includes(item.genre))
    .sort((a, b) => (b.score ?? -1) - (a.score ?? -1))[0];
  if (sameSub) {
    return {
      video: sameSub,
      reason: `同じ「${video.sub}」の中でスコアが高い1本です。別の説明で理解を補えます。`
    };
  }

  const sameGenre = videos
    .filter((item) => item.ytid !== video.ytid && item.genre === video.genre && publishedGenreKeys.includes(item.genre))
    .sort((a, b) => (b.score ?? -1) - (a.score ?? -1))[0];
  if (!sameGenre) return null;
  return {
    video: sameGenre,
    reason: "同じジャンルで次に選びやすい高スコア動画です。学習の流れを止めずに続けられます。"
  };
}
