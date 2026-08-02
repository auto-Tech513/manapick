import type { Metadata } from "next";
import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
import {
  MANAPICK_AI_URL,
  MANAPICK_CAREER_URL,
  MANAPICK_LICENSE_URL,
  manapickAiUrlForGenre,
  manapickCareerUrlForGenre,
  manapickLicenseUrlForGenre
} from "@/lib/brand-links";
import { absoluteUrl, genreDisplayName, publishedGenreKeys } from "@/lib/manapick";
import { genreVideoCount } from "@/lib/site-stats";
import professions from "@/content/professions.json";

const pageTitle = "Manapick Network｜学ぶ・AI・資格・仕事を1本の導線に";
const pageDescription = "Manapick、manapick AI、manapick license、manapick careerの役割と使い分けを整理。学ぶ分野を保ったまま、AI・資格・仕事へ進めます。";
const pageUrl = absoluteUrl("/network/");

const stages = [
  {
    key: "learn",
    number: "01",
    eyebrow: "動画で学ぶ",
    title: "Manapick",
    body: "視聴確認済みの無料YouTube動画から、最初の1本と見る順を決めます。",
    href: "/start/",
    action: "今日の1本を選ぶ",
    external: false
  },
  {
    key: "ai",
    number: "02",
    eyebrow: "AIを選ぶ",
    title: "manapick AI",
    body: "仕事や学習に使うAIの料金、無料枠、使い方、注意点を確認します。",
    href: MANAPICK_AI_URL,
    action: "AIを比較する",
    external: true
  },
  {
    key: "license",
    number: "03",
    eyebrow: "資格で証明する",
    title: "manapick license",
    body: "資格・検定の受験要件、費用、申込方法を公式情報から確認します。",
    href: MANAPICK_LICENSE_URL,
    action: "資格を比較する",
    external: true
  },
  {
    key: "career",
    number: "04",
    eyebrow: "仕事につなぐ",
    title: "manapick career",
    body: "仕事内容、必要スキル、注意点を確認し、学ぶ理由を具体化します。",
    href: MANAPICK_CAREER_URL,
    action: "仕事を調べる",
    external: true
  }
] as const;

const faq = [
  {
    question: "4サイトはどの順番で使えばいいですか？",
    answer: "迷っている場合は、仕事を知る、必要な資格を確認する、使うAIを選ぶ、無料動画で学ぶの順でも構いません。目的が決まっている場合は、Manapickで先に無料動画を1本試せます。"
  },
  {
    question: "サイトをまたぐと学習記録は共有されますか？",
    answer: "共有されません。各サイトはログイン不要を基本とし、保存情報はそれぞれお使いのブラウザ内に残ります。"
  },
  {
    question: "広告やアフィリエイトで順位は変わりますか？",
    answer: "変えません。広告やPRを含む場合は明示し、動画の採点・掲載順位とは分けて扱います。"
  },
  {
    question: "資格や仕事の情報は公式ですか？",
    answer: "manapick licenseとmanapick careerでは公式情報への参照を優先します。最終的な要件、費用、募集条件は各公式サイトで確認してください。"
  }
] as const;

const careerEntrances = Array.from(new Map(
  professions.flatMap((profession) =>
    profession.careerLinks.map((career) => [career.href, {
      ...career,
      profession: profession.title,
      guideHref: profession.guideHref
    }] as const)
  )
).values());

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: { canonical: pageUrl },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: pageUrl,
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

export default function NetworkPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: pageTitle,
        description: pageDescription,
        url: pageUrl,
        inLanguage: "ja"
      },
      {
        "@type": "ItemList",
        name: "Manapick Networkの4サービス",
        numberOfItems: stages.length,
        itemListElement: stages.map((stage, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: stage.title,
          url: stage.external ? stage.href : absoluteUrl(stage.href)
        }))
      },
      {
        "@type": "ItemList",
        name: "仕事から選ぶManapickの学習入口",
        numberOfItems: careerEntrances.length,
        itemListElement: careerEntrances.map((career, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: career.label,
          url: career.href
        }))
      },
      {
        "@type": "FAQPage",
        mainEntity: faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer }
        }))
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "ホーム", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: "Manapick Network", item: pageUrl }
        ]
      }
    ]
  };

  return (
    <main className="network-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />
      <header className="knowledge-header">
        <Link href="/" aria-label="Manapick トップへ"><BrandLogo compact /></Link>
        <Link className="knowledge-header-link" href="/study-plan/">7日学習プラン</Link>
      </header>
      <nav className="knowledge-breadcrumb" aria-label="パンくず">
        <Link href="/">ホーム</Link><span aria-hidden="true">›</span><span>Manapick Network</span>
      </nav>

      <section className="network-page-hero">
        <p className="section-eyebrow">MANAPICK NETWORK</p>
        <h1>学ぶところから、仕事の入口まで。</h1>
        <p>
          4サイトは同じものを重複掲載するのではなく、動画・AI・資格・仕事を分担しています。
          どこから入っても、同じ学習テーマを保ったまま次の判断へ進めます。
        </p>
      </section>

      <section className="network-stage-section" aria-labelledby="network-stage-title">
        <div className="network-section-heading">
          <p className="section-eyebrow">4つの役割</p>
          <h2 id="network-stage-title">必要なところだけ使う</h2>
          <p>順番は固定ではありません。いま困っている段階から始められます。</p>
        </div>
        <div className="network-stage-grid">
          {stages.map((stage) => (
            <a
              key={stage.key}
              className={`network-stage-card is-${stage.key}`}
              href={stage.href}
              {...(stage.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              <span className="network-stage-number">{stage.number}</span>
              <small>{stage.eyebrow}</small>
              <strong>{stage.title}</strong>
              <p>{stage.body}</p>
              <span className="network-stage-action">{stage.action} <span aria-hidden="true">→</span></span>
            </a>
          ))}
        </div>
      </section>

      <section className="network-route-section" aria-labelledby="network-route-title">
        <div className="network-section-heading">
          <p className="section-eyebrow">ジャンルを保って移動</p>
          <h2 id="network-route-title">10ジャンルの次の行き先</h2>
          <p>まず無料動画を試し、必要になった時点でAI・資格・仕事の詳しい情報へ進めます。</p>
        </div>
        <div className="network-route-list">
          {publishedGenreKeys.map((genre) => (
            <article key={genre}>
              <div>
                <strong>{genreDisplayName(genre)}</strong>
                <span>{genreVideoCount(genre)}本の視聴確認済み動画</span>
              </div>
              <nav aria-label={`${genreDisplayName(genre)}の関連サービス`}>
                <Link className="is-learn" href={`/genre/${genre}/`}>動画で学ぶ</Link>
                <a className="is-ai" href={manapickAiUrlForGenre(genre)} target="_blank" rel="noopener noreferrer">AIを選ぶ</a>
                <a className="is-license" href={manapickLicenseUrlForGenre(genre)} target="_blank" rel="noopener noreferrer">資格を選ぶ</a>
                <a className="is-career" href={manapickCareerUrlForGenre(genre)} target="_blank" rel="noopener noreferrer">仕事を知る</a>
              </nav>
            </article>
          ))}
        </div>
      </section>

      <section className="network-career-section" aria-labelledby="network-career-title">
        <div className="network-section-heading">
          <p className="section-eyebrow">仕事から逆引き</p>
          <h2 id="network-career-title">仕事内容を知って、学ぶ理由を決める</h2>
          <p>関心のある仕事を先に確認し、必要なスキルはManapickの動画とロードマップで試せます。</p>
        </div>
        <div className="network-career-grid">
          {careerEntrances.map((career) => (
            <article key={career.href}>
              <a href={career.href} target="_blank" rel="noopener noreferrer">
                <small>{career.profession}</small>
                <strong>{career.label}</strong>
                <span>仕事内容・必要スキルを見る <span aria-hidden="true">↗</span></span>
              </a>
              <Link href={career.guideHref}>関連する学習ロードマップ <span aria-hidden="true">→</span></Link>
            </article>
          ))}
        </div>
      </section>

      <section className="network-policy-section" aria-labelledby="network-policy-title">
        <div>
          <p className="section-eyebrow">収益と編集を分ける</p>
          <h2 id="network-policy-title">無料で試してから、必要な選択肢だけ比較</h2>
          <p>
            Manapickは無料動画を先に案内します。教材・講座などのPRリンクは明示し、報酬の有無で動画採点やランキングを操作しません。
            価格や申込条件は、リンク先の最新情報を確認してください。
          </p>
        </div>
        <div>
          <Link href="/about-score/">採点方法を見る</Link>
          <Link href="/affiliate/">広告・アフィリエイト方針</Link>
          <Link href="/shop/">補助教材を見る</Link>
        </div>
      </section>

      <section className="network-faq" aria-labelledby="network-faq-title">
        <p className="section-eyebrow">よくある質問</p>
        <h2 id="network-faq-title">4サイトを使う前に</h2>
        {faq.map((item) => (
          <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>
        ))}
      </section>
    </main>
  );
}
