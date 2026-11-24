"use client";

import { useEffect } from "react";
import { sendGaEvent } from "@/lib/retention";
import { NETWORK_SOURCE_SITE, networkSiteOf } from "@/lib/network-links";

/**
 * 姉妹サイト宛てリンクのクリックを network_click として GA4 に送る（7サイト共通の名前・引数。2026-11-24、決定キュー #74。ai #43 と同じ仕様）。
 * - 引数：source_site（自サイト）・destination_site（行き先のキー）・destination_path（行き先のパス。クエリは送らない）・placement（置き場所）
 * - placement の値は ai #43 と同じ語彙（rail／header_menu／bottom_sheet／footer_route／transfer_cards／header／footer／content／other）。
 * - 本家で以前から各部品が送っていた network_click（placement=network_page_genre 等）は、二重に数えないようこの部品に一本化した。
 *   従来の *_crosslink_click（メニュー・トップの乗り換えカード）は各部品でそのまま送る（並行して送る）。
 * - 送信は sendGaEvent（gtag が無い環境では何もしない）。GA4 の読み込み条件（webdriver 判定）は app/layout.tsx のまま。
 * - 画面には何も描かない（document のクリックを捕まえるだけ）。
 */
const PLACEMENTS: Array<[string, string]> = [
  [".nw-rail", "rail"],
  [".mp-menu", "header_menu"],
  [".nw-sheet", "bottom_sheet"],
  [".nw-route", "footer_route"],
  [".lb-xfer-grid", "transfer_cards"]
];

function placementOf(anchor: HTMLAnchorElement): string {
  for (const [selector, name] of PLACEMENTS) {
    if (anchor.closest(selector)) return name;
  }
  if (anchor.closest("header")) return "header";
  if (anchor.closest("footer")) return "footer";
  if (anchor.closest("main")) return "content";
  return "other";
}

export default function NetworkClickTracker() {
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const target = event.target as Element | null;
      const anchor = target?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!anchor) return;
      const destinationSite = networkSiteOf(anchor.href);
      if (!destinationSite) return;
      let destinationPath = "/";
      try {
        destinationPath = new URL(anchor.href).pathname;
      } catch {
        return;
      }
      sendGaEvent("network_click", {
        source_site: NETWORK_SOURCE_SITE,
        destination_site: destinationSite,
        destination_path: destinationPath,
        placement: placementOf(anchor)
      });
    }
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  return null;
}
