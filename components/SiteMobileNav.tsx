"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import PwaInstallButton from "@/components/PwaInstallButton";
import { MANAPICK_AI_URL, MANAPICK_CAREER_URL, MANAPICK_COMPANY_URL, MANAPICK_LICENSE_URL } from "@/lib/brand-links";

type MenuGenre = { key: string; label: string };

// ホーム以外のページで使うモバイル下部ナビ。「メニュー」はサイトマップへ移動せず、その場でメニューを開く。
// メニューの見た目はホームのメニュー（ManapickApp の SiteMenuDrawer）と同じクラスを使う。
export default function SiteMobileNav({ genres }: { genres: MenuGenre[] }) {
  const [open, setOpen] = useState(false);
  const drawerRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => {
      drawerRef.current?.querySelector<HTMLElement>(".site-menu-close")?.focus();
    }, 0);
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  function close() {
    setOpen(false);
    buttonRef.current?.focus();
  }

  function trapFocus(event: ReactKeyboardEvent<HTMLElement>) {
    if (event.key !== "Tab") return;
    const focusable = Array.from(drawerRef.current?.querySelectorAll<HTMLElement>("button, a, summary") ?? []).filter(
      (item) => !item.hasAttribute("disabled") && item.getClientRects().length > 0
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  return (
    <>
      <nav className="mobile-bottom-nav site-bottom-nav" aria-label="クイックナビ">
        <Link href="/">
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M4 11.5 12 5l8 6.5" />
            <path d="M6.5 10v9h11v-9" />
          </svg>
          <span>ホーム</span>
        </Link>
        <Link href="/start/">
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.8-3.8" />
          </svg>
          <span>さがす</span>
        </Link>
        <Link href="/my/">
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M7 4h10v16l-5-3.5L7 20z" />
          </svg>
          <span>あとで見る</span>
        </Link>
        <button
          ref={buttonRef}
          type="button"
          aria-expanded={open}
          aria-controls="site-mobile-menu"
          aria-pressed={open}
          onClick={() => setOpen((value) => !value)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M4 7h16" />
            <path d="M4 12h16" />
            <path d="M4 17h16" />
          </svg>
          <span>メニュー</span>
        </button>
      </nav>

      {open ? (
        <div className="site-menu-layer">
          <button type="button" className="site-menu-backdrop" aria-label="メニューを閉じる" onClick={close} />
          <aside
            id="site-mobile-menu"
            ref={drawerRef}
            className="site-menu-drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby="site-mobile-menu-title"
            onKeyDown={trapFocus}
          >
            <div className="site-menu-head">
              <div className="site-menu-brand">
                <span className="site-menu-brand-mark" aria-hidden="true">✓</span>
                <div>
                  <h2 id="site-mobile-menu-title">Manapick</h2>
                  <p>学び直しを、最短ルートに。</p>
                </div>
              </div>
              <button type="button" className="site-menu-close" onClick={close} aria-label="メニューを閉じる">
                ×
              </button>
            </div>
            <nav className="site-menu-links" aria-label="メニューリンク">
              <p className="site-menu-section-label">まず選ぶ</p>
              <div className="site-menu-primary-grid">
                <Link className="site-menu-action-card is-primary" href="/" onClick={() => setOpen(false)}>
                  <span aria-hidden="true">⌂</span>
                  <strong>トップへ戻る</strong>
                  <small>Manapickのホーム</small>
                </Link>
                <Link className="site-menu-action-card" href="/start/" onClick={() => setOpen(false)}>
                  <span aria-hidden="true">◎</span>
                  <strong>今日の1本診断</strong>
                  <small>3つの質問から選ぶ</small>
                </Link>
                <Link className="site-menu-action-card" href="/study-plan/" onClick={() => setOpen(false)}>
                  <span aria-hidden="true">▤</span>
                  <strong>7日学習プラン</strong>
                  <small>カレンダーにも入れられる</small>
                </Link>
                <Link className="site-menu-action-card" href="/guide/" onClick={() => setOpen(false)}>
                  <span aria-hidden="true">⌁</span>
                  <strong>ロードマップ</strong>
                  <small>見る順番で進める</small>
                </Link>
              </div>

              <p className="site-menu-section-label">探す・続ける</p>
              <div className="site-menu-compact-grid">
                <Link href="/youtube-learning/" onClick={() => setOpen(false)}>おすすめ動画</Link>
                <Link href="/ranking/" onClick={() => setOpen(false)}>ランキング</Link>
                <Link href="/new/" onClick={() => setOpen(false)}>新着動画</Link>
                <Link href="/news/" onClick={() => setOpen(false)}>学びニュース</Link>
                <Link href="/my/" onClick={() => setOpen(false)}>マイページ</Link>
                <Link href="/learn/" onClick={() => setOpen(false)}>学習テーマ</Link>
                <Link href="/glossary/" onClick={() => setOpen(false)}>用語集</Link>
                <Link href="/faq/" onClick={() => setOpen(false)}>よくある質問</Link>
                <Link href="/network/" onClick={() => setOpen(false)}>姉妹サイト案内</Link>
                <Link href="/shop/" onClick={() => setOpen(false)}>manapi商店</Link>
              </div>

              <details className="site-menu-expandable">
                <summary>{genres.length}ジャンル一覧 <span aria-hidden="true">⌄</span></summary>
                <div className="site-menu-support-links">
                  {genres.map((genre) => (
                    <Link key={genre.key} href={`/genre/${genre.key}/`} onClick={() => setOpen(false)}>
                      {genre.label}
                    </Link>
                  ))}
                </div>
              </details>

              <div className="site-menu-install">
                <PwaInstallButton />
              </div>

              <details className="site-menu-expandable is-support">
                <summary>サイト情報・サポート <span aria-hidden="true">⌄</span></summary>
                <div className="site-menu-support-links">
                  <Link href="/about-score/" onClick={() => setOpen(false)}>採点方法</Link>
                  <Link href="/all/" onClick={() => setOpen(false)}>サイトマップ</Link>
                  <Link href="/operator/" onClick={() => setOpen(false)}>運営者情報</Link>
                  <Link href="/affiliate/" onClick={() => setOpen(false)}>広告・アフィリエイト</Link>
                  <Link href="/privacy/" onClick={() => setOpen(false)}>プライバシー</Link>
                  <Link href="/contact/" onClick={() => setOpen(false)}>お問い合わせ</Link>
                </div>
              </details>

              <p className="site-menu-section-label">姉妹サイト</p>
              <a className="site-menu-link site-menu-ai-link" href={MANAPICK_AI_URL} target="_blank" rel="noopener noreferrer">
                <span>manapick AI ↗</span>
                <small>AIツールを選ぶ</small>
              </a>
              <a className="site-menu-link site-menu-license-link" href={MANAPICK_LICENSE_URL} target="_blank" rel="noopener noreferrer">
                <span>manapick license ↗</span>
                <small>資格・検定を比較</small>
              </a>
              <a className="site-menu-link site-menu-career-link" href={MANAPICK_CAREER_URL} target="_blank" rel="noopener noreferrer">
                <span>manapick career ↗</span>
                <small>仕事内容と学ぶ順番を確認</small>
              </a>
              <a className="site-menu-link site-menu-company-link" href={MANAPICK_COMPANY_URL} target="_blank" rel="noopener noreferrer">
                <span>manapick company ↗</span>
                <small>企業の業績・年収を読む</small>
              </a>
            </nav>
          </aside>
        </div>
      ) : null}
    </>
  );
}
