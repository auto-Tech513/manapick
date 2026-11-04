import type { Metadata } from "next";
import PolicyPage from "@/components/PolicyPage";
import { absoluteUrl } from "@/lib/manapick";

const operatorTitle = "運営者情報 | Manapick";
const operatorDescription = "Manapickの運営方針、掲載基準、動画レビューの作り方、お問い合わせ先を説明します。";

export const metadata: Metadata = {
  title: operatorTitle,
  description: operatorDescription,
  alternates: {
    canonical: absoluteUrl("/operator/")
  },
  openGraph: {
    title: operatorTitle,
    description: operatorDescription,
    url: absoluteUrl("/operator/"),
    type: "article",
    images: [{ url: absoluteUrl("/brand/ogp-manapick.png"), width: 1200, height: 630, alt: "Manapick - 学び直しを、最短ルートに。" }]
  },
  twitter: {
    card: "summary",
    site: "@manapick_app",
    title: operatorTitle,
    description: operatorDescription
  }
};

export default function OperatorPage() {
  return (
    <PolicyPage
      title="運営者情報"
      lead="Manapickは、社会人の学び直しに役立つYouTube学習動画を、独自レビューと見る順ロードマップで整理する個人向けメディアです。"
      sections={[
        {
          heading: "Manapickをはじめた理由",
          body: "学びたい気持ちはあるのに、何から見ればいいか分からない。その迷いを減らすために、YouTubeの無料学習動画を7軸35点で採点し、まず見る1本から順に整理しています。学び直しを、最短ルートに近づけることがManapickの目的です。"
        },
        {
          heading: "運営者",
          body: "運営主体はManapick編集部です。掲載動画の削除要請、権利に関するご連絡、内容修正のご依頼は、/contact/ のお問い合わせフォームより受け付けています。公開できる範囲で運営情報を示し、個人の本名・住所・電話番号は掲載していません。"
        },
        {
          heading: "運営方針",
          body: "キャリアアップ、副業、転職準備に役立つ学習動画を、ジャンル別ロードマップとManapickスコアで整理します。企業向けの業務改善受託や個別助言は行いません。"
        },
        {
          heading: "掲載基準",
          body: "実用性、正確性、分かりやすさ、体系性、信頼性、視聴体験、規約・権利適合の7軸で確認し、独自3行レビューを添えて掲載します。"
        },
        {
          heading: "コンテンツの作り方（編集方針）",
          body: "掲載する動画はYouTube上で公開され、視聴できるものに限定し、独自レビューとManapickスコアを付けています。評価軸は、実用性、正確性・鮮度、分かりやすさ、体系性、信頼性、視聴体験、規約・権利の7つです。誤情報、釣り、情報商材誘導、誇大表現が強いものは採用せず、必要に応じて随時見直します。"
        },
        {
          heading: "採点の方法と確認の範囲",
          body: "掲載動画は、運営者の視聴、またはYouTube上の公開情報（タイトル・概要欄・チャプター・公開日・再生回数）の確認にもとづき、7軸35点で採点しています。全ての動画を全編視聴して採点しているわけではないため、確認の範囲は動画ごとに異なります。公開状態と埋め込み可否はYouTube Data APIで定期的に確認しています。軸ごとの内訳がある動画は、動画詳細ページと /about-score/（採点方法）で確認できます。"
        },
        {
          heading: "訂正・削除への対応",
          body: "掲載内容に誤りがある場合や、動画の削除・修正をご希望の場合は、/contact/ のお問い合わせフォームからご連絡ください。内容を確認し、誤りがあれば訂正し、必要に応じて掲載の差し替えや削除を行います。権利に関するご連絡も同じ窓口で受け付けています。"
        },
        {
          heading: "広告・アフィリエイトと採点の分離",
          body: "Manapickには広告と、教材・講座などのPR（アフィリエイト）リンクを含みます。PRを含む場合は明示し、報酬の有無で動画の採点や掲載順位を操作しません。詳しくは /affiliate/ の広告・アフィリエイト方針をご確認ください。"
        },
        {
          heading: "姉妹サイトについて",
          body: "Manapick Networkは、動画で学ぶManapick、AIを選ぶmanapick AI、資格を比べるmanapick license、仕事を知るmanapick career、企業を調べるmanapick companyの5サイトで構成しています。各サイトはそれぞれの運営方針で一次情報の確認を行っています。役割と使い分けは /network/ で案内しています。"
        },
        {
          heading: "更新と免責",
          body: "動画の著作権や内容は各チャンネルに帰属します。Manapickの紹介文やスコアは掲載時点の情報をもとにした編集上の整理であり、学習成果や資格合格を保証するものではありません。詳しくは /disclaimer/ の免責事項をご確認ください。"
        }
      ]}
    />
  );
}
