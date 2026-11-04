"use client";

import type { MouseEvent, ReactNode } from "react";
import { sendGaEvent } from "@/lib/retention";

type TrackedGaLinkProps = {
  href: string;
  eventName: string;
  eventParams?: Record<string, string | number | boolean | null | undefined>;
  className?: string;
  target?: string;
  rel?: string;
  ariaLabel?: string;
  children: ReactNode;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
};

// サーバーコンポーネントのページからでも GA4 イベント付きリンクを使えるようにする
// ための小さなクライアントラッパー。遷移先・文言は変えず、クリック計測だけを足す。
export default function TrackedGaLink({
  href,
  eventName,
  eventParams,
  className,
  target,
  rel,
  ariaLabel,
  children,
  onClick
}: TrackedGaLinkProps) {
  return (
    <a
      href={href}
      className={className}
      target={target}
      rel={rel}
      aria-label={ariaLabel}
      onClick={(event) => {
        sendGaEvent(eventName, eventParams ?? {});
        onClick?.(event);
      }}
    >
      {children}
    </a>
  );
}
