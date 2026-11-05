"use client";

import { sendGaEvent } from "@/lib/retention";

// Kit（フォームID 10147210）の登録エンドポイント。第三者JSは読み込まず、
// ネイティブフォームから直接POSTする（CSPの script-src / form-action に合わせた方式）。
// 送信先・項目名は Kit の埋め込みスクリプト実物から確認した（2026-11-05）。
const KIT_SUBSCRIBE_URL = "https://app.kit.com/forms/10147210/subscriptions";

type NewsletterSignupProps = {
  /** GA4計測用の設置場所（footer / news_article / guide_article） */
  placement: string;
  /** フッター内ではダーク背景に合わせる */
  dark?: boolean;
};

export default function NewsletterSignup({ placement, dark = false }: NewsletterSignupProps) {
  const inputId = `newsletter-email-${placement}`;
  const titleId = `newsletter-title-${placement}`;
  return (
    <section className={["newsletter-signup", dark ? "is-dark" : ""].filter(Boolean).join(" ")} aria-labelledby={titleId}>
      <p className="section-eyebrow">Newsletter</p>
      <h2 id={titleId}>学びの新着を、週1回のメールで</h2>
      <p>新着の学びニュースとおすすめ動画を、週に1回まとめてお届けします。登録は無料です。</p>
      <form
        action={KIT_SUBSCRIBE_URL}
        method="post"
        onSubmit={() => sendGaEvent("newsletter_subscribe", { placement })}
      >
        <label htmlFor={inputId}>メールアドレス</label>
        <div className="newsletter-signup-row">
          <input
            id={inputId}
            type="email"
            name="email_address"
            required
            autoComplete="email"
            placeholder="you@example.com"
          />
          <button type="submit">登録する</button>
        </div>
      </form>
      <small>登録すると確認メールが届きます（確認後に登録が完了します）。配信停止は各メールのリンクからいつでもできます。</small>
    </section>
  );
}
