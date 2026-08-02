"use client";

import Fuse from "fuse.js";
import Image from "next/image";
import Link from "next/link";
import { type KeyboardEvent as ReactKeyboardEvent, type RefObject, useEffect, useMemo, useRef, useState } from "react";
import BrandLogo, { BrandMark } from "@/components/BrandLogo";
import AdSlot from "@/components/AdSlot";
import LikeButton from "@/components/LikeButton";
import RetentionBand from "@/components/RetentionBand";
import genresData from "@/content/genres.json";
import professionRoutesData from "@/content/professions.json";
import roadmapsData from "@/content/roadmaps.json";
import videosData from "@/content/videos.json";
import { MANAPICK_AI_URL, MANAPICK_CAREER_URL, MANAPICK_LICENSE_URL } from "@/lib/brand-links";
import { RECENT_KEY, WATCHED_KEY, WATCHLIST_KEY, jstDateKey, selectTodayVideo, sendGaEvent } from "@/lib/retention";
import { siteStats } from "@/lib/site-stats";
import { buildSubRoadmap } from "@/lib/sub-roadmap";
import { useLocalList } from "@/lib/useLocalList";
import { useStreakState } from "@/lib/useStreakState";

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

type ScoreStatus = "confirmed";

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
  scoreConfirmedAt?: string;
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

type ProfessionDestination = {
  label: string;
  genre: string;
  sub?: string;
  fallbackSub?: string;
  href: string;
  guideHref?: string;
};

type ProfessionRoute = {
  id: string;
  title: string;
  skill: string;
  relatedText: string;
  primaryLabel: string;
  href: string;
  guideHref: string;
  icon: string;
  note?: string;
  careerLinks: {
    label: string;
    href: string;
  }[];
  destinations: ProfessionDestination[];
};

const genres = genresData as Genre[];
const videos = videosData as Video[];
const roadmaps = roadmapsData as Roadmap[];
const professionRoutes = professionRoutesData as ProfessionRoute[];

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

const DESKTOP_PAGE_SIZE = 9;
const MOBILE_PAGE_SIZE = 5;
const SHOW_TOP_PR_SECTION = false;

type PopularTab = "popular" | "new" | "score";

type HeroCarouselSlide = {
  video: Video;
  mode: PopularTab;
  modeLabel: string;
  rank: number;
  key: string;
};

type LocalListState = ReturnType<typeof useLocalList>;
type LikeCounts = Record<string, number>;

const purposeLinks = [
  { number: "01", title: "なりたい職業から選ぶ", label: "職業ゴールから最短ルート", genre: "profession", icon: "target" },
  { number: "02", title: "ジャンルから選ぶ", label: siteStats.publishedGenreCount + "ジャンルから探す", genre: "all", icon: "grid" },
  { number: "03", title: "ロードマップで学ぶ", label: "順番を見て進む", genre: "roadmap", icon: "path" }
];

const searchIntentLinks = [
  {
    label: "YouTube学習動画おすすめ",
    href: "/youtube-learning/",
    note: "無料動画の選び方"
  },
  {
    label: "ChatGPTの始め方",
    href: "/learn/chatgpt-getting-started/",
    note: "登録前に使い方を確認"
  },
  {
    label: "エクセル統計の使い方",
    href: "/learn/excel-statistics/",
    note: "Excelデータ分析"
  },
  {
    label: "マーケティングYouTubeおすすめ",
    href: "/learn/web-marketing-youtube/",
    note: "Webマーケ入門"
  },
  {
    label: "Pythonは難しい？",
    href: "/learn/python-hard/",
    note: "初心者向けの順番"
  },
  {
    label: "資産運用を無料で勉強",
    href: "/learn/money-study-free/",
    note: "家計・NISA・投資"
  },
  {
    label: "FP3級の過去問",
    href: "/learn/fp3-past-questions/",
    note: "公式問題と解説動画"
  },
  {
    label: "社労士YouTubeおすすめ",
    href: "/learn/sharoshi-1year/",
    note: "1年の学習順も確認"
  },
  {
    label: "Power BIの使い方",
    href: "/learn/power-bi/",
    note: "Excelの次の一歩"
  },
  {
    label: "AIプロンプトのコツ",
    href: "/learn/ai-prompt-tips/",
    note: "生成AIの指示出し"
  },
  {
    label: "Copilot活用事例",
    href: "/learn/copilot-use-cases/",
    note: "仕事で使うAI"
  },
  {
    label: "YouTubeサムネイルの作り方",
    href: "/learn/youtube-thumbnail/",
    note: "動画編集・デザイン"
  },
  {
    label: "リスキリング 何から始める",
    href: "/youtube-learning/#youtube-steps-title",
    note: "最初の1本を決める"
  },
  {
    label: "秘書検定2級の日程",
    href: "/learn/secretary-test-schedule/",
    note: "公式日程と勉強法"
  }
];

const popularSearchKeywords = [
  "エクセル統計",
  "マーケティング",
  "Python 難しい",
  "資産運用",
  "FP3級 過去問",
  "社労士",
  "Power BI",
  "YouTubeサムネイル",
  "AIプロンプト",
  "Copilot 活用",
  "秘書検定 2級"
];

// footer markup moved to components/SiteFooter.tsx (rendered globally in app/layout.tsx)

function statusLabel(status: GenreStatus) {
  if (status === "published") return "公開中";
  if (status === "checking") return "確認中（注記）";
  return "近日公開";
}

function scoreStatus(_video: Video): ScoreStatus {
  return "confirmed";
}

function scoreText(video: Video) {
  return video.score === null ? "スコア準備中" : video.score + "/35";
}

function scoreStatusText(_video: Video) {
  return "運営者が視聴確認済み";
}

function scoreConfirmationText(video: Video) {
  const date = video.scoreConfirmedAt ? video.scoreConfirmedAt.replace(/-/g, "/") : null;
  return "運営者が実際に視聴し7軸35点で採点したスコアです" + (date ? "（確認日: " + date + "）" : "");
}

function scoreClasses(video: Video) {
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

function availableSubForGenre(genreKey: string, sub?: string, fallbackSub?: string) {
  if (sub && videos.some((video) => video.genre === genreKey && video.sub === sub)) return sub;
  if (fallbackSub && videos.some((video) => video.genre === genreKey && video.sub === fallbackSub)) return fallbackSub;
  return "all";
}

function destinationHasVideos(destination: ProfessionDestination): boolean {
  return videos.some(
    (video) => video.genre === destination.genre && (!destination.sub || video.sub === destination.sub)
  );
}

function videoDetailHref(video: Video) {
  return "/video/" + video.ytid + "/";
}

function thumbnailAlt(video: Video) {
  return video.title + "のサムネイル";
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
  return items.filter((video) => publishedGenreKeys.includes(video.genre)).reduce<Video | null>((best, video) => {
    if (video.score === null) return best;
    if (best === null || best.score === null || video.score > best.score) return video;
    return best;
  }, null);
}

function destinationVideos(destination: ProfessionDestination) {
  const sub = availableSubForGenre(destination.genre, destination.sub, destination.fallbackSub);
  return videos.filter((video) => video.genre === destination.genre && (sub === "all" || video.sub === sub));
}

function professionVideos(route: ProfessionRoute) {
  const seen = new Set<string>();
  return route.destinations.flatMap((destination) => destinationVideos(destination)).filter((video) => {
    if (seen.has(video.ytid)) return false;
    seen.add(video.ytid);
    return true;
  });
}

function primaryProfessionDestination(route: ProfessionRoute) {
  return route.destinations.find((destination) => destination.href === route.href) ?? route.destinations[0] ?? null;
}

function professionTopVideo(route: ProfessionRoute) {
  const primaryDestination = primaryProfessionDestination(route);
  const primaryVideos = primaryDestination ? destinationVideos(primaryDestination) : [];
  return topScoredVideo(primaryVideos) ?? topScoredVideo(professionVideos(route));
}

function professionStepCount(route: ProfessionRoute) {
  const genresForRoute = new Set(route.destinations.map((destination) => destination.genre));
  return roadmaps
    .filter((roadmap) => genresForRoute.has(roadmap.genre))
    .reduce((total, roadmap) => total + roadmap.steps.length, 0);
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

function monthsSincePublished(video: Video, referenceTime: number) {
  if (!video.publishedAt) return 36;
  const date = new Date(video.publishedAt);
  if (Number.isNaN(date.getTime())) return 36;
  const diff = referenceTime - date.getTime();
  return Math.max(0, diff / (1000 * 60 * 60 * 24 * 30.4375));
}

function popularityScore(video: Video, referenceTime: number) {
  const viewCount = Math.max(0, Number(video.viewCount || 0));
  if (viewCount <= 0) return 0;
  return Math.log10(viewCount) / Math.pow(monthsSincePublished(video, referenceTime) + 2, 0.6);
}

function blendedPopularityScore(video: Video, likeCounts: LikeCounts, maxLikeCount: number, referenceTime: number) {
  const likeCount = Math.max(0, likeCounts[video.ytid] ?? 0);
  const likeBoost = maxLikeCount > 0 ? (likeCount / maxLikeCount) * 0.15 : 0;
  return popularityScore(video, referenceTime) + likeBoost;
}

function rankedVideosByTab(tab: PopularTab, limit: number, referenceTime: number, likeCounts: LikeCounts = {}) {
  const ranked = [...videos].filter((video) => publishedGenreKeys.includes(video.genre));
  if (tab === "new") {
    ranked.sort((a, b) => publishedTime(b) - publishedTime(a) || (b.score || 0) - (a.score || 0));
  } else if (tab === "score") {
    ranked.sort((a, b) => (b.score || 0) - (a.score || 0));
  } else {
    const maxLikeCount = Math.max(1, ...ranked.map((video) => likeCounts[video.ytid] ?? 0));
    ranked.sort(
      (a, b) =>
        blendedPopularityScore(b, likeCounts, maxLikeCount, referenceTime) -
          blendedPopularityScore(a, likeCounts, maxLikeCount, referenceTime) ||
        (b.score || 0) - (a.score || 0)
    );
  }
  return ranked.slice(0, limit);
}

function buildHeroCarouselSlides(referenceTime: number, likeCounts: LikeCounts = {}): HeroCarouselSlide[] {
  const modes: { mode: PopularTab; modeLabel: string }[] = [
    { mode: "popular", modeLabel: "総合人気" },
    { mode: "new", modeLabel: "新着" },
    { mode: "score", modeLabel: "スコア順" }
  ];

  return modes.flatMap(({ mode, modeLabel }) =>
    rankedVideosByTab(mode, 4, referenceTime, likeCounts).map((video, index) => ({
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

function publishedAgeLabel(video: Video, referenceTime: number) {
  if (!video.publishedAt) return null;
  const date = new Date(video.publishedAt);
  if (Number.isNaN(date.getTime())) return null;
  const months = Math.max(0, Math.floor(monthsSincePublished(video, referenceTime)));
  if (months < 12) return Math.max(1, months) + "ヶ月前公開";
  return Math.max(1, Math.floor(months / 12)) + "年前公開";
}

function freshnessBadge(video: Video, referenceTime: number) {
  if (!video.publishedAt) return null;
  const date = new Date(video.publishedAt);
  if (Number.isNaN(date.getTime())) return null;
  const ageDays = Math.max(0, (referenceTime - date.getTime()) / (1000 * 60 * 60 * 24));
  if (ageDays <= 180) return { label: "新着", tone: "new" };
  if (ageDays >= 365 * 3 && (video.score ?? 0) >= 28) return { label: "定番", tone: "evergreen" };
  return null;
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
    shikaku: "CERTIFICATION",
    kaikei: "ACCOUNTING",
    money: "MONEY"
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
  shikaku: "/brand/icon-shikaku.png",
  kaikei: "/brand/icon-kaikei.png",
  money: "/brand/icon-money.png"
};

const roadmapGuideLinks: Record<string, { href: string }> = {
  ai: { href: "/guide/generative-ai/" },
  prog: { href: "/guide/python/" },
  video: { href: "/guide/video-editing/" },
  english: { href: "/guide/english/" },
  data: { href: "/guide/excel-data/" },
  marke: { href: "/guide/web-marketing/" },
  biz: { href: "/guide/office-skills/" },
  shikaku: { href: "/guide/certification/" },
  kaikei: { href: "/guide/bookkeeping/" },
  money: { href: "/guide/money-basics/" }
};

export default function ManapickApp({ referenceTime }: { referenceTime: number }) {
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
  const [pageSize, setPageSize] = useState(DESKTOP_PAGE_SIZE);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileGenreDropdownOpen, setMobileGenreDropdownOpen] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [watchlistOnly, setWatchlistOnly] = useState(false);
  const [todayKey, setTodayKey] = useState("");
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [popularLikeCounts, setPopularLikeCounts] = useState<LikeCounts>({});
  const searchInputRef = useRef<HTMLInputElement>(null);
  const mobileGenreDropdownRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuDrawerRef = useRef<HTMLElement>(null!);
  const filtersMountedRef = useRef(false);
  const skipNextFilterResetRef = useRef(false);
  const menuSwipeRef = useRef<{ x: number; y: number; edge: boolean; ignored: boolean } | null>(null);
  const watchlist = useLocalList(WATCHLIST_KEY);
  const watched = useLocalList(WATCHED_KEY);
  const recent = useLocalList(RECENT_KEY);
  const recentSearches = useLocalList("manapick:searches:v1");
  const streak = useStreakState();

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

  const baseFilteredVideos = useMemo(() => {
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

  const filteredVideos = useMemo(() => {
    if (!watchlistOnly || !watchlist.ready) return baseFilteredVideos;
    return baseFilteredVideos.filter((video) => watchlist.has(video.ytid));
  }, [baseFilteredVideos, watchlist, watchlistOnly]);

  const roadmapTabs = useMemo(() => {
    return roadmaps.filter((roadmap) => publishedGenreKeys.includes(roadmap.genre));
  }, []);

  const activeRoadmap = useMemo(() => {
    return roadmapTabs.find((roadmap) => roadmap.genre === activeRoadmapGenre) ?? roadmapTabs[0] ?? null;
  }, [activeRoadmapGenre, roadmapTabs]);

  const subRoadmap = useMemo(() => {
    if (selectedGenre === "all" || selectedSub === "all") return null;
    if (activeRoadmapGenre !== selectedGenre) return null;
    return buildSubRoadmap(videos, selectedGenre, selectedSub);
  }, [activeRoadmapGenre, selectedGenre, selectedSub]);

  const displayRoadmap = subRoadmap ?? activeRoadmap;

  const publishedGenres = useMemo(() => {
    return genres.filter((genre) => genre.status === "published" && (siteStats.genreCounts[genre.key] ?? 0) > 0);
  }, []);

  const publishedVideos = useMemo(() => {
    return videos.filter((video) => publishedGenreKeys.includes(video.genre));
  }, []);

  const genreVideoCounts = siteStats.genreCounts;

  const upcomingGenres = useMemo(() => {
    return genres.filter((genre) => genre.status !== "published");
  }, []);

  const checkingGenres = useMemo(() => {
    return genres.filter((genre) => genre.status === "checking");
  }, []);

  const visiblePrGenres = useMemo(() => {
    if (selectedGenre === "all") {
      return publishedGenres;
    }
    return selectedGenreData ? [selectedGenreData] : [];
  }, [publishedGenres, selectedGenre, selectedGenreData]);

  const confirmedCount = siteStats.confirmedVideoCount;

  const selectedPublishedVideos = useMemo(() => {
    if (selectedGenre === "all") return [];
    return videos.filter((video) => video.genre === selectedGenre);
  }, [selectedGenre]);

  const selectedGenreTopVideo = useMemo(() => {
    if (selectedGenre === "all") return null;
    if (selectedSub === "all") return topScoredVideo(selectedPublishedVideos);
    const subPool = selectedPublishedVideos.filter((video) => video.sub === selectedSub);
    return topScoredVideo(subPool) ?? topScoredVideo(selectedPublishedVideos);
  }, [selectedGenre, selectedSub, selectedPublishedVideos]);
  const selectedGenreTopics = useMemo(() => topicCounts(selectedPublishedVideos), [selectedPublishedVideos]);

  const totalPages = Math.max(1, Math.ceil(filteredVideos.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const pageStartIndex = filteredVideos.length === 0 ? 0 : (safeCurrentPage - 1) * pageSize;
  const pageVideos = filteredVideos.slice(pageStartIndex, pageStartIndex + pageSize);
  const groupedPageVideos = useMemo(() => groupVideosByGenre(pageVideos), [pageVideos]);

  const popularLikeCandidateVideos = useMemo(() => rankedVideosByTab("popular", 60, referenceTime), [referenceTime]);
  const heroCarouselSlides = useMemo(
    () => buildHeroCarouselSlides(referenceTime, popularLikeCounts),
    [popularLikeCounts, referenceTime]
  );
  const popularFallbackVideos = useMemo(
    () => rankedVideosByTab("popular", 12, referenceTime, popularLikeCounts),
    [popularLikeCounts, referenceTime]
  );
  const recentUpdateVideos = useMemo(() => rankedVideosByTab("new", 6, referenceTime), [referenceTime]);
  const recentVideos = useMemo(() => {
    const byId = new Map(videos.map((video) => [video.ytid, video]));
    return recent.items
      .map((ytid) => byId.get(ytid))
      .filter((video): video is Video => video !== undefined && publishedGenreKeys.includes(video.genre))
      .slice(0, 8);
  }, [recent.items]);

  const todayVideo = useMemo(() => {
    return todayKey ? selectTodayVideo(publishedVideos, todayKey) : null;
  }, [publishedVideos, todayKey]);

  const searchSuggestions = useMemo(() => (searchActive ? filteredVideos.slice(0, 5) : []), [filteredVideos, searchActive]);
  const liveSearchTotal = searchActive ? filteredVideos.length : videos.length;

  const weeklyPick = useMemo(() => {
    return publishedVideos.reduce<Video | null>((best, video) => {
      if (video.score === null) return best;
      if (best === null || best.score === null || video.score > best.score) return video;
      return best;
    }, null);
  }, [publishedVideos]);

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_LIKES_API_ENABLED === "0") return;
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") return;
    const ids = popularLikeCandidateVideos.map((video) => video.ytid);
    if (ids.length === 0) return;

    let cancelled = false;
    fetch(`/api/like?ids=${ids.join(",")}`)
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { counts?: LikeCounts } | null) => {
        if (!cancelled && data?.counts) setPopularLikeCounts(data.counts);
      })
      .catch(() => {
        // KV未設定や一時的な通信失敗では、従来の総合人気順をそのまま使います。
      });

    return () => {
      cancelled = true;
    };
  }, [popularLikeCandidateVideos]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      const page = Number(params.get("page") || "1");
      if (Number.isFinite(page) && page > 1) setCurrentPage(Math.floor(page));
      const genre = params.get("genre");
      if (genre && publishedGenreKeys.includes(genre)) {
        skipNextFilterResetRef.current = true;
        setSelectedGenre(genre);
        if (roadmaps.some((roadmap) => roadmap.genre === genre)) {
          setActiveRoadmapGenre(genre);
        }
        const sub = params.get("sub");
        if (sub) setSelectedSub(availableSubForGenre(genre, sub));
      }
    }, 0);
    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => setTodayKey(jstDateKey()), 0);
    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const hash = decodeURIComponent(window.location.hash.slice(1));
    if (!hash) return;
    const timeout = window.setTimeout(() => {
      document.getElementById(hash)?.scrollIntoView({ block: "start", behavior: "auto" });
    }, 700);
    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const syncPageSize = () => setPageSize(media.matches ? MOBILE_PAGE_SIZE : DESKTOP_PAGE_SIZE);
    syncPageSize();
    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", syncPageSize);
      return () => media.removeEventListener("change", syncPageSize);
    }
    media.addListener(syncPageSize);
    return () => media.removeListener(syncPageSize);
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
    if (!mobileGenreDropdownOpen) return;

    function handlePointerDown(event: PointerEvent) {
      if (!mobileGenreDropdownRef.current?.contains(event.target as Node)) {
        setMobileGenreDropdownOpen(false);
      }
    }

    function handleKeydown(event: KeyboardEvent) {
      if (event.key === "Escape") setMobileGenreDropdownOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeydown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [mobileGenreDropdownOpen]);

  useEffect(() => {
    function syncBackToTopVisibility() {
      setShowBackToTop(window.innerWidth <= 767 && window.scrollY >= 600);
    }

    syncBackToTopVisibility();
    window.addEventListener("scroll", syncBackToTopVisibility, { passive: true });
    window.addEventListener("resize", syncBackToTopVisibility);
    return () => {
      window.removeEventListener("scroll", syncBackToTopVisibility);
      window.removeEventListener("resize", syncBackToTopVisibility);
    };
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => setActiveSuggestionIndex(0), 0);
    return () => window.clearTimeout(timeout);
  }, [keyword, selectedLevel, selectedSub, selectedTime]);

  useEffect(() => {
    if (!watchlist.ready || watchlist.items.length > 0 || !watchlistOnly) return;
    const timeout = window.setTimeout(() => setWatchlistOnly(false), 0);
    return () => window.clearTimeout(timeout);
  }, [watchlist.items.length, watchlist.ready, watchlistOnly]);

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
    if (selectedGenre === "all") {
      url.searchParams.delete("genre");
    } else {
      url.searchParams.set("genre", selectedGenre);
    }
    if (selectedSub === "all") {
      url.searchParams.delete("sub");
    } else {
      url.searchParams.set("sub", selectedSub);
    }
    window.history.replaceState(null, "", url);
  }, [keyword, selectedGenre, selectedLevel, selectedSub, selectedTime, watchlistOnly]);

  useEffect(() => {
    if (currentPage <= totalPages) return;
    const timeout = window.setTimeout(() => setCurrentPage(totalPages), 0);
    return () => window.clearTimeout(timeout);
  }, [currentPage, totalPages]);

  useEffect(() => {
    if (!menuOpen) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    const menuButton = menuButtonRef.current;

    function handleKeydown(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeydown);
    window.setTimeout(() => {
      const firstFocusable = menuDrawerRef.current?.querySelector<HTMLElement>("button, a, summary");
      firstFocusable?.focus();
    }, 0);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeydown);
      if (menuButton) {
        menuButton.focus();
      } else if (previousFocus && document.contains(previousFocus)) {
        previousFocus.focus();
      }
    };
  }, [menuOpen]);

  useEffect(() => {
    const ignoredSwipeSelectors = ".hero-carousel, .roadmap-timeline, .roadmap-tabs, .category-tab-nav, .mobile-genre-dropdown, .profession-track";

    function touchTargetIsIgnored(target: EventTarget | null) {
      return target instanceof Element && target.closest(ignoredSwipeSelectors) !== null;
    }

    function handleTouchStart(event: TouchEvent) {
      if (window.innerWidth > 767) {
        menuSwipeRef.current = null;
        return;
      }
      const touch = event.touches[0];
      if (!touch) return;
      menuSwipeRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        edge: touch.clientX >= window.innerWidth - 48,
        ignored: !menuOpen && touchTargetIsIgnored(event.target)
      };
    }

    function handleTouchMove(event: TouchEvent) {
      const start = menuSwipeRef.current;
      if (!start || start.ignored || menuOpen || !start.edge) return;
      const touch = event.touches[0];
      if (!touch) return;
      const deltaX = touch.clientX - start.x;
      const deltaY = touch.clientY - start.y;
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);
      if (deltaX <= -40 && absX >= 40 && absX > absY * 1.2) {
        setMenuOpen(true);
        menuSwipeRef.current = null;
      }
    }

    function handleTouchEnd(event: TouchEvent) {
      const start = menuSwipeRef.current;
      menuSwipeRef.current = null;
      if (!start || start.ignored) return;
      const touch = event.changedTouches[0];
      if (!touch) return;
      const deltaX = touch.clientX - start.x;
      const deltaY = touch.clientY - start.y;
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);
      if (absX < 50 || absX <= absY) return;
      if (menuOpen) {
        if (deltaX >= 50) setMenuOpen(false);
        return;
      }
      if (start.edge && deltaX <= -50 && absX > absY * 1.2) setMenuOpen(true);
    }

    function handleTouchCancel() {
      menuSwipeRef.current = null;
    }

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    window.addEventListener("touchcancel", handleTouchCancel, { passive: true });
    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("touchcancel", handleTouchCancel);
    };
  }, [menuOpen]);

  function saveRecentSearch(value = searchDraft || keyword) {
    const term = value.trim();
    if (term) recentSearches.push(term, 5);
  }

  function openVideoPage(video: Video) {
    saveRecentSearch();
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
        window.requestAnimationFrame(() => {
          const target = document.getElementById(elementId);
          if (!target) return;
          const stickyOffset = (document.querySelector(".category-tab-nav")?.getBoundingClientRect().height ?? 0) + 16;
          const top = target.getBoundingClientRect().top + window.scrollY - stickyOffset;
          const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
          window.scrollTo({ top: Math.max(0, top), behavior: reducedMotion ? "auto" : "smooth" });
        });
      });
    });
  }

  function scrollToProfessionCard(routeId: string) {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        const card = document.getElementById("profession-" + routeId);
        const track = card?.closest<HTMLElement>(".profession-track");
        if (!card) return;
        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const horizontallyScrollable = !!track && track.scrollWidth > track.clientWidth + 4;
        if (horizontallyScrollable && track) {
          scrollToElement("profession-routes");
          const cardRect = card.getBoundingClientRect();
          const trackRect = track.getBoundingClientRect();
          const delta = (cardRect.left - trackRect.left) - (track.clientWidth - card.clientWidth) / 2;
          track.scrollTo({ left: track.scrollLeft + delta, behavior: reducedMotion ? "auto" : "smooth" });
        } else {
          scrollToElement("profession-" + routeId);
        }
        document.querySelectorAll(".profession-card.is-active").forEach((el) => el.classList.remove("is-active"));
        card.classList.add("is-active");
        window.setTimeout(() => card.classList.remove("is-active"), 1600);
      });
    });
  }

  function handleGenreChange(nextGenre: string, scrollTarget: "results" | "topics" | "none" = "results") {
    setWatchlistOnly(false);
    setSelectedGenre(nextGenre);
    setSelectedSub("all");
    setSelectedLevel("すべて");
    setSelectedTime("all");
    setSearchDraft("");
    setKeyword("");
    setSuggestionsOpen(false);
    setActiveSuggestionIndex(0);
    if (nextGenre !== "all" && roadmapTabs.some((roadmap) => roadmap.genre === nextGenre)) {
      setActiveRoadmapGenre(nextGenre);
    }
    resetPageParam();
    if (scrollTarget === "none") return;
    if (scrollTarget === "topics" && nextGenre !== "all") {
      scrollToElement("topic-filter-anchor");
      return;
    }
    scrollToResults();
  }

  function handleProfessionDestination(destination: ProfessionDestination) {
    const nextGenre = destination.genre;
    const nextSub = availableSubForGenre(nextGenre, destination.sub, destination.fallbackSub);
    setWatchlistOnly(false);
    setSelectedGenre(nextGenre);
    setSelectedSub(nextSub);
    setSelectedLevel("すべて");
    setSelectedTime("all");
    setSearchDraft("");
    setKeyword("");
    setSuggestionsOpen(false);
    setActiveSuggestionIndex(0);
    if (roadmapTabs.some((roadmap) => roadmap.genre === nextGenre)) {
      setActiveRoadmapGenre(nextGenre);
    }
    resetPageParam();
    scrollToElement(nextGenre === "all" ? "results-anchor" : "topic-filter-anchor");
  }

  function handleProfessionRoute(route: ProfessionRoute) {
    const primary = route.destinations.find((destination) => destination.href === route.href) ?? route.destinations[0];
    const nextGenre = primary?.genre ?? "all";
    if (nextGenre !== "all") {
      const nextSub = availableSubForGenre(nextGenre, primary?.sub, primary?.fallbackSub);
      setWatchlistOnly(false);
      setSelectedGenre(nextGenre);
      setSelectedSub(nextSub);
      setSelectedLevel("すべて");
      setSelectedTime("all");
      setSearchDraft("");
      setKeyword("");
      setSuggestionsOpen(false);
      setActiveSuggestionIndex(0);
      if (roadmapTabs.some((roadmap) => roadmap.genre === nextGenre)) {
        setActiveRoadmapGenre(nextGenre);
      }
      resetPageParam();
    }
    scrollToElement("roadmap");
  }

  function handleRoadmapGenreSelect(genre: string) {
    sendGaEvent("roadmap_genre_select", { genre });
    setActiveRoadmapGenre(genre);
    handleGenreChange(genre, "none");
  }

  function handleMobileGenreSelect(nextGenre: string) {
    setMobileGenreDropdownOpen(false);
    handleGenreChange(nextGenre, nextGenre === "all" ? "results" : "topics");
  }

  function scrollToTop() {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
  }

  function resetFilters() {
    setWatchlistOnly(false);
    setSelectedGenre("all");
    setSelectedSub("all");
    setSelectedLevel("すべて");
    setSelectedTime("all");
    setSearchDraft("");
    setKeyword("");
    setSuggestionsOpen(false);
  }

  function applySearchKeyword(term: string) {
    setWatchlistOnly(false);
    setSelectedGenre("all");
    setSelectedSub("all");
    setSelectedLevel("すべて");
    setSelectedTime("all");
    setSearchDraft(term);
    setKeyword(term);
    setSuggestionsOpen(true);
    resetPageParam();
    scrollToResults();
  }

  function jumpToGenre(genreKey: string) {
    handleGenreChange(genreKey, "topics");
  }

  function showGenrePicker() {
    setWatchlistOnly(false);
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
    if (target === "profession") {
      scrollToElement("profession-routes");
      return;
    }
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
    const focusable = Array.from(menuDrawerRef.current?.querySelectorAll<HTMLElement>("button, a, summary") ?? [])
      .filter((item) => !item.hasAttribute("disabled") && item.getClientRects().length > 0);
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

  const selectedGenreLabel = selectedGenreData ? genreName(selectedGenreData.key) : "すべての公開中ジャンル";
  const selectedGenreCount = selectedGenreData ? genreVideoCounts[selectedGenreData.key] ?? 0 : publishedVideos.length;

  return (
    <main>
      <header className="site-header border-b border-line bg-surface/92 backdrop-blur">
        <div className="site-header-inner mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 min-[720px]:flex-row min-[720px]:items-center min-[720px]:justify-between min-[720px]:px-6">
          <a href="#top" className="min-w-0 shrink-0" aria-label="Manapick トップ">
            <BrandLogo compact />
          </a>
          <div className="top-search-wrap">
            <label className="top-search" aria-label="動画を検索">
              <span className="sr-only">動画を検索</span>
              <input
                ref={searchInputRef}
                value={searchDraft}
                onChange={(event) => {
                  setWatchlistOnly(false);
                  setSearchDraft(event.target.value);
                  setSuggestionsOpen(true);
                }}
                onFocus={() => setSuggestionsOpen(true)}
                onKeyDown={handleSearchKeyDown}
                placeholder="動画を検索"
                className="top-search-input"
                autoComplete="off"
                role="combobox"
                aria-autocomplete="list"
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
              recentSearches={recentSearches}
              onSelect={openVideoPage}
              onRecentSearchSelect={(term) => {
                setSearchDraft(term);
                setKeyword(term);
                setSuggestionsOpen(true);
              }}
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
              <a className="transition hover:text-accent" href="/ranking/">
                ランキング
              </a>
              <a className="site-nav-optional transition hover:text-accent" href="/new/">
                新着
              </a>
              <Link className="site-nav-optional transition hover:text-accent" href="/news/">
                ニュース
              </Link>
              <a className="site-nav-optional transition hover:text-accent" href="/glossary/">
                用語集
              </a>
              <a className="transition hover:text-accent" href="/my/">
                マイページ
              </a>
              {SHOW_TOP_PR_SECTION ? (
                <a className="transition hover:text-accent" href="#pr">
                  PR
                </a>
              ) : null}
              <a className="site-nav-optional transition hover:text-accent" href="/contact/">
                お問い合わせ
              </a>
              <a
                className="header-ai-link"
                href={MANAPICK_AI_URL}
                target="_blank"
                rel="noopener"
                onClick={() => sendGaEvent("ai_crosslink_click", { placement: "header", target: "manapick_ai" })}
              >
                <span>manapick AI ↗</span>
                <small>公式AI版</small>
              </a>
              <a
                className="header-license-link"
                href={MANAPICK_LICENSE_URL}
                target="_blank"
                rel="noopener"
                onClick={() => sendGaEvent("license_crosslink_click", { placement: "header", target: "manapick_license" })}
                aria-label="manapick licenseへ。資格・検定を比較"
              >
                <span>license ↗</span>
                <small>資格・検定</small>
              </a>
              <a
                className="header-career-link"
                href={MANAPICK_CAREER_URL}
                target="_blank"
                rel="noopener"
                onClick={() => sendGaEvent("career_crosslink_click", { placement: "header", target: "manapick_career" })}
                aria-label="manapick careerへ。仕事内容と学ぶ順番を確認"
              >
                <span>career ↗</span>
                <small>仕事を知る</small>
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
          routes={professionRoutes}
          drawerRef={menuDrawerRef}
          onKeyDown={handleMenuKeyDown}
          onClose={() => setMenuOpen(false)}
          onProfessionSelect={(routeId) => {
            setMenuOpen(false);
            if (!routeId) {
              scrollToElement("profession-routes");
              return;
            }
            scrollToProfessionCard(routeId);
          }}
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

      <RetentionBand
        todayVideo={todayVideo}
        continueVideo={recentVideos[0] ?? null}
        streak={streak.state}
        ready={streak.ready}
        watchedCount={watched.ready ? watched.items.length : 0}
        watchlistCount={watchlist.ready ? watchlist.items.length : 0}
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
              社会人の学び直し動画キュレーション
            </p>
            <h1 className="hero-title">
              <span className="hero-title-line">
                <span className="hero-title-highlight">見るべき一本</span>だけを、
              </span>
              <span className="hero-title-line">迷わせない。</span>
            </h1>
            <p className="hero-lead">
              AI・IT・英語・動画編集など、キャリアに効く学習動画を“Manapickスコア（35点満点）”で厳選。初級→上級のロードマップで、何から見るかもう迷わない。会員登録は不要。通勤の15分など、スキマ時間から始められます。
            </p>
            <p className="hero-lead-mobile">
              YouTube学習動画を35点満点で採点。見る順に整理し、登録不要・スキマ時間から。
            </p>

            <HeroTrustStats totalVideos={siteStats.totalVideos} confirmedCount={confirmedCount} />
            <p className="hero-benefit-line">
              “次に見る1本”を最短で決める ／ 7軸35点で厳選 ／ 無料・登録不要
            </p>
            <a className="mobile-hero-primary-cta" href="#mobile-weekly-pick">
              ▶ 迷ったら、まずこの1本
            </a>
            <PurposeNav onSelect={handlePurposeSelect} />

            <p className="hero-proof">
              公開中{siteStats.publishedGenreCount}ジャンル
              {confirmedCount > 0 ? " ／ 視聴確認済" + confirmedCount + "本" : ""}
              {" ／ 順次拡大"}
            </p>
          </div>
          {weeklyPick ? (
            <section id="mobile-weekly-pick" className="mobile-weekly-pick-section" aria-labelledby="mobile-weekly-pick-title">
              <div className="weekly-pick-heading">
                <p className="section-eyebrow">今週のイチオシ</p>
                <h2 id="mobile-weekly-pick-title" className="section-title">最高スコアの一本から始める</h2>
              </div>
              <WeeklyPickCard video={weeklyPick} likeCounts={popularLikeCounts} />
            </section>
          ) : null}
          <div className="hero-visual-column">
            <HeroVideoCarousel slides={heroCarouselSlides} />
          </div>
        </div>
      </section>

      <WhyManapickSection />

      <LearningLoopSection />

      <RecentUpdatesSection videos={recentUpdateVideos} />

      <AdSlot slot="1438236565" />

      <SearchIntentShortcutSection />

      <StudyPlanPromoSection />

      <ProfessionRouteSection
        routes={professionRoutes}
        onRouteSelect={handleProfessionRoute}
        onDestinationSelect={handleProfessionDestination}
      />

      {recent.ready && recentVideos.length > 0 ? <RecentStrip videos={recentVideos} /> : null}

      {weeklyPick ? (
        <section className="weekly-pick-section desktop-weekly-pick-section" aria-labelledby="weekly-pick-title">
          <div className="weekly-pick-shell">
            <div className="weekly-pick-column">
              <div className="weekly-pick-heading">
                <p className="section-eyebrow">今週のイチオシ</p>
                <h2 id="weekly-pick-title" className="section-title">最高スコアの一本から始める</h2>
              </div>
              <WeeklyPickCard video={weeklyPick} likeCounts={popularLikeCounts} />
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
            <div className="genre-state-legend flex flex-wrap gap-2 text-xs font-bold text-muted">
              <span className="rounded-full bg-leaf px-3 py-1 text-white">公開中</span>
              <span className="rounded-full bg-mist px-3 py-1">近日公開</span>
              <span className="rounded-full bg-amberSoft px-3 py-1">確認中（注記）</span>
            </div>
          </div>

          <div className="genre-selector-layout">
            <div>
              <p className="genre-group-title">公開中</p>
              <div ref={mobileGenreDropdownRef} className={mobileGenreDropdownOpen ? "mobile-genre-dropdown is-open" : "mobile-genre-dropdown"}>
                <button
                  type="button"
                  className="mobile-genre-trigger"
                  aria-expanded={mobileGenreDropdownOpen}
                  aria-controls="mobile-genre-dropdown-panel"
                  onClick={() => setMobileGenreDropdownOpen((open) => !open)}
                >
                  <span className="mobile-genre-trigger-main">
                    {selectedGenreData ? <GenreIcon genreKey={selectedGenreData.key} className="mobile-genre-trigger-icon" /> : null}
                    <span>{selectedGenreLabel}</span>
                  </span>
                  <span className="mobile-genre-trigger-sub">{selectedGenreCount}本から探す</span>
                  <span className="mobile-genre-chevron" aria-hidden="true">▾</span>
                </button>
                <div id="mobile-genre-dropdown-panel" className="mobile-genre-menu" role="listbox" aria-label="公開中ジャンルを選ぶ">
                  <button
                    type="button"
                    role="option"
                    aria-selected={selectedGenre === "all"}
                    className={selectedGenre === "all" ? "mobile-genre-option is-active" : "mobile-genre-option"}
                    onClick={() => handleMobileGenreSelect("all")}
                  >
                    <span className="mobile-genre-option-main">すべて</span>
                    <span className="mobile-genre-option-count">{publishedVideos.length}本</span>
                  </button>
                  {publishedGenres.map((genre) => (
                    <button
                      type="button"
                      key={genre.key}
                      role="option"
                      aria-selected={selectedGenre === genre.key}
                      className={selectedGenre === genre.key ? "mobile-genre-option is-active" : "mobile-genre-option"}
                      onClick={() => handleMobileGenreSelect(genre.key)}
                    >
                      <span className="mobile-genre-option-main">
                        <GenreIcon genreKey={genre.key} className="mobile-genre-option-icon" />
                        <span>{genreName(genre.key)}</span>
                      </span>
                      <span className="mobile-genre-option-count">{genreVideoCounts[genre.key] ?? 0}本</span>
                    </button>
                  ))}
                  {upcomingGenres.length > 0 ? (
                    <>
                      <div className="mobile-genre-menu-divider" aria-hidden="true" />
                      {upcomingGenres.map((genre) => (
                        <button
                          type="button"
                          key={genre.key}
                          className="mobile-genre-option is-disabled"
                          disabled
                        >
                          <span className="mobile-genre-option-main">
                            <GenreIcon genreKey={genre.key} className="mobile-genre-option-icon" />
                            <span>{genreName(genre.key)}</span>
                          </span>
                          <span className="mobile-genre-coming-soon">近日公開</span>
                        </button>
                      ))}
                    </>
                  ) : null}
                </div>
              </div>
              <div className="published-genre-grid" role="group" aria-label="公開中ジャンル">
                <button
                  type="button"
                  onClick={() => handleGenreChange("all")}
                  className={`genre-card genre-card-all ${selectedGenre === "all" ? "is-active" : ""}`}
                >
                  <span className="block text-sm font-black">すべての公開中ジャンル</span>
                  <span className="mt-1 block text-xs opacity-80">{siteStats.publishedVideoCount}本から探す</span>
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
              <p className="mobile-genre-status-note">
                公開中{siteStats.publishedGenreCount}ジャンル
                {upcomingGenres.length > 0 ? " / 近日公開" + upcomingGenres.length + "ジャンル" : ""}
                {checkingGenres.length > 0 ? " / 確認中" + checkingGenres.length + "ジャンル" : ""}
                {" / 順次拡大"}
              </p>
            </div>

          </div>

          <div className={mobileFiltersOpen ? "filter-section is-mobile-open mt-7 border-t border-line pt-6" : "filter-section mt-7 border-t border-line pt-6"}>
            <button
              type="button"
              className="mobile-filter-toggle"
              aria-expanded={mobileFiltersOpen}
              aria-controls="filter-accordion-body"
              onClick={() => setMobileFiltersOpen((open) => !open)}
            >
              <span>🔍 条件で絞り込む</span>
              <span aria-hidden="true">{mobileFiltersOpen ? "閉じる" : "開く"}</span>
            </button>
            <div className="filter-heading mb-4">
              <p className="text-sm font-bold text-leaf">②詳細に探す</p>
              <h2 className="text-2xl font-black text-ink">条件で絞り込む</h2>
            </div>
            <div id="filter-accordion-body" className="filter-accordion-body">
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
                      setWatchlistOnly(false);
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

              <PopularKeywordChips onSelect={applySearchKeyword} />

              <div className="mt-5 flex flex-col gap-2 text-sm text-muted min-[680px]:flex-row min-[680px]:items-center min-[680px]:justify-between">
                <p>
                  <span className="font-black text-ink">{filteredVideos.length}</span>件ヒット
                  {selectedGenreData?.status === "preparing" ? "。このジャンルは近日公開です。" : ""}
                  {selectedGenreData?.status === "checking" ? "。このジャンルは確認中です。" : ""}
                </p>
                <p>視聴はYouTube公式リンクのみ。動画のダウンロード機能はありません。</p>
              </div>
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
            likeCounts={popularLikeCounts}
          />
        ) : null}
        <div id="results-anchor" className="results-anchor" aria-hidden="true" />
        <WatchlistFilterControl
          ready={watchlist.ready}
          count={watchlist.items.length}
          active={watchlistOnly}
          onToggle={() => {
            setCurrentPage(1);
            setWatchlistOnly((active) => !active);
          }}
        />
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
            <h2 className="text-2xl font-black">{watchlistOnly ? "あとで見るはまだ空です" : "該当する動画がありません"}</h2>
            <p className="mt-2 leading-7 text-muted">
              {watchlistOnly ? "あとで見るに追加した動画がここに並びます。" : "条件を少し広げて探してください。"}
            </p>
            {!watchlistOnly ? <PopularKeywordChips compact onSelect={applySearchKeyword} /> : null}
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
                      {group.items.map((video) => (
                        <VideoCard
                          key={video.ytid}
                          video={video}
                          highlighted={highlightedVideoId === video.ytid}
                          watchlist={watchlist}
                          watched={watched}
                          likeCounts={popularLikeCounts}
                          referenceTime={referenceTime}
                        />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            ) : (
              <div className="grid gap-4 min-[560px]:grid-cols-2 min-[880px]:grid-cols-3">
                {pageVideos.map((video) => (
                  <VideoCard
                    key={video.ytid}
                    video={video}
                    highlighted={highlightedVideoId === video.ytid}
                    watchlist={watchlist}
                    watched={watched}
                    likeCounts={popularLikeCounts}
                    referenceTime={referenceTime}
                  />
                ))}
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
          {roadmapTabs.length === 0 || displayRoadmap === null || activeRoadmap === null ? (
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
                    onClick={() => handleRoadmapGenreSelect(roadmap.genre)}
                    className={activeRoadmap.genre === roadmap.genre ? "roadmap-tab is-active" : "roadmap-tab"}
                  >
                    {genreLabel(roadmap.genre)}
                  </button>
                ))}
              </div>
              {roadmapGuideLinks[activeRoadmapGenre] ? (
                <a className="roadmap-guide-link" href={roadmapGuideLinks[activeRoadmapGenre].href}>
                  📖 文章で読む完全ロードマップ
                </a>
              ) : null}
              <RoadmapTimeline roadmap={displayRoadmap} watched={watched} subMode={subRoadmap !== null} />
            </>
          )}
        </div>
      </section>

      {SHOW_TOP_PR_SECTION ? (
        <section id="pr" className="mx-auto max-w-7xl px-4 py-8 min-[760px]:px-6">
          <div className="mb-5">
            <p className="text-sm font-bold text-coral">PR / 広告</p>
            <h2 className="text-2xl font-black text-ink">おすすめ教材・スクール（PR）</h2>
          </div>
          <div className="grid gap-4 min-[640px]:grid-cols-2 min-[980px]:grid-cols-4">
            {visiblePrGenres.map((genre) => (
              <PrBlock key={genre.key} genre={genre} />
            ))}
          </div>
        </section>
      ) : null}

      <MobileBottomNav
        watchlistOnly={watchlistOnly}
        onExplore={showGenrePicker}
        onRoadmap={() => scrollToElement("roadmap")}
        onWatchlist={() => {
          setWatchlistOnly(true);
          resetPageParam();
          scrollToResults();
        }}
        onMenu={() => setMenuOpen(true)}
      />

      {showBackToTop ? (
        <button
          type="button"
          className="mobile-back-to-top is-visible"
          aria-label="ページの先頭へ戻る"
          onClick={scrollToTop}
        >
          ↑
        </button>
      ) : null}

      {/* footer is rendered globally via app/layout.tsx (SiteFooter) */}
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
  recentSearches,
  onSelect,
  onRecentSearchSelect,
  onClose
}: {
  id: string;
  query: string;
  total: number;
  suggestions: Video[];
  activeIndex: number;
  open: boolean;
  popularVideos: Video[];
  recentSearches: LocalListState;
  onSelect: (video: Video) => void;
  onRecentSearchSelect: (term: string) => void;
  onClose: () => void;
}) {
  const hasQuery = query.trim().length > 0;
  const fallbackVideos = popularVideos.slice(0, 3);
  const panelClassName = [
    "live-search-panel",
    open ? "is-open" : "",
    hasQuery ? "has-query" : "is-empty-query",
    !hasQuery && recentSearches.ready && recentSearches.items.length > 0 ? "has-recent-searches" : ""
  ].filter(Boolean).join(" ");

  return (
    <div id={id} className={panelClassName} role="status" aria-live="polite">
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
                <span className="live-suggestion-meta">
                  <LevelBadge level={video.level} />
                  <span>{genreLabel(video.genre)}</span>
                  <span>{scoreText(video)}</span>
                  <span className={`score-badge-status is-${scoreStatus(video)}`}>{scoreStatusText(video)}</span>
                  <span>{video.minutes}分</span>
                </span>
              </button>
            </li>
          ))}
        </ol>
      ) : null}
      {!hasQuery && recentSearches.ready && recentSearches.items.length > 0 ? (
        <div className="recent-searches" aria-label="最近の検索">
          <p>最近の検索</p>
          <div>
            {recentSearches.items.slice(0, 5).map((term) => (
              <button key={term} type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => onRecentSearchSelect(term)}>
                {term}
              </button>
            ))}
          </div>
          <button type="button" className="recent-searches-clear" onMouseDown={(event) => event.preventDefault()} onClick={() => recentSearches.clear()}>
            履歴を消す
          </button>
        </div>
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

function PopularKeywordChips({ compact = false, onSelect }: { compact?: boolean; onSelect: (term: string) => void }) {
  return (
    <div className={compact ? "popular-keyword-chips is-compact" : "popular-keyword-chips"} aria-label="よく検索されるキーワード">
      <span>{compact ? "近いテーマ" : "人気キーワード"}</span>
      <div>
        {popularSearchKeywords.map((term) => (
          <button key={term} type="button" onClick={() => onSelect(term)}>
            {term}
          </button>
        ))}
      </div>
    </div>
  );
}

function WhyManapickSection() {
  return (
    <section className="why-section" aria-labelledby="why-title">
      <p className="section-eyebrow">なぜManapick？</p>
      <h2 id="why-title" className="section-title">YouTubeで直接探すのと、何が違う？</h2>
      <div className="why-grid">
        <div className="why-card">
          <span className="why-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" focusable="false">
              <path d="m5 12 4 4L19 6" />
              <circle cx="12" cy="12" r="10" />
            </svg>
          </span>
          <p className="why-pain">おすすめ欄は「視聴時間」を最適化する</p>
          <p className="why-answer">Manapickは「学べるか」だけを7軸35点で採点。広告収益と無関係に選びます。</p>
        </div>
        <div className="why-card">
          <span className="why-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" focusable="false">
              <path d="M12 3 5 6v6c0 4 3 7 7 9 4-2 7-5 7-9V6z" />
              <path d="m9 12 2 2 4-5" />
            </svg>
          </span>
          <p className="why-pain">釣りサムネや「誰でも稼げる」系が混ざる</p>
          <p className="why-answer">煽り・効果保証系の動画は、採点する前に不採用。公式動画だけを掲載します。</p>
        </div>
        <div className="why-card">
          <span className="why-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" focusable="false">
              <path d="M5 18c4-9 9 0 14-9" />
              <path d="M16 7h4v4" />
            </svg>
          </span>
          <p className="why-pain">「次に何を見るか」で迷子になる</p>
          <p className="why-answer">初級→中級→上級のロードマップで順番まで設計。視聴済みチェックで進捗も見えます。</p>
        </div>
      </div>
      <p className="why-tagline">Manapickは、動画を見るサイトではなく「次に見る一本」を最短で決めるためのサイトです。</p>
    </section>
  );
}

function LearningLoopSection() {
  const steps = [
    {
      number: "01",
      site: "video",
      eyebrow: "一本を選ぶ",
      title: "Manapick",
      description: `${siteStats.totalVideos}本の視聴確認済み動画から、目的と時間に合う一本を決める`,
      href: "/start/",
      external: false
    },
    {
      number: "02",
      site: "ai",
      eyebrow: "道具を選ぶ",
      title: "manapick AI",
      description: "動画で知ったAIの料金・無料枠・使い方を比較する",
      href: MANAPICK_AI_URL,
      external: true
    },
    {
      number: "03",
      site: "license",
      eyebrow: "学びを証明する",
      title: "manapick license",
      description: "関連資格の要件・費用・申込方法を公式情報で確認する",
      href: MANAPICK_LICENSE_URL,
      external: true
    },
    {
      number: "04",
      site: "career",
      eyebrow: "仕事につなぐ",
      title: "manapick career",
      description: "学んだ内容を生かせる仕事と、次に必要なスキルを知る",
      href: MANAPICK_CAREER_URL,
      external: true
    }
  ] as const;

  return (
    <section className="learning-loop-section" aria-labelledby="learning-loop-title">
      <div className="learning-loop-heading">
        <p className="section-eyebrow">MANAPICK NETWORK</p>
        <h2 id="learning-loop-title" className="section-title">動画を起点に、学びを次の行動へ</h2>
        <p>一本を選んで終わりにせず、道具・資格・仕事まで、必要な情報だけを順番に確認できます。</p>
      </div>
      <div className="learning-loop-grid">
        {steps.map((step) => (
          <a
            key={step.site}
            className={`learning-loop-card is-${step.site}`}
            href={step.href}
            target={step.external ? "_blank" : undefined}
            rel={step.external ? "noopener noreferrer" : undefined}
            onClick={() => sendGaEvent("learning_loop_click", { placement: "home", target: step.site })}
          >
            <span className="learning-loop-number">{step.number}</span>
            <span className="learning-loop-eyebrow">{step.eyebrow}</span>
            <strong>{step.title}{step.external ? <span aria-hidden="true"> ↗</span> : null}</strong>
            <small>{step.description}</small>
          </a>
        ))}
      </div>
      <a className="learning-loop-overview" href="/network/">
        4サイトの役割と使い分けを見る <span aria-hidden="true">→</span>
      </a>
    </section>
  );
}

function RecentUpdatesSection({ videos }: { videos: Video[] }) {
  if (videos.length === 0) return null;

  return (
    <section className="recent-updates-section" aria-labelledby="recent-updates-title">
      <div className="recent-updates-head">
        <div>
          <p className="section-eyebrow">最近追加・更新</p>
          <h2 id="recent-updates-title" className="section-title">新しく選びやすくなった動画</h2>
        </div>
        <a href="/new/">すべて見る</a>
      </div>
      <div className="recent-updates-grid">
        {videos.map((video) => (
          <a key={video.ytid} className="recent-update-card" href={videoDetailHref(video)}>
            <span className="recent-update-thumb">
              <Image
                src={"https://i.ytimg.com/vi/" + video.ytid + "/hqdefault.jpg"}
                alt={thumbnailAlt(video)}
                width={480}
                height={270}
                sizes="(min-width: 1180px) 180px, (min-width: 760px) 28vw, 38vw"
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </span>
            <span className="recent-update-body">
              <span>{genreLabel(video.genre)} / {scoreText(video)} / {video.minutes}分</span>
              <strong>{video.title}</strong>
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}

function SearchIntentShortcutSection() {
  return (
    <section className="search-intent-section" aria-labelledby="search-intent-title">
      <div className="search-intent-head">
        <div>
          <p className="section-eyebrow">よく検索されるテーマ</p>
          <h2 id="search-intent-title" className="section-title">今ある悩みから、直接探す</h2>
        </div>
        <div className="search-intent-head-actions">
          <p>検索で実際に見つけられているテーマを、対応する動画一覧・ロードマップへつなげました。</p>
          <Link href="/learn/">学習テーマをすべて見る <span aria-hidden="true">→</span></Link>
        </div>
      </div>
      <div className="search-intent-grid" aria-label="検索で多い学習テーマ">
        {searchIntentLinks.map((item) => (
          <a key={item.href + item.label} href={item.href}>
            <span>{item.label}</span>
            <small>{item.note}</small>
          </a>
        ))}
      </div>
    </section>
  );
}

function StudyPlanPromoSection() {
  return (
    <section className="study-plan-promo" aria-labelledby="study-plan-promo-title">
      <div>
        <p className="section-eyebrow">見る順を、予定に変える</p>
        <h2 id="study-plan-promo-title" className="section-title">今週の7日学習プランを作る</h2>
        <p>ジャンル・1日の時間・週の学習日数を選ぶだけ。休む日も含め、視聴確認済み動画を無理のない順番に並べます。</p>
      </div>
      <a href="/study-plan/">
        7日プランを作る <span aria-hidden="true">→</span>
      </a>
    </section>
  );
}

function ProfessionRouteSection({
  routes,
  onRouteSelect,
  onDestinationSelect
}: {
  routes: ProfessionRoute[];
  onRouteSelect: (route: ProfessionRoute) => void;
  onDestinationSelect: (destination: ProfessionDestination) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  function updateActiveCard() {
    const track = trackRef.current;
    if (!track) return;
    const cards = Array.from(track.querySelectorAll<HTMLElement>(".profession-card"));
    if (cards.length === 0) return;
    const trackLeft = track.getBoundingClientRect().left;
    const nearest = cards.reduce(
      (best, card, index) => {
        const distance = Math.abs(card.getBoundingClientRect().left - trackLeft);
        return distance < best.distance ? { index, distance } : best;
      },
      { index: 0, distance: Number.POSITIVE_INFINITY }
    );
    setActiveIndex(nearest.index);
  }

  function scrollToCard(index: number) {
    const card = trackRef.current?.querySelectorAll<HTMLElement>(".profession-card")[index];
    if (!card) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    card.scrollIntoView({ block: "nearest", inline: "start", behavior: reducedMotion ? "auto" : "smooth" });
  }

  return (
    <section id="profession-routes" className="profession-section" aria-labelledby="profession-title">
      <div className="profession-heading">
        <p className="section-eyebrow">なりたい職業から選ぶ</p>
        <h2 id="profession-title" className="section-title">職業ゴールから、見るべき順番を決める</h2>
        <p>
          「何を学ぶか」から迷う人のために、職業ゴールごとにジャンル・資格・ロードマップを束ねました。
        </p>
      </div>
      <aside className="career-bridge" aria-label="公式職業情報サイト manapick career">
        <div className="career-bridge-copy">
          <p>manapick career</p>
          <h3>仕事の中身を知ってから、学ぶ順番を決める</h3>
          <span>仕事内容・必要スキル・注意点を公式情報から確認できます。職業の順位付けや適性の断定はしません。</span>
        </div>
        <div className="career-bridge-actions">
          <a
            href={`${MANAPICK_CAREER_URL}/route/`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => sendGaEvent("career_crosslink_click", { placement: "profession_bridge", target: "career_route" })}
          >
            3問で入口案内 <span aria-hidden="true">↗</span>
          </a>
          <a
            href={`${MANAPICK_CAREER_URL}/all/`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => sendGaEvent("career_crosslink_click", { placement: "profession_bridge", target: "career_all" })}
          >
            公開中の職業を見る <span aria-hidden="true">↗</span>
          </a>
        </div>
      </aside>
      <div ref={trackRef} className="profession-track" role="list" onScroll={updateActiveCard}>
        {routes.map((route, index) => {
          const firstVideo = professionTopVideo(route);
          const routeVideoCount = professionVideos(route).length;
          const stepCount = professionStepCount(route);
          return (
          <article
            key={route.id}
            id={"profession-" + route.id}
            className="profession-card"
            role="listitem"
            onClick={(event) => {
              if (event.target instanceof Element && event.target.closest("a, button")) return;
              onRouteSelect(route);
            }}
          >
            <div className="profession-card-band" aria-hidden="true">
              <span className="profession-number">{String(index + 1).padStart(2, "0")}</span>
              <ProfessionIcon icon={route.icon} />
            </div>
            <a
              className="profession-main-link"
              href={route.href}
              onClick={(event) => {
                event.preventDefault();
                onRouteSelect(route);
              }}
            >
              <span className="profession-title">{route.title}</span>
              <span className="profession-skill">{route.skill}</span>
            </a>
            <div className="profession-meta-line">
              <span>目安：{routeVideoCount}本</span>
              <span>ロードマップ{stepCount || 3}STEP</span>
            </div>
            {firstVideo ? (
              <a className="profession-feature-video" href={videoDetailHref(firstVideo)} aria-label={firstVideo.title + "の詳細ページを開く"}>
                <span className="profession-feature-thumb">
                  <Image
                    src={"https://i.ytimg.com/vi/" + firstVideo.ytid + "/hqdefault.jpg"}
                    alt={thumbnailAlt(firstVideo)}
                    width={480}
                    height={270}
                    sizes="(min-width: 1180px) 360px, (min-width: 768px) 44vw, 78vw"
                    loading="lazy"
                  />
                  <span className="profession-score-badge is-confirmed">
                    {scoreText(firstVideo)}
                  </span>
                </span>
                <span className="profession-feature-body">
                  <span className="profession-feature-label">この職業の最初の1本</span>
                  <span className="profession-feature-title">{firstVideo.title}</span>
                </span>
              </a>
            ) : null}
            <p className="profession-related">{route.relatedText}</p>
            {route.note ? <p className="profession-note">{route.note}</p> : null}
            <div className="profession-destination-row" aria-label={route.title + "の関連ジャンル"}>
              {route.destinations.filter(destinationHasVideos).map((destination) => (
                <a
                  key={route.id + "-" + destination.label}
                  href={destination.href}
                  onClick={(event) => {
                    event.preventDefault();
                    onDestinationSelect(destination);
                  }}
                >
                  {destination.label}
                </a>
              ))}
            </div>
            <div className="profession-career-links" aria-label={route.title + "に関連する職業情報"}>
              <span>仕事を知る</span>
              {route.careerLinks.map((careerLink) => (
                <a
                  key={careerLink.href}
                  href={careerLink.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => sendGaEvent("career_crosslink_click", {
                    placement: "profession_card",
                    route_id: route.id,
                    target: careerLink.href
                  })}
                >
                  {careerLink.label} <span aria-hidden="true">↗</span>
                </a>
              ))}
            </div>
            <a
              className="profession-cta"
              href={route.href}
              onClick={(event) => {
                event.preventDefault();
                onRouteSelect(route);
              }}
            >
              この道で学ぶ →
            </a>
            <a className="profession-guide-link" href={route.guideHref}>
              文章ロードマップを見る
            </a>
          </article>
          );
        })}
      </div>
      <div className="profession-dots" aria-label="職業カードの位置">
        {routes.map((route, index) => (
          <button
            key={"profession-dot-" + route.id}
            type="button"
            className={index === activeIndex ? "is-active" : ""}
            aria-label={route.title + "を表示"}
            onClick={() => scrollToCard(index)}
          />
        ))}
      </div>
    </section>
  );
}

function ProfessionIcon({ icon }: { icon: string }) {
  const commonProps = { viewBox: "0 0 24 24", role: "presentation", focusable: "false" } as const;
  if (icon === "office") {
    return (
      <span className="profession-icon" aria-hidden="true">
        <svg {...commonProps}>
          <path d="M5 5h14v14H5z" />
          <path d="M8 9h8" />
          <path d="M8 13h5" />
          <path d="M8 17h7" />
        </svg>
      </span>
    );
  }
  if (icon === "creative") {
    return (
      <span className="profession-icon" aria-hidden="true">
        <svg {...commonProps}>
          <path d="M5 7h14v10H5z" />
          <path d="m10 10 4 2-4 2z" />
          <path d="M7 4h3" />
          <path d="M14 4h3" />
        </svg>
      </span>
    );
  }
  if (icon === "globe") {
    return (
      <span className="profession-icon" aria-hidden="true">
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="8" />
          <path d="M4 12h16" />
          <path d="M12 4c2 2.2 3 4.8 3 8s-1 5.8-3 8" />
          <path d="M12 4c-2 2.2-3 4.8-3 8s1 5.8 3 8" />
        </svg>
      </span>
    );
  }
  if (icon === "certificate") {
    return (
      <span className="profession-icon" aria-hidden="true">
        <svg {...commonProps}>
          <path d="M7 4h10v12H7z" />
          <path d="M9 8h6" />
          <path d="M9 11h6" />
          <path d="M10 16v4l2-1.3L14 20v-4" />
        </svg>
      </span>
    );
  }
  if (icon === "chart") {
    return (
      <span className="profession-icon" aria-hidden="true">
        <svg {...commonProps}>
          <path d="M5 19V9" />
          <path d="M12 19V5" />
          <path d="M19 19v-7" />
          <path d="M4 19h17" />
        </svg>
      </span>
    );
  }
  if (icon === "trend") {
    return (
      <span className="profession-icon" aria-hidden="true">
        <svg {...commonProps}>
          <path d="m4 16 5-5 4 4 7-8" />
          <path d="M15 7h5v5" />
          <path d="M4 20h17" />
        </svg>
      </span>
    );
  }
  if (icon === "money") {
    return (
      <span className="profession-icon" aria-hidden="true">
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="8" />
          <path d="M8.5 8.5 12 12l3.5-3.5" />
          <path d="M12 12v5" />
          <path d="M9 14h6" />
          <path d="M9 16.5h6" />
        </svg>
      </span>
    );
  }
  return (
    <span className="profession-icon" aria-hidden="true">
      <svg {...commonProps}>
        <path d="M6 18 18 6" />
        <path d="M8 6h10v10" />
        <path d="M5 19h14" />
      </svg>
    </span>
  );
}

function RecentStrip({ videos }: { videos: Video[] }) {
  return (
    <section className="recent-strip" aria-labelledby="recent-strip-title">
      <div className="recent-strip-inner">
        <div className="recent-strip-heading">
          <p className="section-eyebrow">続きから</p>
          <h2 id="recent-strip-title">最近見た動画</h2>
        </div>
        <div className="recent-strip-track" role="list">
          {videos.map((video) => (
            <a key={video.ytid} href={videoDetailHref(video)} className="recent-video-card" role="listitem">
              <span className="recent-video-thumb">
                <Image
                  src={"https://i.ytimg.com/vi/" + video.ytid + "/hqdefault.jpg"}
                  alt={thumbnailAlt(video)}
                  width={240}
                  height={135}
                  sizes="(min-width: 760px) 220px, 58vw"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </span>
              <span className="recent-video-title">{video.title}</span>
              <span className="recent-video-meta">{genreLabel(video.genre)} / {scoreText(video)} / {video.minutes}分</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function MobileBottomNav({
  watchlistOnly,
  onExplore,
  onRoadmap,
  onWatchlist,
  onMenu
}: {
  watchlistOnly: boolean;
  onExplore: () => void;
  onRoadmap: () => void;
  onWatchlist: () => void;
  onMenu: () => void;
}) {
  return (
    <nav className="mobile-bottom-nav" aria-label="クイックナビ">
      <button type="button" onClick={onExplore}>
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.8-3.8" />
        </svg>
        <span>探す</span>
      </button>
      <button type="button" onClick={onRoadmap}>
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M5 19c4-9 10 1 14-9" />
          <path d="M15 9h4v4" />
          <circle cx="5" cy="19" r="1.4" />
        </svg>
        <span>ロードマップ</span>
      </button>
      <button type="button" aria-pressed={watchlistOnly} onClick={onWatchlist}>
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M7 4h10v16l-5-3.5L7 20z" />
        </svg>
        <span>あとで見る</span>
      </button>
      <button type="button" onClick={onMenu}>
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M4 7h16" />
          <path d="M4 12h16" />
          <path d="M4 17h16" />
        </svg>
        <span>メニュー</span>
      </button>
    </nav>
  );
}

function SiteMenuDrawer({
  genres,
  routes,
  drawerRef,
  onKeyDown,
  onClose,
  onProfessionSelect,
  onGenreSelect,
  onGenreList,
  onSectionSelect
}: {
  genres: Genre[];
  routes: ProfessionRoute[];
  drawerRef: RefObject<HTMLElement>;
  onKeyDown: (event: ReactKeyboardEvent<HTMLElement>) => void;
  onClose: () => void;
  onProfessionSelect: (routeId?: string) => void;
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
          <div className="site-menu-brand">
            <span className="site-menu-brand-mark" aria-hidden="true">✓</span>
            <div>
              <h2 id="site-menu-title">Manapick</h2>
              <p>学び直しを、最短ルートに。</p>
            </div>
          </div>
          <button type="button" className="site-menu-close" onClick={onClose} aria-label="メニューを閉じる">
            ×
          </button>
        </div>
        <nav className="site-menu-links" aria-label="メニューリンク">
          <p className="site-menu-section-label">まず選ぶ</p>
          <div className="site-menu-primary-grid">
            <a className="site-menu-action-card is-primary" href="/start/" onClick={onClose}>
              <span aria-hidden="true">◎</span>
              <strong>今日の1本診断</strong>
              <small>3つの質問から選ぶ</small>
            </a>
            <button type="button" className="site-menu-action-card" onClick={() => onProfessionSelect()}>
              <span aria-hidden="true">↗</span>
              <strong>職業から選ぶ</strong>
              <small>なりたい姿から逆引き</small>
            </button>
            <button type="button" className="site-menu-action-card" onClick={onGenreList}>
              <span aria-hidden="true">▦</span>
              <strong>{genres.length}ジャンル</strong>
              <small>学びたい分野から探す</small>
            </button>
            <button type="button" className="site-menu-action-card" onClick={() => onSectionSelect("roadmap")}>
              <span aria-hidden="true">⌁</span>
              <strong>ロードマップ</strong>
              <small>見る順番で進める</small>
            </button>
          </div>

          <p className="site-menu-section-label">探す・続ける</p>
          <div className="site-menu-compact-grid">
            <a href="/youtube-learning/" onClick={onClose}>おすすめ動画</a>
            <a href="/study-plan/" onClick={onClose}>7日学習プラン</a>
            <a href="/ranking/" onClick={onClose}>ランキング</a>
            <a href="/new/" onClick={onClose}>新着動画</a>
            <Link href="/news/" onClick={onClose}>学びニュース</Link>
            <a href="/my/" onClick={onClose}>マイページ</a>
            <a href="/glossary/" onClick={onClose}>用語集</a>
            <a href="/faq/" onClick={onClose}>よくある質問</a>
            <a href="/network/" onClick={onClose}>4サイト案内</a>
            <a href="/shop/" onClick={onClose}>manapi商店</a>
            <a href="/contact/" onClick={onClose}>お問い合わせ</a>
          </div>

          <details className="site-menu-expandable">
            <summary>なりたい職業から選ぶ <span aria-hidden="true">⌄</span></summary>
            <div className="site-menu-profession-list" role="group" aria-label="職業別の入口">
              {routes.map((route) => (
                <button key={route.id} type="button" onClick={() => onProfessionSelect(route.id)}>
                  <ProfessionIcon icon={route.icon} />
                  <span>{route.title}</span>
                </button>
              ))}
            </div>
          </details>

          <details className="site-menu-expandable">
            <summary>{genres.length}ジャンル一覧 <span aria-hidden="true">⌄</span></summary>
            <div className="site-menu-genre-grid" role="group" aria-label="ジャンル一覧">
              {genres.map((genre) => (
                <a
                  key={genre.key}
                  href={`/genre/${genre.key}/`}
                  onClick={(event) => {
                    event.preventDefault();
                    onGenreSelect(genre.key);
                  }}
                >
                  <GenreIcon genreKey={genre.key} className="site-menu-genre-icon" />
                  <span>{genreLabel(genre.key)}</span>
                </a>
              ))}
            </div>
          </details>

          <details className="site-menu-expandable is-support">
            <summary>サイト情報・サポート <span aria-hidden="true">⌄</span></summary>
            <div className="site-menu-support-links">
              <a href="/about-score/" onClick={onClose}>採点方法</a>
              <a href="/all/" onClick={onClose}>サイトマップ</a>
              <a href="/operator/" onClick={onClose}>運営者情報</a>
              <a href="/affiliate/" onClick={onClose}>広告・アフィリエイト</a>
              <a href="/privacy/" onClick={onClose}>プライバシー</a>
              <a href="/contact/" onClick={onClose}>お問い合わせ</a>
            </div>
          </details>

          <p className="site-menu-section-label">姉妹サイト</p>
          <a
            className="site-menu-link site-menu-ai-link"
            href={MANAPICK_AI_URL}
            target="_blank"
            rel="noopener"
            onClick={() => {
              sendGaEvent("ai_crosslink_click", { placement: "menu", target: "manapick_ai" });
              onClose();
            }}
          >
            <span>manapick AI ↗</span>
            <small>公式AI版・AIツールを選ぶ</small>
          </a>
          <a
            className="site-menu-link site-menu-license-link"
            href={MANAPICK_LICENSE_URL}
            target="_blank"
            rel="noopener"
            onClick={() => {
              sendGaEvent("license_crosslink_click", { placement: "menu", target: "manapick_license" });
              onClose();
            }}
          >
            <span>manapick license ↗</span>
            <small>資格・検定を比較</small>
          </a>
          <a
            className="site-menu-link site-menu-career-link"
            href={MANAPICK_CAREER_URL}
            target="_blank"
            rel="noopener"
            onClick={() => {
              sendGaEvent("career_crosslink_click", { placement: "menu", target: "manapick_career" });
              onClose();
            }}
          >
            <span>manapick career ↗</span>
            <small>仕事内容と学ぶ順番を確認</small>
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
  const tabRefs = useRef<Record<string, HTMLAnchorElement | null>>({});

  useEffect(() => {
    const activeTab = tabRefs.current[activeGenre];
    if (!activeTab) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    activeTab.scrollIntoView({
      inline: "center",
      block: "nearest",
      behavior: reducedMotion ? "auto" : "smooth"
    });
  }, [activeGenre]);

  return (
    <nav className="category-tab-nav" aria-label="公開中ジャンル">
      <div className="category-tab-track">
        {genres.map((genre) => (
          <a
            key={genre.key}
            ref={(node) => {
              tabRefs.current[genre.key] = node;
            }}
            href={`/genre/${genre.key}/`}
            className={activeGenre === genre.key ? "category-tab is-active" : "category-tab"}
            onClick={(event) => {
              event.preventDefault();
              onSelect(genre.key);
            }}
            aria-current={activeGenre === genre.key ? "page" : undefined}
          >
            <GenreIcon genreKey={genre.key} className="category-tab-icon" />
            <span className="category-tab-text">
              <span>{genreLabel(genre.key)}</span>
              <small>{genreEnglishLabel(genre.key)}</small>
            </span>
          </a>
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
              alt={thumbnailAlt(activeSlide.video)}
              width={480}
              height={270}
              sizes="(min-width: 1440px) 760px, (min-width: 1280px) 640px, (min-width: 760px) 52vw, 92vw"
              priority={activeIndex === 0}
              className="absolute inset-0 h-full w-full object-cover"
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
      label: "随時更新",
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
      label: "YouTube公式動画・すべて無料",
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
      label: "✓ 視聴確認済 " + confirmedCount + "本",
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

function WatchlistFilterControl({
  ready,
  count,
  active,
  onToggle
}: {
  ready: boolean;
  count: number;
  active: boolean;
  onToggle: () => void;
}) {
  if (!ready || count === 0) return null;

  return (
    <div className="watchlist-filter-row">
      <button
        type="button"
        className={active ? "watchlist-filter-chip is-active" : "watchlist-filter-chip"}
        aria-pressed={active}
        onClick={onToggle}
      >
        <span aria-hidden="true">🔖</span>
        <span>あとで見る({count})</span>
      </button>
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
            <span className="highlight-meta">
              <span>{scoreText(video)}</span>
              <span className={`score-badge-status is-${scoreStatus(video)}`}>{scoreStatusText(video)}</span>
              <span>{video.minutes}分</span>
            </span>
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
  onTopicSelect,
  likeCounts
}: {
  genre: Genre;
  topics: [string, number][];
  topVideo: Video | null;
  selectedSub: string;
  onTopicSelect: (sub: string) => void;
  likeCounts: LikeCounts;
}) {
  return (
    <section id="topic-filter-anchor" className="genre-summary-panel" aria-labelledby="genre-summary-title">
      <div className="genre-summary-heading">
        <div>
          <p className="section-eyebrow">{genreName(genre.key)}</p>
          <h2 id="genre-summary-title" className="section-title">トピックから絞り込む</h2>
        </div>
        {selectedSub !== "all" ? <button type="button" onClick={() => onTopicSelect("all")}>絞り込み解除</button> : null}
      </div>
      {genre.note ? <p className="genre-note">{genre.note}</p> : null}
      <div className="topic-chip-row" role="group" aria-label="サブジャンルトピック">
        {topics.map(([sub, count]) => (
          <button key={sub} type="button" className={selectedSub === sub ? "topic-chip is-active" : "topic-chip"} onClick={() => onTopicSelect(sub)}>
            <span>{sub}</span>
            <strong>{count}</strong>
          </button>
        ))}
      </div>
      {topVideo ? <FeaturedVideoCard video={topVideo} likeCounts={likeCounts} /> : null}
    </section>
  );
}

function FeaturedVideoCard({ video, likeCounts }: { video: Video; likeCounts: LikeCounts }) {
  return (
    <article className="featured-video-card">
      <div className="featured-video-thumb">
        <a className="featured-video-thumb-link" href={videoDetailHref(video)} aria-label={video.title + "の詳細ページを開く"}>
          <Image
            src={"https://i.ytimg.com/vi/" + video.ytid + "/hqdefault.jpg"}
            alt={thumbnailAlt(video)}
            width={480}
            height={270}
            sizes="(min-width: 760px) 320px, 92vw"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </a>
        <ScoreBadge video={video} compact />
      </div>
      <div>
        <p className="featured-video-eyebrow">まず見るべき1本</p>
        <h3><a href={videoDetailHref(video)}>{video.title}</a></h3>
        <p>{video.review[0]}</p>
        <LikeButton ytid={video.ytid} initialCount={likeCounts[video.ytid] ?? 0} className="is-card-action" />
        <a href={videoDetailHref(video)}>詳細を見る</a>
      </div>
    </article>
  );
}

function ScoreBadge({ video, compact = false }: { video: Video; compact?: boolean }) {
  const status = scoreStatus(video);
  const label = scoreText(video) + " " + scoreStatusText(video);
  const statusLabel = scoreStatusText(video);

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

function WeeklyPickCard({ video, likeCounts }: { video: Video; likeCounts: LikeCounts }) {
  const reviewLine = video.review[0] ?? "今週まず見てほしい、Manapick最高スコアの一本です。";

  return (
    <article className="weekly-pick-card" aria-label="今週のイチオシ">
      <div className="weekly-pick-thumb">
        <a className="weekly-pick-thumb-link" href={videoDetailHref(video)} aria-label={video.title + "の詳細ページを開く"}>
          <Image
            src={"https://i.ytimg.com/vi/" + video.ytid + "/hqdefault.jpg"}
            alt={thumbnailAlt(video)}
            width={480}
            height={270}
            sizes="(min-width: 1320px) 680px, (min-width: 760px) 92vw, 92vw"
            loading="eager"
            className="absolute inset-0 h-full w-full object-cover"
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
        <LikeButton ytid={video.ytid} initialCount={likeCounts[video.ytid] ?? 0} className="is-card-action" />
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

  if (!steps[2].isPlaceholder && steps[2].videos.length === 0) {
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

function VideoCard({
  video,
  highlighted = false,
  watchlist,
  watched,
  likeCounts,
  referenceTime
}: {
  video: Video;
  highlighted?: boolean;
  watchlist?: LocalListState;
  watched?: LocalListState;
  likeCounts: LikeCounts;
  referenceTime: number;
}) {
  const channel = displayChannel(video);
  const ageLabel = publishedAgeLabel(video, referenceTime);
  const freshness = freshnessBadge(video, referenceTime);
  const watchlistActive = watchlist?.ready ? watchlist.has(video.ytid) : false;
  const watchedActive = watched?.ready ? watched.has(video.ytid) : false;

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
          <div className="video-card-thumb relative aspect-video bg-bgSoft">
            <Image
              src={"https://i.ytimg.com/vi/" + video.ytid + "/hqdefault.jpg"}
              alt={thumbnailAlt(video)}
              width={480}
              height={270}
              sizes="(min-width: 880px) 33vw, (min-width: 560px) 50vw, 100vw"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 ease-[var(--ease-standard)] group-hover:scale-[1.025] motion-reduce:transform-none motion-reduce:transition-none"
            />
            <span className="video-duration-badge">
              {video.minutes}分
            </span>
          </div>
        </a>
        {watchlist?.ready ? (
          <button
            type="button"
            className={watchlistActive ? "video-watchlist-toggle is-active" : "video-watchlist-toggle"}
            aria-pressed={watchlistActive}
            aria-label={watchlistActive ? "あとで見るから解除" : "あとで見るに追加"}
            onClick={() => {
              sendGaEvent("video_save_toggle", { video_id: video.ytid, action: watchlistActive ? "remove" : "add", source: "card" });
              watchlist.toggle(video.ytid);
            }}
          >
            <span aria-hidden="true">🔖</span>
          </button>
        ) : null}
        <div className="card-score-wrap">
          <ScoreBadge video={video} compact />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex flex-wrap gap-2">
          <LevelBadge level={video.level} />
          <span className="rounded-pill bg-bg px-2.5 py-1 text-xs font-black text-ink">{video.sub}</span>
          {freshness ? <span className={`freshness-badge is-${freshness.tone}`}>{freshness.label}</span> : null}
          {ageLabel ? <span className="published-age">{ageLabel}</span> : null}
          {watched?.ready && watchedActive ? <span className="watched-status-badge">✓視聴済み</span> : null}
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
            <li key={`${index}-${line}`} className="flex gap-2">
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
            {scoreConfirmationText(video)}
          </p>
        )}
        <div className="video-card-engagement">
          <LikeButton ytid={video.ytid} initialCount={likeCounts[video.ytid] ?? 0} className="is-card-action" />
        </div>
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
  const label = genreDisplayName(genreKey) + "のアイコン";

  return (
    <span className={`genre-icon-shell ${className}`} {...(src ? {} : { role: "img", "aria-label": label })}>
      {src ? (
        <Image src={src} alt={label} width={32} height={32} className="genre-icon-image" />
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

  if (genreKey === "money") {
    return (
      <svg viewBox="0 0 24 24" role="presentation" focusable="false">
        <circle cx="12" cy="12" r="9" />
        <path d="M8.5 8l3.5 4 3.5-4" />
        <path d="M12 12v5" />
        <path d="M9.5 13.5h5" />
        <path d="M9.5 16h5" />
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
    shikaku: "資格",
    kaikei: "会計資格",
    money: "お金・投資"
  };
  return shortLabels[key] ?? genreDisplayName(key);
}

function roadmapTitle(roadmap: Roadmap) {
  if (roadmap.genre === "biz") return "Office・資料作成ロードマップ";
  return roadmap.title;
}

function RoadmapTimeline({ roadmap, watched, subMode = false }: { roadmap: Roadmap; watched: LocalListState; subMode?: boolean }) {
  const steps = subMode ? (roadmap.steps as DisplayRoadmapStep[]) : buildRoadmapSteps(roadmap);
  const watchedSet = new Set(watched.items);
  const roadmapVideoIds = steps.flatMap((step) => step.videos);
  const roadmapTotal = roadmapVideoIds.length;
  const roadmapWatchedCount = watched.ready ? roadmapVideoIds.filter((ytid) => watchedSet.has(ytid)).length : 0;
  const roadmapProgress = roadmapTotal > 0 ? Math.round((roadmapWatchedCount / roadmapTotal) * 100) : 0;

  return (
    <section id="roadmap-panel" className="roadmap-panel" role="tabpanel">
      <div className="roadmap-title-row">
        <h3>{subMode ? roadmap.title : roadmapTitle(roadmap)}</h3>
        <span aria-hidden="true" className="roadmap-star">★</span>
      </div>
      {watched.ready && roadmapTotal > 0 ? (
        <div className="roadmap-progress" aria-label={"ロードマップ進捗 視聴済み " + roadmapWatchedCount + "/" + roadmapTotal}>
          <div className="roadmap-progress-topline">
            <span>視聴済み {roadmapWatchedCount}/{roadmapTotal}</span>
            <strong>{roadmapProgress}%</strong>
          </div>
          <div className="roadmap-progress-track" aria-hidden="true">
            <span style={{ width: roadmapProgress + "%" }} />
          </div>
        </div>
      ) : null}
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
              {watched.ready && step.videos.length > 0 ? (
                <p className="roadmap-step-progress">
                  視聴済み {step.videos.filter((ytid) => watchedSet.has(ytid)).length}/{step.videos.length}
                </p>
              ) : null}
              {step.isPlaceholder ? (
                <p className="roadmap-placeholder-copy">
                  上級動画を選定中です。追加後にここへ公式サムネ付きで表示します。
                </p>
              ) : (
                <div className="roadmap-video-grid">
                  {step.videos.map((ytid) => {
                    const video = videos.find((item) => item.ytid === ytid);
                    return video ? <RoadmapMiniVideo key={ytid} video={video} watched={watched.ready && watchedSet.has(ytid)} /> : null;
                  })}
                </div>
              )}
            </div>
          </li>
        ))}
      </ol>
      <div className="roadmap-swipe-hint" aria-hidden="true">
        <span className="roadmap-swipe-dots">
          <span />
          <span />
          <span />
        </span>
        <span>スワイプ→</span>
      </div>
    </section>
  );
}

function RoadmapMiniVideo({ video, watched }: { video: Video; watched: boolean }) {
  return (
    <a className="roadmap-mini-card" href={videoDetailHref(video)}>
      <span className="roadmap-mini-thumb">
        <Image
          src={"https://i.ytimg.com/vi/" + video.ytid + "/hqdefault.jpg"}
          alt={thumbnailAlt(video)}
          width={480}
          height={270}
          sizes="(min-width: 760px) 160px, 35vw"
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {watched ? <span className="roadmap-mini-watched">✓</span> : null}
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
