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
    query: "社労士 勉強 スケジュール 1年",
    title: "社労士の勉強スケジュール1年｜独学で迷わない無料動画の順番 | Manapick",
    description: "社労士試験を1年で学ぶためのスケジュール入口。制度理解、科目別対策、過去問演習を無料動画で見る順に整理します。",
    h1: "社労士の勉強スケジュールを、1年単位で考える",
    lead: "社労士試験は範囲が広いため、最初に制度と全体像をつかみ、科目ごとの基礎、過去問演習へ進む流れを作ります。",
    answer: "1年で社労士を目指すなら、前半は全体像と基礎科目、後半は過去問と弱点補強に分けるのが基本です。動画は計画作りの入口として使い、実際の教材・受験年度の公式情報は必ず確認してください。",
    audience: "社労士試験を独学または通信講座併用で始める人、1年の学習計画を立てたい人",
    filters: { genres: ["shikaku"], subtopics: ["社労士"], keywords: ["社労士", "社会保険労務士", "1年", "ロードマップ", "勉強法"] },
    steps: [
      { title: "試験制度と科目を知る", body: "まず試験の範囲と合格までの全体像を確認します。", href: subGenrePath("shikaku", "社労士") },
      { title: "月ごとの学習量を決める", body: "働きながら進めるなら、毎週の時間を現実的に見積もります。", href: subGenrePath("shikaku", "社労士") },
      { title: "過去問と弱点補強へ進む", body: "後半は聞き流しや一問一答も使い、知識の穴を埋めます。", href: guidePath("certification") }
    ],
    links: [
      { label: "社労士動画一覧", href: subGenrePath("shikaku", "社労士"), note: "制度理解・勉強法・科目対策を見る" },
      { label: "資格ロードマップ", href: guidePath("certification"), note: "資格学習全体の入口" },
      { label: "資格ジャンル", href: "/genre/shikaku/", note: "他資格の勉強法も比較" }
    ],
    faq: [
      { question: "社労士は1年で合格できますか？", answer: "学習時間や前提知識によります。動画では計画の立て方を確認し、最新の試験情報と教材で補う必要があります。" },
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

export function intentVideoSummary(video: Video) {
  return `${genreDisplayName(video.genre)} / ${video.sub} / ${scoreText(video)} / ${video.minutes}分`;
}
