"use client";

import Fuse from "fuse.js";
import Image from "next/image";
import Link from "next/link";
import { createContext, type CSSProperties, type ReactNode, type KeyboardEvent as ReactKeyboardEvent, type RefObject, useContext, useEffect, useMemo, useRef, useState } from "react";
import BreakText from "@/components/BreakText";
import LiveSearchPanel from "@/components/LiveSearchPanel";
import SiteMenu from "@/components/SiteMenu";
import { popularSearchKeywords } from "@/lib/search-keywords";
import BrandLogo, { BrandMark } from "@/components/BrandLogo";
import AdSlot from "@/components/AdSlot";
import LikeButton from "@/components/LikeButton";
import TransferNavItem from "@/components/TransferSheet";
import genresData from "@/content/genres.json";
import professionRoutesData from "@/content/professions.json";
import roadmapsData from "@/content/roadmaps.json";
import videosData from "@/content/videos.json";
import { RECENT_KEY, WATCHED_KEY, WATCHLIST_KEY, sendGaEvent } from "@/lib/retention";
import { genericAxisNoteCount, isGenericAxisNote, youtubeThumbnail } from "@/lib/manapick";
import sisterItemLinks from "@/content/sister-item-links.json";
import { XFER_AI_FALLBACK, XFER_CAREER_BY_GENRE, XFER_COMPANY_BY_GENRE, XFER_CTA, XFER_LICENSE_BY_GENRE, XFER_ORDER, XFER_ORDER_DEFAULT, XFER_POLITICS_BY_GENRE } from "@/lib/xfer-links";
import { averageScoreOf, medianOf, siteStats } from "@/lib/site-stats";
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
  /** 表示する段階名（2026-11-13: レベルのバッジをやめ段階名で示す、所有者承認 2026-11-11） */
  stage?: string;
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

// 動画タイトルの文節境界（app/page.tsx がビルド時に BudouX で計算して渡す）。iPhone Safari は
// word-break: auto-phrase に対応しないため、<wbr> を入れて語の途中で折れないようにする。
const TitleBreaksContext = createContext<Record<string, number[]>>({});

function VideoTitle({ video }: { video: Pick<Video, "ytid" | "title"> }) {
  const breaks = useContext(TitleBreaksContext);
  return <BreakText text={video.title} breaks={breaks[video.ytid]} />;
}

function SubName({ sub }: { sub: string }) {
  const breaks = useContext(TitleBreaksContext);
  return <BreakText text={sub} breaks={breaks["sub:" + sub]} />;
}
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

// ジャンル索引の並びはデザインモックの編集順（件数順ではない）。
const GENRE_INDEX_ORDER = ["shikaku", "ai", "video", "prog", "english", "data", "marke", "biz", "kaikei", "money"];

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
    label: "Python入門本の選び方",
    href: "/learn/python-beginner-book/",
    note: "無料動画との使い分け"
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
    label: "ビジネス会計検定3級の勉強時間",
    href: "/learn/business-accounting-3-study-time/",
    note: "公式範囲から計画する"
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
  return "運営者が採点済み";
}

function scoreConfirmationText(video: Video) {
  const date = video.scoreConfirmedAt ? video.scoreConfirmedAt.replace(/-/g, "/") : null;
  return "運営者が7軸35点で採点したスコアです" + (date ? "（確認日: " + date + "）" : "");
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

function genreEnglishTitle(key: string) {
  const labels: Record<string, string> = {
    ai: "Generative AI",
    prog: "Programming",
    video: "Creative",
    english: "English",
    data: "Data & DX",
    marke: "Marketing",
    biz: "Office skills",
    shikaku: "Certification",
    kaikei: "Accounting",
    money: "Money"
  };
  return labels[key] ?? key;
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

export default function ManapickApp({
  referenceTime,
  titleBreaks,
  menuBreaks,
  afterContent
}: {
  referenceTime: number;
  titleBreaks: Record<string, number[]>;
  menuBreaks: Record<string, number[]>;
  /** main の末尾に置くサーバー側の区切り（学びニュース・よくある質問）。本文を main の中に収める */
  afterContent?: ReactNode;
}) {
  return (
    <TitleBreaksContext.Provider value={titleBreaks}>
      <ManapickAppMain referenceTime={referenceTime} menuBreaks={menuBreaks} afterContent={afterContent} />
    </TitleBreaksContext.Provider>
  );
}

function ManapickAppMain({
  referenceTime,
  menuBreaks,
  afterContent
}: {
  referenceTime: number;
  menuBreaks: Record<string, number[]>;
  afterContent?: ReactNode;
}) {
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
  const [watchlistOnly, setWatchlistOnly] = useState(false);

  const [popularLikeCounts, setPopularLikeCounts] = useState<LikeCounts>({});
  const searchInputRef = useRef<HTMLInputElement>(null);
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
  const recentVideos = useMemo(() => {
    const byId = new Map(videos.map((video) => [video.ytid, video]));
    return recent.items
      .map((ytid) => byId.get(ytid))
      .filter((video): video is Video => video !== undefined && publishedGenreKeys.includes(video.genre))
      .slice(0, 8);
  }, [recent.items]);

  const searchSuggestions = useMemo(() => (searchActive ? filteredVideos.slice(0, 5) : []), [filteredVideos, searchActive]);
  const liveSearchTotal = searchActive ? filteredVideos.length : videos.length;

  // 候補パネル（design-extra-2 01）：ジャンル・キーワードの候補。2文字から出す。
  const [suggestionsAnchor, setSuggestionsAnchor] = useState<"header" | "section">("header");
  const genreMatches = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    if (q.length < 2) return [];
    return publishedGenres
      .filter((genre) => genre.label.toLowerCase().includes(q) || genreEnglishTitle(genre.key).toLowerCase().includes(q))
      .map((genre) => ({
        key: genre.key as string,
        name: genre.label as string,
        initial: (genreEnglishTitle(genre.key).charAt(0) || "G").toUpperCase(),
        count: publishedVideos.filter((video) => video.genre === genre.key).length
      }))
      .slice(0, 3);
  }, [keyword, publishedGenres, publishedVideos]);
  const keywordMatches = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    if (q.length < 2) return [];
    return popularSearchKeywords.filter((term) => term.toLowerCase().includes(q)).slice(0, 3);
  }, [keyword]);

  // SP で候補パネルが開いている間は背後のスクロールを止める（全画面表示のため）。
  useEffect(() => {
    if (!suggestionsOpen) return;
    if (!window.matchMedia("(max-width: 640px)").matches) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [suggestionsOpen]);

  const weeklyPick = useMemo(() => {
    return publishedVideos.reduce<Video | null>((best, video) => {
      if (video.score === null) return best;
      if (best === null || best.score === null || video.score > best.score) return video;
      return best;
    }, null);
  }, [publishedVideos]);

  // ルックブック用：ヒーローの数字とモザイク、フィルム帯の12本。
  // 数値はすべて表示時点の実データから算出する（固定書き禁止）。
  const catalogStats = useMemo(() => {
    const scored = publishedVideos.filter((video) => video.score !== null);
    return { scoredCount: scored.length };
  }, [publishedVideos]);

  const mosaicVideos = useMemo(() => {
    if (!weeklyPick) return [];
    const tiles: Video[] = [weeklyPick];
    const usedGenres = new Set([weeklyPick.genre]);
    const bestByGenre = new Map<string, Video>();
    for (const video of publishedVideos) {
      if (video.score === null || video.ytid === weeklyPick.ytid || usedGenres.has(video.genre)) continue;
      const current = bestByGenre.get(video.genre);
      if (!current || (video.score ?? 0) > (current.score ?? 0)) bestByGenre.set(video.genre, video);
    }
    const others = Array.from(bestByGenre.values()).sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
    for (const video of others) {
      if (tiles.length >= 5) break;
      tiles.push(video);
    }
    return tiles;
  }, [publishedVideos, weeklyPick]);

  const stripVideos = useMemo(() => {
    return [...publishedVideos]
      .filter((video) => video.score !== null)
      .sort((a, b) => (b.score ?? 0) - (a.score ?? 0) || publishedTime(b) - publishedTime(a))
      .slice(0, 12);
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
      // 他ページの検索フォーム（?q=）と時間の指定（?time=）を受け取る
      const time = params.get("time");
      if (time && timeBuckets.some((bucket) => bucket.value === time)) {
        setSelectedTime(time);
      }
      const query = params.get("q")?.trim();
      if (query) {
        setSearchDraft(query);
        setKeyword(query);
        window.setTimeout(() => {
          document.getElementById("search")?.scrollIntoView({ block: "start", behavior: "auto" });
        }, 400);
      }
    }, 0);
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

    function handleKeydown(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeydown);
    window.setTimeout(() => {
      const firstFocusable = menuDrawerRef.current?.querySelector<HTMLElement>(".mp-menu-close");
      firstFocusable?.focus();
    }, 0);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeydown);
      if (previousFocus && document.contains(previousFocus)) {
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
    // 検索入力にフォーカスしたまま（候補表示中）だと、モバイルブラウザの
    // フォーカス追従スクロールと競合して移動が打ち消されるため、先に外す。
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
    setSuggestionsOpen(false);
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

  function handleRoadmapGenreSelect(genre: string) {
    sendGaEvent("roadmap_genre_select", { genre });
    setActiveRoadmapGenre(genre);
    handleGenreChange(genre, "none");
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

  function handleMenuKeyDown(event: ReactKeyboardEvent<HTMLElement>) {
    if (event.key !== "Tab") return;
    const focusable = Array.from(menuDrawerRef.current?.querySelectorAll<HTMLElement>("button, a, summary, input") ?? [])
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


  return (
    <main className="lb-main">
      <header className="site-header lb-hd">
        <div className="lb-hd-inner">
          <a href="#top" className="lb-wordmark min-w-0 shrink-0" aria-label="Manapick トップ">
            manapick
          </a>
          <nav className="lb-hd-nav" aria-label="サイト内リンク">
            <a className="lb-nav-current" href="#search">
              さがす
            </a>
            <a href="#roadmap">ロードマップ</a>
            <a href="/ranking/">ランキング</a>
            <a href="/new/">新着</a>
            <Link href="/news/">ニュース</Link>
            <a href="/glossary/">用語集</a>
          </nav>
          <div className={suggestionsOpen && suggestionsAnchor === "header" ? "top-search-wrap is-panel-open" : "top-search-wrap"}>
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
                onFocus={() => {
                  setSuggestionsAnchor("header");
                  setSuggestionsOpen(true);
                }}
                onKeyDown={handleSearchKeyDown}
                placeholder="動画・ジャンル・資格名で検索"
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
              open={suggestionsOpen && suggestionsAnchor === "header"}
              recentSearches={recentSearches}
              genreMatches={genreMatches}
              keywordMatches={keywordMatches}
              onSelect={(video) => openVideoPage(video as Video)}
              onGenreSelect={(genreKey) => {
                setSuggestionsOpen(false);
                handleGenreChange(genreKey);
              }}
              onKeywordSelect={(term) => {
                applySearchKeyword(term);
                setSuggestionsOpen(false);
              }}
              onShowAll={() => {
                saveRecentSearch();
                scrollToResults();
              }}
              onRecentSearchSelect={(term) => {
                setSearchDraft(term);
                setKeyword(term);
                setSuggestionsOpen(true);
              }}
              onClose={() => setSuggestionsOpen(false)}
            />
          </div>
          <a className="lb-me" href="/my/">
            マイページ
          </a>
        </div>
      </header>
      {menuOpen ? (
        <SiteMenu
          id="site-menu"
          drawerRef={menuDrawerRef}
          genres={publishedGenres.map((genre) => ({ key: genre.key, label: genreLabel(genre.key), count: genreVideoCounts[genre.key] ?? 0 }))}
          professions={professionRoutes.map((route) => ({ id: route.id, title: route.title, href: route.href }))}
          breaks={menuBreaks}
          onKeyDown={handleMenuKeyDown}
          onClose={() => setMenuOpen(false)}
        />
      ) : null}

      <section id="top" className="lb-hero">
        <div className="lb-hero-panel">
          <span className="lb-hero-ring" aria-hidden="true" />
          <span className="lb-hero-ring is-b" aria-hidden="true" />
          <div className="lb-hero-tag">
            <span className="nw-stn lb-hero-stn">
              MP<small>01</small>
            </span>
            <span>社会人の学び直し動画キュレーション</span>
          </div>
          <h1 className="lb-hero-title">
            見るべき一本だけを、
            <br />
            <em>迷わせない。</em>
          </h1>
          <p className="lb-hero-en" aria-hidden="true">
            Only the one worth your evening.
          </p>
          <div className="lb-hero-facts">
            <div>
              <b>{catalogStats.scoredCount}</b>
              採点済みの動画
            </div>
            <div>
              <b>
                7<small>軸</small>35
              </b>
              点で採点
            </div>
            <div>
              <b>{siteStats.publishedGenreCount}</b>
              ジャンル
            </div>
          </div>
          <a className="lb-hero-cta" href="#weekly-pick">
            迷ったら、まずこの1本
            <i aria-hidden="true">→</i>
          </a>
        </div>
        <div className="lb-mosaic">
          {mosaicVideos.map((video, index) => (
            <div key={video.ytid} className={index === 0 ? "lb-tile is-big" : "lb-tile"}>
              <a
                className="lb-tile-link"
                href={videoDetailHref(video)}
                aria-label={`${video.title}（${scoreText(video)}）`}
              >
                <Image
                  src={youtubeThumbnail(video.ytid)}
                  alt=""
                  fill
                  sizes={index === 0 ? "(max-width: 640px) 100vw, 34vw" : "(max-width: 640px) 50vw, 17vw"}
                  className="lb-tile-img"
                  priority={index === 0}
                />
                <span className="lb-tile-shade" aria-hidden="true" />
                <span className="lb-tile-score">
                  {video.score ?? "–"}
                  <small>/35</small>
                </span>
                {index === 0 ? <span className="lb-tile-pick">今週のイチオシ</span> : null}
                <span className="lb-tile-title"><VideoTitle video={video} /></span>
                <span className="lb-tile-no">{String(index + 1).padStart(2, "0")}</span>
                <span className="lb-tile-gen">{genreEnglishLabel(video.genre)}</span>
              </a>
              <button
                type="button"
                className={watchlist.has(video.ytid) ? "lb-tile-plus is-saved" : "lb-tile-plus"}
                aria-pressed={watchlist.has(video.ytid)}
                aria-label={
                  watchlist.has(video.ytid)
                    ? `「${video.title}」をあとで見るから外す`
                    : `「${video.title}」をあとで見るに保存`
                }
                onClick={() => watchlist.toggle(video.ytid)}
              >
                <span aria-hidden="true">{watchlist.has(video.ytid) ? "✓" : "+"}</span>
              </button>
            </div>
          ))}
        </div>
      </section>


      {stripVideos.length > 0 ? (
        <section id="weekly-pick" className="lb-strip" aria-labelledby="weekly-pick-title">
          <div className="lb-eh lb-eh-dark">
            <div className="lb-eh-stack">
              <span className="lb-code">MP-02 · THIS WEEK</span>
              <h2 id="weekly-pick-title">注目の12本</h2>
            </div>
            <p>スコア上位から選んだ、いま注目の12本。</p>
            <a className="lb-more" href="/ranking/">
              12本すべて見る
            </a>
          </div>
          <div className="lb-reel">
            {stripVideos.map((video) => (
              <a key={video.ytid} className="lb-film-card" href={videoDetailHref(video)}>
                <span className="lb-film-thumb">
                  <Image src={youtubeThumbnail(video.ytid)} alt="" fill sizes="252px" className="lb-film-img" />
                </span>
                <span className="lb-film-body">
                  <span className="lb-film-meta">
                    <span className="lb-film-genre">{genreDisplayName(video.genre)}</span>
                    {video.minutes}分
                  </span>
                  <span className="lb-film-title"><VideoTitle video={video} /></span>
                  <span className="lb-film-foot">
                    採点
                    <b>
                      {video.score}
                      <small>/35</small>
                    </b>
                  </span>
                </span>
              </a>
            ))}
          </div>
        </section>
      ) : null}

      <section className="lb-sec" aria-labelledby="genre-index-title">
        <div className="lb-eh">
          <div className="lb-eh-stack">
            <span className="lb-code">MP-03 · INDEX</span>
            <h2 id="genre-index-title">ジャンルから選ぶ</h2>
          </div>
          <p>
            {siteStats.publishedGenreCount}ジャンル・{siteStats.publishedVideoCount}本。本数の多さではなく、見る順番まで整理しています。
          </p>
          <a className="lb-more" href="#search">
            条件で絞り込む
          </a>
        </div>
        <div className="lb-idx">
          {[...publishedGenres]
            .sort((a, b) => GENRE_INDEX_ORDER.indexOf(a.key) - GENRE_INDEX_ORDER.indexOf(b.key))
            .map((genre, index) => {
              const count = genreVideoCounts[genre.key] ?? 0;
              const max = Math.max(1, ...Object.values(genreVideoCounts));
              return (
                <a key={genre.key} className={index === 0 ? "lb-idx-row is-hot" : "lb-idx-row"} href={`/genre/${genre.key}/`}>
                  <span className="lb-idx-no">{String(index + 1).padStart(2, "0")}</span>
                  <span className="lb-idx-name">
                    {genreDisplayName(genre.key)}
                    <small>{genreEnglishTitle(genre.key)}</small>
                  </span>
                  <span className="lb-idx-count">
                    <b>{count}</b>
                    <span>本</span>
                  </span>
                  <span className="lb-idx-bar" aria-hidden="true">
                    <i style={{ width: `${Math.round((count / max) * 100)}%` }} />
                  </span>
                </a>
              );
            })}
        </div>
      </section>

      <LearningDataSection />

      <AdSlot slot="1438236565" />

      <section id="search" className="lb-srch">
        <div className="lb-srch-inner">
          <div id="genre-picker" className="lb-step">
            <span className="lb-step-k">① ざっくり探す</span>
            <h2>ジャンルから選ぶ</h2>
            <div className="lb-legend">
              <span>
                <i className="is-live" />
                公開中
              </span>
              <span>
                <i className="is-soon" />
                近日公開
              </span>
              <span>
                <i className="is-check" />
                確認中（注記）
              </span>
            </div>
          </div>

          <div className="lb-gpick" role="group" aria-label="公開中ジャンル">
            <button
              type="button"
              onClick={() => handleGenreChange("all")}
              className={selectedGenre === "all" ? "lb-gp is-all is-on" : "lb-gp is-all"}
              aria-pressed={selectedGenre === "all"}
            >
              <b>すべての公開中ジャンル</b>
              <span className="lb-gp-ct">
                {siteStats.publishedVideoCount}
                <small> 本から探す</small>
              </span>
              <span className="lb-gp-st">
                <i />
                公開中
              </span>
            </button>
            {publishedGenres.map((genre) => (
              <button
                type="button"
                key={genre.key}
                onClick={() => handleGenreChange(genre.key)}
                className={selectedGenre === genre.key ? "lb-gp is-on" : "lb-gp"}
                aria-pressed={selectedGenre === genre.key}
              >
                <b>{genreName(genre.key).replace(/・/g, "・\u200b")}</b>
                <span className="lb-gp-ct">
                  {genreVideoCounts[genre.key] ?? 0}
                  <small> 本</small>
                </span>
                <span className={genre.status === "checking" ? "lb-gp-st is-check" : "lb-gp-st"}>
                  <i />
                  {statusLabel(genre.status)}
                </span>
              </button>
            ))}
          </div>

          <div className="lb-filters">
            <div className="lb-step">
              <span className="lb-step-k">② 詳細に探す</span>
              <h2>条件で絞り込む</h2>
            </div>
            <div className="lb-frow">
              <div className="lb-fld">
                <label htmlFor="lb-sub-select">サブジャンル</label>
                <div className="lb-in">
                  <select id="lb-sub-select" value={selectedSub} onChange={(event) => setSelectedSub(event.target.value)}>
                    <option value="all">すべて</option>
                    {subOptions.map((sub) => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
                  </select>
                  <span className="lb-cv" aria-hidden="true">
                    ▾
                  </span>
                </div>
              </div>
              <div className="lb-fld">
                <span className="lb-fld-label">レベル</span>
                <div className="lb-seg" role="group" aria-label="レベルで絞り込む">
                  {levels.map((level) => (
                    <button
                      key={level}
                      type="button"
                      className={selectedLevel === level ? "is-on" : ""}
                      aria-pressed={selectedLevel === level}
                      onClick={() => setSelectedLevel(level)}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
              <div className="lb-fld">
                <span className="lb-fld-label">所要時間</span>
                <div className="lb-seg" role="group" aria-label="所要時間で絞り込む">
                  {timeBuckets.map((bucket) => (
                    <button
                      key={bucket.value}
                      type="button"
                      className={selectedTime === bucket.value ? "is-on" : ""}
                      aria-pressed={selectedTime === bucket.value}
                      onClick={() => setSelectedTime(bucket.value)}
                    >
                      {bucket.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="lb-fld">
                <label htmlFor="lb-keyword-input">キーワード</label>
                <div className={suggestionsOpen && suggestionsAnchor === "section" ? "lb-kw-wrap is-panel-open" : "lb-kw-wrap"}>
                  <div className="lb-in">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <circle cx="11" cy="11" r="6.5" />
                      <path d="M16 16l4.5 4.5" />
                    </svg>
                    <input
                      id="lb-keyword-input"
                      value={searchDraft}
                      onChange={(event) => {
                        setWatchlistOnly(false);
                        setSearchDraft(event.target.value);
                        setSuggestionsOpen(true);
                      }}
                      onFocus={() => {
                        setSuggestionsAnchor("section");
                        setSuggestionsOpen(true);
                      }}
                      onKeyDown={handleSearchKeyDown}
                      placeholder="動画・ジャンル・資格名"
                      autoComplete="off"
                    />
                  </div>
                  <LiveSearchPanel
                    id="search-suggestions-section"
                    query={keyword}
                    total={liveSearchTotal}
                    suggestions={searchSuggestions}
                    activeIndex={activeSuggestionIndex}
                    open={suggestionsOpen && suggestionsAnchor === "section"}
                    recentSearches={recentSearches}
                    genreMatches={genreMatches}
                    keywordMatches={keywordMatches}
                    onSelect={(video) => openVideoPage(video as Video)}
                    onGenreSelect={(genreKey) => {
                      setSuggestionsOpen(false);
                      handleGenreChange(genreKey);
                    }}
                    onKeywordSelect={(term) => {
                      applySearchKeyword(term);
                      setSuggestionsOpen(false);
                    }}
                    onShowAll={() => {
                      saveRecentSearch();
                      scrollToResults();
                    }}
                    onRecentSearchSelect={(term) => {
                      setSearchDraft(term);
                      setKeyword(term);
                      setSuggestionsOpen(true);
                    }}
                    onClose={() => setSuggestionsOpen(false)}
                  />
                </div>
                <small>⌘Kでも検索できます</small>
              </div>
              <button type="button" onClick={resetFilters} className="lb-reset">
                条件リセット
              </button>
            </div>

            <PopularKeywordChips onSelect={applySearchKeyword} />

            <div className="lb-hits">
              <b>
                {filteredVideos.length}
                <small> 件ヒット</small>
              </b>
              <span>
                視聴はYouTubeへのリンクから行います。動画のダウンロード機能はありません。
                {selectedGenreData?.status === "preparing" ? "このジャンルは近日公開です。" : ""}
                {selectedGenreData?.status === "checking" ? "このジャンルは確認中です。" : ""}
                {searchActive ? "全ジャンル横断検索中。ジャンルを選ぶと検索を解除します。" : ""}
              </span>
              <span className="lb-hits-pg">
                {filteredVideos.length}件中 {filteredVideos.length === 0 ? 0 : pageStartIndex + 1}–{Math.min(pageStartIndex + pageVideos.length, filteredVideos.length)}件を表示
              </span>
            </div>
          </div>
          {upcomingGenres.length > 0 ? (
            <p className="upcoming-genre-note">
              順次公開予定: {upcomingGenres.map((genre) => genreName(genre.key)).join(" / ")} は準備中です。
            </p>
          ) : null}
        </div>
      </section>

      <section className="lb-srch-results" aria-label="動画一覧">
        <div className="lb-srch-inner lb-srch-inner-results">
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
            {searchActive ? (
              <div className="search-result-groups">
                {groupedPageVideos.map((group) => (
                  <section key={group.genreKey} className="search-result-group">
                    <h2>{genreLabel(group.genreKey)} <span>{group.items.length}件</span></h2>
                    <div className="lb-res">
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
              <div className="lb-res">
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
        </div>
      </section>

      <section id="roadmap" className="roadmap-section lb-road-sec">
        <div className="roadmap-shell">
          <div className="lb-eh">
            <div className="lb-eh-stack">
              <span className="lb-code">MP-05 · ROADMAP</span>
              <h2>見る順番を、1本の線に。</h2>
            </div>
            <p>段階ごとに駅を進むように。いまいる段階から、次に見る1本が決まります。</p>
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
              <RoadmapTimeline
                roadmap={displayRoadmap}
                watched={watched}
                subMode={subRoadmap !== null}
                guideHref={roadmapGuideLinks[activeRoadmapGenre]?.href}
              />
            </>
          )}
        </div>
      </section>

      {SHOW_TOP_PR_SECTION ? (
        <section id="pr" className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <div className="mb-5">
            <p className="text-sm font-bold text-coral">PR / 広告</p>
            <h2 className="text-2xl font-black text-ink">おすすめ教材・スクール（PR）</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {visiblePrGenres.map((genre) => (
              <PrBlock key={genre.key} genre={genre} />
            ))}
          </div>
        </section>
      ) : null}

      {weeklyPick ? (
        <section className="lb-sec" aria-labelledby="xfer-title">
          <div className="lb-eh">
            <div className="lb-eh-stack">
              <span className="lb-code">MP-06 · TRANSFER</span>
              <h2 id="xfer-title"><span className="bx">見たあとは、<wbr />乗り換えて<wbr />次へ。</span></h2>
            </div>
            <p>動画で学んだ内容を、道具・資格・仕事・企業の情報へつなぎます。</p>
          </div>
          <div className="lb-xfer-grid">
            {(() => {
              const genreKey = weeklyPick.genre;
              const aiLink = (
                (sisterItemLinks as Record<string, { site: string; name: string; url: string }[]>)[weeklyPick.ytid] ?? []
              ).find((link) => link.site === "ai");
              const aiTarget = aiLink ? { name: aiLink.name, url: aiLink.url } : XFER_AI_FALLBACK;
              const licenseTarget = XFER_LICENSE_BY_GENRE[genreKey];
              const careerTarget = XFER_CAREER_BY_GENRE[genreKey];
              const companyTarget = XFER_COMPANY_BY_GENRE[genreKey];
              const politicsTarget = XFER_POLITICS_BY_GENRE[genreKey];
              const bySite = {
                ai: {
                  site: "ai" as const,
                  code: "AI",
                  siteName: "manapick AI",
                  color: "var(--nw-ai)",
                  title: `${aiTarget.name}の料金・無料枠`,
                  desc: "動画で見たツールを、料金と無料枠で比べる",
                  meta: "AI · 道具を選ぶ",
                  url: aiTarget.url,
                  event: "ai_crosslink_click"
                },
                license: licenseTarget
                  ? {
                      site: "license" as const,
                      code: "LI",
                      siteName: "manapick license",
                      color: "var(--nw-li)",
                      title: `${licenseTarget.name}の受験ガイド`,
                      desc: "費用・日程・申込方法を公式情報で確認する",
                      meta: "LICENSE · 証明する",
                      url: licenseTarget.url,
                      event: "license_crosslink_click"
                    }
                  : null,
                career: careerTarget
                  ? {
                      site: "career" as const,
                      code: "CA",
                      siteName: "manapick career",
                      color: "var(--nw-ca)",
                      title: `${careerTarget.name}という仕事`,
                      desc: "学んだ先にある仕事と、必要なスキルを見る",
                      meta: "CAREER · 仕事につなぐ",
                      url: careerTarget.url,
                      event: "career_crosslink_click"
                    }
                  : null,
                company: companyTarget
                  ? {
                      site: "company" as const,
                      code: "CO",
                      siteName: "manapick company",
                      color: "var(--nw-co)",
                      title: `${companyTarget.name}を読む`,
                      desc: "決算と数字で、企業の今を読む",
                      meta: "COMPANY · 企業を読む",
                      url: companyTarget.url,
                      event: "company_crosslink_click"
                    }
                  : null,
                politics: politicsTarget
                  ? {
                      site: "politics" as const,
                      code: "PO",
                      siteName: "manapick politics",
                      color: "var(--nw-po)",
                      title: politicsTarget.name,
                      desc: "法律と制度を、暮らしの言葉で易しく読む",
                      meta: "POLITICS · 政治と法律",
                      url: politicsTarget.url,
                      event: "politics_crosslink_click"
                    }
                  : null
              };
              const order = XFER_ORDER[genreKey] ?? XFER_ORDER_DEFAULT;
              const cards = order.map((site) => bySite[site]).filter((card) => card !== null);
              return cards.map((card) => (
                <a
                  key={card.site}
                  className="lb-xfer"
                  style={{ "--stc": card.color } as CSSProperties}
                  href={card.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => sendGaEvent(card.event, { placement: "xfer", target: card.url })}
                >
                  <span className="nw-stn" style={{ "--stc": card.color } as CSSProperties}>
                    {card.code}
                  </span>
                  <span className="lb-xfer-body">
                    <span className="lb-xfer-k">TRANSFER → {card.siteName}</span>
                    <span className="lb-xfer-title">{card.title}</span>
                    <span className="lb-xfer-desc">{card.desc}</span>
                  </span>
                  <span className="lb-xfer-go">{XFER_CTA[card.site]}</span>
                </a>
              ));
            })()}
          </div>
        </section>
      ) : null}

      {afterContent}

      <MobileBottomNav
        watchlistOnly={watchlistOnly}
        onHome={scrollToTop}
        onExplore={showGenrePicker}
        onWatchlist={() => {
          setWatchlistOnly(true);
          resetPageParam();
          scrollToResults();
        }}
        onMenu={() => setMenuOpen(true)}
      />

      {/* footer is rendered globally via app/layout.tsx (SiteFooter) */}
    </main>
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

function LearningDataSection() {
  // 中央値・平均の定義は lib/site-stats.ts に集約（research ページと定義を一致させる）。
  const durations = videos.map((video) => video.minutes);
  const medianMinutes = medianOf(durations);
  const underThirty = durations.filter((minutes) => minutes <= 30).length;
  const underThirtyPercent = videos.length > 0 ? ((underThirty / videos.length) * 100).toFixed(1) : "0";
  const average = averageScoreOf(videos);
  const averageScore = average !== null ? average.toFixed(1) : "-";

  const medianNeedle = Math.min(100, Math.round((medianMinutes / 60) * 100));
  const scoreNeedle = average !== null ? Math.round((average / 35) * 100) : 0;

  return (
    <section className="lb-sec" aria-labelledby="learning-data-title">
      <div className="lb-eh">
        <div className="lb-eh-stack">
          <span className="lb-code">MP-04 · EVIDENCE</span>
          <h2 id="learning-data-title">{videos.length}本を見て分かった、選びやすい1本の目安</h2>
          <p>掲載動画の実測値を集計し、都合の良い数字だけを切り取らず、対象と限界も公開しています。</p>
        </div>
        <Link className="lb-method" href="/research/youtube-learning-data/">
          集計方法と全データを見る
          <i aria-hidden="true">→</i>
        </Link>
      </div>
      <div className="lb-evi">
        <div>
          <div className="lb-evi-k">再生時間の中央値</div>
          <div className="lb-evi-v">
            {medianMinutes}
            <small>分</small>
          </div>
          <div className="lb-ruler">
            <i style={{ left: `${medianNeedle}%` }} data-l={`${medianMinutes} min`} />
          </div>
          <p className="lb-evi-d">掲載動画の半分は、この長さ以下です。</p>
        </div>
        <div>
          <div className="lb-evi-k">30分以下の割合</div>
          <div className="lb-evi-v">
            {underThirtyPercent}
            <small>%</small>
          </div>
          <div className="lb-ruler">
            <i style={{ left: `${underThirtyPercent}%` }} data-l={`${underThirtyPercent}%`} />
          </div>
          <p className="lb-evi-d">昼休みや通勤のスキマ時間で見終えやすい長さの割合です。</p>
        </div>
        <div>
          <div className="lb-evi-k">平均スコア</div>
          <div className="lb-evi-v">
            {averageScore}
            <small>/35</small>
          </div>
          <div className="lb-ruler">
            <i style={{ left: `${scoreNeedle}%` }} data-l={averageScore} />
          </div>
          <p className="lb-evi-d">7軸×5点で採点。採点方法はすべて公開しています。</p>
        </div>
      </div>
    </section>
  );
}

function MobileBottomNav({
  watchlistOnly,
  onHome,
  onExplore,
  onWatchlist,
  onMenu
}: {
  watchlistOnly: boolean;
  onHome: () => void;
  onExplore: () => void;
  onWatchlist: () => void;
  onMenu: () => void;
}) {
  return (
    <nav className="mobile-bottom-nav" aria-label="クイックナビ">
      <button type="button" onClick={onHome}>
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M4 11l8-7 8 7v9H4z" />
        </svg>
        <span>ホーム</span>
      </button>
      <button type="button" onClick={onExplore}>
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <circle cx="11" cy="11" r="6" />
          <path d="M16 16l4 4" />
        </svg>
        <span>さがす</span>
      </button>
      <button type="button" aria-pressed={watchlistOnly} onClick={onWatchlist}>
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M6 4h12v16l-6-4-6 4z" />
        </svg>
        <span>あとで見る</span>
      </button>
      <TransferNavItem />
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
      label: "YouTubeで視聴・すべて無料",
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
      label: "✓ 採点済 " + confirmedCount + "本",
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
        <svg viewBox="0 0 24 24" aria-hidden="true" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
          <path d="M7 4h10v16l-5-4-5 4z" />
        </svg>
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
            <span className="highlight-title"><VideoTitle video={video} /></span>
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
            <span><SubName sub={sub} /></span>
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
        <h3><a href={videoDetailHref(video)}><VideoTitle video={video} /></a></h3>
        <p>{video.review[0]}</p>
        <div className="featured-video-actions">
          <LikeButton ytid={video.ytid} initialCount={likeCounts[video.ytid] ?? 0} className="is-card-action" />
          <a href={videoDetailHref(video)}>詳細を見る</a>
        </div>
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

function WeeklyPickCard({
  video,
  likeCounts
}: {
  video: Video;
  likeCounts: LikeCounts;
}) {
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
        <h2><a href={videoDetailHref(video)}><VideoTitle video={video} /></a></h2>
        <p>{reviewLine}</p>
        {video.editorNote ? <p className="editor-note">編集メモ: {video.editorNote}</p> : null}
        <div className="weekly-pick-meta">
          <ScoreBadge video={video} compact />
          <span>{video.minutes}分</span>
        </div>
        <LikeButton ytid={video.ytid} initialCount={likeCounts[video.ytid] ?? 0} className="is-card-action" />
        <a
          className="weekly-pick-button"
          href={video.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => sendGaEvent("youtube_click", { video_id: video.ytid, placement: "weekly_pick", genre: video.genre, score_total: video.score ?? 0 })}
        >
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
  const watchlistActive = watchlist?.ready ? watchlist.has(video.ytid) : false;
  const levelClass = video.level === "中級" ? "lb-vc-lv is-mid" : video.level === "上級" ? "lb-vc-lv is-high" : "lb-vc-lv";

  return (
    <article id={video.ytid} className={["lb-vc", highlighted ? "is-search-highlighted" : ""].join(" ")}>
      <div className="lb-vc-th">
        <a href={videoDetailHref(video)} aria-label={video.title + "の詳細ページを開く"} className="lb-vc-thlink">
          <Image
            src={"https://i.ytimg.com/vi/" + video.ytid + "/hqdefault.jpg"}
            alt={thumbnailAlt(video)}
            width={480}
            height={270}
            sizes="(min-width: 880px) 33vw, (min-width: 560px) 50vw, 100vw"
            loading="lazy"
            className="lb-vc-img"
          />
        </a>
        <span className="lb-vc-du">{video.minutes}分</span>
        {watchlist?.ready ? (
          <button
            type="button"
            className={watchlistActive ? "lb-vc-sv is-active" : "lb-vc-sv"}
            aria-pressed={watchlistActive}
            aria-label={watchlistActive ? "あとで見るから解除" : "あとで見るに追加"}
            onClick={() => {
              sendGaEvent("video_save_toggle", { video_id: video.ytid, action: watchlistActive ? "remove" : "add", source: "card" });
              watchlist.toggle(video.ytid);
            }}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M7 4h10v16l-5-4-5 4z" />
            </svg>
          </button>
        ) : null}
      </div>
      <div className="lb-vc-b">
        {video.score !== null && video.score !== undefined ? (
          <div className="lb-vc-sc">
            <b>
              {video.score}
              <small>/35</small>
            </b>
            <a href="/about-score/">運営者が採点済み</a>
          </div>
        ) : (
          <p className="lb-vc-sc-note">{scoreConfirmationText(video)}</p>
        )}
        <div className="lb-vc-tg">
          <span className={levelClass}>
            <i aria-hidden="true" />
            {video.level}
          </span>
          <span className="lb-vc-tl">{video.sub}</span>
          {ageLabel ? <span className="lb-vc-pub">{ageLabel}</span> : null}
        </div>
        <h3>
          <a href={videoDetailHref(video)}><VideoTitle video={video} /></a>
        </h3>
        {channel ? <p className="lb-vc-ch">チャンネル: {channel}</p> : null}
        <ol>
          {video.review.map((line, index) => (
            <li key={`${index}-${line}`}>
              <b>{index + 1}</b>
              <span>{line}</span>
            </li>
          ))}
        </ol>
        {video.tags.length > 0 ? <div className="lb-vc-ht">{video.tags.map((tag) => "#" + tag).join(" ")}</div> : null}
        <div className="lb-vc-ft">
          <LikeButton ytid={video.ytid} initialCount={likeCounts[video.ytid] ?? 0} className="lb-vc-ok" />
          <a
            className="lb-vc-yt"
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => sendGaEvent("youtube_click", { video_id: video.ytid, placement: "video_card", genre: video.genre, score_total: video.score ?? 0 })}
          >
            YouTubeで視聴
          </a>
        </div>
        <a className="lb-vc-detail" href={videoDetailHref(video)}>
          詳細スコアを見る
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

function RoadmapTimeline({ roadmap, watched, subMode = false, guideHref }: { roadmap: Roadmap; watched: LocalListState; subMode?: boolean; guideHref?: string }) {
  const steps = subMode ? (roadmap.steps as DisplayRoadmapStep[]) : buildRoadmapSteps(roadmap);
  const watchedSet = new Set(watched.items);
  // 「現在の駅」は、まだ見終わっていない最初の段階。未読込時は先頭の駅。
  const currentStepIndex = (() => {
    if (!watched.ready) return 0;
    const idx = steps.findIndex((step) => step.videos.some((ytid) => !watchedSet.has(ytid)));
    return idx === -1 ? steps.length - 1 : idx;
  })();
  const totalVideos = steps.reduce((sum, step) => sum + step.videos.length, 0);
  const watchedCount = watched.ready ? steps.reduce((sum, step) => sum + step.videos.filter((ytid) => watchedSet.has(ytid)).length, 0) : 0;
  const progressPercent = totalVideos > 0 ? Math.round((watchedCount / totalVideos) * 100) : 0;

  return (
    <section id="roadmap-panel" className="roadmap-panel" role="tabpanel">
      <div className="lb-rhead">
        <h3>{subMode ? roadmap.title : roadmapTitle(roadmap)}</h3>
        {guideHref ? (
          <a className="lb-read" href={guideHref}>
            文章で読む完全ロードマップ
            <i aria-hidden="true">→</i>
          </a>
        ) : null}
        {watched.ready && totalVideos > 0 ? (
          <div className="lb-prog" aria-label={"ロードマップ進捗 視聴済み " + watchedCount + "/" + totalVideos}>
            <span className="lb-prog-k">
              視聴済み
              <b>
                {watchedCount}/{totalVideos}
              </b>
            </span>
            <span className="lb-prog-bar" aria-hidden="true">
              <i style={{ width: progressPercent + "%" }} />
              <u style={{ left: progressPercent + "%" }} />
            </span>
            <span className="lb-prog-pc">{progressPercent}%</span>
          </div>
        ) : null}
      </div>
      <ol className="roadmap-timeline">
        {steps.map((step, index) => (
          <li
            key={roadmap.genre + "-" + step.label + "-" + index}
            className={[
              step.isPlaceholder ? "roadmap-step is-placeholder" : "roadmap-step",
              index === currentStepIndex ? "is-now" : ""
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <div className="roadmap-node" aria-label={step.label + " " + (step.stage ?? step.level)}>
              {index + 1}
            </div>
            <div className="roadmap-step-card">
              <div className="roadmap-step-meta">
                <span className="roadmap-step-label">{step.label}</span>
              </div>
              <h4 className="roadmap-stage-name">{step.stage ?? step.level}</h4>
              <p className="roadmap-step-goal">{step.goal}</p>
              {watched.ready && step.videos.length > 0 && !step.isPlaceholder ? (
                <p className="lb-sp">
                  視聴済み
                  <span className="lb-sp-mini" aria-hidden="true">
                    <i
                      style={{
                        width: Math.round((step.videos.filter((ytid) => watchedSet.has(ytid)).length / step.videos.length) * 100) + "%"
                      }}
                    />
                  </span>
                  <b>
                    {step.videos.filter((ytid) => watchedSet.has(ytid)).length}/{step.videos.length}
                  </b>
                </p>
              ) : null}
              {step.isPlaceholder ? (
                <p className="roadmap-placeholder-copy">
                  上級動画を選定中です。追加後にここへ公式サムネ付きで表示します。
                </p>
              ) : (
                <div className="roadmap-video-grid">
                  {(subMode ? step.videos : step.videos.slice(0, 2)).map((ytid) => {
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
        <span className="roadmap-mini-title"><VideoTitle video={video} /></span>
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
