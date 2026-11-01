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

type NewsMonthGroup = { key: string; label: string; items: typeof newsItems };

// newsItems は公開日の新しい順。公開日の年月（YYYY-MM）ごとにまとめ、順序はそのまま保つ。
function groupNewsByMonth(items: typeof newsItems): NewsMonthGroup[] {
  const groups: NewsMonthGroup[] = [];
  for (const item of items) {
    const key = item.publishedAt.slice(0, 7);
    const last = groups[groups.length - 1];
    if (last && last.key === key) {
      last.items.push(item);
    } else {
      const [year, month] = key.split("-");
      groups.push({ key, label: `${year}年${Number(month)}月`, items: [item] });
    }
  }
  return groups;
}

export default function NewsPage() {
  const monthGroups = groupNewsByMonth(newsItems);
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
        <p className="news-month-note">最新の月は開いた状態で表示しています。それより前の記事は月ごとにまとめているので、読みたい月を開いてください。</p>
        <div className="news-month-groups">
          {monthGroups.map((group, index) => (
            <details key={group.key} className="fold-group news-month-group" open={index === 0}>
              <summary>
                <span className="fold-group-name">{group.label}</span>
                <span className="fold-group-count">{group.items.length}件</span>
              </summary>
              <div className="fold-group-body">
                <div className="news-index-grid">
                  {group.items.map((item) => (
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
              </div>
            </details>
          ))}
        </div>
      </section>
      <AdSlot slot="1438236565" />
    </main>
  );
}
