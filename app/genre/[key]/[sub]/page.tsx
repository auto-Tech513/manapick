import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import GuidePrCard from "@/components/GuidePrCard";
import AdSlot from "@/components/AdSlot";
import prLinksData from "@/content/pr-links.json";
import { guidePath, guides } from "@/lib/guides";
import {
  absoluteUrl,
  genreDisplayName,
  scoreText,
  subGenrePath,
  videoPath,
  videos,
  youtubeThumbnail,
  type Video
} from "@/lib/manapick";
import { buildSubRoadmap } from "@/lib/sub-roadmap";
import type { GuidePrLink } from "@/lib/pr-links";
import {
  eligibleSubPagePath,
  eligibleSubPages,
  eligibleSubPagesForGenre,
  findEligibleSubPage,
  subPageVideos
} from "@/lib/sub-pages";

type SubGenrePageProps = {
  params: Promise<{ key: string; sub: string }>;
};

const guidePrLinks = prLinksData as Record<string, GuidePrLink[]>;
const ogImage = absoluteUrl("/brand/ogp-manapick.png");

export const dynamicParams = false;

export function generateStaticParams() {
  return eligibleSubPages().map((item) => ({ key: item.key, sub: item.sub }));
}

export async function generateMetadata({ params }: SubGenrePageProps): Promise<Metadata> {
  const { key, sub: rawSub } = await params;
  const sub = decodeSubParam(rawSub);
  const page = findEligibleSubPage(key, sub);
  if (!page) return {};

  const title = `${sub}の勉強におすすめ無料YouTube動画${page.count}本｜見る順｜Manapick`;
  const description = `${sub}の独学に役立つ無料YouTube動画を7軸35点で採点し、見る順（ロードマップ）に整理。登録不要・全部無料。`;
  const url = absoluteUrl(subGenrePath(key, sub));

  return {
    title,
    description,
    alternates: {
      canonical: url
    },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      images: [ogImage]
    },
    twitter: {
      card: "summary_large_image",
      site: "@manapick_app",
      title,
      description,
      images: [ogImage]
    }
  };
}

export default async function SubGenrePage({ params }: SubGenrePageProps) {
  const { key, sub: rawSub } = await params;
  const sub = decodeSubParam(rawSub);
  const page = findEligibleSubPage(key, sub);
  if (!page) notFound();

  const list = subPageVideos(key, sub);
  if (list.length < 3) notFound();

  const genreName = genreDisplayName(key);
  const pageUrl = absoluteUrl(subGenrePath(key, sub));
  const roadmap = buildSubRoadmap(videos, key, sub);
  if (!roadmap) notFound();

  const guide = guides.find((item) => item.genre === key);
  const relatedPages = eligibleSubPagesForGenre(key).filter((item) => item.sub !== sub);
  const faqs = buildFaq(sub, isQualificationGenre(key));
  const prItems = guidePrLinks[key] ?? [];
  const title = `${sub}の勉強におすすめの無料YouTube動画｜見る順ロードマップ`;
  const description = introText(sub, key);
  const articleModified = new Date().toISOString();

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: title,
        description,
        inLanguage: "ja",
        dateModified: articleModified,
        mainEntityOfPage: pageUrl,
        image: ogImage,
        author: {
          "@id": absoluteUrl("/#organization")
        },
        publisher: {
          "@id": absoluteUrl("/#organization")
        }
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((item) => ({
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
            name: genreName,
            item: absoluteUrl(`/genre/${key}/`)
          },
          {
            "@type": "ListItem",
            position: 3,
            name: sub,
            item: pageUrl
          }
        ]
      },
      {
        "@type": "ItemList",
        name: `${sub}の無料YouTube動画一覧`,
        numberOfItems: list.length,
        itemListElement: list.map((video, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: absoluteUrl(videoPath(video.ytid)),
          name: video.title
        }))
      }
    ]
  };

  return (
    <main className="sub-topic-page">
      <nav className="genre-hub-crumb" aria-label="パンくず">
        <Link href="/">ホーム</Link>
        <span aria-hidden="true">›</span>
        <Link href={`/genre/${key}/`}>{genreName}</Link>
        <span aria-hidden="true">›</span>
        <span>{sub}</span>
      </nav>

      <article className="sub-topic-article">
        <header className="sub-topic-hero">
          <p className="section-eyebrow">{genreName} / 無料YouTubeロードマップ</p>
          <h1>{title}</h1>
          <p>{description}</p>
          <div className="sub-topic-trust-row" aria-label="ページの信頼情報">
            <span>{list.length}本を掲載</span>
            <span>7軸35点で採点</span>
            <span>登録不要・全部無料</span>
          </div>
        </header>

        <section className="sub-topic-section" aria-labelledby="sub-roadmap-title">
          <div className="sub-topic-heading">
            <p className="section-eyebrow">見る順ロードマップ</p>
            <h2 id="sub-roadmap-title">{roadmap.title}</h2>
          </div>
          <div className="sub-topic-roadmap">
            {roadmap.steps.map((step, index) => (
              <section key={step.label + step.level} className="sub-topic-step">
                <div className="sub-topic-step-head">
                  <span>{step.label}</span>
                  <strong>{step.level}</strong>
                </div>
                <h3>{step.goal}</h3>
                <div className="sub-topic-step-videos">
                  {step.videos.map((ytid) => {
                    const video = list.find((item) => item.ytid === ytid);
                    return video ? <SubTopicVideoCard key={ytid} video={video} priority={index === 0} /> : null;
                  })}
                </div>
              </section>
            ))}
          </div>
        </section>

        <section className="sub-topic-section" aria-labelledby="sub-video-list-title">
          <div className="sub-topic-heading">
            <p className="section-eyebrow">全動画一覧</p>
            <h2 id="sub-video-list-title">{sub}の無料YouTube動画一覧（{list.length}本）</h2>
          </div>
          <div className="sub-topic-list">
            {list.map((video) => (
              <Link key={video.ytid} href={videoPath(video.ytid)} className="sub-topic-list-card">
                <span className="sub-topic-list-title">{video.title}</span>
                <span className="sub-topic-list-meta">{scoreText(video)}・{video.minutes}分</span>
                <span className="sub-topic-list-review">{video.review[0] ?? "学習の入口として確認しやすい動画です。"}</span>
              </Link>
            ))}
          </div>
        </section>

        <AdSlot slot="1438236565" />
        <section className="sub-topic-section" aria-labelledby="sub-faq-title">
          <div className="sub-topic-heading">
            <p className="section-eyebrow">FAQ</p>
            <h2 id="sub-faq-title">{sub}の独学でよくある質問</h2>
          </div>
          <div className="guide-faq-list">
            {faqs.map((item) => (
              <details key={item.question}>
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        {prItems.length > 0 ? <SubTopicPrSection items={prItems} genreName={genreName} /> : null}

        <section className="sub-topic-section sub-topic-related" aria-labelledby="sub-related-title">
          <div className="sub-topic-heading">
            <p className="section-eyebrow">関連リンク</p>
            <h2 id="sub-related-title">次に見るページ</h2>
          </div>
          <div className="sub-topic-related-links">
            {relatedPages.map((item) => (
              <Link key={item.key + item.sub} href={eligibleSubPagePath(item)}>
                {item.sub}（{item.count}本）
              </Link>
            ))}
            <Link href={`/genre/${key}/`}>{genreName}の動画一覧へ</Link>
            {guide ? <Link href={guidePath(guide.slug)}>{genreName}ロードマップを読む</Link> : null}
          </div>
        </section>
      </article>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />
    </main>
  );
}

function SubTopicVideoCard({ video, priority }: { video: Video; priority?: boolean }) {
  return (
    <Link href={videoPath(video.ytid)} className="sub-topic-video-card">
      <span className="sub-topic-video-thumb">
        <Image
          src={youtubeThumbnail(video.ytid)}
          alt={video.title + "のサムネイル"}
          width={480}
          height={270}
          sizes="(min-width: 900px) 260px, (min-width: 560px) 42vw, 88vw"
          priority={priority}
        />
      </span>
      <span className="sub-topic-video-body">
        <strong>{video.title}</strong>
        <span>{scoreText(video)}・{video.minutes}分</span>
        <em>{video.review[0] ?? "学習の入口として確認しやすい動画です。"}</em>
      </span>
    </Link>
  );
}

function SubTopicPrSection({ items, genreName }: { items: GuidePrLink[]; genreName: string }) {
  return (
    <section className="sub-topic-section guide-pr-section" aria-labelledby="sub-pr-title">
      <div className="guide-pr-heading">
        <div>
          <p className="section-eyebrow">【PR】広告</p>
          <h2 id="sub-pr-title">{genreName}の学習にあわせて使いたい教材・講座(PR)</h2>
          <p className="guide-pr-disclosure">本ページにはアフィリエイト広告（PR）を含みます。</p>
        </div>
        <span className="guide-pr-badge">PR</span>
      </div>
      <div className="guide-pr-grid">
        {items.map((item) => (
          <GuidePrCard key={item.url} genre={genreName} item={item} placement="sub-topic" />
        ))}
      </div>
    </section>
  );
}

function decodeSubParam(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function isQualificationGenre(key: string) {
  return key === "shikaku" || key === "kaikei";
}

function introText(sub: string, key: string) {
  if (isQualificationGenre(key)) {
    return `${sub}の独学は、何から見るかを決めるだけで一気に進みます。Manapickは${sub}の学習動画を7軸35点で採点し、まず見るべき1本から順に並べました。スクールに通う前に、無料のYouTube動画で全体像と頻出ポイントをつかむのが近道です。忙しい社会人でも、通勤前後の短時間で進めやすい順番です。登録不要・全部無料。`;
  }

  return `${sub}の学び直しは、最初に見る順番を決めると迷いにくくなります。Manapickは${sub}の学習動画を7軸35点で採点し、まず見るべき1本から順に整理しました。無料のYouTube動画で全体像と実践ポイントをつかみ、必要に応じて教材や講座を足せます。忙しい日でも、15〜30分ずつ積み上げやすい流れです。登録不要・全部無料。`;
}

function buildFaq(sub: string, qualification: boolean) {
  if (qualification) {
    return [
      {
        question: `${sub}は独学で合格できますか？`,
        answer: "可能です。まず無料動画で全体像→頻出分野→過去問の順に進めるのが定石です。"
      },
      {
        question: "無料のYouTube動画だけで足りますか？",
        answer: "入門〜基礎は十分です。直前期は問題演習や有料講座の併用が安心です。"
      },
      {
        question: "どれくらいの期間が必要ですか？",
        answer: `${sub}の難易度により数週間〜数か月です。毎日の短時間視聴と過去問を組み合わせるのが近道です。`
      }
    ];
  }

  return [
    {
      question: `${sub}は独学で身につけられますか？`,
      answer: "可能です。まず無料動画で全体像をつかみ、基礎を固めてから小さく実践する順番がおすすめです。"
    },
    {
      question: "無料のYouTube動画だけで足りますか？",
      answer: "入門〜基礎の理解には十分です。仕事で使う段階では、演習教材や講座を足すと手を動かす量を増やせます。"
    },
    {
      question: "どれくらいの期間が必要ですか？",
      answer: `${sub}の範囲や目標によりますが、毎日15〜30分の視聴と復習を続けると数週間で入口をつかめます。`
    }
  ];
}
