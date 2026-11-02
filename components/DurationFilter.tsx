"use client";

import { useEffect, useState } from "react";
import { sendGaEvent } from "@/lib/retention";

const BUCKETS = [
  { value: "all", label: "すべて" },
  { value: "short", label: "〜10分" },
  { value: "medium", label: "10〜30分" },
  { value: "long", label: "30分〜" }
] as const;

type Bucket = (typeof BUCKETS)[number]["value"];

// ホームの所要時間フィルタ（ManapickApp の timeMatches）と同じ区切り。
function matches(minutes: number, bucket: Bucket) {
  if (bucket === "short") return minutes <= 10;
  if (bucket === "medium") return minutes > 10 && minutes <= 30;
  if (bucket === "long") return minutes > 30;
  return true;
}

// サーバーで描画した一覧（data-minutes 付きの要素）を、その場で時間別に絞り込む。
// 静的HTMLの一覧はそのまま残し（検索エンジン・JS無効でも全件見える）、表示だけを切り替える。
export default function DurationFilter({ scopeId, pagePath }: { scopeId: string; pagePath: string }) {
  const [bucket, setBucket] = useState<Bucket>("all");
  const [counts, setCounts] = useState<Record<Bucket, number> | null>(null);
  const [shown, setShown] = useState<number | null>(null);

  function items() {
    const scope = document.getElementById(scopeId);
    return scope ? Array.from(scope.querySelectorAll<HTMLElement>("[data-minutes]")) : [];
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const seen = new Map<string, number>();
      for (const item of items()) seen.set(item.dataset.ytid ?? String(seen.size), Number(item.dataset.minutes));
      const values = Array.from(seen.values());
      setCounts({
        all: values.length,
        short: values.filter((minutes) => matches(minutes, "short")).length,
        medium: values.filter((minutes) => matches(minutes, "medium")).length,
        long: values.filter((minutes) => matches(minutes, "long")).length
      });
    }, 0);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scopeId]);

  function apply(next: Bucket) {
    setBucket(next);
    const scope = document.getElementById(scopeId);
    if (!scope) return;
    const visible = new Set<string>();
    for (const item of items()) {
      const ok = matches(Number(item.dataset.minutes), next);
      item.hidden = !ok;
      if (ok) visible.add(item.dataset.ytid ?? "");
    }
    // 絞り込み中は折りたたみ一覧を開き、該当0件のまとまりは隠す
    scope.querySelectorAll<HTMLDetailsElement>("details").forEach((details) => {
      if (!details.querySelector("[data-minutes]")) return;
      if (next === "all") {
        details.hidden = false;
        return;
      }
      const hasVisible = Array.from(details.querySelectorAll<HTMLElement>("[data-minutes]")).some((item) => !item.hidden);
      details.hidden = !hasVisible;
      if (hasVisible) details.open = true;
    });
    // 見出しと一覧のまとまり（data-filter-group）は、該当0件なら見出しごと隠す
    scope.querySelectorAll<HTMLElement>("[data-filter-group]").forEach((group) => {
      group.hidden = next !== "all" && !Array.from(group.querySelectorAll<HTMLElement>("[data-minutes]")).some((item) => !item.hidden);
    });
    setShown(next === "all" ? null : visible.size);
    sendGaEvent("duration_filter", { bucket: next, page: pagePath });
  }

  return (
    <div className="duration-filter" role="group" aria-label="所要時間で絞り込む">
      <span className="duration-filter-label">時間で絞る</span>
      <div className="duration-filter-chips">
        {BUCKETS.map((item) => (
          <button
            key={item.value}
            type="button"
            className={bucket === item.value ? "is-active" : ""}
            aria-pressed={bucket === item.value}
            onClick={() => apply(item.value)}
            disabled={counts !== null && item.value !== "all" && counts[item.value] === 0}
          >
            {item.label}
            {counts ? <small>{counts[item.value]}本</small> : null}
          </button>
        ))}
      </div>
      {shown !== null ? (
        <p className="duration-filter-status" role="status">
          {shown}本を表示中。{shown > 0 ? "" : "この時間の動画はありません。"}
        </p>
      ) : null}
    </div>
  );
}
