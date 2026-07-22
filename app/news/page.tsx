import type { Metadata } from "next";
import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import BrandLogo from "@/components/BrandLogo";
import { absoluteUrl } from "@/lib/manapick";
import { newsItems, newsPath, newsReadingMinutes } from "@/lib/news";

const title = "学びニュース | 公式発表を学習と仕事に生かす | Manapick";
const description = "生成AI、Google Workspace、Excelなどの公式発表を確認し、学習や仕事で何を確認すべきかまで整理するManapickの学びニュース。";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: absoluteUrl("/news/") },
  openGraph: {
    title,
    description,
    url: absoluteUrl("/news/"),
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

function formatDate(value: string) {
  return value.replaceAll("-", "/");
}

export default function NewsPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: "Manapick 学びニュース",
        description,
        url: absoluteUrl("/news/"),
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: newsItems.length,
          itemListElement: newsItems.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.headline,
            url: absoluteUrl(newsPath(item.id))
          }))
        }
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "ホーム", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: "学びニュース", item: absoluteUrl("/news/") }
        ]
      }
    ]
  };

  return (
    <main className="knowledge-page news-index-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />
      <header className="knowledge-header">
        <Link href="/" aria-label="Manapick トップへ"><BrandLogo compact /></Link>
        <Link className="knowledge-header-link" href="/new/">新着動画を見る</Link>
      </header>
      <nav className="knowledge-breadcrumb" aria-label="パンくず">
        <Link href="/">ホーム</Link><span aria-hidden="true">›</span><span>学びニュース</span>
      </nav>
      <section className="knowledge-hero news-index-hero">
        <p className="section-eyebrow">Learning News</p>
        <h1>公式発表を、学びに使える形へ</h1>
        <p>{description}</p>
        <div className="news-index-principles" aria-label="編集方針">
          <span>公式一次情報を確認</span>
          <span>事実と活用法を分離</span>
          <span>公開日・確認日を表示</span>
        </div>
      </section>

      <section className="knowledge-section news-index-section" aria-labelledby="news-list-title">
        <header className="news-list-heading">
          <div>
            <p className="section-eyebrow">Verified Updates</p>
            <h2 id="news-list-title">新しい順に読む</h2>
          </div>
          <p>{newsItems[0]?.lastChecked.replaceAll("-", "/")}まで確認済み</p>
        </header>
        <div className="news-index-grid">
          {newsItems.map((item) => (
            <Link key={item.id} className={`news-index-card is-${item.category}`} href={newsPath(item.id)}>
              <span className="news-index-meta">
                <span>{item.categoryLabel}</span>
                <time dateTime={item.publishedAt}>{formatDate(item.publishedAt)}</time>
              </span>
              <h3>{item.headline}</h3>
              <p>{item.description}</p>
              <span className="news-index-source">出典: {item.sourceName}</span>
              <span className="news-index-read">約{newsReadingMinutes(item)}分 <span aria-hidden="true">→</span></span>
            </Link>
          ))}
        </div>
      </section>
      <AdSlot slot="1438236565" />
    </main>
  );
}
