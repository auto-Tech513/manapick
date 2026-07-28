import type { MetadataRoute } from "next";
import { guidePath, guides } from "@/lib/guides";
import { learningIntentPath, learningIntents } from "@/lib/learning-intents";
import { absoluteUrl, publishedGenreKeys, videoPath, videos } from "@/lib/manapick";
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

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    ...staticRoutes.map((route) => ({
      url: absoluteUrl(route),
      lastModified: now,
      changeFrequency: route === "/" ? "weekly" as const : "monthly" as const,
      priority: staticPriority(route)
    })),
    ...videos.map((video) => ({
      url: absoluteUrl(videoPath(video.ytid)),
      lastModified: video.publishedAt ? new Date(video.publishedAt) : now,
      changeFrequency: "monthly" as const,
      priority: 0.5
    })),
    ...publishedGenreKeys.map((key) => ({
      url: absoluteUrl(`/genre/${key}/`),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.9
    })),
    ...eligibleSubPages().map((item) => ({
      url: absoluteUrl(eligibleSubPagePath(item)),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.9
    })),
    ...guides.map((guide) => ({
      url: absoluteUrl(guidePath(guide.slug)),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.9
    })),
    ...learningIntents.map((intent) => ({
      url: absoluteUrl(learningIntentPath(intent.slug)),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.82
    })),
    ...newsItems.map((item) => ({
      url: absoluteUrl(newsPath(item.id)),
      lastModified: new Date(item.lastChecked),
      changeFrequency: "monthly" as const,
      priority: 0.78
    }))
  ];
}
