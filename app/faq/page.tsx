import type { Metadata } from "next";
import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
import { siteFaqItems } from "@/content/site-faq";
import { absoluteUrl } from "@/lib/manapick";

const faqTitle = "よくある質問 | Manapick";
const faqDescription = "Manapickの使い方、採点方法、視聴確認済みの方針、manapick AIとの違いをまとめました。";

export const metadata: Metadata = {
  title: faqTitle,
  description: faqDescription,
  alternates: {
    canonical: absoluteUrl("/faq/")
  },
  openGraph: {
    title: faqTitle,
    description: faqDescription,
    url: absoluteUrl("/faq/"),
    type: "article",
    images: [absoluteUrl("/brand/ogp-manapick.png")]
  },
  twitter: {
    card: "summary_large_image",
    site: "@manapick_app",
    title: faqTitle,
    description: faqDescription,
    images: [absoluteUrl("/brand/ogp-manapick.png")]
  }
};

export default function FaqPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FAQPage",
        mainEntity: siteFaqItems.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer
          }
        }))
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "ホーム", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: "よくある質問", item: absoluteUrl("/faq/") }
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
        <Link className="knowledge-header-link" href="/about-score/">採点方法</Link>
      </header>
      <nav className="knowledge-breadcrumb" aria-label="パンくず">
        <Link href="/">ホーム</Link>
        <span aria-hidden="true">›</span>
        <span>よくある質問</span>
      </nav>
      <section className="knowledge-hero">
        <p className="section-eyebrow">FAQ</p>
        <h1>よくある質問</h1>
        <p>{faqDescription}</p>
      </section>
      <section className="knowledge-section" aria-labelledby="faq-list-title">
        <h2 id="faq-list-title">このサイトについて</h2>
        <div className="guide-faq-list">
          {siteFaqItems.map((item) => (
            <details key={item.question}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>
      <nav className="knowledge-link-grid" aria-label="関連ページ">
        <Link href="/ranking/">人気ランキングを見る</Link>
        <Link href="/new/">最近追加・更新した動画を見る</Link>
        <Link href="/glossary/">用語集を見る</Link>
      </nav>
    </main>
  );
}
