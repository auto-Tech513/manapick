import newsData from "@/content/news.json";

export type NewsSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export type NewsLink = {
  label: string;
  href: string;
  kind: "guide" | "intent" | "video" | "ai" | "career";
};

export type NewsFigureRow = {
  label: string;
  before?: string;
  after?: string;
  value?: string;
};

// 本文中の図表（任意）。数値は記事の facts / 本文で確認済みのものだけを入れ、
// 出典は記事の sourceUrl と同一とする。作れない記事には付けない。
export type NewsFigure = {
  type: "compare" | "limits";
  title: string;
  rows: NewsFigureRow[];
};

export type NewsItem = {
  id: string;
  headline: string;
  description: string;
  category: string;
  categoryLabel: string;
  publishedAt: string;
  lastChecked: string;
  // 内容を実質的に更新した日（任意）。最終確認日とは別で、構造化データの
  // dateModified と OG の modifiedTime はこの値がある場合だけ出す。
  updatedAt?: string;
  sourceName: string;
  sourceUrl: string;
  whyCare: string;
  facts: string[];
  sections: NewsSection[];
  relatedLinks: NewsLink[];
  figure?: NewsFigure;
};

export const newsItems = (newsData as NewsItem[]).slice().sort((a, b) =>
  b.publishedAt.localeCompare(a.publishedAt) || b.id.localeCompare(a.id)
);

export function newsPath(id: string) {
  return `/news/${id}/`;
}

export function relatedNewsItems(item: NewsItem, count = 3): NewsItem[] {
  return newsItems
    .filter((candidate) => candidate.category === item.category && candidate.id !== item.id)
    .slice(0, count);
}

export function findNews(id: string) {
  return newsItems.find((item) => item.id === id);
}

export function newsVisibleText(item: NewsItem) {
  return [
    item.headline,
    item.description,
    item.whyCare,
    ...item.facts,
    ...item.sections.flatMap((section) => [section.heading, ...section.paragraphs, ...(section.bullets ?? [])])
  ].join("");
}

export function newsReadingMinutes(item: NewsItem) {
  return Math.max(4, Math.ceil(newsVisibleText(item).length / 500));
}
