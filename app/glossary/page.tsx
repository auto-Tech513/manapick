import type { Metadata } from "next";
import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
import { glossaryTerms } from "@/content/glossary";
import { absoluteUrl } from "@/lib/manapick";

const glossaryTitle = "用語集 | Manapick";
const glossaryDescription = "生成AI、プログラミング、動画編集、英語、資格学習など、Manapickで使う学び直し用語を平易に整理しました。";

export const metadata: Metadata = {
  title: glossaryTitle,
  description: glossaryDescription,
  alternates: {
    canonical: absoluteUrl("/glossary/")
  },
  openGraph: {
    title: glossaryTitle,
    description: glossaryDescription,
    url: absoluteUrl("/glossary/"),
    type: "article",
    images: [absoluteUrl("/brand/ogp-manapick.png")]
  },
  twitter: {
    card: "summary_large_image",
    site: "@manapick_app",
    title: glossaryTitle,
    description: glossaryDescription,
    images: [absoluteUrl("/brand/ogp-manapick.png")]
  }
};

export default function GlossaryPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "DefinedTermSet",
        name: "Manapick 用語集",
        url: absoluteUrl("/glossary/"),
        hasDefinedTerm: glossaryTerms.map((item) => ({
          "@type": "DefinedTerm",
          name: item.term,
          description: item.body,
          url: absoluteUrl("/glossary/#" + encodeURIComponent(item.term))
        }))
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "ホーム", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: "用語集", item: absoluteUrl("/glossary/") }
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
        <Link className="knowledge-header-link" href="/faq/">FAQ</Link>
      </header>
      <nav className="knowledge-breadcrumb" aria-label="パンくず">
        <Link href="/">ホーム</Link>
        <span aria-hidden="true">›</span>
        <span>用語集</span>
      </nav>
      <section className="knowledge-hero">
        <p className="section-eyebrow">Glossary</p>
        <h1>学び直し用語集</h1>
        <p>{glossaryDescription}</p>
      </section>
      <section className="knowledge-section" aria-labelledby="glossary-list-title">
        <h2 id="glossary-list-title">用語一覧</h2>
        <div className="glossary-grid">
          {glossaryTerms.map((item) => (
            <article id={item.term} key={item.term} className="glossary-card">
              <h3>{item.term}</h3>
              <p>{item.body}</p>
              <Link href={item.href}>{item.label}へ</Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
