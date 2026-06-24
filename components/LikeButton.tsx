"use client";

import { useEffect, useState } from "react";
import { sendGaEvent } from "@/lib/retention";

const LIKED_STORAGE_KEY = "manapick:liked:v1";

type LikeButtonProps = {
  ytid: string;
  initialCount?: number;
  className?: string;
};

function readLikedIds() {
  if (typeof window === "undefined") return new Set<string>();
  try {
    const raw = window.localStorage.getItem(LIKED_STORAGE_KEY);
    const ids = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(ids) ? ids.filter((id): id is string => typeof id === "string") : []);
  } catch {
    return new Set<string>();
  }
}

function writeLikedIds(ids: Set<string>) {
  try {
    window.localStorage.setItem(LIKED_STORAGE_KEY, JSON.stringify(Array.from(ids)));
  } catch {
    // localStorageが使えない環境でも、ボタン自体は通常表示のままにします。
  }
}

function canUseLikeApi() {
  if (typeof window === "undefined") return false;
  return window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1";
}

export default function LikeButton({ ytid, initialCount = 0, className = "" }: LikeButtonProps) {
  const [count, setCount] = useState(initialCount);
  const [liked, setLiked] = useState(false);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    setCount(initialCount);
  }, [initialCount]);

  useEffect(() => {
    const likedIds = readLikedIds();
    setLiked(likedIds.has(ytid));
    if (!canUseLikeApi()) return;

    let cancelled = false;
    fetch(`/api/like?ids=${encodeURIComponent(ytid)}`)
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { counts?: Record<string, number> } | null) => {
        if (cancelled) return;
        const nextCount = data?.counts?.[ytid];
        if (typeof nextCount === "number" && Number.isFinite(nextCount)) {
          setCount(nextCount);
        }
      })
      .catch(() => {
        // KV未設定や一時的な通信失敗では、初期値のまま静かに表示します。
      });

    return () => {
      cancelled = true;
    };
  }, [ytid]);

  async function handleClick() {
    if (liked || pending) return;

    const likedIds = readLikedIds();
    if (likedIds.has(ytid)) {
      setLiked(true);
      return;
    }

    const optimisticCount = count + 1;
    likedIds.add(ytid);
    writeLikedIds(likedIds);
    setLiked(true);
    setCount(optimisticCount);

    if (!canUseLikeApi()) {
      sendGaEvent("video_like", { video_id: ytid, count: optimisticCount });
      return;
    }

    setPending(true);

    try {
      const response = await fetch("/api/like", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id: ytid })
      });
      if (response.ok) {
        const data = (await response.json()) as { count?: number };
        if (typeof data.count === "number" && Number.isFinite(data.count) && data.count > 0) {
          setCount(data.count);
        }
      }
      sendGaEvent("video_like", { video_id: ytid, count: optimisticCount });
    } catch {
      // 失敗時もユーザー操作は尊重し、画面上の状態を戻さずフェイルソフトにします。
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      className={["like-btn", liked ? "is-liked" : "", className].filter(Boolean).join(" ")}
      aria-pressed={liked}
      aria-label={`役に立った ${count}件`}
      disabled={liked || pending}
      onClick={handleClick}
    >
      <span aria-hidden="true">👍</span>
      <span>役に立った</span>
      <span className="like-count">（{count}）</span>
    </button>
  );
}
