import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import BrandLogo from "@/components/BrandLogo";
import {
  absoluteUrl,
  genreDisplayName,
  genreLabel,
  publishedGenreKeys,
  scoreText,
  videoPath,
  videos,
  youtubeThumbnail,
  type Video
} from "@/lib/manapick";
import { recentVideos } from "@/lib/rankings";

const newTitle = "最新の無料学習動画｜YouTube公開日順 | Manapick";
const newDescription = "生成AI、プログラミング、英語、資格など10ジャンルの無料YouTube学習動画を、公開日の新しい順に確認できます。";
const buildTimestamp = Date.now();

export const metadata: Metadata = {
  title: newTitle,
  description: newDescription,
  alternates: {
    canonical: absoluteUrl("/new/")
  },
  openGraph: {
    title: newTitle,
    description: newDescription,
    url: absoluteUrl("/new/"),
    type: "website",
    images: [absoluteUrl("/brand/ogp-manapick.png")]
  },
  twitter: {
    card: "summary_large_image",
    site: "@manapick_app",
    title: newTitle,
    description: newDescription,
    images: [absoluteUrl("/brand/ogp-manapick.png")]
  }
};

export default function NewPage() {
  const list = recentVideos(48);
  const dayMs = 24 * 60 * 60 * 1000;
  const recent90Count = videos.filter((video) => {
    const publishedAt = video.publishedAt ? Date.parse(video.publishedAt) : 0;
    return publishedAt > 0 && buildTimestamp - publishedAt <= 90 * dayMs;
  }).length;
  const newestVideo = list[0] ?? null;
  const latestByGenre = publishedGenreKeys.flatMap((genreKey) => {
    const latest = videos
      .filter((video) => video.genre === genreKey)
      .sort((a, b) => publishedTime(b) - publishedTime(a))[0];
    return latest ? [latest] : [];
  });
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: "最近追加・更新した動画",
        url: absoluteUrl("/new/"),
        mainEntity: {
          "@type": "ItemList",
          itemListElement: list.map((video, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: absoluteUrl(videoPath(video.ytid)),
            name: video.title
          }))
        }
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "ホーム", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: "新着", item: absoluteUrl("/new/") }
        ]
      }
    ]
  };

  return (
    <main className="knowledge-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />
      <header className="knowledge-header">
        <Link href="/" aria-label="Manapick トップへ">
          <BrandLogo compact />
        </Link>
        <Link className="knowledge-header-link" href="/ranking/">ランキングを見る</Link>
      </header>
      <nav className="knowledge-breadcrumb" aria-label="パンくず">
        <Link href="/">ホーム</Link>
        <span aria-hidden="true">›</span>
        <span>新着</span>
      </nav>
      <section className="knowledge-hero">
        <p className="section-eyebrow">New Videos</p>
        <h1>
          <span className="knowledge-title-phrase">最近追加・更新した</span>
          <span className="knowledge-title-phrase">動画</span>
        </h1>
        <p>{newDescription}</p>
        <dl className="new-freshness-summary" aria-label="掲載動画の鮮度">
          <div>
            <dt>最新公開日</dt>
            <dd>{newestVideo ? formatPublishedDate(newestVideo.publishedAt).replace("公開", "") : "-"}</dd>
          </div>
          <div>
            <dt>90日以内に公開</dt>
            <dd>{recent90Count}本</dd>
          </div>
          <div>
            <dt>公開・内容を確認済み</dt>
            <dd>{videos.length}本</dd>
          </div>
        </dl>
        <p className="new-freshness-note">YouTube上の公開日を基準に表示しています。サイトへの掲載日とは異なります。</p>
      </section>
      <section className="knowledge-section" aria-labelledby="new-video-list-title">
        <h2 id="new-video-list-title">新しい順に見る</h2>
        <div className="new-video-list">
          {list.map((video) => (
            <NewVideoCard key={video.ytid} video={video} />
          ))}
        </div>
      </section>
      <section className="knowledge-section" aria-labelledby="genre-latest-title">
        <p className="section-eyebrow">Latest by Genre</p>
        <h2 id="genre-latest-title">ジャンル別の最新1本</h2>
        <div className="new-genre-latest-grid">
          {latestByGenre.map((video) => (
            <Link key={video.genre} className="new-genre-latest-card" href={videoPath(video.ytid)}>
              <span>{genreDisplayName(video.genre)}</span>
              <strong>{video.title}</strong>
              <small>{formatPublishedDate(video.publishedAt)} / {scoreText(video)} / {video.minutes}分</small>
            </Link>
          ))}
        </div>
      </section>
      <AdSlot slot="1438236565" />
    </main>
  );
}

function publishedTime(video: Video) {
  if (!video.publishedAt) return 0;
  const time = Date.parse(video.publishedAt);
  return Number.isNaN(time) ? 0 : time;
}

function NewVideoCard({ video }: { video: Video }) {
  return (
    <Link className="new-video-card" href={videoPath(video.ytid)}>
      <span className="new-video-thumb">
        <Image
          src={youtubeThumbnail(video.ytid)}
          alt={video.title + "のサムネイル"}
          width={480}
          height={270}
          sizes="(min-width: 760px) 180px, 34vw"
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </span>
      <span className="new-video-body">
        <span className="new-video-meta">{genreLabel(video.genre)} / {video.sub} / {scoreText(video)} / {video.minutes}分</span>
        <strong>{video.title}</strong>
        <span>{formatPublishedDate(video.publishedAt)}</span>
      </span>
    </Link>
  );
}

function formatPublishedDate(value?: string) {
  if (!value) return "公開日未設定";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "公開日未設定";
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "Asia/Tokyo"
  }).format(date) + "公開";
}
