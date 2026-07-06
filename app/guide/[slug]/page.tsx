import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import BrandLogo from "@/components/BrandLogo";
import GuidePrCard from "@/components/GuidePrCard";
import prLinksData from "@/content/pr-links.json";
import { MANAPICK_AI_URL } from "@/lib/brand-links";
import { findGuide, guidePath, guides, guideStepVideos, type Guide } from "@/lib/guides";
import {
  absoluteUrl,
  genreDisplayName,
  genreLabel,
  scoreText,
  videoPath,
  youtubeThumbnail,
  type Video
} from "@/lib/manapick";
import type { GuidePrLink } from "@/lib/pr-links";
import { siteStats } from "@/lib/site-stats";
import AdSlot from "@/components/AdSlot";

type GuidePageProps = {
  params: Promise<{ slug: string }>;
};

const buildDate = new Date();
const buildDateIso = buildDate.toISOString();
const guideOgImage = absoluteUrl("/brand/ogp-manapick.png");
const guideIconSources: Record<string, string> = {
  ai: "/brand/icon-ai.png",
  prog: "/brand/icon-prog.png",
  video: "/brand/icon-video.png",
  english: "/brand/icon-english.png",
  data: "/brand/icon-data.png",
  marke: "/brand/icon-marke.png",
  biz: "/brand/icon-biz.png",
  shikaku: "/brand/icon-shikaku.png",
  kaikei: "/brand/icon-kaikei.png",
  money: "/brand/icon-money.png"
};
const guidePrLinks = prLinksData as Record<string, GuidePrLink[]>;

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
      site: "@manapick_app",
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
  const readingMinutes = guideReadingMinutes(guide);
  const learnPoints = guideLearnPoints(guide);
  const stumbleRows = guideStumbleRows(guide);
  const studyPlans = guideStudyPlans(guide, totalMinutes);
  const relatedLinks = guideRelatedLinks(guide);
  const directAnswer = guideDirectAnswer(guide, totalVideos, totalMinutes);
  const quickFaq = guide.faq.slice(0, 4);
  const remainingFaq = guide.faq.slice(4);

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
        "@type": "HowTo",
        name: guide.title,
        description: guide.intro.replace(/\*\*/g, ""),
        step: guide.steps.map((step, index) => ({
          "@type": "HowToStep",
          position: index + 1,
          name: step.title,
          text: step.videos.map((item) => item.why).join(" / "),
          url: absoluteUrl(guidePath(guide.slug)) + `#step-${index + 1}`
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
      <div className="guide-progress" aria-hidden="true" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />
      <header className="guide-page-header">
        <Link href="/" aria-label="Manapick トップへ">
          <BrandLogo compact />
        </Link>
        <Link className="guide-header-link" href="/about-score/">採点方法</Link>
      </header>

      <nav className="guide-breadcrumb" aria-label="パンくず">
        <Link href="/">ホーム</Link>
        <span aria-hidden="true">/</span>
        <span>ガイド</span>
        <span aria-hidden="true">/</span>
        <span>{guide.title}</span>
      </nav>

      <article className="guide-article">
        <header className="guide-hero">
          <GuideGenreIcon genre={guide.genre} className="guide-hero-icon" />
          <p className="section-eyebrow">{genreDisplayName(guide.genre)}ロードマップ</p>
          <h1>{guideTitle(guide.title)}</h1>
          <p>{strongText(guide.intro)}</p>
          <div className="guide-trust-row" aria-label="記事の信頼情報">
            <span>最終更新日: {formatDate(buildDate)}</span>
            <span>読了目安: 約{readingMinutes}分</span>
            <Link href="/about-score/">採点方法を見る</Link>
            <span>情報商材誘導・誇大表現の動画は除外</span>
          </div>
        </header>

        <section className="guide-section guide-intro-section" aria-labelledby="guide-overview-title">
          <div className="guide-answer-box">
            <p className="section-eyebrow">結論先出し</p>
            <h2 id="guide-answer-title">まず何をすればいい？</h2>
            <p>{strongText(directAnswer)}</p>
          </div>
          <div className="guide-quick-faq" aria-labelledby="guide-quick-faq-title">
            <h2 id="guide-quick-faq-title">このページのQ&amp;A</h2>
            <div className="guide-faq-list">
              {quickFaq.map((item) => (
                <details key={item.question}>
                  <summary>{item.question}</summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
          <h2 id="guide-overview-title">この記事でわかること</h2>
          <div className="guide-point-box">
            <ul>
              {learnPoints.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            <p><strong>想定読者：</strong>{guide.audience ?? genreDisplayName(guide.genre) + "を無料動画で基礎から学びたい社会人向けです。"}</p>
            <p><strong>合計視聴時間：</strong>{totalVideos}本・約{durationLabel(totalMinutes)}。動画カードの時間はvideos.jsonから自動で表示しています。</p>
          </div>
          <details className="guide-toc">
            <summary>目次</summary>
            <ol>
              <li><a href="#guide-conclusion-title">結論：この順番で見れば最短です</a></li>
              <li><a href="#guide-quick-faq-title">このページのQ&amp;A</a></li>
              <li><a href="#guide-reason-title">なぜこの順番か</a></li>
              <li><a href="#guide-videos-title">各STEPの厳選動画</a></li>
              <li><a href="#guide-next-title">つまずきポイントと回避策</a></li>
              <li><a href="#guide-plan-title">学習プラン例</a></li>
              {remainingFaq.length > 0 ? <li><a href="#guide-faq-title">補足FAQ</a></li> : null}
              <li><a href="#guide-cta-title">関連ロードマップ</a></li>
            </ol>
          </details>
        </section>

        <section className="guide-section" aria-labelledby="guide-conclusion-title">
          <h2 id="guide-conclusion-title">結論：この順番で見れば最短です</h2>
          <p>{strongText(guide.intro)}</p>
          <ul className="guide-step-summary">
            {guide.conclusionBullets.map((item) => (
              <li key={item.label}>
                <strong>{item.label}</strong>
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
          <p>合計{totalVideos}本・約{durationLabel(totalMinutes)}ぶん。{guide.conclusionClosing}</p>
        </section>

        <section className="guide-section" aria-labelledby="guide-reason-title">
          <h2 id="guide-reason-title">{guide.reasonTitle ?? "なぜこの順番か（多くの人がつまずく理由）"}</h2>
          {guide.reasonParagraphs.map((paragraph) => (
            <p key={paragraph}>{strongText(paragraph)}</p>
          ))}
        </section>

        <AdSlot slot="1438236565" />
        <section className="guide-section" aria-labelledby="guide-videos-title">
          <h2 id="guide-videos-title">各STEPの厳選動画</h2>
          <div className="guide-step-list">
            {guide.steps.map((step, stepIndex) => {
              const items = guideStepVideos(step);
              const stepMinutes = items.reduce((sum, item) => sum + item.video.minutes, 0);

              return (
                <section
                  key={step.title}
                  id={`step-${stepIndex + 1}`}
                  className={`guide-step-block is-step-${stepIndex + 1}`}
                >
                  <div className="guide-step-heading">
                    <h3>
                      <span className="guide-step-number" aria-hidden="true">{stepIndex + 1}</span>
                      <span>{step.title}</span>
                    </h3>
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
          <h2 id="guide-next-title">つまずきポイントと回避策</h2>
          <div className="guide-table-wrap">
            <table className="guide-table">
              <thead>
                <tr>
                  <th>つまずき</th>
                  <th>回避策</th>
                </tr>
              </thead>
              <tbody>
                {stumbleRows.map((row) => (
                  <tr key={row.stumble}>
                    <td>{row.stumble}</td>
                    <td>{row.solution}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ul className="guide-advice-list">
            {guide.stumblingBlocks.map((item) => (
              <li key={item.label}>
                <strong>{item.label}</strong>
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="guide-section" aria-labelledby="guide-plan-title">
          <h2 id="guide-plan-title">学習プラン例</h2>
          <div className="guide-table-wrap">
            <table className="guide-table">
              <thead>
                <tr>
                  <th>進め方</th>
                  <th>ペース</th>
                  <th>具体例</th>
                </tr>
              </thead>
              <tbody>
                {studyPlans.map((plan) => (
                  <tr key={plan.label}>
                    <td>{plan.label}</td>
                    <td>{plan.pace}</td>
                    <td>{plan.plan}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {remainingFaq.length > 0 ? (
          <section className="guide-section" aria-labelledby="guide-faq-title">
            <h2 id="guide-faq-title">補足FAQ</h2>
            <div className="guide-faq-list">
              {remainingFaq.map((item) => (
                <details key={item.question}>
                  <summary>{item.question}</summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
          </section>
        ) : null}

        <section className="guide-section guide-section-muted" aria-labelledby="guide-cta-title">
          <h2 id="guide-cta-title">関連ロードマップ</h2>
          <div className="guide-cta-row">
            {relatedLinks.map((link) => (
              <a key={link.href + link.label} href={link.href}>{link.label}</a>
            ))}
          </div>
        </section>

        {guide.slug === "generative-ai" ? <GuideManapickAiCrossLink /> : null}

        <GuidePrSection guide={guide} />
      </article>
    </main>
  );
}

function GuideManapickAiCrossLink() {
  return (
    <section className="guide-section manapick-ai-crosslink is-guide" aria-label="公式AI版 manapick AI">
      <div>
        <p className="section-eyebrow">公式AI版</p>
        <h2>“使えるAI”を選ぶなら <span className="ai-brand-word">manapick AI</span></h2>
        <p>学ぶ順番はManapick、AIツールを選ぶときはmanapick AI。料金・無料枠・使い方を7軸で正直採点しています。</p>
      </div>
      <a href={MANAPICK_AI_URL} target="_blank" rel="noopener">
        manapick AIを見る ↗
      </a>
    </section>
  );
}

function GuidePrSection({ guide }: { guide: Guide }) {
  const prItems = guidePrLinks[guide.genre] ?? [];
  const moneyNote = guide.genre === "money" ? (
    <p className="guide-pr-note">※教材・講座の紹介です。特定の金融商品の推奨ではありません。</p>
  ) : null;

  if (prItems.length > 0) {
    return (
      <section className="guide-section guide-pr-section" aria-labelledby="guide-pr-title">
        <div className="guide-pr-heading">
          <div>
            <p className="section-eyebrow">【PR】広告</p>
            <h2 id="guide-pr-title">あわせて使いたい教材・講座(PR)</h2>
            <p className="guide-pr-disclosure">本ページにはアフィリエイト広告（PR）を含みます。</p>
          </div>
          <span className="guide-pr-badge">PR</span>
        </div>
        <div className="guide-pr-grid">
          {prItems.map((item) => (
            <GuidePrCard key={item.url} genre={guide.genre} item={item} placement="guide" />
          ))}
        </div>
        {moneyNote}
      </section>
    );
  }

  const placeholderItems = [
    {
      title: "入門書・参考書",
      body: "基礎を手元で確認したい人向けの教材枠です。"
    },
    {
      title: "動画講座・スクール",
      body: "独学後に演習量を増やしたい人向けの比較枠です。"
    },
    {
      title: "実務テンプレート・ツール",
      body: "学んだ内容を仕事に移すための補助教材枠です。"
    }
  ];

  return (
    <section className="guide-section guide-pr-section" aria-labelledby="guide-pr-title">
      <div className="guide-pr-heading">
        <div>
          <p className="section-eyebrow">【PR】広告</p>
          <h2 id="guide-pr-title">あわせて使いたい教材・講座(PR)</h2>
          <p className="guide-pr-disclosure">本ページにはアフィリエイト広告（PR）を含みます。</p>
        </div>
        <span className="guide-pr-badge">PR</span>
      </div>
      <div className="guide-pr-grid">
        {placeholderItems.map((item) => (
          <div key={item.title} className="guide-pr-card" aria-disabled="true">
            <strong>{item.title}</strong>
            <span>{item.body}</span>
            <em>掲載準備中</em>
          </div>
        ))}
      </div>
      {moneyNote}
    </section>
  );
}

function GuideGenreIcon({ genre, className = "guide-step-icon" }: { genre: string; className?: string }) {
  const src = guideIconSources[genre];
  if (!src) return null;

  return (
    <Image
      src={src}
      alt={genreDisplayName(genre) + "のアイコン"}
      width={28}
      height={28}
      className={className}
    />
  );
}

function guideLearnPoints(guide: Guide) {
  if (guide.learnPoints && guide.learnPoints.length >= 3) return guide.learnPoints.slice(0, 3);
  return guide.conclusionBullets.slice(0, 3).map((item) => item.text);
}

function guideStumbleRows(guide: Guide) {
  if (guide.stumbleTable && guide.stumbleTable.length >= 3) return guide.stumbleTable.slice(0, 3);

  return guide.stumblingBlocks.slice(0, 3).map((item) => ({
    stumble: item.label,
    cause: "",
    solution: item.text
  }));
}

function guideStudyPlans(guide: Guide, totalMinutes: number) {
  if (guide.studyPlans && guide.studyPlans.length >= 2) return guide.studyPlans;

  return [
    {
      label: "平日15分×2週間",
      pace: "1日15分で小分け視聴",
      plan: "最初の週でSTEP1〜2を見て、2週目にSTEP3と復習へ進む"
    },
    {
      label: "週末集中",
      pace: "土日で約" + durationLabel(Math.min(totalMinutes, 240)),
      plan: "動画を一気に見ず、STEPごとに手を動かす時間を挟む"
    }
  ];
}

function guideRelatedLinks(guide: Guide) {
  const links = [
    ...guide.relatedLinks.map((link) => ({
      ...link,
      label: link.label === "ジャンルの地図を見る" ? siteStats.publishedGenreCount + "ジャンルの地図を見る" : link.label
    })),
    {
      label: genreDisplayName(guide.genre) + "の動画一覧",
      href: `/genre/${guide.genre}/`
    },
    {
      label: "トップの学習ロードマップへ",
      href: "/#roadmap"
    }
  ];
  const seen = new Set<string>();
  return links.filter((link) => {
    const key = link.href + link.label;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function guideReadingMinutes(guide: Guide) {
  const text = [
    guide.title,
    guide.description,
    guide.intro,
    ...guide.conclusionBullets.map((item) => item.label + item.text),
    ...guide.reasonParagraphs,
    ...guide.steps.flatMap((step) => [step.title, ...step.videos.map((item) => item.why)]),
    ...guide.stumblingBlocks.map((item) => item.label + item.text),
    ...guide.faq.map((item) => item.question + item.answer)
  ].join("");

  return Math.max(3, Math.ceil(text.length / 520));
}

function guideDirectAnswer(guide: Guide, totalVideos: number, totalMinutes: number) {
  const first = guide.conclusionBullets[0]?.text ?? "最初の動画で全体像をつかみ、次のSTEPで実践へ進みます";
  const second = guide.conclusionBullets[1]?.text ?? "基礎を触ったあと、応用・実務の順に進むと迷いにくくなります";
  return `結論は、${guide.steps.length}STEPを上から順番に進めることです。まず${first}。その後、${second}。合計${totalVideos}本・約${durationLabel(totalMinutes)}なので、短い時間に分けて進められます。`;
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
        <span className="guide-video-thumb-pills">
          <span>{scoreText(video)}</span>
          <span>{video.minutes}分</span>
        </span>
      </a>
      <div className="guide-video-body">
        <div className="guide-video-meta">
          <GuideLevelBadge level={video.level} />
          <span>{genreLabel(video.genre)}</span>
          <a className={guideScoreClass(video)} href="/about-score/" aria-label={scoreText(video) + "。採点方法を開く"}>
            <span>{scoreText(video)}</span>
            <span className="score-badge-status is-confirmed">
              運営者が視聴確認済み
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

function guideTitle(title: string) {
  const suffix = "完全ロードマップ【YouTube無料・2026年版】";
  if (title.endsWith(suffix)) {
    const prefix = title.slice(0, -suffix.length);
    return (
      <>
        <span>{prefix}</span>
        <span className="guide-title-nowrap">完全ロードマップ</span>
        <span className="guide-title-nowrap">【YouTube無料・</span>
        <span className="guide-title-nowrap">2026年版】</span>
      </>
    );
  }
  return title;
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
  if (video.score === null) return "score-badge is-empty is-compact";
  if (video.score >= 28) return "score-badge is-confirmed is-high is-compact";
  if (video.score >= 20) return "score-badge is-confirmed is-mid is-compact";
  return "score-badge is-confirmed is-low is-compact";
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "Asia/Tokyo"
  }).format(date);
}

function durationLabel(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours <= 0) return rest + "分";
  if (rest === 0) return hours + "時間";
  return hours + "時間" + rest + "分";
}

function strongText(text: string) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, index) => (index % 2 === 1 ? <strong key={part}>{part}</strong> : part));
}
