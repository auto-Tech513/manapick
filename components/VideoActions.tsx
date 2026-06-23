"use client";

import { useEffect } from "react";
import { RECENT_KEY, WATCHED_KEY, WATCHLIST_KEY, sendGaEvent } from "@/lib/retention";
import { useLocalList } from "@/lib/useLocalList";
import { useStreakState } from "@/lib/useStreakState";

export default function VideoActions({ ytid }: { ytid: string }) {
  const watchlist = useLocalList(WATCHLIST_KEY);
  const watched = useLocalList(WATCHED_KEY);
  const streak = useStreakState();

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(RECENT_KEY);
      const list: string[] = raw ? JSON.parse(raw) : [];
      const next = [ytid, ...list.filter((item) => item !== ytid)].slice(0, 12);
      window.localStorage.setItem(RECENT_KEY, JSON.stringify(next));
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
        onClick={() => {
          sendGaEvent("video_save_toggle", { video_id: ytid, action: inWatchlist ? "remove" : "add", source: "detail" });
          watchlist.toggle(ytid);
        }}
      >
        <span aria-hidden="true">🔖</span>
        <span>{inWatchlist ? "あとで見るに追加済み" : "あとで見る"}</span>
      </button>
      <button
        type="button"
        className={isWatched ? "video-action-toggle is-active" : "video-action-toggle"}
        aria-pressed={isWatched}
        onClick={() => {
          sendGaEvent("video_watched_toggle", { video_id: ytid, action: isWatched ? "remove" : "add", source: "detail" });
          if (!isWatched) streak.record(ytid);
          watched.toggle(ytid);
        }}
      >
        <span aria-hidden="true">✓</span>
        <span>{isWatched ? "視聴済み" : "視聴済みにする"}</span>
      </button>
    </div>
  );
}
