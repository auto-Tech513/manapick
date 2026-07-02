"use client";

import type { ReactNode } from "react";
import { sendGaEvent } from "@/lib/retention";

type TrackedPrLinkProps = {
  className?: string;
  genre: string;
  href: string;
  kind: string;
  label: string;
  placement: string;
  store?: string;
  children: ReactNode;
};

export default function TrackedPrLink({
  className,
  genre,
  href,
  kind,
  label,
  placement,
  store,
  children
}: TrackedPrLinkProps) {
  return (
    <a
      className={className}
      href={href}
      target="_blank"
      rel="sponsored nofollow noopener"
      onClick={() => sendGaEvent("pr_link_click", { genre, kind, label, placement, store: store ?? "" })}
    >
      {children}
    </a>
  );
}
