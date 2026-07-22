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

export type NewsItem = {
  id: string;
  headline: string;
  description: string;
  category: string;
  categoryLabel: string;
  publishedAt: string;
  lastChecked: string;
  sourceName: string;
  sourceUrl: string;
  whyCare: string;
  facts: string[];
  sections: NewsSection[];
  relatedLinks: NewsLink[];
};

export const newsItems = (newsData as NewsItem[]).slice().sort((a, b) =>
  b.publishedAt.localeCompare(a.publishedAt) || b.id.localeCompare(a.id)
);

export function newsPath(id: string) {
  return `/news/${id}/`;
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
