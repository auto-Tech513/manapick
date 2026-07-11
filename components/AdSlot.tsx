"use client";

import { useEffect, useRef, useState } from "react";

type AdsWindow = Window & {
  adsbygoogle?: unknown[];
};

// AdSense publisher ID。公開情報（ads.txt にも記載）。環境変数があれば優先。
const CLIENT =
  process.env.NEXT_PUBLIC_ADSENSE_ID?.trim() ||
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim() ||
  "ca-pub-4108900975353940";

export default function AdSlot({ slot }: { slot: string }) {
  const slotRef = useRef<HTMLModElement>(null);
  const [state, setState] = useState<"pending" | "filled" | "empty">("pending");

  useEffect(() => {
    const element = slotRef.current;
    if (!element) return;

    let disposed = false;
    const inspect = () => {
      if (disposed) return;
      const status = element.getAttribute("data-ad-status");
      const hasIframe = Boolean(element.querySelector("iframe"));
      if (status === "unfilled") setState("empty");
      else if (status === "filled" || hasIframe) setState("filled");
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
    } catch {
      window.setTimeout(() => {
        if (!disposed) setState("empty");
      }, 0);
    }

    const t1 = window.setTimeout(inspect, 1200);
    const t2 = window.setTimeout(() => {
      if (disposed) return;
      const status = element.getAttribute("data-ad-status");
      const hasIframe = Boolean(element.querySelector("iframe"));
      if (status !== "filled" && !hasIframe) setState("empty");
    }, 2400);

    return () => {
      disposed = true;
      observer.disconnect();
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [slot]);

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
