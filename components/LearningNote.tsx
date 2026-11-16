"use client";

import { type FormEvent, useEffect, useState } from "react";
import { reviewDateAfter } from "@/lib/learning-notes";
import { sendGaEvent } from "@/lib/retention";
import { useLearningNotes } from "@/lib/useLearningNotes";

function formatReviewDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return `${date.getMonth() + 1}月${date.getDate()}日`;
}

const REVIEW_DAY_OPTIONS = [
  { days: 1, label: "明日" },
  { days: 3, label: "3日後" },
  { days: 7, label: "7日後" }
] as const;

export default function LearningNote({ ytid }: { ytid: string }) {
  const { notes, ready, upsert, remove } = useLearningNotes();
  const stored = notes.find((note) => note.ytid === ytid);
  const [learned, setLearned] = useState("");
  const [nextAction, setNextAction] = useState("");
  const [reviewDays, setReviewDays] = useState(1);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!ready || !stored) return;
    const timer = window.setTimeout(() => {
      setLearned(stored.learned);
      setNextAction(stored.nextAction);
      setSaved(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [ready, stored]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanLearned = learned.trim();
    if (!cleanLearned) return;

    upsert({
      ytid,
      learned: cleanLearned,
      nextAction: nextAction.trim(),
      reviewAt: reviewDateAfter(reviewDays),
      updatedAt: new Date().toISOString()
    });
    setSaved(true);
    sendGaEvent("learning_note_save", { video_id: ytid, review_days: reviewDays });
  }

  return (
    <div className="learning-note-panel">
      <form onSubmit={submit}>
        <label>
          今日わかったこと <span>{learned.length}/160</span>
          <textarea
            value={learned}
            maxLength={160}
            rows={3}
            required
            placeholder="例：プロンプトは目的・前提・出力形式の順に伝える"
            onChange={(event) => {
              setLearned(event.target.value);
              setSaved(false);
            }}
          />
        </label>
        <label>
          次に試すこと（任意） <span>{nextAction.length}/120</span>
          <textarea
            value={nextAction}
            maxLength={120}
            rows={2}
            placeholder="例：明日の会議メモで一度試す"
            onChange={(event) => {
              setNextAction(event.target.value);
              setSaved(false);
            }}
          />
        </label>
        <div className="learning-note-actions">
          <div className="vd-memo-days" role="group" aria-label="見返す日">
            {REVIEW_DAY_OPTIONS.map((option) => (
              <button
                key={option.days}
                type="button"
                className={reviewDays === option.days ? "vd-memo-day is-on" : "vd-memo-day"}
                aria-pressed={reviewDays === option.days}
                onClick={() => {
                  setReviewDays(option.days);
                  setSaved(false);
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
          <button type="submit" className="vd-memo-save">
            {saved ? "更新する" : "この端末に保存"}
          </button>
          {stored ? (
            <button
              type="button"
              className="is-delete"
              onClick={() => {
                remove(ytid);
                setLearned("");
                setNextAction("");
                setSaved(false);
                sendGaEvent("learning_note_delete", { video_id: ytid });
              }}
            >
              削除
            </button>
          ) : null}
        </div>
        <p>メモはお使いのブラウザだけに保存され、外部には送信されません。</p>
        {saved ? (
          <p className="learning-note-mypage-link">
            見返す日（{formatReviewDate(stored?.reviewAt ?? reviewDateAfter(reviewDays))}）に、マイページの「学びメモ」で見返せます →
            <a href="/my/#my-notes">マイページを開く</a>
          </p>
        ) : null}
      </form>
    </div>
  );
}
