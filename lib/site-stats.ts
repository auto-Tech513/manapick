import genresData from "@/content/genres.json";
import videosData from "@/content/videos.json";

type Genre = {
  key: string;
  status: "published" | "preparing" | "checking";
};

type Video = {
  genre: string;
  sub: string;
  scoreStatus?: "confirmed";
};

const genres = genresData as Genre[];
const videos = videosData as Video[];

const genreStatusByKey = new Map(genres.map((genre) => [genre.key, genre.status]));
const publishedVideos = videos.filter((video) => genreStatusByKey.get(video.genre) === "published");

function countBy<T>(items: readonly T[], keyFor: (item: T) => string) {
  return items.reduce<Record<string, number>>((counts, item) => {
    const key = keyFor(item);
    counts[key] = (counts[key] ?? 0) + 1;
    return counts;
  }, {});
}

function nestedSubtopicCounts(items: readonly Video[]) {
  return items.reduce<Record<string, Record<string, number>>>((counts, video) => {
    counts[video.genre] ??= {};
    counts[video.genre][video.sub] = (counts[video.genre][video.sub] ?? 0) + 1;
    return counts;
  }, {});
}

export function roundedVideoCountLabel(total: number) {
  const rounded = Math.floor(total / 50) * 50;
  return rounded > 0 ? rounded + "本超" : total + "本";
}

export const siteStats = {
  totalVideos: videos.length,
  publishedVideoCount: publishedVideos.length,
  confirmedVideoCount: videos.filter((video) => video.scoreStatus === "confirmed").length,
  genreCounts: countBy(publishedVideos, (video) => video.genre),
  subtopicCounts: nestedSubtopicCounts(publishedVideos),
  publishedGenreCount: Object.keys(countBy(publishedVideos, (video) => video.genre)).length,
  roundedVideoCountLabel: roundedVideoCountLabel(videos.length)
} as const;

export function genreVideoCount(genreKey: string) {
  return siteStats.genreCounts[genreKey] ?? 0;
}

export function subtopicVideoCount(genreKey: string, subtopic: string) {
  return siteStats.subtopicCounts[genreKey]?.[subtopic] ?? 0;
}
