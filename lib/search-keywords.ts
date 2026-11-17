// 検索欄の候補に出す「人気キーワード」。トップの検索（ManapickApp）と、
// メニュー・フッターの検索欄（SiteSearchForm）で同じ候補を出すため、ここを正とする。
export const popularSearchKeywords = [
  "エクセル統計",
  "マーケティング",
  "Python 難しい",
  "Python 入門 本",
  "資産運用",
  "FP3級 過去問",
  "ビジネス会計検定 3級",
  "社労士",
  "Power BI",
  "YouTubeサムネイル",
  "AIプロンプト",
  "Copilot 活用",
  "秘書検定 2級"
];

export const SEARCH_INDEX_PATH = "/video-search-index.json";
export const RECENT_SEARCHES_KEY = "manapick:searches:v1";

// トップの検索と同じ並び順（サブジャンル→題名→タグ→チャンネル→要約の順に関連が高い、同順位はスコア順）。
export type SearchableVideo = {
  ytid: string;
  title: string;
  genre: string;
  sub: string;
  channel: string;
  tags: string[];
  review?: string[];
  minutes: number;
  level: string;
  score: number | null;
};

export function normalizedTerms(query: string) {
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

export function searchRelevance(video: SearchableVideo, query: string) {
  const terms = normalizedTerms(query);
  if (terms.length === 0) return 0;
  if (fieldMatchesTerms(video.sub, terms)) return 0;
  if (fieldMatchesTerms(video.title, terms)) return 1;
  if (fieldMatchesTerms(video.tags.join(" "), terms)) return 2;
  if (fieldMatchesTerms(video.channel, terms)) return 3;
  if (fieldMatchesTerms((video.review ?? []).join(" "), terms)) return 4;
  return 5;
}

export function sortBySearchRelevance<T extends SearchableVideo>(items: T[], query: string) {
  return [...items].sort((a, b) => {
    const relevance = searchRelevance(a, query) - searchRelevance(b, query);
    if (relevance !== 0) return relevance;
    return (b.score ?? -1) - (a.score ?? -1);
  });
}
