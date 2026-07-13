import type { Metadata } from "next";
import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
import { guidePath, guides } from "@/lib/guides";
import { absoluteUrl, genreDisplayName } from "@/lib/manapick";

const pageTitle = "学習ロードマップ一覧｜無料YouTube動画で学ぶ順番 | Manapick";
const pageDescription = "生成AI、Python、動画編集、英語、データ分析、資格など10分野の無料YouTube学習ロードマップを一覧で比較できます。";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: { canonical: absoluteUrl("/guide/") },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: absoluteUrl("/guide/"),
    type: "website",
    images: [absoluteUrl("/brand/ogp-manapick.png")]
  },
  twitter: {
    card: "summary_large_image",
    site: "@manapick_app",
    title: pageTitle,
    description: pageDescription,
    images: [absoluteUrl("/brand/ogp-manapick.png")]
  }
};

export default function GuideIndexPage() {
  const pageUrl = absoluteUrl("/guide/");
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: "学習ロードマップ一覧",
        description: pageDescription,
        url: pageUrl,
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: guides.length,
          itemListElement: guides.map((guide, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: guide.title,
            url: absoluteUrl(guidePath(guide.slug))
          }))
        }
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "ホーム", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: "学習ロードマップ", item: pageUrl }
        ]
      }
    ]
  };

  return (
    <main className="guide-index-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />
      <header className="knowledge-header">
        <Link href="/" aria-label="Manapick トップへ"><BrandLogo compact /></Link>
        <Link className="knowledge-header-link" href="/start/">今日の1本診断</Link>
      </header>
      <nav className="knowledge-breadcrumb" aria-label="パンくず">
        <Link href="/">ホーム</Link><span aria-hidden="true">/</span><span>学習ロードマップ</span>
      </nav>
      <section className="guide-index-hero">
        <p className="section-eyebrow">10分野の見る順</p>
        <h1>学習ロードマップ一覧</h1>
        <p>長い動画を闇雲に見るのではなく、入口・基礎・応用の3段階で次の一本を選べます。すべてYouTube公式動画で、会員登録は不要です。</p>
      </section>
      <section className="guide-index-list" aria-label="分野別ロードマップ">
        {guides.map((guide, index) => (
          <Link key={guide.slug} href={guidePath(guide.slug)}>
            <span className="guide-index-number">{String(index + 1).padStart(2, "0")}</span>
            <span className="guide-index-copy">
              <small>{genreDisplayName(guide.genre)}</small>
              <strong>{guide.title}</strong>
              <span>{guide.description}</span>
            </span>
            <span className="guide-index-arrow" aria-hidden="true">→</span>
          </Link>
        ))}
      </section>
    </main>
  );
}
