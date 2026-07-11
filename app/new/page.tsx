import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import BrandLogo from "@/components/BrandLogo";
import { absoluteUrl, genreLabel, scoreText, videoPath, youtubeThumbnail, type Video } from "@/lib/manapick";
import { recentVideos } from "@/lib/rankings";

const newTitle = "最近追加・更新した動画 | Manapick";
const newDescription = "Manapickで最近追加・更新した学習動画を、公開日の新しい順に確認できます。";

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
      </section>
      <section className="knowledge-section" aria-labelledby="new-video-list-title">
        <h2 id="new-video-list-title">新しい順に見る</h2>
        <div className="new-video-list">
          {list.map((video) => (
            <NewVideoCard key={video.ytid} video={video} />
          ))}
        </div>
      </section>
      <AdSlot slot="1438236565" />
    </main>
  );
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
