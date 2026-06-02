import PolicyPage from "@/components/PolicyPage";

export default function DisclaimerPage() {
  return (
    <PolicyPage
      title="免責事項"
      lead="Manapickは学習情報の紹介を目的とするメディアです。掲載内容は一般的な情報提供であり、成果や収益、試験合格等を保証するものではありません。"
      sections={[
        {
          heading: "動画リンクについて",
          body: "掲載動画はYouTube公式リンクまたは公式埋め込みを前提に紹介します。動画ファイルのダウンロード、再配布、権利回避を促す機能は提供しません。"
        },
        {
          heading: "正確性について",
          body: "内容の正確性には注意しますが、学習分野やツールの仕様は変更される場合があります。最新情報は各公式情報も確認してください。"
        },
        {
          heading: "投資・資格等の扱い",
          body: "お金・投資ジャンルを扱う場合も、制度理解や学び方の紹介に限ります。個別銘柄の推奨や投資助言は行いません。"
        }
      ]}
    />
  );
}
