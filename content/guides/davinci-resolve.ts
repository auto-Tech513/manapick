const davinciResolveGuide = {
slug: "davinci-resolve",
genre: "video",
title: "DaVinci Resolveは、無料版で編集・カラー・音声まで一つに集約する。無料動画4本の始め方ロードマップ",
description:
"DaVinci Resolveの独学は「インストール → 初めての編集 → 基本操作の一周 → 書き出し」の順で回すと迷いません。編集・カラー・VFX・音声を一つのソフトで実行でき、無償バージョンがある公式の仕組みから逆算した、無料YouTube動画4本の学習順です。",
publishedAt: "2026-11-24",
intro:
"DaVinci Resolveは、編集、カラーコレクション、VFX、モーショングラフィックス、オーディオポストプロダクションに加え、写真の編集も一つのソフトウェアで実行できる、Blackmagic Designの動画編集ソフトです。**まず知っておきたいのは、無償バージョンがあることです。誰でもダウンロードして使え、60fpsまでのほぼすべての8-bitフォーマットおよびUltra HD 3840x2160までの解像度に対応します。対応OSはMac、Windows、Linuxです（Blackmagic Design 公式ページ、2026-11-03クロール版を2026-11-24に確認）。**ソフトはメディア・フォト・カット・エディット・Fusion・カラー・Fairlight・デリバーの各ページに分かれており、タスクごとにワークスペースを切り替えて使います。フォトページはDaVinci Resolve 21で新たに加わりました。",
learnPoints: [
"無償バージョンの存在と対応範囲（Mac / Windows / Linux）がわかる",
"カット・エディット・カラー・デリバーなど各ページの役割がわかる",
"インストールから書き出しまでの一連の流れがわかる"
],
audience: "動画編集を無料で始めたい人、編集・カラー・音声を一つのソフトで学びたい人向けです。",
conclusionBullets: [
{ label: "STEP1", text: "無料版をインストールして初期設定を終える"},
{ label: "STEP2", text: "初めての編集チュートリアルで全体の流れをつかむ"},
{ label: "STEP3", text: "取り込み・カット・音楽・テロップ・書き出しを一周する"},
{ label: "STEP4", text: "失敗しない書き出し設定を身につけて仕上げる"}
],
conclusionClosing:
"4本をSTEP順に見るだけでも、インストールから書き出しまで一周できます。まずは無料版で1本作ってみて、足りない機能が出てきたら有償版を検討してください。",
reasonTitle: "無料版から始める理由",
reasonParagraphs: [
"DaVinci Resolveには無償バージョンがあり、ハリウッドのプロアーティストと同じツールの使用方法を誰でも学ぶことができます。公式ページは「このような最高のクリエイティブツールは、ハリウッドに限定されるべきではありません」と説明しています。編集を始めるのに、最初から有償ソフトを買う必要はありません。",
"無償版の対応範囲も公式に明記されています。60fpsまでのほぼすべての8-bitフォーマットおよびUltra HD 3840x2160までの解像度に対応し、マルチユーザーコラボレーションやHDRグレーディングもサポートしています。初めての1本を作るには十分な範囲です。",
"有償版のDaVinci Resolve Studioは、無償版のすべての機能に加えて、DaVinci AI Neural Engine、さらに多くのResolveFX、ノイズ除去、Magic Maskなどに対応し、120fpsまでの10-bitビデオおよび4Kを超える解像度をサポートします。つまり境界は明確で、「無料版で足りなくなったとき」に有償版を検討すればよいのです。このロードマップでは、まず無料版で1本作り切る順番にしています。"
],
steps: [
{
title: "STEP1：無料版をインストールして初期設定を終える",
videos: [
{ ytid: "Mbx95ssfFyE", why: "ダウンロードから初期設定までを完全解説しており、無料版の入手でつまずかない"}
]
},
{
title: "STEP2：初めての編集チュートリアルで全体の流れをつかむ",
videos: [
{ ytid: "vjFZXXPA888", why: "無料版を使った動画編集初心者向けの編集チュートリアルで、初めての編集の全体の流れをつかめる"}
]
},
{
title: "STEP3：取り込み・カット・音楽・テロップ・書き出しを一周する",
videos: [
{ ytid: "sNKBe3CPdOs", why: "素材の取り込み、カット、音楽・テロップ入れ、音量調整、書き出しまで網羅しており、基本操作を一周できる"}
]
},
{
title: "STEP4：失敗しない書き出し設定を身につけて仕上げる",
videos: [
{ ytid: "RE8WxRvmn6Y", why: "プロが教える失敗しない書き出し設定方法を解説しており、最後の書き出しで失敗しない"}
]
}
],
stumbleTable: [
{ stumble: "ページが多くて迷子になる", cause: "メディア・カット・エディット・Fusion・カラー・Fairlight・デリバーの役割を知らない", solution: "STEP2のチュートリアルで、まずエディットページ中心の流れをつかむ"},
{ stumble: "有償版が必要かわからない", cause: "無料版と有償版の境界を確認していない", solution: "無料版はUltra HDまで対応。STEP1〜4を無料版で終えてから検討する"},
{ stumble: "書き出しで失敗する", cause: "書き出し設定を確認せずにレンダリングしている", solution: "STEP4の書き出し設定の解説で、設定の確認手順を身につける"}
],
studyPlans: [
{ label: "平日30分×1週間", pace: "1日1本を目安に小分け視聴", plan: "STEP1でインストールを終え、STEP2〜3は操作を1日1テーマずつ進める"},
{ label: "週末集中×2週", pace: "土日で2〜3時間", plan: "1週目にSTEP1〜3で自分の素材を1本編集し、2週目にSTEP4の書き出し設定で仕上げる"}
],
stumblingBlocks: [
{ label: "「無料版でどこまでできるの？」", text: "公式ページでは、無償版は60fpsまでのほぼすべての8-bitフォーマットおよびUltra HD 3840x2160までの解像度に対応するとされています。マルチユーザーコラボレーションやHDRグレーディングもサポートしています（Blackmagic Design 公式ページ、2026-11-03クロール版を2026-11-24に確認）"},
{ label: "「有償版はいくら？」", text: "DaVinci Resolve Studioは有償版で、AIツールやさらに多くのエフェクト、10-bit・4K超の対応などが追加されます。価格は公式ページで確認してください。公式ページの掲載価格は変動することがあります"},
{ label: "次の一歩", text: "DaVinci Resolveの動画は19本あります。もっと見たいときは、DaVinciトピックの動画一覧から探してください。動画編集全体の流れは、動画編集ロードマップも役立ちます"}
],
faq: [
{ question: "DaVinci Resolveは無料で使えますか？", answer: "無償バージョンがあり、誰でもダウンロードして使えます。無償版は60fpsまでのほぼすべての8-bitフォーマットおよびUltra HD 3840x2160までの解像度に対応します（Blackmagic Design 公式ページ、2026-11-03クロール版を2026-11-24に確認）。"},
{ question: "対応しているOSは何ですか？", answer: "Mac、Windows、Linuxをサポートしています（Blackmagic Design 公式ページ、2026-11-03クロール版を2026-11-24に確認）。"},
{ question: "有償版と何が違いますか？", answer: "DaVinci Resolve Studioは、無償版のすべての機能に加えて、DaVinci AI Neural Engine、さらに多くのResolveFX、ノイズ除去、Magic Maskなどに対応し、120fpsまでの10-bitビデオおよび4Kを超える解像度をサポートします（Blackmagic Design 公式ページ、2026-11-03クロール版を2026-11-24に確認）。"},
{ question: "編集・カラー・音声は別ソフトが必要ですか？", answer: "一つのソフトウェアで実行できます。メディア・フォト・カット・エディット・Fusion・カラー・Fairlight・デリバーの各ページに分かれており、タスクごとにワークスペースを切り替えて使います（Blackmagic Design 公式ページ、2026-11-03クロール版を2026-11-24に確認）。"},
{ question: "動画タイトルのバージョン（19 / 20）と今の版は違いますか？", answer: "動画のバージョン表記と現行版は異なる場合があります。基本操作の流れは共通ですが、画面や機能の細部は公式ページやソフト内の最新表示で確認してください。"}
],
relatedLinks: [
{ label: "DaVinci Resolveの動画一覧", href: "/genre/video/DaVinci/"},
{ label: "動画編集ロードマップ", href: "/guide/video-editing/"},
{ label: "生成AIロードマップ", href: "/guide/generative-ai/"}
]
} as const;

export default davinciResolveGuide;
