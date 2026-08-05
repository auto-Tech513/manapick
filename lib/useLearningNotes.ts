"use client";

import { useEffect, useState } from "react";
import {
  LEARNING_NOTES_EVENT,
  LEARNING_NOTES_KEY,
  parseLearningNotes,
  type LearningNote
} from "@/lib/learning-notes";

function writeNotes(notes: LearningNote[]) {
  try {
    window.localStorage.setItem(LEARNING_NOTES_KEY, JSON.stringify(notes));
    window.dispatchEvent(new CustomEvent(LEARNING_NOTES_EVENT, { detail: notes }));
  } catch {
    // Notes remain an optional enhancement when storage is restricted.
  }
}

export function useLearningNotes() {
  const [notes, setNotes] = useState<LearningNote[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const load = () => {
      try {
        setNotes(parseLearningNotes(window.localStorage.getItem(LEARNING_NOTES_KEY)));
      } catch {
        setNotes([]);
      }
      setReady(true);
    };
    const onStorage = (event: StorageEvent) => {
      if (event.key === LEARNING_NOTES_KEY) setNotes(parseLearningNotes(event.newValue));
    };
    const onLocalChange = (event: Event) => {
      const customEvent = event as CustomEvent<LearningNote[]>;
      if (Array.isArray(customEvent.detail)) setNotes(customEvent.detail);
    };

    const timer = window.setTimeout(load, 0);
    window.addEventListener("storage", onStorage);
    window.addEventListener(LEARNING_NOTES_EVENT, onLocalChange);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(LEARNING_NOTES_EVENT, onLocalChange);
    };
  }, []);

  function upsert(note: LearningNote) {
    setNotes((previous) => {
      const next = [note, ...previous.filter((item) => item.ytid !== note.ytid)];
      writeNotes(next);
      return next;
    });
  }

  function remove(ytid: string) {
    setNotes((previous) => {
      const next = previous.filter((item) => item.ytid !== ytid);
      writeNotes(next);
      return next;
    });
  }

  return { notes, ready, upsert, remove };
}

