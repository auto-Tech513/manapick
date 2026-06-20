import type { Video } from "@/lib/manapick";

export const WATCHLIST_KEY = "manapick:watchlist:v1";
export const WATCHED_KEY = "manapick:watched:v1";
export const RECENT_KEY = "manapick:recent:v1";
export const STREAK_KEY = "manapick:streak:v1";
export const LAST_ACTIVITY_KEY = "manapick:lastActivity:v1";
export const BADGES_KEY = "manapick:badges:v1";
export const LOCAL_LIST_EVENT = "manapick:local-list-change";
export const RETENTION_EVENT = "manapick:retention-change";

export type StreakState = {
  count: number;
  freezes: number;
  lastDate: string | null;
  studyDates: string[];
  updatedAt: string | null;
};

export const EMPTY_STREAK: StreakState = {
  count: 0,
  freezes: 1,
  lastDate: null,
  studyDates: [],
  updatedAt: null
};

export function jstDateKey(date = new Date()) {
  const parts = new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function daysBetween(left: string, right: string) {
  const leftDate = Date.parse(left + "T00:00:00Z");
  const rightDate = Date.parse(right + "T00:00:00Z");
  if (!Number.isFinite(leftDate) || !Number.isFinite(rightDate)) return 0;
  return Math.round((leftDate - rightDate) / 86400000);
}

function uniqueDates(dates: unknown) {
  if (!Array.isArray(dates)) return [];
  return Array.from(new Set(dates.filter((date): date is string => typeof date === "string"))).sort();
}

export function normalizeStreak(raw: unknown): StreakState {
  if (!raw || typeof raw !== "object") return EMPTY_STREAK;
  const value = raw as Partial<StreakState>;
  return {
    count: Math.max(0, Number(value.count) || 0),
    freezes: Math.max(0, Math.min(3, Number(value.freezes) || 0)),
    lastDate: typeof value.lastDate === "string" ? value.lastDate : null,
    studyDates: uniqueDates(value.studyDates),
    updatedAt: typeof value.updatedAt === "string" ? value.updatedAt : null
  };
}

export function readStreak(): StreakState {
  if (typeof window === "undefined") return EMPTY_STREAK;
  try {
    const raw = window.localStorage.getItem(STREAK_KEY);
    return normalizeStreak(raw ? JSON.parse(raw) : null);
  } catch {
    return EMPTY_STREAK;
  }
}

export function writeStreak(state: StreakState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STREAK_KEY, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent(RETENTION_EVENT));
  } catch {
    // localStorage can be unavailable; keep the UI usable.
  }
}

export function recordStudyActivity(previous: StreakState, today = jstDateKey()) {
  const current = normalizeStreak(previous);
  const alreadyStudiedToday = current.studyDates.includes(today);
  if (alreadyStudiedToday && current.lastDate === today) {
    return { state: current, changed: false, usedFreeze: false, continued: false };
  }

  const studyDates = Array.from(new Set([...current.studyDates, today])).sort();
  let nextCount = current.count;
  let nextFreezes = Math.max(1, current.freezes);
  let usedFreeze = false;
  let continued = false;

  if (!current.lastDate) {
    nextCount = 1;
  } else {
    const gap = daysBetween(today, current.lastDate);
    if (gap <= 0) {
      nextCount = Math.max(1, current.count);
    } else if (gap === 1) {
      nextCount = current.count + 1;
      continued = true;
    } else if (gap === 2 && nextFreezes > 0) {
      nextCount = current.count + 1;
      nextFreezes -= 1;
      usedFreeze = true;
      continued = true;
    } else {
      nextCount = 1;
      nextFreezes = 1;
    }
  }

  if (nextCount > 0 && nextCount % 7 === 0) {
    nextFreezes = Math.min(3, nextFreezes + 1);
  }

  return {
    state: {
      count: nextCount,
      freezes: nextFreezes,
      lastDate: today,
      studyDates,
      updatedAt: new Date().toISOString()
    },
    changed: true,
    usedFreeze,
    continued
  };
}

function hashValue(value: string) {
  return Array.from(value).reduce((total, char, index) => {
    return (total + char.charCodeAt(0) * (index + 17)) % 1000003;
  }, 137);
}

export function selectTodayVideo(videos: readonly Video[], today = jstDateKey()) {
  const pool = videos
    .filter((video) => video.scoreStatus === "confirmed")
    .filter((video) => (video.score ?? 0) >= 30)
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0) || a.ytid.localeCompare(b.ytid));
  if (pool.length === 0) return null;
  return pool[hashValue(today) % pool.length];
}

export function sendGaEvent(name: string, params: Record<string, string | number | boolean | null | undefined> = {}) {
  if (typeof window === "undefined") return;
  const gtag = (window as typeof window & { gtag?: (...args: unknown[]) => void }).gtag;
  if (typeof gtag !== "function") return;
  gtag("event", name, params);
}

