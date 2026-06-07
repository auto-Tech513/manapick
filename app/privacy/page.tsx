import PolicyPage from "@/components/PolicyPage";

export default function PrivacyPage() {
  return (
    <PolicyPage
      title="プライバシーポリシー"
      lead="Manapickでは、アクセス解析や広告配信を導入する場合、必要な範囲でCookie等を利用することがあります。"
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
        },
        {
          heading: "広告配信について",
          body: "Manapickでは、今後Google AdSenseを利用する予定です。Google AdSenseでは、利用者の興味に応じた広告を表示するためCookieを使用する場合があります。パーソナライズ広告はGoogleの広告設定ページで無効にできます。また、当サイトはAmazonアソシエイトおよび楽天アフィリエイトのプログラムに参加する予定です。当サイトは適格販売により収入を得る場合があります。実際に広告やアフィリエイトリンクを掲載する場合は、PR表記など読者が広告と分かる表示を行います。"
        },
        {
          heading: "アクセス解析について",
          body: "Manapickでは、サイト改善のためGoogle Analytics 4（GA4）を利用する場合があります。GA4はCookieを使用して閲覧状況を集計しますが、個人を直接特定する目的では利用しません。Cookieの利用を望まない場合は、ブラウザ設定でCookieを無効にするか、Google アナリティクス オプトアウト アドオンをご利用ください。"
        }
      ]}
    />
  );
}
