import PolicyPage from "@/components/PolicyPage";

export default function ContactPage() {
  return (
    <PolicyPage
      title="お問い合わせ"
      lead="掲載動画の削除要請、権利に関するご連絡、内容修正のご依頼は、下記フォームより受け付けています。"
      sections={[
        {
          heading: "削除要請",
          body: "掲載動画の権利者または関係者から削除要請を受けた場合、内容を確認したうえで速やかに掲載の見直しを行います。"
        },
        {
          heading: "連絡方法",
          body: "動画URL、該当箇所、修正または削除をご希望の理由を分かる範囲でお知らせください。内容を確認し、必要に応じて掲載内容を更新します。"
        }
      ]}
    >
      <section className="rounded-lg border border-ink/10 bg-white p-5 shadow-card">
        <h2 className="text-xl font-black">お問い合わせフォーム</h2>
        <p className="mt-3 leading-8 text-ink/76">
          掲載内容に関するご連絡は、フォームからお送りください。返信が必要な内容には、3営業日以内を目安に返信いたします。
        </p>
        <a
          className="mt-5 inline-flex h-11 items-center justify-center rounded-md bg-primary px-5 text-sm font-black text-white shadow-button transition duration-200 ease-[var(--ease-standard)] hover:bg-primaryInk focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none"
          href="https://forms.gle/JzMbxUMYEucEZsbn6"
          target="_blank"
          rel="noopener"
        >
          お問い合わせフォームを開く
        </a>
      </section>
    </PolicyPage>
  );
}
