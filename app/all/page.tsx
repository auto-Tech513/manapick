import type { Metadata } from "next";
import Link from "next/link";
import { genreDisplayName, publishedGenreKeys } from "@/lib/manapick";
import { eligibleSubPagePath, eligibleSubPagesForGenre } from "@/lib/sub-pages";
import { guides, guidePath } from "@/lib/guides";
import { MANAPICK_AI_URL } from "@/lib/brand-links";

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
  { label: "今日の1本診断", href: "/start/" },
  { label: "ランキング", href: "/ranking/" },
  { label: "新着・更新した動画", href: "/new/" },
  { label: "用語集", href: "/glossary/" },
  { label: "よくある質問（FAQ）", href: "/faq/" },
  { label: "採点方法", href: "/about-score/" },
  { label: "運営者情報", href: "/operator/" },
  { label: "広告・アフィリエイトについて", href: "/affiliate/" },
  { label: "お問い合わせ", href: "/contact/" },
  { label: "プライバシーポリシー", href: "/privacy/" },
  { label: "免責事項", href: "/disclaimer/" }
];

export default function AllPagesIndex() {
  return (
    <main className="static-page" style={{ maxWidth: 880, margin: "0 auto", padding: "24px 16px 64px", lineHeight: 1.8 }}>
      <h1>サイトマップ（全ページ一覧）</h1>
      <p>
        Manapickの全ジャンル・サブカテゴリ・ロードマップ・主要ページの一覧です。学び直したいテーマから、運営者が視聴確認して7軸35点で採点し“見る順”に整理した無料YouTube学習動画へ進めます。登録不要・全部無料です。
      </p>

      <h2>ジャンルとサブカテゴリ</h2>
      {publishedGenreKeys.map((key) => {
        const subs = eligibleSubPagesForGenre(key);
        return (
          <section key={key} style={{ margin: "18px 0" }}>
            <h3 style={{ margin: "0 0 6px" }}>
              <Link href={`/genre/${key}/`}>{genreDisplayName(key)}の学習動画一覧</Link>
            </h3>
            {subs.length > 0 ? (
              <ul>
                {subs.map((item) => (
                  <li key={item.sub}>
                    <Link href={eligibleSubPagePath(item)}>
                      {genreDisplayName(key)}：{item.sub}（{item.count}本）
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </section>
        );
      })}

      <h2>ロードマップ（見る順ガイド）</h2>
      <ul>
        {guides.map((guide) => (
          <li key={guide.slug}>
            <Link href={guidePath(guide.slug)}>{guide.title}</Link>
          </li>
        ))}
      </ul>

      <h2>主要ページ</h2>
      <ul>
        {mainPages.map((page) => (
          <li key={page.href}>
            <Link href={page.href}>{page.label}</Link>
          </li>
        ))}
      </ul>

      <h2>姉妹サイト</h2>
      <ul>
        <li>
          <a href={MANAPICK_AI_URL} target="_blank" rel="noopener">
            manapick AI（使えるAIと使い方を料金・無料枠つきで比較）
          </a>
        </li>
      </ul>
    </main>
  );
}
