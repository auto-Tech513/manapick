import type { MetadataRoute } from "next";
import { guidePath, guides } from "@/lib/guides";
import {
  learningIntentPath,
  learningIntents,
  learningIntentVideos
} from "@/lib/learning-intents";
import { absoluteUrl, publishedGenreKeys, videoPath, videos, type Video } from "@/lib/manapick";
import { newsItems, newsPath } from "@/lib/news";
import { eligibleSubPagePath, eligibleSubPages } from "@/lib/sub-pages";

export const dynamic = "force-static";

const staticRoutes = [
  "/",
  "/youtube-learning/",
  "/learn/",
  "/guide/",
  "/all/",
  "/start/",
  "/study-plan/",
  "/network/",
  "/ranking/",
  "/new/",
  "/news/",
  "/research/youtube-learning-data/",
  "/faq/",
  "/glossary/",
  "/about-score/",
  "/operator/",
  "/affiliate/",
  "/shop/",
  "/privacy/",
  "/disclaimer/",
  "/contact/"
];

// 事務・法務ページ：必要だが集客価値がなく、1ページ目を占有しつつCTR0%。
// クロール予算を集客ページへ回すため優先度を下げる（noindexはしない）。
const lowPriorityRoutes = new Set<string>([
  "/faq/",
  "/operator/",
  "/contact/",
  "/about-score/",
  "/affiliate/",
  "/privacy/",
  "/disclaimer/"
]);

function staticPriority(route: string): number {
  if (route === "/") return 1;
  if (lowPriorityRoutes.has(route)) return 0.3;
  return 0.6;
}

const PAGE_REVIEW_DATES = new Map<string, string>([
  ["/", "2026-08-05"],
  ["/learn/", "2026-08-05"],
  ["/research/youtube-learning-data/", "2026-11-01"]
]);

function safeDate(value: string | undefined) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

// lastmod は「運営が内容を確認した日」が記録されている場合だけ出す。
// scoreConfirmedAt が無い動画で YouTube 公開日を lastmod にすると、内容の
// 更新日であるかのように誤認されるため省略する（SEO専門家レビュー 2026-11-04）。
function videoModifiedAt(video: Video) {
  return safeDate(video.scoreConfirmedAt);
}

function latestVideoDate(items: readonly Video[]) {
  const timestamps = items
    .map(videoModifiedAt)
    .filter((date): date is Date => date !== null)
    .map((date) => date.getTime());
  return timestamps.length ? new Date(Math.max(...timestamps)) : null;
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...staticRoutes.map((route) => {
      // 確認日が登録されていない静的ページは lastmod を付けない。
      // 無関係な最新日にフォールバックすると全ページが同日に見える。
      const reviewedAt = safeDate(PAGE_REVIEW_DATES.get(route));
      return {
        url: absoluteUrl(route),
        ...(reviewedAt ? { lastModified: reviewedAt } : {}),
        changeFrequency: route === "/" ? "weekly" as const : "monthly" as const,
        priority: staticPriority(route)
      };
    }),
    ...videos.map((video) => ({
      url: absoluteUrl(videoPath(video.ytid)),
      ...(videoModifiedAt(video) ? { lastModified: videoModifiedAt(video)! } : {}),
      changeFrequency: "monthly" as const,
      priority: 0.5
    })),
    ...publishedGenreKeys.map((key) => {
      const modifiedAt = latestVideoDate(videos.filter((video) => video.genre === key));
      return {
        url: absoluteUrl(`/genre/${key}/`),
        ...(modifiedAt ? { lastModified: modifiedAt } : {}),
        changeFrequency: "weekly" as const,
        priority: 0.9
      };
    }),
    ...eligibleSubPages().map((item) => {
      const modifiedAt = latestVideoDate(
        videos.filter((video) => video.genre === item.key && video.sub === item.sub)
      );
      return {
        url: absoluteUrl(eligibleSubPagePath(item)),
        ...(modifiedAt ? { lastModified: modifiedAt } : {}),
        changeFrequency: "weekly" as const,
        priority: 0.9
      };
    }),
    ...guides.map((guide) => ({
      url: absoluteUrl(guidePath(guide.slug)),
      lastModified: new Date(guide.updatedAt ?? guide.publishedAt),
      changeFrequency: "weekly" as const,
      priority: 0.9
    })),
    ...learningIntents.map((intent) => {
      const modifiedAt = safeDate(intent.lastReviewed) ?? latestVideoDate(learningIntentVideos(intent));
      return {
        url: absoluteUrl(learningIntentPath(intent.slug)),
        ...(modifiedAt ? { lastModified: modifiedAt } : {}),
        changeFrequency: "weekly" as const,
        priority: 0.82
      };
    }),
    ...newsItems.map((item) => ({
      url: absoluteUrl(newsPath(item.id)),
      lastModified: new Date(item.lastChecked),
      changeFrequency: "monthly" as const,
      priority: 0.78
    }))
  ];
}
