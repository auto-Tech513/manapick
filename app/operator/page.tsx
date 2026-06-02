import PolicyPage from "@/components/PolicyPage";

export default function OperatorPage() {
  return (
    <PolicyPage
      title="運営者情報"
      lead="Manapickは、社会人の学び直しに役立つYouTube学習動画を独自レビュー付きで紹介する個人向けメディアです。"
      sections={[
        {
          heading: "運営方針",
          body: "キャリアアップ、副業、転職準備に役立つ学習動画を、ジャンル別ロードマップとManapickスコアで整理します。企業向けの業務改善受託や個別助言は行いません。"
        },
        {
          heading: "掲載基準",
          body: "実用性、正確性、分かりやすさ、体系性、信頼性、視聴体験、規約・権利適合の7軸で確認し、独自3行レビューを添えて掲載します。"
        }
      ]}
    />
  );
}
