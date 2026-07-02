import type { Metadata } from "next";
import PolicyPage from "@/components/PolicyPage";
import { absoluteUrl } from "@/lib/manapick";

const affiliateTitle = "広告・アフィリエイトについて | Manapick";
const affiliateDescription = "Manapickの広告・アフィリエイトリンクの扱い、選定基準、PR表記の方針を説明します。";

export const metadata: Metadata = {
  title: affiliateTitle,
  description: affiliateDescription,
  alternates: {
    canonical: absoluteUrl("/affiliate/")
  },
  openGraph: {
    title: affiliateTitle,
    description: affiliateDescription,
    url: absoluteUrl("/affiliate/"),
    type: "article"
  },
  twitter: {
    card: "summary",
    site: "@manapick_app",
    title: affiliateTitle,
    description: affiliateDescription
  }
};

export default function AffiliatePage() {
  return (
    <PolicyPage
      title="広告・アフィリエイトについて"
      lead="Manapickでは、学習動画とあわせて使える教材・講座を紹介する場合があります。読者が広告と分かるよう、PR表記を行います。"
      sections={[
        {
          heading: "参加している広告・アフィリエイトプログラム",
          body: "当サイトは、A8.net、もしもアフィリエイト、楽天アフィリエイト、Amazonアソシエイト等のアフィリエイトプログラムに参加し、リンク経由の申込や購入により広告収益を得る場合があります。Amazonリンクにはアソシエイトタグを含む場合があります。"
        },
        {
          heading: "Amazonアソシエイトについて",
          body: "ManapickはAmazonのアソシエイトとして、適格販売により収入を得ています。Amazonへのリンクは、書籍名でAmazon.co.jp内を確認できる検索リンクとして設置し、価格・在庫・配送条件などはAmazon.co.jp上の最新情報をご確認いただく方針です。"
        },
        {
          heading: "掲載基準",
          body: "紹介する教材・講座は、Manapickのジャンルやロードマップとの関連性、学習の補助として使いやすいか、読者が公式情報を確認しやすいかを見て選びます。報酬額だけで掲載順位を操作することはありません。"
        },
        {
          heading: "価格・条件について",
          body: "教材や講座の価格、キャンペーン、無料体験、資料請求の条件は変更されることがあります。申込や購入の前に、必ず各公式サイトの最新情報をご確認ください。"
        },
        {
          heading: "PR表記",
          body: "アフィリエイトリンクを含むページや枠では、「PR」「広告」「本ページにはアフィリエイト広告（PR）を含みます。」など、広告であることが分かる表示を行います。"
        }
      ]}
    />
  );
}
