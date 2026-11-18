"use client";

import { useEffect } from "react";

const SCRIPT_ID = "adsense-script";

// AdSense の自動広告（アンカー広告）は画面の上端または下端に固定で出る。サイトの固定部品（SP の下部ナビ・
// メニュー・乗り換えシート・全画面の検索候補）がその下に隠れて操作できなくならないよう、表示中のアンカー広告の
// 高さを CSS 変数 --ad-anchor-top / --ad-anchor-bottom（html 要素）に入れ、app/lookbook.css 末尾で避ける。
// PC のフッターは、下部アンカーが body の下余白より高い分（--ad-anchor-bottom-cover）だけ下に余白を足す。
// 広告そのものには触らない（位置・大きさ・表示は AdSense のまま）。
function measureAnchors() {
  const root = document.documentElement;
  let top = 0;
  let bottom = 0;
  const vh = window.innerHeight;
  document.querySelectorAll<HTMLElement>('ins.adsbygoogle[data-anchor-status="displayed"]').forEach((el) => {
    if (el.getAttribute("data-anchor-shown") === "false") return;
    const r = el.getBoundingClientRect();
    if (r.width < 1 || r.height < 1 || getComputedStyle(el).visibility === "hidden") return;
    // 画面の上半分にあるものは上部アンカー、下半分にあるものは下部アンカー（見えている部分の高さだけ数える）
    if (r.top < vh / 2) top = Math.max(top, Math.max(0, Math.min(r.bottom, vh)));
    else bottom = Math.max(bottom, Math.max(0, vh - Math.max(r.top, 0)));
  });
  // 下部アンカーのうち、AdSense が body に付ける下余白（padding-bottom）では足りずにページ末尾を覆う分。
  // PC のフッター最下段のリンクはこの分だけ上に上げる（広告 275px に対し body の余白は 154px 等）。広告が無ければ 0
  const bodyPad = bottom ? parseFloat(getComputedStyle(document.body).paddingBottom) || 0 : 0;
  const cover = Math.max(0, bottom - bodyPad);
  // 値が変わったときだけ書く（html の style の変更はこの監視自身を呼び直すため）
  for (const [name, value] of [
    ["--ad-anchor-top", `${Math.round(top)}px`],
    ["--ad-anchor-bottom", `${Math.round(bottom)}px`],
    ["--ad-anchor-bottom-cover", `${Math.round(cover)}px`]
  ]) {
    if (root.style.getPropertyValue(name) !== value) root.style.setProperty(name, value);
  }
}

export default function AdSenseScript({ client }: { client: string }) {
  useEffect(() => {
    if (window.location.hostname !== "manapick.app" || document.getElementById(SCRIPT_ID)) return;

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.async = true;
    script.crossOrigin = "anonymous";
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(client)}`;
    document.head.appendChild(script);
  }, [client]);

  useEffect(() => {
    let frame = 0;
    const schedule = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        measureAnchors();
      });
    };
    const observer = new MutationObserver(schedule);
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["data-anchor-status", "data-anchor-shown", "style"]
    });
    window.addEventListener("resize", schedule);
    schedule();
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", schedule);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
