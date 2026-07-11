import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import AdSlot from "@/components/AdSlot";
import BrandLogo from "@/components/BrandLogo";
import {
  absoluteUrl,
  scoreText,
  videoPath,
  youtubeThumbnail,
  type Video
} from "@/lib/manapick";
import {
  findLearningIntent,
  intentVideoSummary,
  learningIntentPath,
  learningIntents,
  learningIntentVideos,
  type LearningIntent
} from "@/lib/learning-intents";

type LearnPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return learningIntents.map((intent) => ({ slug: intent.slug }));
}

export async function generateMetadata({ params }: LearnPageProps): Promise<Metadata> {
  const { slug } = await params;
  const intent = findLearningIntent(slug);
  if (!intent) return {};
  const pageUrl = absoluteUrl(learningIntentPath(intent.slug));

  return {
    title: intent.title,
    description: intent.description,
    alternates: { canonical: pageUrl },
    openGraph: {
      title: intent.title,
      description: intent.description,
      url: pageUrl,
      type: "article",
      images: [absoluteUrl("/brand/ogp-manapick.png")]
    },
    twitter: {
      card: "summary_large_image",
      site: "@manapick_app",
      title: intent.title,
      description: intent.description,
      images: [absoluteUrl("/brand/ogp-manapick.png")]
    }
  };
}

export default async function LearnIntentPage({ params }: LearnPageProps) {
  const { slug } = await params;
  const intent = findLearningIntent(slug);
  if (!intent) notFound();

  const pageUrl = absoluteUrl(learningIntentPath(intent.slug));
  const selectedVideos = learningIntentVideos(intent, 6);
  const structuredData = buildStructuredData(intent, pageUrl, selectedVideos);

  return (
    <main className="knowledge-page learning-intent-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />
      <header className="knowledge-header">
        <Link href="/" aria-label="Manapick トップへ">
          <BrandLogo compact />
        </Link>
        <Link className="knowledge-header-link" href="/learn/">学習テーマ一覧</Link>
      </header>

      <nav className="knowledge-breadcrumb" aria-label="パンくず">
        <Link href="/">ホーム</Link>
        <span aria-hidden="true">›</span>
        <Link href="/learn/">学習テーマ別入口</Link>
        <span aria-hidden="true">›</span>
        <span>{intent.query}</span>
      </nav>

      <section className="knowledge-hero learning-intent-hero">
        <p className="section-eyebrow">検索テーマ: {intent.query}</p>
        <h1>{intent.h1}</h1>
        <p>{intent.lead}</p>
        <div className="learning-intent-meta" aria-label="ページの対象">
          <span>無料YouTube動画</span>
          <span>視聴確認済みから選定</span>
          <span>スマホで15分から</span>
        </div>
        <div className="youtube-learning-cta-row">
          <Link href="#intent-videos-title">おすすめ動画を見る</Link>
          <Link href="/start/">3つの質問で今日の1本</Link>
        </div>
      </section>

      <section className="knowledge-section learning-answer-section" aria-labelledby="intent-answer-title">
        <p className="section-eyebrow">結論</p>
        <h2 id="intent-answer-title">まず何から始める？</h2>
        <p>{intent.answer}</p>
        <p className="learning-audience"><strong>対象：</strong>{intent.audience}</p>
      </section>

      <section className="knowledge-section" aria-labelledby="intent-steps-title">
        <p className="section-eyebrow">見る順</p>
        <h2 id="intent-steps-title">迷わない3ステップ</h2>
        <ol className="learning-step-list">
          {intent.steps.map((step, index) => (
            <li key={step.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <strong>{step.title}</strong>
                <p>{step.body}</p>
                <Link href={step.href}>関連ページへ進む</Link>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <AdSlot slot="1438236565" />

      <section className="knowledge-section" aria-labelledby="intent-videos-title">
        <div className="youtube-section-head">
          <div>
            <p className="section-eyebrow">厳選動画</p>
            <h2 id="intent-videos-title">このテーマでまず見たい無料動画</h2>
          </div>
          <Link href="/ranking/">ランキングも見る</Link>
        </div>
        <div className="learning-intent-video-grid">
          {selectedVideos.map((video, index) => (
            <IntentVideoCard key={video.ytid} video={video} rank={index + 1} />
          ))}
        </div>
      </section>

      <section className="knowledge-section" aria-labelledby="intent-links-title">
        <p className="section-eyebrow">次の入口</p>
        <h2 id="intent-links-title">もっと深く探す</h2>
        <div className="learning-intent-links">
          {intent.links.map((link) => {
            const isExternal = link.href.startsWith("http");
            const content = (
              <>
                <strong>{link.label}</strong>
                <small>{link.note}</small>
              </>
            );

            return isExternal ? (
              <a key={link.href + link.label} href={link.href} target="_blank" rel="noopener noreferrer">
                {content}
              </a>
            ) : (
              <Link key={link.href + link.label} href={link.href}>
                {content}
              </Link>
            );
          })}
        </div>
      </section>

      <section className="knowledge-section" aria-labelledby="intent-faq-title">
        <p className="section-eyebrow">FAQ</p>
        <h2 id="intent-faq-title">{intent.query}のよくある質問</h2>
        <div className="guide-faq-list">
          {intent.faq.map((item) => (
            <details key={item.question}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}

function buildStructuredData(intent: LearningIntent, pageUrl: string, selectedVideos: readonly Video[]) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: intent.title,
        description: intent.description,
        inLanguage: "ja",
        mainEntityOfPage: pageUrl,
        author: { "@id": absoluteUrl("/#organization") },
        publisher: { "@id": absoluteUrl("/#organization") }
      },
      {
        "@type": "FAQPage",
        mainEntity: intent.faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer
          }
        }))
      },
      {
        "@type": "ItemList",
        name: intent.query + "のおすすめ無料動画",
        numberOfItems: selectedVideos.length,
        itemListElement: selectedVideos.map((video, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: video.title,
          url: absoluteUrl(videoPath(video.ytid))
        }))
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "ホーム", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: "学習テーマ別入口", item: absoluteUrl("/learn/") },
          { "@type": "ListItem", position: 3, name: intent.query, item: pageUrl }
        ]
      }
    ]
  };
}

function IntentVideoCard({ video, rank }: { video: Video; rank: number }) {
  return (
    <Link className="learning-intent-video-card" href={videoPath(video.ytid)}>
      <span className="youtube-video-thumb">
        <Image
          src={youtubeThumbnail(video.ytid)}
          alt={video.title + "のサムネイル"}
          width={480}
          height={270}
          sizes="(min-width: 920px) 320px, (min-width: 560px) 46vw, 92vw"
          loading={rank <= 2 ? "eager" : "lazy"}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <span>{rank}</span>
      </span>
      <span className="youtube-video-body">
        <small>{intentVideoSummary(video)}</small>
        <strong>{video.title}</strong>
        <em>{video.review[0] ?? scoreText(video)}</em>
      </span>
    </Link>
  );
}
