"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  manapickAiUrlForGenre,
  manapickCareerUrlForGenre,
  manapickLicenseUrlForGenre
} from "@/lib/brand-links";
import { sendGaEvent } from "@/lib/retention";

export type StudyPlanVideo = {
  ytid: string;
  genre: string;
  title: string;
  sub: string;
  level: string;
  minutes: number;
  score: number | null;
  detailUrl: string;
  thumbnailUrl: string;
  sequence: number;
};

export type StudyPlanGenre = {
  key: string;
  label: string;
  count: number;
};

type StudyPlanBuilderProps = {
  genres: StudyPlanGenre[];
  videos: StudyPlanVideo[];
};

type SavedPlan = {
  genre: string;
  dailyMinutes: number;
  frequency: number;
};

const STORAGE_KEY = "manapick-study-plan-v1";
const sessionDays: Record<number, number[]> = {
  3: [1, 3, 6],
  5: [1, 2, 4, 5, 7],
  7: [1, 2, 3, 4, 5, 6, 7]
};

function selectPlanVideos(videos: StudyPlanVideo[], dailyMinutes: number, frequency: number) {
  const durationCeiling = Math.max(dailyMinutes + 5, Math.round(dailyMinutes * 1.35));
  const fitting = videos.filter((video) => video.minutes <= durationCeiling);
  const source = fitting.length >= frequency ? fitting : videos;

  return [...source]
    .sort((a, b) => a.sequence - b.sequence || (b.score ?? -1) - (a.score ?? -1) || a.minutes - b.minutes)
    .slice(0, frequency);
}

function scheduleForWeek(videos: StudyPlanVideo[], frequency: number) {
  const learningDays = sessionDays[frequency] ?? sessionDays[5];
  let videoIndex = 0;

  return Array.from({ length: 7 }, (_, index) => {
    const day = index + 1;
    const isLearningDay = learningDays.includes(day);
    const video = isLearningDay ? videos[videoIndex++] ?? null : null;
    return { day, video };
  });
}

export default function StudyPlanBuilder({ genres, videos }: StudyPlanBuilderProps) {
  const [genre, setGenre] = useState(genres[0]?.key ?? "ai");
  const [dailyMinutes, setDailyMinutes] = useState(15);
  const [frequency, setFrequency] = useState(5);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const value = JSON.parse(raw) as Partial<SavedPlan>;
      if (typeof value.genre === "string" && genres.some((item) => item.key === value.genre)) setGenre(value.genre);
      if ([15, 30, 60].includes(Number(value.dailyMinutes))) setDailyMinutes(Number(value.dailyMinutes));
      if ([3, 5, 7].includes(Number(value.frequency))) setFrequency(Number(value.frequency));
      setSaved(true);
    } catch {
      // A malformed local value should never block the planner.
    }
  }, [genres]);

  const selectedGenre = genres.find((item) => item.key === genre) ?? genres[0];
  const genreVideos = useMemo(() => videos.filter((video) => video.genre === genre), [genre, videos]);
  const selectedVideos = useMemo(
    () => selectPlanVideos(genreVideos, dailyMinutes, frequency),
    [dailyMinutes, frequency, genreVideos]
  );
  const schedule = useMemo(() => scheduleForWeek(selectedVideos, frequency), [frequency, selectedVideos]);
  const totalMinutes = selectedVideos.reduce((total, video) => total + video.minutes, 0);

  function savePlan() {
    const value: SavedPlan = { genre, dailyMinutes, frequency };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    setSaved(true);
    sendGaEvent("study_plan_save", { genre, daily_minutes: dailyMinutes, frequency });
  }

  return (
    <div className="study-plan-builder">
      <section className="study-plan-controls" aria-labelledby="study-plan-controls-title">
        <div className="study-plan-controls-heading">
          <p className="section-eyebrow">3つだけ選ぶ</p>
          <h2 id="study-plan-controls-title">今週の学ぶ順番を作る</h2>
          <p>動画の尺は目安です。長い動画は途中で止めても、翌日に続きから見られます。</p>
        </div>

        <fieldset>
          <legend><span>1</span> 学びたいジャンル</legend>
          <div className="study-plan-option-grid is-genres">
            {genres.map((item) => (
              <button
                key={item.key}
                type="button"
                className={genre === item.key ? "is-active" : ""}
                aria-pressed={genre === item.key}
                onClick={() => {
                  setGenre(item.key);
                  setSaved(false);
                }}
              >
                <strong>{item.label}</strong>
                <small>{item.count}本</small>
              </button>
            ))}
          </div>
        </fieldset>

        <div className="study-plan-control-row">
          <fieldset>
            <legend><span>2</span> 1日に使える時間</legend>
            <div className="study-plan-option-grid">
              {[15, 30, 60].map((minutes) => (
                <button
                  key={minutes}
                  type="button"
                  className={dailyMinutes === minutes ? "is-active" : ""}
                  aria-pressed={dailyMinutes === minutes}
                  onClick={() => {
                    setDailyMinutes(minutes);
                    setSaved(false);
                  }}
                >
                  <strong>{minutes}分</strong>
                  <small>{minutes === 15 ? "通勤・休憩" : minutes === 30 ? "毎日少しずつ" : "じっくり学ぶ"}</small>
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend><span>3</span> 1週間の学習日数</legend>
            <div className="study-plan-option-grid">
              {[3, 5, 7].map((days) => (
                <button
                  key={days}
                  type="button"
                  className={frequency === days ? "is-active" : ""}
                  aria-pressed={frequency === days}
                  onClick={() => {
                    setFrequency(days);
                    setSaved(false);
                  }}
                >
                  <strong>週{days}日</strong>
                  <small>{days === 3 ? "無理なく" : days === 5 ? "平日中心" : "毎日進める"}</small>
                </button>
              ))}
            </div>
          </fieldset>
        </div>
      </section>

      <section className="study-plan-result" aria-live="polite" aria-labelledby="study-plan-result-title">
        <div className="study-plan-result-head">
          <div>
            <p className="section-eyebrow">あなたの7日プラン</p>
            <h2 id="study-plan-result-title">{selectedGenre?.label}を、週{frequency}日で進める</h2>
            <p>合計{selectedVideos.length}本・約{totalMinutes}分。ロードマップの順番と所要時間から選んでいます。</p>
          </div>
          <button type="button" className={saved ? "is-saved" : ""} onClick={savePlan}>
            {saved ? "この端末に保存済み" : "このプランを保存"}
          </button>
        </div>

        <ol className="study-plan-week">
          {schedule.map(({ day, video }) => (
            <li key={day} className={video ? "is-learning" : "is-review"}>
              <span className="study-plan-day">DAY {day}</span>
              {video ? (
                <Link href={video.detailUrl} onClick={() => sendGaEvent("study_plan_video_click", { genre, day, ytid: video.ytid })}>
                  <Image
                    src={video.thumbnailUrl}
                    alt={`${video.title}のサムネイル`}
                    width={320}
                    height={180}
                    sizes="(max-width: 767px) 108px, 160px"
                  />
                  <span className="study-plan-video-copy">
                    <small>{video.level}・{video.sub}</small>
                    <strong>{video.title}</strong>
                    <span>{video.score === null ? "スコア準備中" : `${video.score}/35`} ／ {video.minutes}分</span>
                  </span>
                </Link>
              ) : (
                <div className="study-plan-review-copy">
                  <strong>5分だけ振り返る</strong>
                  <span>前回のメモを1つ見返す日。新しい動画を増やさなくて大丈夫です。</span>
                </div>
              )}
            </li>
          ))}
        </ol>

        <div className="study-plan-primary-action">
          {selectedVideos[0] ? <Link href={selectedVideos[0].detailUrl}>DAY 1の動画を見る</Link> : null}
          <span>保存内容はお使いのブラウザだけに残り、他の端末とは共有されません。</span>
        </div>
      </section>

      <section className="study-plan-next" aria-labelledby="study-plan-next-title">
        <div>
          <p className="section-eyebrow">無料動画の次に必要なら</p>
          <h2 id="study-plan-next-title">AI・資格・仕事へ、目的を保ったまま進む</h2>
          <p>先に無料動画を試し、必要性が分かってから比較先を選べます。紹介料で学習動画の順位は変えません。</p>
        </div>
        <div className="study-plan-network-grid">
          <a className="is-ai" href={manapickAiUrlForGenre(genre)} target="_blank" rel="noopener noreferrer">
            <span>AIを選ぶ</span><strong>manapick AI</strong><small>料金・無料枠・使い方を確認</small>
          </a>
          <a className="is-license" href={manapickLicenseUrlForGenre(genre)} target="_blank" rel="noopener noreferrer">
            <span>資格を選ぶ</span><strong>manapick license</strong><small>要件・費用・申込方法を確認</small>
          </a>
          <a className="is-career" href={manapickCareerUrlForGenre(genre)} target="_blank" rel="noopener noreferrer">
            <span>仕事を知る</span><strong>manapick career</strong><small>仕事内容・必要スキルを確認</small>
          </a>
          <Link className="is-shop" href="/shop/">
            <span>必要なときだけ</span><strong>補助教材を見る</strong><small>広告・PRを明示して紹介</small>
          </Link>
        </div>
      </section>
    </div>
  );
}
