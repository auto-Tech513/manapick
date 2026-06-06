import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import BrandLogo from "@/components/BrandLogo";
import { findGuide, guidePath, guides, guideStepVideos } from "@/lib/guides";
import {
  absoluteUrl,
  genreDisplayName,
  genreLabel,
  scoreStatus,
  scoreText,
  videoPath,
  youtubeThumbnail,
  type Video
} from "@/lib/manapick";

type GuidePageProps = {
  params: Promise<{ slug: string }>;
};

const buildDate = new Date();
const buildDateIso = buildDate.toISOString();
const guideOgImage = absoluteUrl("/brand/ogp-manapick.png");

export const dynamicParams = false;

export function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = findGuide(slug);
  if (!guide) return {};

  const pageUrl = absoluteUrl(guidePath(guide.slug));

  return {
    title: guide.title,
    description: guide.description,
    alternates: {
      canonical: pageUrl
    },
    openGraph: {
      title: guide.title,
      description: guide.description,
      url: pageUrl,
      type: "article",
      publishedTime: guide.publishedAt,
      modifiedTime: buildDateIso,
      images: [
        {
          url: guideOgImage,
          width: 1200,
          height: 630,
          alt: "Manapick - 学び直しを、最短ルートに。"
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: guide.title,
      description: guide.description,
      images: [guideOgImage]
    }
  };
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { slug } = await params;
  const guide = findGuide(slug);
  if (!guide) notFound();

  const pageUrl = absoluteUrl(guidePath(guide.slug));
  const totalVideos = guide.steps.reduce((sum, step) => sum + step.videos.length, 0);
  const totalMinutes = guide.steps.reduce((sum, step) => {
    return sum + guideStepVideos(step).reduce((stepSum, item) => stepSum + item.video.minutes, 0);
  }, 0);

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: guide.title,
        description: guide.description,
        datePublished: guide.publishedAt,
        dateModified: buildDateIso,
        inLanguage: "ja",
        mainEntityOfPage: pageUrl,
        image: guideOgImage,
        author: {
          "@id": absoluteUrl("/#organization")
        },
        publisher: {
          "@id": absoluteUrl("/#organization")
        }
      },
      {
        "@type": "FAQPage",
        mainEntity: guide.faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer
          }
        }))
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "ホーム",
            item: absoluteUrl("/")
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "ガイド",
            item: pageUrl
          },
          {
            "@type": "ListItem",
            position: 3,
            name: guide.title,
            item: pageUrl
          }
        ]
      }
    ]
  };

  return (
    <main className="guide-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />
      <header className="guide-page-header">
        <a href="/" aria-label="Manapick トップへ">
          <BrandLogo compact />
        </a>
        <a className="guide-header-link" href="/about-score/">採点方法</a>
      </header>

      <nav className="guide-breadcrumb" aria-label="パンくず">
        <a href="/">ホーム</a>
        <span aria-hidden="true">/</span>
        <span>ガイド</span>
        <span aria-hidden="true">/</span>
        <span>{guide.title}</span>
      </nav>

      <article className="guide-article">
        <header className="guide-hero">
          <p className="section-eyebrow">{genreDisplayName(guide.genre)}ロードマップ</p>
          <h1>{guide.title}</h1>
          <p>{strongText(guide.intro)}</p>
          <div className="guide-trust-row" aria-label="記事の信頼情報">
            <span>最終更新日: {formatDate(buildDate)}</span>
            <a href="/about-score/">採点方法を見る</a>
            <span>情報商材誘導・誇大表現の動画は除外</span>
          </div>
        </header>

        <section className="guide-section" aria-labelledby="guide-conclusion-title">
          <h2 id="guide-conclusion-title">[1] 結論：この順番で見れば最短です</h2>
          <p>{strongText(guide.intro)}</p>
          <ul className="guide-step-summary">
            {guide.conclusionBullets.map((item) => (
              <li key={item.label}>
                <strong>{item.label}</strong>
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
          <p>{guide.conclusionClosing.replace("合計6本・約4時間ぶん", "合計" + totalVideos + "本・約" + Math.round(totalMinutes / 60) + "時間ぶん")}</p>
        </section>

        <section className="guide-section" aria-labelledby="guide-reason-title">
          <h2 id="guide-reason-title">[2] なぜこの順番か（多くの人がつまずく理由）</h2>
          {guide.reasonParagraphs.map((paragraph) => (
            <p key={paragraph}>{strongText(paragraph)}</p>
          ))}
        </section>

        <section className="guide-section" aria-labelledby="guide-videos-title">
          <h2 id="guide-videos-title">[3] 各STEPの厳選動画</h2>
          <p>カードは videos.json から自動描画しています。</p>
          <div className="guide-step-list">
            {guide.steps.map((step) => {
              const items = guideStepVideos(step);
              const stepMinutes = items.reduce((sum, item) => sum + item.video.minutes, 0);

              return (
                <section key={step.title} className="guide-step-block">
                  <div className="guide-step-heading">
                    <h3>{step.title}</h3>
                    <span>{items.length}本・約{stepMinutes}分</span>
                  </div>
                  <div className="guide-video-grid">
                    {items.map((item) => (
                      <GuideVideoCard key={item.video.ytid} video={item.video} why={item.why} />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </section>

        <section className="guide-section" aria-labelledby="guide-next-title">
          <h2 id="guide-next-title">[4] よくあるつまずきと次の一歩</h2>
          <ul className="guide-advice-list">
            {guide.stumblingBlocks.map((item) => (
              <li key={item.label}>
                <strong>{item.label}</strong>
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="guide-section" aria-labelledby="guide-faq-title">
          <h2 id="guide-faq-title">[5] FAQ</h2>
          <div className="guide-faq-list">
            {guide.faq.map((item) => (
              <details key={item.question}>
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="guide-section guide-section-muted" aria-labelledby="guide-trust-title">
          <h2 id="guide-trust-title">[6] 信頼ブロック</h2>
          <p>
            最終更新日（ビルド日時）を表示し、採点方法ページへの導線を置いています。
            Manapickでは、情報商材誘導・誇大表現の動画は除外します。
          </p>
        </section>

        <section className="guide-section guide-section-muted" aria-labelledby="guide-cta-title">
          <h2 id="guide-cta-title">[7] CTA・内部リンク</h2>
          <div className="guide-cta-row">
            <a href="/#roadmap">関連：プログラミングロードマップ／データ分析ロードマップ</a>
            <a href="/#genre-picker">8ジャンルの地図を見る</a>
          </div>
        </section>
      </article>
    </main>
  );
}

function GuideVideoCard({ video, why }: { video: Video; why: string }) {
  return (
    <article className="guide-video-card">
      <a className="guide-video-thumb" href={videoPath(video.ytid)} aria-label={video.title + "の詳細ページを開く"}>
        <Image
          src={youtubeThumbnail(video.ytid)}
          alt={video.title + "のサムネイル"}
          width={480}
          height={270}
          sizes="(min-width: 900px) 300px, (min-width: 560px) 44vw, 92vw"
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <span className="video-duration-badge">{video.minutes}分</span>
      </a>
      <div className="guide-video-body">
        <div className="guide-video-meta">
          <GuideLevelBadge level={video.level} />
          <span>{genreLabel(video.genre)}</span>
          <a className={guideScoreClass(video)} href="/about-score/" aria-label={scoreText(video) + "。採点方法を開く"}>
            <span>{scoreText(video)}</span>
            <span className={`score-badge-status is-${scoreStatus(video)}`}>
              {scoreStatus(video) === "confirmed" ? "✓確認済" : "暫定"}
            </span>
          </a>
        </div>
        <h4>
          <a href={videoPath(video.ytid)}>{video.title}</a>
        </h4>
        <p className="guide-video-why">
          <strong>なぜ選んだか：</strong>{why}
        </p>
        <a className="guide-detail-link" href={videoPath(video.ytid)}>詳細ページへ</a>
      </div>
    </article>
  );
}

function GuideLevelBadge({ level }: { level: Video["level"] }) {
  const meta = {
    初級: { icon: "●", className: "is-beginner" },
    中級: { icon: "▲", className: "is-intermediate" },
    上級: { icon: "★", className: "is-advanced" }
  }[level];

  return (
    <span className={["level-badge", meta.className].join(" ")}>
      <span aria-hidden="true">{meta.icon}</span>
      <span>{level}</span>
    </span>
  );
}

function guideScoreClass(video: Video) {
  if (scoreStatus(video) === "provisional") return "score-badge is-provisional is-compact";
  if (video.score === null) return "score-badge is-empty is-compact";
  if (video.score >= 28) return "score-badge is-confirmed is-high is-compact";
  if (video.score >= 20) return "score-badge is-confirmed is-mid is-compact";
  return "score-badge is-confirmed is-low is-compact";
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(date);
}

function strongText(text: string) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, index) => (index % 2 === 1 ? <strong key={part}>{part}</strong> : part));
}
