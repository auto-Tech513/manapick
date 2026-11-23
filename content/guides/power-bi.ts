const powerBiGuide = {
slug: "power-bi",
genre: "data",
title: "Power BIは、見た目から作ると壊れる。データ整形→モデリング→ダッシュボードで回す無料動画ロードマップ",
description:
"Power BIの独学は「Desktopで基本操作 → 基礎知識 → データ整形とモデリング → スタースキーマ設計」の順で回すと迷いません。見た目から作らず、データの土台から固める無料YouTube動画4本の学習順です。",
publishedAt: "2026-11-24",
intro:
"Power BIは、データを集計してダッシュボードにするためのツールです。Power BI Desktopは無料でダウンロードして使えるレポート作成アプリで、学習は費用ゼロで始められます。ただし、Power BI DesktopはWindows向けアプリです。レポートの共有・発行には有償ライセンスが必要です。**「Desktopで基本操作 → 基礎知識 → データ整形とモデリング → スタースキーマ設計」**の順で回すと、見た目から作って壊れる失敗を避けられます。",
learnPoints: [
"無料のDesktopでダッシュボード作成を体験できる",
"データ整形とモデリングが先だとわかる",
"共有に必要なライセンスと費用の境界がわかる"
],
audience: "Excelの次にBIツールを学びたい人、仕事でダッシュボードを作ることになった人、データ分析の入口を探している人向けです。",
conclusionBullets: [
{ label: "STEP1", text: "Desktopでダッシュボード入門を体験する"},
{ label: "STEP2", text: "使い方の超入門で、基礎知識を整理する"},
{ label: "STEP3", text: "ビジュアル化より、データ整形とモデリングの重要性を知る"},
{ label: "STEP4", text: "スタースキーマ設計を実践して、モデリングを固める"}
],
conclusionClosing:
"4本をSTEP順に見るだけでも、基本操作からモデリングの実践まで一周できます。あとは自分のデータで、整形→モデリング→ダッシュボードの往復を繰り返してください。",
reasonTitle: "見た目から作らない理由",
reasonParagraphs: [
"Power BIでよくある失敗は、きれいなグラフから作り始めて、途中で数字が合わなくなることです。原因の多くは、データの整形とモデリングが後回しになっていることにあります。見た目のビジュアルは、土台のデータが整って初めて意味を持ちます。",
"モデルの設計は、使える容量や更新回数にも直結します。Proはモデル上限1GB・スケジュール更新8回/日、Premium Per Userはモデル上限100GB・更新48回/日が目安です。大きなデータをそのまま読み込む進め方では、すぐに上限に当たります。",
"このロードマップでは、STEP1〜2で基本操作と基礎知識を体験してから、STEP3でデータ整形とモデリングの重要性を学び、STEP4のスタースキーマ設計で実践します。見た目は最後に整える、という順番です。"
],
steps: [
{
title: "STEP1：Desktopでダッシュボード入門を体験する",
videos: [
{ ytid: "pzkyp1nsDTo", why: "基本操作からレポート作成までを初心者向けに解説しており、最初のダッシュボードを作れる"}
]
},
{
title: "STEP2：基礎知識を整理する",
videos: [
{ ytid: "nn4RPPR8X1w", why: "まず知っておきたい基礎知識を1本で整理しており、全体の地図が頭に入る"}
]
},
{
title: "STEP3：データ整形とモデリングの重要性を知る",
videos: [
{ ytid: "nFIFErYcgB0", why: "ビジュアル化よりデータ整形とモデリングが重要だと解説しており、つまずきどころを先回りできる"}
]
},
{
title: "STEP4：スタースキーマ設計で実践する",
videos: [
{ ytid: "rDRtQq8OQ0g", why: "Financial Sampleでスタースキーマ設計を実践しており、モデリングの流れを体験できる"}
]
}
],
stumbleTable: [
{ stumble: "グラフを作ったのに数字が合わない", cause: "見た目から作り、データ整形とモデリングを後回しにしている", solution: "STEP3で整形とモデリングを先に固め、STEP4の設計で実践する"},
{ stumble: "共有しようとして費用に気づく", cause: "Desktopは無料だが共有にはライセンスが必要だと知らない", solution: "FAQの料金を確認し、共有の前にProとPremium Per Userの違いを押さえる"},
{ stumble: "モデルの上限に当たる", cause: "大きなデータをそのまま読み込んでいる", solution: "Proはモデル上限1GB・更新8回/日、Premium Per Userは100GB・48回/日が目安です。用途に合うプランを選ぶ"}
],
studyPlans: [
{ label: "平日30分×2週間", pace: "1日1本を目安に小分け視聴", plan: "見た日のうちに、自分のDesktopで同じ操作を1回だけ試す"},
{ label: "週末集中×3週", pace: "土日で2〜3時間", plan: "1週目にSTEP1〜2、2週目にSTEP3、3週目にSTEP4で総復習する"}
],
stumblingBlocks: [
{ label: "「Power BIは無料で使えるの？」", text: "Power BI Desktopは無料でダウンロードして使えるレポート作成アプリです。ただし、レポートの共有・発行には有償ライセンスが必要です"},
{ label: "「ProとPremium Per Userの違いは？」", text: "Proは1ユーザーあたり月額$14.00（年払い）、Premium Per Userは月額$24.00（年払い）です（2025年4月1日からの現行価格）。モデル上限と更新回数も異なります。日本円の価格は公式ページで確認してください"},
{ label: "次の一歩", text: "BIの動画は11本あります。もっと見たいときは、BIトピックの動画一覧から探してください"}
],
faq: [
{ question: "Power BI Desktopは無料ですか？", answer: "無料でダウンロードして使えるレポート作成アプリです（Microsoft Learnの公式FAQより）。Windows向けアプリで、Microsoft StoreやMicrosoftダウンロードセンターで配布されています。"},
{ question: "共有するには何が必要ですか？", answer: "レポートの共有・発行には有償ライセンスが必要です。Proは1ユーザーあたり月額$14.00（年払い）、Premium Per Userは月額$24.00（年払い）です。いずれも2025年4月1日からの現行価格です。ProはMicrosoft 365 E5／Office 365 E5に含まれます。"},
{ question: "料金は日本円だといくらですか？", answer: "料金は国・通貨で異なる旨が公式ページに注記されています。日本円の公式価格はこのガイドでは確認していないため、Microsoftの公式料金ページで確認してください。"},
{ question: "モデルの上限はありますか？", answer: "Proはモデル上限1GB・スケジュール更新8回/日、Premium Per Userはモデル上限100GB・更新48回/日が目安です。"},
{ question: "Excelとの違いは何ですか？", answer: "Excelが表計算の道具なのに対し、Power BIは複数のデータを集めてダッシュボードにするためのツールです。Excelでデータを整える力がそのまま活きるため、Excelデータ分析ロードマップと合わせて学ぶと進めやすいです。"}
],
relatedLinks: [
{ label: "BIの動画一覧", href: "/genre/data/BI/"},
{ label: "Excelデータ分析ロードマップ", href: "/guide/excel-data/"},
{ label: "生成AI・自動化活用ガイド", href: "/guide/generative-ai/"}
]
} as const;

export default powerBiGuide;
