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
import takkenGuide from "@/content/guides/takken";
import fp3Guide from "@/content/guides/fp3";
import sharoshiGuide from "@/content/guides/sharoshi";
import gyoseishoshiGuide from "@/content/guides/gyoseishoshi";
import kikenbutsuOtsu4Guide from "@/content/guides/kikenbutsu-otsu4";
import toeicGuide from "@/content/guides/toeic";
import gitGithubGuide from "@/content/guides/git-github";
import claudeGuide from "@/content/guides/claude";
import tourokuHanbaishaGuide from "@/content/guides/touroku-hanbaisha";
import itPassportGuide from "@/content/guides/it-passport";
import kaigoFukushishiGuide from "@/content/guides/kaigo-fukushishi";
import sqlGuide from "@/content/guides/sql";
import powerBiGuide from "@/content/guides/power-bi";
import nisaGuide from "@/content/guides/nisa";
import seoGuide from "@/content/guides/seo";
import davinciResolveGuide from "@/content/guides/davinci-resolve";
import geminiGuide from "@/content/guides/gemini";
import premiereProGuide from "@/content/guides/premiere-pro";
import statisticsGuide from "@/content/guides/statistics";
import eikaiwaGuide from "@/content/guides/eikaiwa";
import kakeiGuide from "@/content/guides/kakei";
import instagramGuide from "@/content/guides/instagram";
import excelBasicsGuide from "@/content/guides/excel-basics";
import boki2Guide from "@/content/guides/boki2";
import idecoGuide from "@/content/guides/ideco";
import { videos, type Video } from "@/lib/manapick";

export type Guide = {
  slug: string;
  genre: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
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
  takkenGuide,
  fp3Guide,
  sharoshiGuide,
  gyoseishoshiGuide,
  kikenbutsuOtsu4Guide,
  claudeGuide,
  generativeAiGuide,
  pythonGuide,
  gitGithubGuide,
  videoEditingGuide,
  englishGuide,
  toeicGuide,
  excelDataGuide,
  webMarketingGuide,
  officeSkillsGuide,
  certificationGuide,
  bookkeepingGuide,
  moneyBasicsGuide,
  tourokuHanbaishaGuide,
  itPassportGuide,
  kaigoFukushishiGuide,
  sqlGuide,
  powerBiGuide,
  nisaGuide,
  seoGuide,
  davinciResolveGuide,
  geminiGuide,
  premiereProGuide,
  statisticsGuide,
  eikaiwaGuide,
  kakeiGuide,
  instagramGuide,
  excelBasicsGuide,
  boki2Guide,
  idecoGuide
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
