import type { MetadataRoute } from "next";
import { guidePath, guides } from "@/lib/guides";
import { learningIntentPath, learningIntents } from "@/lib/learning-intents";
import { absoluteUrl, publishedGenreKeys, videoPath, videos } from "@/lib/manapick";
import { eligibleSubPagePath, eligibleSubPages } from "@/lib/sub-pages";

export const dynamic = "force-static";

const staticRoutes = [
  "/",
  "/youtube-learning/",
  "/learn/",
  "/all/",
  "/start/",
  "/ranking/",
  "/new/",
  "/faq/",
  "/glossary/",
  "/about-score/",
  "/operator/",
  "/affiliate/",
  "/privacy/",
  "/disclaimer/",
  "/contact/"
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    ...staticRoutes.map((route) => ({
      url: absoluteUrl(route),
      lastModified: now,
      changeFrequency: route === "/" ? "weekly" as const : "monthly" as const,
      priority: route === "/" ? 1 : 0.6
    })),
    ...videos.map((video) => ({
      url: absoluteUrl(videoPath(video.ytid)),
      lastModified: video.publishedAt ? new Date(video.publishedAt) : now,
      changeFrequency: "monthly" as const,
      priority: 0.8
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
      priority: 0.8
    })),
    ...guides.map((guide) => ({
      url: absoluteUrl(guidePath(guide.slug)),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.85
    })),
    ...learningIntents.map((intent) => ({
      url: absoluteUrl(learningIntentPath(intent.slug)),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.82
    }))
  ];
}
