import type { Metadata } from "next";
import ManapickApp from "@/components/ManapickApp";
import LatestNewsBand from "@/components/LatestNewsBand";
import professionRoutesData from "@/content/professions.json";
import roadmapsData from "@/content/roadmaps.json";
import { absoluteUrl, genreDisplayName, isoDuration, videoPath, videos } from "@/lib/manapick";
import { rankedVideos } from "@/lib/rankings";
import { siteStats } from "@/lib/site-stats";

const homeTitle = "Manapick | 無料YouTube学習動画を、見る順まで整理";
const homeDescription =
  "社会人の学び直し・リスキリングに役立つ無料YouTube学習動画" +
  siteStats.totalVideos +
  "本を、視聴確認済みレビューとロードマップで整理するメディア。";
const homeOgImage = absoluteUrl("/brand/ogp-manapick.png");
const homeCarouselVideos = [
  ...rankedVideos("popular", 4),
  ...rankedVideos("new", 4),
  ...rankedVideos("score", 4)
];
const homeFaq = [
  {
    "@type": "Question",
    name: "YouTubeで直接探すのと何が違いますか？",
    acceptedAnswer: {
      "@type": "Answer",
      text: "YouTubeのおすすめは視聴時間を基準に表示されますが、Manapickは学習に役立つかどうかだけを7軸35点満点で採点し、煽り・誇大系の動画は掲載しません。さらに初級→中級→上級のロードマップで見る順番まで設計しているため、次に見る一本を迷わず決められます。"
    }
  },
  {
    "@type": "Question",
    name: "リスキリングは何から始めるのがおすすめですか？",
    acceptedAnswer: {
      "@type": "Answer",
      text: "まずは目的を1つに絞り、15〜30分で見られる初級動画から始めるのがおすすめです。迷う場合は今日の1本診断、職業別の入口、ジャンル別ロードマップから選べます。"
    }
  },
  {
    "@type": "Question",
    name: "無料の学習動画だけで始められますか？",
    acceptedAnswer: {
      "@type": "Answer",
      text: "はい。Manapickで紹介する動画はYouTube公式動画で、会員登録なしで視聴できます。必要になった段階で書籍や講座を補助教材として検討できます。"
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
  careerLinks: readonly {
    label: string;
    href: string;
  }[];
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
        name: "Manapick 注目の12本",
        numberOfItems: homeCarouselVideos.length,
        itemListElement: homeCarouselVideos.map((video, index) => ({
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
            sameAs: route.careerLinks.map((careerLink) => careerLink.href),
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
      ...roadmapHowToNodes().slice(0, 1)
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />
      <ManapickApp referenceTime={Date.now()} />
      <LatestNewsBand />
      <section className="home-faq-section" aria-labelledby="home-faq-title">
        <div className="home-faq-heading">
          <p className="section-eyebrow">初めての方へ</p>
          <h2 id="home-faq-title" className="section-title">Manapickのよくある質問</h2>
          <p>無料動画の選び方と、学び始める順番を短くまとめました。</p>
        </div>
        <div className="guide-faq-list">
          {homeFaq.map((item) => (
            <details key={item.name}>
              <summary>{item.name}</summary>
              <p>{item.acceptedAnswer.text}</p>
            </details>
          ))}
        </div>
        <div className="home-faq-links">
          <a href="/faq/">FAQをすべて見る</a>
          <a href="/start/">3つの質問で今日の1本を選ぶ</a>
        </div>
      </section>
    </>
  );
}
