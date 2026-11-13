import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import GuidePrCard from "@/components/GuidePrCard";
import AdSlot from "@/components/AdSlot";
import NetworkContextBand from "@/components/NetworkContextBand";
import DurationFilter from "@/components/DurationFilter";
import FoldSection from "@/components/FoldSection";
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

  const subVideos = subPageVideos(key, sub);
  const stats = subStats(subVideos);
  const levelMix = (["初級", "中級", "上級"] as const)
    .map((lv) => ({ lv, n: subVideos.filter((v) => v.level === lv).length }))
    .filter((x) => x.n > 0)
    .map((x) => `${x.lv}${x.n}本`)
    .join("・");
  const title = `${sub}の勉強におすすめ無料YouTube動画${page.count}本｜見る順｜Manapick`;
  const description = `${genreDisplayName(key)}の「${sub}」の無料YouTube学習動画${page.count}本を7軸35点で採点し、見る順に整理。合計${formatTotal(stats.totalMinutes)}、15分以内は${stats.shortCount}本。レベル内訳は${levelMix}。登録不要・全部無料。`;
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
  const stats = subStats(list);
  const firstVideo = list.find((item) => item.ytid === roadmap.steps[0]?.videos[0]) ?? list[0];
  const faqs = buildFaq(sub, isQualificationGenre(key), list, stats, firstVideo);
  const prItems = guidePrLinks[key] ?? [];
  const title = `${sub}の勉強におすすめの無料YouTube動画｜見る順ロードマップ`;
  const description = introText(sub, list.length, stats);
  // dateModified はビルド時刻ではなく、掲載動画の採点確認日の最新値を使う（なければ出さない）。
  const articleModified = stats.latestConfirmed ? `${stats.latestConfirmed}T00:00:00+09:00` : undefined;

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: title,
        description,
        inLanguage: "ja",
        ...(articleModified ? { dateModified: articleModified } : {}),
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
          <p className="section-eyebrow"><span className="eyebrow-chunk">{genreName}</span> / <span className="eyebrow-chunk">無料YouTubeロードマップ</span></p>
          <h1>{title}</h1>
          <p>{description}</p>
          <div className="sub-topic-trust-row" aria-label="ページの信頼情報">
            <span>{list.length}本を掲載</span>
            <span>合計{formatTotal(stats.totalMinutes)}</span>
            <span>15分以内 {stats.shortCount}本</span>
            {stats.latestPublished ? <span>最新 {stats.latestPublished.replace(/-/g, "/")}公開</span> : null}
            <span>7軸35点で採点</span>
          </div>
        </header>

        <NetworkContextBand genreKey={key} sub={sub} pagePath={`/genre/${key}/${sub}/`} />

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
                  <strong>{step.stage}</strong>
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

        <div id="sub-video-list" className="sub-video-list-scope">
        <DurationFilter scopeId="sub-video-list" pagePath={`/genre/${key}/${sub}/`} />
        <FoldSection className="sub-topic-section" titleId="sub-video-list-title" eyebrow="全動画一覧" title={`${sub}の無料YouTube動画一覧（${list.length}本）`} hint="スコア順・タイトルと採点コメント">
          <div className="sub-topic-list">
            {list.map((video) => (
              <Link key={video.ytid} href={videoPath(video.ytid)} className="sub-topic-list-card" data-minutes={video.minutes} data-ytid={video.ytid}>
                <span className="sub-topic-list-title">{video.title}</span>
                <span className="sub-topic-list-meta">{scoreText(video)}・{video.minutes}分</span>
                <span className="sub-topic-list-review">{video.review[0] ?? "学習の入口として確認しやすい動画です。"}</span>
              </Link>
            ))}
          </div>
        </FoldSection>
        </div>

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

type SubStats = {
  totalMinutes: number;
  shortCount: number;
  levels: Record<string, number>;
  latestPublished: string | null;
  sinceLastYear: number;
  channelCount: number;
  latestConfirmed: string | null;
};

// 掲載データだけから数える。publishedAt・scoreConfirmedAt がない動画は鮮度の集計から外す。
function subStats(list: Video[]): SubStats {
  const levels: Record<string, number> = {};
  for (const video of list) levels[video.level] = (levels[video.level] ?? 0) + 1;
  const published = list.map((video) => video.publishedAt?.slice(0, 10)).filter((value): value is string => Boolean(value)).sort();
  const confirmed = list.map((video) => video.scoreConfirmedAt?.slice(0, 10)).filter((value): value is string => Boolean(value)).sort();
  const thisYear = new Date().getFullYear();
  return {
    totalMinutes: list.reduce((sum, video) => sum + (video.minutes || 0), 0),
    shortCount: list.filter((video) => video.minutes > 0 && video.minutes <= 15).length,
    levels,
    latestPublished: published.length ? published[published.length - 1] : null,
    sinceLastYear: published.filter((value) => Number(value.slice(0, 4)) >= thisYear - 1).length,
    channelCount: new Set(list.map((video) => video.channel?.trim()).filter(Boolean)).size,
    latestConfirmed: confirmed.length ? confirmed[confirmed.length - 1] : null
  };
}

function formatTotal(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours === 0) return `約${rest}分`;
  return rest === 0 ? `約${hours}時間` : `約${hours}時間${rest}分`;
}

function levelText(levels: Record<string, number>) {
  return ["初級", "中級", "上級"].filter((level) => levels[level]).map((level) => `${level}${levels[level]}本`).join("・");
}

function introText(sub: string, count: number, stats: SubStats) {
  return `${sub}の無料YouTube学習動画${count}本を7軸35点で採点し、見る順に並べました。合計は${formatTotal(stats.totalMinutes)}で、15分以内で見られる動画は${stats.shortCount}本です。登録不要で、YouTube公式プレーヤーまたはYouTubeで視聴できます。`;
}

function buildFaq(sub: string, qualification: boolean, list: Video[], stats: SubStats, first: Video) {
  const thisYear = new Date().getFullYear();
  const faqs = [
    {
      question: `${sub}の無料YouTube学習動画は何本ありますか？`,
      answer: `Manapickでは${list.length}本を掲載しています（${stats.channelCount}チャンネル）。合計は${formatTotal(stats.totalMinutes)}で、15分以内の動画は${stats.shortCount}本、難易度の内訳は${levelText(stats.levels)}です。`
    },
    {
      question: `${sub}は最初にどの動画を見ればいいですか？`,
      answer: `見る順ロードマップの最初の1本は「${first.title}」（${first.channel?.trim() || "チャンネル名未確認"}・約${first.minutes}分・${scoreText(first)}）です。`
    }
  ];
  if (stats.latestPublished) {
    faqs.push({
      question: `${sub}の動画は新しいものも入っていますか？`,
      answer: `掲載動画で最も新しい公開日は${stats.latestPublished.replace(/-/g, "/")}です。${thisYear - 1}年以降に公開された動画は${stats.sinceLastYear}本あります。`
    });
  }
  faqs.push(
    qualification
      ? {
          question: "無料のYouTube動画だけで足りますか？",
          answer: `Manapickが紹介するのは無料公開のYouTube動画です。試験日・出題範囲・受験料は変わることがあるため、${sub}の公式の試験情報と過去問であわせて確認してください。`
        }
      : {
          question: "無料のYouTube動画だけで足りますか？",
          answer: "Manapickが紹介するのは無料公開のYouTube動画です。手を動かす演習や体系的な教材が必要な場合は、このページの教材・講座（PR）もあわせて比較できます。"
        }
  );
  return faqs;
}
