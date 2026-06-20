import type { ReactNode } from "react";

export default function MetricHelp({ label, children }: { label: string; children: ReactNode }) {
  return (
    <span className="metric-help">
      <button type="button" aria-label={label + "の説明"}>
        ?
      </button>
      <span className="metric-help-body">{children}</span>
    </span>
  );
}
