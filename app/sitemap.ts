import type { MetadataRoute } from "next";
import { absoluteUrl, videoPath, videos } from "@/lib/manapick";

export const dynamic = "force-static";

const staticRoutes = [
  "/",
  "/about-score/",
  "/operator/",
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
    }))
  ];
}
