import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import BrandLogo from "@/components/BrandLogo";
import VideoActions from "@/components/VideoActions";
import VideoEmbed from "@/components/VideoEmbed";
import { guidePath, guides } from "@/lib/guides";
import { manapickAiContextForGenre, manapickAiHrefForGenre } from "@/lib/ai-crosslinks";
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

type VideoPageProps = {
  params: Promise<{ ytid: string }>;
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
  const scoreConfirmationText =
    "運営者が実際に視聴し7軸35点で採点したスコアです" + (confirmationDate ? "（確認日: " + confirmationDate + "）" : "");
  const positionText = videoPositionText(video);
  const audienceText = videoAudienceText(video);
  const learningPoints = videoLearningPoints(video);
  const axisCommentary = videoAxisCommentary(video);
  const viewingTips = videoViewingTips(video);
  const editorialSummary = videoEditorialSummary(video, related[0]);
  const freshness = videoFreshness(video);
  const manapickAiHref = manapickAiHrefForGenre(video.genre);
  const manapickAiContext = manapickAiContextForGenre(video.genre);
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
            item: absoluteUrl("/#search")
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
        <a href="/" aria-label="Manapick トップへ">
          <BrandLogo compact />
        </a>
        <a className="video-header-link" href="/about-score/">採点方法</a>
      </header>

      <nav className="video-breadcrumb" aria-label="パンくず">
        <a href="/">ホーム</a>
        <span aria-hidden="true">/</span>
        <a href="/#search">{genreDisplayName(video.genre)}</a>
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
            {freshness ? <span className={`freshness-badge is-${freshness.tone}`} title={freshness.note}>{freshness.label}</span> : null}
          </div>
          {channel ? <p className="video-channel">チャンネル: {channel}</p> : null}
          <div className="video-score-card is-confirmed">
            <p>{scoreText(video)}</p>
            <span>運営者が視聴確認済み</span>
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
          <a className="video-watch-button" href={video.url} target="_blank" rel="noopener noreferrer">
            YouTubeで視聴
          </a>
          <p className="video-embed-note">※埋め込み再生できない動画はYouTubeでご覧ください。</p>
          <VideoActions ytid={video.ytid} />
        </div>
      </article>

      <section className="video-editorial-section" aria-labelledby="video-editorial-title">
        <div className="section-heading-row">
          <div>
            <p className="section-eyebrow">Manapick独自解説</p>
            <h2 id="video-editorial-title" className="section-title">この動画をどう使うか</h2>
          </div>
        </div>
        <p className="video-editorial-body">{editorialSummary}</p>
        {related[0] ? (
          <a className="video-next-link" href={videoPath(related[0].ytid)}>
            次に見る1本：{related[0].title}
          </a>
        ) : null}
        {guide ? (
          <a className="video-guide-link" href={guidePath(guide.slug)}>
            {videoGuideLinkLabel(video.genre)}
          </a>
        ) : null}
      </section>

      <section className="video-context-section" aria-labelledby="video-context-title">
        <div className="section-heading-row">
          <div>
            <p className="section-eyebrow">視聴前ガイド</p>
            <h2 id="video-context-title" className="section-title">この動画を選ぶ前に知っておきたいこと</h2>
          </div>
        </div>
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
      </section>

      <section className="video-axis-section" aria-labelledby="score-detail-title">
        <div className="section-heading-row">
          <div>
            <p className="section-eyebrow">Manapickスコア</p>
            <h2 id="score-detail-title" className="section-title">7軸の採点コメント</h2>
          </div>
          <a href="/about-score/">採点方法を見る</a>
        </div>
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
      </section>

      <section className="manapick-ai-crosslink is-video" aria-label="公式AI版 manapick AI">
        <div>
          <p className="section-eyebrow">公式AI版</p>
          <h2>“使えるAI”を選ぶなら <span className="ai-brand-word">manapick AI</span></h2>
          <p>{manapickAiContext}</p>
        </div>
        <a href={manapickAiHref} target="_blank" rel="noopener">
          manapick AIを見る ↗
        </a>
      </section>

      <section className="video-related-section" aria-labelledby="related-title">
        <div className="section-heading-row">
          <div>
            <p className="section-eyebrow">関連動画</p>
            <h2 id="related-title" className="section-title">次に見る6本</h2>
          </div>
          <a href="/#search">一覧へ戻る</a>
        </div>
        <div className="video-related-grid">
          {related.map((item) => (
            <a key={item.ytid} className="video-related-card" href={videoPath(item.ytid)}>
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
            </a>
          ))}
        </div>
      </section>

      {nextPick ? (
        <section className="video-next-section" aria-labelledby="video-next-title">
          <div className="section-heading-row">
            <div>
              <p className="section-eyebrow">次の一歩</p>
              <h2 id="video-next-title" className="section-title">次に見る1本</h2>
            </div>
            <a href={`/genre/${video.genre}/`}>{genreDisplayName(video.genre)}の一覧へ</a>
          </div>
          <a className="video-next-card" href={videoPath(nextPick.video.ytid)}>
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
          </a>
        </section>
      ) : null}
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
