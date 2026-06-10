import excelDataGuide from "@/content/guides/excel-data";
import englishGuide from "@/content/guides/english";
import videoEditingGuide from "@/content/guides/video-editing";
import generativeAiGuide from "@/content/guides/generative-ai";
import webMarketingGuide from "@/content/guides/web-marketing";
import officeSkillsGuide from "@/content/guides/office-skills";
import pythonGuide from "@/content/guides/python";
import certificationGuide from "@/content/guides/certification";
import bookkeepingGuide from "@/content/guides/bookkeeping";
import moneyBasicsGuide from "@/content/guides/money-basics";
import { videos, type Video } from "@/lib/manapick";

export type Guide = {
  slug: string;
  genre: string;
  title: string;
  description: string;
  publishedAt: string;
  intro: string;
  learnPoints?: readonly string[];
  audience?: string;
  conclusionBullets: readonly {
    label: string;
    text: string;
  }[];
  conclusionClosing: string;
  reasonTitle?: string;
  reasonParagraphs: readonly string[];
  steps: readonly {
    title: string;
    videos: readonly {
      title?: string;
      ytid?: string;
      why: string;
    }[];
  }[];
  stumbleTable?: readonly {
    stumble: string;
    cause: string;
    solution: string;
  }[];
  studyPlans?: readonly {
    label: string;
    pace: string;
    plan: string;
  }[];
  stumblingBlocks: readonly {
    label: string;
    text: string;
  }[];
  faq: readonly {
    question: string;
    answer: string;
  }[];
  relatedLinks: readonly {
    label: string;
    href: string;
  }[];
};
export type GuideStep = Guide["steps"][number];
export type GuideStepVideo = GuideStep["videos"][number];

export const guides: readonly Guide[] = [
  generativeAiGuide,
  pythonGuide,
  videoEditingGuide,
  englishGuide,
  excelDataGuide,
  webMarketingGuide,
  officeSkillsGuide,
  certificationGuide,
  bookkeepingGuide,
  moneyBasicsGuide
];

export function guidePath(slug: string) {
  return "/guide/" + slug + "/";
}

export function findGuide(slug: string) {
  return guides.find((guide) => guide.slug === slug) ?? null;
}

export function findGuideVideo(item: GuideStepVideo): Video {
  if (item.ytid) {
    const videoById = videos.find((candidate) => candidate.ytid === item.ytid);
    if (!videoById) {
      throw new Error("Guide video ytid not found in videos.json: " + item.ytid);
    }
    return videoById;
  }

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
