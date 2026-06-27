"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  genreDisplayName,
  publishedGenreKeys,
  scoreText,
  videoPath,
  videos,
  youtubeThumbnail,
  type Video
} from "@/lib/manapick";

type Level = "初級" | "中級" | "上級" | "";
type TimeKey = "short" | "mid" | "long" | "";

const levelOptions: { label: string; value: Level; note: string }[] = [
  { label: "はじめて", value: "初級", note: "入口の1本から" },
  { label: "少し慣れた", value: "中級", note: "応用・整理へ" },
  { label: "しっかり", value: "上級", note: "実務寄りに進む" },
  { label: "こだわらない", value: "", note: "高スコア優先" }
];

const timeOptions: { label: string; value: TimeKey; note: string }[] = [
  { label: "スキマ時間", value: "short", note: "15分まで" },
  { label: "ふつう", value: "mid", note: "30分まで" },
  { label: "じっくり", value: "long", note: "30分以上" },
  { label: "こだわらない", value: "", note: "高スコア優先" }
];

function mins(video: Video) {
  return Number(video.minutes) || 0;
}

function rankVideos(a: Video, b: Video) {
  const confirmedA = a.scoreStatus === "confirmed" ? 0 : 1;
  const confirmedB = b.scoreStatus === "confirmed" ? 0 : 1;
  return confirmedA - confirmedB || (Number(b.score) || 0) - (Number(a.score) || 0) || mins(a) - mins(b);
}

function timeOk(video: Video, time: TimeKey) {
  const minutes = mins(video);
  if (time === "short") return minutes <= 15;
  if (time === "mid") return minutes <= 30;
  if (time === "long") return minutes > 30;
  return true;
}

function optionLabel(value: string, fallback: string) {
  return value || fallback;
}

function stepTitle(step: number) {
  if (step === 1) return "① ジャンルを選ぶ";
  if (step === 2) return "② レベルを選ぶ";
  return "③ 時間を選ぶ";
}

export default function StartQuiz() {
  const [step, setStep] = useState(1);
  const [genre, setGenre] = useState("");
  const [level, setLevel] = useState<Level>("");
  const [time, setTime] = useState<TimeKey>("");

  const result = useMemo(() => {
    if (!genre) return { items: [] as Video[], relaxed: false };

    const base = videos.filter((video) => video.genre === genre);
    const exact = base.filter((video) => (!level || video.level === level) && timeOk(video, time));
    if (exact.length > 0) return { items: [...exact].sort(rankVideos).slice(0, 3), relaxed: false };

    const sameLevel = base.filter((video) => !level || video.level === level);
    if (sameLevel.length > 0) return { items: [...sameLevel].sort(rankVideos).slice(0, 3), relaxed: true };

    return { items: [...base].sort(rankVideos).slice(0, 3), relaxed: true };
  }, [genre, level, time]);

  const selectedGenreName = genre ? genreDisplayName(genre) : "未選択";
  const selectedLevelName = optionLabel(level, "こだわらない");
  const selectedTimeName = timeOptions.find((item) => item.value === time)?.label ?? "こだわらない";

  function reset() {
    setStep(1);
    setGenre("");
    setLevel("");
    setTime("");
  }

  return (
    <section className="mt-6 rounded-2xl border border-line bg-white p-4 shadow-card min-[760px]:p-6" aria-labelledby="start-quiz-title">
      <div className="flex flex-col gap-3 min-[760px]:flex-row min-[760px]:items-center min-[760px]:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.08em] text-leaf">Start</p>
          <h2 id="start-quiz-title" className="text-2xl font-black leading-tight text-ink">
            {step >= 4 ? "診断結果" : stepTitle(step)}
          </h2>
        </div>
        <div className="flex items-center gap-2" aria-label={`ステップ ${Math.min(step, 3)} / 3`}>
          {[1, 2, 3].map((item) => (
            <span
              key={item}
              className={item <= Math.min(step, 3) ? "h-2.5 w-8 rounded-pill bg-primary" : "h-2.5 w-8 rounded-pill bg-bgSoft"}
              aria-hidden="true"
            />
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-xs font-black text-muted">
        <span className="rounded-pill bg-bg px-3 py-1">ジャンル: {selectedGenreName}</span>
        <span className="rounded-pill bg-bg px-3 py-1">レベル: {selectedLevelName}</span>
        <span className="rounded-pill bg-bg px-3 py-1">時間: {selectedTimeName}</span>
      </div>

      {step === 1 ? (
        <div className="mt-5">
          <p className="mb-3 text-sm font-bold text-muted">いま学びたいテーマを選んでください。</p>
          <div className="grid grid-cols-2 gap-2 min-[760px]:grid-cols-5">
            {publishedGenreKeys.map((key) => (
              <button
                key={key}
                type="button"
                className="min-h-14 rounded-lg border border-line bg-surface px-3 py-3 text-left text-sm font-black text-ink shadow-sm transition hover:-translate-y-0.5 hover:border-leaf hover:shadow-card focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transform-none"
                onClick={() => {
                  setGenre(key);
                  setStep(2);
                }}
              >
                {genreDisplayName(key)}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="mt-5">
          <p className="mb-3 text-sm font-bold text-muted">迷う場合は「はじめて」からで大丈夫です。</p>
          <div className="grid gap-2 min-[640px]:grid-cols-2">
            {levelOptions.map((option) => (
              <button
                key={option.label}
                type="button"
                className="min-h-16 rounded-lg border border-line bg-surface px-4 py-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-leaf hover:shadow-card focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transform-none"
                onClick={() => {
                  setLevel(option.value);
                  setStep(3);
                }}
              >
                <span className="block text-base font-black text-ink">{option.label}</span>
                <span className="block text-xs font-bold text-muted">{option.note}</span>
              </button>
            ))}
          </div>
          <button type="button" className="mt-3 rounded-lg px-3 py-2 text-sm font-black text-primary hover:bg-bg" onClick={() => setStep(1)}>
            ← ジャンルを選び直す
          </button>
        </div>
      ) : null}

      {step === 3 ? (
        <div className="mt-5">
          <p className="mb-3 text-sm font-bold text-muted">今すぐ使える時間に近いものを選んでください。</p>
          <div className="grid gap-2 min-[640px]:grid-cols-2">
            {timeOptions.map((option) => (
              <button
                key={option.label}
                type="button"
                className="min-h-16 rounded-lg border border-line bg-surface px-4 py-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-leaf hover:shadow-card focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transform-none"
                onClick={() => {
                  setTime(option.value);
                  setStep(4);
                }}
              >
                <span className="block text-base font-black text-ink">{option.label}</span>
                <span className="block text-xs font-bold text-muted">{option.note}</span>
              </button>
            ))}
          </div>
          <button type="button" className="mt-3 rounded-lg px-3 py-2 text-sm font-black text-primary hover:bg-bg" onClick={() => setStep(2)}>
            ← レベルを選び直す
          </button>
        </div>
      ) : null}

      {step >= 4 ? (
        <div className="mt-5">
          <div className="rounded-lg border border-leaf/30 bg-leaf/5 p-4">
            <p className="text-sm font-black text-leaf">あなたの“今日の1本”はこちら</p>
            <p className="mt-1 text-sm font-bold leading-7 text-muted">
              {genreDisplayName(genre)}の動画から、視聴確認済み・Manapickスコア順で提案しています。
              {result.relaxed ? " 条件に完全一致する動画が少ないため、近い候補も含めています。" : ""}
            </p>
          </div>

          <div className="mt-4 grid gap-3">
            {result.items.map((video, index) => (
              <ResultCard key={video.ytid} video={video} rank={index + 1} />
            ))}
          </div>

          <div className="mt-5 grid gap-2 min-[560px]:flex min-[560px]:flex-wrap">
            <Link
              href={`/genre/${genre}/`}
              className="inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-black text-white shadow-button transition hover:bg-primaryInk focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              {genreDisplayName(genre)}の一覧を見る
            </Link>
            <button
              type="button"
              className="inline-flex min-h-11 items-center justify-center rounded-lg border border-line bg-white px-4 py-2 text-sm font-black text-primary transition hover:border-leaf hover:bg-bg"
              onClick={reset}
            >
              もう一度診断する
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function ResultCard({ video, rank }: { video: Video; rank: number }) {
  const isFirst = rank === 1;
  const label = isFirst ? "まずこの1本" : `次の候補 ${rank}`;

  return (
    <Link
      href={videoPath(video.ytid)}
      className={[
        "group grid gap-3 rounded-xl border bg-surface p-3 text-ink no-underline shadow-sm transition hover:-translate-y-0.5 hover:shadow-card focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transform-none min-[700px]:grid-cols-[220px_1fr]",
        isFirst ? "border-leaf/50 bg-leaf/5" : "border-line"
      ].join(" ")}
    >
      <div className="relative aspect-video overflow-hidden rounded-lg bg-bgSoft">
        <Image
          src={youtubeThumbnail(video.ytid)}
          alt={`${video.title}のサムネイル`}
          width={480}
          height={270}
          sizes="(min-width: 700px) 220px, 92vw"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.025] motion-reduce:transform-none"
        />
        <span className="absolute left-2 top-2 rounded-pill bg-primary px-2.5 py-1 text-xs font-black text-white">
          {label}
        </span>
      </div>
      <div className="min-w-0">
        <p className="text-xs font-black text-leaf">
          {scoreText(video)} / {video.minutes}分 / {video.level}
        </p>
        <h3 className="mt-1 text-base font-black leading-6 text-ink min-[760px]:text-lg">
          {video.title}
        </h3>
        {video.review[0] ? <p className="mt-2 text-sm font-bold leading-7 text-muted">{video.review[0]}</p> : null}
      </div>
    </Link>
  );
}
