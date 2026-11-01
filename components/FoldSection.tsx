import type { ReactNode } from "react";

type FoldSectionProps = {
  /** 外側の section に付けるクラス（既存のセクション装飾を引き継ぐ） */
  className?: string;
  titleId: string;
  title: ReactNode;
  eyebrow?: ReactNode;
  /** 閉じているときに見出しの横へ出す短い補足（例: 合計32/35） */
  hint?: ReactNode;
  /** 見出しに足すクラス（既存の見出しデザインを使うとき） */
  titleClassName?: string;
  defaultOpen?: boolean;
  children: ReactNode;
};

// 長い説明文を初期状態では閉じておくための共通セクション。
// 本文は HTML に残るため、検索エンジン・AI検索からは読める。見出しは summary 内に置くので、目次のページ内リンクも見出しまで移動できる。
export default function FoldSection({ className, titleId, title, eyebrow, hint, titleClassName, defaultOpen = false, children }: FoldSectionProps) {
  return (
    <section className={["fold-section", className].filter(Boolean).join(" ")} aria-labelledby={titleId}>
      <details className="fold-section-details" open={defaultOpen}>
        <summary className="fold-section-summary">
          <span className="fold-section-heading">
            {eyebrow ? <span className="section-eyebrow fold-section-eyebrow">{eyebrow}</span> : null}
            <h2 id={titleId} className={["fold-section-title", titleClassName].filter(Boolean).join(" ")}>{title}</h2>
            {hint ? <span className="fold-section-hint">{hint}</span> : null}
          </span>
          <span className="fold-section-toggle" aria-hidden="true" />
        </summary>
        <div className="fold-section-body">{children}</div>
      </details>
    </section>
  );
}
