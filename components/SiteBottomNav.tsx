import Link from "next/link";

// 全ページ共通のモバイル下部ナビ（リンク式）。ホームには既存のインタラクティブ版
// (.mobile-bottom-nav) があるため、globals.css の :has() ルールで本コンポーネントは
// ホームでは非表示にし、サブページでのみ表示する。
export default function SiteBottomNav() {
  return (
    <nav className="mobile-bottom-nav site-bottom-nav" aria-label="クイックナビ">
      <Link href="/#genre-picker">
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.8-3.8" />
        </svg>
        <span>さがす</span>
      </Link>
      <Link href="/#roadmap">
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M5 19c4-9 10 1 14-9" />
          <path d="M15 9h4v4" />
          <circle cx="5" cy="19" r="1.4" />
        </svg>
        <span>ロードマップ</span>
      </Link>
      <Link href="/my/">
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M7 4h10v16l-5-3.5L7 20z" />
        </svg>
        <span>あとで見る</span>
      </Link>
      <Link href="/all/">
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M4 7h16" />
          <path d="M4 12h16" />
          <path d="M4 17h16" />
        </svg>
        <span>メニュー</span>
      </Link>
    </nav>
  );
}
