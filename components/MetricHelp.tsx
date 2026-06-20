"use client";

import { useId, useState, type ReactNode } from "react";

export default function MetricHelp({ label, children }: { label: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const id = useId();

  return (
    <span className={open ? "metric-help is-open" : "metric-help"}>
      <button
        type="button"
        aria-label={label + "の説明"}
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((current) => !current)}
      >
        <span className="metric-help-icon" aria-hidden="true">?</span>
      </button>
      <span id={id} className="metric-help-body">{children}</span>
    </span>
  );
}
