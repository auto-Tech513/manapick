"use client";

import { useEffect, useState } from "react";
import {
  EMPTY_STREAK,
  LAST_ACTIVITY_KEY,
  RETENTION_EVENT,
  STREAK_KEY,
  jstDateKey,
  readStreak,
  recordStudyActivity,
  sendGaEvent,
  writeStreak,
  type StreakState
} from "@/lib/retention";

export function useStreakState() {
  const [state, setState] = useState<StreakState>(EMPTY_STREAK);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const storageTimer = window.setTimeout(() => {
      setState(readStreak());
      setReady(true);
    }, 0);

    function sync() {
      setState(readStreak());
    }

    function handleStorage(event: StorageEvent) {
      if (!event.key || event.key === STREAK_KEY) sync();
    }

    window.addEventListener(RETENTION_EVENT, sync);
    window.addEventListener("storage", handleStorage);
    return () => {
      window.clearTimeout(storageTimer);
      window.removeEventListener(RETENTION_EVENT, sync);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  function record(ytid: string) {
    const result = recordStudyActivity(readStreak(), jstDateKey());
    writeStreak(result.state);
    setState(result.state);
    try {
      window.localStorage.setItem(
        LAST_ACTIVITY_KEY,
        JSON.stringify({ type: "video", ytid, date: result.state.lastDate, updatedAt: result.state.updatedAt })
      );
    } catch {
      // Ignore storage failures; the visible action still completes.
    }
    if (result.changed) {
      sendGaEvent("streak_continue", {
        streak_count: result.state.count,
        freeze_used: result.usedFreeze,
        video_id: ytid
      });
    }
    return result;
  }

  return { state, ready, record };
}
