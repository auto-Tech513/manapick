const sqlGuide = {
slug: "sql",
genre: "prog",
title: "SQLの独学、文法の暗記から入ると使えない。SELECT→集計→JOIN→ウィンドウ関数で回す無料動画ロードマップ",
description:
"SQLの独学は「無料のPostgreSQLでまず触る → 実務の書き方 → 現場のノウハウ → ウィンドウ関数」の順で回すと迷いません。文法の暗記ではなく、動かしながら覚える無料YouTube動画4本の学習順です。",
publishedAt: "2026-11-24",
intro:
"SQLは、データベースから必要なデータを引き出したり、書き込んだりするための言語です。文法の一覧を暗記してから始めるより、無料のPostgreSQLを手元に用意して、SELECTから動かしながら回したほうが身につきます。**「無料のPostgreSQLでまず触る → 実務の書き方 → 現場のノウハウ → ウィンドウ関数」**の順で進めます。なお、SQL自体に実施団体の試験や合格基準はありません。",
learnPoints: [
"無料のPostgreSQLで学習環境を作れる",
"SELECTから集計・JOIN・ウィンドウ関数までの流れがわかる",
"実務でよく書くSQLのノウハウがわかる"
],
audience: "データを扱う仕事をしたい人、Excelの次にSQLを学びたい人、プログラミング学習でデータベースに触れる人向けです。",
conclusionBullets: [
{ label: "STEP1", text: "無料のPostgreSQLで、データベース操作をまず体験する"},
{ label: "STEP2", text: "実際に使うSQLの書き方を、徹底解説で身につける"},
{ label: "STEP3", text: "現場でよく書くSQLのノウハウを知る"},
{ label: "STEP4", text: "ウィンドウ関数（順位系）で仕上げる"}
],
conclusionClosing:
"4本をSTEP順に見るだけでも、SELECTからウィンドウ関数まで一周できます。あとは自分のデータで、集計とJOINの往復を繰り返してください。",
reasonTitle: "文法の暗記から入らない理由",
reasonParagraphs: [
"PostgreSQLは、SQL言語を使用・拡張するオープンソースのオブジェクトリレーショナルデータベースシステムです（PostgreSQL公式サイトの説明より）。無料で入手でき、Windows／Linux／macOSなどの主要OSで動作するため、学習環境を費用ゼロで用意できます。",
"初学者がつまずくのは、文法の意味ではなく「自分の手で動かしていない」ことです。先にPostgreSQLでSELECTを動かすと、取り出す・絞る・並べる、という大きな流れが頭に入り、その後の集計やJOINの学習が流れの中に位置づけられます。",
"製品ごとにSQLの方言はありますが、土台は標準SQLです。PostgreSQLはSQL:2023 Coreの必須機能177項目中、少なくとも170項目に準拠しています（version 19時点の公式記載より）。標準SQLを土台に覚えれば、ほかのデータベース製品にも応用が利きます。"
],
steps: [
{
title: "STEP1：無料のPostgreSQLでまず触る",
videos: [
{ ytid: "AoGmv8ljC0Y", why: "PostgreSQLでデータベース操作を初心者向けに解説しており、無料環境で最初に手を動かせる"}
]
},
{
title: "STEP2：実務で使うSQLの書き方を学ぶ",
videos: [
{ ytid: "8S-_SypyX_Q", why: "実際に使うSQLの書き方を徹底解説しており、SELECT・集計・JOINを実務の流れの中で学べる"}
]
},
{
title: "STEP3：現場のノウハウで差をつける",
videos: [
{ ytid: "VKm6t_u3DAY", why: "仕事でよく書くSQLのノウハウを解説しており、周りと差をつける書き方がわかる"}
]
},
{
title: "STEP4：ウィンドウ関数で仕上げる",
videos: [
{ ytid: "Wz8oIGgFNNE", why: "ウィンドウ関数（順位系）を完全攻略で解説しており、応用の入口を押さえられる"}
]
}
],
stumbleTable: [
{ stumble: "文法を覚えたのに書けない", cause: "一覧を暗記して、手を動かすのが後になっている", solution: "STEP1でPostgreSQLを用意し、SELECTを動かしながら覚える"},
{ stumble: "JOINで結果がおかしくなる", cause: "結合の種類を区別せずに書いている", solution: "STEP2の実務の書き方で、結合の考え方から整理する"},
{ stumble: "集計や順位づけで止まる", cause: "ウィンドウ関数を暗記で片づけようとしている", solution: "STEP4の順位系の解説で、動きを見ながら覚える"}
],
studyPlans: [
{ label: "平日30分×2週間", pace: "1日1本を目安に小分け視聴", plan: "見た日のうちに、自分のPostgreSQLで同じクエリを1回だけ試す"},
{ label: "週末集中×3週", pace: "土日で2〜3時間", plan: "1週目にSTEP1〜2、2週目にSTEP3、3週目にSTEP4で総復習する"}
],
stumblingBlocks: [
{ label: "「SQLに資格はあるの？」", text: "SQL自体に実施団体の試験や合格基準はありません。データベース製品ごとの認定試験はありますが、このガイドでは扱いません"},
{ label: "「PostgreSQLは無料なの？」", text: "PostgreSQLは無料かつオープンソースのデータベースで、Windows／Linux／macOSなどで動きます。学習環境を費用ゼロで用意できます"},
{ label: "次の一歩", text: "SQLの動画は8本あります。特定の操作だけを拾うときは、SQLトピックの動画一覧から探してください"}
],
faq: [
{ question: "SQLとは何ですか？", answer: "データベースから必要なデータを引き出したり、書き込んだりするための言語です。PostgreSQLのようなデータベース製品で使います。"},
{ question: "学習環境はどう用意しますか？", answer: "PostgreSQLは無料かつオープンソースで、主要OSで動きます。STEP1の動画で、PostgreSQLを使った操作の入門から始められます。"},
{ question: "製品ごとにSQLは違うのですか？", answer: "方言はありますが、土台は標準SQLです。PostgreSQLはSQL:2023 Coreの必須機能177項目中、少なくとも170項目に準拠しています（version 19時点の公式記載より）。"},
{ question: "どの順番で学べばいいですか？", answer: "このページでは、SELECT→集計→JOIN→ウィンドウ関数の順で進めます。実務で使う頻度の高いものから固めるのが現実的です。"},
{ question: "仕事で使えるようになるには？", answer: "STEP2〜3の実務の書き方と現場のノウハウを、自分のデータで試すのが近道です。Excelのデータで練習する場合は、Excelデータ分析ロードマップも合わせて確認してください。"}
],
relatedLinks: [
{ label: "SQLの動画一覧", href: "/genre/prog/SQL/"},
{ label: "Pythonロードマップ", href: "/guide/python/"},
{ label: "Gitロードマップ", href: "/guide/git-github/"},
{ label: "Excelデータ分析ロードマップ", href: "/guide/excel-data/"}
]
} as const;

export default sqlGuide;
