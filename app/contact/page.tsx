import PolicyPage from "@/components/PolicyPage";

export default function ContactPage() {
  return (
    <PolicyPage
      title="お問い合わせ"
      lead="掲載動画の削除要請、権利に関するご連絡、内容修正の依頼はこちらの窓口で受け付ける想定です。v1ではフォーム接続前の雛形です。"
      sections={[
        {
          heading: "削除要請",
          body: "掲載動画の権利者または関係者から削除要請を受けた場合、内容を確認したうえで速やかに掲載の見直しを行います。"
        },
        {
          heading: "連絡方法",
          body: "本番公開前に連絡用フォームまたはメールアドレスを設置します。公開デプロイ、アカウント作成、外部サービス連携は承認後に行います。"
        }
      ]}
    />
  );
}
