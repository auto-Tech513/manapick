"use client";

import { type FormEvent, useEffect, useState } from "react";
import { reviewDateAfter } from "@/lib/learning-notes";
import { sendGaEvent } from "@/lib/retention";
import { useLearningNotes } from "@/lib/useLearningNotes";

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
    <details className="learning-note-panel">
      <summary>
        <span aria-hidden="true">✎</span>
        <span>
          <strong>{saved ? "学びメモを見直す" : "1分で学びメモを残す"}</strong>
          <small>見た直後に1行残すと、次の復習で迷いません</small>
        </span>
      </summary>
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
          <label>
            見返す日
            <select
              value={reviewDays}
              onChange={(event) => {
                setReviewDays(Number(event.target.value));
                setSaved(false);
              }}
            >
              <option value={1}>明日</option>
              <option value={3}>3日後</option>
              <option value={7}>7日後</option>
            </select>
          </label>
          <button type="submit">{saved ? "更新する" : "この端末に保存"}</button>
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
      </form>
    </details>
  );
}
