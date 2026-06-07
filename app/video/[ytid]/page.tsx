import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import BrandLogo from "@/components/BrandLogo";
import {
  absoluteUrl,
  displayChannel,
  findVideo,
  genreDisplayName,
  genreLabel,
  isoDuration,
  relatedVideos,
  scoreConfirmationDate,
  scoreLabel,
  scoreStatus,
  scoreText,
  videoDescription,
  videoPath,
  videos,
  youtubeEmbedUrl,
  youtubeThumbnail
} from "@/lib/manapick";

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
  const pageUrl = absoluteUrl(videoPath(video.ytid));
  const isConfirmed = scoreStatus(video) === "confirmed";
  const confirmationDate = scoreConfirmationDate(video);
  const scoreConfirmationText = isConfirmed
    ? "運営者が視聴のうえ確認済みのスコアです" + (confirmationDate ? "(確認日: " + confirmationDate + ")" : "")
    : "Manapickスコアは公開前の視聴確認で確定します。";
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "VideoObject",
        name: video.title,
        description: videoDescription(video),
        thumbnailUrl: [youtubeThumbnail(video.ytid)],
        uploadDate: video.publishedAt,
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
          <Image
            src={youtubeThumbnail(video.ytid)}
            alt={video.title + "のサムネイル"}
            width={480}
            height={360}
            priority
            sizes="(min-width: 980px) 520px, 100vw"
            className="video-detail-thumb"
          />
        </div>

        <div className="video-detail-main">
          <p className="section-eyebrow">{genreDisplayName(video.genre)}</p>
          <h1>{video.title}</h1>
          <div className="video-meta-row">
            <span>{video.level}</span>
            <span>{genreLabel(video.genre)}</span>
            <span>{video.sub}</span>
            <span>{video.minutes}分</span>
          </div>
          {channel ? <p className="video-channel">チャンネル: {channel}</p> : null}
          <div className={isConfirmed ? "video-score-card is-confirmed" : "video-score-card"}>
            <p>{scoreLabel(video)}</p>
            <span>{isConfirmed ? "運営者が視聴確認済み" : "自動採点・順次確認中"}</span>
          </div>
          {isConfirmed ? <p className="video-score-note is-confirmed">{scoreConfirmationText}</p> : null}
          <ol className="video-review-list">
            {video.review.map((line, index) => (
              <li key={line}>
                <span>{index + 1}</span>
                <p>{line}</p>
              </li>
            ))}
          </ol>
          {video.editorNote ? <p className="editor-note">編集メモ: {video.editorNote}</p> : null}
          <a className="video-watch-button" href={video.url} target="_blank" rel="noopener noreferrer">
            YouTubeで視聴
          </a>
        </div>
      </article>

      <section className="video-axis-section" aria-labelledby="score-detail-title">
        <div className="section-heading-row">
          <div>
            <p className="section-eyebrow">Manapickスコア</p>
            <h2 id="score-detail-title" className="section-title">7軸の内訳</h2>
          </div>
          <a href="/about-score/">採点方法を見る</a>
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
    </main>
  );
}
