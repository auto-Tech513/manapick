import generativeAiGuide from "@/content/guides/generative-ai";
import { videos, type Video } from "@/lib/manapick";

export type Guide = typeof generativeAiGuide;
export type GuideStep = Guide["steps"][number];
export type GuideStepVideo = GuideStep["videos"][number];

export const guides = [generativeAiGuide] as Guide[];

export function guidePath(slug: string) {
  return "/guide/" + slug + "/";
}

export function findGuide(slug: string) {
  return guides.find((guide) => guide.slug === slug) ?? null;
}

export function findGuideVideo(item: GuideStepVideo): Video {
  const video = videos.find((candidate) => candidate.title === item.title);
  if (!video) {
    throw new Error("Guide video title not found in videos.json: " + item.title);
  }
  return video;
}

export function guideStepVideos(step: GuideStep) {
  return step.videos.map((item) => ({
    video: findGuideVideo(item),
    why: item.why
  }));
}
