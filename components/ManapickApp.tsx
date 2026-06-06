"use client";

import Fuse from "fuse.js";
import Image from "next/image";
import { type KeyboardEvent as ReactKeyboardEvent, type RefObject, useEffect, useMemo, useRef, useState } from "react";
import BrandLogo, { BrandMark } from "@/components/BrandLogo";
import genresData from "@/content/genres.json";
import roadmapsData from "@/content/roadmaps.json";
import videosData from "@/content/videos.json";

type GenreStatus = "published" | "preparing" | "checking";

type Genre = {
  key: string;
  label: string;
  icon: string;
  status: GenreStatus;
  note?: string;
  subgenres: string[];
  monetization: string;
  prItems: string[];
};

type AxisScore = {
  axis: string;
  score: number;
  note: string;
};

type ScoreStatus = "confirmed" | "provisional";

type Video = {
  genre: string;
  sub: string;
  ytid: string;
  level: "初級" | "中級" | "上級";
  minutes: number;
  channel: string;
  score: number | null;
  viewCount?: number;
  publishedAt?: string;
  scoreStatus?: ScoreStatus;
  editorNote?: string;
  axisScores: AxisScore[];
  title: string;
  url: string;
  tags: string[];
  review: string[];
};

type RoadmapStep = {
  label: string;
  level: string;
  goal: string;
  videos: string[];
};

type DisplayRoadmapStep = RoadmapStep & {
  isPlaceholder?: boolean;
};

type Roadmap = {
  genre: string;
  title: string;
  steps: RoadmapStep[];
};

const genres = genresData as Genre[];
const videos = videosData as Video[];
const roadmaps = roadmapsData as Roadmap[];

const publishedGenreKeys = genres
  .filter((genre) => genre.status === "published")
  .map((genre) => genre.key);

const levels = ["すべて", "初級", "中級", "上級"] as const;
const timeBuckets = [
  { value: "all", label: "すべて" },
  { value: "short", label: "〜10分" },
  { value: "medium", label: "10〜30分" },
  { value: "long", label: "30分〜" }
] as const;

const PAGE_SIZE = 9;

type PopularTab = "popular" | "new" | "score";

type HeroCarouselSlide = {
  video: Video;
  mode: PopularTab;
  modeLabel: string;
  rank: number;
  key: string;
};

const purposeLinks = [
  { number: "01", title: "目的から選ぶ", label: "AIを仕事で使いたい", genre: "ai", icon: "target" },
  { number: "02", title: "ジャンルから選ぶ", label: "8ジャンルから探す", genre: "all", icon: "grid" },
  { number: "03", title: "ロードマップで学ぶ", label: "順番を見て進む", genre: "roadmap", icon: "path" }
];

function statusLabel(status: GenreStatus) {
  if (status === "published") return "公開中";
  if (status === "checking") return "確認中（注記）";
  return "近日公開";
}

function scoreStatus(video: Video): ScoreStatus {
  return video.scoreStatus === "confirmed" ? "confirmed" : "provisional";
}

function scoreText(video: Video) {
  return video.score === null ? "スコア準備中" : video.score + "/35";
}

function scoreClasses(video: Video) {
  const status = scoreStatus(video);
  if (status === "provisional") return "score-badge is-provisional";
  if (video.score === null) return "score-badge is-empty";
  if (video.score >= 28) return "score-badge is-confirmed is-high";
  if (video.score >= 23) return "score-badge is-confirmed is-mid";
  return "score-badge is-confirmed is-low";
}

function timeMatches(minutes: number, bucket: string) {
  if (bucket === "short") return minutes <= 10;
  if (bucket === "medium") return minutes > 10 && minutes <= 30;
  if (bucket === "long") return minutes > 30;
  return true;
}

function genreDisplayName(key: string) {
  if (key === "biz") return "Office・資料作成";
  const genre = genres.find((item) => item.key === key);
  return genre ? genre.label : key;
}

function genreName(key: string) {
  return genreDisplayName(key);
}

function videoDetailHref(video: Video) {
  return "/video/" + video.ytid + "/";
}

function displayChannel(video: Video) {
  const channel = video.channel?.trim();
  if (!channel || channel.includes("確認")) return null;
  return channel;
}

function levelMeta(level: Video["level"]) {
  if (level === "中級") return { icon: "▲", className: "is-mid" };
  if (level === "上級") return { icon: "★", className: "is-high" };
  return { icon: "●", className: "is-beginner" };
}

function topScoredVideo(items: Video[]) {
  return items.reduce<Video | null>((best, video) => {
    if (video.score === null) return best;
    if (best === null || best.score === null || video.score > best.score) return video;
    return best;
  }, null);
}

function topicCounts(items: Video[]) {
  return Array.from(
    items.reduce<Map<string, number>>((map, video) => {
      map.set(video.sub, (map.get(video.sub) || 0) + 1);
      return map;
    }, new Map())
  ).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "ja"));
}

function groupVideosByGenre(items: Video[]) {
  const groups: { genreKey: string; items: Video[] }[] = [];
  items.forEach((video) => {
    if (!publishedGenreKeys.includes(video.genre)) return;
    const group = groups.find((item) => item.genreKey === video.genre);
    if (group) {
      group.items.push(video);
    } else {
      groups.push({ genreKey: video.genre, items: [video] });
    }
  });
  return groups;
}

function monthsSincePublished(video: Video) {
  if (!video.publishedAt) return 36;
  const date = new Date(video.publishedAt);
  if (Number.isNaN(date.getTime())) return 36;
  const diff = Date.now() - date.getTime();
  return Math.max(0, diff / (1000 * 60 * 60 * 24 * 30.4375));
}

function popularityScore(video: Video) {
  const viewCount = Math.max(0, Number(video.viewCount || 0));
  if (viewCount <= 0) return 0;
  return Math.log10(viewCount) / Math.pow(monthsSincePublished(video) + 2, 0.6);
}

function rankedVideosByTab(tab: PopularTab, limit: number) {
  const ranked = [...videos].filter((video) => publishedGenreKeys.includes(video.genre));
  if (tab === "new") {
    ranked.sort((a, b) => publishedTime(b) - publishedTime(a) || (b.score || 0) - (a.score || 0));
  } else if (tab === "score") {
    ranked.sort((a, b) => (b.score || 0) - (a.score || 0));
  } else {
    ranked.sort((a, b) => popularityScore(b) - popularityScore(a) || (b.score || 0) - (a.score || 0));
  }
  return ranked.slice(0, limit);
}

function buildHeroCarouselSlides(): HeroCarouselSlide[] {
  const modes: { mode: PopularTab; modeLabel: string }[] = [
    { mode: "popular", modeLabel: "総合人気" },
    { mode: "new", modeLabel: "新着" },
    { mode: "score", modeLabel: "スコア順" }
  ];

  return modes.flatMap(({ mode, modeLabel }) =>
    rankedVideosByTab(mode, 4).map((video, index) => ({
      video,
      mode,
      modeLabel,
      rank: index + 1,
      key: mode + "-" + video.ytid
    }))
  );
}

function publishedTime(video: Video) {
  if (!video.publishedAt) return 0;
  const time = new Date(video.publishedAt).getTime();
  return Number.isNaN(time) ? 0 : time;
}

function normalizedTerms(query: string) {
  return query
    .toLocaleLowerCase("ja")
    .split(/\s+/)
    .map((term) => term.trim())
    .filter(Boolean);
}

function fieldMatchesTerms(value: string, terms: string[]) {
  const normalized = value.toLocaleLowerCase("ja");
  return terms.length > 0 && terms.every((term) => normalized.includes(term));
}

function searchRelevance(video: Video, query: string) {
  const terms = normalizedTerms(query);
  if (terms.length === 0) return 0;
  if (fieldMatchesTerms(video.sub, terms)) return 0;
  if (fieldMatchesTerms(video.title, terms)) return 1;
  if (fieldMatchesTerms(video.tags.join(" "), terms)) return 2;
  if (fieldMatchesTerms(video.channel, terms)) return 3;
  if (fieldMatchesTerms(video.review.join(" "), terms)) return 4;
  return 5;
}

function sortBySearchRelevance(items: Video[], query: string) {
  return [...items].sort((a, b) => {
    const relevance = searchRelevance(a, query) - searchRelevance(b, query);
    if (relevance !== 0) return relevance;
    return (b.score ?? -1) - (a.score ?? -1);
  });
}

function publishedAgeLabel(video: Video) {
  if (!video.publishedAt) return null;
  const date = new Date(video.publishedAt);
  if (Number.isNaN(date.getTime())) return null;
  const months = Math.max(0, Math.floor(monthsSincePublished(video)));
  if (months < 12) return Math.max(1, months) + "ヶ月前公開";
  return Math.max(1, Math.floor(months / 12)) + "年前公開";
}

function genreEnglishLabel(key: string) {
  const labels: Record<string, string> = {
    ai: "GENERATIVE AI",
    prog: "PROGRAMMING",
    video: "CREATIVE",
    english: "ENGLISH",
    data: "DATA / DX",
    marke: "MARKETING",
    biz: "OFFICE SKILLS",
    shikaku: "CERTIFICATION"
  };
  return labels[key] ?? key.toLocaleUpperCase("en-US");
}

const genreIconSources: Record<string, string> = {
  ai: "/brand/icon-ai.png",
  prog: "/brand/icon-prog.png",
  video: "/brand/icon-video.png",
  english: "/brand/icon-english.png",
  data: "/brand/icon-data.png",
  marke: "/brand/icon-marke.png",
  biz: "/brand/icon-biz.png",
  shikaku: "/brand/icon-shikaku.png"
};

export default function ManapickApp() {
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [selectedSub, setSelectedSub] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState<(typeof levels)[number]>("すべて");
  const [selectedTime, setSelectedTime] = useState("all");
  const [searchDraft, setSearchDraft] = useState("");
  const [keyword, setKeyword] = useState("");
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
  const [highlightedVideoId, setHighlightedVideoId] = useState<string | null>(null);
  const [activeRoadmapGenre, setActiveRoadmapGenre] = useState("ai");
  const [currentPage, setCurrentPage] = useState(1);
  const [menuOpen, setMenuOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuDrawerRef = useRef<HTMLElement>(null!);
  const filtersMountedRef = useRef(false);
  const skipNextFilterResetRef = useRef(false);

  const selectedGenreData =
    selectedGenre === "all" ? null : genres.find((genre) => genre.key === selectedGenre) ?? null;
  const searchActive = keyword.trim().length > 0;

  const subOptions = useMemo(() => {
    if (selectedGenreData && !searchActive) return selectedGenreData.subgenres;
    return Array.from(new Set(videos.map((video) => video.sub))).sort((a, b) => a.localeCompare(b, "ja"));
  }, [selectedGenreData, searchActive]);

  const fuse = useMemo(
    () =>
      new Fuse(videos, {
        keys: ["title", "sub", "channel", "tags", "review"],
        threshold: 0.35,
        ignoreLocation: true
      }),
    []
  );

  const keywordMatchedIds = useMemo(() => {
    const query = keyword.trim();
    if (!query) return null;
    const exactHits = videos.filter((video) => {
      const haystack = [video.title, video.sub, video.channel, ...video.tags, ...video.review]
        .join(" ")
        .toLowerCase();
      return haystack.includes(query.toLowerCase());
    });
    const fuzzyHits = fuse.search(query).map((result) => result.item);
    return new Set([...exactHits, ...fuzzyHits].map((video) => video.ytid));
  }, [fuse, keyword]);

  const filteredVideos = useMemo(() => {
    const filtered = videos.filter((video) => {
      const genreOk = searchActive
        ? true
        : selectedGenre === "all"
          ? publishedGenreKeys.includes(video.genre)
          : video.genre === selectedGenre;
      const subOk = selectedSub === "all" || video.sub === selectedSub;
      const levelOk = selectedLevel === "すべて" || video.level === selectedLevel;
      const timeOk = timeMatches(video.minutes, selectedTime);
      const keywordOk = keywordMatchedIds === null || keywordMatchedIds.has(video.ytid);
      return genreOk && subOk && levelOk && timeOk && keywordOk;
    });
    return searchActive ? sortBySearchRelevance(filtered, keyword) : filtered;
  }, [keyword, keywordMatchedIds, searchActive, selectedGenre, selectedLevel, selectedSub, selectedTime]);

  const roadmapTabs = useMemo(() => {
    return roadmaps.filter((roadmap) => publishedGenreKeys.includes(roadmap.genre));
  }, []);

  const activeRoadmap = useMemo(() => {
    return roadmapTabs.find((roadmap) => roadmap.genre === activeRoadmapGenre) ?? roadmapTabs[0] ?? null;
  }, [activeRoadmapGenre, roadmapTabs]);

  const publishedGenres = useMemo(() => {
    return genres.filter((genre) => genre.status === "published");
  }, []);

  const upcomingGenres = useMemo(() => {
    return genres.filter((genre) => genre.status !== "published");
  }, []);

  const visiblePrGenres = useMemo(() => {
    if (selectedGenre === "all") {
      return publishedGenres;
    }
    return selectedGenreData ? [selectedGenreData] : [];
  }, [publishedGenres, selectedGenre, selectedGenreData]);

  const confirmedCount = useMemo(() => videos.filter((video) => scoreStatus(video) === "confirmed").length, []);

  const selectedPublishedVideos = useMemo(() => {
    if (selectedGenre === "all") return [];
    return videos.filter((video) => video.genre === selectedGenre);
  }, [selectedGenre]);

  const selectedGenreTopVideo = useMemo(() => topScoredVideo(selectedPublishedVideos), [selectedPublishedVideos]);
  const selectedGenreTopics = useMemo(() => topicCounts(selectedPublishedVideos), [selectedPublishedVideos]);

  const totalPages = Math.max(1, Math.ceil(filteredVideos.length / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const pageStartIndex = filteredVideos.length === 0 ? 0 : (safeCurrentPage - 1) * PAGE_SIZE;
  const pageVideos = filteredVideos.slice(pageStartIndex, pageStartIndex + PAGE_SIZE);
  const groupedPageVideos = useMemo(() => groupVideosByGenre(pageVideos), [pageVideos]);

  const heroCarouselSlides = useMemo(() => buildHeroCarouselSlides(), []);
  const popularFallbackVideos = useMemo(() => rankedVideosByTab("popular", 12), []);

  const searchSuggestions = useMemo(() => (searchActive ? filteredVideos.slice(0, 5) : []), [filteredVideos, searchActive]);
  const liveSearchTotal = searchActive ? filteredVideos.length : videos.length;

  const weeklyPick = useMemo(() => {
    return videos.reduce<Video | null>((best, video) => {
      if (video.score === null) return best;
      if (best === null || best.score === null || video.score > best.score) return video;
      return best;
    }, null);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const page = Number(params.get("page") || "1");
    if (Number.isFinite(page) && page > 1) setCurrentPage(Math.floor(page));
  }, []);

  useEffect(() => {
    function handleKeydown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchInputRef.current?.focus();
        setSuggestionsOpen(true);
      }
    }
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => setKeyword(searchDraft), 150);
    return () => window.clearTimeout(timeout);
  }, [searchDraft]);

  useEffect(() => {
    setActiveSuggestionIndex(0);
  }, [keyword, selectedLevel, selectedSub, selectedTime]);

  useEffect(() => {
    if (!filtersMountedRef.current) {
      filtersMountedRef.current = true;
      return;
    }
    if (skipNextFilterResetRef.current) {
      skipNextFilterResetRef.current = false;
      return;
    }
    setCurrentPage(1);
    const url = new URL(window.location.href);
    url.searchParams.delete("page");
    window.history.replaceState(null, "", url);
  }, [keyword, selectedGenre, selectedLevel, selectedSub, selectedTime]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  useEffect(() => {
    if (!menuOpen) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;

    function handleKeydown(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeydown);
    window.setTimeout(() => {
      const firstFocusable = menuDrawerRef.current?.querySelector<HTMLElement>("button, a");
      firstFocusable?.focus();
    }, 0);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeydown);
      if (menuButtonRef.current) {
        menuButtonRef.current?.focus();
      } else if (previousFocus && document.contains(previousFocus)) {
        previousFocus.focus();
      }
    };
  }, [menuOpen]);

  function openVideoPage(video: Video) {
    setSuggestionsOpen(false);
    window.location.href = videoDetailHref(video);
  }

  function handleSearchKeyDown(event: ReactKeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      setSuggestionsOpen(false);
      return;
    }
    if (!searchSuggestions.length) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setSuggestionsOpen(true);
      setActiveSuggestionIndex((index) => Math.min(index + 1, searchSuggestions.length - 1));
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setSuggestionsOpen(true);
      setActiveSuggestionIndex((index) => Math.max(index - 1, 0));
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      openVideoPage(searchSuggestions[activeSuggestionIndex] ?? searchSuggestions[0]);
    }
  }

  function updatePage(nextPage: number) {
    const bounded = Math.min(Math.max(1, nextPage), totalPages);
    setCurrentPage(bounded);
    const url = new URL(window.location.href);
    if (bounded > 1) url.searchParams.set("page", String(bounded));
    else url.searchParams.delete("page");
    window.history.replaceState(null, "", url);
    scrollToResults();
  }

  function resetPageParam() {
    setCurrentPage(1);
    const url = new URL(window.location.href);
    url.searchParams.delete("page");
    window.history.replaceState(null, "", url);
  }

  function scrollToResults() {
    scrollToElement("results-anchor");
  }

  function scrollToElement(elementId: string) {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        const target = document.getElementById(elementId);
        if (!target) return;
        const stickyOffset = (document.querySelector(".category-tab-nav")?.getBoundingClientRect().height ?? 0) + 16;
        const top = target.getBoundingClientRect().top + window.scrollY - stickyOffset;
        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: Math.max(0, top), behavior: reducedMotion ? "auto" : "smooth" });
      });
    });
  }

  function handleGenreChange(nextGenre: string) {
    setSelectedGenre(nextGenre);
    setSelectedSub("all");
    setSelectedLevel("すべて");
    setSelectedTime("all");
    setSearchDraft("");
    setKeyword("");
    setSuggestionsOpen(false);
    setActiveSuggestionIndex(0);
    resetPageParam();
    scrollToResults();
  }

  function resetFilters() {
    setSelectedGenre("all");
    setSelectedSub("all");
    setSelectedLevel("すべて");
    setSelectedTime("all");
    setSearchDraft("");
    setKeyword("");
    setSuggestionsOpen(false);
  }

  function jumpToGenre(genreKey: string) {
    handleGenreChange(genreKey);
  }

  function showGenrePicker() {
    setSelectedGenre("all");
    setSelectedSub("all");
    setSelectedLevel("すべて");
    setSelectedTime("all");
    setSearchDraft("");
    setKeyword("");
    setSuggestionsOpen(false);
    setActiveSuggestionIndex(0);
    resetPageParam();
    scrollToElement("genre-picker");
  }

  function handlePurposeSelect(target: string) {
    if (target === "roadmap") {
      scrollToElement("roadmap");
      return;
    }
    if (target === "all") {
      showGenrePicker();
      return;
    }
    handleGenreChange(target);
  }

  function handleMenuKeyDown(event: ReactKeyboardEvent<HTMLElement>) {
    if (event.key !== "Tab") return;
    const focusable = Array.from(menuDrawerRef.current?.querySelectorAll<HTMLElement>("button, a") ?? [])
      .filter((item) => !item.hasAttribute("disabled"));
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  return (
    <main>
      <header className="border-b border-line bg-surface/92 backdrop-blur">
        <div className="site-header-inner mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 min-[720px]:flex-row min-[720px]:items-center min-[720px]:justify-between min-[720px]:px-6">
          <a href="#top" className="min-w-0" aria-label="Manapick トップ">
            <BrandLogo compact />
          </a>
          <div className="top-search-wrap">
            <label className="top-search" aria-label="動画を検索">
              <span className="sr-only">動画を検索</span>
              <input
                ref={searchInputRef}
                value={searchDraft}
                onChange={(event) => {
                  setSearchDraft(event.target.value);
                  setSuggestionsOpen(true);
                }}
                onFocus={() => setSuggestionsOpen(true)}
                onKeyDown={handleSearchKeyDown}
                placeholder="動画を検索"
                className="top-search-input"
                autoComplete="off"
                aria-controls="search-suggestions"
                aria-expanded={suggestionsOpen}
              />
              <span className="top-search-key" aria-hidden="true">⌘K</span>
            </label>
            <LiveSearchPanel
              id="search-suggestions"
              query={keyword}
              total={liveSearchTotal}
              suggestions={searchSuggestions}
              activeIndex={activeSuggestionIndex}
              open={suggestionsOpen}
              popularVideos={popularFallbackVideos}
              onSelect={openVideoPage}
              onClose={() => setSuggestionsOpen(false)}
            />
          </div>
          <div className="header-actions">
            <nav className="site-nav flex flex-wrap gap-3 text-sm font-semibold text-muted" aria-label="サイト内リンク">
              <a className="transition hover:text-accent" href="#search">
                探す
              </a>
              <a className="transition hover:text-accent" href="#roadmap">
                ロードマップ
              </a>
              <a className="transition hover:text-accent" href="#pr">
                PR
              </a>
              <a className="transition hover:text-accent" href="/contact/">
                お問い合わせ
              </a>
            </nav>
            <button
              ref={menuButtonRef}
              type="button"
              className="menu-toggle"
              aria-label={menuOpen ? "メニューを閉じる" : "メニューを開く"}
              aria-controls="site-menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <svg className="menu-toggle-icon" viewBox="0 0 24 24" aria-hidden="true">
                {menuOpen ? (
                  <>
                    <path d="M6.5 6.5 17.5 17.5" />
                    <path d="M17.5 6.5 6.5 17.5" />
                  </>
                ) : (
                  <>
                    <path d="M5 7h14" />
                    <path d="M5 12h14" />
                    <path d="M5 17h14" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>
      {menuOpen ? (
        <SiteMenuDrawer
          genres={publishedGenres}
          drawerRef={menuDrawerRef}
          onKeyDown={handleMenuKeyDown}
          onClose={() => setMenuOpen(false)}
          onGenreSelect={(genreKey) => {
            setMenuOpen(false);
            handleGenreChange(genreKey);
          }}
          onGenreList={() => {
            setMenuOpen(false);
            showGenrePicker();
          }}
          onSectionSelect={(sectionId) => {
            setMenuOpen(false);
            scrollToElement(sectionId);
          }}
        />
      ) : null}

      <CategoryTabNav
        genres={publishedGenres}
        activeGenre={selectedGenre}
        onSelect={jumpToGenre}
      />

      <section id="top" className="hero-section">
        <div className="pointer-events-none absolute -left-24 top-14 -z-10 h-72 w-[32rem] rotate-[-18deg] rounded-[38%_62%_58%_42%] bg-[#1F3A8A]/[0.07] blur-2xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-24 bottom-4 -z-10 h-80 w-[34rem] rotate-12 rounded-[62%_38%_42%_58%] bg-[#0FA98B]/[0.08] blur-2xl" aria-hidden="true" />
        <svg
          className="pointer-events-none absolute inset-x-0 top-10 -z-10 h-full w-full opacity-[0.07]"
          viewBox="0 0 1200 520"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M86 404 L260 276 L416 314 L608 164 L760 202 L1018 64"
            stroke="#1F3A8A"
            strokeWidth="18"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M962 72 L1030 52 L1014 122"
            stroke="#0FA98B"
            strokeWidth="18"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <div className="hero-container">
          <div className="hero-copy-column">
            <p className="hero-eyebrow">
              社会人のリスキリング動画キュレーション
            </p>
            <h1 className="hero-title">
              <span className="hero-title-line">
                <span className="hero-title-highlight">見るべき一本</span>だけを、
              </span>
              <span className="hero-title-line">迷わせない。</span>
            </h1>
            <p className="hero-lead">
              AI・IT・英語・動画編集など、キャリアに効く学習動画を“Manapickスコア（35点満点）”で厳選。初級→上級のロードマップで、何から見るかもう迷わない。
            </p>

            <HeroTrustStats totalVideos={videos.length} confirmedCount={confirmedCount} />
            <PurposeNav onSelect={handlePurposeSelect} />

            <p className="hero-proof">
              公開中{publishedGenres.length}ジャンル
              {confirmedCount > 0 ? " ／ 確認済" + confirmedCount + "本" : ""}
              {" ／ 順次拡大"}
            </p>
          </div>
          <div className="hero-visual-column">
            <HeroVideoCarousel slides={heroCarouselSlides} />
          </div>
        </div>
      </section>

      {weeklyPick ? (
        <section className="weekly-pick-section" aria-labelledby="weekly-pick-title">
          <div className="weekly-pick-shell">
            <div className="weekly-pick-column">
              <div className="weekly-pick-heading">
                <p className="section-eyebrow">今週のイチオシ</p>
                <h2 id="weekly-pick-title" className="section-title">最高スコアの一本から始める</h2>
              </div>
              <WeeklyPickCard video={weeklyPick} />
            </div>
            <AllGenreHighlights onGenreSelect={jumpToGenre} />
          </div>
        </section>
      ) : null}

      <section id="search" className="border-b border-line bg-white/64">
        <div className="mx-auto max-w-7xl px-4 py-7 min-[760px]:px-6">
          <div id="genre-picker" className="mb-5 flex flex-col gap-2 min-[720px]:flex-row min-[720px]:items-end min-[720px]:justify-between">
            <div>
              <p className="text-sm font-bold text-leaf">①ざっくり探す</p>
              <h2 className="text-2xl font-black text-ink">ジャンルから選ぶ</h2>
            </div>
            <div className="flex flex-wrap gap-2 text-xs font-bold text-muted">
              <span className="rounded-full bg-leaf px-3 py-1 text-white">公開中</span>
              <span className="rounded-full bg-mist px-3 py-1">近日公開</span>
              <span className="rounded-full bg-amberSoft px-3 py-1">確認中（注記）</span>
            </div>
          </div>

          <div className="genre-selector-layout">
            <div>
              <p className="genre-group-title">公開中</p>
              <div className="published-genre-grid" role="group" aria-label="公開中ジャンル">
                <button
                  type="button"
                  onClick={() => handleGenreChange("all")}
                  className={`genre-card genre-card-all ${selectedGenre === "all" ? "is-active" : ""}`}
                >
                  <span className="block text-sm font-black">すべての公開中ジャンル</span>
                  <span className="mt-1 block text-xs opacity-80">{videos.length}本から探す</span>
                </button>
                {publishedGenres.map((genre) => (
                  <button
                    type="button"
                    key={genre.key}
                    onClick={() => handleGenreChange(genre.key)}
                    className={`genre-card ${selectedGenre === genre.key ? "is-active" : ""}`}
                  >
                    <span className="flex items-start gap-2 text-sm font-black">
                      <GenreIcon genreKey={genre.key} className="genre-selector-icon" />
                      <span>{genreName(genre.key)}</span>
                    </span>
                    <span className="genre-status-chip">{statusLabel(genre.status)}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>

          <div className="mt-7 border-t border-line pt-6">
            <div className="mb-4">
              <p className="text-sm font-bold text-leaf">②詳細に探す</p>
              <h2 className="text-2xl font-black text-ink">条件で絞り込む</h2>
            </div>
            <div className="filter-control-grid grid gap-3 min-[560px]:grid-cols-2 min-[940px]:grid-cols-[1fr_0.8fr_0.9fr_1.4fr_auto]">
              <label className="filter-control">
                <span className="mb-1 block text-sm font-bold text-muted">サブジャンル</span>
                <select
                  value={selectedSub}
                  onChange={(event) => setSelectedSub(event.target.value)}
                  className="h-12 w-full rounded-lg border border-line bg-white px-3 text-base"
                >
                  <option value="all">すべて</option>
                  {subOptions.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              </label>
              <label className="filter-control">
                <span className="mb-1 block text-sm font-bold text-muted">レベル</span>
                <select
                  value={selectedLevel}
                  onChange={(event) => setSelectedLevel(event.target.value as (typeof levels)[number])}
                  className="h-12 w-full rounded-lg border border-line bg-white px-3 text-base"
                >
                  {levels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </label>
              <label className="filter-control">
                <span className="mb-1 block text-sm font-bold text-muted">所要時間</span>
                <select
                  value={selectedTime}
                  onChange={(event) => setSelectedTime(event.target.value)}
                  className="h-12 w-full rounded-lg border border-line bg-white px-3 text-base"
                >
                  {timeBuckets.map((bucket) => (
                    <option key={bucket.value} value={bucket.value}>
                      {bucket.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="filter-control filter-control-keyword">
                <span className="mb-1 block text-sm font-bold text-muted">キーワード</span>
                <input
                  value={searchDraft}
                  onChange={(event) => {
                    setSearchDraft(event.target.value);
                    setSuggestionsOpen(true);
                  }}
                  onFocus={() => setSuggestionsOpen(true)}
                  onKeyDown={handleSearchKeyDown}
                  placeholder="例: Claude / Python / 独学"
                  className="h-12 w-full rounded-lg border border-line bg-white px-3 text-base"
                  autoComplete="off"
                />
                <span className="filter-hint text-xs font-bold text-muted">⌘Kでも検索できます</span>
              </label>
              <button
                type="button"
                onClick={resetFilters}
                className="filter-reset h-12 rounded-lg border border-line bg-paper px-4 text-sm font-black text-ink transition hover:border-accent/50 hover:shadow-card"
              >
                条件リセット
              </button>
            </div>

            <div className="mt-5 flex flex-col gap-2 text-sm text-muted min-[680px]:flex-row min-[680px]:items-center min-[680px]:justify-between">
              <p>
                <span className="font-black text-ink">{filteredVideos.length}</span>件ヒット
                {selectedGenreData?.status === "preparing" ? "。このジャンルは近日公開です。" : ""}
                {selectedGenreData?.status === "checking" ? "。このジャンルは確認中です。" : ""}
              </p>
              <p>視聴はYouTube公式リンクのみ。動画のダウンロード機能はありません。</p>
            </div>
          </div>
          {upcomingGenres.length > 0 ? (
            <p className="upcoming-genre-note">
              順次公開予定: {upcomingGenres.map((genre) => genreName(genre.key)).join(" / ")} は準備中です。
            </p>
          ) : null}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 min-[760px]:px-6" aria-label="動画一覧">
        {!searchActive && selectedGenreData?.status === "published" ? (
          <GenreSummaryPanel
            genre={selectedGenreData}
            topics={selectedGenreTopics}
            topVideo={selectedGenreTopVideo}
            selectedSub={selectedSub}
            onTopicSelect={setSelectedSub}
          />
        ) : null}
        <div id="results-anchor" className="results-anchor" aria-hidden="true" />
        {selectedGenreData?.status !== "published" && selectedGenreData && !searchActive ? (
          <div className="rounded-lg border border-line bg-surface p-5 shadow-card">
            <p className="flex items-center gap-2 text-sm font-bold text-leaf">
              <GenreIcon genreKey={selectedGenreData.key} className="selected-genre-icon" />
              <span>{genreName(selectedGenreData.key)}</span>
            </p>
            <h2 className="mt-2 text-2xl font-black">
              {selectedGenreData.status === "checking" ? "確認中（注記）" : "近日公開"}
            </h2>
            <p className="mt-2 leading-7 text-muted">
              種コンテンツが揃い次第、独自3行レビューとロードマップを追加します。
            </p>
          </div>
        ) : filteredVideos.length === 0 ? (
          <div className="rounded-lg border border-line bg-surface p-5 shadow-card">
            <h2 className="text-2xl font-black">該当する動画がありません</h2>
            <p className="mt-2 leading-7 text-muted">条件を少し広げて探してください。</p>
          </div>
        ) : (
          <>
            <ResultSummary total={filteredVideos.length} start={pageStartIndex + 1} end={Math.min(pageStartIndex + pageVideos.length, filteredVideos.length)} searchActive={searchActive} />
            {searchActive ? (
              <div className="search-result-groups">
                {groupedPageVideos.map((group) => (
                  <section key={group.genreKey} className="search-result-group">
                    <h2>{genreLabel(group.genreKey)} <span>{group.items.length}件</span></h2>
                    <div className="grid gap-4 min-[560px]:grid-cols-2 min-[880px]:grid-cols-3">
                      {group.items.map((video) => <VideoCard key={video.ytid} video={video} highlighted={highlightedVideoId === video.ytid} />)}
                    </div>
                  </section>
                ))}
              </div>
            ) : (
              <div className="grid gap-4 min-[560px]:grid-cols-2 min-[880px]:grid-cols-3">
                {pageVideos.map((video) => <VideoCard key={video.ytid} video={video} highlighted={highlightedVideoId === video.ytid} />)}
              </div>
            )}
            <PaginationControls currentPage={safeCurrentPage} totalPages={totalPages} onPageChange={updatePage} />
          </>
        )}
      </section>

      <section id="roadmap" className="roadmap-section">
        <div className="roadmap-shell">
          <div className="roadmap-heading">
            <div>
              <p className="section-eyebrow">学習ロードマップ</p>
              <h2 className="section-title">初級→中級→上級の順番で迷わず進む</h2>
            </div>
            <Image
              src="/brand/roadmap-path.png"
              alt="初級から上級へ進むロードマップの道筋"
              width={1200}
              height={400}
              loading="lazy"
              sizes="(min-width: 760px) 360px, 82vw"
              className="roadmap-heading-art"
            />
          </div>
          {roadmapTabs.length === 0 || activeRoadmap === null ? (
            <p className="rounded-lg border border-line bg-surface p-5 shadow-card text-muted">
              このジャンルのロードマップは近日公開です。
            </p>
          ) : (
            <>
              <div className="roadmap-tabs" role="tablist" aria-label="ロードマップのジャンル">
                {roadmapTabs.map((roadmap) => (
                  <button
                    key={roadmap.genre}
                    type="button"
                    role="tab"
                    aria-selected={activeRoadmap.genre === roadmap.genre}
                    aria-controls="roadmap-panel"
                    onClick={() => setActiveRoadmapGenre(roadmap.genre)}
                    className={activeRoadmap.genre === roadmap.genre ? "roadmap-tab is-active" : "roadmap-tab"}
                  >
                    {genreLabel(roadmap.genre)}
                  </button>
                ))}
              </div>
              <RoadmapTimeline roadmap={activeRoadmap} />
            </>
          )}
        </div>
      </section>

      <section id="pr" className="mx-auto max-w-7xl px-4 py-8 min-[760px]:px-6">
        <div className="mb-5">
          <p className="text-sm font-bold text-coral">PR / 広告</p>
          <h2 className="text-2xl font-black text-ink">おすすめ教材・スクール（PR）</h2>
          <p className="mt-2 max-w-3xl leading-7 text-muted">
            v1では実リンク未設置です。ASP提携後、承認ゲートを通して
            <code className="mx-1 rounded bg-white px-1">rel=&quot;sponsored noopener&quot;</code>
            付きリンクを差し込みます。
          </p>
        </div>
        <div className="grid gap-4 min-[640px]:grid-cols-2 min-[980px]:grid-cols-4">
          {visiblePrGenres.map((genre) => (
            <PrBlock key={genre.key} genre={genre} />
          ))}
        </div>
      </section>

      <footer className="border-t border-primaryInk bg-ink text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-7 min-[760px]:flex-row min-[760px]:items-center min-[760px]:justify-between min-[760px]:px-6">
          <div>
            <p className="flex items-center gap-2 text-xl font-black">
              <BrandMark className="h-8 w-8" />
              <span>Manapick</span>
            </p>
            <p className="mt-1 text-sm text-white/68">学び直しを、最短ルートに。</p>
          </div>
          <nav className="flex flex-wrap gap-4 text-sm font-bold text-white/78" aria-label="固定ページ">
            <a className="hover:text-white" href="/about-score/">
              採点方法
            </a>
            <a className="hover:text-white" href="/operator/">
              運営者情報
            </a>
            <a className="hover:text-white" href="/privacy/">
              プライバシーポリシー
            </a>
            <a className="hover:text-white" href="/disclaimer/">
              免責事項
            </a>
            <a className="hover:text-white" href="/contact/">
              お問い合わせ
            </a>
          </nav>
        </div>
      </footer>
    </main>
  );
}


function LiveSearchPanel({
  id,
  query,
  total,
  suggestions,
  activeIndex,
  open,
  popularVideos,
  onSelect,
  onClose
}: {
  id: string;
  query: string;
  total: number;
  suggestions: Video[];
  activeIndex: number;
  open: boolean;
  popularVideos: Video[];
  onSelect: (video: Video) => void;
  onClose: () => void;
}) {
  const hasQuery = query.trim().length > 0;
  const fallbackVideos = popularVideos.slice(0, 3);

  return (
    <div id={id} className={open ? "live-search-panel is-open" : "live-search-panel"} role="status" aria-live="polite">
      <div className="live-search-status">
        {hasQuery ? (
          total > 0 ? <span>{total}件ヒット</span> : <span>見つかりませんでした</span>
        ) : (
          <span>キーワードで全動画を検索できます</span>
        )}
        <button type="button" onClick={onClose} aria-label="候補を閉じる">閉じる</button>
      </div>
      {hasQuery && suggestions.length > 0 ? (
        <ol className="live-suggestion-list" role="listbox" aria-label="検索候補">
          {suggestions.map((video, index) => (
            <li key={video.ytid}>
              <button
                type="button"
                className={index === activeIndex ? "is-active" : ""}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => onSelect(video)}
                role="option"
                aria-selected={index === activeIndex}
              >
                <span className="live-suggestion-title">{video.title}</span>
                <span className="live-suggestion-meta">{genreLabel(video.genre)} / {scoreText(video)} / {video.minutes}分</span>
              </button>
            </li>
          ))}
        </ol>
      ) : null}
      {hasQuery && total === 0 ? (
        <div className="live-search-empty">
          <p>条件を少し広げるか、人気の動画から始められます。</p>
          <div>
            {fallbackVideos.map((video) => (
              <button key={video.ytid} type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => onSelect(video)}>
                {video.title}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function SiteMenuDrawer({
  genres,
  drawerRef,
  onKeyDown,
  onClose,
  onGenreSelect,
  onGenreList,
  onSectionSelect
}: {
  genres: Genre[];
  drawerRef: RefObject<HTMLElement>;
  onKeyDown: (event: ReactKeyboardEvent<HTMLElement>) => void;
  onClose: () => void;
  onGenreSelect: (genreKey: string) => void;
  onGenreList: () => void;
  onSectionSelect: (sectionId: string) => void;
}) {
  return (
    <div className="site-menu-layer">
      <button type="button" className="site-menu-backdrop" aria-label="メニューを閉じる" onClick={onClose} />
      <aside
        id="site-menu"
        ref={drawerRef}
        className="site-menu-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="site-menu-title"
        onKeyDown={onKeyDown}
      >
        <div className="site-menu-head">
          <div>
            <p className="section-eyebrow">Manapick</p>
            <h2 id="site-menu-title">メニュー</h2>
          </div>
          <button type="button" className="site-menu-close" onClick={onClose} aria-label="メニューを閉じる">
            ×
          </button>
        </div>
        <nav className="site-menu-links" aria-label="メニューリンク">
          <button type="button" className="site-menu-link" onClick={onGenreList}>
            8ジャンル一覧
          </button>
          <div className="site-menu-genre-grid" role="group" aria-label="ジャンル一覧">
            {genres.map((genre) => (
              <button key={genre.key} type="button" onClick={() => onGenreSelect(genre.key)}>
                <GenreIcon genreKey={genre.key} className="site-menu-genre-icon" />
                <span>{genreLabel(genre.key)}</span>
              </button>
            ))}
          </div>
          <button type="button" className="site-menu-link" onClick={() => onSectionSelect("roadmap")}>
            ロードマップ
          </button>
          <a className="site-menu-link" href="/about-score/" onClick={onClose}>
            採点方法
          </a>
          <button type="button" className="site-menu-link" onClick={() => onSectionSelect("pr")}>
            PR
          </button>
          <a className="site-menu-link" href="/contact/" onClick={onClose}>
            お問い合わせ
          </a>
        </nav>
      </aside>
    </div>
  );
}

function CategoryTabNav({
  genres,
  activeGenre,
  onSelect
}: {
  genres: Genre[];
  activeGenre: string;
  onSelect: (genreKey: string) => void;
}) {
  return (
    <nav className="category-tab-nav" aria-label="公開中ジャンル">
      <div className="category-tab-track">
        {genres.map((genre) => (
          <button
            key={genre.key}
            type="button"
            className={activeGenre === genre.key ? "category-tab is-active" : "category-tab"}
            onClick={() => onSelect(genre.key)}
            aria-current={activeGenre === genre.key ? "page" : undefined}
          >
            <GenreIcon genreKey={genre.key} className="category-tab-icon" />
            <span className="category-tab-text">
              <span>{genreLabel(genre.key)}</span>
              <small>{genreEnglishLabel(genre.key)}</small>
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
}

function HeroVideoCarousel({ slides }: { slides: HeroCarouselSlide[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);
  const touchStartX = useRef<number | null>(null);
  const slideCount = slides.length;
  const activeSlide = slides[activeIndex] ?? slides[0];
  const modes: { mode: PopularTab; label: string }[] = [
    { mode: "popular", label: "総合人気" },
    { mode: "new", label: "新着" },
    { mode: "score", label: "スコア順" }
  ];

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncReducedMotion = () => setReducedMotion(media.matches);
    syncReducedMotion();
    media.addEventListener("change", syncReducedMotion);
    return () => media.removeEventListener("change", syncReducedMotion);
  }, []);

  useEffect(() => {
    if (reducedMotion || isPaused || slideCount <= 1) return;
    const interval = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % slideCount);
    }, 4000);
    return () => window.clearInterval(interval);
  }, [isPaused, reducedMotion, slideCount]);

  if (!activeSlide) return null;

  function moveSlide(delta: number) {
    setActiveIndex((index) => (index + delta + slideCount) % slideCount);
  }

  function handleTouchEnd(clientX: number) {
    if (touchStartX.current === null) return;
    const distance = touchStartX.current - clientX;
    touchStartX.current = null;
    if (Math.abs(distance) < 36) return;
    moveSlide(distance > 0 ? 1 : -1);
  }

  function jumpToMode(mode: PopularTab) {
    const nextIndex = slides.findIndex((slide) => slide.mode === mode);
    if (nextIndex >= 0) setActiveIndex(nextIndex);
  }

  return (
    <section
      className="hero-carousel"
      aria-label="注目の12本"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      onTouchStart={(event) => {
        touchStartX.current = event.touches[0]?.clientX ?? null;
        setIsPaused(true);
      }}
      onTouchEnd={(event) => {
        handleTouchEnd(event.changedTouches[0]?.clientX ?? 0);
        setIsPaused(false);
      }}
    >
      <div className="hero-carousel-header">
        <div className="hero-carousel-title-group">
          <span className="hero-carousel-heading-icon" aria-hidden="true">
            <Image src="/brand/ranking-podium.png" alt="" width={44} height={44} loading="lazy" />
          </span>
          <span>
            <h2>注目の12本</h2>
            <p>人気・新着・高スコアから選んだ12本</p>
          </span>
        </div>
        <div className="hero-carousel-tabs" role="tablist" aria-label="ランキングの種類">
          {modes.map((mode) => (
            <button
              key={mode.mode}
              type="button"
              className={activeSlide.mode === mode.mode ? "is-active" : ""}
              onClick={() => jumpToMode(mode.mode)}
              role="tab"
              aria-selected={activeSlide.mode === mode.mode}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      <div className="hero-carousel-frame">
        <a
          key={activeSlide.key}
          className="hero-carousel-slide"
          href={videoDetailHref(activeSlide.video)}
          aria-label={activeSlide.video.title + "の詳細ページを開く"}
        >
          <span className="hero-carousel-media">
            <Image
              src={"https://i.ytimg.com/vi/" + activeSlide.video.ytid + "/hqdefault.jpg"}
              alt=""
              fill
              sizes="(min-width: 1440px) 760px, (min-width: 1280px) 640px, (min-width: 760px) 52vw, 92vw"
              priority={activeIndex === 0}
              className="object-cover"
            />
          </span>
          <span className={`rank-badge rank-${Math.min(activeSlide.rank, 4)}`}>{activeSlide.rank}</span>
          <span className="hero-carousel-content">
            <span className="hero-carousel-title">{activeSlide.video.title}</span>
            <span className="hero-carousel-sub">{scoreText(activeSlide.video)} / {activeSlide.video.minutes}分</span>
          </span>
        </a>

        <button type="button" className="hero-carousel-arrow is-prev" onClick={() => moveSlide(-1)} aria-label="前の動画">
          ‹
        </button>
        <button type="button" className="hero-carousel-arrow is-next" onClick={() => moveSlide(1)} aria-label="次の動画">
          ›
        </button>

        <div className="hero-carousel-count" aria-live="polite">
          {activeIndex + 1}/{slideCount}
        </div>
      </div>
    </section>
  );
}

function HeroTrustStats({ totalVideos, confirmedCount }: { totalVideos: number; confirmedCount: number }) {
  const stats = [
    {
      label: "厳選" + totalVideos + "本掲載",
      icon: (
        <svg viewBox="0 0 24 24" role="presentation" focusable="false">
          <path d="m5 12 4 4L19 6" />
        </svg>
      )
    },
    {
      label: "毎週更新",
      icon: (
        <svg viewBox="0 0 24 24" role="presentation" focusable="false">
          <path d="M4 12a8 8 0 0 1 13-6" />
          <path d="M17 3v5h-5" />
          <path d="M20 12a8 8 0 0 1-13 6" />
          <path d="M7 21v-5h5" />
        </svg>
      )
    },
    {
      label: "公式埋め込みのみ・無料",
      icon: (
        <svg viewBox="0 0 24 24" role="presentation" focusable="false">
          <path d="M12 3 5 6v6c0 4 3 7 7 9 4-2 7-5 7-9V6z" />
          <path d="m9 12 2 2 4-5" />
        </svg>
      )
    }
  ];

  if (confirmedCount > 0) {
    stats.push({
      label: "確認済" + confirmedCount + "本",
      icon: (
        <svg viewBox="0 0 24 24" role="presentation" focusable="false">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      )
    });
  }

  return (
    <div className="hero-trust-band" aria-label="Manapickの信頼指標">
      {stats.map((stat) => (
        <span key={stat.label} className="hero-trust-pill">
          <span aria-hidden="true" className="hero-trust-icon">
            {stat.icon}
          </span>
          <span>{stat.label}</span>
        </span>
      ))}
      <a className="hero-score-link" href="/about-score/">採点方法を見る</a>
    </div>
  );
}

function PurposeNav({ onSelect }: { onSelect: (genreKey: string) => void }) {
  return (
    <div className="purpose-nav" aria-label="目的から選ぶ">
      <div>
        {purposeLinks.map((item) => {
          const href = item.genre === "roadmap" ? "#roadmap" : item.genre === "all" ? "#genre-picker" : "#search";
          return (
            <a
              key={item.number}
              href={href}
              onClick={(event) => {
                event.preventDefault();
                onSelect(item.genre);
              }}
              className="purpose-block"
            >
              <PurposeIcon icon={item.icon} />
              <span className="purpose-number">{item.number}</span>
              <span className="purpose-title">{item.title}</span>
              <span className="purpose-label">{item.label}</span>
            </a>
          );
        })}
      </div>
    </div>
  );
}

function PurposeIcon({ icon }: { icon: string }) {
  if (icon === "grid") {
    return (
      <span aria-hidden="true" className="purpose-icon">
        <svg viewBox="0 0 24 24" role="presentation" focusable="false">
          <path d="M4 4h7v7H4z" />
          <path d="M13 4h7v7h-7z" />
          <path d="M4 13h7v7H4z" />
          <path d="M13 13h7v7h-7z" />
        </svg>
      </span>
    );
  }
  if (icon === "path") {
    return (
      <span aria-hidden="true" className="purpose-icon">
        <svg viewBox="0 0 24 24" role="presentation" focusable="false">
          <path d="M5 18c4-9 9 0 14-9" />
          <path d="M16 7h4v4" />
          <path d="M5 18h.01" />
          <path d="M12 13h.01" />
          <path d="M19 9h.01" />
        </svg>
      </span>
    );
  }
  return (
    <span aria-hidden="true" className="purpose-icon">
      <svg viewBox="0 0 24 24" role="presentation" focusable="false">
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v3" />
        <path d="M12 19v3" />
        <path d="M2 12h3" />
        <path d="M19 12h3" />
      </svg>
    </span>
  );
}

function ResultSummary({ total, start, end, searchActive }: { total: number; start: number; end: number; searchActive: boolean }) {
  return (
    <div className="result-summary">
      <div>
        <p>{total}件中 {start}–{end}件を表示</p>
        {searchActive ? <p className="result-search-note">全ジャンル横断検索中。ジャンルを選ぶと検索を解除します。</p> : null}
      </div>
    </div>
  );
}

function PaginationControls({ currentPage, totalPages, onPageChange }: { currentPage: number; totalPages: number; onPageChange: (page: number) => void }) {
  if (totalPages <= 1) return null;
  const pages = Array.from(new Set([1, currentPage - 1, currentPage, currentPage + 1, totalPages]))
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((a, b) => a - b);

  return (
    <nav className="pagination" aria-label="動画一覧ページ">
      <button type="button" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage <= 1}>前へ</button>
      <div>
        {pages.map((page) => (
          <button key={page} type="button" onClick={() => onPageChange(page)} aria-current={page === currentPage ? "page" : undefined}>
            {page}
          </button>
        ))}
      </div>
      <button type="button" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage >= totalPages}>次へ</button>
      {currentPage < totalPages ? (
        <button type="button" className="pagination-more" onClick={() => onPageChange(currentPage + 1)}>もっと見る</button>
      ) : null}
    </nav>
  );
}

function AllGenreHighlights({ onGenreSelect }: { onGenreSelect: (genreKey: string) => void }) {
  const highlights = publishedGenreKeys
    .map((genreKey) => ({ genreKey, video: topScoredVideo(videos.filter((video) => video.genre === genreKey)) }))
    .filter((item): item is { genreKey: string; video: Video } => item.video !== null);

  return (
    <section className="all-genre-highlights" aria-labelledby="all-genre-highlights-title">
      <div className="section-heading-row">
        <div>
          <p className="section-eyebrow">まず見るべき1本</p>
          <h2 id="all-genre-highlights-title" className="section-title">ジャンル別の入口</h2>
        </div>
      </div>
      <div className="highlight-grid">
        {highlights.map(({ genreKey, video }) => (
          <button key={genreKey} type="button" className="highlight-card" onClick={() => onGenreSelect(genreKey)}>
            <span className="highlight-genre">{genreLabel(genreKey)}</span>
            <span className="highlight-title">{video.title}</span>
            <span className="highlight-meta">{scoreText(video)} / {video.minutes}分</span>
          </button>
        ))}
      </div>
    </section>
  );
}

function GenreSummaryPanel({
  genre,
  topics,
  topVideo,
  selectedSub,
  onTopicSelect
}: {
  genre: Genre;
  topics: [string, number][];
  topVideo: Video | null;
  selectedSub: string;
  onTopicSelect: (sub: string) => void;
}) {
  return (
    <section className="genre-summary-panel" aria-labelledby="genre-summary-title">
      <div className="genre-summary-heading">
        <div>
          <p className="section-eyebrow">{genreName(genre.key)}</p>
          <h2 id="genre-summary-title" className="section-title">トピックから絞り込む</h2>
        </div>
        {selectedSub !== "all" ? <button type="button" onClick={() => onTopicSelect("all")}>絞り込み解除</button> : null}
      </div>
      <div className="topic-chip-row" role="group" aria-label="サブジャンルトピック">
        {topics.map(([sub, count]) => (
          <button key={sub} type="button" className={selectedSub === sub ? "topic-chip is-active" : "topic-chip"} onClick={() => onTopicSelect(sub)}>
            <span>{sub}</span>
            <strong>{count}</strong>
          </button>
        ))}
      </div>
      {topVideo ? <FeaturedVideoCard video={topVideo} /> : null}
    </section>
  );
}

function FeaturedVideoCard({ video }: { video: Video }) {
  return (
    <article className="featured-video-card">
      <div className="featured-video-thumb">
        <a className="featured-video-thumb-link" href={videoDetailHref(video)} aria-label={video.title + "の詳細ページを開く"}>
          <Image src={"https://i.ytimg.com/vi/" + video.ytid + "/hqdefault.jpg"} alt="" fill sizes="(min-width: 760px) 320px, 92vw" className="object-cover" />
        </a>
        <ScoreBadge video={video} compact />
      </div>
      <div>
        <p className="featured-video-eyebrow">まず見るべき1本</p>
        <h3><a href={videoDetailHref(video)}>{video.title}</a></h3>
        <p>{video.review[0]}</p>
        <a href={videoDetailHref(video)}>詳細を見る</a>
      </div>
    </article>
  );
}

function ScoreBadge({ video, compact = false }: { video: Video; compact?: boolean }) {
  const status = scoreStatus(video);
  const label = status === "confirmed" ? scoreText(video) + " ✓確認済" : scoreText(video) + " 暫定";
  const statusLabel = status === "confirmed" ? "✓確認済" : "暫定";

  return (
    <a
      className={[scoreClasses(video), compact ? "is-compact" : ""].filter(Boolean).join(" ")}
      href="/about-score/"
      aria-label={label + "。採点方法を開く"}
      title="採点方法を開く"
    >
      <span>{scoreText(video)}</span>
      <span className={`score-badge-status is-${status}`}>{statusLabel}</span>
    </a>
  );
}

function WeeklyPickCard({ video }: { video: Video }) {
  const reviewLine = video.review[0] ?? "今週まず見てほしい、Manapick最高スコアの一本です。";

  return (
    <article className="weekly-pick-card" aria-label="今週のイチオシ">
      <div className="weekly-pick-thumb">
        <a className="weekly-pick-thumb-link" href={videoDetailHref(video)} aria-label={video.title + "の詳細ページを開く"}>
          <Image
            src={"https://i.ytimg.com/vi/" + video.ytid + "/hqdefault.jpg"}
            alt=""
            fill
            sizes="(min-width: 1320px) 680px, (min-width: 760px) 92vw, 92vw"
            loading="eager"
            className="object-cover"
          />
        </a>
      </div>
      <div className="weekly-pick-body">
        <p className="weekly-pick-eyebrow">今週のイチオシ</p>
        <h2><a href={videoDetailHref(video)}>{video.title}</a></h2>
        <p>{reviewLine}</p>
        {video.editorNote ? <p className="editor-note">編集メモ: {video.editorNote}</p> : null}
        <div className="weekly-pick-meta">
          <ScoreBadge video={video} compact />
          <span>{video.minutes}分</span>
        </div>
        <a className="weekly-pick-button" href={video.url} target="_blank" rel="noopener noreferrer">
          YouTubeで視聴
        </a>
      </div>
    </article>
  );
}


function buildRoadmapSteps(roadmap: Roadmap): DisplayRoadmapStep[] {
  const steps = roadmap.steps.slice(0, 3) as DisplayRoadmapStep[];

  while (steps.length < 3) {
    const nextIndex = steps.length + 1;
    const isFinal = nextIndex === 3;
    steps.push({
      label: "STEP" + nextIndex,
      level: "近日追加",
      goal: isFinal
        ? "上級動画を追加し、実務で使い切る段階まで進めるルートを整備中です。"
        : "中級動画を追加し、基礎から実務へ進む橋渡しを整備中です。",
      videos: [],
      isPlaceholder: true
    });
  }

  const hasAdvancedStep = steps.some((step) => step.level.includes("上級") && !step.isPlaceholder);
  if (!hasAdvancedStep && !steps[2].isPlaceholder) {
    steps[2] = {
      label: "STEP3",
      level: "近日追加",
      goal: "上級動画を追加し、実務で使い切る段階まで進めるルートを整備中です。",
      videos: [],
      isPlaceholder: true
    };
  }

  return steps;
}

function VideoCard({ video, highlighted = false }: { video: Video; highlighted?: boolean }) {
  const channel = displayChannel(video);
  const ageLabel = publishedAgeLabel(video);

  return (
    <article
      id={video.ytid}
      className={["group flex min-w-0 scroll-mt-6 flex-col overflow-hidden rounded-lg border border-line bg-surface shadow-card transition duration-300 ease-[var(--ease-standard)] hover:-translate-y-1 hover:shadow-cardHover focus-within:shadow-cardHover motion-reduce:transform-none motion-reduce:transition-none", highlighted ? "is-search-highlighted" : ""].join(" ")}
    >
      <div className="relative overflow-hidden bg-bgSoft">
        <a
          href={videoDetailHref(video)}
          aria-label={video.title + "の詳細ページを開く"}
          className="block"
        >
          <div className="relative aspect-video bg-bgSoft">
            <Image
              src={"https://i.ytimg.com/vi/" + video.ytid + "/hqdefault.jpg"}
              alt=""
              fill
              sizes="(min-width: 880px) 33vw, (min-width: 560px) 50vw, 100vw"
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-300 ease-[var(--ease-standard)] group-hover:scale-[1.025] motion-reduce:transform-none motion-reduce:transition-none"
            />
            <span className="video-duration-badge">
              {video.minutes}分
            </span>
          </div>
        </a>
        <div className="card-score-wrap">
          <ScoreBadge video={video} compact />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex flex-wrap gap-2">
          <LevelBadge level={video.level} />
          <span className="rounded-pill bg-bg px-2.5 py-1 text-xs font-black text-ink">{video.sub}</span>
          {ageLabel ? <span className="published-age">{ageLabel}</span> : null}
        </div>
        <h3 className="line-clamp-2 text-base font-black leading-6 text-ink">
          <a className="transition hover:text-accent" href={videoDetailHref(video)}>
            {video.title}
          </a>
        </h3>
        {channel ? <p className="text-sm font-bold text-muted">チャンネル: {channel}</p> : null}
        {video.editorNote ? <p className="editor-note">編集メモ: {video.editorNote}</p> : null}
        <ol className="grid gap-2 text-sm leading-6 text-ink/76">
          {video.review.map((line, index) => (
            <li key={line} className="flex gap-2">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-pill bg-bgSoft text-xs font-black text-primaryInk">
                {index + 1}
              </span>
              <span>{line}</span>
            </li>
          ))}
        </ol>
        <div className="flex flex-wrap gap-2">
          {video.tags.map((tag) => (
            <span key={tag} className="rounded-pill border border-line bg-white px-2 py-1 text-xs font-bold text-muted">
              #{tag}
            </span>
          ))}
        </div>
        {video.axisScores.length > 0 ? (
          <details className="rounded-md border border-line bg-bg px-3 py-2 text-sm open:bg-white">
            <summary className="cursor-pointer font-black text-primaryInk">詳細スコアを見る</summary>
            <p className="mt-2 text-xs font-bold text-muted">
              <a className="underline decoration-dotted underline-offset-4" href="/about-score/">採点方法</a>
              も確認できます。
            </p>
            <dl className="mt-3 grid gap-2">
              {video.axisScores.map((axis) => (
                <div key={axis.axis} className="grid gap-1 border-t border-line pt-2 first:border-t-0 first:pt-0">
                  <dt className="font-black text-ink">
                    {axis.axis} {axis.score}/5
                  </dt>
                  <dd className="leading-6 text-muted">{axis.note}</dd>
                </div>
              ))}
            </dl>
          </details>
        ) : (
          <p className="rounded-md border border-dashed border-line bg-bg px-3 py-2 text-sm font-bold text-muted">
            Manapickスコアは公開前の視聴確認で確定します。
          </p>
        )}
        <a
          className="mt-auto inline-flex h-11 items-center justify-center rounded-md bg-accent px-4 text-sm font-black text-white shadow-button transition duration-200 ease-[var(--ease-standard)] hover:bg-primary focus-visible:outline-primary motion-reduce:transition-none"
          href={video.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          YouTubeで視聴
        </a>
      </div>
    </article>
  );
}



function LevelBadge({ level }: { level: Video["level"] }) {
  const meta = levelMeta(level);
  const definitions = {
    初級: "初級: 前提知識なしで見られる入口の1本",
    中級: "中級: 基礎を一通り触れた人向けの応用・体系化",
    上級: "上級: 実務応用・専門特化"
  } satisfies Record<Video["level"], string>;

  return (
    <span
      className={["level-badge", meta.className].join(" ")}
      title={definitions[level] + "。詳しくは採点方法ページのレベル定義をご覧ください。"}
    >
      <span aria-hidden="true">{meta.icon}</span>
      <span>{level}</span>
    </span>
  );
}

function GenreIcon({ genreKey, className = "" }: { genreKey: string; className?: string }) {
  const src = genreIconSources[genreKey];

  return (
    <span aria-hidden="true" className={`genre-icon-shell ${className}`}>
      {src ? (
        <Image src={src} alt="" width={32} height={32} className="genre-icon-image" />
      ) : (
        <LineGenreIcon genreKey={genreKey} />
      )}
    </span>
  );
}

function LineGenreIcon({ genreKey }: { genreKey: string }) {
  if (genreKey === "data") {
    return (
      <svg viewBox="0 0 24 24" role="presentation" focusable="false">
        <path d="M5 19V9" />
        <path d="M12 19V5" />
        <path d="M19 19v-7" />
        <path d="M4 19h17" />
      </svg>
    );
  }

  if (genreKey === "marke") {
    return (
      <svg viewBox="0 0 24 24" role="presentation" focusable="false">
        <path d="m4 16 5-5 4 4 7-8" />
        <path d="M15 7h5v5" />
        <path d="M4 20h17" />
      </svg>
    );
  }

  if (genreKey === "biz") {
    return (
      <svg viewBox="0 0 24 24" role="presentation" focusable="false">
        <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        <path d="M4 7h16v13H4z" />
        <path d="M9 12h6" />
      </svg>
    );
  }

  if (genreKey === "shikaku") {
    return (
      <svg viewBox="0 0 24 24" role="presentation" focusable="false">
        <path d="M7 4h10v16H7z" />
        <path d="M9 8h6" />
        <path d="M9 12h6" />
        <path d="M9 16h4" />
      </svg>
    );
  }

  if (genreKey === "kaikei") {
    return (
      <svg viewBox="0 0 24 24" role="presentation" focusable="false">
        <path d="M5 4h14v16H5z" />
        <path d="M8 8h8" />
        <path d="M8 12h2" />
        <path d="M14 12h2" />
        <path d="M8 16h2" />
        <path d="M14 16h2" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" role="presentation" focusable="false">
      <path d="M12 3v18" />
      <path d="M6 8h9a4 4 0 0 1 0 8H6" />
      <path d="M9 5v16" />
    </svg>
  );
}

function ValueChip({ iconSrc, title, body }: { iconSrc: string; title: string; body: string }) {
  return (
    <div className="min-w-0 rounded-md border border-line bg-white/82 p-3 shadow-card backdrop-blur">
      <div className="flex items-start gap-3">
        <Image
          src={iconSrc}
          alt=""
          width={40}
          height={40}
          aria-hidden="true"
          className="h-9 w-9 shrink-0 object-contain"
        />
        <div className="min-w-0">
          <p className="text-sm font-black leading-5 text-ink">{title}</p>
          <p className="mt-1 text-xs font-bold leading-5 text-muted">{body}</p>
        </div>
      </div>
    </div>
  );
}

function genreLabel(key: string) {
  const shortLabels: Record<string, string> = {
    ai: "生成AI",
    prog: "プログラミング",
    video: "動画編集",
    english: "英語",
    data: "データ分析",
    marke: "Webマーケ",
    biz: "Office・資料",
    shikaku: "資格"
  };
  return shortLabels[key] ?? genreDisplayName(key);
}

function roadmapTitle(roadmap: Roadmap) {
  if (roadmap.genre === "biz") return "Office・資料作成ロードマップ";
  return roadmap.title;
}

function RoadmapTimeline({ roadmap }: { roadmap: Roadmap }) {
  const steps = buildRoadmapSteps(roadmap);

  return (
    <section id="roadmap-panel" className="roadmap-panel" role="tabpanel">
      <div className="roadmap-title-row">
        <h3>{roadmapTitle(roadmap)}</h3>
        <span aria-hidden="true" className="roadmap-star">★</span>
      </div>
      <ol className="roadmap-timeline">
        {steps.map((step, index) => (
          <li
            key={roadmap.genre + "-" + step.label + "-" + index}
            className={step.isPlaceholder ? "roadmap-step is-placeholder" : "roadmap-step"}
          >
            <div className="roadmap-node" aria-label={step.label + " " + step.level}>
              {index + 1}
            </div>
            <div className="roadmap-step-card">
              <div className="roadmap-step-meta">
                <span className="roadmap-step-label">{step.label}</span>
                <span className="roadmap-level">{step.level}</span>
              </div>
              <h4>
                <strong>{step.goal}</strong>
              </h4>
              {step.isPlaceholder ? (
                <p className="roadmap-placeholder-copy">
                  上級動画を選定中です。追加後にここへ公式サムネ付きで表示します。
                </p>
              ) : (
                <div className="roadmap-video-grid">
                  {step.videos.map((ytid) => {
                    const video = videos.find((item) => item.ytid === ytid);
                    return video ? <RoadmapMiniVideo key={ytid} video={video} /> : null;
                  })}
                </div>
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

function RoadmapMiniVideo({ video }: { video: Video }) {
  return (
    <a className="roadmap-mini-card" href={videoDetailHref(video)}>
      <span className="roadmap-mini-thumb">
        <Image
          src={"https://i.ytimg.com/vi/" + video.ytid + "/hqdefault.jpg"}
          alt=""
          fill
          sizes="(min-width: 760px) 160px, 35vw"
          loading="lazy"
          className="object-cover"
        />
      </span>
      <span className="roadmap-mini-body">
        <span className="roadmap-mini-title">{video.title}</span>
        <span className="roadmap-mini-meta">
          <span>{video.minutes}分</span>
        </span>
      </span>
    </a>
  );
}

function PrBlock({ genre }: { genre: Genre }) {
  return (
    <section className="rounded-lg border border-line bg-surface p-4 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <h3 className="flex items-center gap-2 font-black leading-6">
          <GenreIcon genreKey={genre.key} className="pr-genre-icon" />
          <span>{genreName(genre.key)}</span>
        </h3>
        <span className="rounded-full bg-coral px-2 py-1 text-xs font-black text-white">PR</span>
      </div>
      <p className="mt-2 text-sm font-bold text-ink/62">{genre.monetization}</p>
      <ul className="mt-3 grid gap-2 text-sm text-muted">
        {genre.prItems.map((item) => (
          <li key={item} className="rounded-lg bg-paper px-3 py-2">
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
