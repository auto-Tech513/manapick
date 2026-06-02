import PolicyPage from "@/components/PolicyPage";

export default function PrivacyPage() {
  return (
    <PolicyPage
      title="プライバシーポリシー"
      lead="Manapickでは、アクセス解析や広告配信を導入する場合、必要な範囲でCookie等を利用することがあります。v1では本番IDは未設定です。"
      sections={[
        {
          heading: "取得する情報",
          body: "お問い合わせ時の入力内容、アクセス解析で取得される閲覧情報、広告配信に必要なCookie等を取得する場合があります。"
        },
        {
          heading: "利用目的",
          body: "お問い合わせ対応、掲載内容の改善、利用状況の把握、広告配信の最適化のために利用します。法令に基づく場合を除き、目的外利用は行いません。"
        },
        {
          heading: "外部サービス",
          body: "Search Console、GA4、Microsoft Clarity、広告配信サービス等を導入する場合があります。導入時は各サービスの規約に従います。"
        }
      ]}
    />
  );
}
