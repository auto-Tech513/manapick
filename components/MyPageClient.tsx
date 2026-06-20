"use client";

import { useEffect, useMemo } from "react";
import Image from "next/image";
import BrandLogo, { BrandMark } from "@/components/BrandLogo";
import PwaInstallButton from "@/components/PwaInstallButton";
import genresData from "@/content/genres.json";
import videosData from "@/content/videos.json";
import { guidePath, guideStepVideos, guides } from "@/lib/guides";
import { BADGES_KEY, RECENT_KEY, WATCHED_KEY, WATCHLIST_KEY, sendGaEvent } from "@/lib/retention";
import { genreDisplayName, genreLabel, scoreText, videoPath, youtubeThumbnail, type Genre, type Video } from "@/lib/manapick";
import { useLocalList } from "@/lib/useLocalList";
import { useStreakState } from "@/lib/useStreakState";

const videos = videosData as Video[];
const genres = genresData as Genre[];
const videoById = new Map(videos.map((video) => [video.ytid, video]));
const publishedGenres = genres.filter((genre) => genre.status === "published");

function readStoredBadges() {
  try {
    const raw = window.localStorage.getItem(BADGES_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

function writeStoredBadges(ids: string[]) {
  try {
    window.localStorage.setItem(BADGES_KEY, JSON.stringify(ids));
  } catch {
    // Badges are a local enhancement; the page remains usable without writes.
  }
}

export default function MyPageClient() {
  const watched = useLocalList(WATCHED_KEY);
  const watchlist = useLocalList(WATCHLIST_KEY);
  const recent = useLocalList(RECENT_KEY);
  const streak = useStreakState();

  useEffect(() => {
    sendGaEvent("my_open", { source: "my_page" });
  }, []);

  const watchedSet = useMemo(() => new Set(watched.items), [watched.items]);
  const watchedVideos = useMemo(() => watched.items.map((ytid) => videoById.get(ytid)).filter((video): video is Video => Boolean(video)), [watched.items]);
  const watchlistVideos = useMemo(() => watchlist.items.map((ytid) => videoById.get(ytid)).filter((video): video is Video => Boolean(video)), [watchlist.items]);
  const recentVideo = useMemo(() => recent.items.map((ytid) => videoById.get(ytid)).find(Boolean) ?? null, [recent.items]);

  const genreProgress = useMemo(() => {
    return publishedGenres.map((genre) => {
      const pool = videos.filter((video) => video.genre === genre.key);
      const count = pool.filter((video) => watchedSet.has(video.ytid)).length;
      return {
        key: genre.key,
        label: genreDisplayName(genre.key),
        count,
        total: pool.length,
        percent: pool.length > 0 ? Math.round((count / pool.length) * 100) : 0
      };
    });
  }, [watchedSet]);

  const guideProgress = useMemo(() => {
    return guides.map((guide) => {
      const ids = guide.steps.flatMap((step) => guideStepVideos(step).map(({ video }) => video.ytid));
      const uniqueIds = Array.from(new Set(ids));
      const count = uniqueIds.filter((ytid) => watchedSet.has(ytid)).length;
      return {
        slug: guide.slug,
        title: guide.title.replace("【YouTube無料・2026年版】", ""),
        href: guidePath(guide.slug),
        count,
        total: uniqueIds.length,
        complete: uniqueIds.length > 0 && count === uniqueIds.length
      };
    });
  }, [watchedSet]);

  const earnedBadges = useMemo(() => {
    const badges = [
      {
        id: "first-video",
        label: "はじめの1本",
        body: "最初の動画を視聴済みにしました。",
        earned: watched.items.length >= 1
      },
      {
        id: "three-day",
        label: "3日継続",
        body: "学習ストリークが3日以上になりました。",
        earned: streak.state.count >= 3
      },
      {
        id: "five-videos",
        label: "5本視聴",
        body: "学習動画を5本視聴済みにしました。",
        earned: watched.items.length >= 5
      },
      {
        id: "genre-explorer",
        label: "ジャンル開拓",
        body: "3ジャンル以上で動画を見ました。",
        earned: new Set(watchedVideos.map((video) => video.genre)).size >= 3
      },
      {
        id: "watchlist-ready",
        label: "あとで見る活用",
        body: "気になる動画を保存しました。",
        earned: watchlist.items.length >= 1
      },
      {
        id: "guide-complete",
        label: "ロードマップ修了",
        body: "いずれかのガイド動画をすべて視聴しました。",
        earned: guideProgress.some((guide) => guide.complete)
      }
    ];
    return badges;
  }, [guideProgress, streak.state.count, watched.items.length, watchedVideos, watchlist.items.length]);

  useEffect(() => {
    if (!watched.ready || !watchlist.ready || !streak.ready) return;
    const stored = new Set(readStoredBadges());
    const newlyEarned = earnedBadges.filter((badge) => badge.earned && !stored.has(badge.id));
    if (newlyEarned.length === 0) return;
    for (const badge of newlyEarned) {
      sendGaEvent("badge_earned", { badge_id: badge.id, badge_label: badge.label });
      stored.add(badge.id);
    }
    writeStoredBadges(Array.from(stored));
  }, [earnedBadges, streak.ready, watched.ready, watchlist.ready]);

  return (
    <main className="my-page">
      <header className="my-header">
        <a href="/" aria-label="Manapick トップへ">
          <BrandLogo compact />
        </a>
        <a href="/" className="my-header-link">トップへ</a>
      </header>

      <section className="my-hero">
        <p className="section-eyebrow">My Manapick</p>
        <h1>この端末の学習記録</h1>
        <p>登録不要・同期なし。視聴済み、あとで見る、ストリークはこの端末のlocalStorageに保存されます。</p>
        <div className="my-hero-actions">
          {recentVideo ? <a href={videoPath(recentVideo.ytid)}>続きから見る</a> : <a href="/#search">動画を探す</a>}
          <PwaInstallButton />
        </div>
      </section>

      <section className="my-stat-grid" aria-label="学習サマリー">
        <MyStat label="ストリーク" value={(streak.ready ? streak.state.count : 0) + "日"} note={"フリーズ " + (streak.ready ? streak.state.freezes : 1) + "回"} />
        <MyStat label="視聴済み" value={watched.items.length + "本"} note="手動で記録した本数" />
        <MyStat label="あとで見る" value={watchlist.items.length + "本"} note="保存中の動画" />
        <MyStat label="学習日" value={(streak.ready ? streak.state.studyDates.length : 0) + "日"} note="この端末で記録" />
      </section>

      <section className="my-section" aria-labelledby="my-continue-title">
        <div className="my-section-heading">
          <div>
            <p className="section-eyebrow">続きから</p>
            <h2 id="my-continue-title">最後に開いた動画</h2>
          </div>
        </div>
        {recentVideo ? <MyVideoRow video={recentVideo} /> : <p className="my-empty">動画ページを開くと、ここから1タップで戻れます。</p>}
      </section>

      <section className="my-section" aria-labelledby="my-badges-title">
        <div className="my-section-heading">
          <div>
            <p className="section-eyebrow">バッジ</p>
            <h2 id="my-badges-title">獲得状況</h2>
          </div>
        </div>
        <div className="my-badge-grid">
          {earnedBadges.map((badge) => (
            <article key={badge.id} className={badge.earned ? "my-badge is-earned" : "my-badge"}>
              <span aria-hidden="true">{badge.earned ? "✓" : "○"}</span>
              <h3>{badge.label}</h3>
              <p>{badge.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="my-section" aria-labelledby="my-genre-title">
        <div className="my-section-heading">
          <div>
            <p className="section-eyebrow">ジャンル別</p>
            <h2 id="my-genre-title">達成率</h2>
          </div>
        </div>
        <div className="my-progress-list">
          {genreProgress.map((item) => (
            <ProgressRow key={item.key} label={item.label} count={item.count} total={item.total} percent={item.percent} />
          ))}
        </div>
      </section>

      <section className="my-section" aria-labelledby="my-guide-title">
        <div className="my-section-heading">
          <div>
            <p className="section-eyebrow">修了バッジ</p>
            <h2 id="my-guide-title">ガイド別の進捗</h2>
          </div>
        </div>
        <div className="my-guide-grid">
          {guideProgress.map((guide) => (
            <a key={guide.slug} className={guide.complete ? "my-guide-card is-complete" : "my-guide-card"} href={guide.href}>
              <span>{guide.complete ? "修了" : "進行中"}</span>
              <strong>{guide.title}</strong>
              <small>{guide.count}/{guide.total}本</small>
            </a>
          ))}
        </div>
      </section>

      <section className="my-section" aria-labelledby="my-watchlist-title">
        <div className="my-section-heading">
          <div>
            <p className="section-eyebrow">あとで見る</p>
            <h2 id="my-watchlist-title">保存した動画</h2>
          </div>
        </div>
        {watchlistVideos.length > 0 ? (
          <div className="my-video-list">
            {watchlistVideos.slice(0, 12).map((video) => <MyVideoRow key={video.ytid} video={video} />)}
          </div>
        ) : (
          <p className="my-empty">動画カードの保存ボタンから、気になる動画をあとで見るに追加できます。</p>
        )}
      </section>

      <section className="my-section" aria-labelledby="my-watched-title">
        <div className="my-section-heading">
          <div>
            <p className="section-eyebrow">視聴済み</p>
            <h2 id="my-watched-title">最近の記録</h2>
          </div>
        </div>
        {watchedVideos.length > 0 ? (
          <div className="my-video-list">
            {watchedVideos.slice(0, 12).map((video) => <MyVideoRow key={video.ytid} video={video} />)}
          </div>
        ) : (
          <p className="my-empty">動画ページで「視聴済みにする」を押すと、ここに記録されます。</p>
        )}
      </section>

      <footer className="my-footer">
        <p><BrandMark className="h-7 w-7" /> <span>Manapick</span></p>
        <a href="/">トップへ戻る</a>
      </footer>
    </main>
  );
}

function MyStat({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <article className="my-stat-card">
      <p>{label}</p>
      <strong>{value}</strong>
      <span>{note}</span>
    </article>
  );
}

function ProgressRow({ label, count, total, percent }: { label: string; count: number; total: number; percent: number }) {
  return (
    <div className="my-progress-row">
      <div>
        <strong>{label}</strong>
        <span>{count}/{total}本</span>
      </div>
      <div className="my-progress-track" aria-hidden="true">
        <span style={{ width: percent + "%" }} />
      </div>
      <small>{percent}%</small>
    </div>
  );
}

function MyVideoRow({ video }: { video: Video }) {
  return (
    <a className="my-video-row" href={videoPath(video.ytid)}>
      <span className="my-video-thumb">
        <Image
          src={youtubeThumbnail(video.ytid)}
          alt={video.title + "のサムネイル"}
          width={240}
          height={135}
          sizes="(min-width: 760px) 140px, 30vw"
          loading="lazy"
        />
      </span>
      <span className="my-video-body">
        <strong>{video.title}</strong>
        <span>{genreLabel(video.genre)} / {video.sub} / {scoreText(video)} / {video.minutes}分</span>
      </span>
    </a>
  );
}

