"use client";

import { useEffect, useState } from "react";
import { LOCAL_LIST_EVENT } from "@/lib/retention";

function notifyLocalListChange(key: string, items: string[]) {
  try {
    window.dispatchEvent(new CustomEvent(LOCAL_LIST_EVENT, { detail: { key, items } }));
  } catch {
    // Custom events are best-effort; persistence still works without them.
  }
}

export function useLocalList(key: string) {
  const [items, setItems] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const storageTimer = window.setTimeout(() => {
      let storedItems: string[] = [];
      try {
        const raw = window.localStorage.getItem(key);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) storedItems = parsed.filter((item) => typeof item === "string");
        }
      } catch {
        // localStorage can be unavailable in private or restricted browsing modes.
      }
      if (!cancelled) {
        setItems(storedItems);
        setReady(true);
      }
    }, 0);
    return () => {
      cancelled = true;
      window.clearTimeout(storageTimer);
    };
  }, [key]);

  function toggle(id: string) {
    setItems((previous) => {
      const next = previous.includes(id) ? previous.filter((item) => item !== id) : [...previous, id];
      try {
        window.localStorage.setItem(key, JSON.stringify(next));
        notifyLocalListChange(key, next);
      } catch {
        // Keep the UI usable even when persistence is unavailable.
      }
      return next;
    });
  }

  function push(id: string, limit = 12) {
    setItems((previous) => {
      const next = [id, ...previous.filter((item) => item !== id)].slice(0, limit);
      try {
        window.localStorage.setItem(key, JSON.stringify(next));
        notifyLocalListChange(key, next);
      } catch {
        // Keep the UI usable even when persistence is unavailable.
      }
      return next;
    });
  }

  function clear() {
    setItems([]);
    try {
      window.localStorage.removeItem(key);
      notifyLocalListChange(key, []);
    } catch {
      // Keep the UI usable even when persistence is unavailable.
    }
  }

  return {
    items,
    ready,
    toggle,
    push,
    clear,
    has: (id: string) => items.includes(id)
  };
}
