import type { Metadata } from "next";
import MyPageClient from "@/components/MyPageClient";
import { absoluteUrl } from "@/lib/manapick";

export const metadata: Metadata = {
  title: "マイページ | Manapick",
  description: "お使いのブラウザに保存したManapickの学習記録、連続学習日数、あとで見る、ロードマップ進捗を確認できます。",
  alternates: {
    canonical: absoluteUrl("/my/")
  },
  robots: {
    index: false,
    follow: false
  }
};

export default function MyPage() {
  return <MyPageClient />;
}
