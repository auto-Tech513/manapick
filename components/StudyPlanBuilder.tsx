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
import PwaInstallButton from "@/components/PwaInstallButton";
import StudyPlanCalendar from "@/components/StudyPlanCalendar";

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

export type StudyPlanSession = {
  day: number;
  videos: StudyPlanVideo[];
  minutes: number;
};

// 1回の学習時間（dailyMinutes）に収まるよう、ロードマップ順の動画を学習日ごとに詰める。
// 上限は目安時間の115%。目安の85%に達したらその日は締める。どの動画も収まらない日は、残りで最も短い1本を入れる。
function buildSessions(videos: StudyPlanVideo[], dailyMinutes: number, frequency: number): StudyPlanSession[] {
  const learningDays = sessionDays[frequency] ?? sessionDays[5];
  const cap = Math.round(dailyMinutes * 1.15);
  const queue = [...videos].sort(
    (a, b) => a.sequence - b.sequence || (b.score ?? -1) - (a.score ?? -1) || a.minutes - b.minutes
  );
  const sessions: StudyPlanSession[] = [];

  for (const day of learningDays) {
    const picked: StudyPlanVideo[] = [];
    let total = 0;
    for (let index = 0; index < queue.length; ) {
      const video = queue[index];
      if (total + video.minutes <= cap) {
        picked.push(video);
        total += video.minutes;
        queue.splice(index, 1);
        if (total >= dailyMinutes * 0.85) break;
      } else {
        index += 1;
      }
    }
    if (picked.length === 0 && queue.length > 0) {
      let shortest = 0;
      queue.forEach((video, index) => {
        if (video.minutes < queue[shortest].minutes) shortest = index;
      });
      const [video] = queue.splice(shortest, 1);
      picked.push(video);
      total = video.minutes;
    }
    if (picked.length === 0) break;
    picked.sort((a, b) => a.sequence - b.sequence);
    sessions.push({ day, videos: picked, minutes: total });
  }

  return sessions;
}

export default function StudyPlanBuilder({ genres, videos }: StudyPlanBuilderProps) {
  const [genre, setGenre] = useState(genres[0]?.key ?? "ai");
  const [dailyMinutes, setDailyMinutes] = useState(15);
  const [frequency, setFrequency] = useState(5);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let restoreTimer: number | undefined;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const value = JSON.parse(raw) as Partial<SavedPlan>;
      restoreTimer = window.setTimeout(() => {
        if (typeof value.genre === "string" && genres.some((item) => item.key === value.genre)) setGenre(value.genre);
        if ([15, 30, 60].includes(Number(value.dailyMinutes))) setDailyMinutes(Number(value.dailyMinutes));
        if ([3, 5, 7].includes(Number(value.frequency))) setFrequency(Number(value.frequency));
        setSaved(true);
      }, 0);
    } catch {
      // A malformed local value should never block the planner.
    }

    return () => {
      if (restoreTimer !== undefined) window.clearTimeout(restoreTimer);
    };
  }, [genres]);

  const selectedGenre = genres.find((item) => item.key === genre) ?? genres[0];
  const genreVideos = useMemo(() => videos.filter((video) => video.genre === genre), [genre, videos]);
  const sessions = useMemo(
    () => buildSessions(genreVideos, dailyMinutes, frequency),
    [dailyMinutes, frequency, genreVideos]
  );
  const videoCount = sessions.reduce((total, session) => total + session.videos.length, 0);
  const totalMinutes = sessions.reduce((total, session) => total + session.minutes, 0);
  const restDays = Array.from({ length: 7 }, (_, index) => index + 1).filter(
    (day) => !sessions.some((session) => session.day === day)
  );
  const firstVideo = sessions[0]?.videos[0];

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
          <p>選んだ時間に収まるよう、1回に見る動画を組み合わせます。動画の尺は目安です。</p>
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
            <legend><span>2</span> 1回に使える時間</legend>
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
            <h2 id="study-plan-result-title">{selectedGenre?.label}を、週{sessions.length}回・1回約{dailyMinutes}分で進める</h2>
            <p>合計{videoCount}本・約{totalMinutes}分。ロードマップの順番に、1回{dailyMinutes}分前後に収まる動画を組み合わせています。</p>
          </div>
          <button type="button" className={saved ? "is-saved" : ""} onClick={savePlan}>
            {saved ? "この端末に保存済み" : "このプランを保存"}
          </button>
        </div>

        <ol className="study-plan-week is-sessions">
          {sessions.map((session) => (
            <li key={session.day} className="study-plan-session">
              <div className="study-plan-session-head">
                <span className="study-plan-day">DAY {session.day}</span>
                <strong>{session.videos.length}本・約{session.minutes}分</strong>
              </div>
              <ol className="study-plan-session-videos">
                {session.videos.map((video) => (
                  <li key={video.ytid}>
                    <Link
                      href={video.detailUrl}
                      onClick={() => sendGaEvent("study_plan_video_click", { genre, day: session.day, ytid: video.ytid })}
                    >
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
                  </li>
                ))}
              </ol>
            </li>
          ))}
        </ol>
        {restDays.length > 0 && sessions.length > 0 ? (
          <p className="study-plan-rest-days">DAY {restDays.join("・")} はお休みです。</p>
        ) : null}

        <div className="study-plan-primary-action">
          {firstVideo ? <Link href={firstVideo.detailUrl}>DAY 1の動画を見る</Link> : null}
          <span>保存内容はお使いのブラウザだけに残り、他の端末とは共有されません。</span>
        </div>

        <StudyPlanCalendar genreKey={genre} genreLabel={selectedGenre?.label ?? genre} sessions={sessions} />

        <div className="study-plan-install">
          <p>毎日すぐ開けるように、ホーム画面にManapickを置けます。</p>
          <PwaInstallButton />
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
