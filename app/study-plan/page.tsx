import type { Metadata } from "next";
import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
import StudyPlanBuilder, { type StudyPlanGenre, type StudyPlanVideo } from "@/components/StudyPlanBuilder";
import roadmapsData from "@/content/roadmaps.json";
import {
  absoluteUrl,
  genreDisplayName,
  publishedGenreKeys,
  videoPath,
  videos,
  youtubeThumbnail
} from "@/lib/manapick";

type Roadmap = {
  genre: string;
  steps: { videos: string[] }[];
};

const pageTitle = "7日学習プラン｜無料動画を続けられる順番に整理 | Manapick";
const pageDescription = "ジャンル・1日の時間・週の学習日数を選ぶだけ。視聴確認済みの無料YouTube学習動画から、今週の7日学習プランを作れます。登録不要。";
const pageUrl = absoluteUrl("/study-plan/");

const roadmaps = roadmapsData as Roadmap[];
const publishedVideos = videos.filter((video) => publishedGenreKeys.includes(video.genre));

const genreOptions: StudyPlanGenre[] = publishedGenreKeys.map((key) => ({
  key,
  label: genreDisplayName(key),
  count: publishedVideos.filter((video) => video.genre === key).length
}));

const planVideos: StudyPlanVideo[] = publishedGenreKeys.flatMap((genre) => {
  const roadmapIds = roadmaps
    .find((item) => item.genre === genre)
    ?.steps.flatMap((step) => step.videos) ?? [];
  const roadmapIndex = new Map(roadmapIds.map((ytid, index) => [ytid, index]));

  return publishedVideos
    .filter((video) => video.genre === genre)
    .sort((a, b) => {
      const indexA = roadmapIndex.get(a.ytid) ?? 1000;
      const indexB = roadmapIndex.get(b.ytid) ?? 1000;
      return indexA - indexB || (b.score ?? -1) - (a.score ?? -1) || a.minutes - b.minutes;
    })
    .slice(0, 24)
    .map((video, sequence) => ({
      ytid: video.ytid,
      genre: video.genre,
      title: video.title,
      sub: video.sub,
      level: video.level,
      minutes: video.minutes,
      score: video.score,
      detailUrl: videoPath(video.ytid),
      thumbnailUrl: youtubeThumbnail(video.ytid),
      sequence
    }));
});

const faq = [
  {
    question: "この7日プランは無料ですか？",
    answer: "無料です。会員登録も不要で、紹介する動画はYouTube公式動画です。"
  },
  {
    question: "1日15分を超える動画はどう見ればいいですか？",
    answer: "途中で止めて翌日に続きを見て構いません。動画の総尺は選択時の目安として表示しています。"
  },
  {
    question: "どの基準で動画を選んでいますか？",
    answer: "運営者が視聴確認した動画から、ジャンル別ロードマップの順番、Manapickスコア、所要時間を使って選びます。"
  },
  {
    question: "保存したプランは別の端末でも見られますか？",
    answer: "いいえ。ログイン不要のため、保存内容はお使いのブラウザだけに残り、別端末とは共有されません。"
  }
] as const;

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: { canonical: pageUrl },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: pageUrl,
    type: "website",
    images: [absoluteUrl("/brand/ogp-manapick.png")]
  },
  twitter: {
    card: "summary_large_image",
    site: "@manapick_app",
    title: pageTitle,
    description: pageDescription,
    images: [absoluteUrl("/brand/ogp-manapick.png")]
  }
};

export default function StudyPlanPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: "Manapick 7日学習プラン",
        description: pageDescription,
        url: pageUrl,
        applicationCategory: "EducationalApplication",
        operatingSystem: "Web",
        offers: { "@type": "Offer", price: 0, priceCurrency: "JPY" }
      },
      {
        "@type": "HowTo",
        name: "無料動画で7日学習プランを作る手順",
        description: "学ぶ分野、1日に使える時間、週の学習日数を選び、最初の動画から始めます。",
        step: [
          { "@type": "HowToStep", position: 1, name: "ジャンルを選ぶ", text: "今週学びたいジャンルを1つ選びます。" },
          { "@type": "HowToStep", position: 2, name: "時間を選ぶ", text: "1日に使える時間を15分、30分、60分から選びます。" },
          { "@type": "HowToStep", position: 3, name: "学習日数を選ぶ", text: "週3日、5日、7日から無理のない日数を選びます。" },
          { "@type": "HowToStep", position: 4, name: "DAY 1から始める", text: "作成された7日プランの最初の動画を視聴します。" }
        ]
      },
      {
        "@type": "FAQPage",
        mainEntity: faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer }
        }))
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "ホーム", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: "7日学習プラン", item: pageUrl }
        ]
      }
    ]
  };

  return (
    <main className="study-plan-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />
      <header className="knowledge-header">
        <Link href="/" aria-label="Manapick トップへ"><BrandLogo compact /></Link>
        <Link className="knowledge-header-link" href="/start/">今日の1本診断</Link>
      </header>
      <nav className="knowledge-breadcrumb" aria-label="パンくず">
        <Link href="/">ホーム</Link><span aria-hidden="true">›</span><span>7日学習プラン</span>
      </nav>
      <section className="study-plan-hero">
        <p className="section-eyebrow">見るだけで終わらせない</p>
        <h1>無料動画を、今週の予定に変える。</h1>
        <p>
          ジャンル・1日の時間・学習日数を選ぶと、視聴確認済み動画から7日分の順番を作ります。
          過度な連続記録や通知は使わず、休む日も含めて無理なく続けるための道具です。
        </p>
        <div className="study-plan-hero-stats" aria-label="学習プランの特徴">
          <span>登録不要</span><span>全動画を視聴確認</span><span>この端末だけに保存</span>
        </div>
      </section>

      <StudyPlanBuilder genres={genreOptions} videos={planVideos} />

      <section className="study-plan-faq" aria-labelledby="study-plan-faq-title">
        <p className="section-eyebrow">よくある質問</p>
        <h2 id="study-plan-faq-title">プランを始める前に</h2>
        <div>
          {faq.map((item) => (
            <details key={item.question}>
              <summary>{item.question}</summary><p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
