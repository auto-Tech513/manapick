import genresData from "@/content/genres.json";
import videosData from "@/content/videos.json";

type Genre = {
  key: string;
  status: "published" | "preparing" | "checking";
};

type Video = {
  genre: string;
  sub: string;
  minutes: number;
  score: number | null;
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

// 集計の定義はここに集約する（research ページとトップの集計が別々に
// 再実装して定義がずれるのを防ぐ）。中央値は「並べ替えた中央の値」で、
// 本数が偶数のときは中央2値の大きい方を取る。research ページの
// 「調査方法と限界」に明記している公開定義と同一。
export function medianOf(values: readonly number[]) {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)] ?? 0;
}

export function averageScoreOf(items: readonly { score: number | null }[]) {
  const scores = items.map((item) => item.score).filter((score): score is number => score !== null);
  if (scores.length === 0) return null;
  return Math.round((scores.reduce((total, score) => total + score, 0) / scores.length) * 10) / 10;
}

export type GenrePosition = {
  count: number;
  medianMinutes: number;
  medianScore: number;
  higherCount: number;
  higherPercent: number;
  sameScoreCount: number;
};

// 動画詳細ページの「ジャンル内の位置」。順位は同点の数え方で変わるため出さず、
// 「この動画より高いスコアの本数と割合」で表す（同点の置き方に依存せず常に真）。
export function genrePosition(video: { genre: string; minutes: number; score: number | null }): GenrePosition | null {
  if (video.score === null) return null;
  const peers = publishedVideos.filter((peer) => peer.genre === video.genre);
  if (peers.length === 0) return null;
  const higherCount = peers.filter((peer) => peer.score !== null && peer.score > (video.score as number)).length;
  return {
    count: peers.length,
    medianMinutes: medianOf(peers.map((peer) => peer.minutes)),
    medianScore: medianOf(peers.map((peer) => peer.score).filter((score): score is number => score !== null)),
    higherCount,
    higherPercent: Math.round((100 * higherCount) / peers.length),
    sameScoreCount: peers.filter((peer) => peer.score === video.score).length
  };
}

export function subtopicVideoCount(genreKey: string, subtopic: string) {
  return siteStats.subtopicCounts[genreKey]?.[subtopic] ?? 0;
}
