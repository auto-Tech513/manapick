import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import BrandLogo from "@/components/BrandLogo";
import LearningNote from "@/components/LearningNote";
import NetworkContextBand from "@/components/NetworkContextBand";
import FoldSection from "@/components/FoldSection";
import VideoActions from "@/components/VideoActions";
import VideoEmbed from "@/components/VideoEmbed";
import TrackedGaLink from "@/components/TrackedGaLink";
import sisterItemLinks from "@/content/sister-item-links.json";
import { guidePath, guides } from "@/lib/guides";
import {
  absoluteUrl,
  displayChannel,
  findVideo,
  genreDisplayName,
  genreLabel,
  isoDuration,
  relatedVideos,
  scoreConfirmationDate,
  scoreText,
  videoAudienceText,
  videoAxisCommentary,
  videoDescription,
  videoEditorialSummary,
  videoFreshness,
  videoLearningPoints,
  videoPath,
  videoPositionText,
  videoViewingTips,
  videos,
  youtubeEmbedUrl,
  youtubeThumbnail
} from "@/lib/manapick";
import { nextWatchVideo } from "@/lib/rankings";
import AdSlot from "@/components/AdSlot";

type VideoPageProps = {
  params: Promise<{ ytid: string }>;
};

type SisterItemLink = {
  site: "ai" | "license" | "career";
  slug: string;
  name: string;
  url: string;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return videos.map((video) => ({ ytid: video.ytid }));
}

export async function generateMetadata({ params }: VideoPageProps): Promise<Metadata> {
  const { ytid } = await params;
  const video = findVideo(ytid);
  if (!video) return {};

  const title = video.title + " | Manapick";
  const description = videoDescription(video);
  const pageUrl = absoluteUrl(videoPath(video.ytid));
  const image = youtubeThumbnail(video.ytid);

  return {
    title,
    description,
    alternates: {
      canonical: pageUrl
    },
    openGraph: {
      title,
      description,
      url: pageUrl,
      type: "video.other",
      images: [
        {
          url: image,
          width: 480,
          height: 360,
          alt: video.title + "のサムネイル"
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      site: "@manapick_app",
      title,
      description,
      images: [image]
    }
  };
}

export default async function VideoPage({ params }: VideoPageProps) {
  const { ytid } = await params;
  const video = findVideo(ytid);
  if (!video) notFound();

  const channel = displayChannel(video);
  const related = relatedVideos(video);
  const nextPick = nextWatchVideo(video);
  const guide = guides.find((item) => item.genre === video.genre) ?? null;
  const pageUrl = absoluteUrl(videoPath(video.ytid));
  const confirmationDate = scoreConfirmationDate(video);
  const hasStoredAxisBreakdown = video.axisScores.length === 7;
  const scoreConfirmationText = hasStoredAxisBreakdown
    ? "運営者が7軸35点で採点したスコアです" + (confirmationDate ? "（確認日: " + confirmationDate + "）" : "")
    : "運営者が確認済みの総合スコアです。軸別内訳は準備中です" + (confirmationDate ? "（確認日: " + confirmationDate + "）" : "");
  const positionText = videoPositionText(video);
  const audienceText = videoAudienceText(video);
  const learningPoints = videoLearningPoints(video);
  const axisCommentary = videoAxisCommentary(video);
  const viewingTips = videoViewingTips(video);
  // 「次に見る1本」はページ内で nextPick（ロードマップ上の次を最優先）に統一する。
  // quick-next ナビ・独自解説・下部の次カードが別々の動画を指す矛盾をなくす（UX改善 P0-1）。
  const editorialSummary = videoEditorialSummary(video, nextPick?.video ?? related[0]);
  const freshness = videoFreshness(video);
  const sisterLinks = (sisterItemLinks as Record<string, SisterItemLink[]>)[video.ytid] ?? [];
  const linkedSisterHrefs = sisterLinks.map((link) => link.url);
  const videoObject = {
    "@type": "VideoObject",
    name: video.title,
    description: videoDescription(video),
    thumbnailUrl: [youtubeThumbnail(video.ytid)],
    ...(video.publishedAt ? { uploadDate: video.publishedAt } : {}),
    duration: isoDuration(video.minutes),
    embedUrl: youtubeEmbedUrl(video.ytid),
    contentUrl: video.url,
    url: pageUrl,
    // 再生回数は保存データがある動画だけ出す（無い動画は捏造せず省略）。
    ...(typeof video.viewCount === "number"
      ? {
          interactionStatistic: {
            "@type": "InteractionCounter",
            interactionType: "https://schema.org/WatchAction",
            userInteractionCount: video.viewCount
          }
        }
      : {}),
    isAccessibleForFree: true,
    inLanguage: "ja",
    genre: genreDisplayName(video.genre),
    publisher: {
      "@id": absoluteUrl("/#organization")
    }
  };
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      videoObject,
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
            name: genreDisplayName(video.genre),
            item: absoluteUrl(`/genre/${video.genre}/`)
          },
          {
            "@type": "ListItem",
            position: 3,
            name: video.title,
            item: pageUrl
          }
        ]
      }
    ]
  };

  return (
    <main className="video-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />
      <header className="video-page-header">
        <Link href="/" aria-label="Manapick トップへ">
          <BrandLogo compact />
        </Link>
        <Link className="video-header-link" href="/about-score/">採点方法</Link>
      </header>

      <nav className="video-breadcrumb" aria-label="パンくず">
        <Link href="/">ホーム</Link>
        <span aria-hidden="true">/</span>
        <Link href={`/genre/${video.genre}/`}>{genreDisplayName(video.genre)}</Link>
        <span aria-hidden="true">/</span>
        <span>{video.title}</span>
      </nav>

      <article className="video-detail-shell">
        <div className="video-detail-media">
          <VideoEmbed ytid={video.ytid} title={video.title} />
        </div>

        <div className="video-detail-main">
          <p className="section-eyebrow">{genreDisplayName(video.genre)}</p>
          <h1>{video.title}</h1>
          <div className="video-meta-row">
            <span>{video.level}</span>
            <span>{genreLabel(video.genre)}</span>
            <span>{video.sub}</span>
            <span>{video.minutes}分</span>
            {video.minutes >= 6 ? <span title="YouTubeの再生速度を1.5倍にした場合の目安">1.5倍速なら約{Math.ceil(video.minutes / 1.5)}分</span> : null}
            {freshness ? <span className={`freshness-badge is-${freshness.tone}`} title={freshness.note}>{freshness.label}</span> : null}
          </div>
          {channel ? <p className="video-channel">チャンネル: {channel}</p> : null}
          <div className="video-score-card is-confirmed">
            <p>{scoreText(video)}</p>
            <span>運営者が採点済み</span>
          </div>
          <p className="video-score-note is-confirmed">
            {scoreConfirmationText}
          </p>
          <ol className="video-review-list">
            {video.review.map((line, index) => (
              <li key={`${index}-${line}`}>
                <span>{index + 1}</span>
                <p>{line}</p>
              </li>
            ))}
          </ol>
          {video.editorNote ? <p className="editor-note">編集メモ: {video.editorNote}</p> : null}
          <TrackedGaLink
            className="video-watch-button"
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            eventName="youtube_click"
            eventParams={{ video_id: video.ytid, placement: "video_detail", genre: video.genre, score_total: video.score ?? 0 }}
          >
            YouTubeで視聴
          </TrackedGaLink>
          <p className="video-embed-note">※埋め込み再生できない動画はYouTubeでご覧ください。</p>
          <VideoActions
            ytid={video.ytid}
            nextVideo={nextPick ? { ytid: nextPick.video.ytid, title: nextPick.video.title } : null}
          />
          <LearningNote ytid={video.ytid} />
        </div>
      </article>

      <AdSlot slot="1438236565" />

      {sisterLinks.length > 0 ? (
        <section className="sister-item-section" aria-labelledby="sister-item-title">
          <div>
            <p className="section-eyebrow">もっと詳しく</p>
            <h2 id="sister-item-title" className="section-title">姉妹サイトで詳細を見る</h2>
          </div>
          <div className="sister-item-links">
            {sisterLinks.map((link) => (
              <TrackedGaLink
                key={`${link.site}-${link.slug}`}
                className={`sister-item-link is-${link.site}`}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                eventName="network_click"
                eventParams={{ destination_site: link.site, placement: "video_detail_items", genre: video.genre, video_id: video.ytid }}
              >
                {link.site === "ai" ? (
                  <>
                    <span aria-hidden="true">🔧</span>
                    <span>「{link.name}」の料金・無料枠・使い方を manapick AI で見る</span>
                  </>
                ) : link.site === "license" ? (
                  <>
                    <span aria-hidden="true">📜</span>
                    <span>「{link.name}」の難易度・費用・申込を manapick license で見る</span>
                  </>
                ) : (
                  <>
                    <span aria-hidden="true">→</span>
                    <span>「{link.name}」の仕事内容・必要スキルを manapick career で見る</span>
                  </>
                )}
                <span className="sister-item-arrow" aria-hidden="true">→</span>
              </TrackedGaLink>
            ))}
          </div>
        </section>
      ) : null}

      <nav className="video-quick-next" aria-label="この動画のあとに">
        {nextPick ? (
          <TrackedGaLink
            className="video-next-link"
            href={videoPath(nextPick.video.ytid)}
            eventName="next_video_click"
            eventParams={{ placement: "quick_next", from_video_id: video.ytid, to_video_id: nextPick.video.ytid }}
          >
            次に見る1本：{nextPick.video.title}
          </TrackedGaLink>
        ) : null}
        {guide ? (
          <Link className="video-guide-link" href={guidePath(guide.slug)}>
            {videoGuideLinkLabel(video.genre)}
          </Link>
        ) : null}
      </nav>

      <FoldSection className="video-editorial-section" titleId="video-editorial-title" titleClassName="section-title" eyebrow="Manapick独自解説" title="この動画をどう使うか">
        <p className="video-editorial-body">{editorialSummary}</p>
        <ol className="video-learning-loop" aria-label="動画を学びにつなげる4ステップ">
          <li>
            <span>01</span>
            <strong>見る</strong>
            <small>{video.minutes}分で「{video.sub}」の要点を確認</small>
          </li>
          <li>
            <span>02</span>
            <strong>残す</strong>
            <small>視聴済み・あとで見るで、この端末に記録</small>
          </li>
          <li>
            <span>03</span>
            <strong>試す</strong>
            <small>{learningPoints[0]}</small>
          </li>
          <li>
            <span>04</span>
            <strong>広げる</strong>
            <small><a href={`#network-context-${video.genre}`}>AI・資格・仕事の詳しい情報へ</a></small>
          </li>
        </ol>
      </FoldSection>

      <AdSlot slot="1438236565" />

      <FoldSection className="video-context-section" titleId="video-context-title" titleClassName="section-title" eyebrow="視聴前ガイド" title="この動画を選ぶ前に知っておきたいこと" hint="位置づけ・おすすめの人・学べること・注意点">
        <div className="video-context-grid">
          <section className="video-context-card">
            <h3>この動画の位置づけ</h3>
            <p>{positionText}</p>
          </section>
          <section className="video-context-card">
            <h3>こんな人におすすめ</h3>
            <p>{audienceText}</p>
          </section>
          <section className="video-context-card">
            <h3>この1本で学べること</h3>
            <ul>
              {learningPoints.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </section>
          <section className="video-context-card">
            <h3>視聴のポイント／気をつけたい点</h3>
            {viewingTips.map((tip) => (
              <p key={tip}>{tip}</p>
            ))}
          </section>
        </div>
      </FoldSection>

      <FoldSection className="video-axis-section" titleId="score-detail-title" titleClassName="section-title" eyebrow="Manapickスコア" title="7軸の採点コメント" hint={scoreText(video)}>
        <p className="video-axis-method"><Link href="/about-score/">採点方法を見る</Link></p>
        <div className="video-axis-commentary">
          {axisCommentary.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
        {video.axisScores.length > 0 ? (
          <dl className="video-axis-grid">
            {video.axisScores.map((axis) => (
              <div key={axis.axis}>
                <dt>{axis.axis} <span>{axis.score}/5</span></dt>
                <dd>{axis.note}</dd>
              </div>
            ))}
          </dl>
        ) : (
          <p className="video-empty-score">{scoreConfirmationText}</p>
        )}
      </FoldSection>

      <NetworkContextBand genreKey={video.genre} sub={video.sub} skipHrefs={linkedSisterHrefs} />

      <AdSlot slot="1438236565" />
      {nextPick ? (
        <section className="video-next-section" aria-labelledby="video-next-title">
          <div className="section-heading-row">
            <div>
              <p className="section-eyebrow">次の一歩</p>
              <h2 id="video-next-title" className="section-title">次に見る1本</h2>
            </div>
            <Link href={`/genre/${video.genre}/`}>{genreDisplayName(video.genre)}の一覧へ</Link>
          </div>
          <TrackedGaLink
            className="video-next-card"
            href={videoPath(nextPick.video.ytid)}
            eventName="next_video_click"
            eventParams={{ placement: "next_section", from_video_id: video.ytid, to_video_id: nextPick.video.ytid }}
          >
            <span className="video-next-thumb">
              <Image
                src={youtubeThumbnail(nextPick.video.ytid)}
                alt={nextPick.video.title + "のサムネイル"}
                width={480}
                height={270}
                sizes="(min-width: 760px) 220px, 92vw"
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </span>
            <span className="video-next-card-body">
              <span>{nextPick.video.sub} / {scoreText(nextPick.video)} / {nextPick.video.minutes}分</span>
              <strong>{nextPick.video.title}</strong>
              <span>{nextPick.reason}</span>
            </span>
          </TrackedGaLink>
        </section>
      ) : null}
      <section className="video-related-section" aria-labelledby="related-title">
        <div className="section-heading-row">
          <div>
            <p className="section-eyebrow">関連動画</p>
            <h2 id="related-title" className="section-title">次に見る6本</h2>
          </div>
          <Link href="/#search">一覧へ戻る</Link>
        </div>
        <div className="video-related-grid">
          {related.map((item) => (
            <Link key={item.ytid} className="video-related-card" href={videoPath(item.ytid)}>
              <span className="video-related-thumb">
                <Image
                  src={youtubeThumbnail(item.ytid)}
                  alt={item.title + "のサムネイル"}
                  width={480}
                  height={270}
                  sizes="(min-width: 920px) 180px, (min-width: 560px) 45vw, 92vw"
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </span>
              <span className="video-related-body">
                <span className="video-related-meta">{item.sub} / {scoreText(item)} / {item.minutes}分</span>
                <span className="video-related-title">{item.title}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

    </main>
  );
}

function videoGuideLinkLabel(genre: string) {
  const labels: Record<string, string> = {
    ai: "AIプロンプト・Copilot活用のロードマップへ",
    prog: "Pythonは難しい？独学ロードマップへ",
    video: "YouTubeサムネイルと動画編集ロードマップへ",
    data: "エクセル統計の使い方ロードマップへ",
    shikaku: "社労士試験・資格勉強ロードマップへ",
    marke: "マーケティングYouTubeおすすめロードマップへ"
  };
  return labels[genre] ?? "このジャンルのロードマップへ";
}
