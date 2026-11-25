"use client";

import { useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import LiveSearchPanel, { type PanelGenre } from "@/components/LiveSearchPanel";
import { useLocalList } from "@/lib/useLocalList";
import {
  RECENT_SEARCHES_KEY,
  SEARCH_INDEX_PATH,
  popularSearchKeywords,
  sortBySearchRelevance,
  type SearchableVideo
} from "@/lib/search-keywords";

type IndexData = { g: (PanelGenre & { en: string })[]; v: SearchableVideo[] };
type FuseLike = { search: (query: string) => { item: SearchableVideo }[] };

let indexPromise: Promise<{ data: IndexData; fuse: FuseLike }> | null = null;

// 索引（/video-search-index.json）と Fuse は、入力欄に触れたときに一度だけ読み込む。
function loadIndex() {
  if (!indexPromise) {
    indexPromise = Promise.all([fetch(SEARCH_INDEX_PATH).then((res) => res.json()), import("fuse.js")])
      .then(([raw, fuseModule]) => {
        const v: SearchableVideo[] = (raw.v as unknown[][]).map((row) => ({
          ytid: String(row[0]),
          title: String(row[1]),
          genre: String(row[2]),
          sub: String(row[3] ?? ""),
          channel: String(row[4] ?? ""),
          tags: String(row[5] ?? "").split(" ").filter(Boolean),
          minutes: Number(row[6]),
          level: String(row[7]),
          score: row[8] === null ? null : Number(row[8])
        }));
        const Fuse = fuseModule.default;
        const fuse = new Fuse(v, { keys: ["title", "sub", "channel", "tags"], threshold: 0.35, ignoreLocation: true });
        return { data: { g: raw.g, v }, fuse };
      })
      .catch((error) => {
        indexPromise = null;
        throw error;
      });
  }
  return indexPromise;
}

// どのページからでも使える動画検索（メニュー・フッター）。トップの検索欄と同じ候補パネルを出す。
// 送信するとトップの検索（?q=）で結果を表示する。JS なしでも動く通常のフォーム。
export default function SiteSearchForm({ id, className = "" }: { id: string; className?: string }) {
  const [draft, setDraft] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [index, setIndex] = useState<{ data: IndexData; fuse: FuseLike } | null>(null);
  const [failed, setFailed] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const recentSearches = useLocalList(RECENT_SEARCHES_KEY);
  const query = draft.trim();

  function ensureIndex() {
    if (index || failed) return;
    loadIndex()
      .then(setIndex)
      .catch(() => setFailed(true));
  }

  const suggestions = useMemo(() => {
    if (!index || query.length < 2) return [];
    const terms = query.toLocaleLowerCase("ja").split(/\s+/).filter(Boolean);
    const exact = index.data.v.filter((video) => {
      const hay = [video.title, video.sub, video.channel, ...video.tags].join(" ").toLocaleLowerCase("ja");
      return terms.every((term) => hay.includes(term));
    });
    const seen = new Set(exact.map((video) => video.ytid));
    const fuzzy = index.fuse
      .search(query)
      .map((result) => result.item)
      .filter((video) => !seen.has(video.ytid));
    return sortBySearchRelevance([...exact, ...fuzzy], query).slice(0, 5);
  }, [index, query]);

  const genreMatches = useMemo(() => {
    if (!index || query.length < 2) return [];
    const q = query.toLowerCase();
    return index.data.g.filter((genre) => genre.name.toLowerCase().includes(q) || genre.en.toLowerCase().includes(q)).slice(0, 3);
  }, [index, query]);

  const keywordMatches = useMemo(() => {
    if (query.length < 2) return [];
    const q = query.toLowerCase();
    return popularSearchKeywords.filter((term) => term.toLowerCase().includes(q)).slice(0, 3);
  }, [query]);

  // 欄の外を押したら候補を閉じる。
  useEffect(() => {
    if (!open) return;
    function handlePointer(event: PointerEvent) {
      if (formRef.current && event.target instanceof Node && !formRef.current.contains(event.target)) setOpen(false);
    }
    document.addEventListener("pointerdown", handlePointer);
    return () => document.removeEventListener("pointerdown", handlePointer);
  }, [open]);

  // SP で候補パネルが開いている間は背後のスクロールを止める（全画面表示のため）。
  useEffect(() => {
    if (!open) return;
    if (!window.matchMedia("(max-width: 640px)").matches) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  function saveRecent(term: string) {
    const value = term.trim();
    if (value) recentSearches.push(value, 5);
  }

  function go(href: string, term = query) {
    saveRecent(term);
    setOpen(false);
    window.location.href = href;
  }

  function searchHref(term: string) {
    return "/?q=" + encodeURIComponent(term);
  }

  function handleKeyDown(event: ReactKeyboardEvent<HTMLInputElement>) {
    // 日本語の変換中のキー（確定の Enter・候補選びの矢印など）は扱わない。
    if (event.nativeEvent.isComposing || event.keyCode === 229) return;
    if (event.key === "Escape") {
      if (open) {
        // 候補だけを閉じる。既定の動き（type="search" の文字消去）を止めないと、消去で onChange が走り候補が開き直す。
        // トップのメニューは document の keydown で閉じるため、同じ document の後続の受け手にも渡さない。
        event.preventDefault();
        event.stopPropagation();
        event.nativeEvent.stopImmediatePropagation();
        setOpen(false);
      }
      return;
    }
    if (!suggestions.length) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((value) => Math.min(value + 1, suggestions.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((value) => Math.max(value - 1, 0));
    }
  }

  return (
    <form
      ref={formRef}
      action="/"
      method="get"
      role="search"
      className={["site-search-form", "google-anno-skip", className, open ? "is-panel-open" : ""].filter(Boolean).join(" ")}
      onSubmit={() => saveRecent(draft)}
    >
      <label htmlFor={id}>動画を検索</label>
      <div className="site-search-field">
        <div className="site-search-row">
          <input
            ref={inputRef}
            id={id}
            type="search"
            name="q"
            value={draft}
            placeholder="例: ChatGPT / 簿記 / Python"
            autoComplete="off"
            enterKeyHint="search"
            required
            role="combobox"
            aria-autocomplete="list"
            aria-controls={`${id}-suggestions`}
            aria-expanded={open}
            onFocus={() => {
              ensureIndex();
              setOpen(true);
            }}
            onChange={(event) => {
              ensureIndex();
              setDraft(event.target.value);
              setActiveIndex(0);
              setOpen(true);
            }}
            onKeyDown={handleKeyDown}
          />
          <button type="submit">検索</button>
        </div>
        <LiveSearchPanel
          id={`${id}-suggestions`}
          query={draft}
          total={null}
          loading={query.length >= 2 && !index && !failed}
          suggestions={failed ? [] : suggestions}
          activeIndex={activeIndex}
          open={open}
          recentSearches={recentSearches}
          genreMatches={genreMatches}
          keywordMatches={keywordMatches}
          onSelect={(video) => go("/video/" + video.ytid + "/")}
          onGenreSelect={(key) => go("/genre/" + key + "/")}
          onKeywordSelect={(term) => go(searchHref(term), term)}
          onShowAll={() => go(searchHref(query))}
          onRecentSearchSelect={(term) => {
            setDraft(term);
            setOpen(true);
            inputRef.current?.focus();
          }}
          onClose={() => {
            setOpen(false);
            inputRef.current?.blur();
          }}
        />
      </div>
    </form>
  );
}
