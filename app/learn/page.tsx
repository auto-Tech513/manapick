import type { Metadata } from "next";
import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
import { absoluteUrl } from "@/lib/manapick";
import { learningIntentPath, learningIntents } from "@/lib/learning-intents";

const pageTitle = "検索で多い学習テーマ別入口｜無料YouTube動画の見る順 | Manapick";
const pageDescription = "検索でよく探される学習テーマを、無料YouTube動画の見る順に整理。Excel統計、Python、Power BI、FP3級過去問、社労士、AIプロンプトなどの入口です。";
const pageUrl = absoluteUrl("/learn/");

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: { canonical: pageUrl },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: pageUrl,
    type: "article",
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

export default function LearnIndexPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: pageTitle,
        description: pageDescription,
        inLanguage: "ja",
        url: pageUrl
      },
      {
        "@type": "ItemList",
        name: "検索で多い学習テーマ",
        numberOfItems: learningIntents.length,
        itemListElement: learningIntents.map((intent, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: intent.query,
          url: absoluteUrl(learningIntentPath(intent.slug))
        }))
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "ホーム", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: "学習テーマ別入口", item: pageUrl }
        ]
      }
    ]
  };

  return (
    <main className="knowledge-page learning-intent-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />
      <header className="knowledge-header">
        <Link href="/" aria-label="Manapick トップへ">
          <BrandLogo compact />
        </Link>
        <Link className="knowledge-header-link" href="/start/">今日の1本診断</Link>
      </header>
      <nav className="knowledge-breadcrumb" aria-label="パンくず">
        <Link href="/">ホーム</Link>
        <span aria-hidden="true">›</span>
        <span>学習テーマ別入口</span>
      </nav>
      <section className="knowledge-hero learning-intent-hero">
        <p className="section-eyebrow">検索から来た人へ</p>
        <h1>検索で多い学習テーマを、見る順で選ぶ。</h1>
        <p>
          検索で実際に見つけられているテーマを、無料YouTube動画・ロードマップ・公式情報・FAQにまとめました。
          まず1ページで答えと見る順をつかみ、必要な動画だけを比較できます。
        </p>
      </section>
      <section className="knowledge-section" aria-labelledby="learn-index-title">
        <p className="section-eyebrow">テーマ一覧</p>
        <h2 id="learn-index-title">検索でよく探される学習テーマ</h2>
        <div className="learning-intent-grid">
          {learningIntents.map((intent) => (
            <Link key={intent.slug} href={learningIntentPath(intent.slug)} className="learning-intent-card">
              <span>{intent.query}</span>
              <strong>{intent.h1}</strong>
              <small>{intent.audience}</small>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
