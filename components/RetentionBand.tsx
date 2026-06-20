"use client";

import Image from "next/image";
import MetricHelp from "@/components/MetricHelp";
import PwaInstallButton from "@/components/PwaInstallButton";
import { sendGaEvent, type StreakState } from "@/lib/retention";
import { genreLabel, scoreText, videoPath, youtubeThumbnail, type Video } from "@/lib/manapick";

type RetentionBandProps = {
  todayVideo: Video | null;
  continueVideo: Video | null;
  streak: StreakState;
  ready: boolean;
  watchedCount: number;
  watchlistCount: number;
};

export default function RetentionBand({
  todayVideo,
  continueVideo,
  streak,
  ready,
  watchedCount,
  watchlistCount
}: RetentionBandProps) {
  if (!todayVideo) return null;

  return (
    <section className="retention-band" aria-labelledby="today-pick-title">
      <div className="retention-band-inner">
        <a
          className="today-pick-chip"
          href={videoPath(todayVideo.ytid)}
          onClick={() => sendGaEvent("today_open", { video_id: todayVideo.ytid, score: todayVideo.score ?? 0 })}
        >
          <span className="today-pick-thumb">
            <Image
              src={youtubeThumbnail(todayVideo.ytid)}
              alt={todayVideo.title + "のサムネイル"}
              width={160}
              height={90}
              sizes="88px"
              loading="lazy"
            />
          </span>
          <span className="today-pick-copy">
            <span className="retention-eyebrow retention-eyebrow-desktop">今日の1本</span>
            <span className="retention-eyebrow retention-eyebrow-mobile">今日の学習</span>
            <strong id="today-pick-title">{todayVideo.title}</strong>
            <span>{genreLabel(todayVideo.genre)} / {scoreText(todayVideo)} / {todayVideo.minutes}分</span>
          </span>
        </a>

        <div className="retention-stats" aria-label="この端末の学習記録">
          <span className="retention-stat">
            <strong>🔥 {ready ? streak.count : 0}日連続</strong>
            <small>
              連続学習日数
              <MetricHelp label="連続学習日数">毎日1本見ると増えます。</MetricHelp>
            </small>
          </span>
          <span className="retention-stat retention-ticket-stat">
            <strong>残り{ready ? streak.freezes : 1}枚</strong>
            <small>
              お休みチケット
              <MetricHelp label="お休みチケット">1日見られなくても連続が途切れません。</MetricHelp>
            </small>
          </span>
          <span className="retention-stat">
            <strong>視聴{watchedCount}</strong>
            <small>視聴済み</small>
          </span>
          <span className="retention-stat">
            <strong>保存{watchlistCount}</strong>
            <small>あとで見る</small>
          </span>
          {continueVideo ? (
            <a className="retention-stat retention-mobile-chip" href={videoPath(continueVideo.ytid)}>
              続きから
            </a>
          ) : null}
          <a className="retention-stat retention-mobile-chip retention-mobile-my" href="/my/" onClick={() => sendGaEvent("my_open", { source: "top_band_mobile" })}>
            マイページ
          </a>
        </div>

        <div className="retention-actions">
          {continueVideo ? (
            <a className="retention-link" href={videoPath(continueVideo.ytid)}>
              続きから
            </a>
          ) : null}
          <a className="retention-link is-primary" href="/my/" onClick={() => sendGaEvent("my_open", { source: "top_band" })}>
            マイページ
          </a>
          <PwaInstallButton />
          <p>この端末で記録中</p>
        </div>
      </div>
    </section>
  );
}
