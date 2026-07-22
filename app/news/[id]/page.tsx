import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AdSlot from "@/components/AdSlot";
import BrandLogo from "@/components/BrandLogo";
import NewsShareBar from "@/components/NewsShareBar";
import { absoluteUrl } from "@/lib/manapick";
import { findNews, newsItems, newsPath, newsReadingMinutes } from "@/lib/news";

type NewsDetailPageProps = {
  params: Promise<{ id: string }>;
};

function formatDate(value: string) {
  return value.replaceAll("-", "/");
}

export function generateStaticParams() {
  return newsItems.map((item) => ({ id: item.id }));
}

export async function generateMetadata({ params }: NewsDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const item = findNews(id);
  if (!item) return {};
  const url = absoluteUrl(newsPath(item.id));
  const image = absoluteUrl(`/og/news/${item.id}.png`);
  const title = `${item.headline} | Manapick 学びニュース`;

  return {
    title,
    description: item.description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: item.description,
      url,
      type: "article",
      publishedTime: item.publishedAt,
      modifiedTime: item.lastChecked,
      section: item.categoryLabel,
      images: [{ url: image, width: 1200, height: 630, alt: item.headline }]
    },
    twitter: {
      card: "summary_large_image",
      site: "@manapick_app",
      title,
      description: item.description,
      images: [image]
    }
  };
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { id } = await params;
  const item = findNews(id);
  if (!item) notFound();

  const url = absoluteUrl(newsPath(item.id));
  const image = absoluteUrl(`/og/news/${item.id}.png`);
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "NewsArticle",
        headline: item.headline,
        description: item.description,
        image: [image],
        datePublished: item.publishedAt,
        dateModified: item.lastChecked,
        articleSection: item.categoryLabel,
        inLanguage: "ja",
        mainEntityOfPage: url,
        author: { "@id": absoluteUrl("/#organization") },
        publisher: { "@id": absoluteUrl("/#organization") },
        citation: item.sourceUrl
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "ホーム", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: "学びニュース", item: absoluteUrl("/news/") },
          { "@type": "ListItem", position: 3, name: item.headline, item: url }
        ]
      }
    ]
  };

  return (
    <main className="knowledge-page news-detail-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />
      <header className="knowledge-header">
        <Link href="/" aria-label="Manapick トップへ"><BrandLogo compact /></Link>
        <Link className="knowledge-header-link" href="/news/">ニュース一覧</Link>
      </header>
      <nav className="knowledge-breadcrumb" aria-label="パンくず">
        <Link href="/">ホーム</Link><span aria-hidden="true">›</span>
        <Link href="/news/">学びニュース</Link><span aria-hidden="true">›</span>
        <span>{item.categoryLabel}</span>
      </nav>

      <header className={`news-article-hero is-${item.category}`}>
        <div className="news-article-kicker">
          <span>{item.categoryLabel}</span>
          <span>公式情報を確認</span>
        </div>
        <h1>{item.headline}</h1>
        <p>{item.description}</p>
        <div className="news-article-dates">
          <time dateTime={item.publishedAt}>発表 {formatDate(item.publishedAt)}</time>
          <time dateTime={item.lastChecked}>最終確認 {formatDate(item.lastChecked)}</time>
          <span>約{newsReadingMinutes(item)}分</span>
        </div>
      </header>

      <NewsShareBar title={item.headline} url={url} />

      <div className="news-article-layout">
        <article className="news-article-body">
          <section className="news-why-care" aria-labelledby="why-care-title">
            <p className="section-eyebrow">Why It Matters</p>
            <h2 id="why-care-title">この更新が学びにどう関係するか</h2>
            <p>{item.whyCare}</p>
          </section>

          <section className="news-fact-section" aria-labelledby="facts-title">
            <h2 id="facts-title">公式発表で確認できたこと</h2>
            <ul>{item.facts.map((fact) => <li key={fact}>{fact}</li>)}</ul>
          </section>

          {item.sections.map((section) => (
            <section key={section.heading}>
              <h2>{section.heading}</h2>
              {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              {section.bullets?.length ? (
                <ul>{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>
              ) : null}
            </section>
          ))}
        </article>

        <aside className="news-article-aside" aria-label="出典と次の学習">
          <section>
            <p className="section-eyebrow">Primary Source</p>
            <h2>出典</h2>
            <p>制度・仕様・提供日は変わる場合があります。最新情報は公式発表で確認してください。</p>
            <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer">{item.sourceName} <span aria-hidden="true">↗</span></a>
            <small>最終確認 {formatDate(item.lastChecked)}</small>
          </section>
          <section>
            <p className="section-eyebrow">Next Step</p>
            <h2>次に進む</h2>
            <nav aria-label="関連記事">
              {item.relatedLinks.map((link) => {
                const external = link.href.startsWith("http");
                return external ? (
                  <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer">{link.label} <span aria-hidden="true">↗</span></a>
                ) : (
                  <Link key={link.href} href={link.href}>{link.label} <span aria-hidden="true">→</span></Link>
                );
              })}
            </nav>
          </section>
        </aside>
      </div>
      <AdSlot slot="1438236565" />
    </main>
  );
}
