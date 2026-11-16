const claudeGuide = {
  slug: "claude",
  genre: "ai",
  title: "ChatGPTしか使っていない人へ。Claudeを「話す→任せる→作らせる」の3段階で仕事に使い倒す無料動画ロードマップ【YouTube12本】",
  description:
    "AnthropicのClaudeは、チャットで相談するだけでなく、作業を任せたりコードを書かせたりもできます。「知る → 仕事で使う → 任せる → 作らせる」の順に、無料YouTube動画12本で学ぶ順番です。",
  publishedAt: "2026-11-17",
  intro:
    "Claude（クロード）は、米Anthropicが開発する生成AIです。チャットで聞くだけで終わらせず、**「知る → 仕事で使う → 任せる → 作らせる」**の順で広げると、毎日の作業そのものを減らせます。",
  learnPoints: [
    "ChatGPTとの違いと、Claudeでできることの全体像がわかる",
    "Excelやデスクトップアプリなど、仕事の道具とつないで使う方法がわかる",
    "作業を任せる使い方と、Claude Codeで作らせる入口まで進める"
  ],
  audience: "ChatGPTは使っているがClaudeは初めての人、AIを調べものだけでなく作業の時短に使いたい人、プログラミング経験がなくてもClaude Codeを試したい人向けです。",
  conclusionBullets: [
    { label: "STEP1", text: "Claudeの特徴とChatGPTとの違い、主な機能の全体像をつかむ" },
    { label: "STEP2", text: "Excelやデスクトップアプリで、ふだんの仕事に組み込む" },
    { label: "STEP3", text: "まとまった作業を任せる使い方と、自分専用に育てる設定を知る" },
    { label: "STEP4", text: "Claude Codeの全体像を見て、作業の自動化やものづくりに進む" }
  ],
  conclusionClosing:
    "12本の合計は約4時間半です。STEP1〜2だけでも、明日からの資料づくりや表計算に使えます。",
  reasonTitle: "「話す」から「作らせる」へ広げる理由",
  reasonParagraphs: [
    "生成AIを使っていても、質問して答えをもらう使い方で止まっている人は少なくありません。Claudeは、チャットでの相談に加えて、Excelなどの道具とつないだり、まとまった作業を任せたり、コードを書かせたりと、使い道が段階的に広がるツールです。",
    "このロードマップは、その段階をそのまま順番にしています。STEP1で特徴とChatGPTとの違いを知り、STEP2でふだんの仕事に組み込み、STEP3で作業を任せ、STEP4でClaude Codeに進みます。いきなりClaude Codeから入るより、何をどこまで任せられるかの感覚が先にあるほうが、つまずきが減ります。",
    "AIツールは更新が早く、動画によって画面や機能名が違うことがあります。2026年10月公開の動画では「Cowork統合後」の設定として紹介されているように、同じ機能でも呼び方が変わる場合があります。動画は考え方と流れをつかむ材料として使い、操作は公式の最新画面で確認してください。"
  ],
  steps: [
    {
      title: "STEP1：Claudeを知る",
      videos: [
        { ytid: "TGnJwnYUi1o", why: "13分でClaudeの特徴を基礎から確認でき、最初の1本に向いている" },
        { ytid: "u4z2xqe037Y", why: "ChatGPTとの違いを比べながら、基本操作から応用まで画面で見られる" },
        { ytid: "UdEIgP4B0Bs", why: "Projects・Skills・Cowork・Claude Codeまで、全体像を1本でつかめる" }
      ]
    },
    {
      title: "STEP2：ふだんの仕事に組み込む",
      videos: [
        { ytid: "-j4LXC_Tdrc", why: "基本操作から応用的な機能まで、使い方をひと通り確認できる" },
        { ytid: "cZZ7HNg1QW0", why: "Excel上でClaudeを動かす導入手順から実務での使い方までを14分で見られる" },
        { ytid: "zh4OQqQOJzw", why: "デスクトップアプリの推奨設定、コネクター、スキル、スケジュールタスクを扱っており、毎日の道具として整えられる" }
      ]
    },
    {
      title: "STEP3：作業を任せる",
      videos: [
        { ytid: "NTFIFwmrjiw", why: "Coworkの基本操作と活用法を、初心者向けに基礎から確認できる" },
        { ytid: "TJ_hET3AUwE", why: "非エンジニア向けに、AIに仕事をまとめて任せる考え方を13分でつかめる" },
        { ytid: "t8qGGN6wYH8", why: "AIを自分の用途に合わせて育てる手順がわかり、任せる精度を上げられる" }
      ]
    },
    {
      title: "STEP4：Claude Codeで作らせる",
      videos: [
        { ytid: "4NDb-X624gY", why: "Claude Codeの始め方から活用法までの全体像を9分で把握できる" },
        { ytid: "EpUWXT0Fcic", why: "基本操作とおすすめ設定、仕事の自動化までの手順を約30分で通して学べる" },
        { ytid: "BORAq995Ye4", why: "CLAUDE.mdの設定とフォルダ設計を扱う実践回で、日常業務で続けて使う形が作れる" }
      ]
    }
  ],
  stumbleTable: [
    { stumble: "ChatGPTと同じ使い方で止まる", cause: "質問と回答のやり取りだけで使っている", solution: "STEP2でExcelやデスクトップアプリとつなぎ、作業の途中に組み込む" },
    { stumble: "任せた結果がずれる", cause: "目的・前提・完成形を伝えずに丸投げしている", solution: "STEP3の動画で任せ方の型を見て、自分専用の設定を育てる" },
    { stumble: "Claude Codeが難しそうで手が出ない", cause: "最初からプログラミングの知識が必要だと思っている", solution: "STEP4の9分動画で全体像を見てから、超入門の手順どおりに1つ動かす" }
  ],
  studyPlans: [
    { label: "平日20分×2週間", pace: "1日1本を目安に視聴", plan: "見た日にひとつだけ、自分の仕事でClaudeに頼む作業を決めて試す" },
    { label: "週末集中", pace: "土日で2〜3時間", plan: "土曜にSTEP1〜2、日曜にSTEP3〜4。最後に任せたい作業を3つ書き出す" }
  ],
  stumblingBlocks: [
    { label: "「動画と画面が違う」", text: "AIツールは更新が早く、機能名や画面が変わることがあります。考え方は動画で、最新の操作は公式の画面やヘルプで確認してください" },
    { label: "「どこまで任せていいかわからない」", text: "社外秘の情報や個人情報の扱いは、勤務先のルールを先に確認します。STEP3は、任せる範囲を決めてから試すのが安全です" },
    { label: "次の一歩", text: "ChatGPTやGeminiとの使い分けまで広げるなら、生成AIロードマップへ。AIツールの比較はmanapick AIで確認できます" }
  ],
  faq: [
    { question: "Claudeとは何ですか？", answer: "米Anthropicが開発する生成AIです。チャットでの相談に加え、Excelなどの道具とつないだ使い方や、Claude Codeによる作業の自動化などができます。" },
    { question: "ChatGPTを使っていてもClaudeを学ぶ意味はありますか？", answer: "あります。STEP1の動画で違いを比べると、作業によって向き不向きがわかり、使い分けの判断がしやすくなります。" },
    { question: "プログラミング未経験でもClaude Codeは使えますか？", answer: "STEP4には非エンジニア向けの入門動画も含めています。まず9分の全体像動画で、何ができるかを確認してから試してください。" },
    { question: "料金プランや最新機能はどこで確認できますか？", answer: "料金や提供機能は変わることがあるため、このページでは扱っていません。Anthropicの公式サイトやヘルプで最新の情報を確認してください。" },
    { question: "仕事の資料をClaudeに渡しても大丈夫ですか？", answer: "勤務先の情報セキュリティのルールを先に確認してください。社外秘や個人情報を含む資料は、ルールで認められた範囲でだけ使います。" }
  ],
  relatedLinks: [
    { label: "Claudeの動画一覧", href: "/genre/ai/Claude/" },
    { label: "生成AIロードマップ", href: "/guide/generative-ai/" },
    { label: "Claudeの特徴と料金を比べる（manapick AI）", href: "https://ai.manapick.app/tool/claude/" }
  ]
} as const;

export default claudeGuide;
