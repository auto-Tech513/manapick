"use client";

import { useEffect, useMemo, useState } from "react";
import { sendGaEvent } from "@/lib/retention";
import {
  absoluteUrl,
  buildIcs,
  googleCalendarUrl,
  localDateTime,
  toDateInputValue,
  toUtcStamp,
  type CalendarEvent
} from "@/lib/study-calendar";

type ScheduleDay = {
  day: number;
  video: { ytid: string; title: string; sub: string; minutes: number; detailUrl: string } | null;
};

type StudyPlanCalendarProps = {
  genreKey: string;
  genreLabel: string;
  schedule: ScheduleDay[];
};

const PLAN_URL = absoluteUrl("/study-plan/");

export default function StudyPlanCalendar({ genreKey, genreLabel, schedule }: StudyPlanCalendarProps) {
  const [startDate, setStartDate] = useState("");
  const [time, setTime] = useState("21:00");
  const [includeReview, setIncludeReview] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  // 「明日」は閲覧者の端末の日付で決める（静的HTMLに日付を焼き込まない）。
  useEffect(() => {
    const timer = window.setTimeout(() => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setStartDate(toDateInputValue(tomorrow));
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const events = useMemo<{ day: number; event: CalendarEvent }[]>(() => {
    if (!startDate) return [];
    const items: { day: number; event: CalendarEvent }[] = [];
    for (const { day, video } of schedule) {
      const start = localDateTime(startDate, time, day - 1);
      if (!start) continue;
      if (video) {
        const minutes = Math.max(5, Math.round(video.minutes));
        items.push({
          day,
          event: {
            uid: `${video.ytid}-${toUtcStamp(start).slice(0, 8)}@manapick.app`,
            title: `Manapick DAY ${day}｜${video.title}`,
            description: `${genreLabel}・${video.sub}・約${minutes}分\n動画を開く: ${absoluteUrl(video.detailUrl)}\n7日学習プラン: ${PLAN_URL}`,
            url: absoluteUrl(video.detailUrl),
            start,
            end: new Date(start.getTime() + minutes * 60_000)
          }
        });
      } else if (includeReview) {
        items.push({
          day,
          event: {
            uid: `review-${genreKey}-${toUtcStamp(start).slice(0, 8)}@manapick.app`,
            title: `Manapick DAY ${day}｜5分だけ振り返る`,
            description: `前回の要点を1つ思い出す日です。\n学びメモ: ${absoluteUrl("/my/#my-notes")}\n7日学習プラン: ${PLAN_URL}`,
            url: absoluteUrl("/my/#my-notes"),
            start,
            end: new Date(start.getTime() + 5 * 60_000)
          }
        });
      }
    }
    return items;
  }, [genreKey, genreLabel, includeReview, schedule, startDate, time]);

  function downloadIcs() {
    if (events.length === 0) return;
    const ics = buildIcs(
      events.map((item) => item.event),
      `Manapick ${genreLabel} 7日学習プラン`
    );
    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `manapick-${genreKey}-study-plan.ics`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
    setDownloaded(true);
    sendGaEvent("study_plan_calendar_export", { method: "ics", genre: genreKey, events: events.length });
  }

  return (
    <section className="study-plan-calendar" aria-labelledby="study-plan-calendar-title">
      <div className="study-plan-calendar-head">
        <p className="section-eyebrow">毎日思い出せるように</p>
        <h3 id="study-plan-calendar-title">カレンダーに学習予定を入れる</h3>
        <p>学習日だけ、動画の長さぶんの予定を作ります。予定の中に動画へのリンクが入ります。</p>
      </div>

      <div className="study-plan-calendar-fields">
        <label>
          <span>開始日</span>
          <input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} required />
        </label>
        <label>
          <span>学習する時刻</span>
          <input type="time" value={time} step={300} onChange={(event) => setTime(event.target.value || "21:00")} required />
        </label>
        <label className="study-plan-calendar-check">
          <input type="checkbox" checked={includeReview} onChange={(event) => setIncludeReview(event.target.checked)} />
          <span>振り返り日（5分）も入れる</span>
        </label>
      </div>

      <div className="study-plan-calendar-actions">
        <button type="button" className="study-plan-calendar-ics" onClick={downloadIcs} disabled={events.length === 0}>
          iPhone・Macのカレンダーに追加
          <small>{events.length}件の予定を .ics で書き出す・10分前に通知</small>
        </button>
        {downloaded ? (
          <p className="study-plan-calendar-note" role="status">
            書き出しました。iPhoneで追加画面が出ない場合は、ダウンロードした「.ics」ファイルを開いて追加してください。Androidはダウンロードしたファイルをカレンダーアプリで開きます。
          </p>
        ) : null}
      </div>

      <details className="study-plan-calendar-google">
        <summary>Googleカレンダーに1日ずつ追加する</summary>
        <p>Googleカレンダーのリンクは1回につき1件の予定を作ります。追加したい日を順に押してください。</p>
        <ul>
          {events.map(({ day, event }) => (
            <li key={event.uid}>
              <a
                href={googleCalendarUrl(event)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => sendGaEvent("study_plan_calendar_export", { method: "google", genre: genreKey, day })}
              >
                <strong>DAY {day}</strong>
                <span>{event.title.replace(/^Manapick DAY \d+｜/, "")}</span>
              </a>
            </li>
          ))}
        </ul>
      </details>
      <p className="study-plan-calendar-privacy">予定は端末の中で作られ、Manapickのサーバーには送られません。時刻はお使いの端末のタイムゾーンで設定されます。</p>
    </section>
  );
}
