"use client";

import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import TransferNavItem from "@/components/TransferSheet";
import { OPEN_MENU_EVENT } from "@/components/RailMenuButton";
import SiteMenu, { type SiteMenuGenre, type SiteMenuProfession } from "@/components/SiteMenu";

// ホーム以外のページで使うモバイル下部ナビ。「メニュー」はサイトマップへ移動せず、その場でメニューを開く。
// メニューはホームと同じ部品（components/SiteMenu）。
export default function SiteMobileNav({
  genres,
  professions,
  breaks
}: {
  genres: SiteMenuGenre[];
  professions: SiteMenuProfession[];
  breaks: Record<string, number[]>;
}) {
  const [open, setOpen] = useState(false);
  const drawerRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  // PC 幅ではレールの「メニュー」ボタン（RailMenuButton）から開く。
  useEffect(() => {
    function handleOpen() {
      returnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      setOpen(true);
    }
    window.addEventListener(OPEN_MENU_EVENT, handleOpen);
    return () => window.removeEventListener(OPEN_MENU_EVENT, handleOpen);
  }, []);

  // restoreFocus は下の useEffect 内の handleKey から参照されるため、宣言を先に置く。
  function restoreFocus() {
    const target = returnFocusRef.current;
    returnFocusRef.current = null;
    if (target && document.contains(target) && target.getClientRects().length > 0) target.focus();
    else buttonRef.current?.focus();
  }

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => {
      drawerRef.current?.querySelector<HTMLElement>(".mp-menu-close")?.focus();
    }, 0);
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        restoreFocus();
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
    restoreFocus();
  }

  function trapFocus(event: ReactKeyboardEvent<HTMLElement>) {
    if (event.key !== "Tab") return;
    const focusable = Array.from(drawerRef.current?.querySelectorAll<HTMLElement>("button, a, summary, input") ?? []).filter(
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
      <nav className="mobile-bottom-nav site-bottom-nav google-anno-skip" aria-label="クイックナビ">
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- 意図した全ページ読み直し（トップへ着地）。client遷移では前ページのスクロール位置を引き継ぐため <Link> にしない。 */}
        <a href="/">
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M4 11.5 12 5l8 6.5" />
            <path d="M6.5 10v9h11v-9" />
          </svg>
          <span>ホーム</span>
        </a>
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- 意図した全ページ読み直し（検索位置へ着地）。client遷移では前ページのスクロール位置を引き継ぐため <Link> にしない。 */}
        <a href="/#search">
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.8-3.8" />
          </svg>
          <span>さがす</span>
        </a>
        <a href="/my/#my-saved">
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M7 4h10v16l-5-3.5L7 20z" />
          </svg>
          <span>あとで見る</span>
        </a>
        <TransferNavItem />
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
        <SiteMenu
          id="site-mobile-menu"
          drawerRef={drawerRef}
          genres={genres}
          professions={professions}
          breaks={breaks}
          onClose={close}
          onKeyDown={trapFocus}
        />
      ) : null}
    </>
  );
}
