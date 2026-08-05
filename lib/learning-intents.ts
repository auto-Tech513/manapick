import { genreDisplayName, scoreText, subGenrePath, type Video, videos } from "@/lib/manapick";
import { guidePath } from "@/lib/guides";

export type LearningIntent = {
  slug: string;
  query: string;
  title: string;
  description: string;
  h1: string;
  lead: string;
  answer: string;
  audience: string;
  lastReviewed?: string;
  officialSources?: readonly {
    label: string;
    href: string;
    note: string;
  }[];
  filters: {
    genres: string[];
    subtopics?: string[];
    keywords: string[];
  };
  steps: readonly {
    title: string;
    body: string;
    href: string;
  }[];
  links: readonly {
    label: string;
    href: string;
    note: string;
  }[];
  faq: readonly {
    question: string;
    answer: string;
  }[];
};

export const learningIntents: readonly LearningIntent[] = [
  {
    slug: "excel-statistics",
    query: "エクセル統計 使い方",
    title: "エクセル統計の使い方｜無料動画でExcel分析を始める順番 | Manapick",
    description: "エクセル統計の使い方を、無料YouTube動画で学ぶ順番に整理。Excel分析、Power BI、パワークエリまで、初心者が迷わず始める入口です。",
    h1: "エクセル統計の使い方を、無料動画で順番に学ぶ",
    lead: "平均やグラフだけで止まらず、Excelで表を整え、傾向を読み、必要ならPower BIやパワークエリへ進むための入口です。",
    answer: "まずはExcelで集計とグラフの感覚をつかみ、次にPower BIやパワークエリで繰り返し作業を減らす順番が安全です。統計用語の暗記から入るより、手元の表を1つ選んで動画を見ながら操作するほうが続きます。",
    audience: "Excelでデータ分析を始めたい社会人、統計が苦手だが業務の数字を読めるようになりたい人",
    lastReviewed: "2026-08-01",
    officialSources: [
      {
        label: "Microsoft サポート: ピボットテーブルでデータを分析する",
        href: "https://support.microsoft.com/ja-JP/Excel/get-started/create-a-pivottable-to-analyze-worksheet-data",
        note: "Excelで集計・分析を始める公式手順"
      }
    ],
    filters: { genres: ["data"], subtopics: ["Excel", "BI", "統計"], keywords: ["Excel", "エクセル", "統計", "データ分析", "Power BI", "パワークエリ"] },
    steps: [
      { title: "Excelで表とグラフを触る", body: "まず手元の表で並べ替え、集計、グラフ化を試します。統計用語は後からで十分です。", href: guidePath("excel-data") },
      { title: "Power BIで見える化する", body: "Excelで限界を感じたら、ダッシュボード化の動画へ進みます。", href: subGenrePath("data", "BI") },
      { title: "パワークエリで整形を自動化する", body: "毎回同じ手作業があるなら、パワークエリで取り込みと整形を覚えると効果が出やすいです。", href: subGenrePath("data", "Excel") }
    ],
    links: [
      { label: "Excelデータ分析ロードマップ", href: guidePath("excel-data"), note: "Excel分析からPower BI、パワークエリまで順番に確認" },
      { label: "Power BI動画一覧", href: subGenrePath("data", "BI"), note: "ダッシュボードや基本操作を比較" },
      { label: "データ分析ジャンル", href: "/genre/data/", note: "データ分析・DXの全動画を見る" }
    ],
    faq: [
      { question: "エクセル統計は何から始めればいい？", answer: "平均、割合、並べ替え、グラフ、ピボットの順に、実際の表を触りながら進めるのがおすすめです。" },
      { question: "統計の数式が苦手でも大丈夫？", answer: "大丈夫です。最初は数式より、表を整えて傾向を見ることを優先すると理解しやすくなります。" },
      { question: "Power BIはいつ学ぶべき？", answer: "Excelで同じ集計やグラフを何度も作っているなら、Power BIで自動化・見える化を学ぶタイミングです。" }
    ]
  },
  {
    slug: "chatgpt-getting-started",
    query: "ChatGPT 始め方",
    title: "ChatGPTの始め方｜無料版を初めて使う手順とおすすめ動画 | Manapick",
    description: "ChatGPTの始め方を初心者向けに整理。公式ページを開く、最初の質問を送る、履歴や注意点を確認する順に、無料の解説動画と一次情報を案内します。",
    h1: "ChatGPTの始め方を、初めての人向けに3ステップで整理",
    lead: "公式ページを開いて最初の質問を送るところから、無料版で確認したい機能、入力時の注意点までを順番に確認します。",
    answer: "まず公式のChatGPTを開き、身近な質問を1つ具体的に入力します。対応地域ではログイン前に試せる場合がありますが、会話履歴の保存や設定を使うならアカウントでの利用が必要です。機能や利用上限は変わるため、最新条件はOpenAI公式情報で確認します。",
    audience: "ChatGPTを初めて使う人、無料版で何ができるかを確認してから学びたい人",
    lastReviewed: "2026-08-01",
    officialSources: [
      {
        label: "OpenAI Help Center: What is ChatGPT?",
        href: "https://help.openai.com/en/articles/12677804",
        note: "開始方法、主な用途、データとプライバシーの公式FAQ"
      },
      {
        label: "ChatGPT 公式ページ",
        href: "https://chatgpt.com/",
        note: "実際にChatGPTを開いて試す"
      }
    ],
    filters: {
      genres: ["ai"],
      subtopics: ["ChatGPT"],
      keywords: ["ChatGPT", "始め方", "使い方", "初心者", "無料", "入門"]
    },
    steps: [
      {
        title: "公式ページを開いて、質問を1つ送る",
        body: "『来週の学習計画を3日分作って』のように、目的と条件を短く書いて試します。",
        href: "https://chatgpt.com/"
      },
      {
        title: "初心者向け動画で基本操作を確認する",
        body: "画面の見方、質問の続け方、無料版で使える機能を動画で確認します。",
        href: subGenrePath("ai", "ChatGPT")
      },
      {
        title: "ChatGPT・Gemini・Claudeの違いを知る",
        body: "1つに決めつけず、文章、検索連携、長文整理など目的ごとに比較します。",
        href: guidePath("generative-ai")
      }
    ],
    links: [
      { label: "ChatGPT動画一覧", href: subGenrePath("ai", "ChatGPT"), note: "入門・活用・注意点の動画を比較" },
      { label: "生成AIロードマップ", href: guidePath("generative-ai"), note: "ChatGPT・Gemini・Claudeを学ぶ順番" },
      { label: "使えるAIを選ぶ", href: "https://ai.manapick.app/", note: "料金・無料枠・使い方を姉妹サイトで確認" }
    ],
    faq: [
      {
        question: "ChatGPTはアカウントなしでも始められますか？",
        answer: "対応地域ではログイン前に試せる場合があります。会話履歴の保存や設定を使う場合は、アカウントでの利用が必要です。"
      },
      {
        question: "ChatGPTは無料で使えますか？",
        answer: "無料版があります。利用できる機能や回数の上限は変わるため、利用時点の公式画面とOpenAI Help Centerで確認してください。"
      },
      {
        question: "最初に何を入力すればいい？",
        answer: "目的、前提、希望する形式を短く伝えます。たとえば『初心者向けに、15分でできるExcel練習を3つ、箇条書きで』のように具体化します。"
      },
      {
        question: "入力してはいけない情報はありますか？",
        answer: "個人情報、社外秘、未公開の顧客情報など、第三者に見られて困る情報は入力しないでください。所属先の利用ルールも確認します。"
      }
    ]
  },
  {
    slug: "youtube-thumbnail",
    query: "youtube サムネイル 作り方",
    title: "YouTubeサムネイルの作り方｜初心者向け無料動画ロードマップ | Manapick",
    description: "YouTubeサムネイルの作り方を無料動画で学ぶ入口。構図、文字、無料ツール、動画編集とのつながりまで見る順に整理します。",
    h1: "YouTubeサムネイルの作り方を、初心者向けに見る順で整理",
    lead: "クリックされる見た目だけでなく、動画内容とずれないサムネイルを作るために、構図・文字・ツールを順番に学びます。",
    answer: "最初は無料ツールで1枚作り、次に文字量・構図・背景の見せ方を直す順番が現実的です。再生数を保証する表現ではなく、内容が伝わる入口を整えることを目的にします。",
    audience: "YouTubeやSNS用のサムネイルを初めて作る人、動画編集とデザインを一緒に整えたい人",
    filters: { genres: ["video"], subtopics: ["デザイン"], keywords: ["サムネイル", "YouTube", "デザイン", "Photoshop", "無料"] },
    steps: [
      { title: "無料ツールで1枚作る", body: "まず完成形を1つ作り、文字や画像の置き方を体験します。", href: subGenrePath("video", "デザイン") },
      { title: "構図と文字量を直す", body: "クリックだけを狙わず、何の動画か一目で分かる情報量に整えます。", href: subGenrePath("video", "デザイン") },
      { title: "動画編集と合わせて改善する", body: "サムネイルと動画内容のずれを減らすと、視聴後の納得感も上がります。", href: guidePath("video-editing") }
    ],
    links: [
      { label: "デザイン動画一覧", href: subGenrePath("video", "デザイン"), note: "サムネイル制作に近い動画をまとめて確認" },
      { label: "動画編集ロードマップ", href: guidePath("video-editing"), note: "編集の流れとサムネイルを一緒に整理" },
      { label: "動画編集ジャンル", href: "/genre/video/", note: "CapCut、Premiere、DaVinciも見る" }
    ],
    faq: [
      { question: "YouTubeサムネイルは無料ツールだけで作れますか？", answer: "はい。無料ツールでも基本は学べます。まず1枚作り、必要になった段階で有料ツールを検討すれば十分です。" },
      { question: "何を一番意識すべき？", answer: "動画の内容が一目で伝わることです。文字を増やしすぎず、誰向けの動画かが分かる構図にします。" },
      { question: "サムネイルだけ学べば伸びますか？", answer: "サムネイルは入口です。動画内容とずれると満足度が下がるため、編集や構成も合わせて改善するのがおすすめです。" }
    ]
  },
  {
    slug: "python-hard",
    query: "python 難しい",
    title: "Pythonは難しい？初心者が詰まる理由と無料動画の順番 | Manapick",
    description: "Pythonが難しいと感じる初心者向けに、環境構築、文法、エラー、Webアプリまで無料動画で学ぶ順番を整理します。",
    h1: "Pythonは難しい？つまずく理由を分けて、無料動画で進める",
    lead: "Pythonが難しい原因は、文法そのものより環境構築、エラー、作りたいものの不明確さに分かれることが多いです。",
    answer: "Pythonは最初から全部理解しようとすると難しくなります。短い入門で動かす、文法を一周する、作りたい小さな題材へ進む、という順番に分けると続けやすくなります。",
    audience: "Pythonを始めたが環境構築やエラーで止まった人、何を作ればいいか分からない人",
    lastReviewed: "2026-08-01",
    officialSources: [
      {
        label: "Python 公式チュートリアル",
        href: "https://docs.python.org/ja/3/tutorial/",
        note: "Pythonの基本構文と標準機能を確認する一次情報"
      }
    ],
    filters: { genres: ["prog"], subtopics: ["Python", "Web開発"], keywords: ["Python", "入門", "Flask", "できること", "ロードマップ"] },
    steps: [
      { title: "まず8〜20分で動かす", body: "長尺の前に、短い動画でPythonが動く感覚を作ります。", href: subGenrePath("prog", "Python") },
      { title: "文法を一周する", body: "変数、条件分岐、繰り返し、関数をざっくり確認します。暗記より実行を優先します。", href: guidePath("python") },
      { title: "小さなWebアプリや自動化へ進む", body: "目的が見えると学ぶ理由が残ります。Flaskや自動化の入口へ進みます。", href: subGenrePath("prog", "Web開発") }
    ],
    links: [
      { label: "Pythonロードマップ", href: guidePath("python"), note: "環境構築からWebアプリまで見る順で確認" },
      { label: "Python動画一覧", href: subGenrePath("prog", "Python"), note: "短い入門と長尺講座を比較" },
      { label: "プログラミングジャンル", href: "/genre/prog/", note: "Git、SQL、Web開発も確認" }
    ],
    faq: [
      { question: "Pythonは初心者には難しいですか？", answer: "環境構築やエラーで難しく感じることがあります。短い動画で動かしてから文法へ進むと負担を減らせます。" },
      { question: "何時間くらい学べばいい？", answer: "最初は数時間で全体像をつかみ、あとは作りたいものに合わせて小さく反復するのがおすすめです。" },
      { question: "エラーが出たらどうすればいい？", answer: "エラー文をそのまま検索し、原因を1つずつ切り分けます。生成AIにエラー文を説明してもらうのも有効です。" }
    ]
  },
  {
    slug: "web-marketing-youtube",
    query: "マーケティング youtube おすすめ",
    title: "マーケティングをYouTubeで学ぶおすすめ無料動画｜初心者向け | Manapick",
    description: "マーケティングをYouTubeで学びたい初心者向けに、Webマーケ、SEO、SNS、GA4の無料動画を学ぶ順番で整理します。",
    h1: "マーケティングをYouTubeで学ぶなら、全体像からSNS・SEOへ進む",
    lead: "おすすめ動画をただ並べるのではなく、全体像、SNS運用、SEO、計測の順に分けて、仕事で使いやすい流れにします。",
    answer: "マーケティングは最初に全体像を見て、次にSNSやSEOなど使う場面を絞ると学びやすくなります。再生数だけで選ぶより、目的に近い動画を順番に見るほうが定着します。",
    audience: "Webマーケティングを無料動画で始めたい人、SNSやSEOを仕事に使いたい人",
    lastReviewed: "2026-08-01",
    officialSources: [
      {
        label: "Google アナリティクスの基本操作",
        href: "https://support.google.com/analytics/answer/9367631?hl=ja-JP",
        note: "GA4の画面と主要機能を確認するGoogle公式ヘルプ"
      }
    ],
    filters: { genres: ["marke"], subtopics: ["Webマーケ", "SEO", "SNS"], keywords: ["マーケ", "SEO", "SNS", "GA4", "Instagram", "X"] },
    steps: [
      { title: "マーケティングの全体像を見る", body: "商品、顧客、届け方の関係を先に押さえます。", href: guidePath("web-marketing") },
      { title: "SNSかSEOに絞る", body: "全部を同時に学ばず、今の仕事や発信に近いテーマを選びます。", href: "/genre/marke/" },
      { title: "GA4で結果を見る", body: "投稿や施策をやりっぱなしにせず、数字を見る入口を作ります。", href: subGenrePath("marke", "SEO") }
    ],
    links: [
      { label: "Webマーケロードマップ", href: guidePath("web-marketing"), note: "全体像からSEO・SNSへ進む" },
      { label: "SEO動画一覧", href: subGenrePath("marke", "SEO"), note: "検索流入とGA4を学ぶ" },
      { label: "SNS動画一覧", href: subGenrePath("marke", "SNS"), note: "X、Instagram、Canvaの入口" }
    ],
    faq: [
      { question: "マーケティングはYouTubeだけで学べますか？", answer: "入口としては十分です。実務では、動画で全体像をつかんだ後に自分の投稿やサイトで試すことが大切です。" },
      { question: "SEOとSNSはどちらから始めるべき？", answer: "すぐ反応を見たいならSNS、長期の検索流入を作りたいならSEOから始めると目的に合います。" },
      { question: "GA4は初心者にも必要？", answer: "最初から細かく見る必要はありませんが、流入元とよく見られるページだけでも確認すると改善しやすくなります。" }
    ]
  },
  {
    slug: "power-bi",
    query: "power bi 使い方",
    title: "Power BIの使い方｜初心者向け無料動画とExcelからの進め方 | Manapick",
    description: "Power BIの使い方を初心者向けに整理。Excelとの違い、ダッシュボード作成、基本操作を無料動画で学ぶ順番が分かります。",
    h1: "Power BIの使い方を、Excelの次の一歩として学ぶ",
    lead: "Excelで集計している表を、見える化・更新しやすい形にするためのPower BI入門です。",
    answer: "Power BIは、Excelで作った表や集計をダッシュボードとして見やすくする道具です。まずExcelとの違いを知り、次に基本操作、最後に自分のデータで小さなレポートを作る順番が現実的です。",
    audience: "Excelの集計を見える化したい人、Power BIを仕事で初めて触る人",
    filters: { genres: ["data"], subtopics: ["BI"], keywords: ["Power BI", "BI", "ダッシュボード", "Excel"] },
    steps: [
      { title: "Excelとの違いを知る", body: "何が便利になるのかを先に理解すると、学ぶ目的がはっきりします。", href: subGenrePath("data", "BI") },
      { title: "基本操作を1本で見る", body: "取り込み、グラフ、フィルター、公開の流れを通して確認します。", href: subGenrePath("data", "BI") },
      { title: "自分の表で試す", body: "教材用データだけで終えず、普段使う表を1つ選んで再現します。", href: guidePath("excel-data") }
    ],
    links: [
      { label: "Power BI動画一覧", href: subGenrePath("data", "BI"), note: "Power BI入門動画を比較" },
      { label: "Excelデータ分析ロードマップ", href: guidePath("excel-data"), note: "ExcelからBIへ進む流れ" },
      { label: "データ分析ジャンル", href: "/genre/data/", note: "Excel、統計、BIをまとめて確認" }
    ],
    faq: [
      { question: "Power BIはExcel初心者でも使えますか？", answer: "基本操作は学べます。ただし、表の列名や形式が整っているほど理解しやすくなります。" },
      { question: "無料で学べますか？", answer: "基本操作の学習は無料動画で始められます。業務利用や共有範囲は所属先のライセンス条件を確認してください。" },
      { question: "ExcelとPower BIは何が違いますか？", answer: "Excelは表計算と手元の作業に強く、Power BIは複数データの見える化や更新しやすいダッシュボードに向いています。" }
    ]
  },
  {
    slug: "sharoshi-1year",
    query: "社労士 YouTube おすすめ",
    title: "社労士をYouTubeで学ぶおすすめ動画｜1年の勉強スケジュール | Manapick",
    description: "社労士をYouTubeで学びたい人向けに、試験の全体像、科目別の基礎、過去問までおすすめ無料動画を1年の学習順で整理します。",
    h1: "社労士をYouTubeで学ぶおすすめ動画と、1年の勉強順",
    lead: "再生数だけで選ばず、試験制度の全体像、科目別の基礎、過去問演習へ進める動画を、働きながら学びやすい順番に整理します。",
    answer: "最初は試験制度と全科目の全体像が分かる動画を選び、次に科目別の基礎、最後に過去問と弱点補強へ進みます。1年で学ぶ場合は前半を理解、後半を演習に分け、受験年度の要項は社会保険労務士試験オフィシャルサイトで確認してください。",
    audience: "社労士のおすすめYouTube動画を探している人、独学や通信講座と組み合わせて1年の学習計画を立てたい人",
    filters: { genres: ["shikaku"], subtopics: ["社労士"], keywords: ["社労士", "社会保険労務士", "1年", "ロードマップ", "勉強法"] },
    steps: [
      { title: "試験制度と科目を知る", body: "まず試験の範囲と合格までの全体像を確認します。", href: subGenrePath("shikaku", "社労士") },
      { title: "月ごとの学習量を決める", body: "働きながら進めるなら、毎週の時間を現実的に見積もります。", href: subGenrePath("shikaku", "社労士") },
      { title: "過去問と弱点補強へ進む", body: "後半は聞き流しや一問一答も使い、知識の穴を埋めます。", href: guidePath("certification") }
    ],
    links: [
      { label: "社労士動画一覧", href: subGenrePath("shikaku", "社労士"), note: "制度理解・勉強法・科目対策を見る" },
      { label: "社会保険労務士試験オフィシャルサイト", href: "https://www.sharosi-siken.or.jp/", note: "最新の受験案内・試験情報を公式情報で確認" },
      { label: "資格ロードマップ", href: guidePath("certification"), note: "資格学習全体の入口" },
      { label: "資格ジャンル", href: "/genre/shikaku/", note: "他資格の勉強法も比較" }
    ],
    faq: [
      { question: "社労士のYouTube動画は何から見るべき？", answer: "まず試験制度と全科目の全体像が分かる動画を見てから、科目別講義、過去問解説へ進むと順番を見失いにくくなります。" },
      { question: "社労士は1年で合格できますか？", answer: "必要な学習期間は学習時間や前提知識によって異なります。動画では計画の立て方と苦手分野を確認し、最新の試験情報と問題演習で補ってください。" },
      { question: "独学でも始められますか？", answer: "始めることはできます。範囲が広いため、早い段階で過去問とスケジュール管理を組み込むのがおすすめです。" },
      { question: "動画はどう使うべき？", answer: "動画は全体像や科目のイメージをつかむ用途に向いています。暗記や演習は別途テキスト・問題集で補うと安定します。" }
    ]
  },
  {
    slug: "ai-prompt-tips",
    query: "ai プロンプト コツ",
    title: "AIプロンプトのコツ｜仕事で使う指示文を無料動画で学ぶ | Manapick",
    description: "AIプロンプトのコツを、ChatGPT、Claude、Geminiの無料動画で整理。目的、前提、出力形式を伝える基本が分かります。",
    h1: "AIプロンプトのコツは、目的・前提・出力形式を分けること",
    lead: "生成AIに短い命令だけを投げるのではなく、何を作るか、誰向けか、どんな形でほしいかを分けて伝える練習をします。",
    answer: "プロンプトの基本は、目的、前提、制約、出力形式を分けて書くことです。最初はChatGPT/Gemini/Claudeの違いを触り、次に仕事の文章・表・資料に近い題材で試すと使い分けが見えます。",
    audience: "生成AIを仕事の文章作成、調査、資料作成に使いたい人",
    filters: { genres: ["ai"], subtopics: ["プロンプト", "ChatGPT", "Claude", "Gemini"], keywords: ["プロンプト", "ChatGPT", "Claude", "Gemini", "指示"] },
    steps: [
      { title: "3大AIを触る", body: "ChatGPT、Gemini、Claudeの違いを無料版で体験します。", href: guidePath("generative-ai") },
      { title: "目的と出力形式を分ける", body: "文章、表、箇条書きなど、欲しい形を明示して回答のぶれを減らします。", href: subGenrePath("ai", "プロンプト") },
      { title: "仕事の題材で試す", body: "自分のメール、議事メモ、企画書などに置き換えて練習します。", href: "/genre/ai/" }
    ],
    links: [
      { label: "生成AIロードマップ", href: guidePath("generative-ai"), note: "ChatGPT/Gemini/Claudeから順番に学ぶ" },
      { label: "プロンプト動画一覧", href: subGenrePath("ai", "プロンプト"), note: "指示出しの動画をまとめて確認" },
      { label: "manapick AI", href: "https://ai.manapick.app/", note: "AIツールの料金・無料枠・使い方を比較" }
    ],
    faq: [
      { question: "AIプロンプトの一番のコツは？", answer: "目的、前提、出力形式、制約を分けて伝えることです。短い命令だけより、期待する形を明確にしたほうが安定します。" },
      { question: "ChatGPTとClaudeとGeminiはどれを使えばいい？", answer: "まず3つの無料版を触るのがおすすめです。文章や思考整理、検索連携、画像や資料など得意分野が違います。" },
      { question: "プロンプト例を丸暗記すべき？", answer: "丸暗記より、自分の業務に合わせて目的と条件を入れ替える練習が大切です。" }
    ]
  },
  {
    slug: "copilot-use-cases",
    query: "copilot 活用 事例",
    title: "Copilot活用事例｜Microsoft 365を仕事で使う無料動画 | Manapick",
    description: "Copilot活用事例を、Word、Excel、PowerPoint、Microsoft 365の無料動画で整理。仕事に使う前に確認したい入口です。",
    h1: "Copilot活用事例を、仕事の場面別に無料動画で確認する",
    lead: "Microsoft 365 Copilotは、文書、表、スライド、会議メモなど日常業務に近い場面から学ぶと使い方が見えやすくなります。",
    answer: "Copilotは、Wordで文章を整える、Excelで表を読み解く、PowerPointで構成案を作る、といった普段の作業に当てはめると理解しやすくなります。社内データを扱う場合は、所属先の利用ルールも確認してください。",
    audience: "Microsoft 365 Copilotを仕事で試したい人、活用事例を見て使いどころを判断したい人",
    filters: { genres: ["ai"], subtopics: ["Copilot", "GitHub Copilot"], keywords: ["Copilot", "Microsoft", "Word", "Excel", "PowerPoint", "活用"] },
    steps: [
      { title: "Copilotで何ができるかを見る", body: "まず主要機能と制約を把握します。", href: subGenrePath("ai", "Copilot") },
      { title: "Word・Excel・PowerPointに分ける", body: "使うアプリごとに、どの作業が楽になるか確認します。", href: subGenrePath("ai", "Copilot") },
      { title: "社内ルールと合わせて試す", body: "機密情報や社内データの扱いは、所属先のルールに従って確認します。", href: guidePath("generative-ai") }
    ],
    links: [
      { label: "Copilot動画一覧", href: subGenrePath("ai", "Copilot"), note: "Microsoft 365 Copilotの事例を確認" },
      { label: "生成AIロードマップ", href: guidePath("generative-ai"), note: "生成AI全体の入口から学ぶ" },
      { label: "manapick AIでCopilotを見る", href: "https://ai.manapick.app/", note: "料金・無料枠・使い方の比較へ" }
    ],
    faq: [
      { question: "Copilot活用事例は何から見るべき？", answer: "Word、Excel、PowerPointなど、自分が普段使うアプリに近い事例から見るのがおすすめです。" },
      { question: "ChatGPTとCopilotは何が違いますか？", answer: "CopilotはMicrosoft 365上の文書・表・スライド作業と相性があります。ChatGPTは幅広い相談や文章生成に使いやすいです。" },
      { question: "会社で使うときの注意点は？", answer: "社内データや機密情報を扱う場合は、所属先の利用ルールと契約条件を確認してください。" }
    ]
  },
  {
    slug: "money-study-free",
    query: "資産運用 勉強 サイト 無料",
    title: "資産運用を無料で勉強する順番｜NISA・投資信託の学習動画 | Manapick",
    description: "資産運用を無料で勉強したい人向けに、家計、NISA、投資信託、長期・積立・分散を学ぶYouTube動画を順番に整理します。",
    h1: "資産運用を無料で勉強するなら、家計と制度から始める",
    lead: "商品や銘柄を探す前に、生活防衛資金、NISA・iDeCoの制度、投資信託の仕組みとリスクを順番に学ぶ入口です。",
    answer: "最初に家計と生活防衛資金を整理し、次にNISA・iDeCoの制度、投資信託、長期・積立・分散の考え方へ進みます。Manapickは特定商品の購入を勧めず、無料動画で基礎知識を学ぶ順番だけを整理します。",
    audience: "資産運用を初めて勉強する社会人、NISAや投資信託の仕組みを無料で学びたい人",
    lastReviewed: "2026-08-01",
    officialSources: [
      {
        label: "金融庁: NISA特設ウェブサイト",
        href: "https://www.fsa.go.jp/policy/nisa2/",
        note: "NISAの制度・最新情報を確認する公的な一次情報"
      }
    ],
    filters: { genres: ["money"], subtopics: ["家計", "NISA", "投資"], keywords: ["資産運用", "家計", "NISA", "iDeCo", "投資信託", "積立", "分散"] },
    steps: [
      { title: "家計と生活防衛資金を整理する", body: "投資に回せる金額を先に決め、生活費と混ぜない土台を作ります。", href: subGenrePath("money", "家計") },
      { title: "NISA・iDeCoの制度を知る", body: "税制上の仕組みと資金を引き出せる時期の違いを確認します。", href: subGenrePath("money", "NISA") },
      { title: "投資信託とリスクを学ぶ", body: "長期・積立・分散の意味を理解し、元本割れの可能性も含めて判断材料を増やします。", href: guidePath("money-basics") }
    ],
    links: [
      { label: "お金・投資ロードマップ", href: guidePath("money-basics"), note: "家計から投資の基礎まで見る順を確認" },
      { label: "NISA動画一覧", href: subGenrePath("money", "NISA"), note: "制度と始め方の学習動画を比較" },
      { label: "お金・投資ジャンル", href: "/genre/money/", note: "家計・NISA・投資の全動画を見る" }
    ],
    faq: [
      { question: "資産運用は無料動画だけで勉強できますか？", answer: "基礎用語や制度の入口は無料動画で学べます。実際に金融商品を選ぶ際は、手数料やリスクを各金融機関の公式情報で確認してください。" },
      { question: "NISAは最初に始めるべきですか？", answer: "必ずとは言えません。生活防衛資金、投資期間、リスク許容度を確認し、制度を理解してから判断してください。" },
      { question: "おすすめ銘柄を教えてもらえますか？", answer: "Manapickでは特定の銘柄や商品の推奨を行いません。仕組みとリスクを学ぶ動画を選ぶための情報を提供します。" }
    ]
  },
  {
    slug: "fp3-past-questions",
    query: "FP3級 過去問",
    title: "FP3級の過去問を動画で学ぶ｜無料解説と公式模範解答 | Manapick",
    description: "FP3級の過去問を学びたい人向けに、日本FP協会の公式試験問題・模範解答と、無料の解説動画を使う順番を整理します。",
    h1: "FP3級の過去問を、公式問題と無料動画で学ぶ",
    lead: "公式の試験問題・模範解答で出題形式を確認し、解けなかった分野だけを動画で理解し直すための入口です。",
    answer: "最初に日本FP協会の公式試験問題・模範解答で出題形式を確認し、次に解説動画で理由を理解します。最後に時間を置いて同じ分野を解き直すと、動画を見ただけで終わらず知識を定着させやすくなります。受検方式や出題範囲は変更されることがあるため、申込前に公式要項も確認してください。",
    audience: "FP3級の過去問を無料で勉強したい人、解答だけでは理解しにくい分野を動画で復習したい人",
    lastReviewed: "2026-08-01",
    officialSources: [
      {
        label: "日本FP協会: FP技能検定",
        href: "https://www.jafp.or.jp/exam/",
        note: "試験概要、日程、公開問題を確認する公式情報"
      }
    ],
    filters: { genres: ["kaikei"], subtopics: ["FP"], keywords: ["FP3級", "3級", "過去問", "学科", "実技", "ライフ", "金融", "保険"] },
    steps: [
      { title: "公式問題で出題形式を確認する", body: "日本FP協会の試験問題・模範解答を開き、まず現在の出題形式と自分の正答状況を確認します。", href: "https://www.jafp.or.jp/exam/mohan/" },
      { title: "間違えた分野を動画で理解する", body: "ライフプラン、金融、保険など、解けなかった分野に絞って解説動画を見ます。", href: subGenrePath("kaikei", "FP") },
      { title: "解答を見ずにもう一度解く", body: "視聴直後ではなく少し時間を置き、同じ論点を自力で説明できるか確認します。", href: "/genre/kaikei/" }
    ],
    links: [
      { label: "日本FP協会 試験問題・模範解答", href: "https://www.jafp.or.jp/exam/mohan/", note: "3級の公式問題と模範解答を確認" },
      { label: "FP3級の解説動画一覧", href: subGenrePath("kaikei", "FP"), note: "過去問・分野別講義・聞き流し動画を比較" },
      { label: "会計資格ジャンル", href: "/genre/kaikei/", note: "FP・簿記・会計資格の学習動画を見る" }
    ],
    faq: [
      { question: "FP3級の過去問はどこで確認できますか？", answer: "日本FP協会の「試験問題・模範解答」ページで公式問題を確認できます。受検年度や実施団体に合う情報を選んでください。" },
      { question: "過去問は何回解けばいいですか？", answer: "一律の回数より、間違えた理由を説明できるまで解き直すことが大切です。動画で理解した後、解答を見ずに再挑戦してください。" },
      { question: "動画を見るだけで合格できますか？", answer: "動画は理解の補助に向きますが、合格を保証するものではありません。公式問題や問題集を自分で解き、時間配分と弱点を確認する必要があります。" },
      { question: "古い過去問も使えますか？", answer: "基礎論点の確認には使えますが、制度や税制は変わる可能性があります。最新の試験要項と公式情報を優先してください。" }
    ]
  },
  {
    slug: "secretary-test-schedule",
    query: "秘書検定 2級 日程",
    title: "秘書検定2級の日程確認と勉強法｜公式情報と無料動画 | Manapick",
    description: "秘書検定2級の日程を公式サイトで確認する導線と、試験範囲・勉強法を学ぶ無料YouTube動画を整理します。",
    h1: "秘書検定2級の日程を公式で確認し、勉強の順番を決める",
    lead: "試験日は実施方式や受験年度で変わるため、最新日程は実務技能検定協会の公式ページで確認し、動画は試験範囲と学習計画の理解に使います。",
    answer: "秘書検定2級は、まず公式の試験日程・受験要項で申込期間と実施方式を確認します。そのうえで、必要とされる資質、職務知識、一般知識、マナー・接遇、技能の全体像を見て、問題演習へ進む順番が安全です。",
    audience: "秘書検定2級の受験日と申込時期を調べている人、初めて学習計画を立てる人",
    filters: { genres: ["shikaku"], subtopics: ["秘書検定"], keywords: ["秘書検定", "2級", "日程", "勉強法", "マナー", "接遇"] },
    steps: [
      { title: "公式の日程と受験要項を確認する", body: "受験年度、実施方式、申込期間を公式ページで確認します。", href: "https://jitsumu-ginou-kentei.jp/HS/schedule" },
      { title: "試験範囲の全体像を見る", body: "理論領域と実技領域の構成をつかみ、苦手分野を分けます。", href: "/?genre=shikaku&sub=" + encodeURIComponent("秘書検定") + "#search" },
      { title: "問題演習と復習へ進む", body: "動画で理解した後は、公式問題集や過去問で出題形式に慣れます。", href: guidePath("certification") }
    ],
    links: [
      { label: "秘書検定 公式試験日程", href: "https://jitsumu-ginou-kentei.jp/HS/schedule", note: "最新の実施日・申込期間を公式情報で確認" },
      { label: "秘書検定の動画一覧", href: "/?genre=shikaku&sub=" + encodeURIComponent("秘書検定") + "#search", note: "試験範囲と勉強法の動画を比較" },
      { label: "資格学習ロードマップ", href: guidePath("certification"), note: "動画と問題演習を組み合わせる順番" }
    ],
    faq: [
      { question: "秘書検定2級の最新日程はどこで確認できますか？", answer: "実務技能検定協会の秘書検定「試験日程」ページで、受験年度と実施方式を確認してください。日程は変更される可能性があるため、Manapickでは固定日を転載しません。" },
      { question: "2級はCBTで受験できますか？", answer: "実施方式は公式の試験日程・受験要項で案内されています。希望地域と受験時期に合う方式を公式ページで確認してください。" },
      { question: "動画だけで合格できますか？", answer: "動画は全体像の理解に向きますが、合格を保証するものではありません。問題集や過去問で出題形式に慣れ、間違えた範囲を動画で復習する使い方が現実的です。" }
    ]
  },
  {
    slug: "python-beginner-book",
    query: "Python 入門 本",
    title: "Python入門本の選び方｜無料動画との使い分けと学ぶ順番 | Manapick",
    description: "Python入門本を選ぶ基準と、無料YouTube動画・公式チュートリアルを組み合わせる順番を整理。環境構築、文法、演習で迷わない入口です。",
    h1: "Python入門本は、動画で試してから目的に合う一冊を選ぶ",
    lead: "本を先に決めるのではなく、短い無料動画でPythonを動かし、つまずいた場所と作りたいものが分かってから選ぶと、教材の難易度を合わせやすくなります。",
    answer: "Python入門本は、利用する環境の説明、実行できるサンプルコード、練習問題の3点を確認して選びます。最初に短い動画で環境構築と基本文法を試し、本で手を動かして復習し、分からない仕様はPython公式チュートリアルで確かめる順番が現実的です。",
    audience: "Pythonの入門本を探している人、動画と本のどちらから始めるか迷っている人",
    lastReviewed: "2026-08-05",
    officialSources: [
      {
        label: "Python 公式チュートリアル",
        href: "https://docs.python.org/ja/3/tutorial/",
        note: "言語の基本機能、仮想環境、標準ライブラリを確認する一次情報"
      }
    ],
    filters: { genres: ["prog"], subtopics: ["Python"], keywords: ["Python", "入門", "初心者", "環境構築", "基本", "文法"] },
    steps: [
      { title: "短い動画でPythonを一度動かす", body: "環境構築から実行までを試し、自分が止まる場所を確認します。", href: subGenrePath("prog", "Python") },
      { title: "目的と難易度に合う本を選ぶ", body: "サンプルコード、練習問題、利用環境の説明が自分に合うかを目次と試し読みで確かめます。", href: "/shop/" },
      { title: "本で手を動かし、動画と公式情報で補う", body: "コードを実行して結果を確認し、つまずいた操作は動画、仕様は公式チュートリアルで確認します。", href: guidePath("python") }
    ],
    links: [
      { label: "Python完全ロードマップ", href: guidePath("python"), note: "入門からWebアプリまで学ぶ順番を確認" },
      { label: "Python動画一覧", href: subGenrePath("prog", "Python"), note: "環境構築・文法・活用の動画を比較" },
      { label: "manapi商店（PR）", href: "/shop/", note: "学習テーマ別の補助教材を見る" },
      { label: "Python公式チュートリアル", href: "https://docs.python.org/ja/3/tutorial/", note: "言語仕様と基本機能を一次情報で確認" }
    ],
    faq: [
      { question: "Pythonは本と動画のどちらから始めるべき？", answer: "まず短い動画で実行環境と基本操作を試し、継続できそうなら本で体系的に手を動かす方法があります。動画は操作の理解、本は復習と演習に向いています。" },
      { question: "Python入門本は何を見て選べばいい？", answer: "自分のOSや実行環境に対応しているか、サンプルコードを実際に動かせるか、章ごとに練習問題があるかを確認します。" },
      { question: "古いPython入門本でも学べますか？", answer: "基本文法は学べる場合がありますが、画面やライブラリ、推奨手順が現在と異なることがあります。出版情報に加え、Python公式ドキュメントの現行版も確認してください。" },
      { question: "本を読むだけで身につきますか？", answer: "読むだけでなく、掲載コードを自分で入力・実行し、少し変更して結果を確かめる時間を組み込むことが大切です。" }
    ]
  },
  {
    slug: "business-accounting-3-study-time",
    query: "ビジネス会計検定 3級 勉強時間",
    title: "ビジネス会計検定3級の勉強時間は？学習計画の立て方 | Manapick",
    description: "ビジネス会計検定3級の勉強時間を決める前に、公式出題範囲と問題例で現在地を確認し、財務諸表の読み方を学ぶ順番を整理します。",
    h1: "ビジネス会計検定3級の勉強時間は、問題例から逆算する",
    lead: "必要な時間は前提知識と学習頻度で変わります。根拠のない一律の時間を示さず、公式の出題範囲と問題例で現在地を確認して計画を作ります。",
    answer: "ビジネス会計検定3級の勉強時間に公式の一律目安はありません。まず公式問題例を解き、貸借対照表、損益計算書、キャッシュ・フロー計算書のどこで止まるかを確認します。分からない範囲を動画とテキストで学び、週ごとの問題演習時間を確保して受験日から逆算してください。",
    audience: "ビジネス会計検定3級の学習計画を立てたい人、簿記との違いや出題範囲を確認したい人",
    lastReviewed: "2026-08-05",
    officialSources: [
      {
        label: "ビジネス会計検定試験: 3級の内容・出題範囲",
        href: "https://www.b-accounting.jp/about/course.html",
        note: "財務諸表の構造・読み方・基本分析など、公式の試験範囲を確認"
      },
      {
        label: "ビジネス会計検定試験: 試験時間",
        href: "https://www.b-accounting.jp/guide/time.html",
        note: "3級の試験時間と実施案内を公式情報で確認"
      }
    ],
    filters: { genres: ["kaikei"], subtopics: ["簿記"], keywords: ["会計", "財務諸表", "貸借対照表", "損益計算書", "キャッシュフロー", "決算書", "簿記"] },
    steps: [
      { title: "公式範囲と問題例で現在地を測る", body: "財務諸表の構造と基本分析のうち、説明できない項目を先に洗い出します。", href: "https://www.b-accounting.jp/about/course.html" },
      { title: "財務諸表の読み方を動画で補う", body: "貸借対照表、損益計算書、キャッシュ・フロー計算書を分けて学びます。", href: subGenrePath("kaikei", "簿記") },
      { title: "問題演習を週の予定に固定する", body: "受験日から逆算し、学習と解き直しの時間を分けて確保します。", href: "https://license.manapick.app/license/biz-accounting-3/" }
    ],
    links: [
      { label: "ビジネス会計検定3級を比較", href: "https://license.manapick.app/license/biz-accounting-3/", note: "難易度・費用・日程を姉妹サイトで確認" },
      { label: "簿記・決算書の動画一覧", href: subGenrePath("kaikei", "簿記"), note: "財務諸表の基礎を学ぶ動画を比較" },
      { label: "会計資格ロードマップ", href: guidePath("bookkeeping"), note: "簿記・FP・会計資格を学ぶ順番" },
      { label: "公式の出題範囲", href: "https://www.b-accounting.jp/about/course.html", note: "試験範囲と問題形式を一次情報で確認" }
    ],
    faq: [
      { question: "ビジネス会計検定3級の勉強時間は何時間ですか？", answer: "公式サイトは一律の勉強時間を示していません。簿記や財務諸表の前提知識で必要時間が変わるため、公式問題例を解いて不足分野を確認し、受験日から逆算してください。" },
      { question: "3級では何を学びますか？", answer: "公式の出題範囲では、貸借対照表、損益計算書、キャッシュ・フロー計算書の構造と読み方、成長性・安全性・収益性などの基本分析が示されています。" },
      { question: "簿記3級と何が違いますか？", answer: "簿記は取引の記録や決算書を作る仕組みを学び、ビジネス会計検定は財務諸表を読み、企業の状態を分析する力に重点があります。" },
      { question: "動画だけで受験対策できますか？", answer: "動画は財務諸表の考え方を理解する補助に向きます。試験対策では公式範囲を確認し、問題例や問題集を自分で解く時間も必要です。" }
    ]
  }
] as const;

export function learningIntentPath(slug: string) {
  return "/learn/" + slug + "/";
}

export function findLearningIntent(slug: string) {
  return learningIntents.find((intent) => intent.slug === slug) ?? null;
}

function normalized(value: string) {
  return value.toLowerCase();
}

function includesAny(value: string, keywords: readonly string[]) {
  const text = normalized(value);
  return keywords.some((keyword) => text.includes(normalized(keyword)));
}

function intentMatchScore(video: Video, intent: LearningIntent) {
  if (!intent.filters.genres.includes(video.genre)) return -1;

  const haystack = [video.title, video.sub, video.channel, ...video.tags, ...video.review].join(" ");
  const subIndex = intent.filters.subtopics?.indexOf(video.sub) ?? -1;
  const subScore = subIndex >= 0 ? Math.max(10, 30 - subIndex * 6) : 0;
  const keywordScore = intent.filters.keywords.reduce((score, keyword) => {
    return score + (includesAny(haystack, [keyword]) ? 6 : 0);
  }, 0);

  if (subScore + keywordScore <= 0) return -1;
  return subScore + keywordScore + (video.score ?? 0);
}

export function learningIntentVideos(intent: LearningIntent, limit = 6) {
  return videos
    .map((video) => ({ video, score: intentMatchScore(video, intent) }))
    .filter((item) => item.score >= 0)
    .sort((a, b) => b.score - a.score || (b.video.score ?? -1) - (a.video.score ?? -1) || a.video.minutes - b.video.minutes)
    .map((item) => item.video)
    .slice(0, limit);
}

export function relatedLearningIntents(intent: LearningIntent, limit = 4) {
  return learningIntents
    .filter((candidate) => candidate.slug !== intent.slug)
    .map((candidate) => ({
      intent: candidate,
      sharedGenres: candidate.filters.genres.filter((genre) => intent.filters.genres.includes(genre)).length,
      sharedKeywords: candidate.filters.keywords.filter((keyword) => intent.filters.keywords.includes(keyword)).length
    }))
    .filter((item) => item.sharedGenres > 0)
    .sort((a, b) => b.sharedKeywords - a.sharedKeywords || a.intent.query.localeCompare(b.intent.query, "ja"))
    .map((item) => item.intent)
    .slice(0, limit);
}

export function intentVideoSummary(video: Video) {
  return `${genreDisplayName(video.genre)} / ${video.sub} / ${scoreText(video)} / ${video.minutes}分`;
}
