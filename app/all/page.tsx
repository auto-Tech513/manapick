import type { Metadata } from "next";
import Link from "next/link";
import { genreDisplayName, publishedGenreKeys, videos } from "@/lib/manapick";
import { eligibleSubPagePath, eligibleSubPagesForGenre } from "@/lib/sub-pages";
import { guides, guidePath } from "@/lib/guides";
import { learningIntentPath, learningIntents } from "@/lib/learning-intents";
import { MANAPICK_AI_URL, MANAPICK_CAREER_URL, MANAPICK_LICENSE_URL } from "@/lib/brand-links";
import Phrase from "@/components/Phrase";
import BrandLogo from "@/components/BrandLogo";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "サイトマップ（全ページ一覧）| Manapick",
  description:
    "Manapickの全ジャンル・サブカテゴリ・ロードマップ・主要ページを一覧できるサイトマップです。学び直したいテーマから、見る順に整理した無料YouTube学習動画へ進めます。",
  alternates: { canonical: "/all/" }
};

const mainPages: { label: string; href: string }[] = [
  { label: "トップ", href: "/" },
  { label: "YouTube学習動画おすすめ", href: "/youtube-learning/" },
  { label: `YouTube学習動画${videos.length}本の独自集計`, href: "/research/youtube-learning-data/" },
  { label: "検索で多い学習テーマ", href: "/learn/" },
  { label: "学習ロードマップ一覧", href: "/guide/" },
  { label: "今日の1本診断", href: "/start/" },
  { label: "7日学習プラン", href: "/study-plan/" },
  { label: "Manapick Network（学ぶ・AI・資格・仕事）", href: "/network/" },
  { label: "ランキング", href: "/ranking/" },
  { label: "新着・更新した動画", href: "/new/" },
  { label: "用語集", href: "/glossary/" },
  { label: "よくある質問（FAQ）", href: "/faq/" },
  { label: "採点方法", href: "/about-score/" },
  { label: "運営者情報", href: "/operator/" },
  { label: "広告・アフィリエイトについて", href: "/affiliate/" },
  { label: "manapi商店（学習とAI作業の定番6商品）", href: "/shop/" },
  { label: "お問い合わせ", href: "/contact/" },
  { label: "プライバシーポリシー", href: "/privacy/" },
  { label: "免責事項", href: "/disclaimer/" }
];

export default function AllPagesIndex() {
  return (
    <main className="knowledge-page mp-sitemap-page">
      <header className="knowledge-header google-anno-skip">
        <Link href="/" aria-label="Manapick トップへ">
          <BrandLogo compact />
        </Link>
        <Link className="knowledge-header-link" href="/guide/">ロードマップ</Link>
      </header>
      <nav className="knowledge-breadcrumb" aria-label="パンくず">
        <Link href="/">ホーム</Link>
        <span aria-hidden="true">›</span>
        <span>サイトマップ</span>
      </nav>
      <section className="knowledge-hero">
        <p className="section-eyebrow">Sitemap</p>
        <h1><Phrase>サイトマップ（全ページ一覧）</Phrase></h1>
        <p>
          Manapickの全ジャンル・サブカテゴリ・ロードマップ・主要ページの一覧です。学び直したいテーマから、運営者が7軸35点で採点し“見る順”に整理した無料YouTube学習動画へ進めます。登録不要・全部無料です。
        </p>
      </section>

      <section className="knowledge-section" aria-labelledby="sitemap-genres">
        <h2 id="sitemap-genres">ジャンルとサブカテゴリ</h2>
        <div className="mp-sitemap-genres">
          {publishedGenreKeys.map((key) => {
            const subs = eligibleSubPagesForGenre(key);
            return (
              <section key={key} className="mp-sitemap-genre">
                <h3>
                  <Link href={`/genre/${key}/`}>{genreDisplayName(key)}の学習動画一覧</Link>
                </h3>
                {subs.length > 0 ? (
                  <ul className="mp-sitemap-list">
                    {subs.map((item) => (
                      <li key={item.sub}>
                        <Link href={eligibleSubPagePath(item)}>
                          <Phrase>{genreDisplayName(key)}：{item.sub}（{item.count}本）</Phrase>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </section>
            );
          })}
        </div>
      </section>

      <section className="knowledge-section" aria-labelledby="sitemap-guides">
        <h2 id="sitemap-guides">ロードマップ（見る順ガイド）</h2>
        <ul className="mp-sitemap-list">
          {guides.map((guide) => (
            <li key={guide.slug}>
              <Link href={guidePath(guide.slug)}><Phrase>{guide.title}</Phrase></Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="knowledge-section" aria-labelledby="sitemap-intents">
        <h2 id="sitemap-intents">検索で多い学習テーマ</h2>
        <ul className="mp-sitemap-list">
          {learningIntents.map((intent) => (
            <li key={intent.slug}>
              <Link href={learningIntentPath(intent.slug)}><Phrase>{intent.query}：{intent.h1}</Phrase></Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="knowledge-section" aria-labelledby="sitemap-main">
        <h2 id="sitemap-main">主要ページ</h2>
        <ul className="mp-sitemap-list">
          {mainPages.map((page) => (
            <li key={page.href}>
              <Link href={page.href}>{page.label}</Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="knowledge-section" aria-labelledby="sitemap-sisters">
        <h2 id="sitemap-sisters">姉妹サイト</h2>
        <ul className="mp-sitemap-list">
          <li>
            <a href={MANAPICK_AI_URL} target="_blank" rel="noopener">
              <Phrase>manapick AI（使えるAIと使い方を料金・無料枠つきで比較）</Phrase>
            </a>
          </li>
          <li>
            <a href={MANAPICK_LICENSE_URL} target="_blank" rel="noopener">
              <Phrase>manapick license（資格・検定の要件、費用、申込方法を比較）</Phrase>
            </a>
          </li>
          <li>
            <a href={MANAPICK_CAREER_URL} target="_blank" rel="noopener">
              <Phrase>manapick career（仕事内容、必要スキル、学ぶ順番を公式情報から確認）</Phrase>
            </a>
          </li>
        </ul>
      </section>
    </main>
  );
}
