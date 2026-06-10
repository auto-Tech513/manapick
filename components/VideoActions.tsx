"use client";

import { useEffect } from "react";
import { useLocalList } from "@/lib/useLocalList";

export default function VideoActions({ ytid }: { ytid: string }) {
  const watchlist = useLocalList("manapick:watchlist:v1");
  const watched = useLocalList("manapick:watched:v1");

  useEffect(() => {
    try {
      const key = "manapick:recent:v1";
      const raw = window.localStorage.getItem(key);
      const list: string[] = raw ? JSON.parse(raw) : [];
      const next = [ytid, ...list.filter((item) => item !== ytid)].slice(0, 12);
      window.localStorage.setItem(key, JSON.stringify(next));
    } catch {
      // The action controls should still render when localStorage is unavailable.
    }
  }, [ytid]);

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
