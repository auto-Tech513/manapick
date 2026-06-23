import type { Metadata } from "next";
import ManapickApp from "@/components/ManapickApp";
import professionRoutesData from "@/content/professions.json";
import roadmapsData from "@/content/roadmaps.json";
import { absoluteUrl, genreDisplayName, isoDuration, videoPath, videos } from "@/lib/manapick";
import { siteStats } from "@/lib/site-stats";

const homeTitle = "Manapick | 学び直しを、最短ルートに。";
const homeDescription =
  "社会人の学び直しに役立つYouTube学習動画" +
  siteStats.totalVideos +
  "本を、独自3行レビューとロードマップでキュレーションするメディア。";
const homeOgImage = absoluteUrl("/brand/ogp-manapick.png");
const homeFaq = [
  {
    "@type": "Question",
    name: "YouTubeで直接探すのと何が違いますか？",
    acceptedAnswer: {
      "@type": "Answer",
      text: "YouTubeのおすすめは視聴時間を基準に表示されますが、Manapickは学習に役立つかどうかだけを7軸35点満点で採点し、煽り・誇大系の動画は掲載しません。さらに初級→中級→上級のロードマップで見る順番まで設計しているため、次に見る一本を迷わず決められます。"
    }
  }
];
type ProfessionRoute = {
  id: string;
  title: string;
  skill: string;
  relatedText: string;
  href: string;
  guideHref: string;
  destinations: readonly {
    label: string;
    href: string;
    guideHref?: string;
  }[];
};
const professionRoutes = professionRoutesData as readonly ProfessionRoute[];
type RoadmapStep = {
  label: string;
  level: string;
  goal: string;
  videos: string[];
};
type Roadmap = {
  genre: string;
  title: string;
  steps: RoadmapStep[];
};
const roadmaps = roadmapsData as readonly Roadmap[];

function roadmapTotalMinutes(roadmap: Roadmap) {
  return roadmap.steps.reduce((total, step) => {
    return total + step.videos.reduce((stepTotal, ytid) => {
      return stepTotal + (videos.find((video) => video.ytid === ytid)?.minutes ?? 0);
    }, 0);
  }, 0);
}

function roadmapHowToNodes() {
  return roadmaps.map((roadmap) => {
    const genreName = genreDisplayName(roadmap.genre);
    const totalMinutes = roadmapTotalMinutes(roadmap);

    return {
      "@type": "HowTo",
      name: `${roadmap.title}｜${genreName}を学ぶ見る順`,
      description: `${genreName}を初級から順番に進めるためのManapickロードマップです。各ステップで見る動画と到達ゴールを整理しています。`,
      totalTime: totalMinutes > 0 ? isoDuration(totalMinutes) : undefined,
      supply: [
        {
          "@type": "HowToSupply",
          name: "YouTube公式動画"
        }
      ],
      tool: [
        {
          "@type": "HowToTool",
          name: "Manapickロードマップ"
        }
      ],
      step: roadmap.steps.map((step, index) => {
        const stepVideos = step.videos
          .map((ytid) => videos.find((video) => video.ytid === ytid))
          .filter((video): video is (typeof videos)[number] => Boolean(video));

        return {
          "@type": "HowToStep",
          position: index + 1,
          name: `${step.label} ${step.level}: ${step.goal}`,
          text: stepVideos.length > 0
            ? `${step.goal} 視聴する動画: ${stepVideos.map((video) => video.title).join(" / ")}`
            : step.goal,
          url: absoluteUrl(`/#roadmap`)
        };
      })
    };
  });
}

export const metadata: Metadata = {
  title: homeTitle,
  description: homeDescription,
  alternates: {
    canonical: absoluteUrl("/")
  },
  openGraph: {
    title: homeTitle,
    description: homeDescription,
    url: absoluteUrl("/"),
    type: "website",
    images: [
      {
        url: homeOgImage,
        width: 1200,
        height: 630,
        alt: "Manapick - 学び直しを、最短ルートに。"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    site: "@manapick_app",
    title: homeTitle,
    description: homeDescription,
    images: [homeOgImage]
  }
};

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ItemList",
        name: "Manapick 学習動画一覧",
        numberOfItems: siteStats.totalVideos,
        itemListElement: videos.map((video, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: absoluteUrl(videoPath(video.ytid)),
          name: video.title
        }))
      },
      {
        "@type": "ItemList",
        name: "Manapick 職業別の学習入口",
        itemListElement: professionRoutes.map((route, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: absoluteUrl("/#profession-" + route.id),
          name: route.title,
          item: {
            "@type": "DefinedTerm",
            name: route.title,
            description: route.skill + " 関連: " + route.relatedText,
            url: absoluteUrl(route.href),
            subjectOf: route.destinations.map((destination) => ({
              "@type": "CreativeWork",
              name: destination.label,
              url: absoluteUrl(destination.guideHref || destination.href)
            }))
          }
        }))
      },
      {
        "@type": "FAQPage",
        mainEntity: homeFaq
      },
      ...roadmapHowToNodes()
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />
      <ManapickApp />
    </>
  );
}
