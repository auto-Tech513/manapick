import type { Metadata } from "next";
import StartQuiz from "@/components/StartQuiz";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "3つの質問で“今日の1本”診断 | Manapick",
  description:
    "ジャンル・レベル・使える時間の3つの質問に答えるだけで、7軸35点で採点した学習動画から“今日まず見るべき1本”を提案します。登録不要・全部無料。",
  alternates: { canonical: "/start/" }
};

export default function StartPage() {
  return (
    <main className="static-page bg-paper">
      <section className="mx-auto max-w-5xl px-4 py-7 pb-20 leading-8 min-[760px]:px-6 min-[760px]:py-10">
        <div className="rounded-2xl border border-line bg-[linear-gradient(135deg,#f8fbff_0%,#eff8f4_100%)] p-5 shadow-card min-[760px]:p-8">
          <p className="text-sm font-black text-leaf">3問で決める</p>
          <h1 className="mt-2 max-w-3xl text-3xl font-black leading-tight text-ink min-[760px]:text-5xl">
            “今日の1本”を、迷わず選ぶ。
          </h1>
          <p className="mt-4 max-w-3xl text-base font-bold leading-8 text-muted min-[760px]:text-lg">
            ジャンル・レベル・使える時間に答えるだけで、運営者が視聴確認し7軸35点で採点した学習動画から、
            <strong className="text-primaryInk">今日まず見るべき1本</strong>を提案します。登録不要・全部無料です。
          </p>
          <div className="mt-5 flex flex-wrap gap-2 text-xs font-black text-primaryInk">
            <span className="rounded-pill border border-line bg-white px-3 py-1">視聴確認済みを優先</span>
            <span className="rounded-pill border border-line bg-white px-3 py-1">7軸35点で採点</span>
            <span className="rounded-pill border border-line bg-white px-3 py-1">スマホで1分診断</span>
          </div>
        </div>
        <StartQuiz />
      </section>
    </main>
  );
}
