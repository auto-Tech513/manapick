"use client";

export const OPEN_MENU_EVENT = "manapick:open-menu";

// PC 幅でもメニュー（components/SiteMenu）を開けるように、全ページ最上部のレールに置くボタン。
// SP では下部タブの「メニュー」を使うため表示しない（lookbook.css）。
export default function RailMenuButton() {
  return (
    <button type="button" className="nw-rail-menu" aria-haspopup="dialog" onClick={() => window.dispatchEvent(new Event(OPEN_MENU_EVENT))}>
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M4 7h16M4 12h16M4 17h16" />
      </svg>
      <span>メニュー</span>
    </button>
  );
}
