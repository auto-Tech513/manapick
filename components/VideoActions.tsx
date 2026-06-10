"use client";

import { useLocalList } from "@/lib/useLocalList";

export default function VideoActions({ ytid }: { ytid: string }) {
  const watchlist = useLocalList("manapick:watchlist:v1");
  const watched = useLocalList("manapick:watched:v1");

  if (!watchlist.ready || !watched.ready) return null;

  const inWatchlist = watchlist.has(ytid);
  const isWatched = watched.has(ytid);

  return (
    <div className="video-action-row" aria-label="動画の保存状態">
      <button
        type="button"
        className={inWatchlist ? "video-action-toggle is-active" : "video-action-toggle"}
        aria-pressed={inWatchlist}
        onClick={() => watchlist.toggle(ytid)}
      >
        <span aria-hidden="true">🔖</span>
        <span>{inWatchlist ? "あとで見るに追加済み" : "あとで見る"}</span>
      </button>
      <button
        type="button"
        className={isWatched ? "video-action-toggle is-active" : "video-action-toggle"}
        aria-pressed={isWatched}
        onClick={() => watched.toggle(ytid)}
      >
        <span aria-hidden="true">✓</span>
        <span>{isWatched ? "視聴済み" : "視聴済みにする"}</span>
      </button>
    </div>
  );
}
