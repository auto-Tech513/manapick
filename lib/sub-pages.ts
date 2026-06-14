import { publishedGenreKeys, subGenrePath, videos, type Video } from "@/lib/manapick";

export const MIN_SUB_PAGE_VIDEOS = 3;

export type EligibleSubPage = {
  key: string;
  sub: string;
  count: number;
};

export function subPageVideos(key: string, sub: string): Video[] {
  return videos
    .filter((video) => video.genre === key && video.sub === sub)
    .sort((a, b) => (b.score ?? -1) - (a.score ?? -1));
}

export function eligibleSubPages(): EligibleSubPage[] {
  const published = new Set(publishedGenreKeys);
  const counts = new Map<string, EligibleSubPage>();

  for (const video of videos) {
    if (!published.has(video.genre)) continue;
    const id = `${video.genre}\t${video.sub}`;
    const current = counts.get(id);
    if (current) current.count += 1;
    else counts.set(id, { key: video.genre, sub: video.sub, count: 1 });
  }

  return Array.from(counts.values())
    .filter((item) => item.count >= MIN_SUB_PAGE_VIDEOS)
    .sort((a, b) => a.key.localeCompare(b.key) || b.count - a.count || a.sub.localeCompare(b.sub, "ja"));
}

export function eligibleSubPagesForGenre(key: string): EligibleSubPage[] {
  return eligibleSubPages().filter((item) => item.key === key);
}

export function findEligibleSubPage(key: string, sub: string): EligibleSubPage | null {
  return eligibleSubPages().find((item) => item.key === key && item.sub === sub) ?? null;
}

export function eligibleSubPagePath(item: EligibleSubPage) {
  return subGenrePath(item.key, item.sub);
}
