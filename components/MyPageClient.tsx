"use client";

import { useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import BrandLogo, { BrandMark } from "@/components/BrandLogo";
import MetricHelp from "@/components/MetricHelp";
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
        body: "連続学習日数が3日以上になりました。",
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

  useEffect(() => {
    const media = window.matchMedia("(max-width: 640px)");
    const syncDetails = () => {
      const defaultOpenIds = new Set(media.matches ? ["my-summary"] : ["my-summary", "my-genre"]);
      const sections = Array.from(document.querySelectorAll<HTMLDetailsElement>(".my-section-details"));
      for (const section of sections) {
        section.open = defaultOpenIds.has(section.id);
      }
    };
    syncDetails();
    media.addEventListener("change", syncDetails);
    return () => media.removeEventListener("change", syncDetails);
  }, []);

  function openSection(id: string) {
    const section = document.getElementById(id);
    if (section instanceof HTMLDetailsElement) section.open = true;
  }

  return (
    <main className="my-page">
      <header className="my-header">
        <Link href="/" aria-label="Manapick トップへ">
          <BrandLogo compact />
        </Link>
        <Link href="/" className="my-header-link">トップへ</Link>
      </header>

      <section className="my-hero">
        <p className="section-eyebrow">My Manapick</p>
        <h1>この端末の学習記録</h1>
        <p>登録不要・ログイン不要。視聴済み・あとで見る・連続学習日数は、お使いのブラウザにだけ保存されます（他の端末とは共有されません）。</p>
        <div className="my-hero-actions">
          {recentVideo ? <Link href={videoPath(recentVideo.ytid)}>続きから見る</Link> : <Link href="/#search">動画を探す</Link>}
          <PwaInstallButton />
        </div>
      </section>

      <nav className="my-page-toc" aria-label="マイページ内メニュー">
        <a href="#my-summary" onClick={() => openSection("my-summary")}>サマリー</a>
        <a href="#my-genre" onClick={() => openSection("my-genre")}>ジャンル達成率</a>
        <a href="#my-guides" onClick={() => openSection("my-guides")}>ガイド進捗</a>
        <a href="#my-badges" onClick={() => openSection("my-badges")}>バッジ</a>
        <a href="#my-saved" onClick={() => openSection("my-saved")}>保存・履歴</a>
      </nav>

      <details id="my-summary" className="my-section-details" open>
        <summary className="my-accordion-summary">
          <span>サマリー</span>
          <small>今日の続きと学習状況</small>
        </summary>
        <section className="my-stat-grid" aria-label="学習サマリー">
          <MyStat
            label="連続学習日数"
            value={"🔥 " + (streak.ready ? streak.state.count : 0) + "日連続"}
            note="毎日1本見ると増えます"
            help="動画を『視聴済み』にした日が続くほど増えます。毎日1本でOK。1日あいても“お休みチケット”が自動で穴埋めします。"
          />
          <MyStat
            label="お休みチケット"
            value={"残り" + (streak.ready ? streak.state.freezes : 1) + "枚"}
            note="7日連続で1枚もらえる（自動で使われます）"
            help="1日見られなくても連続が途切れない“おまもり”です。もらい方＝最初に1枚、さらに7日連続するごとに1枚（最大3枚）。使い方＝操作は不要。1日あいても翌日また動画を見れば自動で1枚使われ、連続が続きます（2日以上あくとリセット）。"
          />
          <MyStat label="視聴済み" value={watched.items.length + "本"} note="手動で記録した本数" />
          <MyStat label="あとで見る" value={watchlist.items.length + "本"} note="保存中の動画" />
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
      </details>

      <details id="my-genre" className="my-section-details" open>
        <summary className="my-accordion-summary">
          <span>ジャンル達成率</span>
          <small>横にスワイプして確認</small>
        </summary>
        <section className="my-section" aria-labelledby="my-genre-title">
          <div className="my-section-heading">
            <div>
              <p className="section-eyebrow">ジャンル別</p>
              <h2 id="my-genre-title">達成率</h2>
            </div>
          </div>
          <p className="my-scroll-hint">横にスワイプ →</p>
          <div className="my-progress-list">
            {genreProgress.map((item) => (
              <ProgressRow key={item.key} label={item.label} count={item.count} total={item.total} percent={item.percent} />
            ))}
          </div>
        </section>
      </details>

      <details id="my-guides" className="my-section-details">
        <summary className="my-accordion-summary">
          <span>ガイド進捗</span>
          <small>ロードマップ別の進み具合</small>
        </summary>
        <section className="my-section" aria-labelledby="my-guide-title">
          <div className="my-section-heading">
            <div>
              <p className="section-eyebrow">修了バッジ</p>
              <h2 id="my-guide-title">ガイド別の進捗</h2>
            </div>
          </div>
          <div className="my-guide-grid">
            {guideProgress.map((guide) => (
              <Link key={guide.slug} className={guide.complete ? "my-guide-card is-complete" : "my-guide-card"} href={guide.href}>
                <span>{guide.complete ? "修了" : "進行中"}</span>
                <strong>{guide.title}</strong>
                <small>{guide.count}/{guide.total}本</small>
              </Link>
            ))}
          </div>
        </section>
      </details>

      <details id="my-badges" className="my-section-details">
        <summary className="my-accordion-summary">
          <span>バッジ</span>
          <small>横にスワイプして確認</small>
        </summary>
        <section className="my-section" aria-labelledby="my-badges-title">
          <div className="my-section-heading">
            <div>
              <p className="section-eyebrow">バッジ</p>
              <h2 id="my-badges-title">獲得状況</h2>
            </div>
          </div>
          <p className="my-scroll-hint">横にスワイプ →</p>
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
      </details>

      <details id="my-saved" className="my-section-details">
        <summary className="my-accordion-summary">
          <span>保存・履歴</span>
          <small>あとで見ると最近の記録</small>
        </summary>
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
      </details>

      <footer className="my-footer">
        <p><BrandMark className="h-7 w-7" /> <span>Manapick</span></p>
        <Link href="/">トップへ戻る</Link>
      </footer>
    </main>
  );
}

function MyStat({ label, value, note, help }: { label: string; value: string; note: string; help?: string }) {
  return (
    <article className={help ? "my-stat-card has-help" : "my-stat-card"}>
      <p>
        {label}
        {help ? <MetricHelp label={label}>{help}</MetricHelp> : null}
      </p>
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
    <Link className="my-video-row" href={videoPath(video.ytid)}>
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
    </Link>
  );
}
