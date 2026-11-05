"use client";

import Image from "next/image";
import { useState } from "react";

export default function VideoEmbed({
  ytid,
  title,
  poster,
  posterWidth = 1280,
  posterHeight = 720
}: {
  ytid: string;
  title: string;
  // ファサードのポスターは Discover の大きな画像と同一のものを使う。
  poster?: string;
  posterWidth?: number;
  posterHeight?: number;
}) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <div className="video-embed-frame">
        <iframe
          src={"https://www.youtube-nocookie.com/embed/" + ytid + "?autoplay=1&rel=0"}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      className="video-embed-facade"
      onClick={() => setPlaying(true)}
      aria-label={title + "をこのページで再生する"}
    >
      <Image
        src={poster ?? "https://i.ytimg.com/vi/" + ytid + "/hqdefault.jpg"}
        alt={title + "のサムネイル"}
        width={poster ? posterWidth : 480}
        height={poster ? posterHeight : 360}
        priority
        sizes="(min-width: 980px) 520px, 100vw"
        className="video-detail-thumb"
      />
      <span className="video-embed-play" aria-hidden="true">
        <svg viewBox="0 0 24 24" focusable="false">
          <path d="M8 5v14l11-7z" fill="currentColor" />
        </svg>
      </span>
      <span className="video-embed-hint">このページで再生</span>
    </button>
  );
}
