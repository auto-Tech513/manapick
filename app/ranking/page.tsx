import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import BrandLogo from "@/components/BrandLogo";
import { absoluteUrl, genreLabel, publishedGenreKeys, scoreText, videoPath, videos, youtubeThumbnail, type Video } from "@/lib/manapick";
import { rankedVideos, type RankingMode } from "@/lib/rankings";

const rankingTitle = "人気の学習動画ランキング | Manapick";
const rankingDescription =
  "Manapick掲載動画を、YouTube再生数ベースの総合人気、高スコア、新着の3つの見方で整理しました。";

const rankingSections: { mode: RankingMode; id: string; title: string; note: string }[] = [
  { mode: "popular", id: "popular", title: "総合人気", note: "YouTube再生数と公開からの経過時間をもとにした参考順です。" },
  { mode: "score", id: "score", title: "高スコア", note: "Manapickスコア順。運営者が視聴確認した学習用途の評価です。" },
  { mode: "new", id: "new", title: "新着", note: "公開日が新しい動画から確認できます。" }
];

export const metadata: Metadata = {
  title: rankingTitle,
  description: rankingDescription,
  alternates: {
    canonical: absoluteUrl("/ranking/")
  },
  openGraph: {
    title: rankingTitle,
    description: rankingDescription,
    url: absoluteUrl("/ranking/"),
    type: "website",
    images: [absoluteUrl("/brand/ogp-manapick.png")]
  },
  twitter: {
    card: "summary_large_image",
    site: "@manapick_app",
    title: rankingTitle,
    description: rankingDescription,
    images: [absoluteUrl("/brand/ogp-manapick.png")]
  }
};

export default function RankingPage() {
  const itemList = rankedVideos("popular", 30).map((video, index) => ({
    "@type": "ListItem",
    position: index + 1,
    url: absoluteUrl(videoPath(video.ytid)),
    name: video.title
  }));
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: "人気の学習動画ランキング",
        url: absoluteUrl("/ranking/"),
        mainEntity: {
          "@type": "ItemList",
          name: "Manapick 総合人気ランキング",
          itemListElement: itemList
        }
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "ホーム", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: "ランキング", item: absoluteUrl("/ranking/") }
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
        <Link className="knowledge-header-link" href="/new/">新着を見る</Link>
      </header>
      <nav className="knowledge-breadcrumb" aria-label="パンくず">
        <Link href="/">ホーム</Link>
        <span aria-hidden="true">›</span>
        <span>ランキング</span>
      </nav>
      <section className="knowledge-hero">
        <p className="section-eyebrow">Ranking</p>
        <h1>人気の学習動画ランキング</h1>
        <p>{rankingDescription}</p>
        <div className="ranking-tab-row" role="list" aria-label="ランキングの種類">
          {rankingSections.map((section) => (
            <a key={section.id} href={"#" + section.id}>{section.title}</a>
          ))}
          <a href="#genre-ranking">ジャンル別</a>
        </div>
      </section>
      {rankingSections.map((section) => (
        <section key={section.id} id={section.id} className="knowledge-section ranking-section" aria-labelledby={section.id + "-title"}>
          <div className="ranking-section-head">
            <div>
              <p className="section-eyebrow">{section.title}</p>
              <h2 id={section.id + "-title"}>{section.title}ランキング</h2>
            </div>
            <p>{section.note}</p>
          </div>
          <div className="ranking-grid">
            {rankedVideos(section.mode, 12).map((video, index) => (
              <RankingVideoCard key={section.id + video.ytid} video={video} rank={index + 1} priority={section.mode === "popular" && index < 2} />
            ))}
          </div>
        </section>
      ))}
      <AdSlot slot="1438236565" />
      <section id="genre-ranking" className="knowledge-section ranking-section" aria-labelledby="genre-ranking-title">
        <div className="ranking-section-head">
          <div>
            <p className="section-eyebrow">Genre Ranking</p>
            <h2 id="genre-ranking-title">ジャンル別の入口</h2>
          </div>
          <p>各ジャンルの高スコア動画から、最初に比較しやすい3本を表示しています。</p>
        </div>
        <div className="genre-ranking-grid">
          {publishedGenreKeys.map((key) => {
            const list = videos
              .filter((video) => video.genre === key)
              .sort((a, b) => (b.score ?? -1) - (a.score ?? -1))
              .slice(0, 3);
            if (list.length === 0) return null;

            return (
              <section key={key} className="genre-ranking-card" aria-labelledby={`genre-ranking-${key}`}>
                <div className="genre-ranking-card-head">
                  <h3 id={`genre-ranking-${key}`}>{genreLabel(key)}</h3>
                  <Link href={`/genre/${key}/`}>一覧へ</Link>
                </div>
                <ol>
                  {list.map((video, index) => (
                    <li key={video.ytid}>
                      <Link href={videoPath(video.ytid)}>
                        <span>{index + 1}</span>
                        <strong>{video.title}</strong>
                        <small>{scoreText(video)} / {video.minutes}分</small>
                      </Link>
                    </li>
                  ))}
                </ol>
              </section>
            );
          })}
        </div>
      </section>
    </main>
  );
}

function RankingVideoCard({ video, rank, priority }: { video: Video; rank: number; priority: boolean }) {
  return (
    <Link className="ranking-video-card" href={videoPath(video.ytid)}>
      <span className={`rank-badge rank-${Math.min(rank, 4)}`}>{rank}</span>
      <span className="ranking-video-thumb">
        <Image
          src={youtubeThumbnail(video.ytid)}
          alt={video.title + "のサムネイル"}
          width={480}
          height={270}
          sizes="(min-width: 920px) 260px, (min-width: 560px) 45vw, 92vw"
          loading={priority ? "eager" : "lazy"}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </span>
      <span className="ranking-video-body">
        <span className="ranking-video-meta">{genreLabel(video.genre)} / {scoreText(video)} / {video.minutes}分</span>
        <strong>{video.title}</strong>
      </span>
    </Link>
  );
}
