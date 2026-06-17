import PolicyPage from "@/components/PolicyPage";

export default function PrivacyPage() {
  return (
    <PolicyPage
      title="プライバシーポリシー"
      lead="Manapickでは、アクセス解析や広告配信のため、必要な範囲でCookie等を利用します。"
      sections={[
        {
          heading: "取得する情報",
          body: "お問い合わせ時の入力内容、アクセス解析で取得される閲覧情報、広告配信に必要なCookie等を取得します。"
        },
        {
          heading: "利用目的",
          body: "お問い合わせ対応、掲載内容の改善、利用状況の把握、広告配信の最適化のために利用します。法令に基づく場合を除き、目的外利用は行いません。"
        },
        {
          heading: "外部サービス",
          body: "Search Console、Google Analytics 4（GA4）、Google AdSenseなどの広告配信サービス、アフィリエイトサービスを利用します。各サービスの規約とプライバシーポリシーに従い、サイト改善や広告配信のために必要な範囲で利用します。"
        },
        {
          heading: "広告配信について",
          body: "ManapickではGoogle AdSenseを利用します。Google AdSenseでは、利用者の興味に応じた広告を表示するためCookieを使用します。パーソナライズ広告はGoogleの広告設定ページで無効にできます。また、当サイトはAmazonアソシエイトおよび楽天アフィリエイトのプログラムに参加します。当サイトは適格販売により収入を得る場合があります。広告やアフィリエイトリンクを掲載する場合は、PR表記など読者が広告と分かる表示を行います。"
        },
        {
          heading: "アクセス解析について",
          body: "Manapickでは、サイト改善のためGoogle Analytics 4（GA4）を利用します。GA4はCookieを使用して閲覧状況を集計しますが、個人を直接特定する目的では利用しません。Cookieの利用を望まない場合は、ブラウザ設定でCookieを無効にするか、Google アナリティクス オプトアウト アドオンをご利用ください。"
        }
      ]}
    />
  );
}
