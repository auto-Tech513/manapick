import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { guidePath, guides } from "@/lib/guides";
import { MANAPICK_AI_URL } from "@/lib/brand-links";
import {
  absoluteUrl,
  genreDisplayName,
  publishedGenreKeys,
  scoreText,
  videoPath,
  videos,
  youtubeThumbnail,
  type Video
} from "@/lib/manapick";
import { eligibleSubPagePath, eligibleSubPagesForGenre } from "@/lib/sub-pages";

type GenrePageProps = {
  params: Promise<{ key: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return publishedGenreKeys.map((key) => ({ key }));
}

function genreVideos(key: string): Video[] {
  return videos
    .filter((video) => video.genre === key)
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
}

function genreGuideSlug(key: string): string | null {
  const guide = guides.find((item) => item.genre === key);
  return guide ? guide.slug : null;
}

export async function generateMetadata({ params }: GenrePageProps): Promise<Metadata> {
  const { key } = await params;
  if (!publishedGenreKeys.includes(key)) return {};

  const label = genreDisplayName(key);
  const count = genreVideos(key).length;
  const title = `${label}の学習動画${count}本｜見る順に厳選・無料 | Manapick`;
  const description = `${label}を学び直すための無料YouTube動画を7軸35点で採点し、見る順（ロードマップ）に整理。登録不要・全部無料。`;
  const url = absoluteUrl(`/genre/${key}/`);

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
      type: "website",
      images: [absoluteUrl("/brand/ogp-manapick.png")]
    },
    twitter: {
      card: "summary_large_image",
      site: "@manapick_app",
      title,
      description,
      images: [absoluteUrl("/brand/ogp-manapick.png")]
    }
  };
}

export default async function GenrePage({ params }: GenrePageProps) {
  const { key } = await params;
  if (!publishedGenreKeys.includes(key)) notFound();

  const label = genreDisplayName(key);
  const list = genreVideos(key);
  const guideSlug = genreGuideSlug(key);
  const url = absoluteUrl(`/genre/${key}/`);
  const subPages = eligibleSubPagesForGenre(key);

  const collection = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${label}の学習動画`,
    url,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: list.length,
      itemListElement: list.slice(0, 30).map((video, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: absoluteUrl(videoPath(video.ytid)),
        name: video.title
      }))
    }
  };
  const breadcrumb = {
    "@context": "https://schema.org",
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
        name: label,
        item: url
      }
    ]
  };

  return (
    <main className="genre-hub">
      <nav className="genre-hub-crumb" aria-label="パンくず">
        <Link href="/">ホーム</Link>
        <span aria-hidden="true">›</span>
        <span>{label}</span>
      </nav>

      <h1 className="genre-hub-title">{label}の学習動画（{list.length}本）</h1>
      <p className="genre-hub-lead">
        {label}を学び直すための無料YouTube動画を、7軸35点で採点して“見る順”に整理しました。登録不要・全部無料です。
      </p>
      {guideSlug ? (
        <p className="genre-hub-roadmap">
          <Link href={guidePath(guideSlug)}>▶ {label}の完全ロードマップ（初級→上級の見る順）を読む</Link>
        </p>
      ) : null}
      {key === "ai" ? <ManapickAiGenreBand /> : null}
      {subPages.length > 0 ? (
        <section className="genre-hub-subpages" aria-labelledby="genre-hub-subpages-title">
          <h2 id="genre-hub-subpages-title">{label}のトピック別ロードマップ</h2>
          <div className="genre-hub-subpage-grid">
            {subPages.map((item) => (
              <Link key={item.key + item.sub} href={eligibleSubPagePath(item)}>
                <span>{item.sub}</span>
                <strong>{item.count}本</strong>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <ul className="genre-hub-grid" role="list">
        {list.map((video) => (
          <li key={video.ytid}>
            <Link href={videoPath(video.ytid)} className="genre-hub-card">
              <Image
                src={youtubeThumbnail(video.ytid)}
                alt={video.title + "のサムネイル"}
                width={320}
                height={180}
                sizes="(min-width: 768px) 320px, 90vw"
                loading="lazy"
              />
              <span className="genre-hub-card-title">{video.title}</span>
              <span className="genre-hub-card-meta">{scoreText(video)}・{video.minutes}分・{video.sub}</span>
            </Link>
          </li>
        ))}
      </ul>

      <p className="genre-hub-back">
        <Link href="/">← すべてのジャンルを見る</Link>
      </p>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collection).replace(/</g, "\\u003c") }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb).replace(/</g, "\\u003c") }}
      />
    </main>
  );
}

function ManapickAiGenreBand() {
  return (
    <section className="manapick-ai-crosslink is-genre" aria-label="公式AI版 manapick AI">
      <div>
        <p className="section-eyebrow">公式AI版</p>
        <h2>“使えるAI”を選ぶなら manapick AI</h2>
        <p>学ぶ順番はManapick、AIツールを選ぶときはmanapick AI。料金・無料枠・使い方を7軸で正直採点しています。</p>
      </div>
      <a href={MANAPICK_AI_URL} target="_blank" rel="noopener">
        manapick AIを見る ↗
      </a>
    </section>
  );
}
