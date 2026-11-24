"use client";

import { useEffect, useRef, useState } from "react";
import { watchAdSlotStatus } from "@/lib/adsense-slot-status";

type AdsWindow = Window & {
  adsbygoogle?: unknown[];
};

// AdSense publisher ID。公開情報（ads.txt にも記載）。環境変数があれば優先。
const CLIENT =
  process.env.NEXT_PUBLIC_ADSENSE_ID?.trim() ||
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim() ||
  "ca-pub-4108900975353940";

// placement：GA4 の adsense_slot_status で枠を見分ける名前（2026-11-24、■5 T1-3。表示・DOM には出さない）
export default function AdSlot({ slot, placement }: { slot: string; placement: string }) {
  const slotRef = useRef<HTMLModElement>(null);
  const [state, setState] = useState<"pending" | "filled" | "empty">("pending");

  useEffect(() => {
    const element = slotRef.current;
    if (!element) return;

    let disposed = false;
    const statusWatch = watchAdSlotStatus(element, placement, slot);
    // 畳むのは未配信（unfilled）のときだけ。配信待ちの間は高さ 0・余白 0（globals.css）で空白を残さず、
    // filled になってから高さを取る。以前は 2.4 秒で配信待ちの枠も畳んでいたため、AdSense の処理が
    // それより遅れたページ下部の枠が二度と配信されなかった（2026-11-19 本番の実測：data-ad-status が付かないまま畳まれた枠あり）
    // unfill-optimized は AdSense が「空のページ内広告を埋める」設定で枠を最適化し、ページに関連する候補を表示している状態。
    // 公式ヘルプ（answer/10762946・16302564）では、display:none で隠す手法は最適化されていない unfilled の枠にだけ効くとされ、
    // 最適化は未配信枠の収益を守るためのものとされているので、畳まずに filled と同じ枠として表示する（2026-11-19）
    const inspect = () => {
      if (disposed) return;
      const status = element.getAttribute("data-ad-status");
      const hasIframe = Boolean(element.querySelector("iframe"));
      if (status === "unfilled") setState("empty");
      else if (status === "filled" || status === "unfill-optimized" || hasIframe) setState("filled");
    };

    const observer = new MutationObserver(inspect);
    observer.observe(element, {
      attributes: true,
      attributeFilter: ["data-ad-status", "style"],
      childList: true,
      subtree: true
    });

    try {
      const w = window as AdsWindow;
      (w.adsbygoogle = w.adsbygoogle || []).push({});
      statusWatch.report("requested");
    } catch {
      statusWatch.report("request_error");
      window.setTimeout(() => {
        if (!disposed) setState("empty");
      }, 0);
    }

    const t1 = window.setTimeout(inspect, 1200);
    // AdSense のスクリプト自体が読み込まれない環境（広告ブロック等）では配信待ちのまま残るので畳む。
    // スクリプトが読み込まれていれば（adsbygoogle.loaded）、data-ad-status が付くまで待つ
    const t2 = window.setTimeout(() => {
      if (disposed) return;
      const loaded = (window as AdsWindow & { adsbygoogle?: { loaded?: boolean } }).adsbygoogle?.loaded === true;
      if (!loaded && !element.getAttribute("data-ad-status") && !element.querySelector("iframe")) setState("empty");
    }, 8000);

    return () => {
      disposed = true;
      observer.disconnect();
      statusWatch.dispose();
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [slot, placement]);

  return (
    <ins
      ref={slotRef}
      className={`adsbygoogle ad-slot is-${state}`}
      style={{ display: "block" }}
      data-ad-client={CLIENT}
      data-ad-slot={slot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
