# Manapick ingest report 2026-06-10

- generatedAt: 2026-06-10T13:10:43.397Z
- input: data/drafts.json (run1: all genres; run2: data/marke/biz/shikaku/prog/english); run3: money refill
- output: content/videos.json
- minScore: 28
- currentBefore: 193
- additions: 268
- skipped: 1019
- quotaEstimate: search.list 90 calls = 9,000 units + videos.list batch calls/channel補完 (approx. 75 units)
- postProcess: channel-cap removals 2, money-safety removals 14, provisional scores added 9

## Runs

- run1: additions 246, skipped 518, currentBefore 193
- run2: additions 34, skipped 425, currentBefore 439
- run3-money-refill: additions 4, skipped 60, currentBefore 459

## Additions by genre

- ai: 55
- biz: 14
- data: 11
- english: 26
- kaikei: 28
- marke: 20
- money: 25
- prog: 43
- shikaku: 18
- video: 28

## Skipped summary

- below_min_score_or_cutoff: 929
- channel_cap: 39
- post_ingest_money_safety: 14
- deny_title:絶対: 10
- deny_title:誰でも: 8
- money_deny_title:おすすめ銘柄: 4
- post_ingest_channel_cap: 2
- money_deny_title:[0-9０-９]+万円.*貯め: 2
- money_deny_title:老後安泰: 2
- deny_title:FX: 1
- kaikei_upper_qualification_cap: 1
- money_deny_title:1億円: 1
- money_deny_title:買うべき: 1
- money_safety_scope: 1
- money_deny_title:おすすめ投資信託: 1
- money_deny_title:失敗します: 1
- money_deny_title:最強: 1
- deny_title:億り人: 1

## Post process

- channel_cap removal: ai / mikimiki web スクール / jyZ1D9dP4fI / 【最新版】超初心者OK! 最強画像生成AI Midjourneyの始め方・基礎講座(資料付き）
- channel_cap removal: prog / キノコード / プログラミング学習チャンネル / g5q8xIQPbbs / 30分で応用まで一気に！【Python入門・応用講座】16.関数｜関数はレシピを記憶させるようなもの（初心者にもわかりやすく説明）
- money_safety removal: 16_SUESqk8g / 【新NISA完全攻略】月5万円から始める「リアルすぎる」1億円の作り方【山口 貴大(ライオン兄さん)】
- money_safety removal: O1q6xsWPAYE / 【2025年からでも遅くない】新NISAのやさしい始め方を超初心者向けに解説！おすすめ銘柄や手続きの流れも完全ガイド
- money_safety removal: EOeNtyNdLVw / 【世界一やさしい】iDeCoの入門知識や知っておくべき情報を解説！NISAとの比較、おすすめ銘柄、受け取り方の出口戦略も完全ガイド
- money_safety removal: Newn9NY24WE / "投資信託"の総まとめ!! ｢オルカン｣｢S&P500｣｢日経平均｣…初心者が買うべき投信はどれ？定期預金とも比較！【マヂカルラブリーと学ぶ 松井証券 資産運用!学べる予備校 Season1 #3】
- money_safety removal: KssJh3fhlQM / 【超初心者向け】新NISAはコレやっとけばOK！資産を増やす戦略を徹底解説【おすすめ投資信託】【インデックス投資】
- money_safety removal: vnIZNoMZk8M / 【新NISA】初心者は’’コレ’’で失敗します！お得な制度に潜む罠とは？
- money_safety removal: gF2r8lp_DqY / 【最新版】結局これが1番お金が貯まる！5週間やりくり節約主婦の楽しみながら緩い節約生活で100万円貯める習慣まとめ
- money_safety removal: 3JBvYkIUjZE / 【投資初心者へ】結局インデックス投資が最強である理由を徹底解説！これからの日本は節約→貯金→投資が必須になります、、、。
- money_safety removal: tAUnHeTWOuc / 【人生を変えた節約術】夫の手取り20万円台で4000万円貯めた方法15選！4人家族の節約生活
- money_safety removal: Oqc9PzI_RTc / 【iDeco 始め方】40,50代が今からiDeCoやるならコレだけで老後安泰
- money_safety removal: nLWWowcotaw / 【2026年対応】50代60代の新NISA、この３つの流れで始めれば９割問題ありません！
- money_safety removal: ztWlPjrCx7E / 【月1万円の積立はヤバい】50代60代の新NISA！積立額は月○万円だと超優秀です！9割の人ははこれで老後安泰【資産運用/投資】
- money_safety removal: 6tSC9d1g3qU / 【超改正】2026年4月､iDeCoが不要になる人続出！年12万円の節税も【会社員･自営業･公務員/企業型DC確定拠出年金･マッチング/DB確定給付･共済/手数料･出口戦略/いつから･わかりやすく】
- money_safety removal: nLWWowcotaw / 【2026年対応】50代60代の新NISA、この３つの流れで始めれば９割問題ありません！
- money_refill addition: TKMOTT5GoXE / 【積立NISA】後悔・失敗しました。初心者の主婦が5年やったリアルな投資状況・銘柄
- money_refill addition: 64tlyWtEBsY / 【貯まる家計簿】シンプルな家計簿の書き方
- money_refill addition: nLWWowcotaw / 【2026年対応】50代60代の新NISA、この３つの流れで始めれば９割問題ありません！
- money_refill addition: 0e3XPSUzI5Q / NISAの買い方で損している人、実はめっちゃ多いです。NISAの資産運用術お伝えします。
- provisional score backfill: 9 existing seed videos set to 28/35 with axis scores

## Adopted

| ytid | genre | sub | score | channel | title |
|---|---:|---:|---:|---|---|
| fZMQwtRNI70 | ai | Gemini | 34 | かけち | 【完全マスター】AI初心者にオススメ「Gemini」の使い方・基礎を徹底解説！ |
| NtyOvIPipak | money | NISA | 33 | コアラ先生の時事ネタ祭り | 【2026年決定版】これ一本でわかる！知識ゼロからNISAを始める完全ガイド｜投資の基本から買い方まで解説 |
| wVf1wuIFH3A | marke | SNS | 33 | mikimiki web スクール | 【最新】超初心者さんOK！Canva使い方入門・基礎をわかりやすく解説 |
| NTFIFwmrjiw | ai | Claude | 33 | mikimiki web スクール | 【初心者OK🔰】アンソロピック「Claude Cowork」使い方基礎講座！活用法まで分かりやすく解説！ |
| SfCNwzANbUY | ai | Gemini | 33 | Mappy Photo | 【完全版】Googleの最強AIツールGeminiの使い方徹底解説【初心者必見】 |
| yd-bpNe3Axg | ai | Gemini | 33 | ダイさん・AI活用の専門家 | 【生成AI】超初心者OK!「Gemini」をもっと使いこなすための使い方・基礎をわかりやすく解説！【完全マスター】 |
| o6ARRGrW3BA | english | 発音 | 32 | PIVOT 公式チャンネル | 【英語発音完全ガイド】学校では教わらない発音上達法／YouTuberだいじろーが解説／初中級者必見 まずは母音を攻略せよ／盆踊りのリズムを捨てろ／エミネムも歌える【ENGLISH SKILL SET】 |
| 64sjQHaRj9I | money | NISA | 32 | コアラ先生の時事ネタ祭り | 【これ一本でわかる】完全投資初心者が知識ゼロから新NISAを始められる入門動画！2024年版 |
| VTbepCbuFwc | money | NISA | 32 | コアラ先生の時事ネタ祭り | 【完全図解】投資初心者のための新NISA活用術！知らないとヤバい理由をわかりやすく解説します |
| J7MqGeEJFoM | money | NISA | 32 | コアラ先生の時事ネタ祭り | 【これ一本でわかる！】投資初心者でもスグに新NISAを始められる超入門動画！2025年版 |
| PJd_O3Iw7O4 | data | Excel | 32 | Office HARU | 【Excel講座】スタイリッシュなダッシュボードのかんたん作成★初心者でもサクッと作れる！ |
| aBClTyyXCT8 | ai | 画像生成 | 32 | AI FREAK - 最新のAIツールをご紹介 | 【最新版】『AI動画の作り方』を初心者向け🔰に徹底解説。AI猫動画・AI映画・AIアニメ・MVを作れるおすすめAIツールは？ |
| O2Q0-JLpYtc | ai | Gemini | 32 | 楽したい【AI × ITで効率化ch】 | 【初心者必見】Googleの最強AI「「Gemini」の使い方・基礎を徹底解説！ |
| Ju0w7JxgMc8 | marke | SNS | 32 | 佐藤辰則 / iPad・AI活用教室 | Xエックス（旧ツイッター）アプリの使い方解説。初心者入門者向け。【Twitter / iPhone・iPad】 |
| Pl-IaM0ftAk | ai | 画像生成 | 32 | ここなのAI大学 | 【完全攻略】Googleの画像生成AI「Nano Banana Pro」の使い方を解説します |
| 9dUkUyHo8Hw | ai | Copilot | 32 | みやっちのAIエージェントやってみた | 【40分でマスター】完全初心者でも”明日から実務で使える”Microsoft 365 Copilot完全攻略 |
| 7DkEl0kiD9g | ai | ChatGPT | 32 | mikimiki web スクール | 【2026年最新版】超初心者OK！ChatGPTの使い方・基礎をわかりやすく徹底解説(資料・プロンプト集付き) |
| yZBvdoTDjBE | english | TOEIC | 32 | Makieigo | 【TOEIC完全ロードマップ】これで伸びなかったら諦めてください。推奨教材と勉強方法を全て解説します |
| PLngsyLaEhw | ai | Gemini | 32 | スマホまるわかり教室 | 【超簡単】今日からあなたをサポート！シニアにも好評！初心者OK!「Gemini」の使い方・チャットCPTとの比較・基礎をわかりやすく解説！今日から生活が変わる！【Google Gemini】 |
| agOKPlMJkx4 | english | 英会話 | 32 | ハンナのTOEIC部屋🧃🌟 | 【初心者向け】3ヶ月でTOEIC600点完全ロードマップ |
| Ci4ySRp0AKM | ai | 画像生成 | 32 | AIマスターラボ | 【2025年最新】初心者向けSeaArt完全ガイド: 画像生成AIの使い方を徹底解説 #SeaArt #画像生成AI #無料 |
| Dwj4IvLSZ-8 | ai | Gemini | 32 | あいまる / iPhone×AIで毎日を効率化 | 【完全マスター】AI初心者が学ぶべき「Gemini」の始め方・使い方をわかりやすく解説！ |
| vjFZXXPA888 | video | DaVinci | 32 | Wataru Hayashi / トラベルビデオグラファー | 【完全無料】はじめてのDavinci Resolve！無料版を使った動画編集初心者向け編集チュートリアル！超入門20分解説。【2025年最新版ダビンチリゾルブの使い方】 |
| cZZ7HNg1QW0 | ai | Claude | 32 | ひかりのAI大学 | 【初心者向け】Claude in Excelの完全ガイド｜インストールから実務活用まで全部解説します！ |
| cyOTQzI2AFU | prog | Git | 32 | IT ビギナーズ -プログラミング塾- | 【初心者でもわかる！】Gitの使い方講座 |
| I4zjE8wUME0 | money | NISA | 31 | TBS NEWS DIG Powered by JNN | 初心者必見！来月スタートの新NISA「始め方」「投資枠の違い」「毎月いくら投資する？」気になる疑問を聞いた【Nスタ解説】｜TBS NEWS DIG |
| gM1QW-qvJDY | money | 投資 | 31 | 両学長 リベラルアーツ大学 | 【再放送】【初心者向け】投資信託とETFの違いを分かりやすく解説。高配当株好きはETFがおすすめ！【株式投資編】：（アニメ動画）第100回 |
| mxXZokjtVyo | money | NISA | 31 | 両学長 リベラルアーツ大学 | はじめての確定拠出年金iDecoや企業型DCについて初心者向けに解説^^【お金の勉強　株式投資編】：（アニメ動画）第492回 |
| puNuCPlsNH0 | video | DaVinci | 31 | 動画クリエイターへの道 by machosuke | 【ダビンチリゾルブの使い方】超入門10分でマスターはじめてのDaVinci Resolve \| 動画編集初心者向けチュートリアル |
| MWmi1nmcrBA | ai | Gemini | 31 | こーすけ先生のGoogle塾 | 【生成AI】「Gemini」をもっと使いこなすための基礎知識を伝授！ |
| 9XK9X_g2hYA | ai | Copilot | 31 | ユースフル \| Copilot情報局 | 【2025年最新版】Microsoft Copilotの最新動向！基本の使い方と注目機能5選をCopilotベストセラー講師が解説 |
| d1o0lW9p3-Q | ai | 自動化 | 31 | PIVOT 公式チャンネル | 【AIエージェント活用術 vol.1】今さら聞けない！AIエージェント入門編／AIエージェントと従来の生成AIとの違い／全10回シリーズ　ゴールは自分で開発できるようになる！ |
| rAHC_p4G2ng | video | After Effects | 31 | Coloso 切り抜き【公式】 | 【MV制作】有名ボカロMVの作者が作り方を1から全て徹底解説します！【After Effects】【ぬヴェントス先生/Coloso】 |
| ZE484EEuQ8k | prog | JavaScript | 31 | セイト先生 by AIプログラミングスクールSiiD | 【永久保存版】宇宙一簡単なJavaScript入門講座！プログラミング初心者でもこれ1本でOK |
| Z8EJrh5g7eU | ai | Gemini | 31 | ひかりのAI大学 | 【初心者必見】Googleの最新AI「Gemini 3」の進化がすごい！今より使いこなすための神機能を日本一わかりやすく解説します！【無料AI】 |
| WP31TWXtvlU | video | DaVinci | 31 | AKIYA MOVIE | 【DaVinci Resolve】15分間で完全攻略！改｜超初心者向け |
| oVfnsBeS1XE | money | 投資 | 31 | BANK ACADEMY / バンクアカデミー | 【完全ガイド】eMAXIS Slim全世界株式(オールカントリー)の入門知識を総まとめ！“なんとなくオルカン投資”は卒業しよう |
| efzTU1yzjss | video | After Effects | 31 | ミコンスキー🦊 | 【AfterEffects】15分でわかる静止画MADの作り方講座！【チュートリアル】 |
| m30p5rrNZWw | ai | 自動化 | 31 | 【まっち】ゼロから始めるAI活用 | 【全員必見！】Claude自動化マスターへの完全ロードマップ |
| jERgptRtkdE | ai | Copilot | 31 | トモミツの即実践AI活用術ch | 【超完全入門】Copilotの特徴・機能・活用法を完全解説 |
| zmIuwSo7mEA | ai | 画像生成 | 31 | AIマスターラボ | 【無料】Nano-bananaの使い方とできること10選｜Gemini画像生成AIを初心者向けに解説【Gemini 2.5 Flash Image】 |
| ZOWhaUQCJBo | ai | Gemini | 31 | キートン・ラボ | シニア＆超初心者のための「AI入門」Gemini（ジェミニ）を使ってみよう！ - シニア＆超初心者のためのスマホ寺子屋 by スマホアドバイザーはーにゃ |
| Wok45BQMEV8 | ai | 画像生成 | 31 | mikimiki web スクール | 【2026最新！】Google最強AI「NotebookLM」使い方/全機能/活用法を徹底解説！超初心者さんOK！(資料・プロンプト付き) |
| sNKBe3CPdOs | video | DaVinci | 31 | 動画クリエイターへの道 by machosuke | 【無料版】ダビンチリゾルブ使い方基礎 \| 素材の取り込み、カット、音楽・テロップ入れ、音量調整、書き出しまで網羅 \|初めてのDaVinci Resolve動画編集 \| 初心者入門チュートリアル |
| 31JiybBMlck | ai | Gemini | 31 | あっちゃん教えて | 【無料で使える】GoogleのAIアプリ「Gemini ジェミニ」使い方｜初心者必見 |
| -0V40QSgr6g | video | DaVinci | 31 | あをき / AOKI | 【超入門】2026年動画編集始めるならコレ！ダビンチリゾルブ完全攻略ガイド【DaVinci Resolve20】 |
| o5kXK5JvIt8 | ai | Gemini | 31 | mikimiki web スクール | 【2026最新！】Google最強AI「Gemini」使い方/全機能/活用法を徹底解説！超初心者さんOK！(資料・プロンプト付き) |
| KKb1WNtrFmc | money | NISA | 31 | サンデーマネーチャンネル | 新NISA完全解説！始め方と制度内容を初心者向けに分かりやすく教えます |
| hWVqaNkmHzE | marke | SEO | 31 | Web集客専門チャンネル-株式会社ノックス- | GA4（Googleアナリティクス4）の見るべき指標や使い方を完全解説！ |
| VyC1QaEtNoc | marke | SEO | 31 | AIでサボろうチャンネル | 【非エンジニア向けCursor入門】AIが文書作成をフルサポート！ プログラミングじゃない使い方教えます |
| n6T4a_AKldc | ai | Claude | 31 | #usutaku_channel | 【脱初心者】非エンジニアでもわかる2026年最強生成AI「Claude」を完全解説します |
| _rIozAfVG3A | shikaku | 宅建 | 31 | こざりえの裏技宅建合格チャンネル | 【宅建受験生必見】一発合格ロードマップ完全版！試験本番までのスケジュールと戦略をこざりえが徹底解説 ！ |
| ccT5x1TDMIo | ai | 自動化 | 31 | 【さき】のAIでええやん。 | 【基礎決定版】ChatGPTもGeminiもこれで使える！コスパ最強AI Gensparkで無駄作業を全部自動化する方法と基礎的な使い方も全部教えるで！【初心者】 |
| cezk7NeCDm0 | ai | Claude | 31 | いけともch | Claude Code 超初心者 完全入門〜インストールから初タスクまで。Claude Coworkの使い方も説明 |
| nVbhz29JMn8 | video | デザイン | 31 | 僵尸パア | 【初心者OK】無料Affinityだけでサムネイルを作る方法｜YouTube用デザイン講座 |
| lYOzkLEe3lI | ai | ChatGPT | 31 | 楽したい【AI × ITで効率化ch】 | 【2026年最新版】超初心者も簡単！ChatGPTの始め方・使い方をわかりやすく解説！無料版を使い倒したい人に【保存版】 |
| 7ymY_3uLZzM | video | デザイン | 31 | 僵尸パア | 【初心者OK】無料Affinityだけでサムネイルを作る方法後編｜YouTube用デザイン講座 |
| nEpewJsEgUg | english | 発音 | 30 | だいじろー Daijiro | アメリカ英語発音入門  完全ガイド 【超有料級】 |
| UFW7XdMvdOc | money | 投資 | 30 | 両学長 リベラルアーツ大学 | 【初心者向け】投資信託とETFの違いを分かりやすく解説。高配当株好きはETFがおすすめ！【株式投資編】：（アニメ動画）第100回 |
| iBb_dheAOZI | english | TOEIC | 30 | 【TOEIC対策】猛牛ちゃんねる | 【TOEIC】リスニング苦手な人がスルーしてるのはこれです【勉強法を実演解説】 |
| CynusOl-YuQ | ai | Gemini | 30 | AIで時短ペラペラ英語 \| 超進学校教師みなと | まだChatGPT使ってるの？Google Geminiを使って30日で英語が話せる7ステップ勉強法 |
| blqr_9Ecz9U | money | NISA | 30 | 脱・税理士スガワラくん | 本当にそんなにスゴイのか？新NISAが税制改正でどう変わろうとしているのか解説します！ |
| 06FUV3w64rE | english | 発音 | 30 | しゃべれる英語 | いちばん最初に覚える英単語300 (🇯🇵日→🇺🇸英) 〜日常英会話の5割をカバー☆初心者向け☆聞き流し英語 |
| -imMwJqBKm4 | money | NISA | 30 | コアラ先生の時事ネタ祭り | 【アニメで解説】iDeCo(イデコ)を初心者にもわかりやすく！～基礎編～ |
| JL9M16hYTaY | english | 発音 | 30 | 8分英語 8Minutes English | 【最短最速】１日10分。気づいたら英語話せるようになる勉強法 |
| 5AmpuQsZh1Q | money | 家計 | 30 | 街角レモンの暮らし手帳 / まちれも | 【家計管理】80万回以上再生された家計簿の書き方の徹底解説 【保存版】 |
| tZLBaiN1EZg | ai | ChatGPT | 30 | 本気AI(MAJI AI) | 【厳選】知らないともったいない！ChatGPTの便利な使い方 TOP10 |
| WHwuNP4kalU | prog | Git | 30 | だれでもエンジニア / 山浦清透 | 【Git入門講座 合併版】この動画1本でGitとGitHubの基礎をゼロからマスター！【初心者向け】 |
| 6SLMB7BPG9E | prog | Git | 30 | Pythonプログラミング VTuber サプー | 【わかりやすい！Git操作】初心者向けのGitの基本 〜 30分で入門！ |
| UK27sXFc-3A | money | 投資 | 30 | BANK ACADEMY / バンクアカデミー | 【超初心者向け】投資1年目に本気で伝えたい、10のルールとは？これを知れば投資の失敗を避けられます |
| Dz95iUNt-fg | prog | Git | 30 | Pythonプログラミング VTuber サプー | 【GitHub入門】初心者向け！GitHubでチーム開発するための基本操作を解説！ |
| n3STyxX_Ixg | kaikei | FP | 30 | ほんださん / 東大式FPチャンネル | FP3級爆速講義 #5 難しい公的年金のしくみを初学者でも基礎からスッキリ理解（ライフ） |
| Uml3jEPWIKo | prog | Git | 30 | AIでサボろうチャンネル | 【AI活用に大活躍】非エンジニアのためのGit+GitHub入門【コマンド暗記不要です/GitHub Desktop】 |
| XyZhUfxXozM | prog | インフラ | 30 | TECH WORLD | 【最強のプログラミング勉強法×技術キャッチアップ方法】メガベンチャー、外資ITで働く現役エンジニアが今初心者に戻るならこう勉強する。 |
| 4RkObjgOpYI | ai | Claude | 30 | にゃんたのAIチャンネル | ChatGPTやClaude Codeと何が違う？非エンジニアでも使える「Cowork」の実践的な使い方を解説してみた |
| hQRV4XOh4qM | biz | プレゼン | 30 | しごおもTV | 【初心者脱却】キレイな資料の作り方！【パワポ】 |
| EZINHGqu2Cw | prog | Git | 30 | いけともch | 非エンジニアもそろそろ向き合う必要あり！GithubがなぜAIエージェント時代に必須のスキルなのか？基本的な考え方や使い方を徹底解説 |
| H2BKpouB0Y0 | video | After Effects | 30 | Action Planetあくしょんプラネット | テキストアニメーション15選 / After Effects CC2024 使い方講座 |
| 6dtfq6v049g | ai | Gemini | 30 | 佐藤辰則 / iPad・AI活用教室 | 【初心者向け】Geminiアプリ使い方解説！【iPhone / iPad / ジェミニ / Gemini Live】 |
| X5r-bif6ilY | ai | Copilot | 30 | AIスキルアカデミー | 【MicrosoftのAI革命】企業で最も使われているCopilotのすごい使い方10選【プロンプト例文も解説！】【ChatGPT】 |
| FoU5fzseT7M | ai | 画像生成 | 30 | ナオヤ@AIヲタク | 【無料で使える神ツール!!】Google AI Studioの始め方から活用事例まで初心者向けに簡単解説！AIチャットならこれ一択！ |
| e_uClIWChtw | ai | Claude | 30 | Web&AI活用術 WEBST8 ウェブストエイトチャンネル | 【Claude Codeインストール設定】Claudeとは？始め方・使い方を初心者向けに徹底解説 #webst8 |
| 4f9c1uD_D98 | marke | SNS | 30 | そら【インスタ収益化完全攻略】 | 【これ1本で完璧！】初心者向けインスタグラムの始め方「ゼロから完全解説」投稿方法や設定、収益化のやり方まで！【永久保存版】 |
| IcTHcOYsrwo | prog | Web開発 | 30 | せかチャン - 世界一わかりやすい情報科チャンネル | Webアプリが動く仕組みや開発できる言語の違いを初心者向けに解説【JavaWeb入門講座1】Webアプリケーションとは |
| 2s4LHNuVhaU | kaikei | FP | 30 | 1発合格! まめだいのFP道場 | 【FP3級解説】 FP3級のライフ分野をたった1時間で完全攻略！【FP3級勝組道場 (ライフプランニングと資金計画編)】 |
| 5SUv1DVJzdc | kaikei | FP | 30 | みぃこのFP合格応援チャンネル | 【2025.5｜3級学科】CBT公表分　読み上げと解答動画です。聞き流しもOK！2級勉強中の方にも基礎のおさらいにオススメ！　FP技能士3級　ファイナンシャルプランナー　過去問実践 |
| viCA3JYJwSw | video | DaVinci | 30 | Davinci Resolve初心者習得チャンネル@認定トレーナー | 【超初心者向け】たった12分でわかる！動画編集の基本ステップ解説🎬✨ダビンチリゾルブ |
| bexpE7oPpAg | shikaku | 宅建 | 30 | 棚田行政書士の不動産大学【公式チャンネル・宅建】 | 【宅建業法1-1宅建業について：インプット編】宅建業のキホンを初心者向けに解説。わかって合格る宅建士基本テキスト最強とコラボ講義。 |
| Mbx95ssfFyE | video | DaVinci | 30 | Davinci Resolve初心者習得チャンネル@認定トレーナー | 【ダビンチリゾルブ19 】インストール完全解説：ダウンロード～初期設定まで解説 |
| olqOGLymDbw | prog | Python | 30 | キノコード / プログラミング学習チャンネル | Python学習ロードマップを40分で徹底解説｜作りたいもの別のおすすめ学習方法、学習時間を初心者向けに解説 |
| XozGuvi2gLQ | video | デザイン | 30 | YouTube集客チャンネル -株式会社EAVAL- | 2025年のYouTubeが爆発的に伸びるサムネイルの作り方完全攻略 |
| xLyflLmz5qI | biz | Word | 30 | Yumiのタイピング教室 | 【Wordの使い方】初心者のためのワード講座　Word文書作成の超入門 |
| mslQdf9yNqI | video | デザイン | 30 | りゅうすけ \| 動画編集チャンネル　AIM Creators College | 【超初心者向け】2024年版サムネイルの作り方完全攻略！【Photoshop】 |
| T5ry8nlFAkg | ai | Gemini | 30 | AI大学【AI&ChatGPT最新情報】 | 【ChatGPT超えの成長】Google Gemini完全ガイド、2025年12月最新版！ この動画1本で使い方＆全機能を網羅！ |
| p5vDDRT2wBY | ai | Gemini | 30 | キートン・ラボ | シニア＆超初心者のための「AI入門」Gemini（ジェミニ）で文章を作ってみよう - シニア＆超初心者のためのスマホ寺子屋 by スマホアドバイザーはーにゃ |
| cIG90MOfcSQ | video | デザイン | 30 | あをき / AOKI | 【完全無料】YouTubeのサムネイルを作る方法｜Davinci Resolve【初心者向け】 |
| O56_6A6r8wQ | video | DaVinci | 30 | KCS | 【素材付き】動画編集の基本が25分で使えるDaVinci Resolve 19 完全初心者ガイド \| KCS |
| PY4ipuISyAc | ai | Gemini | 30 | スマホHELPMAN | 【超初心者向け】Geminiの始め方・使い方 〜Googleが作ったAI（人工知能）を体験〜▶︎スマホのトリセツ Android 第35回 |
| t8qGGN6wYH8 | ai | Claude | 30 | Leo Tohyama | 【25分で完全解説】Claude Coworkで AI を「自分専用」にする方法。 |
| l_CwyLbEo_c | ai | Gemini | 30 | AIコウリツカ | 【2025年最新】Geminiの使い方をゼロから初心者向けに解説！ |
| _pI8iGXvyRI | ai | Claude | 30 | HIKAGE \| Claude AI副業 | 【最新20分で安心&最強に使い始められる】一番カンタンなClaude始め方・使い方 ・初期設定 ー 非エンジニア向け完全セットアップガイド🔰 |
| Obpxflp5SFM | ai | ChatGPT | 29 | パソコン博士TAIKI | 【ChatGPTはもう古い】知らないと乗り遅れる。Googleの最新AIが異次元クラス！ChatGPTを超えた「Gemini 3.0 Pro」と「Nano Banana Pro 」が凄すぎる |
| PyJU6Ba53XE | biz | Word | 29 | いなわくTV | Word初心者【基礎講座】練習用データ付2024年完全版 |
| vI6CwiI0KyY | ai | 画像生成 | 29 | パソコン博士TAIKI | 【神回！】貴方の人生を変える無料AI達！全て無料で使えるGoogle AI Studioが凄すぎる！【スマホでもOK！どれもマジ最高！】 |
| Qe3EmiFWgGM | english | 発音 | 29 | Atsueigo | 【永久保存版】たった30分で発音記号を完全攻略【速習まとめ】 |
| FMsSLZkif4E | money | NISA | 29 | BANK ACADEMY / バンクアカデミー | 【超初心者向け】2024年からの新NISA制度のポイントを、投資経験ゼロでも分かるようにまるごと解説！ |
| JpwV_NNn7aI | kaikei | 簿記 | 29 | 【簿記･FP】独学ちゃんねる  桜田 | ✧第1回✧【簿記3級】入門①（簿記とは？） |
| PDLLLRb49nM | shikaku | 宅建 | 29 | マジでイケてる宅建講座【ゆーき大学】 | 【宅建 2026 宅建業法 #0】合格者は何点とってる？宅建の入門講義 |
| SK6HoD5Zido | english | 発音 | 29 | 耳で覚えるネイティブ英語　ねこの「ミミ」 | 54【初心者向け】ネイティブが毎日使う本当に通じる英語フレーズ100選【01】 |
| ZMwlUpXMZLQ | kaikei | 簿記 | 29 | 【簿記･FP】独学ちゃんねる  桜田 | ✧第2回✧【簿記3級】入門②（決算書・5要素） |
| bpo-eZZxDVc | kaikei | 簿記 | 29 | 【簿記･FP】独学ちゃんねる  桜田 | ✧第3回✧【簿記3級】入門③（一連の流れ） |
| UDLDRi88QP0 | kaikei | 簿記 | 29 | 両学長 リベラルアーツ大学 | 【初心者も必見】簿記3級の次に「簿記2級・1級」を学ぶ5つのメリット【お金の勉強初級編】：（アニメ動画）第358回 |
| A11m1lWiUrs | shikaku | IT | 29 | 情報処理技術者試験・高校情報教科対策の突破口ドットコム | インターネットの仕組み入門～IPアドレス・DNS・MACアドレス【高校情報１・基本情報技術者・ITパスポート】高校情報Ⅰ教科書完全準拠版 |
| GP6z9ubBg20 | biz | Word | 29 | ゼロからパソコン | 【ワード】表の作り方。30分で自由に表が作れるようになる♪ |
| heAUeY2fy-s | ai | Copilot | 29 | PIVOT 公式チャンネル | 【Copilot活用術 Vol.2】徹底解説Copilot in Word/Excel/PowerPointのビジネス活用法／ポイントはツールの使い分け＆組み合わせ／すぐに使えるプロンプトの実用例 |
| m2qZP4x4ils | english | ビジネス英語 | 29 | Atsueigo | 【永久保存版】ビジネスで使う英語表現100選｜テキスト無料配布中 |
| 9KWoXenAfhc | kaikei | FP | 29 | ほんださん / 東大式FPチャンネル | 【FP2級】ここからFP2級に簡単合格！FPの職業倫理と関連法規から始まるNo.1FP講師のプロ講義（完全A01） |
| cVnQvW3B8vE | kaikei | FP | 29 | ほんださん / 東大式FPチャンネル | FP3級爆速講義 #9 ３級はこれだけでOK！保険のしくみがよくわかる神講義（保険） |
| xg3mAYn83ao | data | 統計 | 29 | 超わかる！授業動画 | 「仮説検定」を世界一わかりやすく解説【高校数学】データの分析・統計的な推測・帰無仮説・対立仮説 |
| oDtA78nwQMM | shikaku | IT | 29 | 実践の鬼:IT学校さいとうさん | 【2023年版】基本情報技術者試験完全攻略（科目B解説編） |
| qASYpgauXRs | english | ビジネス英語 | 29 | NAOMI CHANNEL WORLD - 英会話・ビジネス英語・アメリカ情報 | ビジネス英語自己紹介【完全版】！リアルな自己紹介例文4つ・徹底解説 |
| nhrxZ-v-8ro | marke | Webマーケ | 29 | WebマーケティングTV【StockSun株式会社】 | 【神授業】Webマーケティングなんて初心者でも楽勝！この1本で基礎をマスターせよ |
| acSw8M7jQ2o | prog | JavaScript | 29 | Webの神様 | 【超入門】初心者向けJavaScript解説！これから学習を始める方必見【Webデザイン・プログラミング】 |
| hV4Yu6RiDmQ | ai | Copilot | 29 | ダイさん・AI活用の専門家 | 【実演あり】CopilotだけできるAI仕事術５選！AI活用して生産性が爆上がりする具体的なプロンプトや神活用も解説します!【業務効率化・中小企業】 |
| OGkEQ1_OhRw | shikaku | 宅建 | 29 | 記憶博士の非常識な記憶学 - 吉永先生 | ３日で宅建に合格した”科学的根拠のある„究極の勉強法を教えます【問題集丸ごと暗記術】 |
| z5rWQfDiXCk | kaikei | 簿記 | 29 | 【簿記】マネトク（独学応援ちゃんねる！） | 【簿記3級】超入門：簿記って何？まず最初に全体像をつかむ｜講義#1 |
| 9sPAQJyjeoY | video | デザイン | 29 | NewsPicks /ニューズピックス | 【保存版】思わずクリックしたくなる「サムネイル」大鉄則／開設わずか半年で1.3億回再生を果たしたフォーマットイン型動画戦略とは？／ショート動画のアルゴリズムを見極めろ（NewSchool Movie） |
| 7Yl9Qcbajq0 | marke | SNS | 29 | さき-インスタの大学 | 【ついにきた！】今インスタがかつてないほど伸ばしやすくなってる理由を解説します |
| TgU-FT2WdS4 | prog | JavaScript | 29 | セイト先生 by AIプログラミングスクールSiiD | 【永久保存版】世界一簡単なReact講座・JavaScript初心者は必見！クイズアプリを作って学ぼう |
| WSYFuq6jbzo | prog | SQL | 29 | Pythonプログラミング VTuber サプー | 【プログラミング入門】SQLの基本を解説！データベース操作の学ぼう！〜VTuberと学習〜【初心者向け】 |
| qcui5UQV45U | ai | プロンプト | 29 | KEITO【AI&WEB ch】 | 【脱初心者】ChatGPTやGeminiのプロンプト（指示出し）のコツ！７つの最適解 |
| E-QJu2JZnz8 | kaikei | 簿記 | 29 | はおログ | 【必見】日商簿記2級を1ヶ月で高得点合格へ✏️全社会人におすすめの勉強法紹介！ |
| 03s0CUtBtjY | ai | 自動化 | 29 | 【まっち】ゼロから始めるAI活用 | 完全自動で2000再生！秒で量産！ショート動画システム大公開！ |
| s4do_fCv8fo | english | TOEIC | 29 | Okisvlog | 【TOEIC 910】英語学習のコツ6選｜もっと早く知りたかった勉強法🔰 英会話｜study vlog |
| IK4cfGVowKI | ai | Copilot | 29 | Microsoft 365 Japan | 【Copilot TV】Copilot Chat - 実務テク 3 選　ユースフル x マイクロソフト コラボ企画 |
| c8rGupMvZuI | kaikei | 簿記 | 29 | こん@簿記コーチ | 【保存版】簿記の参考書4冊をプロが徹底比較【簿記3級　簿記2級】 |
| tB94vJAT5wY | shikaku | 宅建 | 29 | こざりえの裏技宅建合格チャンネル | 【宅建】9割が間違える勉強法。最短合格する人の勉強法 |
| lUAU7PwjfQI | english | 英会話 | 29 | しゅみすけ社長 - 英語が話せない社会人を話せる側へ | 【英会話超初心者】失敗知らず - 3ヶ月で話せるようになるロードマップ （学び順） |
| RN8dNXTjuI0 | kaikei | 簿記 | 29 | はいぽの森 | 【簿記2級】最短で合格した勉強法。勉強時間を徹底解説します。【資格取得】 |
| PiFJDzsTSxg | shikaku | 宅建 | 29 | 棚田行政書士の不動産大学【公式チャンネル・宅建】 | 【４月スタート宅建合格スケジュールを公開】まだ間に合います！今から勉強始めて今年宅建試験に合格する方法を初心者向けに解説します。 |
| nE_ZIGhTlrQ | prog | JavaScript | 29 | Webの神様 | 【初心者向け】JavaScriptで簡単なタイピングゲームを作ってみよう！基礎文法が実践的に学べる入門講座【プログラミング】 |
| L3jzl9C6Hnw | video | デザイン | 29 | Wondershare Filmora 動画編集 | 完全無料！YouTubeサムネイル “超”基本の作り方🔰作成から設定まで完全攻略！｜Wondershare Filmora |
| li6FCoes5VE | marke | SEO | 29 | SEOならミエルカチャンネル | 【完全版】GA4分析のプロが語るGoogleアナリティクス4の教科書（初心者向け） |
| kxba5sd-oWc | prog | Git | 29 | セイト先生 by AIプログラミングスクールSiiD | 【AI活用】非エンジニアもできる！Git+GitHub入門講座（Win・Mac対応） |
| Q_l_mkQJrB8 | prog | Git | 29 | SHIFT AI ニュース | 【必須】GitHub入門ガイド｜Claude Code・Antigravity連携まで解説 |
| ZjNC4tAGNsY | kaikei | 簿記 | 29 | 【簿記・会計】公認会計士たぬ吉の資格塾 | 【簿記】超危険！簿記に落ちる勉強法７選！合格するためのポイントも解説！ |
| Dqgyc_S3L0s | prog | Git | 29 | IT屋のたなべ | Git/GitHub入門を一気に学べる高速解説30分！基本的な使い方と覚えるべきコマンド |
| CUWI_-1NumU | ai | Gemini | 29 | Pixelスマホの使い方 - Pixel lab | PixelスマホのGeminiを使って声だけでできるスマホ操作の使い方まとめ！Geminiがスマホのお手伝いさんになる |
| UTg6SWDM9rc | english | 英会話 | 29 | Haru English | ゼロから英語を学び直すための勉強ロードマップ【基礎固め・インプット編】 |
| N_E53APT_Hc | kaikei | 簿記 | 29 | こん@簿記コーチ | 【簿記2級】工業簿記　入門講座【たった20分】【商業簿記との違い】 |
| jQT7HvOHCt4 | marke | SEO | 29 | バズ部 / ルーシー | 【2024年版】サーチコンソールの設定方法・使い方（初心者向け） |
| r7vDMdyU1lU | prog | インフラ | 29 | もりこーぽちゃんねる　インフラ系エンジニア情報チャンネル | 【ネットワークエンジニア入門編】ワイヤーシャークの基礎はこれでバッチリ！ |
| lC_84KlQLbo | english | 英会話 | 29 | スマイルの話せる英語 | 英語力ゼロから1年でTOEIC900点確実にとる勉強法【完全ロードマップ】 |
| BnEW9zTDMIc | kaikei | FP | 29 | 1発合格! まめだいのFP道場 | 【FP3級解説】 FP3級の金融分野をたった1時間で完全攻略！【FP3級勝組道場 (金融資産運用編)】 |
| n0SdZ9X3V4s | video | DaVinci | 29 | Wataru Hayashi / トラベルビデオグラファー | 【超初心者向け】Davinci Resolve使い方解説！元動画も無料配布！【動画編集ソフト・Youtuber・基本的な編集】 |
| FsAmhz8NqFw | prog | SQL | 29 | ビジネススキルアップゼミ　【プログラミング専攻】 | 【データベース入門】SQLServer【基礎編】　ざっくりわかるノウハウ講座 |
| jM44gDLpjPw | prog | SQL | 29 | ビジネススキルアップゼミ　【プログラミング専攻】 | 【データベース入門】Oracle【基礎編】　ざっくりわかるノウハウ講座 |
| uIoVqx4quME | kaikei | 中小企業診断士 | 29 | 診断士LABO【診断士ラボ】 | 【中小企業診断士一次試験】経済学の勉強法完全版！初学者が92点獲得した勉強方法 |
| I0WNU46GH6U | video | DaVinci | 29 | あをき / AOKI | 【2026年】マルチテキストの時代が来ます。使い方・活用例を徹底解説！【DaVinci Resolve】 |
| Zpw-XFydjUc | prog | Git | 29 | フリーランスPM打田裕馬 | 個人開発のためのGit入門〜最短距離で学ぶソースコード管理の使い方〜 |
| 5bk8FDQaWy4 | biz | Word | 28 | ゼロからパソコン | 【ワードの文字がズレる】簡単にそろえる方法あります！覚えてソンなし♪ |
| V-Yf9DEZW6Y | money | NISA | 28 | 両学長 リベラルアーツ大学 | 【歴史が変わる】新NISAのココがスゴイ5選【株式投資編】：（アニメ動画）第408回 |
| j6DZgTj9ma0 | english | 英会話 | 28 | 英語聞き流し \| Sakura English | ゼロから始める〜超初心者向け・英会話207フレーズ 〜シンプル＆ゆっくり発音【177】 |
| fOZB77wGakE | english | ビジネス英語 | 28 | ジュディ【英語】 | 【たった30分】最速で話せる英語が身につく神トレーニング |
| EIKASNxTtNI | english | 発音 | 28 | だいじろー Daijiro | オススメの英語発音の勉強法を語る【一人でいる時にできる】 |
| iJQEvmeGhJ8 | english | 発音 | 28 | だいじろー Daijiro | 日本語がペラペラなアメリカ人に日本語の発音を教えてもらってみた |
| pkV0teAuj-g | money | 家計 | 28 | 4人家族ぴーちの節約術 | 【自然に貯まる】お金を貯めるための必須設定5選！節約主婦の貯まる仕組み作り/貯金術 |
| BBKVCkdqS8g | prog | JavaScript | 28 | せかチャン - 世界一わかりやすい情報科チャンネル | 【Java入門講座 総集編】超初心者歓迎！Javaの基本文法がすべてマスターできる！ |
| ig3GosWuKF0 | prog | JavaScript | 28 | セイト先生 by AIプログラミングスクールSiiD | JavaScript入門・完全版コース／プログラミング初心者向け、コスパ最強講座 |
| r9noktjw13w | kaikei | FP | 28 | ほんださん / 東大式FPチャンネル | FP3級爆速講義 #1 ここから始まるFP3級爆速合格！試験頻出のFPのNG行為とは？（ライフ） |
| jj7fEmlvsAg | english | 発音 | 28 | ジュディ【英語】 | 【死ぬほど効果あり】英語が口から出てこない？中学英語でネイティブ発音になる7日間プログラム |
| 6lbzidwiVaY | money | 家計 | 28 | おもちのゆる節約とミニマリスト。 | 【節約ミニマリスト主婦】お金が貯まる暮らし12の習慣︱節約術︱ミニマルな暮らし |
| 6wmlo3ACKd8 | money | NISA | 28 | ひろゆき三昧【切り抜き,ひろゆき, hiroyuki】 | 【ひろゆき】全世代においてNISAをやった方がいい時代になって来ています、NISAを知らない人が損しないように僕が細かく説明します【NISA 投資 インデックスファンド 株 証券口座 貯金 金融庁】 |
| v5fscClujBM | kaikei | FP | 28 | なかちの解説チャンネル | 【FP3級 聞き流し動画】～ライフプランニング編～聞くだけで学習できるFP解説動画！ |
| HuyOO_oxoic | ai | Gemini | 28 | 動画ファン | 【Google Gemini Live】「音声通訳機能」たったワンタップの簡単操作ガイド |
| L3Kt-y15jSM | data | 統計 | 28 | とけたろうチャンネル | 統計検定®２級の全知識【中学の数学からはじめる統計検定®２級講座】 |
| u_IeGvUe3LU | marke | SNS | 28 | さき-インスタの大学 | 【私ならこうする】総フォロワー50万人インスタ運用者が30日で1万フォロワー目指すならこれやります！ |
| JyvAvSm8CMQ | ai | Copilot | 28 | 戸田覚：ガジェット【辛口】点数評価 | 【驚異的に便利！】Office＋Copilotの便利さを知ってください。これは業務効率化の神機能ですね。AIがいよいよやってきました。 |
| lwzNTcR9gkU | kaikei | 税理士 | 28 | copo_こぽ / study vlog | 【税理士試験】独学で1年で3科目合格した勉強法५✍🏻\| 使用教材・勉強量・文房具など |
| IHaIo6g7nHs | kaikei | 簿記 | 28 | こん@簿記コーチ | 【簿記3級】仕訳完全攻略【覚え方3選】【第1問】 |
| -u7MMzz3BZM | data | 統計 | 28 | ド文系でも楽しい【ゆっくり数学の雑学】 | 【総集編】教養としての統計4選 |
| q7J1D2HIUec | shikaku | IT | 28 | 【基本情報技術者試験YouTuber】すーさん | 【全体像】基本情報技術者試験受験者が知っておくべきITの基礎知識 |
| XxW7juTPDBs | data | 統計 | 28 | たにぐち授業ちゃんねる | [数学1][統計学]仮説検定の考え方(改訂版)　 初心者必見！仮説検定を徹底的に解説[データの分析] |
| JsVGO6JfEHE | english | 英会話 | 28 | スマイルの話せる英語 | 英会話おすすめ神教材7選🔰初心者〜中級者用「初めからこの教材で独学しとけば良かった...」 |
| qLS41VN8g7Y | kaikei | 簿記 | 28 | 【簿記・会計】公認会計士たぬ吉の資格塾 | 【簿記初心者向け】しい・くり・くり・しい徹底解説！売上原価の算定 |
| hzn1ff1YoQ0 | shikaku | IT | 28 | みみスタ | サクッと覚える！「ITパスポート」2025年 略語まとめ 直前対策 |
| QhGsuhZYJd8 | ai | 画像生成 | 28 | 金子晃之 | 【超簡単!】AIで画像生成する方法を徹底解説 |
| oICD_NBGzLA | shikaku | IT | 28 | みみスタ | サクッと覚える！「基本情報技術者」2025年 用語まとめ 直前対策 |
| Mx4-2ROT-RQ | video | DaVinci | 28 | AKIYA MOVIE | 【完全保存版・改】認定トレーナーが教えるDaVinci Resolve 20のパーフェクトガイド！無料プラグインも配布！ |
| MGH74IJb7j8 | biz | 資料作成 | 28 | しごおもTV | 【資料作成】コンサルの表の作り方\| 簡単！3ステップ【パワポ】 |
| bbttncDzP6s | kaikei | FP | 28 | はいぽの森 | 【簿記３級】20時間と1100円で合格した勉強法。取っても意味ない？【資格】 |
| rSNN6dkzkB4 | video | CapCut | 28 | mikimiki web スクール | 【2024年最新版】CapCutでバズる動画作成全手順！Instagramリール作成・完全攻略ガイド（TikTok/YouTubeショートにもOK!） |
| nSXnif14lVo | prog | JavaScript | 28 | プログラミングチュートリアル | 初めてのNode.js入門！環境構築からWebサーバーを作ってみよう！ |
| TNlMd7PyDYo | biz | プレゼン | 28 | しごおもTV | 【センス不要】一瞬で伝わる！図解の作り方【資料】 |
| -xZ0agEbuxo | biz | Word | 28 | いなわくTV | 【Word入門】はじめてのワード |
| tz9FGaZdLjU | biz | Word | 28 | 自宅がパソコン教室、ビデオを観ながら実践で作って慣れよう！ | Wordでお知らせ文書を作る方法◆実践で作って慣れよう◆自宅がパソコン教室◆白紙から始めて完成まで1操作毎に分かりやすく解説◆操作マニュアル有◆作成方法、作り方、清掃のお知らせ、ビジネス文書、社外文書 |
| Sc-gjJ0oriE | marke | SEO | 28 | PIVOT 公式チャンネル | 【コンテンツマーケ新常識】オウンドメディア運営者必見/10年で変わったSEOの常識/1つのテーマで記事を量産せよ/SEOのパイオニアが解説 |
| 6HmI5kc2nJw | video | After Effects | 28 | Putti Monkey Wrench | 3Dレイヤーとカメラ-基礎-【AfterEffects/チュートリアル】 |
| GB0-JdTttY8 | shikaku | IT | 28 | 情報処理技術者試験・高校情報教科対策の突破口ドットコム | 情報セキュリティ入門（ファイアウォール・マルウェア・認証認可など）出典：文部科学省 情報Ⅰ教員研修用教材（概要欄参照）　【高校情報１授業・基本情報技術者・ITパスポート・共通テスト】 |
| 6L7RmLIlkjs | prog | JavaScript | 28 | Webの神様 | 【初心者向け】JavaScriptのメソッドを使ってみよう！DOM操作の基本解説 クリックイベントの設定・クラス操作のやり方 【プログラミング入門】 |
| 1i3tXfHM7Xs | video | DaVinci | 28 | 動画クリエイターへの道 by machosuke | 【最新】動画編集効率化のカギ！字幕とText+の違い、メリット、デメリットを徹底解説 \| DaVInci Resolve動画編集 |
| lBuzEvmc1z0 | biz | Word | 28 | アヴニールCADシステムズ | ワード嫌い！のための「超かんたん ワード使い方」初心者でも1時間で「ビジネス文書」が作れる！ |
| ZTbh928Qk3o | video | DaVinci | 28 | DaVinci Resolve & ATEM チュートリアルビデオ集 | DaVinci Resolve 18 入門講座 #1｜動画編集の基礎（エディットページ） |
| 8ZtKgSNDYw8 | ai | Copilot | 28 |  Copilot研究所【株式会社LowCode】 | 【完全版】Microsoft Copilotの活用方法完全ガイド |
| fSgqgvjHYoI | money | 投資 | 28 | サンデーマネーチャンネル | 【初心者向け】投資信託の買い方！仕組みと始め方を分かりやすく解説 |
| cOTBf8bHsXo | prog | Git | 28 | プログラミングチュートリアル | 【GitHub入門】Webアプリを作りながらGitHub開発フローを習得してみよう |
| TIQtQmXsPhU | shikaku | IT | 28 | いとこんテック | ITパスポート１か月で合格した方法【勉強方法やおすすめ参考書も解説】 |
| EVajWVs8CIs | data | データサイエンス | 28 | 田中嘉博 | 36分でぜんぶ学ぶ 統計学・機械学習の基礎を一気に習得 最短コンパクト学習：ｔ検定、分散分析、カイ二乗検定、回帰分析、重回帰分析、Ｐ値と帰無仮説、正規分布、分散と標準偏差、確率分布 |
| FOzvW3ryyLo | shikaku | IT | 28 | 文系でもわかる! IT勉強会 | 【アルゴリズム入門】基本情報サンプル問題(科目B)問10 |
| ZSbXtKt9gxs | money | NISA | 28 | サンデーマネーチャンネル | iDeCo（イデコ）完全解説！始め方・メリット・デメリットを分かりやすく |
| xGJ8NuoAejA | ai | Gemini | 28 | はじめてのAI | ジェミニの始め方｜Googleの無料AIをスマホアプリで使ってみよう【初心者向け】 |
| LpE-5QH-rgQ | video | After Effects | 28 | Action Planetあくしょんプラネット | 50モーション完全解説 / Adobe After Effects |
| 7wEuRdsnBs4 | prog | JavaScript | 28 | Webの神様 | 【超入門】初心者でも安心！JavaScript学習入門（前編）データに関する基礎知識【Webデザイン・プログラミング】 |
| 6_6P6qJ9lvE | money | 家計 | 28 | ゆるごんの家計管理　4人家族 | 【初心者向け】家計簿の項目分けの方法｜お金が貯まる |
| TNKREC43DTk | marke | SNS | 28 | さき-インスタの大学 | 【そのままやって！】30日でフォロワー1000人まで行く方法はこれ☝️週ごとにやること解説します！ |
| i0PcFwkHyak | data | 統計 | 28 | データサイエンス塾!! | 30分でわかる! エクセル統計分析 超入門!!〜データ分析の基本〜 |
| Omk-B1_DumY | ai | Copilot | 28 | ハロー！パソコン教室 | Windowsに搭載されている話題のAI「Copilot」って何？｜業務効率UP！パソコン時短スキル講座 |
| JlnOkrcNSfI | shikaku | IT | 28 | nobu | Eng)study vlog, ITパスポート1週間前〜当日のvlog📖💙仕事しながら2ヶ月で合格した私の勉強法🦋 |
| U6GqYyW6FxM | prog | JavaScript | 28 | 100秒テック | 【超入門】Next.jsの基本がすぐ分かる！アニメーションで解説してみた |
| b1PaI72vYyw | prog | SQL | 28 | せかチャン - 世界一わかりやすい情報科チャンネル | 【JavaDB3】SQLとは何かがわかる初心者向け入門動画 |
| WqI3CPrUeVE | kaikei | 税理士 | 28 | 税理士受験生りお | 【税理士試験】簿記論合格までにやったこと全部公開！格安通信講座と独学で挑む社会人受験生 |
| Ed3SOpJKy5g | video | デザイン | 28 | Chinami Channel ♡ 毒ヶ衣ちなみ【Vtuber】 | 【必見】神サムネ師に学ぶ！サムネイルの作り方andデザイン講座【白亜リラ様/Vtuber毒ヶ衣ちなみ】 |
| mBvQeK3_txM | marke | SNS | 28 | mikimiki web スクール | 【2026年最新】Instagramはどう伸ばす！？アルゴリズム・戦略を徹底解説【資料付き】 |
| A86LDDZguI4 | marke | SNS | 28 | まめ⌇スキルゼロから学ぶインスタ運用 | 【初心者向け】インスタ×アフィリエイト"最短3ヶ月"で月5万円収益化するための3ステップ |
| pn3WP72ZOwE | marke | SNS | 28 | さき-インスタの大学 | 【2026年最新】今バズりにバズってるインスタアカウント20選と伸びてる理由を解説します！ |
| BNo7AFYf3sw | video | Premiere Pro | 28 | 初心者のための動画編集講座 | 【Premiere Pro】ゲーム実況動画の作り方【超初心者向け】 |
| ts2uhJue6B4 | kaikei | 簿記 | 28 | 【簿記】マネトク（独学応援ちゃんねる！） | 【完全ロードマップ】日商簿記2級に1ヶ月で合格する方法 |
| Hfu1EYhfqLE | kaikei | FP | 28 | 税理士受験生りお | 【FP2級完全攻略】YouTubeで勉強！75時間で初学者がFP2級に余裕で合格する最短ルート |
| ribR8jgWSks | kaikei | FP | 28 | 1発合格! まめだいのFP道場 | 【FP2級解説】 FP2級のライフ分野をたった2時間で完全攻略！【FP2級勝組道場 入門編(ライフプランニングと資金計画)】 |
| jz4dJh32RIk | kaikei | 簿記 | 28 | とものり【会計を仕事にch】 | 【簿記２級】コスパ最強の通信講座を経験者が解説します。 |
| V7WAxif7yT4 | prog | Git | 28 | JISOU / Reactチュートリアル | 【完全版】これ1本でGitをマスターできる初心者チュートリアル！ |
| ZGRo6UcT5QU | prog | インフラ | 28 | もりこーぽちゃんねる　インフラ系エンジニア情報チャンネル | 【ネットワークエンジニア入門編】超簡単！これでLANケーブルが切れても大丈夫！気軽に冗長化してみよう |
| HCTLLBpY3qQ | marke | SNS | 32 | mikimiki web スクール | 【最新版】超初心者OK! Instagram（インスタグラム）の始め方・基礎講座【登録/プロフィール書き方/投稿のコツ/リールのコツ/ストーリーズ活用法/リール】 |
| xoL2Q3zjn3k | prog | Python | 31 | キノコード / プログラミング学習チャンネル | 【仕事を自動化したい人へ】できること50例とPython学習ロードマップを丁寧に解説｜初心者向け入門動画 |
| ZEc0PFPm7Pk | prog | Git | 31 | IT ビギナーズ -プログラミング塾- | 【初心者プログラマ必見】しっかりマスターできる「GitHubの使い方講座」 |
| KNP04gsTSKQ | shikaku | AI検定 | 31 | エンジニア転職チャンネル【RUNTEQ公式】 | 【初心者向け】今からAIを学ぶ人のための最短ロードマップ |
| VY82g_vQzEM | biz | 資料作成 | 30 | 【さき】のAIでええやん。 | 【神アプデ】最新版Geminiでパワポ・スライド資料作成が一瞬で終わる方法を解説します |
| rAsovLKXCXo | prog | Web開発 | 30 | プログラミングチュートリアル | 【Cursor入門】初心者OK！AIを使ってアプリ開発する方法を全て解説します ~AI駆動開発入門~ |
| 9caZqGPIY8A | prog | Web開発 | 30 | Python・データサイエンス入門チャンネル -はやたす- | 【完全解説】Pythonでできること10選+具体例50個 |
| HKfOmhPgwgo | marke | SNS | 30 | さき-インスタの大学 | 【超完全解説】インスタが0からでも大成功する手順を全て解説します！ |
| gnl_q-4Gl2M | prog | Web開発 | 30 | 入江慎吾 / アプリ開発FIRE | 【超初心者向け】はじめてのWebサービス、アプリの作り方をわかりやすく解説 |
| nn4RPPR8X1w | data | BI | 30 | DX塾 – Power BIで始めるデータ活用 | Power BI 使い方 超入門｜まず知っておきたい基礎知識をこの1本で |
| GKSUkQrz74Y | english | ビジネス英語 | 29 | StudyInネイティブ英会話 | 【神回】30歳まで英語ゼロ→ネイティブと会話できるレベルになった驚きの勉強法｜田中渓 |
| T--Je6S6WOw | english | 英会話 | 29 | Yasuhiro Takahashi / やすラズマタズ | 【かんたんロードマップ】今年こそ英語を本気で勉強する！と決めた人が最初に見る動画 |
| uT5J6PLTpMY | prog | Python | 29 | Python・データサイエンス入門チャンネル -はやたす- | 【完全攻略】Google Colaboratoryの使い方【Pythonの環境構築は不要】 |
| 02GApICU6UE | biz | プレゼン | 29 | mikimiki web スクール | 【パワポ不要!?】2026年最新Canva・CanvaAIスライド資料作成機能！使い方を徹底解説 |
| H7_QKu9m218 | marke | Webマーケ | 29 | WebマーケティングTV【StockSun株式会社】 | 【神授業】デジタルマーケティングの基礎はこれで完璧！Webマーケティングとの違いも完全理解 |
| 3yXmq-GPLsA | data | データサイエンス | 29 | Python・データサイエンス入門チャンネル -はやたす- | 【完全終了】一生Pythonを習得できない人の勉強法TOP7 |
| 15uUa_hJWWk | marke | SEO | 29 | SEOならミエルカチャンネル | SEO対策の基本を1から解説｜初心者向け完全ガイド |
| GoTaEs1yyUM | prog | Git | 29 | ナオトのAI戦略室 | 【初心者向け】これでコードをなくさない！VSCodeでの初めてのGitHubアップロード（push）入門【2025年最新版】 |
| okpRV08-svw | prog | Python | 28 | いまにゅのAIプログラミング塾 | 【完全版】この動画1本で機械学習実装（Python）の基礎を習得！忙しい人のための速習コース |
| O6YicntQ6Og | biz | Excel | 28 | パソコン博士TAIKI | 【Excelが爆速化！】知らないとヤバい超時短術！Excelショートカットキー集【時短】 |
| eUBmEHlhP2g | english | ビジネス英語 | 28 | 英語聞き流し \| Sakura English | 対話形式〜実践 みじかい英語リスニング【273】 |
| JqUIqwBXu3U | biz | Excel | 28 | 西尾パソコン教室 | 【保存版】エクセル入門・基礎　／　一度は見て！　意外と知らないことが多い基礎、この映像で大丈夫になるよ。 |
| trsT0mKwTkQ | english | 発音 | 28 | Atsueigo | 【超有料級】たった2時間で発音学習を完全攻略｜総集編 |
| NYVkhnLeUAM | english | 英会話 | 28 | やん / 完全独学イングリッシュ | 【丸パクリOK】初心者でも3ヶ月で英語が話せるようになる方法 |
| Fw7zf2o3ijw | shikaku | 宅建 | 28 | yuiの勉強vlog | 【宅建勉強方法】独学3ヶ月で合格できた勉強方法│自己採点40点│使用テキスト│模試の使い方 |
| D34YsFmIU_Y | prog | Python | 28 | キノコード / プログラミング学習チャンネル | 【Python入門・応用】基礎から実践に必要な応用までを一気に習得（初心者〜中級者向け）｜01.コース紹介 |
| _KI4E6KVcmk | prog | Web開発 | 28 | チャエン【AI研究所】〜仕事で使える最新のAI情報を発信〜 Byデジライズ | 非エンジニアでも5分で簡単にAIアプリを作る方法を徹底解説。Google AI Studioを使ったAIアプリ開発 |
| EngQ-eJQF7A | marke | Webマーケ | 28 | WebマーケティングTV【StockSun株式会社】 | 【神授業】Meta広告の運用攻略はこれ見りゃOK！初心者にもわかりやすく徹底解説｜Facebook広告 |
| 4iQjQ8z09mo | prog | Python | 28 | Smart Work Hacks | 【たった1動画】Python初心者入門講座！Pythonとは？から分かる |
| GpssU3oishc | data | 統計 | 28 | Chall-edge公式チャンネル / 理系をゆるく楽しむチャンネル | 【10分で解説】統計学の歴史と3つの分類【超入門編】\| Chall-edge |
| fhJsHbep3TM | shikaku | AI検定 | 28 | いまにゅのAIプログラミング塾 | 最先端でAI活用したいならこのステップで学習してください！AI活用のプロがAI初心者からAIを使いこなすまでの学習法を解説します |
| hMCThPJ9kaE | prog | Python | 28 | 西住技研 | PythonをWindowsにインストールして実行する方法を1から丁寧に解説 【Python超入門講座1-2】 |
| 0d0kC_8wx7s | data | BI | 28 | DX塾 – Power BIで始めるデータ活用 | 【Power BI入門】複雑な式は不要！効率爆上げの新常識6選｜Excel派必見 |
| TKMOTT5GoXE | money | NISA | 30 | りりな家計管理と投資をする主婦 | 【積立NISA】後悔・失敗しました。初心者の主婦が5年やったリアルな投資状況・銘柄 |
| 64tlyWtEBsY | money | 家計 | 28 | cocoの暮らし | 【貯まる家計簿】シンプルな家計簿の書き方 |
| 0e3XPSUzI5Q | money | NISA | 28 | ホリエモン人生のヒント | NISAの買い方で損している人、実はめっちゃ多いです。NISAの資産運用術お伝えします。 |

## Skipped

| ytid | reason | score | genre | sub | channel | title |
|---|---|---:|---:|---:|---|---|
| Mg8aoOEkll8 | deny_title:絶対 | 32 | ai | Gemini | トモミツの即実践AI活用術ch | 【完全マスター】絶対に覚えるべきGeminiの基礎を全部教えます |
| Bo1CRZSZEFc | deny_title:絶対 | 32 | ai | Gemini | スタートAI学長クリスのAI教室 | 【完全マスター】AI初心者が絶対に覚えるべきGeminiの基礎を全部教えます |
| d536j6RfQLU | deny_title:FX | 31 | video | After Effects | Action Planetあくしょんプラネット | 段階的に合成するVFXの基本 / After Effects CC2022 使い方講座 |
| LUdqeizYEes | deny_title:絶対 | 30 | video | DaVinci | AKIYA MOVIE | 【完全保存版】DaVinci Resolveテロップ機能徹底解説！絶対に覚えておくべきテキストデザインのやり方。 |
| lVy9siA0Orw | deny_title:誰でも | 30 | video | After Effects | きんぐの動画編集スクール【After Effects】 | 【After Effects】誰でもできる手書き風テキストアニメーションの作り方｜初心者でも映えるおしゃれ演出！ |
| W4KTv2nPhgo | deny_title:絶対 | 29 | money | 家計 | 両学長 リベラルアーツ大学 | 【再放送】【家計管理の考え方】「絶対に把握すべき3つのこと」を解説します【お金の勉強 初級編】：（アニメ動画）第42回 |
| sj20pwZwY6Y | deny_title:誰でも | 29 | marke | SNS | 北原孝彦 -給料8万から億越え社長への転生- | 【爆速集客】上手く集客している人は皆コレやってます！誰でもわかる集客の基礎 |
| 4Ha1VyroMtE | deny_title:絶対 | 29 | marke | SNS | さき-インスタの大学 | 【絶対イマ見て！】リールの時代からフィードの時代が来たので解説します。 |
| 7rJGTsyruIg | deny_title:誰でも | 29 | ai | 画像生成 | Mappy Photo | 【誰でも簡単】Gemini 2.5 Flash Image（Nano Banana）の使い方【Googleの画像生成AI】 |
| EL5J5GJDaUk | deny_title:誰でも | 28 | money | 家計 | 両学長 リベラルアーツ大学 | 【再放送】【誰でもできる！】目指せ+3万円！「貯まる家計簿」カスタマイズを紹介【貯める編】：（アニメ動画）第132回 |
| Jn5KRyQf61w | deny_title:誰でも | 28 | ai | 自動化 | ひかりのAI大学 | 【衝撃】生成AIでマクロを作成しExcel業務を誰でも簡単に３倍以上効率化する方法！【Excel VBA マクロ ChatGPT】 |
| 6VK5KsICRIY | deny_title:誰でも | 28 | video | デザイン | 動画ファン | 【Canva】誰でも簡単YouTubeサムネイルの作り方 |
| 1ttDCCHLTb0 | deny_title:絶対 | 28 | prog | Git | エンジニア転職チャンネル【RUNTEQ公式】 | 【絶対につまづく】1週間でGit完全マスター！ |
| HEhDNoklIT0 | below_min_score_or_cutoff | 31 | biz | Excel | 金子晃之 | Excelの使い方・初心者入門講座【完全版】 |
| 46018ZWM2uU | below_min_score_or_cutoff | 31 | biz | Word | 金子晃之 | Wordの使い方・初心者入門講座【完全版】 |
| QiIFgbEGZio | below_min_score_or_cutoff | 31 | biz | Excel | 金子晃之 | Excelの使い方・脱初心者初級講座【関数編】 |
| DdKSvzLkQVA | below_min_score_or_cutoff | 31 | biz | 資料作成 | 金子晃之 | PowerPoint使い方・初心者入門講座【完全版】 |
| jinblWaG778 | below_min_score_or_cutoff | 31 | biz | Word | 金子晃之 | Wordの使い方・脱初心者初級編【完全版】 |
| HyU3XL2F9GE | below_min_score_or_cutoff | 30 | prog | Python | キノコード / プログラミング学習チャンネル | Python超入門コース 合併版｜Pythonの超基本的な部分をたった1時間で学べます【プログラミング初心者向け入門講座】 |
| r8wcAFTmb7k | below_min_score_or_cutoff | 30 | money | NISA | BANK ACADEMY / バンクアカデミー | 【超初心者向け】つみたてNISAとは？基礎知識やメリットを丁寧に解説！ |
| QCjFPSO96RU | below_min_score_or_cutoff | 30 | prog | JavaScript | セイト先生 by AIプログラミングスクールSiiD | 【JavaScript超入門講座】わずか50分で知識ゼロから基礎をマスター！ |
| UmpmxDepAZo | below_min_score_or_cutoff | 30 | biz | 資料作成 | 金子晃之 | PowerPointの使い方・脱初心者初級編【完全版】 |
| pnsieVYy72M | below_min_score_or_cutoff | 30 | prog | JavaScript | しまぶーのIT大学 | 【基礎から学ぶ JavaScript 入門 #1】フロントエンド開発でJavaScriptが必要な理由を解説！【ヤフー出身エンジニアが教える初心者向けプログラミング講座】 |
| jppnWu6am3Q | below_min_score_or_cutoff | 30 | data | Excel | ユースフル / 実務変革のプロ | 【Excelの次はAccessだ】アクセス使い方入門講座「データベース・テーブル・クエリ・リレーションシップ・主キー」の基礎知識 |
| tBQaAHHGEtM | below_min_score_or_cutoff | 30 | english | 英会話 | Aira's English | 【初心者】英会話何から始めたらいい？英語学習ロードマップ(5ステップ) |
| vyHJlDs1sus | below_min_score_or_cutoff | 29 | biz | Excel | 金子晃之 | Excel データベース一覧表の入門・作成講座 |
| WCrOcq08bwY | below_min_score_or_cutoff | 29 | biz | Excel | 金子晃之 | ExcelVBA・マクロ・初心者入門講座【完全版】 |
| FUsAoaI8QFg | below_min_score_or_cutoff | 29 | english | 発音 | サマー先生と英会話！ | 日本語にない６つの英語の母音！《サマー先生の英語発音講座#31》 |
| Uk4CxZZ_yjU | below_min_score_or_cutoff | 29 | biz | Excel | パソコン上達!Nagomiチャンネル | エクセル初心者 【簡単な表作成】　まずは表の基本操作を身につけよう！　基礎から始めるExcel |
| heIIAwHYywk | below_min_score_or_cutoff | 29 | money | NISA | BANK ACADEMY / バンクアカデミー | 【超初心者向け】iDeCo(個人型確定拠出年金)は本当におトク？メリットやデメリットなど入門知識を解説！ |
| C4-F08EDAvw | below_min_score_or_cutoff | 29 | money | 投資 | BANK ACADEMY / バンクアカデミー | 【超初心者向け】投資信託とは？入門知識やメリット、デメリットを丁寧に解説！ |
| fAluwAmHrws | below_min_score_or_cutoff | 29 | prog | JavaScript | セイト先生 by AIプログラミングスクールSiiD | 【JavaScript超入門講座】基礎文法だけでクイズゲームのアプリを開発！ |
| v-Mb2voyTbc | below_min_score_or_cutoff | 29 | prog | Python | だれでもエンジニア / 山浦清透 | 【SQL入門講座 合併版】SQLの基本をたった1時間で学べます【初心者向けデータベース入門】 |
| E08jeQBa1D0 | below_min_score_or_cutoff | 29 | prog | JavaScript | だれでもエンジニア / 山浦清透 | JavaScriptの「基礎」が1時間で分かる「超」入門講座【初心者向け】 |
| duxtN8ixpLo | below_min_score_or_cutoff | 29 | video | DaVinci | AKIYA MOVIE | 「DaVinci Resolve」10分間で完全攻略！超初心者向け |
| OEw1EFhpjY4 | below_min_score_or_cutoff | 29 | biz | 資料作成 | パワポデザイン大学 | パワーポイントの使い方！超初心者向け基本操作について解説【パワポデザイン】 |
| kBKn5IkH06A | below_min_score_or_cutoff | 29 | prog | Python | セイト先生 by AIプログラミングスクールSiiD | 【Python超入門講座】この動画1本でゼロから基礎をマスター！【初心者向け】 |
| c6DuvLPzjrg | below_min_score_or_cutoff | 29 | biz | Word | くませんのパソコンクラブ | 【パソコン入門】１０分でわかる！パソコン用語と基本操作【初心者向け】 |
| h7YqjpwMgtg | below_min_score_or_cutoff | 29 | video | After Effects | TORAERA DOUGA | 【After Effects】インフォグラフィックスアニメーションの作り方【初心者】 |
| Wgo5rrrfrew | below_min_score_or_cutoff | 29 | data | Excel | PC活用ちゃんねる | 【Excel】パワークエリの使い方入門(生産性爆上げ機能) |
| rUXkeyTJ02g | below_min_score_or_cutoff | 29 | biz | プレゼン | パワポデザイン大学 | パワーポイントの使い方！【必見】超初心者でも絶対に知っておきたいパワポのすごい機能10選について解説【パワポデザイン】 |
| 3v9q1FGc-wk | below_min_score_or_cutoff | 29 | data | Excel | セイヤのIT講座 | 【Excel】たった10分でわかるピボットテーブル入門【初心者向け】 |
| F-QjKc4aEIw | below_min_score_or_cutoff | 29 | prog | Web開発 | Pythonプログラミング VTuber サプー | 【Pythonプログラミング入門】自作のデスクトップアプリを作る！Tkinterで簡単！〜VTuberと学習〜 【初心者向け】 |
| CDTRcDz57gY | below_min_score_or_cutoff | 29 | kaikei | 簿記 | オタク会計士ch【山田真哉】少しだけお金で得する | 【5分でわかる超入門】簿記3級をかじる！ネット試験で断然取りやすくなった！初心者向け､独学で無料学習勉強法【個人事業主､フリーランス､会社員/受験､就職､起業､経営､確定申告､節税､投資/仕訳とは】 |
| 5U0nAojNQS0 | below_min_score_or_cutoff | 29 | prog | JavaScript | しまぶーのIT大学 | 【基礎から学ぶ JavaScript 入門 #2】Twitterを例にJavaScriptがどんな働きをするのか理解しよう【ヤフー出身エンジニアが教える初心者向けプログラミング講座】 |
| 1l8oBEown8c | below_min_score_or_cutoff | 29 | prog | Git | セイト先生 by AIプログラミングスクールSiiD | Gitとは？GitHubとは？10分で仕組み・使い方を解説！【超入門編】 |
| 6MG-qGgLfUU | below_min_score_or_cutoff | 29 | biz | プレゼン | マナビジネス【コンサル仕事術】 | 【超入門】プレゼン初心者のためのプレゼンスライドの作り方 |
| 69FE07KnL7Y | below_min_score_or_cutoff | 29 | prog | Git | TechAcademy [テックアカデミー] | 【プログラミング超入門】GitHubの使い方｜初心者向けにアカウント登録から解説！ |
| 4lGeZBMlMIg | below_min_score_or_cutoff | 29 | biz | Word | PC活用ちゃんねる | Wordの使い方＜基礎がわかる！初心者・入門編＞ |
| 5o8xNhSb0JA | below_min_score_or_cutoff | 29 | marke | Webマーケ | 本橋へいすけ \| ポジティブ心理学研究室 | 【独学で習得】初心者でも分かるマーケティング基礎講座【３Ｃ分析】 |
| pmZhG3LGRXA | below_min_score_or_cutoff | 29 | prog | SQL | キノコード / プログラミング学習チャンネル | 【SQL超入門講座】01.コース紹介 ~ SQLとは？ ~  環境構築｜初心者向け |
| LSZTGINL46E | below_min_score_or_cutoff | 29 | biz | Word | よこやま良平・パソコン・プログラミング予備校 | ワードの使い方 完全図解【2022年保存版】初心者でもわかるWindowsのWord入門【完全版】 |
| Fikn5kn1NI4 | below_min_score_or_cutoff | 29 | english | 英会話 | 45歳で英語を身につける「英会話RyuTube」 | 【英語の勉強】初心者から日常英会話習得までのロードマップを話します |
| CvEufYGEqT0 | below_min_score_or_cutoff | 29 | video | DaVinci | 寅モンチャンネル / TORAMON channel | 【DaVinci Resolve】基本的な使い方Part1●メディアページ、エディトページ　初心者向け講座【ダヴィンチリゾルブ】 |
| CkHUxGQ_h1s | below_min_score_or_cutoff | 28 | english | 発音 | マーシーの英単語 | いちばん最初に覚える英単語600(🇯🇵日→🇺🇸英)☆初心者向け英単語集 英語リスニング リズム英単語 |
| wnUynxpxJS4 | below_min_score_or_cutoff | 28 | money | 投資 | 両学長 リベラルアーツ大学 | 【初心者向け】資産運用って結局どうすれば良いの？に対する具体的回答【超シンプルプラン】【株式投資編】（アニメ動画）：第17回 |
| yeZ3STy3k44 | below_min_score_or_cutoff | 28 | prog | Python | いまにゅのAIプログラミング塾 | 【完全版】この動画1本でPythonの基礎を習得！忙しい人のための速習コース（Python入門） |
| aoBmdoOeBYc | below_min_score_or_cutoff | 28 | money | 家計 | 両学長 リベラルアーツ大学 | 【家計管理の考え方】「絶対に把握すべき3つのこと」を解説します【お金の勉強 初級編】：（アニメ動画）第42回 |
| Bj8fkq533Dc | below_min_score_or_cutoff | 28 | data | 統計 | 予備校のノリで学ぶ「大学の数学・物理」 | 【大学数学】推定・検定入門①(母集団と標本)/全9講【確率統計】 |
| XyMSoewhS3s | below_min_score_or_cutoff | 28 | english | 発音 | サマー先生と英会話！ | ｢Th」の発音の完全版！ちょっとしたコツでマスターできます！《サマー先生の英語発音講座#22》 |
| aYbUDGn61cU | below_min_score_or_cutoff | 28 | prog | インフラ | ウズウズカレッジ l デジタル（IT・DX）分野のリスキリング就職 | 【CCNA合格講座】ゼロから学べるネットワーク講座！クーポンは概要欄から |
| iGcY6V5zNQ4 | below_min_score_or_cutoff | 28 | money | 投資 | BANK ACADEMY / バンクアカデミー | 【超初心者向け】インデックス投資の始め方！メリットやデメリットもあわせて解説 |
| emNfRkNTviU | below_min_score_or_cutoff | 28 | data | 統計 | 統計チャンネル | 統計[01/50] 変数の分類【統計学の基礎】 |
| Mfd_4XROoL0 | below_min_score_or_cutoff | 28 | data | BI | ITツール学習 | 【入門】PowerBI の使い方を徹底解説 【無料ツール】【可視化】【初級者】 |
| gs0l4rsQCGM | below_min_score_or_cutoff | 28 | prog | JavaScript | キノコード / プログラミング学習チャンネル | JavaScript超入門コース 合併版【JavaScriptの超基本的な部分をたった1時間で学べます】【プログラミング初心者向け入門講座】 |
| RtUaI4oETxA | below_min_score_or_cutoff | 28 | data | Excel | PC活用ちゃんねる | 【Excel】ピボットテーブルで集計・分析の基本！使い方を初心者向けに解説 |
| QzpoY92qavg | below_min_score_or_cutoff | 28 | data | Excel | 戸田覚：ガジェット【辛口】点数評価 | Power BI「超入門」8分で誰でも使えるようになる。Excelの次の一手はこれしかないっ！ |
| quFWgEQZQaM | below_min_score_or_cutoff | 28 | data | 統計 | スタビジ【誰でもAIデータサイエンス】byウマたん | 【9分で解説】ビジネスに活かせる統計学の基礎入門講座 |
| LDOR5HfI_sQ | below_min_score_or_cutoff | 28 | prog | Git | せお丸@AI駆動開発 | 【Git入門】Git + Github使い方入門講座🐒Gitの仕組みや使い方を完全解説！パーフェクトGit入門！ |
| kftqAritHyc | below_min_score_or_cutoff | 28 | prog | Git | しまぶーのIT大学 | 【GitHubの使い方入門】GitHub Pagesを使って世界中にサイトを公開しよう！アウトプットこそ学びだ！ |
| CPpRu_AJrW8 | below_min_score_or_cutoff | 28 | prog | Python | せお丸@AI駆動開発 | Python入門講座【最新のPython3対応】🔰初心者向けPython入門パーフェクトガイド |
| nbIqlV0X2yQ | below_min_score_or_cutoff | 28 | prog | SQL | いまにゅのAIプログラミング塾 | 【vol.027】Pythonでデータベースを扱ってみよう \| 中学生でもわかるPython入門シリーズ |
| OKIG2FB_5Ak | below_min_score_or_cutoff | 28 | prog | Python | Pythonプログラミング VTuber サプー | 【Pythonプログラミング入門】関数の基本を解説！(def) VTuberと勉強しよう！【初心者 独学用】 |
| vUycY5J2tbA | below_min_score_or_cutoff | 28 | biz | Word | くませんのパソコンクラブ | 【Word入門】ワードの基本操作だけで資料を作ろう_文字入力とデザイン編【パソコン講座】 |
| M_7_EuTroZg | below_min_score_or_cutoff | 28 | prog | Web開発 | フリーランスPM打田裕馬 | 【超入門】初心者向けwebアプリ開発の「手順」まとめ！開発の準備やアプリ設計・プログラミング言語の学び方まで解説 |
| YFQLznfXzPU | below_min_score_or_cutoff | 28 | prog | JavaScript | しまぶーのIT大学 | プログラミング言語のオススメはJavaScript！初心者にも易しい難易度で将来性も抜群！入門向き！ |
| b2OjUaGBz7A | below_min_score_or_cutoff | 28 | data | SQL | だれでもエンジニア / 山浦清透 | 小学生でもわかるSQLの基本【SQL講座①】 |
| ZCt06tXxtFg | below_min_score_or_cutoff | 28 | prog | JavaScript | プログラミングアカデミー | 初心者向けJavaScript入門講座#1【JavaScriptの特徴について】 |
| zt3YIBMwPng | below_min_score_or_cutoff | 28 | ai | 自動化 | SHIFT AI ニュース | 【保存版】「n8n」で始める日々の業務・AI副業の自動化入門書 |
| EqnBVPCG5g0 | below_min_score_or_cutoff | 27 | english | 英会話 | ライアン鈴木【英語エンタメチャンネル】 | 【全員聞け】25歳から英語を始めてすぐにペラペラになったたった１つの方法 |
| fAO7KqQ_dEk | below_min_score_or_cutoff | 27 | money | 家計 | 【SBI証券公式】ビジネスドライブ! | 【家計簿公開】借金300万円から脱却した30代主婦に密着！誰でも簡単にできる節約術と家計管理方法とは？\|密着！お金の達人 投資家たちのマイルールby SBI証券 |
| dI8RvalbC_s | below_min_score_or_cutoff | 27 | money | 家計 | 節約主婦mari | 【貯金術】元浪費家が貯金できるようになった方法、浪費を抑えるコツ7選 |
| 93EBxppPYZg | below_min_score_or_cutoff | 27 | kaikei | 税理士 | tys NEWS DIG Powered by JNN | 高校生で超難関簿記1級に続々合格、税理士試験も　財務・会計のエリート育成する商業高校 |
| 8Qz5pK2Hyts | below_min_score_or_cutoff | 27 | english | ビジネス英語 | Atsueigo | 【有料級】英語がペラペラになる重要構文30選｜初級編 |
| Y3OGzW9QaJ0 | below_min_score_or_cutoff | 27 | english | TOEIC | Makieigo | 【初級・聞き流し】TOEIC600点目標リスニング フレーズで重要表現が覚えられる！【13】 |
| uCIjxRPf2F8 | below_min_score_or_cutoff | 27 | english | 英会話 | 英語コーチ-イングリッシュおさる | 【初心者向け】英語学習の始め方【３ヶ月で達成できる】 |
| 2TjsRaj_Pqs | below_min_score_or_cutoff | 27 | data | Excel | ExcelドカタCH | ピボットテーブルを使うなら、最初にこの基本ルールを理解しましょう【Excel】【YT0125】 |
| EMJgDP4uEhY | below_min_score_or_cutoff | 27 | english | TOEIC | ブレイクスルー佐々木 | 英語力ゼロから2ヶ月でTOEIC730点取る勉強スケジュール |
| K6Faf0ASUho | below_min_score_or_cutoff | 27 | english | 英会話 | Mayu E Room | ゼロから英語学習を始めたい人へ |
| QtPjftBhoh0 | below_min_score_or_cutoff | 27 | video | CapCut | RENTRY - レントリー | Viamaker(Capcut)の使い方。スマホでここまで動画編集できる！【神アプリ】 |
| KGZGhm5kGiw | below_min_score_or_cutoff | 27 | money | NISA | 両学長 リベラルアーツ大学 | 【お得なのはどっち？】NISAとiDeCoの税金の違い＆どちらを選べばよいかを解説【リベ大公式切り抜き】 |
| jAZf7yPn3rA | below_min_score_or_cutoff | 27 | kaikei | 簿記 | 【簿記・会計】公認会計士たぬ吉の資格塾 | (音声学習用)【日商簿記３級】勘定科目総まとめ |
| tc8RTtwvd5U | below_min_score_or_cutoff | 27 | data | データサイエンス | 3Blue1BrownJapan | ニューラルネットワークの仕組み \| Chapter 1, 深層学習（ディープラーニング） |
| hIUpa_kF2jM | below_min_score_or_cutoff | 27 | ai | ChatGPT | PIVOT 公式チャンネル | 【今さら聞けないChatGPT】GPT-5の使用感／AI活用のプロ・usutaku氏に聞くビジネス活用術／AI活用はマナーの時代？／営業職のDeep Research／GPTs【PIVOT TALK】 |
| jHrat4vwhFI | below_min_score_or_cutoff | 27 | money | NISA | 節約オタクふゆこ | 【新NISA始めた人に警告】新NISA制度でよくある勘違い6選【新NISA/つみたて投資枠/成長投資枠】 |
| iLgz4MsCNDE | below_min_score_or_cutoff | 27 | english | ビジネス英語 | PIVOT 公式チャンネル | 【独学でネイティブレベルになれる】海外ドラマ『フレンズ』使った英語学習法／BTSナムジュンも実践／20歳〜始めてもネイティブに／ChatGPTでも学べないこと／PIVOT LEARNING |
| 4ezOCPlgNVM | below_min_score_or_cutoff | 27 | money | 投資 | 投資うさぎ「会話で解説」 | 【新NISA】インデックス投資に複利効果はあるのか？ |
| gxvsRqKPxCE | below_min_score_or_cutoff | 27 | money | 投資 | 両学長 リベラルアーツ大学 | 【再放送】【失敗回避法】インデックス投資の魅力と「失敗させないためのコツ」5選【株式投資編】：（アニメ動画）第239回 |
| SMVY5mjxD3k | below_min_score_or_cutoff | 27 | marke | Webマーケ | PIVOT 公式チャンネル | 【元P&Gマーケターが大木優紀に熱血授業】明日から使える“最強&最新”マーケティング／本質的フレームワーク「9segs®」活用術／顧客戦略はWHO×WHATで導き出せる(STAR SKILL SET) |
| AMmoTBr1iN8 | below_min_score_or_cutoff | 27 | biz | Word | 金子晃之 | Wordを100倍便利に使えるスタイルの使い方 |
| g0QwdyoO1XU | below_min_score_or_cutoff | 27 | marke | コンテンツ | 学識サロン | マーケティングは学んでおかないと、めちゃくちゃ損します。11分でわかる『ハイパワーマーケティング』 |
| dorfGlYdp0w | below_min_score_or_cutoff | 27 | shikaku | IT | みみスタ | サクッと覚える！「ITパスポート」必修単語300 直前対策 |
| 6fpPCPZMRvs | below_min_score_or_cutoff | 27 | video | After Effects | Mi2taka | アフターエフェクト初心者が100時間練習したらどのくらい上達する？ |
| q_rw4iH1eZ0 | below_min_score_or_cutoff | 27 | english | ビジネス英語 | PIVOT 公式チャンネル | 【ビジネス英会話の神常識】日常英会話を学ぶのは遠回り／ビジネス会話ならすぐ話せる／ビジネスシーンを頭に入れてから口を開け／英語学習の３つのポイントと誤った神話 |
| NJsmDWctaeU | below_min_score_or_cutoff | 27 | kaikei | 簿記 | 【簿記・会計】公認会計士たぬ吉の資格塾 | 【最新版】日商簿記２級最新攻略法！！ |
| PQlhG2m7WcM | below_min_score_or_cutoff | 27 | biz | Excel | ユースフル / 実務変革のプロ | 【20代のためのエクセル術】実務即戦力のExcel16選(部下や後輩へ、最初に覚えさせたい厳選テクニック集) |
| R8BRpkX6C9c | below_min_score_or_cutoff | 27 | ai | Gemini | PIVOT 公式チャンネル | Geminiの仕事時短術／丸投げで仕事が終わる／ChatGPTと徹底対決  Geminiの勝利／Googleとの神連携／プロンプトのコツ／竹内由恵 コーヒー事業をGeminiに相談【ランキング超分析】 |
| Rt-l5u-u064 | below_min_score_or_cutoff | 27 | english | ビジネス英語 | ビジネス英語聞き流し - Lehman English | 毎日の会議で使いまくる英語133フレーズ！ミーティングの始めから締めまで【オンライン会議対応】 |
| NXHoiNoWXwA | below_min_score_or_cutoff | 27 | marke | Webマーケ | サラタメさん | 【Webマーケティングの極意】ベストセラー本『ファンダメンタルズ×テクニカル マーケティング』をガチで解説してみた。 |
| kp0xEmxhx3g | below_min_score_or_cutoff | 27 | ai | Copilot | PIVOT 公式チャンネル | 【Copilot活用術 vol.3】実践！調査報告書と社内説明用プレゼン資料をCopilotで作成せよ／まずはアウトラインづくり／ツールの使い分けのポイントは |
| Cs7friXdqdM | below_min_score_or_cutoff | 27 | prog | Python | キノコード / プログラミング学習チャンネル | 【Python超入門コース】03.環境構築 for Windows｜プログラミングをする準備をしよう！【プログラミング初心者向け入門講座】 |
| CJQDh_mJ1as | below_min_score_or_cutoff | 27 | prog | SQL | キノコード / プログラミング学習チャンネル | SQL超入門コース　合併版｜SQLの超基本的な部分をたった2時間半で学べます【SQL初心者向け入門講座】 |
| 3_4pTBHFUBA | below_min_score_or_cutoff | 27 | biz | Excel | PC活用ちゃんねる | Excel使い方基礎入門｜先輩に怒られないため最低限覚えること |
| NkpElNYzpIE | below_min_score_or_cutoff | 27 | money | 家計 | 両学長 リベラルアーツ大学 | 【お金の授業 29限目】家計管理をマスターしよう&家計改善チェックリスト【改訂版 お金の大学P154～P163】 |
| Yg546Zua39A | below_min_score_or_cutoff | 27 | prog | SQL | だれでもエンジニア / 山浦清透 | 小学生でもわかるデータベース設計入門。実際に設計しながら基礎を学ぼう |
| ksuUh-bWkOk | below_min_score_or_cutoff | 27 | marke | SNS | さき-インスタの大学 | 【衝撃解禁】ある方法を取り入れるだけでインスタがバズりやすくなってます。 |
| 2-FZvx3dw7w | below_min_score_or_cutoff | 27 | ai | プロンプト | SHIFT AI ニュース | Microsoft Copilotだけで完結するAI仕事術6選【具体的なプロンプト付き】 |
| 0jKHBND-auw | below_min_score_or_cutoff | 27 | ai | Claude | AIでサボろうチャンネル | 【非エンジニア向け】一番カンタンなClaude Codeの始め方 |
| ajImDwcHOe8 | below_min_score_or_cutoff | 27 | kaikei | 税理士 | 税理士かねしげてつやせんせー | 【難易度】簿記3級～1級、そして税理士試験の難易度について楽しく解説します |
| acQuXpH4QIc | below_min_score_or_cutoff | 27 | video | After Effects | After Effects Yasuda | アフターエフェクト初心者が1年半独学するとこうなる |
| yzH09MsOolQ | below_min_score_or_cutoff | 27 | kaikei | FP | ほんださん / 東大式FPチャンネル | FP2・3級受検者必見！CBT試験の制度が変わります。 |
| ICYm4PkYivI | below_min_score_or_cutoff | 27 | video | DaVinci | 動画クリエイターへの道 by machosuke | 【ダビンチリゾルブの使い方】ダウンロード、インストール、初期設定、セットアップ \| DaVinci Resolve動画編集チュートリアル、説明書 |
| axlp7WDjUVw | below_min_score_or_cutoff | 27 | ai | Copilot | ひかりのAI大学 | 【Excel AIの教科書】Copilotで変わる仕事術、全部教えます！これ一本で生産性3倍UP！ |
| mnSj-vG2PJI | below_min_score_or_cutoff | 27 | english | TOEIC | 大人のための武田塾English ビジネスパーソン向け英会話スクール | 【TOEICルート】ゼロからでもTOEIC400点を取るための勉強法を解説！【初心者向けルート】vol.260 |
| XhbRqItkIYI | below_min_score_or_cutoff | 27 | prog | Python | Pythonプログラミング VTuber サプー | 【Pythonプログラミング入門】Windows PCにPythonをインストールして動かす！〜VTuberと学習するプログラミング〜 |
| 54jyxTOqqZA | below_min_score_or_cutoff | 27 | shikaku | IT | SAMURAI ENGINEER [侍エンジニア] | 【初心者おすすめ】ITパスポートとは？取得すべき？資格の概要や学習方法を解説！ |
| 4BjkAsIfC2M | below_min_score_or_cutoff | 27 | english | 英会話 | Atsueigo | 英語学習は「順番」を間違えると一生伸びません｜最短ルートはこれ |
| ZySlhNzy5mM | below_min_score_or_cutoff | 27 | money | 投資 | ダイヤモンド公式チャンネル | 『2026年の新NISAで買うべき投資信託は?』基本となるインデックス投信を選ぶポイントと注意点、3年目の新NISAで考えるべきこと、おススメ投資信託3本を紹介! |
| XvRjaRqWr80 | below_min_score_or_cutoff | 27 | biz | プレゼン | MANAMI PowerPoint School | 【パワーポイント使い方】スライドマスターの活用方法解説！テンプレート作り／全スライドにロゴを入れておくなど＜MANAMI Power Point School Online＞ |
| EqX5uWzER1s | below_min_score_or_cutoff | 27 | ai | ChatGPT | 研修トレーナー伊庭正康のスキルアップチャンネル | 超便利！「チャットＧＰＴ」の使い方（元リクルート　全国営業一位　研修講師直伝） |
| usbEwmOIhwo | below_min_score_or_cutoff | 27 | prog | Web開発 | いまにゅのAIプログラミング塾 | 【Kivy超入門】40分でGUIアプリケーション開発（Python）の基礎をマスター |
| -SpP9nRBnAE | below_min_score_or_cutoff | 27 | video | DaVinci | ぷらぐら | 【DaVinci Resolve17】これさえ押さえれば動画編集できる！YouTuber初心者スターターパック！【＆有能フリー素材サイト紹介】 |
| OfblP-jA1ww | below_min_score_or_cutoff | 27 | english | TOEIC | 【TOEIC対策】猛牛ちゃんねる | 【TOEIC】初心者はこの問題を攻略するのが最優先【リーディングのPART5 問題演習】 |
| TfK4bseO3JE | below_min_score_or_cutoff | 27 | biz | 資料作成 | ゼロからパソコン | 【パワーポイント】プレゼン作成の基本【パソコン初心者】 |
| rj0y-oGhq0A | below_min_score_or_cutoff | 27 | ai | Copilot | しごおもTV | 【ここまで出来る】Microsoft社員も実践するCopilot Cowork活用術 |
| qdenHTcLStc | below_min_score_or_cutoff | 27 | prog | Web開発 | エンジニア転職チャンネル【RUNTEQ公式】 | 未経験者がAIでアプリ開発してみた！ChatGPTで本当に作れるのか検証 |
| qZT57PZXG3o | below_min_score_or_cutoff | 27 | ai | Claude | KEITO【AI&WEB ch】 | Claude完全ガイド【これ1本で理解できるクロードの教科書】ChatGPTとGeminiとの違いは？ |
| gVqYbgYE6EI | below_min_score_or_cutoff | 27 | video | デザイン | りゅうすけ \| 動画編集チャンネル　AIM Creators College | 【永久保存版】サムネイルの作り方完全攻略【副業】【photoshop】 |
| r9QUdzVGHJU | below_min_score_or_cutoff | 27 | prog | Web開発 | Pythonプログラミング VTuber サプー | 【Django】PythonでWebアプリを作ろう！1時間半でDjangoの基本を学ぶ 〜 Webフレームワーク初心者向け 〜 |
| jgMJ5DU73dE | below_min_score_or_cutoff | 27 | kaikei | FP | ほんださん / 東大式FPチャンネル | FP3級爆速講義 #22 意外と難しいFP試験の税金テーマを動画だけで最速攻略！（タックス） |
| 3CbHnh1LvcA | below_min_score_or_cutoff | 27 | money | 家計 | ひだくま夫婦の家計管理🧸 | 【初心者でも簡単】袋分け家計管理のやり方を紹介！│家計簿│給料日ルーティン│封筒貯金ファイル |
| erY_CkAVSYE | below_min_score_or_cutoff | 27 | prog | インフラ | ウズウズカレッジ l デジタル（IT・DX）分野のリスキリング就職 | 【CCNA講座】「TCP」「UDP」を日本一易しく解説！クーポンは概要欄から【インフラエンジニア基礎入門 #6】 |
| WedaSgxk_18 | below_min_score_or_cutoff | 27 | prog | Python | Pythonプログラミング VTuber サプー | 【Pythonプログラミング入門】Python 書き方の基本 〜VTuberと学習するプログラミング〜 |
| 4nsTce1Oce8 | below_min_score_or_cutoff | 27 | prog | Web開発 | Pythonプログラミング VTuber サプー | 【超簡単Webアプリ】streamlitでWebアプリを最速で作ってネット公開！〜 プログラミング初心者向け 〜 |
| JtS3V9xXsXY | below_min_score_or_cutoff | 27 | kaikei | 税理士 | EMP税理士キャリアLAB | 最短で税理士になるには？独学でなれる？勉強時間は？すべて解説 |
| vkCEbvUwU6A | below_min_score_or_cutoff | 27 | shikaku | 宅建 | あこ課長の宅建講座 | 宅建 2026 宅建業法 #1【宅建業】宅建業の定義を理解しましょう。「宅地」や「建物」の「取引」を「業」として行う時に、免許が必要。「取引態様の自ら貸借」「不特定多数を相手に反復継続」は要チェック！ |
| X97Y29lWgX8 | below_min_score_or_cutoff | 27 | shikaku | 宅建 | 河野玄斗の勉強部屋【切り抜き】 | 【河野玄斗】宅地建物取引士試験に関する質問まとめ！試験に関するアドバイスや勉強法【宅建/資格】 |
| hNXxoo7IS64 | below_min_score_or_cutoff | 27 | money | 家計 | とんと | 【家計管理】来年の貯蓄準備はじめます🙂💪予算を組んでベストな貯蓄目標をたてる方法✏️｜音声あり |
| 4Qd7nt_Gol4 | below_min_score_or_cutoff | 27 | ai | 画像生成 | AIキャンプ / 中村俊也 | 【衝撃】Gemini新画像生成AI「Nano Banana Pro」がすごいので実演します！ |
| nobfhAtgFz8 | below_min_score_or_cutoff | 27 | video | Premiere Pro | AdobeCreativeStation | 【Premiere Pro】初心者向け：色補正・タイトル追加をしてみよう #2 \| アドビ公式 |
| 2GiJVzDY-7o | below_min_score_or_cutoff | 27 | kaikei | FP | ほんださん / 東大式FPチャンネル | CBT2級を日本最速で合格したので、試験の難易度や攻略法をお伝えします |
| 7SQxuqiHZl8 | below_min_score_or_cutoff | 27 | video | Premiere Pro | AdobeCreativeStation | 【Premiere Pro】初心者向け：動画にエフェクト・音楽を加えてみよう #3 \| アドビ公式 |
| 2fh8Pyq-Lc8 | below_min_score_or_cutoff | 27 | shikaku | IT | せかチャン - 世界一わかりやすい情報科チャンネル | アルゴリズム・フローチャート基礎講座【基本情報技術者・ITパスポート・高校情報1】 |
| G_AMvOvDoJw | below_min_score_or_cutoff | 27 | ai | 自動化 | #usutaku_channel | 【脱初心者】AIを３時間で効率的にマスターする方法 |
| YvJqRImsk-k | below_min_score_or_cutoff | 27 | biz | プレゼン | 【さき】のAIでええやん。 | 【一気通貫】GoogleのAI Geminiで革命的な爆速スライド作成活用方法教えるで！【パワポ / プレゼン】 |
| J8P3mFR5j8E | below_min_score_or_cutoff | 27 | biz | 資料作成 | ユースフル / 実務変革のプロ | 【Copilot】パワポ作成が秒で終わる！無料版でも図解と原稿を「一瞬」で完成させる資料作成時短術 |
| uvuMFy-r2ZA | below_min_score_or_cutoff | 27 | kaikei | FP | ほんださんのFP試験格納庫 | FP2級学科_過去問厳選模試解説＋試験直前テクニック（24-25年度） |
| bUAD65iEbY8 | below_min_score_or_cutoff | 27 | biz | プレゼン | 【さき】のAIでええやん。 | 【厳選】全自動AIスライド資料作成マジで使えるオススメのAIはこの5つだけ！ |
| nPJ-FQTtHLY | below_min_score_or_cutoff | 27 | kaikei | 簿記 | CPAラーニング | 【簿記3級】仕訳がラクになる3つのコツと覚え方｜初心者・独学者向け試験対策【CPAラーニング】 |
| _G4QmAIIqQc | below_min_score_or_cutoff | 27 | video | After Effects | Action Planetあくしょんプラネット | テキストを木っ端微塵にする / After Effects CC2022 使い方講座 |
| I7jiPkYUjGo | below_min_score_or_cutoff | 27 | data | データサイエンス | スタビジ【誰でもAIデータサイエンス】byウマたん | 【9分で分かる】ベイズ統計学の入門基礎を解説！ |
| ocedfcSlPi0 | below_min_score_or_cutoff | 27 | shikaku | IT | 聞くだけ資格マスターズ | 【2026最新版】ITパスポート試験｜シラバス6.5 新追加の超重要用語まとめ【聞き流しOK】 |
| pnYh9IxOYwQ | below_min_score_or_cutoff | 27 | video | デザイン | Mappy Photo | 【超初心者向け】PhotoshopでYouTubeサムネイルを作る方法 |
| NQ3WBqn3LhA | below_min_score_or_cutoff | 27 | ai | Copilot | 戸田覚：ガジェット【辛口】点数評価 | 【知っておきたい】よくわからないCopilotを整理しておこう。そもそもCopilotが3種類あるって知ってた？ |
| ls0CTLcFQ3U | below_min_score_or_cutoff | 27 | video | DaVinci | Davinci Resolve初心者習得チャンネル@認定トレーナー | 【DaVinci Resovle 18無料版※19もOK】初心者必見！20分で動画編集マスター！ |
| -7rq1YfxiG4 | below_min_score_or_cutoff | 27 | data | データサイエンス | データサイエンスLab. | 視覚で理解する分散分析。原理をわかりやすく解説します！ |
| IiX6J0FfGng | below_min_score_or_cutoff | 27 | prog | SQL | せお丸@AI駆動開発 | 【2021年版】データベース＋SQL入門｜MySQL/PostgreSQL/Oracleなどデータベースの使い方や役割・SQLについて👉初心者向けに6分で解説✅ |
| foZfGjSh9Vc | below_min_score_or_cutoff | 27 | marke | SNS | さき-インスタの大学 | 【この2つでOK】フォロワー1000人まで爆速で行く方法教えちゃいます！ |
| M1L1q1i406A | below_min_score_or_cutoff | 27 | marke | SNS | スマホのコンシェルジュ「株式会社コアコンシェル」 | 【SNSとは？】種類・特徴・問題点をわかりやすく解説 |
| E1J3vzlwKv4 | below_min_score_or_cutoff | 27 | english | ビジネス英語 | ビジネス英語コーチHika | 【ネイティブが実演】これだけでOK！英語会議ファシリテーションの最強テンプレ公開！ |
| LshGn_oArSc | below_min_score_or_cutoff | 27 | shikaku | AI検定 | 日経新聞要約解説　診断士かつ丼【非公式】 | 【第1章〜8章全網羅】G検定JDLA公式テキスト解説 最新版はコメントからご覧ください。#G検定 #AI資格 #合格対策 |
| 2ti16OW00zQ | below_min_score_or_cutoff | 27 | kaikei | 税理士 | 税理士試験合格&就活ちゃんねる | 【税理士試験合格】簿記論・財務諸表論を半年一発合格した女性税理士の勉強法５選【理論暗記法】 |
| PkVy-3VNd00 | below_min_score_or_cutoff | 27 | biz | Word | シアルパソコンスクール 石川 | 【ワード 表】ワードの表の作り方！ワードの表の効率の良い作り方をご紹介します！ |
| lVf_YL_Z9wk | below_min_score_or_cutoff | 27 | shikaku | AI検定 | やん / 完全独学イングリッシュ | ChatGPTを超えるAI英会話学習法が生まれました... |
| jRchuWG6hRo | below_min_score_or_cutoff | 27 | shikaku | IT | せかチャン - 世界一わかりやすい情報科チャンネル | ITパスポート(iパス)とは？試験の特徴や合格率、勉強方法を解説！ |
| omCQDDN7hw4 | below_min_score_or_cutoff | 27 | english | 英会話 | デイナ / Dana【英語の先生】 | 【総まとめ】英語学習完全攻略ロードマップ |
| QGJeGnL7tos | below_min_score_or_cutoff | 27 | kaikei | FP | ほんださん / 東大式FPチャンネル | 【勉強嫌いでも楽々合格】最強のFP問題集「FP2級 TEPPEN」を紹介するよ（サイン会あるよ） |
| NZiEM2VABLw | below_min_score_or_cutoff | 27 | kaikei | 簿記 | 【簿記・会計】公認会計士たぬ吉の資格塾 | 【日商簿記】勉強法 よくある質問 総まとめ |
| yzNPC_QzgFM | below_min_score_or_cutoff | 27 | prog | Git | SAMURAI ENGINEER [侍エンジニア] | 【基本知識】GitHubとは？できることや基礎用語を解説！ |
| SlVZJWxzdmQ | below_min_score_or_cutoff | 27 | ai | Claude | AKIYA MOVIE | 知識ゼロでClaude Codeを1週間使ったら、世界が変わりました。 |
| etvu46fHChM | below_min_score_or_cutoff | 27 | ai | Gemini | Pixelスマホの使い方 - Pixel lab | PixelスマホでGoogle生成AI「Gemini」の使い方を解説 |
| bEANpRVFheM | below_min_score_or_cutoff | 27 | shikaku | IT | 【基本情報技術者試験YouTuber】すーさん | 【A試験_ストラテジ】08.ストラテジ分野の総まとめ\| 基本情報技術者試験 |
| JguvMoK2AIA | below_min_score_or_cutoff | 27 | shikaku | AI検定 | ハック大学 | 【今すぐやめろ】9割が陥る『AIのお勉強』！ AIを使いこなすための最短ルートは"これ"でした |
| qDzIWzSSI20 | below_min_score_or_cutoff | 27 | money | NISA | FPナナコ【働く女性のお金の教養教室】 | はじめてでもやさしくわかる！iDeCoの超入門 |
| -0EYxuUIN6A | below_min_score_or_cutoff | 27 | english | ビジネス英語 | ビジネス英語コーチHika | 【永久保存版】毎日のビジネス英語会議で使えるフレーズ50選【これ1本で完全網羅】 |
| 2mehreEA7yc | below_min_score_or_cutoff | 27 | prog | Git | SAMURAI ENGINEER [侍エンジニア] | GitHubの使い方を解説！ファイルの作成方法、ブランチの使い方が分かる！ |
| 46VJPmSY_Y0 | below_min_score_or_cutoff | 27 | marke | SNS | たくと@Instagram攻略 | 【完全版】0→1億円売上るSNSマーケティング手法を公開【超有料級】 |
| r4hQJB2nIQI | below_min_score_or_cutoff | 27 | shikaku | IT | J' VALLE（ジェイバレー）チャンネル | 【ITパスポート合格攻略】受験者が語った勉強法を解説！ |
| BcQYOFXw8Fo | below_min_score_or_cutoff | 27 | video | After Effects | AdobeCreativeStation | 【After Effects】初心者向け：After Effectsでカッコいいリリックビデオを作ってみよう #2 \| アドビ公式 |
| xDwwhdbzKy4 | below_min_score_or_cutoff | 27 | data | BI | Power BIとデータ分析の学びサイト | 【入門編】たった9分で理解できるPower BIの概要 |
| CFP01W7-BwA | below_min_score_or_cutoff | 27 | shikaku | IT | 文系でもわかる! IT勉強会 | 【アルゴリズム入門】基本情報サンプル問題(科目B)問1 |
| 3u0iRtlURpk | below_min_score_or_cutoff | 27 | biz | プレゼン | しごおもTV | 【資料 構成】資料を早く・ロジカルに作る3つのポイントを解説！【パワポ】 |
| HqRd4_U9EN0 | below_min_score_or_cutoff | 27 | prog | インフラ | 平田哲也インスタリール大学 | パソコン初心者向け！Web/ICT/IT用語【覚えるべき基本・基礎単語】 |
| piQ5gz-dgcw | below_min_score_or_cutoff | 27 | shikaku | IT | 文系でもわかる! IT勉強会 | 【アルゴリズム入門】基本情報サンプル問題(科目B)問9 |
| UtNPgtoiZz4 | below_min_score_or_cutoff | 27 | prog | JavaScript | Webの神様 | 【超入門】初心者でも安心！JavaScript学習入門（後編）処理に関する基礎知識 if文・ループ文などの仕組みを解説【Webデザイン・プログラミング】 |
| H8c0I0lkl9Y | below_min_score_or_cutoff | 27 | prog | Git | にゃんたのAIチャンネル | GitHub Copilotを使いこなすためのコツを解説してみた |
| OSe2ef3iLGw | below_min_score_or_cutoff | 27 | prog | JavaScript | アキユキ / Web制作チャンネル | JavaScriptとは何か（概念・DOM・型・変数）【全5回でJavaScriptの基礎を徹底】 |
| l9rtp8i3Flw | below_min_score_or_cutoff | 27 | ai | Copilot | ユースフル / 実務変革のプロ | 【2026年版】進化が止まらないCopilotの最新活用テクニック総まとめ！ |
| K5Tf7qQe3Qg | below_min_score_or_cutoff | 27 | ai | プロンプト | わちょんのゆっくりIT | 【大注目スキル】「プロンプトエンジニアリング」の基礎について、"Prompt Engineering Guide"に沿って少し真面目に解説します。part2 |
| X_I1Tuog0Ck | below_min_score_or_cutoff | 27 | data | データサイエンス | 放送大学YouTubeチャンネル | データサイエンス・リテラシ基礎（’22）＜放送大学オンライン科目紹介＞ |
| I0iN1WoI8b0 | below_min_score_or_cutoff | 27 | kaikei | 簿記 | こん@簿記コーチ | 【簿記2級】勉強法を間違えると99％落ちます　【５ステップ】【コツ9選】 |
| bJcRT7l7RN8 | below_min_score_or_cutoff | 27 | prog | インフラ | もりこーぽちゃんねる　インフラ系エンジニア情報チャンネル | 【ネットワーク初心者】【有料級】【設定】CiscoのCatalyst1000を使って学ぶ！乗っ取られたくないあなたに見てほしい… |
| _2-OlpIf7WA | below_min_score_or_cutoff | 27 | kaikei | 中小企業診断士 | まとめシート流！絶対合格チャンネル 【資格試験・中小企業診断士試験対策】 | 【中小企業診断士2次試験】超初心者のための試験概要＆勉強法紹介 第028回 |
| TXHmpsnPH58 | below_min_score_or_cutoff | 27 | data | Excel | いけともch | 【決定版】Copilot Excel、初心者が使いこなすための「7つの型」～これだけ覚えれば明日からExcel作業が変わる！ |
| aQYTmrZFkaE | below_min_score_or_cutoff | 27 | prog | JavaScript | プログラミングアカデミー | 初心者向けJavaScript入門講座#9【JavaScriptの配列について】 |
| x3GsnTc28-Y | below_min_score_or_cutoff | 27 | video | DaVinci | Ishicaw | 【簡単】ダビンチ リゾルブ インストールガイド DaVinci Resolveのインストール方法を完全解説 無料版  ダウンロード方法から起動 クイックセットアップ 日本語化まで 無料動画編集 |
| hdpMw3hyQq4 | below_min_score_or_cutoff | 27 | prog | Git | しもむらともき | 【初心者向け】Visual Studio Codeを使ったGit Github入門 Github Actionsを使った自動デプロイも紹介 |
| CtLx2uHjV8M | below_min_score_or_cutoff | 27 | shikaku | IT | 名古屋で働くAI・データ分析者「仲田=よーいち」 | 【本音で解説】情報セキュリティマネジメント試験は受験すべきか？【基本情報技術者試験・応用情報技術者試験・ITパスポートとどちらを優先すべき？】【安全確保支援士ではないですよ!】【情報処理技術者試験】 |
| 16ijdNxYTkk | below_min_score_or_cutoff | 27 | video | デザイン | Mappy Photo | 【初心者向け基本】YouTubeサムネイルデザインのコツ5選 |
| Lvx9fOJkZnc | below_min_score_or_cutoff | 27 | ai | Claude | しんいちろう　AI大学【AIで副業をラクに】 | たった1動画で理解できるClaudeの教科書【完全攻略】 |
| ZV_RlKLlkTs | below_min_score_or_cutoff | 27 | video | Premiere Pro | ゼロイチ動画編集 【Bver映像制作ラボ】 | 【2026年最新】超初心者向け！ゼロから始める動画編集のやり方を徹底解説！｜Premiere Pro｜ |
| djBjmgtPR7s | below_min_score_or_cutoff | 27 | kaikei | FP | みきてぃーのFP2級試験対策講座 | 【FP2級】2022年5月試験対策講座vo.1 ライフプランと資金計画① |
| N-Heok17u00 | below_min_score_or_cutoff | 27 | shikaku | IT | 【資格試験サポーター】のっち・中小企業診断士 | 【超具体的！】28日間で「ITパスポート」に独学で合格する勉強法 [勉強スケジュール有りで学生・社会人の初心者にもオススメ！] |
| r25WTGioR7Q | below_min_score_or_cutoff | 27 | data | BI | 業務効率化・データ活用ちゃんねる | 【PowerBI入門】リレーションシップでのデータ紐づけ方法を10分で解説！ |
| 37EH-aC1qqE | below_min_score_or_cutoff | 27 | prog | SQL | 徳田 啓【プログラミング学習チャンネル】 | SQL基礎講座　15分で理解する！【プログラミング】 |
| a5Yz6i1g9kg | below_min_score_or_cutoff | 27 | prog | インフラ | くろかわこうへい【渋谷で働いてたクラウドエンジニアTV】 | 【有料級】インフラ初学者でもOK！経験ゼロからクラウドエンジニアで活躍するための無料講座【じっくり徹底解説】 |
| eHIcKJLNWTY | below_min_score_or_cutoff | 27 | prog | JavaScript | せお丸@AI駆動開発 | JavaScript入門講座｜Javascriptで出来ることや勉強法をわかりやすく解説！【6分でわかるJS入門】 |
| 7O-9xT_W908 | below_min_score_or_cutoff | 27 | prog | JavaScript | 逆転は無理でも、せめて追いつくFラン社畜プログラマ | ゆっくり解説　JavaScriptを始めるにあたって知っておいたほうが良いHTMLの基礎知識　知ってると思い込んでるあなたも確認のため見てみよう |
| XI0aEuSYbuU | below_min_score_or_cutoff | 27 | marke | SEO | タメブロch【初心者のためのブログ始め方講座】 | 【ブログ初心者向け】SEOとは何か？超基本をわかりやすく解説！【SEO対策】 |
| bS8TvBiK1Eo | below_min_score_or_cutoff | 27 | ai | Copilot | AIキャンプ / 中村俊也 | 【完全保存版】Microsoft 365 Copilotの全体像：基本チャットからAgentまで一気に理解 |
| GWlUZ8T5YfY | below_min_score_or_cutoff | 27 | kaikei | FP | みきてぃーのFP2級試験対策講座 | 【FP2級】2022年1月試験対策講座vo.6 金融資産運用② |
| Xr_HhLuzOy8 | below_min_score_or_cutoff | 27 | ai | Claude | Vibe Coding Studio【AI 駆動開発実践】 | 【1時間で速習】Claude Code完全ガイド　AI駆動開発で企業サイトを作ってデプロイまで実演 |
| Ti-EP4v6xgA | below_min_score_or_cutoff | 26 | biz | Word | 金子晃之 | Word文字や文章の位置をキレイに揃える方法【スペース不要】 |
| SclcPxZtjBs | below_min_score_or_cutoff | 26 | video | Premiere Pro | AI編集で稼ぐプロこーたろー | 【超初心者向け】ゼロから始めるYouTube動画編集のやり方【2023年保存版】【元動画も無料配布】【動画編集ソフト・YouTuber・副業・Premiere Pro】 |
| f9K93zZp_Tk | below_min_score_or_cutoff | 26 | ai | ChatGPT | パソコン博士TAIKI | 『ついに出た！】スマホ版 公式ChatGPT！これは凄い！【偽物に騙されるな】 |
| Yao6rnIACE0 | below_min_score_or_cutoff | 26 | english | 英会話 | Naomi \| 40代50代のやり直し英会話 | 【知らなきゃ損！】40歳から英語がペラペラになる方法 |
| 3J9Piu8nTCc | below_min_score_or_cutoff | 26 | money | NISA | 両学長 リベラルアーツ大学 | 【再放送】【2022年からほぼ全員対象】iDeCoは老後資金問題の解決策になるのか？よくある質問6つに回答【株式投資編】：（アニメ動画）第134回 |
| teIvz_qoDT8 | below_min_score_or_cutoff | 26 | ai | Gemini | PIVOT 公式チャンネル | 【すべての人が生成 AI をつかいこなす時代へ】 Gemini 超実践術 / 日常も、ビジネスも、開発も加速 / Google Workspace /  Vertex AI |
| wgb69RUzTv8 | below_min_score_or_cutoff | 26 | biz | 資料作成 | PIVOT 公式チャンネル | 【パワポ作成 5つのポイント ♯1】これさえできれば誰でも「一流パワポマスター」／東大工学部卒「パワポ芸人」／国山ハセンのパワポの点数は？　リアル企画書にダメ出し【パワポ芸人 トヨマネ】 |
| u60vNsYEOZ0 | below_min_score_or_cutoff | 26 | money | 家計 | フェルミ漫画大学 | 【要約】見るだけでお金が貯まる 賢者のノート【水上克朗】 |
| 3xhWX50TF5g | below_min_score_or_cutoff | 26 | kaikei | 簿記 | 両学長 リベラルアーツ大学 | 【価値ある資格】簿記3級・2級の学習を始めるのに「最適な時期」とその理由【お金の勉強 初級編】：（アニメ動画）第105回 |
| bWGqHys4AV4 | below_min_score_or_cutoff | 26 | english | TOEIC | Makieigo | 【聞き流し1時間】TOEIC600点目標リスニング フレーズで重要表現が覚えられる！３【19】 |
| gIWAOjoTXCk | below_min_score_or_cutoff | 26 | kaikei | 簿記 | 謎バラ【人生切り抜き系YouTuber】 | 【簿記３級】知識ゼロから２週間（45時間）で満点合格した話 |
| XJpM-eFVmnM | below_min_score_or_cutoff | 26 | biz | 資料作成 | マナビジネス【コンサル仕事術】 | 【話し方】プレゼンが上手い人は、なぜ流れるように話ができるのか？プレゼン上手い人が無意識にやっている「紙芝居メソッド」とは？ |
| wp1MychqRIg | below_min_score_or_cutoff | 26 | money | 家計 | 4人家族ぴーちの節約術 | 【家計簿公開】4人家族月22万円で豊かな暮らし♪生活費を下げる方法！節約主婦の節約術 |
| Ky4QnBFlESM | below_min_score_or_cutoff | 26 | kaikei | 簿記 | 謎バラ【人生切り抜き系YouTuber】 | 【簿記2級】1ヶ月(92時間）の勉強で合格した話 |
| xA1htts_wKI | below_min_score_or_cutoff | 26 | english | TOEIC | Haru English | TOEIC PART4の裏ワザ的攻略法 |
| 8Frg8QTJJ5o | below_min_score_or_cutoff | 26 | shikaku | IT | ごまどう | 2日間で30時間勉強して基本情報技術者試験合格する様子 |
| b6r2xz_iCZo | below_min_score_or_cutoff | 26 | biz | 資料作成 | PIVOT 公式チャンネル | 【パワポ作成 5つのポイント ♯2】①箇条書きを作る ②テンプレートを作る／Wordで整理できない人がパワポに取り掛かるな／色はどうするべきか？【パワポ芸人 トヨマネ】 |
| NEpDaqqQDsI | below_min_score_or_cutoff | 26 | english | 発音 | タロサックの海外生活ダイアリーTAROSAC | 【最速最短】日本一の発音講師に聞く最強の英語発音習得法｜これであなたもネイティブ級!! |
| sSpgGkf7CSc | below_min_score_or_cutoff | 26 | kaikei | 簿記 | 【簿記】マネトク（独学応援ちゃんねる！） | 【簿記３級】第1回 勘定科目と５大要素をラクに覚える方法（資産、負債、純資産、費用、収益） |
| VLE32fv_eQg | below_min_score_or_cutoff | 26 | money | 家計 | 両学長 リベラルアーツ大学 | 【超キホン】家計管理に役立つ、リベ大流「予算の立て方」を分かりやすく紹介【リベ大公式切り抜き】 |
| aGLT6DANgZ0 | below_min_score_or_cutoff | 26 | shikaku | IT | ITパスポート 絶対合格の講座 | 【ITパスポート】試験勉強の8つのポイント |
| daPKYm4V4Og | below_min_score_or_cutoff | 26 | marke | SNS | PIVOT 公式チャンネル | 【ゼロコストで1億円稼ぐ】Twitter×note脅威のシナジー効果／経済ジャーナリスト後藤達也が徹底解説／YouTube Podcastの今後 |
| fZJA5vF_sCM | below_min_score_or_cutoff | 26 | kaikei | FP | ちあき夫婦 | 【独学】FP3級を1ヶ月間で合格した勉強方法｜1日1時間の勉強スケジュール公開 |
| _8Pb80Ewpqk | below_min_score_or_cutoff | 26 | kaikei | FP | なかちの解説チャンネル | FP2級 一問一答聞き流し！全６分野【2024年改正版】 |
| HF2lW_k2ZN4 | below_min_score_or_cutoff | 26 | biz | プレゼン | PIVOT 公式チャンネル | 【パワポ作成 5つのポイント ♯3】③四角形で切り分ける ④メリハリを付ける／パワポは「スキルの総合格闘技」／前振りとオチを考える【パワポ芸人 トヨマネ】 |
| 7J_crzU5KP8 | below_min_score_or_cutoff | 26 | prog | インフラ | クライン【KLeIn】 | 【AWS 入門】基本ネットワーク構成をマスターしよう！ |
| Fu32qMYE0Rw | below_min_score_or_cutoff | 26 | kaikei | FP | なかちの解説チャンネル | 【FP2級】一問一答！聞き流し動画～全分野～ |
| 7YsTthxVuE0 | below_min_score_or_cutoff | 26 | english | ビジネス英語 | 英語コーチング TORAIZ（トライズ） | 英語ミーティングでのリアルな英会話／字幕なし・英語字幕・日本語字幕【ビジネス英語聞き流し】 |
| BIPzI4oFACY | below_min_score_or_cutoff | 26 | english | TOEIC | イメージ英語 - Image English | 【聞き流し】TOEIC L＆R スコア600を目指す「初級の500語」（出る単特急 金のフレーズ／イメージ画像・例文付き） |
| waAwVXa9y2o | below_min_score_or_cutoff | 26 | shikaku | IT | 実践の鬼:IT学校さいとうさん | 【初心者向け】基本情報技術者試験 科目B\|アルゴリズムをゼロから理解する |
| kKMm1acGt3I | below_min_score_or_cutoff | 26 | prog | SQL | プログラミングアカデミー | 【MySQL入門決定版】2時間半で学ぶ初心者向けMySQLデータベースチュートリアル【MySQLの基本とSQLの基礎文法の徹底的にマスター】 |
| F6Pf3DQShvU | below_min_score_or_cutoff | 26 | shikaku | IT | ITすきま教室【ITパスポート.基本情報技術者試験.高校情報】 | アルゴリズム基礎①／基本情報技術者・ITパスポートを受ける前に見る動画 |
| TZSiAncUml0 | below_min_score_or_cutoff | 26 | ai | Copilot | PIVOT 公式チャンネル | 【Copilot活用術 vol.4】コミュニケーションツールで使いこなす　Outlook & Teamsチャット編／メールの下書きもお任せ　文面のコーチングも／チャット文章もワンクリックで激変 |
| m4tY24TUAe0 | below_min_score_or_cutoff | 26 | shikaku | IT | 【基本情報技術者試験YouTuber】すーさん | 【A試験_ストラテジ】01.ソリューションビジネスを理解する\| 基本情報技術者試験 |
| dK6S7_zygFg | below_min_score_or_cutoff | 26 | money | 家計 | 節約主婦mari | 【貯金のコツ】家計管理歴5年の私がおすすめしたい、長く続けるコツ7選 |
| 45LNOD3cyw8 | below_min_score_or_cutoff | 26 | video | CapCut | マークのスマホで動画クリエイター | 【初めてのCapCut】まず見るべき！スマホ動画編集アプリCapCutの使い方 |
| v-5qdvlJRcU | below_min_score_or_cutoff | 26 | video | Premiere Pro | 初心者のための動画編集講座 | 【Premiere Pro】動画編集を30分でザックリ習得【初心者向け】 |
| u1aowl54Uxc | below_min_score_or_cutoff | 26 | biz | Word | デザインの鉄則 | ワードでチラシを作るコツ |
| QoClH8s-ywI | below_min_score_or_cutoff | 26 | shikaku | IT | みみスタ | サクッと覚える！略語「基本情報技術者」徹底攻略  直前対策 |
| bhDMorZ2rEQ | below_min_score_or_cutoff | 26 | biz | 資料作成 | しごおもTV | 【最低限】「分かりやすい」は作れる！資料の型｜簡単に資料が整う【パワポ】 |
| LYBqs6LtmLs | below_min_score_or_cutoff | 26 | prog | SQL | スタビジ【誰でもAIデータサイエンス】byウマたん | 【7分で分かる！】基本をおさえるSQL入門講座！ |
| 4w9evvsLUWk | below_min_score_or_cutoff | 26 | data | BI | ITツール学習 | 【神ツール】PowerBI データ加工機能使い方 【PowerQuery】【Excel】(エクセルユーザ必見,業務効率化） |
| V02yw6q6KjM | below_min_score_or_cutoff | 26 | kaikei | 簿記 | 公認会計士ながたたけしのスタディチャンネル | 【復習専用】聞き流し👂この動画1本聞くだけ🏆【簿記３級仕訳】完全イメージ化｜音声学習♪時短復習｜コスパ復習 |
| Ok5OwGOmVA4 | below_min_score_or_cutoff | 26 | shikaku | IT | SAMURAI ENGINEER [侍エンジニア] | 【必須資格？】基本情報技術者試験を 取得するメリットや学習法を解説 |
| QyOk1l4jcQw | below_min_score_or_cutoff | 26 | data | BI | RPACommunityチャンネル | 【１時間で理解】やさしいPower BI のはじめかた。MVPが丁寧に教えます【資料有】 |
| 9ECbVP_9xKw | below_min_score_or_cutoff | 26 | prog | SQL | SAMURAI ENGINEER [侍エンジニア] | 【データベースに必須】SQLとは？特徴やできること・学ぶメリットをわかりやすく解説 |
| qKDJ2fly-Ek | below_min_score_or_cutoff | 26 | shikaku | AI検定 | ワイズデータ [聞き流しで受かるIT・データ資格チャンネル] | 【生成AIパスポート 聞き流し】 第1章 AI（人工知能）  ~2025年2月試験シラバス対応~　#ysdata |
| coFFDjdyLFY | below_min_score_or_cutoff | 26 | biz | プレゼン | 看護研究チャンネル | パワーポイントを使った 研究 発表 スライド学会発表 |
| JvICLq5w8bc | below_min_score_or_cutoff | 26 | english | ビジネス英語 | ビジネス英語コーチHika | 【英会話リピート練習 】口で覚えるビジネス英語フレーズ40 会議編 |
| kfa0kDy5nJs | below_min_score_or_cutoff | 26 | data | BI | 業務効率化・データ活用ちゃんねる | 【Power BI入門】SharePointフォルダーからデータを取得し、自動更新設定する方法 |
| QZG_BepbKOk | below_min_score_or_cutoff | 26 | ai | プロンプト | にゃんたのAIチャンネル | 海外の一流AI研究者が教えるプロンプトエンジニアリングをまとめてみた【ChatGPT Prompt Engineering for Developers】 |
| -YYyfStIITY | below_min_score_or_cutoff | 26 | shikaku | IT | みみスタ | サクッと覚える！「ITパスポート」2026年 用語まとめ 直前対策 |
| i_xuklFLqBw | below_min_score_or_cutoff | 26 | biz | Word | ゼロからパソコン | 【ワード初心者】ページ設定で、余白や行数を調節する【ゼロからパソコン】 |
| ySk9mHZfZSo | below_min_score_or_cutoff | 26 | kaikei | FP | みぃこのFP合格応援チャンネル | 【FP2学科】よく出る問題100問！復習もかねてクイズにもご参加ください♪全6分野一問一答｜FP2級技能士検定｜学科試験対策｜ |
| c8gm-nPHTTU | below_min_score_or_cutoff | 26 | marke | SEO | SEOおたく / LANY(レイニー) | 【2025年完全版】新・SEO対策の教科書 |
| W5BIN5vkWD8 | below_min_score_or_cutoff | 26 | shikaku | IT | 実践の鬼:IT学校さいとうさん | 【絶対するな】知らないと損する基本情報技術者試験勉強法 |
| dxQd7N3wqps | below_min_score_or_cutoff | 26 | data | 統計 | スキマ時間で医療統計｜スキマル | 【解説】統計学的に有意とは｜P値と仮説検定 |
| EjfGXDZf2Jc | below_min_score_or_cutoff | 26 | kaikei | 簿記 | CPAラーニング | 【簿記3級】仕訳が苦手な人へ！簿記が得意になるシンプルな思考法｜初心者向け勉強法【CPAラーニング】 |
| HY1fXPc4OqY | below_min_score_or_cutoff | 26 | biz | Excel | ゼロからパソコン | 【エクセルって何？】エクセルでできること・画面の構成がわかる♪【エクセル初心者】 |
| EvPf8GU2ds4 | below_min_score_or_cutoff | 26 | shikaku | AI検定 | tomo@資格挑戦アカウント | 生成AIパスポート試験　01AIの概要　短期学習で合格！出るとこだけの聞き流し　#生成AIパスポート　#生成AIパスポート試験 |
| sGzF64NeVu8 | below_min_score_or_cutoff | 26 | prog | SQL | ゆっくりITちゃんねる | 【ゆっくりIT】SQLは絶対覚えろ！ うぷ主的SQLを覚えるべき理由とポイント！ ～ゆっくり解説データベース～ No.041 |
| RbCvK1KgZ0k | below_min_score_or_cutoff | 26 | ai | Copilot | KEITO【AI&WEB ch】 | 【最新】Copilot AIエージェント活用！Excel・Word・PowerPointを自動実行【Microsoftコパイロット】 |
| Y6Ymzo-qS4M | below_min_score_or_cutoff | 26 | ai | Gemini | HelloTips【スマホ超入門講座】 | 【初心者向け】無料で使えるAI「Gemini」の基本操作🔰 |
| yKP_CsZaWuc | below_min_score_or_cutoff | 26 | biz | プレゼン | タノ先生の見える化大学-グラレコ- | 《PowerPoint》簡単マニュアルの作り方 |
| zyUljLrKkno | below_min_score_or_cutoff | 26 | ai | Copilot | ユースフル / 実務変革のプロ | 【Copilot】知らなきゃ損する！有償版だけで使える便利機能（ノートブック・リサーチツール・エージェント） |
| YxFbqRe_cac | below_min_score_or_cutoff | 26 | biz | Excel | ユースフル / 実務変革のプロ | [Excel講座4/5]【圧倒的使いやすさ】エクセル超重要機能を丁寧に紹介！知らないと損するかも…！ |
| KcfuGTJPNuk | below_min_score_or_cutoff | 26 | data | 統計 | 田中嘉博 | ｔ検定、分散分析、カイ二乗検定を普通の日本語でじっくり解説 |
| qKMc-uzDxEk | below_min_score_or_cutoff | 26 | ai | 自動化 | AIでサボろうチャンネル | 【簡単】自分好みのAIニュースが勝手に届く自動化の仕方【n8n/Grok/Tavily】【読み込むだけで動画内のワークフローが作れるファイル用意してます】 |
| K3gmiRPgLxw | below_min_score_or_cutoff | 26 | marke | SNS | さき-インスタの大学 | 【そのまま使用OK】インスタ×ファン化で最速で収益化までいく方法教えます！ |
| asojXoacfCs | below_min_score_or_cutoff | 26 | prog | インフラ | ゆっくりITエンジニア | 【ゆっくり解説】ゆっくりITエンジニアへの道　-CCNAは一か月でとれるよ- |
| pWJFdvuKcmw | below_min_score_or_cutoff | 26 | ai | Gemini | ひろっさんチャンネル〜中高年のためのスマホ生活 | 【シニア必見】テレビCMで大注目！AI「ジェミニ」実はシニア向け最強アプリだった！ |
| aLyhD37fHfY | below_min_score_or_cutoff | 26 | ai | Copilot | ユースフル / 実務変革のプロ | 【Copilot新機能】ノートブック徹底解説｜"蓄積する知識"で専属アシスタントを作成する方法 |
| hURSBCHCGXM | below_min_score_or_cutoff | 26 | shikaku | IT | ひまり | 【アラサー独身】IT未経験が一発合格したITパスポートの勉強方法についてお話しします |
| aWKvfGMAArk | below_min_score_or_cutoff | 26 | kaikei | 簿記 | 簿記3級＆2級をやさしく解説 | 【簿記2級勉強法】知らないと損！効果大でやってる人少数の簡単なコツ |
| 6yGMqvlaAeM | below_min_score_or_cutoff | 26 | shikaku | AI検定 | tomo@資格挑戦アカウント | 資格取ろうぜ！第20回  生成AIパスポート試験をIBTで受験してみた結果！ 試験内容やテキスト・問題集選びと学習法について！ #生成AIパスポート #生成AIパスポート試験 |
| XIp3fUbv9RI | below_min_score_or_cutoff | 26 | data | データサイエンス | Python・データサイエンス入門チャンネル -はやたす- | 【Python×データサイエンス入門②】KaggleとGoogle Colabolatoryを使って無料でデータ分析を始めよう！ |
| uXi-CCiXkuU | below_min_score_or_cutoff | 26 | kaikei | 税理士 | レックスたぬ吉の会計転職チャンネル【経理・税務・監査】 | 簿記1級と税理士試験の関係 ！ |
| Hm_2p3Rc4IQ | below_min_score_or_cutoff | 26 | shikaku | AI検定 | スタビジ【誰でもAIデータサイエンス】byウマたん | 【6分で分かる】生成AIパスポートの試験難易度や勉強方法について解説！ |
| 0I6wo0F1HPk | below_min_score_or_cutoff | 26 | marke | SNS | 門口拓也インスタ運用 | 【2025年最新】インスタ集客戦略！実店舗経営者は必見です |
| uq6FVoCl5KI | below_min_score_or_cutoff | 26 | video | デザイン | ゼロイチWEBデザイン:未経験からWEBデザイナーへ | 【実践】現役WebデザイナーがYouTubeサムネイルの作り方をゼロから教えます！｜ 未経験からWEBデザイナーへ |
| 7N9_bO1WSng | below_min_score_or_cutoff | 26 | shikaku | 宅建 | 国際弁護士Tokyo Joeの宅建講座 | 【宅建は独学の時代へ】高得点続出！講義付テキストで一発合格する方法🔥 |
| daVr73lUVso | below_min_score_or_cutoff | 26 | video | DaVinci | あをき / AOKI | 【クオリティUP】お金を払ってでも使いたい無料プラグインを3つ紹介【DaVinci Resolve】 |
| do5PytgZzAA | below_min_score_or_cutoff | 26 | kaikei | 簿記 | とものり【会計を仕事にch】 | 【簿記２級の勉強法】※勉強時間を短くしたい人だけ見てください。 |
| EovrhO4S_G8 | below_min_score_or_cutoff | 26 | ai | Copilot | ユースフル / 実務変革のプロ | 【Copilot】返信漏れを100%防ぐタスク管理術 |
| TzGY-b_yfwo | below_min_score_or_cutoff | 26 | kaikei | FP | FP【こう】 | 【出題率100%】FP2級 30回連続で出題されている問題 |
| qiJN3pU59U0 | below_min_score_or_cutoff | 26 | video | デザイン | あいてぃのはじめてのデジタルお絵かき | 【初心者向け】VLLOでスマホだけでサムネイルを作る方法。とっても簡単です！/使うアプリはVLLOだけ。無料でできます。 |
| ZmJ_xXvKbcM | below_min_score_or_cutoff | 26 | shikaku | 宅建 | 棚田行政書士の不動産大学【公式チャンネル・宅建】 | 【２月スタートで宅建に合格するスケジュール2026年最新版】今年宅建に合格するならこのスケジュールでやって！スケジュール表の無料ダウンロードあり。棚田式分野別過去問題集コラボ動画。 |
| AWMnqZvWkHU | below_min_score_or_cutoff | 26 | biz | Excel | ユースフル / 実務変革のプロ | [Excel講座2/5]【もう忘れない】関数を徹底的に攻略！2021年至上最も分かりやすいExcelマスター講座 |
| X_QMJVHX04A | below_min_score_or_cutoff | 26 | marke | SNS | さき-インスタの大学 | 【9割が知らない】使うだけでインスタがバズりやすくなる最強ツールを12個紹介します！ |
| s2EjNeTvki0 | below_min_score_or_cutoff | 26 | video | デザイン | JEMMA's style. / じぇますた。 | スマホで簡単おしゃれに！サムネイルの作り方【Canva】 |
| AsdeDMEWylk | below_min_score_or_cutoff | 26 | english | ビジネス英語 | ビジネス英語コーチHika | 【英語会議で差がつく】ネイティブが必ず使う鉄板フレーズ50選【ビジネス英語】 |
| Y2gnGQu5aUo | below_min_score_or_cutoff | 26 | biz | プレゼン | しごおもTV | 【資料作成】簡単3ステップ！垢抜けスライド作成法！｜野暮ったい資料をスマートにする |
| ey2XclT2_4I | below_min_score_or_cutoff | 26 | kaikei | FP | みきてぃーのFP2級試験対策講座 | 【聞き流し】2025年5月試験FP2級 厳選40問 vo.1 |
| o1TTOh7lZcI | below_min_score_or_cutoff | 26 | shikaku | IT | 文系でもわかる! IT勉強会 | 【勉強法】基本情報技術者試験（新制度対応版） |
| zs8UytdWQEM | below_min_score_or_cutoff | 26 | kaikei | FP | yuiのFP講座【1級FP】 | 【FP3級】第1回FPと倫理【ライフプランニングと資金計画】 |
| ibKL7zbFKI8 | below_min_score_or_cutoff | 26 | biz | Word | パソコン上達!Nagomiチャンネル | Word【文書作成の練習】入力ができればOK！動画を見ながら一緒に作成できます。たくさんの機能を詰め込みました。 |
| _dYxVUfP8dw | below_min_score_or_cutoff | 26 | marke | SNS | ひかる┃インスタマーケティング | 【2026年最新版】インスタ0からフォロワー1000人までの増やし方5ステップ！今から爆速で伸ばすならこれ!【インスタ攻略】 |
| h0sA_Wh9IcY | below_min_score_or_cutoff | 26 | data | データサイエンス | Python・データサイエンス入門チャンネル -はやたす- | 【Python×データサイエンス入門④】データの可視化と欠損値の確認【Matplotlib, Pandas, Seaborn】 |
| 9RD_FSsMUa4 | below_min_score_or_cutoff | 26 | kaikei | 中小企業診断士 | ノーシスの海 | 【苦手なら見て!!】60点を取る勉強法 財務会計 中小企業診断士1次試験【資格】 |
| Tz4mwi_5H60 | below_min_score_or_cutoff | 26 | shikaku | IT | 聞くだけ資格マスターズ | 【ITパスポート完全攻略】1092語を2時間で一気に理解！頻出用語を一言要約で暗記【2026最新シラバス対応】 |
| H0UN-0r10os | below_min_score_or_cutoff | 26 | shikaku | 宅建 | 棚田行政書士の不動産大学【公式チャンネル・宅建】 | 【宅建合格スケジュール２０２６：受験生はこれやって】概要欄から無料ダウンロード！宅建に合格するならこのスケジュール『大量記憶表』を使ってやって。 |
| vHMgM26j7jU | below_min_score_or_cutoff | 26 | ai | 自動化 | SHIFT AI ニュース | 【無料】Googleの「Opal」で作れる自分専用の自動化ツールがマジですごい！ |
| 8FPgoCjoenI | below_min_score_or_cutoff | 26 | ai | プロンプト | StudyCo | 【2023/04/20】プロンプトエンジニアリングから始めるLangChain入門 |
| 8xghA71RNO4 | below_min_score_or_cutoff | 26 | marke | SNS | ズボラ兄さんのInstagram完全攻略 | 【2026年超最新】Instagramが大激変！知らないと損している！インスタ集客の新常識を暴露しちゃいます |
| 7zT9HgTY6lI | below_min_score_or_cutoff | 25 | english | 発音 | サイモンのイキれる英語教室 | 日本人の英語発音はネイティブにこう聞こえています。 |
| XMQDfj-yEXI | below_min_score_or_cutoff | 25 | english | 発音 | Kendra's Language School | 英語の脳を作る・シャドーイング練習500 – 基本編 |
| wFpyeWto8Og | below_min_score_or_cutoff | 25 | shikaku | IT | 【基本情報技術者試験YouTuber】すーさん | 【科目B】アルゴリズム問題をたった1動画で対策_基本情報技術者試験 |
| 7JFIwdxQq1o | below_min_score_or_cutoff | 25 | money | 投資 | ひろゆきの部屋【ひろゆき, hiroyuki】切り抜き | 【ひろゆき 投資】庶民が投資信託をやるとどれだけ損するか教えます。金持ち以外は絶対にやってはいけません【 切り抜き 積立NISA インデックスファンド 中田敦彦のyoutube大学 hiroyuki】 |
| Ay1cpehksq8 | below_min_score_or_cutoff | 25 | biz | Excel | PC活用ちゃんねる | 【Excel基本操作】職場で恥をかかない為に最低限覚えておきたいこと |
| K0m7jAnlC6Y | below_min_score_or_cutoff | 25 | biz | Word | ゼロからパソコン | 【Wordの困った】行間が勝手に広がる問題をサクッと解決♪ |
| g1IZlFD5mYo | below_min_score_or_cutoff | 25 | kaikei | 簿記 | 【簿記・会計】公認会計士たぬ吉の資格塾 | 【日商簿記3級】 第1回  簿記って何？ |
| _wbOzkneb84 | below_min_score_or_cutoff | 25 | english | 発音 | だいじろー Daijiro | だいじろーの英語発音練習ルーティン1時間【ただ練習してるだけ】 |
| eqzUPQ1EgpI | below_min_score_or_cutoff | 25 | english | 発音 | Ayane。  | 【毎日4分】発音英トレ/ 日本人向けフォニックスA~G🎶❤️‍🔥 |
| iZ5yYP2yenA | below_min_score_or_cutoff | 25 | kaikei | 簿記 | 公認会計士/小山あきひろ | 【超簡単】複式簿記の借方貸方の覚え方【公認会計士】日商簿記/簿記検定 |
| jBvm2wRNEl8 | below_min_score_or_cutoff | 25 | kaikei | 簿記 | 【簿記・会計】公認会計士たぬ吉の資格塾 | 日商簿記２級に４５日で合格する方法！ |
| bUUPcaDUutU | below_min_score_or_cutoff | 25 | shikaku | IT | みみスタ | サクッと覚える！「基本情報技術者」よく出る単語200 直前対策 |
| 2vLa045l2iY | below_min_score_or_cutoff | 25 | video | DaVinci | AKIYA MOVIE | 【DaVinci Resolve 18】認定トレーナーが教えるパーフェクトチュートリアル！この動画だけで全てが分かります。 |
| KyqvEKBliUg | below_min_score_or_cutoff | 25 | kaikei | 簿記 | 【簿記・会計】公認会計士たぬ吉の資格塾 | 日商簿記３級ネット試験のコツ！ |
| O7IPT1pwChg | below_min_score_or_cutoff | 25 | kaikei | FP | なかちの解説チャンネル | 【FP3級】一問一答！聞き流し動画～ライフ・リスク・金融・タックス・不動産・相続～ |
| 2yL8GnBdZMo | below_min_score_or_cutoff | 25 | data | 統計 | 田中嘉博 | t検定とχ二乗検定ってそもそも何？どういうふうに使い分ける？ |
| EKnUgkYh-Pc | below_min_score_or_cutoff | 25 | kaikei | 税理士 | 【簿記・会計】公認会計士たぬ吉の資格塾 | 税理士試験はどれほど難しいのか！？ |
| _xdtmUpUNyw | below_min_score_or_cutoff | 25 | english | TOEIC | 大人のための武田塾English ビジネスパーソン向け英会話スクール | 【TOEICの勉強をこれから始める人向け】学習を始める前にこの動画を必ず見てください |
| cfON3-kWCuM | below_min_score_or_cutoff | 25 | shikaku | IT | 【基本情報技術者試験YouTuber】すーさん | 【A/B試験_情報セキュリティ】01.情報セキュリティの考え方\| 基本情報技術者試験 |
| J5RntYNBTp0 | below_min_score_or_cutoff | 25 | english | 発音 | Atsueigo | 【超簡単】一瞬で発音が劇的に向上するコツを伝授します |
| i026L7Yj2NY | below_min_score_or_cutoff | 25 | kaikei | 簿記 | 滝すぐる | 日商簿記2級を5回受験して気づいた合格法とコツ |
| edNtArZcCiA | below_min_score_or_cutoff | 25 | shikaku | IT | 【基本情報技術者試験YouTuber】すーさん | 【A試験_ネットワーク】01.ネットワークの基本と回線速度\| 基本情報技術者試験 |
| Mqq3zQYVsfM | below_min_score_or_cutoff | 25 | kaikei | FP | なかちの解説チャンネル | 【FP3級】一問一答！聞き流し動画～タックス・不動産・相続～ |
| So7_heXYbgw | below_min_score_or_cutoff | 25 | english | TOEIC | 大人のための武田塾English ビジネスパーソン向け英会話スクール | 【TOEIC初学者向け】TOEIC対策はまずこれだけやってください！オススメ参考書もまとめて紹介！vol.435 |
| Ck68H3Beg90 | below_min_score_or_cutoff | 25 | ai | ChatGPT | HackSmart2.0 ‐ハックスマート‐【ビジネス構造再構築チャンネル】 | 5分で分る！ChatGPTの初期設定　知らないと危険な2つ |
| YOSyc2jMb40 | below_min_score_or_cutoff | 25 | marke | Webマーケ | スキル獲得チャンネル | 【37分で全部学べる】学ぶべきマーケティング用語50選 |
| JxqeJnCBjQA | below_min_score_or_cutoff | 25 | kaikei | 簿記 | 【簿記･FP】独学ちゃんねる  桜田 | ✧これ1本でポイント網羅！！✧【簿記3級】第4回〜25回仕訳総復習 27問 |
| s_o5JYj6cyc | below_min_score_or_cutoff | 25 | english | 発音 | 🍀 Chinatsu The Emo | 【発音改善】ネイティブ並の英語発音にするコツ3つ教えます！　#英語学習 |
| pWlHHH5wk24 | below_min_score_or_cutoff | 25 | shikaku | IT | 【基本情報技術者試験YouTuber】すーさん | 【A試験_システム開発】01.システム開発の流れ\| 基本情報技術者試験 |
| Hjz_UK2WoO8 | below_min_score_or_cutoff | 25 | shikaku | IT | 【基本情報技術者試験YouTuber】すーさん | 【A/B試験_情報セキュリティ】05.ネットワークセキュリティ\| 基本情報技術者試験 |
| nqOIHubpygU | below_min_score_or_cutoff | 25 | prog | SQL | エンジニアチャンネル | 【初心者向け】クソデータベース設計をしないためのテクニック5選 |
| 93XTIgrC3Zs | below_min_score_or_cutoff | 25 | video | CapCut | amity_sensei | 【CapCut動画編集】ワンポチでこれ！動画に字幕つける「自動キャプション」がすごい。 |
| iMnTZROpnb8 | below_min_score_or_cutoff | 25 | prog | インフラ | エンジニア転職チャンネル【RUNTEQ公式】 | 未経験・1年目のWeb/ITエンジニアに必須の技術13選 |
| Ac_6s9zs7R8 | below_min_score_or_cutoff | 25 | kaikei | 中小企業診断士 | 中小企業診断士 / 平井あずま | 中小企業診断士を受け直すならこの勉強方法一択！！ |
| xzGeSKi8dDY | below_min_score_or_cutoff | 25 | shikaku | IT | 【基本情報技術者試験YouTuber】すーさん | 【A試験_マネジメント】01.プロジェクトマネジメントを理解する\| 基本情報技術者試験 |
| gnTxKHMYqFI | below_min_score_or_cutoff | 25 | data | データサイエンス | Pythonプログラミング VTuber サプー | 【Pythonプログラミング】NumPyの基本 〜 Pythonで科学計算や機械学習を扱う人必見！〜 |
| aze_M1RXZ9s | below_min_score_or_cutoff | 25 | kaikei | 税理士 | 税理士かねしげてつやせんせー | 【税理士試験】簿記論と財務諸表論に同時合格するための条件と学習ポイントとは？ |
| zhWqNC5q50E | below_min_score_or_cutoff | 25 | prog | SQL | 【基本情報技術者試験YouTuber】すーさん | 【A試験_データベース】06. 関係演算とSQL\| 基本情報技術者試験 |
| h173le4s4HI | below_min_score_or_cutoff | 25 | data | SQL | 【基本情報技術者試験YouTuber】すーさん | 【A試験_データベース】07. SQL文法（SELECT文）\| 基本情報技術者試験 |
| 2JgStAO2jOQ | below_min_score_or_cutoff | 25 | english | TOEIC | 大人のための武田塾English ビジネスパーソン向け英会話スクール | 【舐めてる人注意】『TOEIC L&R TEST出る単特急 銀のフレーズ』を徹底解説！金フレをやってる人は注意かも？！ 【TOEIC満点講師が解説】vol.91 |
| DTSgdfeR9CA | below_min_score_or_cutoff | 25 | biz | 資料作成 | 元外資コンサル_パワポ塾 | 【外資コンサル】パワポ資料の作成風景を公開（※倍速推奨）/使用するショートカットや作成手順を紹介！ |
| XG8WEourY5E | below_min_score_or_cutoff | 25 | shikaku | IT | 【基本情報技術者試験YouTuber】すーさん | 【A/B試験_情報セキュリティ】07.テスト頻出の情報セキュリティ分野復習\| 基本情報技術者試験 |
| ydOcT0eeNfs | below_min_score_or_cutoff | 25 | prog | JavaScript | だれでもエンジニア / 山浦清透 | JavaScriptで出来ること3選【プログラミング言語利用率1位】 |
| vCnTGyt0lZw | below_min_score_or_cutoff | 25 | kaikei | FP | ひじかた Basic Academy / 保険資格試験解説ch. | #1【ファイナンシャルプランナー３級試験】★合格への道★徹底解説★「ＦＰの基礎」 |
| I7yjUiL2gWw | below_min_score_or_cutoff | 25 | shikaku | IT | 【基本情報技術者試験YouTuber】すーさん | 【A試験_データベース】08. 機械学習とディープラーニング\| 基本情報技術者試験 |
| 8a1f-Blss-o | below_min_score_or_cutoff | 25 | prog | インフラ | ITサプリ | 【ネットワークエンジニア必須】CCNA資格を徹底解剖！難易度は？勉強方法は？【IT業界/転職】 |
| JZZ9Zk2WDrg | below_min_score_or_cutoff | 25 | kaikei | 税理士 | 税理士かねしげてつやせんせー | 【税理士試験】簿記論と財務諸表論に同時合格するために必要なこと |
| cFSGV2Qmivs | below_min_score_or_cutoff | 25 | kaikei | 中小企業診断士 | HAMA Vlog | 【全編初声出し！】中小企業診断士に登録されたので、合格までの道のりをつらつら語ってたら、過去最長・最多編集量になってしまったややウケ狙いの動画【中小企業診断士】 |
| k3V0iOyC7fs | below_min_score_or_cutoff | 25 | kaikei | 中小企業診断士 | ねとたす | ２次試験・事例Ⅰの勉強法【中小企業診断士・最短合格テクニック】 |
| q1W82LsrO8A | below_min_score_or_cutoff | 25 | marke | SNS | さき-インスタの大学 | 【2025年最新】インスタ副業始めたい人が最初にするべきこと5ステップまとめ |
| sk3eTe5Ui3s | below_min_score_or_cutoff | 25 | marke | SNS | 時給900円パートから貯金5億円超の4児シングルマザー | 【インスタ集客】問い合わせ0人→月1500人　インスタ集客基礎編 |
| gAO7ln7Pe5Y | below_min_score_or_cutoff | 25 | shikaku | IT | ロンリー社長のオンリー講座 | 【CBT方式完全攻略】基本情報技術者試験のCBTで1分1秒でも無駄にしないための動画 |
| v8Jj2fnAGQU | below_min_score_or_cutoff | 25 | kaikei | FP | ほんださんのFP試験格納庫 | FP2級_資産設計提案業務_過去問厳選模試解説（24-25年度） |
| oU2sisdcztQ | below_min_score_or_cutoff | 25 | prog | インフラ | テックキャンプのプログラミング塾 | 【新入社員向け】知らないと置いていかれるIT用語55選 |
| PjBqzG__mAM | below_min_score_or_cutoff | 25 | prog | インフラ | エンジニア転職チャンネル【RUNTEQ公式】 | 【未経験向け】IT業界の職種・仕事内容・必要スキルを全て教えます！ |
| Q6dx9AdQN1Y | below_min_score_or_cutoff | 25 | data | BI | ITツール学習 | PowerBI　リレーション解説【ER図】【紐づけ】【データ活用】【可視化】【Excelデータ活用】 |
| -HRp8KhrKno | below_min_score_or_cutoff | 25 | prog | Web開発 | 独学クソリーマンの逆襲 | 仕事(バックオフィス)で使っているPYTHONアプリを3つ紹介！ |
| iRhUDzABC3U | below_min_score_or_cutoff | 25 | biz | Word | ゼロからパソコン | 【知って納得！】お知らせ文書の作りかた。基本の型がわかれば簡単♪ |
| BDD96VaLQWI | below_min_score_or_cutoff | 25 | ai | 自動化 | いまにゅのAIプログラミング塾 | 自分専用で動いてくれる「AI秘書」を作る方法を実演します！AIで業務効率化・自動化したい人は絶対見てください【Claude Cowork】 |
| FMZpIh4LIcU | below_min_score_or_cutoff | 25 | english | ビジネス英語 | ビジネス英語コーチHika | 【2025年最新】全ビジネスシーンで使える英語フレーズ100選【挨拶/英語会議/英語メール...】 |
| khIg-kYpy5I | below_min_score_or_cutoff | 25 | money | NISA | FLYING ACEアカデミー【資産形成チャンネル】 | 【会社員の方必見】『選択性確定拠出年金』と「iDeCo」はいったいどちらがお得⁉年収別シミュレーションで超分かりやすく解説！ |
| SR93M9OFFX4 | below_min_score_or_cutoff | 25 | english | ビジネス英語 | 英語コーチング TORAIZ（トライズ） | 【英語で会議】ミーティングで即使える神フレーズ！ネイティブに聞いてみた【ビジネス英会話】 |
| jMPRNGkREGw | below_min_score_or_cutoff | 25 | kaikei | 中小企業診断士 | 久保知夏 | TAC歴20年の超有名講師が解説！【中小企業診断士】一発合格を狙う効率的な学習方法 |
| c1_4-G_uwqg | below_min_score_or_cutoff | 25 | marke | Webマーケ | 本解説のしもん塾【プロ読書家】 | SEO対策とWEB集客のコツ！『沈黙のウェブマーケティング・ライティング　松尾茂起」の本解説要約。今後WEB集客スキルは恋愛にも仕事にも必須だ。　オーディオブック ビジネス書レビュー オーディブル。 |
| s9uX7si1m5E | below_min_score_or_cutoff | 25 | english | ビジネス英語 | NAOMI CHANNEL WORLD - 英会話・ビジネス英語・アメリカ情報 | ビジネス英語メール【書き出し方、終え方、締め・結び方】これで完璧！！徹底解説 |
| 3Fn9IPlbitQ | below_min_score_or_cutoff | 25 | kaikei | 中小企業診断士 | まとめシート流！絶対合格チャンネル 【資格試験・中小企業診断士試験対策】 | 【中小企業診断士】まずここを押さえて！財務・会計の最重要ポイントは？_第275回 |
| 3CSBKcpvPT4 | below_min_score_or_cutoff | 25 | kaikei | 中小企業診断士 | まとめシート流！絶対合格チャンネル 【資格試験・中小企業診断士試験対策】 | 【中小企業診断士】まずここを押さえて！経済学の最重要ポイントは？_第279回 |
| YqmyGFfJQXM | below_min_score_or_cutoff | 25 | kaikei | 中小企業診断士 | まとめシート流！絶対合格チャンネル 【資格試験・中小企業診断士試験対策】 | 【中小企業診断士】まずここを押さえて！経営情報システムの最重要ポイントは？_第281回 |
| vpfmrf4h_gE | below_min_score_or_cutoff | 25 | marke | SNS | 比嘉太一@店舗集客×AI | 【飲食店集客特化】新規顧客を増やすInstagram集客対策7選【インスタ集客】 |
| ZXpqnbraY7E | below_min_score_or_cutoff | 25 | kaikei | 簿記 | 簿記3級＆2級をやさしく解説 | 簿記3級の勘定科目を耳で覚える！【ラジボキ】音量改善しました！削除した動画に高評価くださった方ありがとうございました。 |
| MAuRBM0-DKQ | below_min_score_or_cutoff | 25 | kaikei | 中小企業診断士 | 資格合格パートナー スタディング - スマホで学べるオンライン通信資格講座 | 中小企業診断士 短期間で合格する勉強法３ |
| gSLQYvf6ttI | below_min_score_or_cutoff | 25 | marke | Webマーケ | WebマーケティングTV【StockSun株式会社】 | クライアントも代理店も抑えるべきマーケティングの要点とは？ |
| ggrCZvN0jdY | below_min_score_or_cutoff | 25 | video | DaVinci | 動画クリエイターへの道 by machosuke | 【完全無料】無料の動画編集ソフトダビンチリゾルブでできること20選 \| YouTube、TikTokも副業もこれで完璧 \| DaVinci Resolve動画編集 |
| 8M8krdtlq2A | below_min_score_or_cutoff | 25 | kaikei | 中小企業診断士 | アクセルチャンネル | 【勉強法】中小企業診断士合格者が語る一次試験一発合格のための勉強方法 |
| ZFKPZpnOCbE | below_min_score_or_cutoff | 25 | kaikei | 中小企業診断士 | まとめシート流！絶対合格チャンネル 【資格試験・中小企業診断士試験対策】 | 【中小企業診断士】診断士とは（2025年度受験生必見　中小企業診断士って何？）_第311回 |
| POPudLaRL2I | below_min_score_or_cutoff | 25 | kaikei | 中小企業診断士 | ほらっちチャンネル | これ一本でわかる！中小企業診断士試験『第1-2次試験の科目概要』 |
| NYVFnk2B9d4 | below_min_score_or_cutoff | 25 | kaikei | FP | みきてぃーのFP2級試験対策講座 | 【直前対策】2025年1月試験 FP2級 全範囲総復習 |
| ePB2hzvqgpw | below_min_score_or_cutoff | 25 | kaikei | 中小企業診断士 | 会社の数字ラボ | 【中小企業診断士】1次試験を361時間の学習で合格する具体的方法 |
| 38KjzOWGw4s | below_min_score_or_cutoff | 25 | english | ビジネス英語 | NAOMI CHANNEL WORLD - 英会話・ビジネス英語・アメリカ情報 | 【PART2】超重要 ビジネス英語会議表現30選！ネイティブが毎日使うビジネス英語シリーズ ミーティング編 オンライン会議でも活用出来る！ |
| YXp8md5VRXk | below_min_score_or_cutoff | 25 | kaikei | 中小企業診断士 | まとめシート流！絶対合格チャンネル 【資格試験・中小企業診断士試験対策】 | 【中小企業診断士】まずここを押さえて！運営管理の最重要ポイントは？_第277回 |
| wLhaxhYxxps | below_min_score_or_cutoff | 25 | kaikei | 中小企業診断士 | 資格合格パートナー スタディング - スマホで学べるオンライン通信資格講座 | 中小企業診断士 短期間で合格する勉強法４ |
| T06i2jfH7c8 | below_min_score_or_cutoff | 25 | kaikei | FP | みきてぃーのFP2級試験対策講座 | 【直前対策】2025年5月試験 FP2級 厳選80問 |
| JDdC0k6MSIE | below_min_score_or_cutoff | 25 | kaikei | FP | みきてぃーのFP2級試験対策講座 | 【直前対策】2025年1月試験 FP2級 神問題50問 |
| K2cJofUJVO8 | below_min_score_or_cutoff | 24 | data | 統計 | 予備校のノリで学ぶ「大学の数学・物理」 | 中学数学からはじめる確率統計 |
| hAmZpHZnp5s | below_min_score_or_cutoff | 24 | money | 家計 | 節約主婦mari | 【お金を貯めたい人へ】貯まる人の特徴4選！真似してみよう/節約/家計簿 |
| kZakG8UPZaY | below_min_score_or_cutoff | 24 | prog | インフラ | だれでもエンジニア / 山浦清透 | IT用語66選！エンジニアリングの基本をこの動画1本で！【非エンジニア必見】 |
| vfqXnXkDyPM | below_min_score_or_cutoff | 24 | money | 家計 | あれもこれもん | 【お金を貯める方法】私が成功した貯金方法3選｜貯金が増える仕組み｜真似すれば絶対貯まる！｜貯金をする習慣作り【無理をしない貯金術】 |
| -0Z27HpPQVQ | below_min_score_or_cutoff | 24 | english | ビジネス英語 | 英語聞き流し \| Sakura English | ビジネス英語フレーズ リスニング 聞き流し 英会話【064】 |
| r5w-bqTWAws | below_min_score_or_cutoff | 24 | shikaku | 宅建 | あーこ不動産@岐阜 | 【宅建】知識ゼロ、独学5ヶ月で一発合格した勉強方法 |
| raQE9zUNcs4 | below_min_score_or_cutoff | 24 | english | 発音 | 『あいうえおフォニックス』英語発音 | 英語を習うならまずこれ！ ローマ字読みしないで最短距離で英語の発音をマスターしよう！フォニックス（英語を習う時一番最初に覚えたいこと） [#332] |
| -lxUl3J3BXE | below_min_score_or_cutoff | 24 | shikaku | IT | 実践の鬼:IT学校さいとうさん | 【問題演習付き】科目Bアルゴリズムはこう解け（基本情報技術者試験） |
| HqvcmkFjVnw | below_min_score_or_cutoff | 24 | prog | インフラ | いまにゅのAIプログラミング塾 | 【初学者向け】APIを理解したい人がまず最初に見る動画 |
| lZX9TCmhBLI | below_min_score_or_cutoff | 24 | money | 投資 | トウシル [楽天証券] | 【3分でわかる投資信託】ゼロから始める！投資信託（その１：仕組み編） |
| S7bQh6o2aZQ | below_min_score_or_cutoff | 24 | biz | Word | パソコン上達!Nagomiチャンネル | Word【差し込み文書】同じ文書の一部だけをExcelのリストから差し込む方法　Word中級編 |
| BPRuUFYLdZg | below_min_score_or_cutoff | 24 | biz | Word | パソコン上達!Nagomiチャンネル | 文書を作成しよう！【ワード初級編】まずは基本的な操作から始めていきましょう！ |
| 8FE-zuRQqEo | below_min_score_or_cutoff | 24 | marke | SNS | TOM【SNS副業】 | 【副業初心者必見】誰でも１日３万円稼げるアフィリエイト手法【５ステップで実現】 |
| QdVnlvIQbpg | below_min_score_or_cutoff | 24 | video | After Effects | AdobeCreativeStation | 0から分かる！After Effectsで作るボカロMV 前編 \| アドビ公式 |
| sWkk3ZLn67w | below_min_score_or_cutoff | 24 | kaikei | 中小企業診断士 | ほらっちチャンネル | 企業経営理論 経営戦略①【経営理念と経営戦略】中小企業診断士試験対策 |
| dGRgMGYvW3g | below_min_score_or_cutoff | 24 | video | デザイン | あれくり | 【スマホで簡単】3分で分かる！サムネイルの作り方〜基本編〜 （無料アプリPhonto） |
| XzIFZLtm6is | below_min_score_or_cutoff | 24 | english | 発音 | 英語発音専門ドクターDイングリッシュ | 【英語女子必見】女性の英語声の出し方〜喉を開いてトーンを落とす |
| 8S_SumDaCts | below_min_score_or_cutoff | 24 | ai | Copilot | Microsoft 365 Japan | 【Copilot for Microsoft 365】Copilot はじめました。- 営業職 篇 |
| RUNFw--mutA | below_min_score_or_cutoff | 24 | kaikei | 中小企業診断士 | ほらっちチャンネル | 【中小企業診断士試験】短期合格を果たす！ 学習の指針 （独学者の方へ） |
| xW9-8dq9TaA | below_min_score_or_cutoff | 24 | data | Excel | オデッセイコミュニケーションズ公式YouTubeチャンネル「Odysseymedia」 | 【エクセルで統計分析】売り上げに影響を与える要因を見つける！（回帰分析） |
| 0dMPvW2xi4g | below_min_score_or_cutoff | 24 | shikaku | IT | ITパスポート【爆速合格】 | 【今すぐやめて】ITパスポートで不合格になる人の特徴を紹介します |
| 2NG-pC1f5AQ | below_min_score_or_cutoff | 24 | video | CapCut | JEMMA's style. / じぇますた。 | スマホ動画編集アプリCapcutの簡単な基本操作方法【Edit with me】 |
| kUe5cqITVuQ | below_min_score_or_cutoff | 24 | kaikei | 中小企業診断士 | まとめシート流！絶対合格チャンネル 【資格試験・中小企業診断士試験対策】 | 【中小企業診断士】これから勉強を始める方必見！おすすめ教材や勉強の順番教えます_第226回 |
| qd7XuZYKMHU | below_min_score_or_cutoff | 24 | shikaku | IT | 資格100個取ろうぜ!【100とろ】 | 1日1時間の勉強でITパスポート合格した勉強法‥！ |
| Ov0HOTKRAWU | below_min_score_or_cutoff | 24 | kaikei | 簿記 | ぐーにー | 【祝合格！】日商簿記２級に3ヶ月で96点合格した勉強方法｜第二章完結 |
| JpBLZRoHjHA | below_min_score_or_cutoff | 24 | biz | 資料作成 | cooker8 by 明治クッカー | 【上司からも高評価】プレゼン資料作成の極意。手順とルールを守れば、誰でも作れます。コンサルタントの秘密の仕事術。 |
| GeGyU7KcpCA | below_min_score_or_cutoff | 24 | data | Excel | ユースフル / 実務変革のプロ | 【Excel×Copilot】集計と分析が一瞬で終わる技３選 |
| rMx0r5zHzLQ | below_min_score_or_cutoff | 24 | shikaku | IT | やるかやられるかチャンネル | 【基本情報】午後問題の勉強はこう進めてください！！ |
| idxwEU930b0 | below_min_score_or_cutoff | 24 | prog | Git | InomaCreate | 【Git】【VSCode】面倒なコマンドは不要です！ VisualStudioCodeでのGit操作方法 |
| KVhqrE05WkA | below_min_score_or_cutoff | 24 | ai | プロンプト | Joichi Ito | GPTでプログラミングの未来を切り拓く！Promptエンジニアリングとは？ |
| BHR77bcW4IM | below_min_score_or_cutoff | 24 | ai | Gemini | Android・iPhone使い方教室 - webmobile | 「スマホとしゃべろう！」Gemini AIとGoogleアシスタントを併用するとめちゃ楽しい！【Android】 |
| ycGgvDVs2Lw | below_min_score_or_cutoff | 24 | data | BI | ソフゾウのデータ分析のお部屋 | Power BIのメリット10選　～脱Excel・Power Pointへの導き～ |
| AF_eZY8LnmA | below_min_score_or_cutoff | 24 | video | After Effects | 斉藤裕也 / Saito Yuya【映像制作】 | After Effectsを6年間独学するとこうなる。 |
| pm4OdAOlP70 | below_min_score_or_cutoff | 24 | prog | SQL | キノコード / プログラミング学習チャンネル | Oracle Databaseとは？｜Oracle Databaseとは何か、特徴などを3分でわかりやすく解説します【データベース初心者向け】 |
| Ex3IPoIXJEk | below_min_score_or_cutoff | 24 | kaikei | 中小企業診断士 | まとめシート流！絶対合格チャンネル 【資格試験・中小企業診断士試験対策】 | 【決定版】事例Ⅰはこのトレーニングで攻略すべし！無料ツールも公開【中小企業診断士】_第180回 |
| 0V268lmXxOo | below_min_score_or_cutoff | 24 | english | ビジネス英語 | NAOMI CHANNEL WORLD - 英会話・ビジネス英語・アメリカ情報 | 【最新!】ビジネス英語メールフレーズ100選リピート練習PART1(フレーズ１～５０) ネイティブビジネス英語聞き流し、通勤通学や作業中に便利！ |
| QNXM9Fu1bHQ | below_min_score_or_cutoff | 24 | biz | プレゼン | マナビジネス【コンサル仕事術】 | 【10分でスキルアップ】資料作成簡単フレームワーク～通る資料3つのポイント |
| RaN5A73knT8 | below_min_score_or_cutoff | 24 | prog | インフラ | ねっとびTV【ネットワークエンジニアch】 | 【インフラエンジニアが教える】ネットワーク構築講座#0「導入編」 |
| 1UtzICMcgDw | below_min_score_or_cutoff | 24 | shikaku | IT | SEプラス IT教育チャンネル【公式】 | 【IT資格】新・基本情報技術者試験！科目A免除制度は絶対活用するべき？！科目B対策に集中して確実に合格を勝ち取る方法 |
| N8opuav1IM8 | below_min_score_or_cutoff | 24 | english | ビジネス英語 | ビジネス英語コーチHika | 【衝撃】40代英語力ゼロで外資系企業に転職！超効率的な英語学習法とは！？ |
| qL8nng9GZes | below_min_score_or_cutoff | 24 | prog | SQL | キノコード / プログラミング学習チャンネル | データベースの種類にはどんなものがあるのか？｜図解を使って3分でわかりやすく解説します【データベース初心者向け】 |
| WGfCv4HFRiI | below_min_score_or_cutoff | 24 | shikaku | IT | 聞くだけ資格マスターズ | 【2026最新版】ITパスポート｜ストラテジ系まとめ｜シラバス6.5対応・聞き流しで学べる |
| UHCLuwJOclk | below_min_score_or_cutoff | 24 | prog | SQL | エンジニア転職チャンネル【RUNTEQ公式】 | 【エンジニア転職】誰でも絶対に身につくSQLの学習方法 |
| Po1565UmpSc | below_min_score_or_cutoff | 24 | money | 投資 | ZAi探の解説動画チャンネル | インデックス投資とは何か？わかりやすく解説【株式投資】 |
| 6LzuTMqPz2U | below_min_score_or_cutoff | 24 | video | デザイン | 僵尸パア | 【サムネイルデザイン】制作実績100件超えのVtuberのサムネイル制作の流れと考え方【僵尸パア】 |
| vquQ0cOXSN4 | below_min_score_or_cutoff | 23 | english | 発音 | バイリンガル リサティー英会話 | 【 毎日5分のフォニックストレーニング 】アルファベットA to Z for kids & partents |
| 6pwSNyEFp5o | below_min_score_or_cutoff | 23 | biz | プレゼン | マコなり社長 | 誰でもプレゼンが見違えるほど上手くなるたった一つのコツ |
| 3gbUjPtnoe0 | below_min_score_or_cutoff | 23 | kaikei | 簿記 | 【簿記・会計】公認会計士たぬ吉の資格塾 | 日商簿記2級はなぜ難しいのか？その意外な攻略法とは |
| m0ee-BU8pTE | below_min_score_or_cutoff | 23 | marke | Webマーケ | 両学長 リベラルアーツ大学 | 【副業成功への高速道路】副業で月5万稼ぐために「Webマーケティング」が超オススメな5つの理由【リベ大公式切り抜き】 |
| lhUsi6TUQy0 | below_min_score_or_cutoff | 23 | shikaku | IT | 【基本情報技術者試験YouTuber】すーさん | 【A試験_データベース】01. データベースの基本\| 基本情報技術者試験 |
| wSvuZUj18u8 | below_min_score_or_cutoff | 23 | shikaku | IT | 【基本情報技術者試験YouTuber】すーさん | 【A試験_ソフトウェア】01. 基本ソフトウェア（OS）\| 基本情報技術者試験 |
| NDkPG4k6rWY | below_min_score_or_cutoff | 23 | marke | SNS | 両学長 リベラルアーツ大学 | 【断言】Xで話題の「資産運用EXPO」をおすすめしないワケ【リベ大公式切り抜き】 |
| c8kcaqDc_pU | below_min_score_or_cutoff | 23 | data | Excel | オデッセイコミュニケーションズ公式YouTubeチャンネル「Odysseymedia」 | ビジネス統計スペシャリストで学べるExcel統計分析（8月26日実施セミナー） |
| 2cqc1CZDQTs | below_min_score_or_cutoff | 23 | shikaku | 宅建 | マジでイケてる宅建講座【ゆーき大学】 | 【宅建】一発合格者に聞いた！初学者に必要な参考書・テキスト・問題集はこの３冊です（ゆーき大学のおすすめ） |
| 7LKv4Vbbdro | below_min_score_or_cutoff | 23 | biz | 資料作成 | ゼロからパソコン | 【使わないのはもったいない！】パワーポイントでできること♪【ゼロからパソコン】 |
| nU7QIbu-gWw | below_min_score_or_cutoff | 23 | data | 統計 | スタビジ【誰でもAIデータサイエンス】byウマたん | 【5分で分かる】T検定を理解してビジネスシーンに取り入れよう！！ |
| 5DUXdmoVAGA | below_min_score_or_cutoff | 23 | shikaku | IT | ITすきま教室【ITパスポート.基本情報技術者試験.高校情報】 | 基本情報技術者試験📝受験前に知りたいテスト形式 |
| wE9w-WwnpiQ | below_min_score_or_cutoff | 23 | shikaku | AI検定 | スタビジ【誰でもAIデータサイエンス】byウマたん | 【5分で分かる】G検定に合格するための勉強方法！ |
| O8FWIWTXYQw | below_min_score_or_cutoff | 23 | prog | Git | ともすた \| たにぐち まこと | Visual Studio Codeで学ぶ Git + GitHub |
| bWClu9Q6XDo | below_min_score_or_cutoff | 23 | kaikei | 中小企業診断士 | ほらっちチャンネル | 【中小企業診断士試験】『1.5年合格プラン』学習の指針 （独学者の方へ） |
| jY31pVGLwFY | below_min_score_or_cutoff | 23 | kaikei | 中小企業診断士 | ほらっちチャンネル | 【中小企業診断士資格ガイダンス】➀試験制度の概要と１次試験の学習指針 |
| jCajk34i_fk | below_min_score_or_cutoff | 23 | prog | JavaScript | SAMURAI ENGINEER [侍エンジニア] | JavaScriptとは？特徴や将来性から合わせて学ぶべきスキルをわかりやすく紹介 |
| mYOAY-xF5wk | below_min_score_or_cutoff | 23 | prog | SQL | 徳田 啓【プログラミング学習チャンネル】 | データベースとは？【分かりやすい解説シリーズ #5】【プログラミング】 |
| V55dJ1UXV_E | below_min_score_or_cutoff | 23 | kaikei | 簿記 | ボキいろは【スマホだけで学べる簿記講座】 | 第1回 簿記とは？～簿記の基本について～【日商簿記3級】 |
| UR4o9VcGCGs | below_min_score_or_cutoff | 23 | kaikei | 中小企業診断士 | ほらっちチャンネル | 独学者の方へ(2) 財務・会計の学習方針【中小企業診断士資格ガイダンス】 |
| ODngv89ra4I | below_min_score_or_cutoff | 23 | prog | SQL | キノコード / プログラミング学習チャンネル | SQLとは？｜データベース言語のSQLについて、できることなど含めて3分でわかりやすく解説 |
| jn-bwCv2ql8 | below_min_score_or_cutoff | 23 | ai | Copilot | Microsoft 365 Japan | 【Copilot for Microsoft 365】Copilot はじめました。- マーケティング職 篇 |
| 2JTiaZq5oHs | below_min_score_or_cutoff | 23 | data | Excel | PC活用ちゃんねる | 【Excel】クイック分析ツールの使い方｜少しだけ作業が速くなるかも |
| vK_Pze9Cj-4 | below_min_score_or_cutoff | 23 | kaikei | 税理士 | SKYの税理士試験受験対策チャンネル | [税理士試験]明日から実践!! 1発合格するための5つの秘訣～簿記論編 |
| KR485TQznBA | below_min_score_or_cutoff | 23 | kaikei | 税理士 | 【公式】資格の大原 税理士 | 25【教室講義】簿記論 初学者一発合格コース（第1講） |
| xyv1qBG_zkQ | below_min_score_or_cutoff | 23 | shikaku | IT | ITパスポート【爆速合格】 | 【初学者必見】ITパスポートに1週間で合格するために最初にやってほしいこと |
| Vf8yxtXJXTo | below_min_score_or_cutoff | 23 | prog | SQL | ストハピストレートハッピー | Accessを使って、SQLを学習しよう。その１（とりあえずSQLを使って全件表示してみる） |
| HG94ZsIPzSQ | below_min_score_or_cutoff | 23 | kaikei | 中小企業診断士 | ほらっちチャンネル | 『学習効率アップ↑↑15のテクニック』中小企業診断士試験対策 |
| s0DOU-zlyw0 | below_min_score_or_cutoff | 23 | kaikei | 中小企業診断士 | ほらっちチャンネル | 独学者の方へ(3) 学習の進め方FAQ～初学者向け 1次試験対策編～【中小企業診断士資格ガイダンス】 |
| FNHYcmZjB9U | below_min_score_or_cutoff | 22 | prog | インフラ | ひろゆき実況Y【切り抜き】 | Webエンジニアの給料や年収どれくらいか知ってるの？未経験で転職したい人はよく考えろ【ひろゆき切り抜き 論破 プログラミング SE】 |
| J85usROCWVI | below_min_score_or_cutoff | 22 | prog | SQL | こいこいの人工知能研究室 | SQLを鬼神の如く練習する方法 |
| Jdr-vU9zotU | below_min_score_or_cutoff | 22 | prog | SQL | ITすきま教室【ITパスポート.基本情報技術者試験.高校情報】 | SQL（基本編その１）／基本情報技術者 |
| y0g7OuJpTno | below_min_score_or_cutoff | 22 | data | 統計 | 田中嘉博 | P値と帰無仮説について専門用語も数式も使わずにざっくりとしたイメージを説明してしまう動画 |
| LGc6UvMF4zw | below_min_score_or_cutoff | 22 | kaikei | 簿記 | 主婦の逆襲 | 【簿記2級を4ヶ月で合格】学歴なくても大丈夫でした |
| Hj3kVVSyZ-U | below_min_score_or_cutoff | 22 | marke | SEO | スタビジ【誰でもAIデータサイエンス】byウマたん | 【5分で分かる】SEOの基本についてアニメーションで簡単に理解しよう！ |
| H-SQdG3TT0k | below_min_score_or_cutoff | 22 | kaikei | 税理士 | 税理士YouTubeスクール【ビジネスとまなび】 | 【税理士試験「簿記論」、簿記1級】税理士が比較してみた！簿記論合格だけでも履歴書に書ける？ |
| bWr3gmJl_C4 | below_min_score_or_cutoff | 22 | shikaku | IT | やるかやられるかチャンネル | 【基本情報技術者試験】あなたにおすすめの科目B参考書はこれ！【2023年新課程対応】 |
| 0c5Le3jfRUY | below_min_score_or_cutoff | 22 | kaikei | 簿記 | CPAラーニング | 経理部で働きたい方へ！簿記の資格取得後の勉強方法はコレだ！ |
| cXQj6Dwd2cI | below_min_score_or_cutoff | 22 | prog | SQL | ITを分かりやすく解説【基本情報技術者試験・ITパスポート・プログラミング講座】 | 【データベース】ストアドプロシージャとは |
| lZle6kMIWYY | below_min_score_or_cutoff | 22 | video | DaVinci | 動画クリエイターへの道 by machosuke | 【最新】日本語がない？ DaVinci Resolve 18 日本語設定の方法 |
| IFGZInADZ3A | below_min_score_or_cutoff | 21 | english | ビジネス英語 | NAOMI CHANNEL WORLD - 英会話・ビジネス英語・アメリカ情報 | ビジネス英語メールの書き方！ 絶対に使える、あるあるメール英語表現ご紹介 |
| v-8bzwR14xk | channel_cap | 31 | video | Premiere Pro | Mappy Photo | 【PremierePro入門講座#3】超初心者向け動画編集カットの仕方「基本とショートカット設定」 |
| CO3JpQAV8xs | channel_cap | 31 | video | デザイン | Mappy Photo | 【Photoshop超初心者向け】YouTubeサムネイルの作り方【全手順完全解説】 |
| NmSUp4Gezc8 | channel_cap | 30 | ai | Copilot | ひかりのAI大学 | 【2026年最新版】Excelとも神連携！本当に使えるCopilot活用法10選【完全攻略】 |
| J_dHTj2zLwA | channel_cap | 30 | english | ビジネス英語 | PIVOT 公式チャンネル | 【英語のアウトプットを自動化せよ】英語学習をしても話せない理由とは？英語学習をやり尽くした元商社マンが解説／会話力向上に不可欠な要素とは／英語脳の作り方／英語を自動化するトレーニングを実践 |
| eP52oOPi5jk | channel_cap | 30 | ai | 自動化 | AIでサボろうチャンネル | 【2025年秋最新版】作業効率をぐーんと上げる神AIツール6選と実際の使い方を解説 |
| rDjOYUoYvIQ | channel_cap | 30 | ai | Copilot | 【さき】のAIでええやん。 | 【必見】試してマジで使えたCopilotの基礎と神活用を徹底解説するで！ |
| -fIA26XsxIw | channel_cap | 30 | ai | ChatGPT | 【さき】のAIでええやん。 | 【脱初心者】ChatGPTの超最新機能と基礎を全部徹底的に解説するで！ |
| 04-gHbPa2Js | channel_cap | 30 | ai | Claude | mikimiki web スクール | 【初心者さん🔰】2026年最新！「Claude」の使い方/活用法をわかりやすく解説！(資料・プロンプト付き) |
| bekqvm_Hfsw | channel_cap | 29 | money | NISA | コアラ先生の時事ネタ祭り | 【アニメで解説】初心者でもわかるiDeCo(イデコ)の始め方～実践編～ |
| PRwIwCgEbGI | channel_cap | 29 | ai | Gemini | mikimiki web スクール | 【超便利‼️】Google最強AI「Gemini」の㊙️神機能7選！めちゃくちゃ便利なので徹底解説 |
| iVdSpq4lle4 | channel_cap | 29 | money | NISA | BANK ACADEMY / バンクアカデミー | 【2026年からでも間に合う】新NISAの始め方を世界一やさしく解説！おすすめ銘柄や手続きの流れも総まとめ |
| JGW8kh9YkEg | channel_cap | 29 | money | NISA | BANK ACADEMY / バンクアカデミー | 【決定版】50代・60代の新NISAのやさしい始め方！おすすめ銘柄や出口戦略も初心者向けに解説 |
| AoGmv8ljC0Y | channel_cap | 29 | prog | SQL | Pythonプログラミング VTuber サプー | 【SQL入門】PostgreSQLでデータベース操作を学ぼう！〜 初心者向け 〜 |
| SymrYLHxw0s | channel_cap | 29 | ai | Claude | AIでサボろうチャンネル | 【超効率化】Claude Code Webの使い方と執筆AIの育て方を解説 |
| hDp9eVqs1-w | channel_cap | 29 | shikaku | 宅建 | 棚田行政書士の不動産大学【公式チャンネル・宅建】 | 【最新：宅建おすすめ参考書７選】こんなに違う！令和８年宅建試験の合格を目指す方へ、おすすめの参考書、テキスト、問題集を初心者向けに解説講義。 |
| qY8mmhQAmB4 | channel_cap | 29 | ai | Gemini | mikimiki web スクール | 【もう使える】Google AIエージェント「Gemini Spark」爆誕！使い方・活用法を分かりやすく解説します |
| B8WnCAOcheM | channel_cap | 28 | prog | Python | Pythonプログラミング VTuber サプー | 【VSCode】無料エディターのVSCodeをPythonコーディング用にカスタマイズしよう！〜初心者向け〜 |
| a1VE2ZxsZPE | channel_cap | 28 | money | 投資 | コアラ先生の時事ネタ祭り | 【完全図解】投資信託ってどんな仕組み？ETFとの違いは？新NISA必須知識！ |
| E-9w7p6hVbs | channel_cap | 28 | money | 投資 | コアラ先生の時事ネタ祭り | 【アニメで解説】株式投資初心者が最初にやるべき「インデックス投資」とは？ |
| cwHITZn23d4 | channel_cap | 28 | ai | Claude | 【さき】のAIでええやん。 | 【初心者】ゼロからClaude Codeで自分専用のAIチームを作って仕事自動化する方法を紹介するで！ |
| cjsPrLZCkpQ | channel_cap | 28 | ai | 画像生成 | 【さき】のAIでええやん。 | 【超実用的】Geminiの画像生成AI機能ナノバナナの神活用14選徹底解説するで！【nanobanana・Google】 |
| fZD2IlRGBTI | channel_cap | 28 | ai | Claude | ひかりのAI大学 | 【有料級】Claudeの使い方がわからない人、これで全部解決します【Anthropic Academy】 |
| _VhCei1_zp4 | kaikei_upper_qualification_cap | 28 | kaikei | 税理士 | 簿記3級＆2級をやさしく解説 | 【税理士試験】50代完全独学で簿記論合格した勉強法。 |
| sj20pwZwY6Y | deny_title:誰でも | 29 | marke | SNS | 北原孝彦 -給料8万から億越え社長への転生- | 【爆速集客】上手く集客している人は皆コレやってます！誰でもわかる集客の基礎 |
| 4Ha1VyroMtE | deny_title:絶対 | 29 | marke | SNS | さき-インスタの大学 | 【絶対イマ見て！】リールの時代からフィードの時代が来たので解説します。 |
| 1ttDCCHLTb0 | deny_title:絶対 | 28 | prog | Git | エンジニア転職チャンネル【RUNTEQ公式】 | 【絶対につまづく】1週間でGit完全マスター！ |
| sQR4VCyMc6o | deny_title:絶対 | 28 | shikaku | 宅建 | 棚田行政書士の不動産大学【公式チャンネル・宅建】 | 【宅建に合格するなら、絶対守るべき３つのポイント】宅建受験生必見！これを守れば合格に近づく勉強のコツを初心者向けに解説講義。 |
| HEhDNoklIT0 | below_min_score_or_cutoff | 31 | biz | Excel | 金子晃之 | Excelの使い方・初心者入門講座【完全版】 |
| 46018ZWM2uU | below_min_score_or_cutoff | 31 | biz | Word | 金子晃之 | Wordの使い方・初心者入門講座【完全版】 |
| DdKSvzLkQVA | below_min_score_or_cutoff | 31 | biz | 資料作成 | 金子晃之 | PowerPoint使い方・初心者入門講座【完全版】 |
| jinblWaG778 | below_min_score_or_cutoff | 31 | biz | Word | 金子晃之 | Wordの使い方・脱初心者初級編【完全版】 |
| HyU3XL2F9GE | below_min_score_or_cutoff | 30 | prog | Python | キノコード / プログラミング学習チャンネル | Python超入門コース 合併版｜Pythonの超基本的な部分をたった1時間で学べます【プログラミング初心者向け入門講座】 |
| QCjFPSO96RU | below_min_score_or_cutoff | 30 | prog | JavaScript | セイト先生 by AIプログラミングスクールSiiD | 【JavaScript超入門講座】わずか50分で知識ゼロから基礎をマスター！ |
| UmpmxDepAZo | below_min_score_or_cutoff | 30 | biz | 資料作成 | 金子晃之 | PowerPointの使い方・脱初心者初級編【完全版】 |
| pnsieVYy72M | below_min_score_or_cutoff | 30 | prog | JavaScript | しまぶーのIT大学 | 【基礎から学ぶ JavaScript 入門 #1】フロントエンド開発でJavaScriptが必要な理由を解説！【ヤフー出身エンジニアが教える初心者向けプログラミング講座】 |
| jppnWu6am3Q | below_min_score_or_cutoff | 30 | data | Excel | ユースフル / 実務変革のプロ | 【Excelの次はAccessだ】アクセス使い方入門講座「データベース・テーブル・クエリ・リレーションシップ・主キー」の基礎知識 |
| tBQaAHHGEtM | below_min_score_or_cutoff | 30 | english | 英会話 | Aira's English | 【初心者】英会話何から始めたらいい？英語学習ロードマップ(5ステップ) |
| QVl7njtsFZM | below_min_score_or_cutoff | 30 | prog | Python | Python・データサイエンス入門チャンネル -はやたす- | 【初心者向け】Pythonの独学完全ロードマップ【3ステップで解説】 |
| vyHJlDs1sus | below_min_score_or_cutoff | 29 | biz | Excel | 金子晃之 | Excel データベース一覧表の入門・作成講座 |
| WCrOcq08bwY | below_min_score_or_cutoff | 29 | biz | Excel | 金子晃之 | ExcelVBA・マクロ・初心者入門講座【完全版】 |
| FUsAoaI8QFg | below_min_score_or_cutoff | 29 | english | 発音 | サマー先生と英会話！ | 日本語にない６つの英語の母音！《サマー先生の英語発音講座#31》 |
| Uk4CxZZ_yjU | below_min_score_or_cutoff | 29 | data | Excel | パソコン上達!Nagomiチャンネル | エクセル初心者 【簡単な表作成】　まずは表の基本操作を身につけよう！　基礎から始めるExcel |
| fAluwAmHrws | below_min_score_or_cutoff | 29 | prog | JavaScript | セイト先生 by AIプログラミングスクールSiiD | 【JavaScript超入門講座】基礎文法だけでクイズゲームのアプリを開発！ |
| v-Mb2voyTbc | below_min_score_or_cutoff | 29 | prog | SQL | だれでもエンジニア / 山浦清透 | 【SQL入門講座 合併版】SQLの基本をたった1時間で学べます【初心者向けデータベース入門】 |
| E08jeQBa1D0 | below_min_score_or_cutoff | 29 | prog | JavaScript | だれでもエンジニア / 山浦清透 | JavaScriptの「基礎」が1時間で分かる「超」入門講座【初心者向け】 |
| OEw1EFhpjY4 | below_min_score_or_cutoff | 29 | biz | 資料作成 | パワポデザイン大学 | パワーポイントの使い方！超初心者向け基本操作について解説【パワポデザイン】 |
| kBKn5IkH06A | below_min_score_or_cutoff | 29 | prog | Python | セイト先生 by AIプログラミングスクールSiiD | 【Python超入門講座】この動画1本でゼロから基礎をマスター！【初心者向け】 |
| c6DuvLPzjrg | below_min_score_or_cutoff | 29 | biz | Word | くませんのパソコンクラブ | 【パソコン入門】１０分でわかる！パソコン用語と基本操作【初心者向け】 |
| 0fqRcWP0wOc | below_min_score_or_cutoff | 29 | data | 統計 | 高校数学が面白いほどわかる | 正規分布と標準化の意味が完全にわかる【統計的な推測が面白いほどわかる】 |
| Wgo5rrrfrew | below_min_score_or_cutoff | 29 | data | Excel | PC活用ちゃんねる | 【Excel】パワークエリの使い方入門(生産性爆上げ機能) |
| rUXkeyTJ02g | below_min_score_or_cutoff | 29 | biz | プレゼン | パワポデザイン大学 | パワーポイントの使い方！【必見】超初心者でも絶対に知っておきたいパワポのすごい機能10選について解説【パワポデザイン】 |
| 3v9q1FGc-wk | below_min_score_or_cutoff | 29 | data | Excel | セイヤのIT講座 | 【Excel】たった10分でわかるピボットテーブル入門【初心者向け】 |
| F-QjKc4aEIw | below_min_score_or_cutoff | 29 | prog | Web開発 | Pythonプログラミング VTuber サプー | 【Pythonプログラミング入門】自作のデスクトップアプリを作る！Tkinterで簡単！〜VTuberと学習〜 【初心者向け】 |
| 5U0nAojNQS0 | below_min_score_or_cutoff | 29 | prog | JavaScript | しまぶーのIT大学 | 【基礎から学ぶ JavaScript 入門 #2】Twitterを例にJavaScriptがどんな働きをするのか理解しよう【ヤフー出身エンジニアが教える初心者向けプログラミング講座】 |
| 1l8oBEown8c | below_min_score_or_cutoff | 29 | prog | Git | セイト先生 by AIプログラミングスクールSiiD | Gitとは？GitHubとは？10分で仕組み・使い方を解説！【超入門編】 |
| Lc2K3ctoRAA | below_min_score_or_cutoff | 29 | biz | Excel | ユースフル / 実務変革のプロ | 【やさしいエクセルの教科書】パソコン初心者もご安心ください「Excelの使い方」入門講座 |
| 6MG-qGgLfUU | below_min_score_or_cutoff | 29 | biz | プレゼン | マナビジネス【コンサル仕事術】 | 【超入門】プレゼン初心者のためのプレゼンスライドの作り方 |
| 69FE07KnL7Y | below_min_score_or_cutoff | 29 | prog | Git | TechAcademy [テックアカデミー] | 【プログラミング超入門】GitHubの使い方｜初心者向けにアカウント登録から解説！ |
| 4lGeZBMlMIg | below_min_score_or_cutoff | 29 | biz | Word | PC活用ちゃんねる | Wordの使い方＜基礎がわかる！初心者・入門編＞ |
| 5o8xNhSb0JA | below_min_score_or_cutoff | 29 | marke | Webマーケ | 本橋へいすけ \| ポジティブ心理学研究室 | 【独学で習得】初心者でも分かるマーケティング基礎講座【３Ｃ分析】 |
| pmZhG3LGRXA | below_min_score_or_cutoff | 29 | prog | SQL | キノコード / プログラミング学習チャンネル | 【SQL超入門講座】01.コース紹介 ~ SQLとは？ ~  環境構築｜初心者向け |
| LSZTGINL46E | below_min_score_or_cutoff | 29 | biz | Word | よこやま良平・パソコン・プログラミング予備校 | ワードの使い方 完全図解【2022年保存版】初心者でもわかるWindowsのWord入門【完全版】 |
| y3oM-WTC1q8 | below_min_score_or_cutoff | 29 | data | Excel | ユースフル / 実務変革のプロ | 【入門編】初心者のためのExcel「ピボットテーブル＆データベース」の基本的な使い方 |
| Fikn5kn1NI4 | below_min_score_or_cutoff | 29 | english | 英会話 | 45歳で英語を身につける「英会話RyuTube」 | 【英語の勉強】初心者から日常英会話習得までのロードマップを話します |
| CkHUxGQ_h1s | below_min_score_or_cutoff | 28 | english | 発音 | マーシーの英単語 | いちばん最初に覚える英単語600(🇯🇵日→🇺🇸英)☆初心者向け英単語集 英語リスニング リズム英単語 |
| yeZ3STy3k44 | below_min_score_or_cutoff | 28 | prog | Python | いまにゅのAIプログラミング塾 | 【完全版】この動画1本でPythonの基礎を習得！忙しい人のための速習コース（Python入門） |
| Bj8fkq533Dc | below_min_score_or_cutoff | 28 | data | 統計 | 予備校のノリで学ぶ「大学の数学・物理」 | 【大学数学】推定・検定入門①(母集団と標本)/全9講【確率統計】 |
| XWtDZN2G3Ns | below_min_score_or_cutoff | 28 | biz | Word | 金子晃之 | Wordの使い方・中級編【完全版】 |
| XyMSoewhS3s | below_min_score_or_cutoff | 28 | english | 発音 | サマー先生と英会話！ | ｢Th」の発音の完全版！ちょっとしたコツでマスターできます！《サマー先生の英語発音講座#22》 |
| aYbUDGn61cU | below_min_score_or_cutoff | 28 | prog | インフラ | ウズウズカレッジ l デジタル（IT・DX）分野のリスキリング就職 | 【CCNA合格講座】ゼロから学べるネットワーク講座！クーポンは概要欄から |
| AfweV12r_FE | below_min_score_or_cutoff | 28 | prog | JavaScript | Akichun★PG | プログラミング講座 第３回【JavaScriptの書き方】Akichon/あきちょん |
| emNfRkNTviU | below_min_score_or_cutoff | 28 | data | 統計 | 統計チャンネル | 統計[01/50] 変数の分類【統計学の基礎】 |
| Mfd_4XROoL0 | below_min_score_or_cutoff | 28 | data | BI | ITツール学習 | 【入門】PowerBI の使い方を徹底解説 【無料ツール】【可視化】【初級者】 |
| gs0l4rsQCGM | below_min_score_or_cutoff | 28 | prog | JavaScript | キノコード / プログラミング学習チャンネル | JavaScript超入門コース 合併版【JavaScriptの超基本的な部分をたった1時間で学べます】【プログラミング初心者向け入門講座】 |
| RtUaI4oETxA | below_min_score_or_cutoff | 28 | data | Excel | PC活用ちゃんねる | 【Excel】ピボットテーブルで集計・分析の基本！使い方を初心者向けに解説 |
| QzpoY92qavg | below_min_score_or_cutoff | 28 | data | Excel | 戸田覚：ガジェット【辛口】点数評価 | Power BI「超入門」8分で誰でも使えるようになる。Excelの次の一手はこれしかないっ！ |
| quFWgEQZQaM | below_min_score_or_cutoff | 28 | data | 統計 | スタビジ【誰でもAIデータサイエンス】byウマたん | 【9分で解説】ビジネスに活かせる統計学の基礎入門講座 |
| LDOR5HfI_sQ | below_min_score_or_cutoff | 28 | prog | Git | せお丸@AI駆動開発 | 【Git入門】Git + Github使い方入門講座🐒Gitの仕組みや使い方を完全解説！パーフェクトGit入門！ |
| kftqAritHyc | below_min_score_or_cutoff | 28 | prog | Git | しまぶーのIT大学 | 【GitHubの使い方入門】GitHub Pagesを使って世界中にサイトを公開しよう！アウトプットこそ学びだ！ |
| CPpRu_AJrW8 | below_min_score_or_cutoff | 28 | prog | Python | せお丸@AI駆動開発 | Python入門講座【最新のPython3対応】🔰初心者向けPython入門パーフェクトガイド |
| zvxYA38yx9o | below_min_score_or_cutoff | 28 | prog | Python | Pythonプログラミング VTuber サプー | 【Pythonプログラミング入門】クラスの基本を解説！〜VTuberと学習〜 初心者でも必ずわかる!! |
| nbIqlV0X2yQ | below_min_score_or_cutoff | 28 | prog | SQL | いまにゅのAIプログラミング塾 | 【vol.027】Pythonでデータベースを扱ってみよう \| 中学生でもわかるPython入門シリーズ |
| OKIG2FB_5Ak | below_min_score_or_cutoff | 28 | prog | Python | Pythonプログラミング VTuber サプー | 【Pythonプログラミング入門】関数の基本を解説！(def) VTuberと勉強しよう！【初心者 独学用】 |
| vUycY5J2tbA | below_min_score_or_cutoff | 28 | biz | Word | くませんのパソコンクラブ | 【Word入門】ワードの基本操作だけで資料を作ろう_文字入力とデザイン編【パソコン講座】 |
| M_7_EuTroZg | below_min_score_or_cutoff | 28 | prog | Web開発 | フリーランスPM打田裕馬 | 【超入門】初心者向けwebアプリ開発の「手順」まとめ！開発の準備やアプリ設計・プログラミング言語の学び方まで解説 |
| WsenyJ18ykU | below_min_score_or_cutoff | 28 | prog | Python | Pythonプログラミング VTuber サプー | 【Pythonプログラミング入門】JSONを解説！( jsonモジュール ) 〜VTuberと学習〜 【初心者向け】 |
| 6WgcDWcWAUE | below_min_score_or_cutoff | 28 | data | SQL | だれでもエンジニア / 山浦清透 | 小学生でもわかるサブクエリ【SQL講座⑤】 |
| U6xxXoIVd4I | below_min_score_or_cutoff | 28 | prog | SQL | キノコード / プログラミング学習チャンネル | 【SQL超入門講座】08.INNER JOIN/LEFT JOIN｜テーブル同士を結合する方法① |
| b2OjUaGBz7A | below_min_score_or_cutoff | 28 | prog | SQL | だれでもエンジニア / 山浦清透 | 小学生でもわかるSQLの基本【SQL講座①】 |
| ZCt06tXxtFg | below_min_score_or_cutoff | 28 | prog | JavaScript | プログラミングアカデミー | 初心者向けJavaScript入門講座#1【JavaScriptの特徴について】 |
| MqIwK8vtY1c | below_min_score_or_cutoff | 28 | prog | JavaScript | プログラミングアカデミー | 初心者向けJavaScript入門講座#3【基本的なデータ型の紹介】 |
| v32dVYmPeu4 | below_min_score_or_cutoff | 28 | prog | JavaScript | プログラミングアカデミー | 初心者向けJavaScript入門講座#4【JavaScriptの変数と定数について】 |
| EqnBVPCG5g0 | below_min_score_or_cutoff | 27 | english | 英会話 | ライアン鈴木【英語エンタメチャンネル】 | 【全員聞け】25歳から英語を始めてすぐにペラペラになったたった１つの方法 |
| onBaWOjWuNE | below_min_score_or_cutoff | 27 | biz | Excel | 金子晃之 | Excelの使い方・中級者求人編【ネスト、IF関数、VLOOKUP関数、グラフ】 |
| 8Qz5pK2Hyts | below_min_score_or_cutoff | 27 | english | ビジネス英語 | Atsueigo | 【有料級】英語がペラペラになる重要構文30選｜初級編 |
| Y3OGzW9QaJ0 | below_min_score_or_cutoff | 27 | english | TOEIC | Makieigo | 【初級・聞き流し】TOEIC600点目標リスニング フレーズで重要表現が覚えられる！【13】 |
| uCIjxRPf2F8 | below_min_score_or_cutoff | 27 | english | 英会話 | 英語コーチ-イングリッシュおさる | 【初心者向け】英語学習の始め方【３ヶ月で達成できる】 |
| 2TjsRaj_Pqs | below_min_score_or_cutoff | 27 | data | Excel | ExcelドカタCH | ピボットテーブルを使うなら、最初にこの基本ルールを理解しましょう【Excel】【YT0125】 |
| EMJgDP4uEhY | below_min_score_or_cutoff | 27 | english | TOEIC | ブレイクスルー佐々木 | 英語力ゼロから2ヶ月でTOEIC730点取る勉強スケジュール |
| K6Faf0ASUho | below_min_score_or_cutoff | 27 | english | 英会話 | Mayu E Room | ゼロから英語学習を始めたい人へ |
| XfoYeWCzjac | below_min_score_or_cutoff | 27 | prog | Python | キノコード / プログラミング学習チャンネル | Pythonの便利ライブラリ「Pandas入門講座」合併版｜Pandasの基本的なこと3時間で学べます【Python超入門コースの次におすすめの入門講座】 |
| tc8RTtwvd5U | below_min_score_or_cutoff | 27 | data | データサイエンス | 3Blue1BrownJapan | ニューラルネットワークの仕組み \| Chapter 1, 深層学習（ディープラーニング） |
| MRYaJ3sFqUE | below_min_score_or_cutoff | 27 | marke | Webマーケ | 西野亮廣 / Akihiro Nishino | 【西野と学ぶマーケティング】キンコン西野が絶賛する最強マーケター！北の達人・木下勝寿社長が目指す「戦いなき市場」とは？ |
| iLgz4MsCNDE | below_min_score_or_cutoff | 27 | english | ビジネス英語 | PIVOT 公式チャンネル | 【独学でネイティブレベルになれる】海外ドラマ『フレンズ』使った英語学習法／BTSナムジュンも実践／20歳〜始めてもネイティブに／ChatGPTでも学べないこと／PIVOT LEARNING |
| SMVY5mjxD3k | below_min_score_or_cutoff | 27 | marke | Webマーケ | PIVOT 公式チャンネル | 【元P&Gマーケターが大木優紀に熱血授業】明日から使える“最強&最新”マーケティング／本質的フレームワーク「9segs®」活用術／顧客戦略はWHO×WHATで導き出せる(STAR SKILL SET) |
| AMmoTBr1iN8 | below_min_score_or_cutoff | 27 | biz | Word | 金子晃之 | Wordを100倍便利に使えるスタイルの使い方 |
| g0QwdyoO1XU | below_min_score_or_cutoff | 27 | marke | コンテンツ | 学識サロン | マーケティングは学んでおかないと、めちゃくちゃ損します。11分でわかる『ハイパワーマーケティング』 |
| dorfGlYdp0w | below_min_score_or_cutoff | 27 | shikaku | IT | みみスタ | サクッと覚える！「ITパスポート」必修単語300 直前対策 |
| 0G8fg8MxYqo | below_min_score_or_cutoff | 27 | biz | Excel | 金子晃之 | Excel初級講座【第１章まとめ】 |
| q_rw4iH1eZ0 | below_min_score_or_cutoff | 27 | english | ビジネス英語 | PIVOT 公式チャンネル | 【ビジネス英会話の神常識】日常英会話を学ぶのは遠回り／ビジネス会話ならすぐ話せる／ビジネスシーンを頭に入れてから口を開け／英語学習の３つのポイントと誤った神話 |
| PQlhG2m7WcM | below_min_score_or_cutoff | 27 | biz | Excel | ユースフル / 実務変革のプロ | 【20代のためのエクセル術】実務即戦力のExcel16選(部下や後輩へ、最初に覚えさせたい厳選テクニック集) |
| Rt-l5u-u064 | below_min_score_or_cutoff | 27 | english | ビジネス英語 | ビジネス英語聞き流し - Lehman English | 毎日の会議で使いまくる英語133フレーズ！ミーティングの始めから締めまで【オンライン会議対応】 |
| NXHoiNoWXwA | below_min_score_or_cutoff | 27 | marke | Webマーケ | サラタメさん | 【Webマーケティングの極意】ベストセラー本『ファンダメンタルズ×テクニカル マーケティング』をガチで解説してみた。 |
| kp0xEmxhx3g | below_min_score_or_cutoff | 27 | biz | プレゼン | PIVOT 公式チャンネル | 【Copilot活用術 vol.3】実践！調査報告書と社内説明用プレゼン資料をCopilotで作成せよ／まずはアウトラインづくり／ツールの使い分けのポイントは |
| Cs7friXdqdM | below_min_score_or_cutoff | 27 | prog | Python | キノコード / プログラミング学習チャンネル | 【Python超入門コース】03.環境構築 for Windows｜プログラミングをする準備をしよう！【プログラミング初心者向け入門講座】 |
| CJQDh_mJ1as | below_min_score_or_cutoff | 27 | prog | SQL | キノコード / プログラミング学習チャンネル | SQL超入門コース　合併版｜SQLの超基本的な部分をたった2時間半で学べます【SQL初心者向け入門講座】 |
| 1qec0eVEFsY | below_min_score_or_cutoff | 27 | marke | SNS | さき-インスタの大学 | 【世界初公開】AI不要、Canvaだけで自動でリールを作る方法を公開します！ |
| 3_4pTBHFUBA | below_min_score_or_cutoff | 27 | biz | Excel | PC活用ちゃんねる | Excel使い方基礎入門｜先輩に怒られないため最低限覚えること |
| Yg546Zua39A | below_min_score_or_cutoff | 27 | prog | SQL | だれでもエンジニア / 山浦清透 | 小学生でもわかるデータベース設計入門。実際に設計しながら基礎を学ぼう |
| ksuUh-bWkOk | below_min_score_or_cutoff | 27 | marke | SNS | さき-インスタの大学 | 【衝撃解禁】ある方法を取り入れるだけでインスタがバズりやすくなってます。 |
| KkjrhI-2XXc | below_min_score_or_cutoff | 27 | english | ビジネス英語 | NewsPicks /ニューズピックス | 「英語はコスパのいい投資」挫折しないビジネス英会話学習の選び方【大木優紀/澤円/リーマントラベラー/東松寛文/ビズメイツ/コーチング/Bizmates Coaching/NewsPicks】 |
| a9ANhQPvhgY | below_min_score_or_cutoff | 27 | prog | Python | SAMURAI ENGINEER [侍エンジニア] | 【初心者必見】Pythonとは？できることや特徴を分かりやすく解説 |
| mnSj-vG2PJI | below_min_score_or_cutoff | 27 | english | TOEIC | 大人のための武田塾English ビジネスパーソン向け英会話スクール | 【TOEICルート】ゼロからでもTOEIC400点を取るための勉強法を解説！【初心者向けルート】vol.260 |
| XhbRqItkIYI | below_min_score_or_cutoff | 27 | prog | Python | Pythonプログラミング VTuber サプー | 【Pythonプログラミング入門】Windows PCにPythonをインストールして動かす！〜VTuberと学習するプログラミング〜 |
| 54jyxTOqqZA | below_min_score_or_cutoff | 27 | shikaku | IT | SAMURAI ENGINEER [侍エンジニア] | 【初心者おすすめ】ITパスポートとは？取得すべき？資格の概要や学習方法を解説！ |
| 4BjkAsIfC2M | below_min_score_or_cutoff | 27 | english | 英会話 | Atsueigo | 英語学習は「順番」を間違えると一生伸びません｜最短ルートはこれ |
| lZKF-ybqy0I | below_min_score_or_cutoff | 27 | marke | SNS | ECのカクシゴト ーひとり開業の裏側ー【BASE】 | 【1日密着】インスタ集客術がすごい…ヴィンテージアクセサリーブランドが実践するファンを作るSNS戦略 |
| XvRjaRqWr80 | below_min_score_or_cutoff | 27 | biz | プレゼン | MANAMI PowerPoint School | 【パワーポイント使い方】スライドマスターの活用方法解説！テンプレート作り／全スライドにロゴを入れておくなど＜MANAMI Power Point School Online＞ |
| usbEwmOIhwo | below_min_score_or_cutoff | 27 | prog | Web開発 | いまにゅのAIプログラミング塾 | 【Kivy超入門】40分でGUIアプリケーション開発（Python）の基礎をマスター |
| VtJ-fGm4gNg | below_min_score_or_cutoff | 27 | prog | Web開発 | いまにゅのAIプログラミング塾 | 【完全版】この動画1本でFlaskの基礎を習得！忙しい人のための速習コース（Flask超入門） |
| OfblP-jA1ww | below_min_score_or_cutoff | 27 | english | TOEIC | 【TOEIC対策】猛牛ちゃんねる | 【TOEIC】初心者はこの問題を攻略するのが最優先【リーディングのPART5 問題演習】 |
| TfK4bseO3JE | below_min_score_or_cutoff | 27 | biz | 資料作成 | ゼロからパソコン | 【パワーポイント】プレゼン作成の基本【パソコン初心者】 |
| qdenHTcLStc | below_min_score_or_cutoff | 27 | prog | Web開発 | エンジニア転職チャンネル【RUNTEQ公式】 | 未経験者がAIでアプリ開発してみた！ChatGPTで本当に作れるのか検証 |
| EwJLKIKh2zQ | below_min_score_or_cutoff | 27 | marke | SNS | フェルミ漫画大学 | 【要約】ミニマリスト式超Twitter術: 1日1ツイートで人生を豊かにするツイッターの使い方【なにおれ】 |
| r9QUdzVGHJU | below_min_score_or_cutoff | 27 | prog | Web開発 | Pythonプログラミング VTuber サプー | 【Django】PythonでWebアプリを作ろう！1時間半でDjangoの基本を学ぶ 〜 Webフレームワーク初心者向け 〜 |
| erY_CkAVSYE | below_min_score_or_cutoff | 27 | prog | インフラ | ウズウズカレッジ l デジタル（IT・DX）分野のリスキリング就職 | 【CCNA講座】「TCP」「UDP」を日本一易しく解説！クーポンは概要欄から【インフラエンジニア基礎入門 #6】 |
| WedaSgxk_18 | below_min_score_or_cutoff | 27 | prog | Python | Pythonプログラミング VTuber サプー | 【Pythonプログラミング入門】Python 書き方の基本 〜VTuberと学習するプログラミング〜 |
| zp-kAt1Ih5k | below_min_score_or_cutoff | 27 | prog | Web開発 | いまにゅのAIプログラミング塾 | 【Streamlit超入門】データ可視化・分析アプリを爆速で作成できるPythonライブラリStreamlitの基礎を70分でマスター |
| 4nsTce1Oce8 | below_min_score_or_cutoff | 27 | prog | Web開発 | Pythonプログラミング VTuber サプー | 【超簡単Webアプリ】streamlitでWebアプリを最速で作ってネット公開！〜 プログラミング初心者向け 〜 |
| vkCEbvUwU6A | below_min_score_or_cutoff | 27 | shikaku | 宅建 | あこ課長の宅建講座 | 宅建 2026 宅建業法 #1【宅建業】宅建業の定義を理解しましょう。「宅地」や「建物」の「取引」を「業」として行う時に、免許が必要。「取引態様の自ら貸借」「不特定多数を相手に反復継続」は要チェック！ |
| X97Y29lWgX8 | below_min_score_or_cutoff | 27 | shikaku | 宅建 | 河野玄斗の勉強部屋【切り抜き】 | 【河野玄斗】宅地建物取引士試験に関する質問まとめ！試験に関するアドバイスや勉強法【宅建/資格】 |
| 9LFTWNxU3f8 | below_min_score_or_cutoff | 27 | shikaku | IT | やるかやられるかチャンネル | 【勉強法】ITパスポートに1ヶ月で合格する方法 |
| 2fh8Pyq-Lc8 | below_min_score_or_cutoff | 27 | shikaku | IT | せかチャン - 世界一わかりやすい情報科チャンネル | アルゴリズム・フローチャート基礎講座【基本情報技術者・ITパスポート・高校情報1】 |
| G_AMvOvDoJw | below_min_score_or_cutoff | 27 | shikaku | AI検定 | #usutaku_channel | 【脱初心者】AIを３時間で効率的にマスターする方法 |
| YvJqRImsk-k | below_min_score_or_cutoff | 27 | biz | プレゼン | 【さき】のAIでええやん。 | 【一気通貫】GoogleのAI Geminiで革命的な爆速スライド作成活用方法教えるで！【パワポ / プレゼン】 |
| J8P3mFR5j8E | below_min_score_or_cutoff | 27 | biz | 資料作成 | ユースフル / 実務変革のプロ | 【Copilot】パワポ作成が秒で終わる！無料版でも図解と原稿を「一瞬」で完成させる資料作成時短術 |
| UQk2mrw_hzw | below_min_score_or_cutoff | 27 | english | ビジネス英語 | Atsueigo | 私が1年で英語が話せるようになった"1日10.5時間"の学習メニュー |
| bUAD65iEbY8 | below_min_score_or_cutoff | 27 | biz | プレゼン | 【さき】のAIでええやん。 | 【厳選】全自動AIスライド資料作成マジで使えるオススメのAIはこの5つだけ！ |
| I7jiPkYUjGo | below_min_score_or_cutoff | 27 | data | データサイエンス | スタビジ【誰でもAIデータサイエンス】byウマたん | 【9分で分かる】ベイズ統計学の入門基礎を解説！ |
| ocedfcSlPi0 | below_min_score_or_cutoff | 27 | shikaku | IT | 聞くだけ資格マスターズ | 【2026最新版】ITパスポート試験｜シラバス6.5 新追加の超重要用語まとめ【聞き流しOK】 |
| 3RFQZsgZ3nA | below_min_score_or_cutoff | 27 | prog | Web開発 | プログラミングチュートリアル | AIを使って爆速でアプリ開発を行うためのコーディングワークフロー【バイブコーディング/AI駆動開発】 |
| -7rq1YfxiG4 | below_min_score_or_cutoff | 27 | data | データサイエンス | データサイエンスLab. | 視覚で理解する分散分析。原理をわかりやすく解説します！ |
| IiX6J0FfGng | below_min_score_or_cutoff | 27 | prog | SQL | せお丸@AI駆動開発 | 【2021年版】データベース＋SQL入門｜MySQL/PostgreSQL/Oracleなどデータベースの使い方や役割・SQLについて👉初心者向けに6分で解説✅ |
| foZfGjSh9Vc | below_min_score_or_cutoff | 27 | marke | SNS | さき-インスタの大学 | 【この2つでOK】フォロワー1000人まで爆速で行く方法教えちゃいます！ |
| M1L1q1i406A | below_min_score_or_cutoff | 27 | marke | SNS | スマホのコンシェルジュ「株式会社コアコンシェル」 | 【SNSとは？】種類・特徴・問題点をわかりやすく解説 |
| E1J3vzlwKv4 | below_min_score_or_cutoff | 27 | english | ビジネス英語 | ビジネス英語コーチHika | 【ネイティブが実演】これだけでOK！英語会議ファシリテーションの最強テンプレ公開！ |
| LshGn_oArSc | below_min_score_or_cutoff | 27 | shikaku | AI検定 | 日経新聞要約解説　診断士かつ丼【非公式】 | 【第1章〜8章全網羅】G検定JDLA公式テキスト解説 最新版はコメントからご覧ください。#G検定 #AI資格 #合格対策 |
| PkVy-3VNd00 | below_min_score_or_cutoff | 27 | biz | Word | シアルパソコンスクール 石川 | 【ワード 表】ワードの表の作り方！ワードの表の効率の良い作り方をご紹介します！ |
| lVf_YL_Z9wk | below_min_score_or_cutoff | 27 | shikaku | AI検定 | やん / 完全独学イングリッシュ | ChatGPTを超えるAI英会話学習法が生まれました... |
| jRchuWG6hRo | below_min_score_or_cutoff | 27 | shikaku | IT | せかチャン - 世界一わかりやすい情報科チャンネル | ITパスポート(iパス)とは？試験の特徴や合格率、勉強方法を解説！ |
| omCQDDN7hw4 | below_min_score_or_cutoff | 27 | english | 英会話 | デイナ / Dana【英語の先生】 | 【総まとめ】英語学習完全攻略ロードマップ |
| yzNPC_QzgFM | below_min_score_or_cutoff | 27 | prog | Git | SAMURAI ENGINEER [侍エンジニア] | 【基本知識】GitHubとは？できることや基礎用語を解説！ |
| bEANpRVFheM | below_min_score_or_cutoff | 27 | shikaku | IT | 【基本情報技術者試験YouTuber】すーさん | 【A試験_ストラテジ】08.ストラテジ分野の総まとめ\| 基本情報技術者試験 |
| JguvMoK2AIA | below_min_score_or_cutoff | 27 | shikaku | AI検定 | ハック大学 | 【今すぐやめろ】9割が陥る『AIのお勉強』！ AIを使いこなすための最短ルートは"これ"でした |
| -0EYxuUIN6A | below_min_score_or_cutoff | 27 | english | ビジネス英語 | ビジネス英語コーチHika | 【永久保存版】毎日のビジネス英語会議で使えるフレーズ50選【これ1本で完全網羅】 |
| 2mehreEA7yc | below_min_score_or_cutoff | 27 | prog | Git | SAMURAI ENGINEER [侍エンジニア] | GitHubの使い方を解説！ファイルの作成方法、ブランチの使い方が分かる！ |
| 46VJPmSY_Y0 | below_min_score_or_cutoff | 27 | marke | SNS | たくと@Instagram攻略 | 【完全版】0→1億円売上るSNSマーケティング手法を公開【超有料級】 |
| SyVw6Vjsf8E | below_min_score_or_cutoff | 27 | prog | SQL | プログラミングチュートリアル | 【PostgreSQL入門】初心者OK！PostgreSQLでデータベースの基礎を学んでみよう【APIの構築まで】 |
| r4hQJB2nIQI | below_min_score_or_cutoff | 27 | shikaku | IT | J' VALLE（ジェイバレー）チャンネル | 【ITパスポート合格攻略】受験者が語った勉強法を解説！ |
| CaQS_jz5n-E | below_min_score_or_cutoff | 27 | biz | Word | くませんのパソコンクラブ | 【Word入門】ワードの基本操作だけで資料を作ろう_完結編【パソコン講座】 |
| xDwwhdbzKy4 | below_min_score_or_cutoff | 27 | data | BI | Power BIとデータ分析の学びサイト | 【入門編】たった9分で理解できるPower BIの概要 |
| CFP01W7-BwA | below_min_score_or_cutoff | 27 | shikaku | IT | 文系でもわかる! IT勉強会 | 【アルゴリズム入門】基本情報サンプル問題(科目B)問1 |
| 3u0iRtlURpk | below_min_score_or_cutoff | 27 | biz | プレゼン | しごおもTV | 【資料 構成】資料を早く・ロジカルに作る3つのポイントを解説！【パワポ】 |
| HqRd4_U9EN0 | below_min_score_or_cutoff | 27 | prog | インフラ | 平田哲也インスタリール大学 | パソコン初心者向け！Web/ICT/IT用語【覚えるべき基本・基礎単語】 |
| piQ5gz-dgcw | below_min_score_or_cutoff | 27 | shikaku | IT | 文系でもわかる! IT勉強会 | 【アルゴリズム入門】基本情報サンプル問題(科目B)問9 |
| UtNPgtoiZz4 | below_min_score_or_cutoff | 27 | prog | JavaScript | Webの神様 | 【超入門】初心者でも安心！JavaScript学習入門（後編）処理に関する基礎知識 if文・ループ文などの仕組みを解説【Webデザイン・プログラミング】 |
| -QuM_QAC748 | below_min_score_or_cutoff | 27 | data | データサイエンス | シンラボのエンジニアチャンネル | Kaggle入門「タイタニックの生存予測」メダリストと一緒に解説！【パート①】 |
| UjIa7_0oe8U | below_min_score_or_cutoff | 27 | marke | SNS | あべむつき【ラッキーマイン】 | 【インスタ運用を自動化！？】ChatGPT超え！？無料で使えるAIエージェントManusとInstagramを連携してAI副業でお金を稼ぐ方法を超初心者向け徹底解説🔰【マナス】 |
| H8c0I0lkl9Y | below_min_score_or_cutoff | 27 | prog | Git | にゃんたのAIチャンネル | GitHub Copilotを使いこなすためのコツを解説してみた |
| OSe2ef3iLGw | below_min_score_or_cutoff | 27 | prog | JavaScript | アキユキ / Web制作チャンネル | JavaScriptとは何か（概念・DOM・型・変数）【全5回でJavaScriptの基礎を徹底】 |
| X_I1Tuog0Ck | below_min_score_or_cutoff | 27 | data | データサイエンス | 放送大学YouTubeチャンネル | データサイエンス・リテラシ基礎（’22）＜放送大学オンライン科目紹介＞ |
| bJcRT7l7RN8 | below_min_score_or_cutoff | 27 | prog | インフラ | もりこーぽちゃんねる　インフラ系エンジニア情報チャンネル | 【ネットワーク初心者】【有料級】【設定】CiscoのCatalyst1000を使って学ぶ！乗っ取られたくないあなたに見てほしい… |
| TXHmpsnPH58 | below_min_score_or_cutoff | 27 | data | Excel | いけともch | 【決定版】Copilot Excel、初心者が使いこなすための「7つの型」～これだけ覚えれば明日からExcel作業が変わる！ |
| aQYTmrZFkaE | below_min_score_or_cutoff | 27 | prog | JavaScript | プログラミングアカデミー | 初心者向けJavaScript入門講座#9【JavaScriptの配列について】 |
| hdpMw3hyQq4 | below_min_score_or_cutoff | 27 | prog | Git | しもむらともき | 【初心者向け】Visual Studio Codeを使ったGit Github入門 Github Actionsを使った自動デプロイも紹介 |
| CtLx2uHjV8M | below_min_score_or_cutoff | 27 | shikaku | IT | 名古屋で働くAI・データ分析者「仲田=よーいち」 | 【本音で解説】情報セキュリティマネジメント試験は受験すべきか？【基本情報技術者試験・応用情報技術者試験・ITパスポートとどちらを優先すべき？】【安全確保支援士ではないですよ!】【情報処理技術者試験】 |
| N-Heok17u00 | below_min_score_or_cutoff | 27 | shikaku | IT | 【資格試験サポーター】のっち・中小企業診断士 | 【超具体的！】28日間で「ITパスポート」に独学で合格する勉強法 [勉強スケジュール有りで学生・社会人の初心者にもオススメ！] |
| r25WTGioR7Q | below_min_score_or_cutoff | 27 | data | BI | 業務効率化・データ活用ちゃんねる | 【PowerBI入門】リレーションシップでのデータ紐づけ方法を10分で解説！ |
| 37EH-aC1qqE | below_min_score_or_cutoff | 27 | prog | SQL | 徳田 啓【プログラミング学習チャンネル】 | SQL基礎講座　15分で理解する！【プログラミング】 |
| 9V7w5TthrmE | below_min_score_or_cutoff | 27 | marke | Webマーケ | 転職のサラタメさん | 『マーケター転職』のすべてを日本一わかりやすく解説してみた。（基礎知識・面接ノウハウ・おすすめ転職エージェントなど） |
| eHIcKJLNWTY | below_min_score_or_cutoff | 27 | prog | JavaScript | せお丸@AI駆動開発 | JavaScript入門講座｜Javascriptで出来ることや勉強法をわかりやすく解説！【6分でわかるJS入門】 |
| 7O-9xT_W908 | below_min_score_or_cutoff | 27 | prog | JavaScript | 逆転は無理でも、せめて追いつくFラン社畜プログラマ | ゆっくり解説　JavaScriptを始めるにあたって知っておいたほうが良いHTMLの基礎知識　知ってると思い込んでるあなたも確認のため見てみよう |
| XI0aEuSYbuU | below_min_score_or_cutoff | 27 | marke | SEO | タメブロch【初心者のためのブログ始め方講座】 | 【ブログ初心者向け】SEOとは何か？超基本をわかりやすく解説！【SEO対策】 |
| rhUEp5wkua8 | below_min_score_or_cutoff | 27 | shikaku | 宅建 | 国際弁護士Tokyo Joeの宅建講座 | 【宅建】これで間違いなし！最強の年間スケジュールを公開【保存版】 |
| 8WUrjo3wQb8 | below_min_score_or_cutoff | 27 | shikaku | IT | だれでも成功!DXチャンネル | 【ITパスポート 勉強方法】文系女子がわずか2か月でITパスポートに合格!?誰でもできる最新の勉強法とは？ |
| lgeWCnqWI1g | below_min_score_or_cutoff | 27 | prog | SQL | IT HERO | 【SQL入門 完全版】データベースの基礎からJOIN, サブクエリまで！これ1本でSQLをマスター |
| kdfJSdof_hk | below_min_score_or_cutoff | 27 | data | Excel | キノコード / プログラミング学習チャンネル | 15分ですぐ仕事に使える！【Excelで重回帰分析】AI講座 第10回｜Pythonではじめる人工知能入門講座 |
| fZxOzpdg-Tg | below_min_score_or_cutoff | 27 | biz | Word | シアルパソコンスクール 石川 | 【ワード】初心者でも安心！ビジネス文書の作り方をわかりやすく解説！ |
| 5Fo5S4kkE1Q | below_min_score_or_cutoff | 27 | marke | Webマーケ | マーケティング大学 by桜井茶人 | #16【独学で習得】初心者でも分かるwebマーケティング講座／YouTube動画広 |
| mgMv0Jjd4xo | below_min_score_or_cutoff | 27 | shikaku | 宅建 | 宅建Jobチャンネル | 【2026宅建】宅建の勉強はまずここから始めて！宅建業法の全体像を10分でざっくり解説【初学者必見】 |
| LKR8YFusAgQ | below_min_score_or_cutoff | 27 | data | BI | tom 23 | 【初心者必見】 Power BI 超初心者入門 パート1 ～ ご挨拶 ～ |
| tTXQWJldzyU | below_min_score_or_cutoff | 27 | shikaku | IT | 理系OLろーのキャリア日記 | 【ITパスポート】新卒・未経験が１ヶ月で合格する勉強計画を詳しく解説 |
| wwNKLnRtLbY | below_min_score_or_cutoff | 27 | marke | SNS | ひかる┃インスタマーケティング | 【2026年最新版】インスタ初心者でも月200万稼げる収益化方法！バズりやすいアカウントを作る爆伸び初期設計を紹介します!【インスタグラム 始め方】 |
| clTHTwqbN2A | below_min_score_or_cutoff | 27 | prog | Git | Smart Work Hacks | 【中学生でもわかる】GitとGitHubの違いを一発で分からせます！ |
| TuuZPaE0Isc | below_min_score_or_cutoff | 27 | shikaku | IT | ITパスポート・情報処理技術者試験解説 | （損する勉強法）やってはいけないITパスポートの勉強法9選！ |
| b6IlGzp9pZc | below_min_score_or_cutoff | 27 | marke | Webマーケ | ゼロイチWEBデザイン:未経験からWEBデザイナーへ | WEBデザインで稼ぐために必要なマーケティング3つの考え方【超基礎】 |
| EjSgD1xb6zw | below_min_score_or_cutoff | 27 | prog | Git | せお丸@AI駆動開発 | Git+Github使い方入門講座🐒デザイナーやプログラマー必見！Gitの仕組みやブランチの運用ルールまで、開発現場で必要な知識を完全解説！ #1 |
| RdTsrVEFm9c | below_min_score_or_cutoff | 27 | shikaku | 宅建 | 【宅建試験】アガルートの最短ルートTV | 【宅建試験2026】5月スタートから合格する！勉強スケジュールと学習のコツを徹底解説！ |
| oFL0coCRKRI | below_min_score_or_cutoff | 27 | shikaku | 宅建 | 国際弁護士Tokyo Joeの宅建講座 | 【宅建2026】今が始めどき！合格までの完全スケジュール🔰 |
| K8Ji_izzUuA | below_min_score_or_cutoff | 27 | prog | JavaScript | テックキャンプのプログラミング塾 | 【超入門】JavaScriptの特徴&できること５選【プログラミング言語利用率1位】 |
| bHcWlsF-o0w | below_min_score_or_cutoff | 27 | shikaku | 宅建 | よんなな先輩のとにかく楽しく宅建合格チャンネル | 【暴露】予備校が恐れる宅建勉強法を暴露します【宅建2026】 |
| Ti-EP4v6xgA | below_min_score_or_cutoff | 26 | biz | Word | 金子晃之 | Word文字や文章の位置をキレイに揃える方法【スペース不要】 |
| Yao6rnIACE0 | below_min_score_or_cutoff | 26 | english | 英会話 | Naomi \| 40代50代のやり直し英会話 | 【知らなきゃ損！】40歳から英語がペラペラになる方法 |
| YkixFvPDYGA | below_min_score_or_cutoff | 26 | shikaku | 宅建 | study vlog /mon | 【宅建勉強方法】 3ヶ月間で自己採点40点｜0からでも合格できた私がやった勉強方法 |
| wgb69RUzTv8 | below_min_score_or_cutoff | 26 | biz | 資料作成 | PIVOT 公式チャンネル | 【パワポ作成 5つのポイント ♯1】これさえできれば誰でも「一流パワポマスター」／東大工学部卒「パワポ芸人」／国山ハセンのパワポの点数は？　リアル企画書にダメ出し【パワポ芸人 トヨマネ】 |
| XJpM-eFVmnM | below_min_score_or_cutoff | 26 | biz | 資料作成 | マナビジネス【コンサル仕事術】 | 【話し方】プレゼンが上手い人は、なぜ流れるように話ができるのか？プレゼン上手い人が無意識にやっている「紙芝居メソッド」とは？ |
| 8Frg8QTJJ5o | below_min_score_or_cutoff | 26 | shikaku | IT | ごまどう | 2日間で30時間勉強して基本情報技術者試験合格する様子 |
| ya5X9_YC3u0 | below_min_score_or_cutoff | 26 | data | Excel | ExcelドカタCH | はじめてのエクセルパワークエリ　基本をこの動画にすべてつめこみました【初心者向け】【Excel PowerQuery】【YT0011】 |
| KCJFR7kCCNg | below_min_score_or_cutoff | 26 | english | ビジネス英語 | Vox Nova 【ヴォックスノヴァ】 | 5分で分かるゴールドマンサックスの英語力【ビジネス英語】 |
| b6r2xz_iCZo | below_min_score_or_cutoff | 26 | biz | 資料作成 | PIVOT 公式チャンネル | 【パワポ作成 5つのポイント ♯2】①箇条書きを作る ②テンプレートを作る／Wordで整理できない人がパワポに取り掛かるな／色はどうするべきか？【パワポ芸人 トヨマネ】 |
| NEpDaqqQDsI | below_min_score_or_cutoff | 26 | english | 発音 | タロサックの海外生活ダイアリーTAROSAC | 【最速最短】日本一の発音講師に聞く最強の英語発音習得法｜これであなたもネイティブ級!! |
| aGLT6DANgZ0 | below_min_score_or_cutoff | 26 | shikaku | IT | ITパスポート 絶対合格の講座 | 【ITパスポート】試験勉強の8つのポイント |
| HF2lW_k2ZN4 | below_min_score_or_cutoff | 26 | biz | プレゼン | PIVOT 公式チャンネル | 【パワポ作成 5つのポイント ♯3】③四角形で切り分ける ④メリハリを付ける／パワポは「スキルの総合格闘技」／前振りとオチを考える【パワポ芸人 トヨマネ】 |
| Xp48lPTmwvU | below_min_score_or_cutoff | 26 | biz | 資料作成 | PIVOT 公式チャンネル | 【強い組織の資料作成はここが違う】ビジネスはアウトプットが9割 資料作成は「スキルの総合格闘技」だ／AI時代だからこそ言語化･アウトプットが重要／成果を生むパワポ術「キメヘン」「QAR」とは？ |
| 7J_crzU5KP8 | below_min_score_or_cutoff | 26 | prog | インフラ | クライン【KLeIn】 | 【AWS 入門】基本ネットワーク構成をマスターしよう！ |
| 7YsTthxVuE0 | below_min_score_or_cutoff | 26 | english | ビジネス英語 | 英語コーチング TORAIZ（トライズ） | 英語ミーティングでのリアルな英会話／字幕なし・英語字幕・日本語字幕【ビジネス英語聞き流し】 |
| BIPzI4oFACY | below_min_score_or_cutoff | 26 | english | TOEIC | イメージ英語 - Image English | 【聞き流し】TOEIC L＆R スコア600を目指す「初級の500語」（出る単特急 金のフレーズ／イメージ画像・例文付き） |
| waAwVXa9y2o | below_min_score_or_cutoff | 26 | shikaku | IT | 実践の鬼:IT学校さいとうさん | 【初心者向け】基本情報技術者試験 科目B\|アルゴリズムをゼロから理解する |
| jb3KLsCeOzI | below_min_score_or_cutoff | 26 | biz | Word | 金子晃之 | 【初心者/シニア向け】初めてのWordを使う【起動から作成して保存】 |
| kKMm1acGt3I | below_min_score_or_cutoff | 26 | prog | SQL | プログラミングアカデミー | 【MySQL入門決定版】2時間半で学ぶ初心者向けMySQLデータベースチュートリアル【MySQLの基本とSQLの基礎文法の徹底的にマスター】 |
| F6Pf3DQShvU | below_min_score_or_cutoff | 26 | shikaku | IT | ITすきま教室【ITパスポート.基本情報技術者試験.高校情報】 | アルゴリズム基礎①／基本情報技術者・ITパスポートを受ける前に見る動画 |
| m4tY24TUAe0 | below_min_score_or_cutoff | 26 | shikaku | IT | 【基本情報技術者試験YouTuber】すーさん | 【A試験_ストラテジ】01.ソリューションビジネスを理解する\| 基本情報技術者試験 |
| u1aowl54Uxc | below_min_score_or_cutoff | 26 | biz | Word | デザインの鉄則 | ワードでチラシを作るコツ |
| QoClH8s-ywI | below_min_score_or_cutoff | 26 | shikaku | IT | みみスタ | サクッと覚える！略語「基本情報技術者」徹底攻略  直前対策 |
| bhDMorZ2rEQ | below_min_score_or_cutoff | 26 | biz | 資料作成 | しごおもTV | 【最低限】「分かりやすい」は作れる！資料の型｜簡単に資料が整う【パワポ】 |
| LYBqs6LtmLs | below_min_score_or_cutoff | 26 | prog | SQL | スタビジ【誰でもAIデータサイエンス】byウマたん | 【7分で分かる！】基本をおさえるSQL入門講座！ |
| 4w9evvsLUWk | below_min_score_or_cutoff | 26 | data | BI | ITツール学習 | 【神ツール】PowerBI データ加工機能使い方 【PowerQuery】【Excel】(エクセルユーザ必見,業務効率化） |
| h14S3a2KV0M | below_min_score_or_cutoff | 26 | prog | Web開発 | 鳥羽眞嘉 / プログラミングチャンネル | 基礎からわかる！Webアプリの仕組み【歴史〜HTTPの仕組みまで】 |
| Ok5OwGOmVA4 | below_min_score_or_cutoff | 26 | shikaku | IT | SAMURAI ENGINEER [侍エンジニア] | 【必須資格？】基本情報技術者試験を 取得するメリットや学習法を解説 |
| QyOk1l4jcQw | below_min_score_or_cutoff | 26 | data | BI | RPACommunityチャンネル | 【１時間で理解】やさしいPower BI のはじめかた。MVPが丁寧に教えます【資料有】 |
| 9ECbVP_9xKw | below_min_score_or_cutoff | 26 | prog | SQL | SAMURAI ENGINEER [侍エンジニア] | 【データベースに必須】SQLとは？特徴やできること・学ぶメリットをわかりやすく解説 |
| qKDJ2fly-Ek | below_min_score_or_cutoff | 26 | shikaku | AI検定 | ワイズデータ [聞き流しで受かるIT・データ資格チャンネル] | 【生成AIパスポート 聞き流し】 第1章 AI（人工知能）  ~2025年2月試験シラバス対応~　#ysdata |
| coFFDjdyLFY | below_min_score_or_cutoff | 26 | biz | プレゼン | 看護研究チャンネル | パワーポイントを使った 研究 発表 スライド学会発表 |
| JvICLq5w8bc | below_min_score_or_cutoff | 26 | english | ビジネス英語 | ビジネス英語コーチHika | 【英会話リピート練習 】口で覚えるビジネス英語フレーズ40 会議編 |
| kfa0kDy5nJs | below_min_score_or_cutoff | 26 | data | BI | 業務効率化・データ活用ちゃんねる | 【Power BI入門】SharePointフォルダーからデータを取得し、自動更新設定する方法 |
| -YYyfStIITY | below_min_score_or_cutoff | 26 | shikaku | IT | みみスタ | サクッと覚える！「ITパスポート」2026年 用語まとめ 直前対策 |
| i_xuklFLqBw | below_min_score_or_cutoff | 26 | biz | Word | ゼロからパソコン | 【ワード初心者】ページ設定で、余白や行数を調節する【ゼロからパソコン】 |
| c8gm-nPHTTU | below_min_score_or_cutoff | 26 | marke | SEO | SEOおたく / LANY(レイニー) | 【2025年完全版】新・SEO対策の教科書 |
| W5BIN5vkWD8 | below_min_score_or_cutoff | 26 | shikaku | IT | 実践の鬼:IT学校さいとうさん | 【絶対するな】知らないと損する基本情報技術者試験勉強法 |
| dxQd7N3wqps | below_min_score_or_cutoff | 26 | data | 統計 | スキマ時間で医療統計｜スキマル | 【解説】統計学的に有意とは｜P値と仮説検定 |
| ahgawb8CLcM | below_min_score_or_cutoff | 26 | marke | Webマーケ | アスリート社長のチーム経営学 | 【初心者向け】マーケティングって具体的にどんな仕事？転職サイトを見ながら解説します！ |
| B9YJCeY9ILQ | below_min_score_or_cutoff | 26 | english | ビジネス英語 | ビジネス英語コーチHika | 【完全保存版】英語の会議で即使える 神フレーズ【ビジネス英語】 |
| HY1fXPc4OqY | below_min_score_or_cutoff | 26 | biz | Excel | ゼロからパソコン | 【エクセルって何？】エクセルでできること・画面の構成がわかる♪【エクセル初心者】 |
| L0yH-GigEJk | below_min_score_or_cutoff | 26 | marke | Webマーケ | CARINAR - ヤマトヒューマンキャピタル | フル公開【マーケティング 転職】令和に若者が学ぶべきスキル＝WEBマーケティング一択！ |
| EvPf8GU2ds4 | below_min_score_or_cutoff | 26 | shikaku | AI検定 | tomo@資格挑戦アカウント | 生成AIパスポート試験　01AIの概要　短期学習で合格！出るとこだけの聞き流し　#生成AIパスポート　#生成AIパスポート試験 |
| sGzF64NeVu8 | below_min_score_or_cutoff | 26 | prog | SQL | ゆっくりITちゃんねる | 【ゆっくりIT】SQLは絶対覚えろ！ うぷ主的SQLを覚えるべき理由とポイント！ ～ゆっくり解説データベース～ No.041 |
| fbCpMxkH8jQ | below_min_score_or_cutoff | 26 | marke | SNS | さき-インスタの大学 | 【至急確認】見直すだけでインスタがバズりやすくなる設定13個、オンにできてますか？ |
| yKP_CsZaWuc | below_min_score_or_cutoff | 26 | biz | プレゼン | タノ先生の見える化大学-グラレコ- | 《PowerPoint》簡単マニュアルの作り方 |
| YxFbqRe_cac | below_min_score_or_cutoff | 26 | biz | Excel | ユースフル / 実務変革のプロ | [Excel講座4/5]【圧倒的使いやすさ】エクセル超重要機能を丁寧に紹介！知らないと損するかも…！ |
| KcfuGTJPNuk | below_min_score_or_cutoff | 26 | data | 統計 | 田中嘉博 | ｔ検定、分散分析、カイ二乗検定を普通の日本語でじっくり解説 |
| K3gmiRPgLxw | below_min_score_or_cutoff | 26 | marke | SNS | さき-インスタの大学 | 【そのまま使用OK】インスタ×ファン化で最速で収益化までいく方法教えます！ |
| asojXoacfCs | below_min_score_or_cutoff | 26 | prog | インフラ | ゆっくりITエンジニア | 【ゆっくり解説】ゆっくりITエンジニアへの道　-CCNAは一か月でとれるよ- |
| hURSBCHCGXM | below_min_score_or_cutoff | 26 | shikaku | IT | ひまり | 【アラサー独身】IT未経験が一発合格したITパスポートの勉強方法についてお話しします |
| 7lcG2RPCeqA | below_min_score_or_cutoff | 26 | marke | SNS | さき-インスタの大学 | 【簡単にできるのに...】スレッズthreads×インスタで成果出た人続出中！今すぐやって！ |
| 6yGMqvlaAeM | below_min_score_or_cutoff | 26 | shikaku | AI検定 | tomo@資格挑戦アカウント | 資格取ろうぜ！第20回  生成AIパスポート試験をIBTで受験してみた結果！ 試験内容やテキスト・問題集選びと学習法について！ #生成AIパスポート #生成AIパスポート試験 |
| XIp3fUbv9RI | below_min_score_or_cutoff | 26 | data | データサイエンス | Python・データサイエンス入門チャンネル -はやたす- | 【Python×データサイエンス入門②】KaggleとGoogle Colabolatoryを使って無料でデータ分析を始めよう！ |
| Hm_2p3Rc4IQ | below_min_score_or_cutoff | 26 | shikaku | AI検定 | スタビジ【誰でもAIデータサイエンス】byウマたん | 【6分で分かる】生成AIパスポートの試験難易度や勉強方法について解説！ |
| w3oPCMQvqz4 | below_min_score_or_cutoff | 26 | marke | Webマーケ | アスリート社長のチーム経営学 | 【5分でわかる】デジタルマーケティングの基本。Webマーケティングとはどう違う？ |
| 5kD6z7lDlcM | below_min_score_or_cutoff | 26 | marke | SNS | さき-インスタの大学 | 【2026年最新】フォロワー数別！インスタを効果的に伸ばす方法を教えます |
| 0I6wo0F1HPk | below_min_score_or_cutoff | 26 | marke | SNS | 門口拓也インスタ運用 | 【2025年最新】インスタ集客戦略！実店舗経営者は必見です |
| 7N9_bO1WSng | below_min_score_or_cutoff | 26 | shikaku | 宅建 | 国際弁護士Tokyo Joeの宅建講座 | 【宅建は独学の時代へ】高得点続出！講義付テキストで一発合格する方法🔥 |
| ZmJ_xXvKbcM | below_min_score_or_cutoff | 26 | shikaku | 宅建 | 棚田行政書士の不動産大学【公式チャンネル・宅建】 | 【２月スタートで宅建に合格するスケジュール2026年最新版】今年宅建に合格するならこのスケジュールでやって！スケジュール表の無料ダウンロードあり。棚田式分野別過去問題集コラボ動画。 |
| AWMnqZvWkHU | below_min_score_or_cutoff | 26 | biz | Excel | ユースフル / 実務変革のプロ | [Excel講座2/5]【もう忘れない】関数を徹底的に攻略！2021年至上最も分かりやすいExcelマスター講座 |
| X_QMJVHX04A | below_min_score_or_cutoff | 26 | marke | SNS | さき-インスタの大学 | 【9割が知らない】使うだけでインスタがバズりやすくなる最強ツールを12個紹介します！ |
| AsdeDMEWylk | below_min_score_or_cutoff | 26 | english | ビジネス英語 | ビジネス英語コーチHika | 【英語会議で差がつく】ネイティブが必ず使う鉄板フレーズ50選【ビジネス英語】 |
| Y2gnGQu5aUo | below_min_score_or_cutoff | 26 | biz | プレゼン | しごおもTV | 【資料作成】簡単3ステップ！垢抜けスライド作成法！｜野暮ったい資料をスマートにする |
| o1TTOh7lZcI | below_min_score_or_cutoff | 26 | shikaku | IT | 文系でもわかる! IT勉強会 | 【勉強法】基本情報技術者試験（新制度対応版） |
| ibKL7zbFKI8 | below_min_score_or_cutoff | 26 | biz | Word | パソコン上達!Nagomiチャンネル | Word【文書作成の練習】入力ができればOK！動画を見ながら一緒に作成できます。たくさんの機能を詰め込みました。 |
| sMzOOpUwlb4 | below_min_score_or_cutoff | 26 | shikaku | IT | SEプラス IT教育チャンネル【公式】 | 【この6つだけ】基本情報技術者試験 計算問題を解くコツ【対策本著者解説】 |
| _dYxVUfP8dw | below_min_score_or_cutoff | 26 | marke | SNS | ひかる┃インスタマーケティング | 【2026年最新版】インスタ0からフォロワー1000人までの増やし方5ステップ！今から爆速で伸ばすならこれ!【インスタ攻略】 |
| h0sA_Wh9IcY | below_min_score_or_cutoff | 26 | data | データサイエンス | Python・データサイエンス入門チャンネル -はやたす- | 【Python×データサイエンス入門④】データの可視化と欠損値の確認【Matplotlib, Pandas, Seaborn】 |
| Tz4mwi_5H60 | below_min_score_or_cutoff | 26 | shikaku | IT | 聞くだけ資格マスターズ | 【ITパスポート完全攻略】1092語を2時間で一気に理解！頻出用語を一言要約で暗記【2026最新シラバス対応】 |
| H0UN-0r10os | below_min_score_or_cutoff | 26 | shikaku | 宅建 | 棚田行政書士の不動産大学【公式チャンネル・宅建】 | 【宅建合格スケジュール２０２６：受験生はこれやって】概要欄から無料ダウンロード！宅建に合格するならこのスケジュール『大量記憶表』を使ってやって。 |
| 8xghA71RNO4 | below_min_score_or_cutoff | 26 | marke | SNS | ズボラ兄さんのInstagram完全攻略 | 【2026年超最新】Instagramが大激変！知らないと損している！インスタ集客の新常識を暴露しちゃいます |
| bk5JuvJkPms | below_min_score_or_cutoff | 26 | data | 統計 | 田中嘉博 | 【基礎編③】P値と帰無仮説：難しい数式と専門用語を使わない統計学シリーズ・基礎編の3つ目の動画です。 |
| eh8wM_3mysg | below_min_score_or_cutoff | 26 | english | 英会話 | やん / 完全独学イングリッシュ | 【レベル別最適解】留学なしで1日2時間で英語を話せるようになる勉強法 |
| vWuy0pFkug8 | below_min_score_or_cutoff | 26 | data | 統計 | 田中嘉博 | 【基礎編⑤】分散と標準偏差：難しい数式と専門用語を使わない統計学シリーズ・基礎編の5つ目の動画です。 |
| 19-HNqzKa_M | below_min_score_or_cutoff | 26 | data | BI | Power BIとデータ分析の学びサイト | 【Power BI入門編】スライサーのコツ をマスターしてデータ分析をもっと簡単に！【３分で脱初心者】 |
| IXaQiAM8Mic | below_min_score_or_cutoff | 26 | english | ビジネス英語 | NAOMI CHANNEL WORLD - 英会話・ビジネス英語・アメリカ情報 | リアルなビジネス英語メールのやり取りから本気で学ぶ、ビジネス英語メール術！書き方・重要ポイント【永久保存版】ビジネス英語メールで一番大切な事教えます！ |
| mG9e63Zbr5g | below_min_score_or_cutoff | 26 | marke | コンテンツ | クロノ【コンテンツ販売研究所】 | 【保存版】コンテンツ販売で使うマーケティング基礎用語77選 |
| OEjx6gJYMmI | below_min_score_or_cutoff | 26 | shikaku | 宅建 | 八木流 覚えない宅建合格術 | 【完全初心者が2時間半で】宅建の全体像丸わかり～0冊目動くテキスト |
| 7zT9HgTY6lI | below_min_score_or_cutoff | 25 | english | 発音 | サイモンのイキれる英語教室 | 日本人の英語発音はネイティブにこう聞こえています。 |
| XMQDfj-yEXI | below_min_score_or_cutoff | 25 | english | 発音 | Kendra's Language School | 英語の脳を作る・シャドーイング練習500 – 基本編 |
| wFpyeWto8Og | below_min_score_or_cutoff | 25 | shikaku | IT | 【基本情報技術者試験YouTuber】すーさん | 【科目B】アルゴリズム問題をたった1動画で対策_基本情報技術者試験 |
| Ay1cpehksq8 | below_min_score_or_cutoff | 25 | biz | Excel | PC活用ちゃんねる | 【Excel基本操作】職場で恥をかかない為に最低限覚えておきたいこと |
| By7rAU5KsoQ | below_min_score_or_cutoff | 25 | shikaku | IT | みみスタ | サクッと覚える！「ITパスポート」よく出る単語188 直前対策 |
| K0m7jAnlC6Y | below_min_score_or_cutoff | 25 | biz | Word | ゼロからパソコン | 【Wordの困った】行間が勝手に広がる問題をサクッと解決♪ |
| _wbOzkneb84 | below_min_score_or_cutoff | 25 | english | 発音 | だいじろー Daijiro | だいじろーの英語発音練習ルーティン1時間【ただ練習してるだけ】 |
| eqzUPQ1EgpI | below_min_score_or_cutoff | 25 | english | 発音 | Ayane。  | 【毎日4分】発音英トレ/ 日本人向けフォニックスA~G🎶❤️‍🔥 |
| bUUPcaDUutU | below_min_score_or_cutoff | 25 | shikaku | IT | みみスタ | サクッと覚える！「基本情報技術者」よく出る単語200 直前対策 |
| TwSvhPNh6Zw | below_min_score_or_cutoff | 25 | biz | Excel | いなわくTV | Excel初級1（新規作成・画面構成・セルの仕組み・範囲選択） |
| 2yL8GnBdZMo | below_min_score_or_cutoff | 25 | data | 統計 | 田中嘉博 | t検定とχ二乗検定ってそもそも何？どういうふうに使い分ける？ |
| _xdtmUpUNyw | below_min_score_or_cutoff | 25 | english | TOEIC | 大人のための武田塾English ビジネスパーソン向け英会話スクール | 【TOEICの勉強をこれから始める人向け】学習を始める前にこの動画を必ず見てください |
| cfON3-kWCuM | below_min_score_or_cutoff | 25 | shikaku | IT | 【基本情報技術者試験YouTuber】すーさん | 【A/B試験_情報セキュリティ】01.情報セキュリティの考え方\| 基本情報技術者試験 |
| J5RntYNBTp0 | below_min_score_or_cutoff | 25 | english | 発音 | Atsueigo | 【超簡単】一瞬で発音が劇的に向上するコツを伝授します |
| edNtArZcCiA | below_min_score_or_cutoff | 25 | shikaku | IT | 【基本情報技術者試験YouTuber】すーさん | 【A試験_ネットワーク】01.ネットワークの基本と回線速度\| 基本情報技術者試験 |
| mFTXiuJi0I0 | below_min_score_or_cutoff | 25 | shikaku | IT | みみスタ | サクッと覚える！「ITパスポート」略語27 直前対策 |
| So7_heXYbgw | below_min_score_or_cutoff | 25 | english | TOEIC | 大人のための武田塾English ビジネスパーソン向け英会話スクール | 【TOEIC初学者向け】TOEIC対策はまずこれだけやってください！オススメ参考書もまとめて紹介！vol.435 |
| Vqx40iaS9lw | below_min_score_or_cutoff | 25 | shikaku | IT | 【基本情報技術者試験YouTuber】すーさん | 【B試験_アルゴリズム】02.基本的なアルゴリズム一覧 \| 基本情報技術者試験 |
| YOSyc2jMb40 | below_min_score_or_cutoff | 25 | marke | Webマーケ | スキル獲得チャンネル | 【37分で全部学べる】学ぶべきマーケティング用語50選 |
| s_o5JYj6cyc | below_min_score_or_cutoff | 25 | english | 発音 | 🍀 Chinatsu The Emo | 【発音改善】ネイティブ並の英語発音にするコツ3つ教えます！　#英語学習 |
| pWlHHH5wk24 | below_min_score_or_cutoff | 25 | shikaku | IT | 【基本情報技術者試験YouTuber】すーさん | 【A試験_システム開発】01.システム開発の流れ\| 基本情報技術者試験 |
| Hjz_UK2WoO8 | below_min_score_or_cutoff | 25 | shikaku | IT | 【基本情報技術者試験YouTuber】すーさん | 【A/B試験_情報セキュリティ】05.ネットワークセキュリティ\| 基本情報技術者試験 |
| nqOIHubpygU | below_min_score_or_cutoff | 25 | prog | SQL | エンジニアチャンネル | 【初心者向け】クソデータベース設計をしないためのテクニック5選 |
| iMnTZROpnb8 | below_min_score_or_cutoff | 25 | prog | インフラ | エンジニア転職チャンネル【RUNTEQ公式】 | 未経験・1年目のWeb/ITエンジニアに必須の技術13選 |
| xzGeSKi8dDY | below_min_score_or_cutoff | 25 | shikaku | IT | 【基本情報技術者試験YouTuber】すーさん | 【A試験_マネジメント】01.プロジェクトマネジメントを理解する\| 基本情報技術者試験 |
| gnTxKHMYqFI | below_min_score_or_cutoff | 25 | data | データサイエンス | Pythonプログラミング VTuber サプー | 【Pythonプログラミング】NumPyの基本 〜 Pythonで科学計算や機械学習を扱う人必見！〜 |
| zhWqNC5q50E | below_min_score_or_cutoff | 25 | prog | SQL | 【基本情報技術者試験YouTuber】すーさん | 【A試験_データベース】06. 関係演算とSQL\| 基本情報技術者試験 |
| h173le4s4HI | below_min_score_or_cutoff | 25 | data | SQL | 【基本情報技術者試験YouTuber】すーさん | 【A試験_データベース】07. SQL文法（SELECT文）\| 基本情報技術者試験 |
| 2JgStAO2jOQ | below_min_score_or_cutoff | 25 | english | TOEIC | 大人のための武田塾English ビジネスパーソン向け英会話スクール | 【舐めてる人注意】『TOEIC L&R TEST出る単特急 銀のフレーズ』を徹底解説！金フレをやってる人は注意かも？！ 【TOEIC満点講師が解説】vol.91 |
| Az2KzhOh3iI | below_min_score_or_cutoff | 25 | shikaku | IT | 【基本情報技術者試験YouTuber】すーさん | 【A試験_アルゴリズムとプログラミング】05.オブジェクト指向プログラミングとUML\| 基本情報技術者試験 |
| DTSgdfeR9CA | below_min_score_or_cutoff | 25 | biz | 資料作成 | 元外資コンサル_パワポ塾 | 【外資コンサル】パワポ資料の作成風景を公開（※倍速推奨）/使用するショートカットや作成手順を紹介！ |
| XG8WEourY5E | below_min_score_or_cutoff | 25 | shikaku | IT | 【基本情報技術者試験YouTuber】すーさん | 【A/B試験_情報セキュリティ】07.テスト頻出の情報セキュリティ分野復習\| 基本情報技術者試験 |
| BLoZd-w4YR0 | below_min_score_or_cutoff | 25 | shikaku | IT | 【基本情報技術者試験YouTuber】すーさん | 【A試験_システム構成要素】02.システムの信頼性と性能評価\| 基本情報技術者試験 |
| ydOcT0eeNfs | below_min_score_or_cutoff | 25 | prog | JavaScript | だれでもエンジニア / 山浦清透 | JavaScriptで出来ること3選【プログラミング言語利用率1位】 |
| I7yjUiL2gWw | below_min_score_or_cutoff | 25 | shikaku | IT | 【基本情報技術者試験YouTuber】すーさん | 【A試験_データベース】08. 機械学習とディープラーニング\| 基本情報技術者試験 |
| 8a1f-Blss-o | below_min_score_or_cutoff | 25 | prog | インフラ | ITサプリ | 【ネットワークエンジニア必須】CCNA資格を徹底解剖！難易度は？勉強方法は？【IT業界/転職】 |
| q1W82LsrO8A | below_min_score_or_cutoff | 25 | marke | SNS | さき-インスタの大学 | 【2025年最新】インスタ副業始めたい人が最初にするべきこと5ステップまとめ |
| LCsrRcQ9rNg | below_min_score_or_cutoff | 25 | data | データサイエンス | データサイエンス研究所 | 【R言語の基礎#1】RとRstudioの基本 |
| sk3eTe5Ui3s | below_min_score_or_cutoff | 25 | marke | SNS | 時給900円パートから貯金5億円超の4児シングルマザー | 【インスタ集客】問い合わせ0人→月1500人　インスタ集客基礎編 |
| gAO7ln7Pe5Y | below_min_score_or_cutoff | 25 | shikaku | IT | ロンリー社長のオンリー講座 | 【CBT方式完全攻略】基本情報技術者試験のCBTで1分1秒でも無駄にしないための動画 |
| oU2sisdcztQ | below_min_score_or_cutoff | 25 | prog | インフラ | テックキャンプのプログラミング塾 | 【新入社員向け】知らないと置いていかれるIT用語55選 |
| PjBqzG__mAM | below_min_score_or_cutoff | 25 | prog | インフラ | エンジニア転職チャンネル【RUNTEQ公式】 | 【未経験向け】IT業界の職種・仕事内容・必要スキルを全て教えます！ |
| Q6dx9AdQN1Y | below_min_score_or_cutoff | 25 | data | BI | ITツール学習 | PowerBI　リレーション解説【ER図】【紐づけ】【データ活用】【可視化】【Excelデータ活用】 |
| -HRp8KhrKno | below_min_score_or_cutoff | 25 | prog | Web開発 | 独学クソリーマンの逆襲 | 仕事(バックオフィス)で使っているPYTHONアプリを3つ紹介！ |
| iRhUDzABC3U | below_min_score_or_cutoff | 25 | biz | Word | ゼロからパソコン | 【知って納得！】お知らせ文書の作りかた。基本の型がわかれば簡単♪ |
| 80QfKSl254o | below_min_score_or_cutoff | 25 | english | ビジネス英語 | ビジネス英語コーチHika | 【30フレーズ】英語プレゼン リピート練習 【ビジネス英語聞き流し】 |
| FMZpIh4LIcU | below_min_score_or_cutoff | 25 | english | ビジネス英語 | ビジネス英語コーチHika | 【2025年最新】全ビジネスシーンで使える英語フレーズ100選【挨拶/英語会議/英語メール...】 |
| SR93M9OFFX4 | below_min_score_or_cutoff | 25 | english | ビジネス英語 | 英語コーチング TORAIZ（トライズ） | 【英語で会議】ミーティングで即使える神フレーズ！ネイティブに聞いてみた【ビジネス英会話】 |
| c1_4-G_uwqg | below_min_score_or_cutoff | 25 | marke | Webマーケ | 本解説のしもん塾【プロ読書家】 | SEO対策とWEB集客のコツ！『沈黙のウェブマーケティング・ライティング　松尾茂起」の本解説要約。今後WEB集客スキルは恋愛にも仕事にも必須だ。　オーディオブック ビジネス書レビュー オーディブル。 |
| s9uX7si1m5E | below_min_score_or_cutoff | 25 | english | ビジネス英語 | NAOMI CHANNEL WORLD - 英会話・ビジネス英語・アメリカ情報 | ビジネス英語メール【書き出し方、終え方、締め・結び方】これで完璧！！徹底解説 |
| vpfmrf4h_gE | below_min_score_or_cutoff | 25 | marke | SNS | 比嘉太一@店舗集客×AI | 【飲食店集客特化】新規顧客を増やすInstagram集客対策7選【インスタ集客】 |
| gSLQYvf6ttI | below_min_score_or_cutoff | 25 | marke | Webマーケ | WebマーケティングTV【StockSun株式会社】 | クライアントも代理店も抑えるべきマーケティングの要点とは？ |
| D9FHEXrLjwM | below_min_score_or_cutoff | 25 | english | ビジネス英語 | NAOMI CHANNEL WORLD - 英会話・ビジネス英語・アメリカ情報 | 【最新】ビジネス英語会議 ネイティブが毎日使う重要英語表現＆英語フレーズ 《PART1 英語ミーティング》 |
| I5j0qKNr_oo | below_min_score_or_cutoff | 25 | marke | SNS | 飲食店のための食べログチャンネル | 【今すぐできるインスタ術】集客に活用できる3つのテクニックを大公開！ |
| 38KjzOWGw4s | below_min_score_or_cutoff | 25 | english | ビジネス英語 | NAOMI CHANNEL WORLD - 英会話・ビジネス英語・アメリカ情報 | 【PART2】超重要 ビジネス英語会議表現30選！ネイティブが毎日使うビジネス英語シリーズ ミーティング編 オンライン会議でも活用出来る！ |
| Z8r_hytSd60 | below_min_score_or_cutoff | 25 | data | Excel | ユースフル / 実務変革のプロ | 【Excel×Copilot】無料版でここまでできる！？一瞬で「集計・分析・グラフ作成」を終わらせる時短術 |
| rpgdZJCOn6w | below_min_score_or_cutoff | 25 | english | 英会話 | やん / 完全独学イングリッシュ | 【今年こそ話せるように！】2026年の正しい英語学習のはじめ方 |
| TAIujo42u9I | below_min_score_or_cutoff | 25 | marke | SNS | ハンドメイド学園 | 【絶対やるな】ハンドメイド無名作家のNG集客法TOP5 |
| gPklu3t2Dvw | below_min_score_or_cutoff | 25 | english | ビジネス英語 | ビジネス英語コーチHika | 英語会議の始めから締めまで使える！ネイティブ厳選の知らなきゃ損する最強テンプレ |
| Oi08YBVJhe0 | below_min_score_or_cutoff | 25 | marke | SEO | やっすんが世界を変えるまで | SEO対策の必須知識9選 【Google SEO Guide要約1/3】【SEO対策入門シリーズ①】 |
| fu2g_FXZIGQ | below_min_score_or_cutoff | 25 | biz | Word | 本の印刷工房 YouTubeチャンネル | ワードのテキストボックスの活用方法 |
| mTb69Lfz-HQ | below_min_score_or_cutoff | 25 | marke | Webマーケ | ともっち【Withマーケ運営】 | 【入門】マーケティングの基礎知識を世界一簡単に解説 |
| wP8kESPEx5A | below_min_score_or_cutoff | 25 | prog | JavaScript | webサイトチャンネル | 【JavaScript】「DOM操作」の基本をわかりやすくカンタン解説 |
| xeFYaPFFJwA | below_min_score_or_cutoff | 25 | marke | SNS | 門口拓也インスタ運用 | 【店舗×インスタ】この10個だけ実践したら、予約・問い合わせが10倍！【インスタ店舗集客】 |
| GDSD1q_zuP4 | below_min_score_or_cutoff | 25 | marke | SEO | ウェブ職TV@Claude Codeの安全な使い方を学習 | 【8分で解説】読者にもSEOにも好かれるブログ記事を書く方法【共起語って知ってる？】 |
| kYCsKrs3ufU | below_min_score_or_cutoff | 25 | english | ビジネス英語 | ビジネス英語コーチHika | 【今日から書ける】英語ビジネスメール攻略！書き出しから締め方まで徹底解説 |
| K2cJofUJVO8 | below_min_score_or_cutoff | 24 | data | 統計 | 予備校のノリで学ぶ「大学の数学・物理」 | 中学数学からはじめる確率統計 |
| kZakG8UPZaY | below_min_score_or_cutoff | 24 | prog | インフラ | だれでもエンジニア / 山浦清透 | IT用語66選！エンジニアリングの基本をこの動画1本で！【非エンジニア必見】 |
| -0Z27HpPQVQ | below_min_score_or_cutoff | 24 | english | ビジネス英語 | 英語聞き流し \| Sakura English | ビジネス英語フレーズ リスニング 聞き流し 英会話【064】 |
| r5w-bqTWAws | below_min_score_or_cutoff | 24 | shikaku | 宅建 | あーこ不動産@岐阜 | 【宅建】知識ゼロ、独学5ヶ月で一発合格した勉強方法 |
| raQE9zUNcs4 | below_min_score_or_cutoff | 24 | english | 発音 | 『あいうえおフォニックス』英語発音 | 英語を習うならまずこれ！ ローマ字読みしないで最短距離で英語の発音をマスターしよう！フォニックス（英語を習う時一番最初に覚えたいこと） [#332] |
| -lxUl3J3BXE | below_min_score_or_cutoff | 24 | shikaku | IT | 実践の鬼:IT学校さいとうさん | 【問題演習付き】科目Bアルゴリズムはこう解け（基本情報技術者試験） |
| HqvcmkFjVnw | below_min_score_or_cutoff | 24 | prog | インフラ | いまにゅのAIプログラミング塾 | 【初学者向け】APIを理解したい人がまず最初に見る動画 |
| S7bQh6o2aZQ | below_min_score_or_cutoff | 24 | biz | Word | パソコン上達!Nagomiチャンネル | Word【差し込み文書】同じ文書の一部だけをExcelのリストから差し込む方法　Word中級編 |
| BPRuUFYLdZg | below_min_score_or_cutoff | 24 | biz | Word | パソコン上達!Nagomiチャンネル | 文書を作成しよう！【ワード初級編】まずは基本的な操作から始めていきましょう！ |
| 8FE-zuRQqEo | below_min_score_or_cutoff | 24 | marke | SNS | TOM【SNS副業】 | 【副業初心者必見】誰でも１日３万円稼げるアフィリエイト手法【５ステップで実現】 |
| 9ODdCvIEtDE | below_min_score_or_cutoff | 24 | english | ビジネス英語 | NAOMI CHANNEL WORLD - 英会話・ビジネス英語・アメリカ情報 | 英語で会議！ネイティブが使うミーティングに関する英語フレーズ４０ PART１(1～26） |
| XzIFZLtm6is | below_min_score_or_cutoff | 24 | english | 発音 | 英語発音専門ドクターDイングリッシュ | 【英語女子必見】女性の英語声の出し方〜喉を開いてトーンを落とす |
| xW9-8dq9TaA | below_min_score_or_cutoff | 24 | data | Excel | オデッセイコミュニケーションズ公式YouTubeチャンネル「Odysseymedia」 | 【エクセルで統計分析】売り上げに影響を与える要因を見つける！（回帰分析） |
| 0dMPvW2xi4g | below_min_score_or_cutoff | 24 | shikaku | IT | ITパスポート【爆速合格】 | 【今すぐやめて】ITパスポートで不合格になる人の特徴を紹介します |
| xOu6FqQ82zg | below_min_score_or_cutoff | 24 | marke | Webマーケ | スタビジ【誰でもAIデータサイエンス】byウマたん | 【8分で分かる】Webマーケティング！これだけは知っておいてほしい！ |
| qd7XuZYKMHU | below_min_score_or_cutoff | 24 | shikaku | IT | 資格100個取ろうぜ!【100とろ】 | 1日1時間の勉強でITパスポート合格した勉強法‥！ |
| JpBLZRoHjHA | below_min_score_or_cutoff | 24 | biz | 資料作成 | cooker8 by 明治クッカー | 【上司からも高評価】プレゼン資料作成の極意。手順とルールを守れば、誰でも作れます。コンサルタントの秘密の仕事術。 |
| GeGyU7KcpCA | below_min_score_or_cutoff | 24 | data | Excel | ユースフル / 実務変革のプロ | 【Excel×Copilot】集計と分析が一瞬で終わる技３選 |
| rMx0r5zHzLQ | below_min_score_or_cutoff | 24 | shikaku | IT | やるかやられるかチャンネル | 【基本情報】午後問題の勉強はこう進めてください！！ |
| idxwEU930b0 | below_min_score_or_cutoff | 24 | prog | Git | InomaCreate | 【Git】【VSCode】面倒なコマンドは不要です！ VisualStudioCodeでのGit操作方法 |
| ycGgvDVs2Lw | below_min_score_or_cutoff | 24 | data | BI | ソフゾウのデータ分析のお部屋 | Power BIのメリット10選　～脱Excel・Power Pointへの導き～ |
| vPpafzJnOzY | below_min_score_or_cutoff | 24 | marke | Webマーケ | 末永 雄大 / すべらない転職エージェント | 未経験でWebマーケティングに転職したい人は◯◯をしてください |
| pm4OdAOlP70 | below_min_score_or_cutoff | 24 | prog | SQL | キノコード / プログラミング学習チャンネル | Oracle Databaseとは？｜Oracle Databaseとは何か、特徴などを3分でわかりやすく解説します【データベース初心者向け】 |
| 0V268lmXxOo | below_min_score_or_cutoff | 24 | english | ビジネス英語 | NAOMI CHANNEL WORLD - 英会話・ビジネス英語・アメリカ情報 | 【最新!】ビジネス英語メールフレーズ100選リピート練習PART1(フレーズ１～５０) ネイティブビジネス英語聞き流し、通勤通学や作業中に便利！ |
| QNXM9Fu1bHQ | below_min_score_or_cutoff | 24 | biz | プレゼン | マナビジネス【コンサル仕事術】 | 【10分でスキルアップ】資料作成簡単フレームワーク～通る資料3つのポイント |
| RaN5A73knT8 | below_min_score_or_cutoff | 24 | prog | インフラ | ねっとびTV【ネットワークエンジニアch】 | 【インフラエンジニアが教える】ネットワーク構築講座#0「導入編」 |
| 1UtzICMcgDw | below_min_score_or_cutoff | 24 | shikaku | IT | SEプラス IT教育チャンネル【公式】 | 【IT資格】新・基本情報技術者試験！科目A免除制度は絶対活用するべき？！科目B対策に集中して確実に合格を勝ち取る方法 |
| oUws2zzWQkE | below_min_score_or_cutoff | 24 | marke | SNS | PBアカデミー | 【ハンドメイド副業】インスタで集客から販売まで行う方法を解説！ |
| N8opuav1IM8 | below_min_score_or_cutoff | 24 | english | ビジネス英語 | ビジネス英語コーチHika | 【衝撃】40代英語力ゼロで外資系企業に転職！超効率的な英語学習法とは！？ |
| qL8nng9GZes | below_min_score_or_cutoff | 24 | prog | SQL | キノコード / プログラミング学習チャンネル | データベースの種類にはどんなものがあるのか？｜図解を使って3分でわかりやすく解説します【データベース初心者向け】 |
| WGfCv4HFRiI | below_min_score_or_cutoff | 24 | shikaku | IT | 聞くだけ資格マスターズ | 【2026最新版】ITパスポート｜ストラテジ系まとめ｜シラバス6.5対応・聞き流しで学べる |
| UHCLuwJOclk | below_min_score_or_cutoff | 24 | prog | SQL | エンジニア転職チャンネル【RUNTEQ公式】 | 【エンジニア転職】誰でも絶対に身につくSQLの学習方法 |
| tjzYnjP8Y5c | below_min_score_or_cutoff | 24 | prog | SQL | キノコード / プログラミング学習チャンネル | リレーショナルデータベース管理システム(RDBMS)とは？｜特徴や種類などを3分でわかりやすく解説します【データベース初心者向け】 |
| atcOuaNG3Kw | below_min_score_or_cutoff | 24 | english | ビジネス英語 | ビジネス英語コーチHika | ビジネス英語は最低限この100フレーズを覚えればOK！ネイティブ御用達の英語表現 |
| yZVPw_-eXu0 | below_min_score_or_cutoff | 24 | english | ビジネス英語 | Basic English | ビジネス英語の会議 リアルな英会話【ビジネス英語聞き流し】字幕なし/英語字幕と日本語字幕あり |
| DsHYo3pQyvU | below_min_score_or_cutoff | 24 | prog | Python | 独学クソリーマンの逆襲 | 【Python入門書】初めて学ぶ人にはこれがおすすめ！ |
| QT_tCa3KEEA | below_min_score_or_cutoff | 23 | english | 発音 | Kendra's Language School | 英語の耳を作る！リスニング訓練 |
| vquQ0cOXSN4 | below_min_score_or_cutoff | 23 | english | 発音 | バイリンガル リサティー英会話 | 【 毎日5分のフォニックストレーニング 】アルファベットA to Z for kids & partents |
| 6pwSNyEFp5o | below_min_score_or_cutoff | 23 | biz | プレゼン | マコなり社長 | 誰でもプレゼンが見違えるほど上手くなるたった一つのコツ |
| 6e1iUoQ-ihU | below_min_score_or_cutoff | 23 | prog | Python | いまにゅのAIプログラミング塾 | 【数分で完了！】WindowsにPythonの環境を構築しよう！ |
| m0ee-BU8pTE | below_min_score_or_cutoff | 23 | marke | Webマーケ | 両学長 リベラルアーツ大学 | 【副業成功への高速道路】副業で月5万稼ぐために「Webマーケティング」が超オススメな5つの理由【リベ大公式切り抜き】 |
| lhUsi6TUQy0 | below_min_score_or_cutoff | 23 | shikaku | IT | 【基本情報技術者試験YouTuber】すーさん | 【A試験_データベース】01. データベースの基本\| 基本情報技術者試験 |
| wSvuZUj18u8 | below_min_score_or_cutoff | 23 | shikaku | IT | 【基本情報技術者試験YouTuber】すーさん | 【A試験_ソフトウェア】01. 基本ソフトウェア（OS）\| 基本情報技術者試験 |
| NDkPG4k6rWY | below_min_score_or_cutoff | 23 | marke | SNS | 両学長 リベラルアーツ大学 | 【断言】Xで話題の「資産運用EXPO」をおすすめしないワケ【リベ大公式切り抜き】 |
| 2cqc1CZDQTs | below_min_score_or_cutoff | 23 | shikaku | 宅建 | マジでイケてる宅建講座【ゆーき大学】 | 【宅建】一発合格者に聞いた！初学者に必要な参考書・テキスト・問題集はこの３冊です（ゆーき大学のおすすめ） |
| 7LKv4Vbbdro | below_min_score_or_cutoff | 23 | biz | 資料作成 | ゼロからパソコン | 【使わないのはもったいない！】パワーポイントでできること♪【ゼロからパソコン】 |
| nU7QIbu-gWw | below_min_score_or_cutoff | 23 | data | 統計 | スタビジ【誰でもAIデータサイエンス】byウマたん | 【5分で分かる】T検定を理解してビジネスシーンに取り入れよう！！ |
| 5DUXdmoVAGA | below_min_score_or_cutoff | 23 | shikaku | IT | ITすきま教室【ITパスポート.基本情報技術者試験.高校情報】 | 基本情報技術者試験📝受験前に知りたいテスト形式 |
| wE9w-WwnpiQ | below_min_score_or_cutoff | 23 | shikaku | AI検定 | スタビジ【誰でもAIデータサイエンス】byウマたん | 【5分で分かる】G検定に合格するための勉強方法！ |
| O8FWIWTXYQw | below_min_score_or_cutoff | 23 | prog | Git | ともすた \| たにぐち まこと | Visual Studio Codeで学ぶ Git + GitHub |
| jCajk34i_fk | below_min_score_or_cutoff | 23 | prog | JavaScript | SAMURAI ENGINEER [侍エンジニア] | JavaScriptとは？特徴や将来性から合わせて学ぶべきスキルをわかりやすく紹介 |
| mYOAY-xF5wk | below_min_score_or_cutoff | 23 | prog | SQL | 徳田 啓【プログラミング学習チャンネル】 | データベースとは？【分かりやすい解説シリーズ #5】【プログラミング】 |
| ODngv89ra4I | below_min_score_or_cutoff | 23 | prog | SQL | キノコード / プログラミング学習チャンネル | SQLとは？｜データベース言語のSQLについて、できることなど含めて3分でわかりやすく解説 |
| fJLS2t7Xc_k | below_min_score_or_cutoff | 23 | data | 統計 | スタビジ【誰でもAIデータサイエンス】byウマたん | 【6分で分かる】p値とは！？ |
| 2JTiaZq5oHs | below_min_score_or_cutoff | 23 | data | Excel | PC活用ちゃんねる | 【Excel】クイック分析ツールの使い方｜少しだけ作業が速くなるかも |
| 8-TM6Qft0RM | below_min_score_or_cutoff | 23 | data | BI | ITツール学習 | PowerBIとExcelの機能比較と使い分けについて解説【BIツール】【自動化】 |
| xyv1qBG_zkQ | below_min_score_or_cutoff | 23 | shikaku | IT | ITパスポート【爆速合格】 | 【初学者必見】ITパスポートに1週間で合格するために最初にやってほしいこと |
| Vf8yxtXJXTo | below_min_score_or_cutoff | 23 | prog | SQL | ストハピストレートハッピー | Accessを使って、SQLを学習しよう。その１（とりあえずSQLを使って全件表示してみる） |
| 6r-zrvR02GY | below_min_score_or_cutoff | 23 | prog | SQL | だれでもエンジニア / 山浦清透 | 知らないと恥をかくIT用語「SQL」を解説！DBとの違いを説明できますか？ |
| 7UKSap2qPEU | below_min_score_or_cutoff | 23 | biz | Word | パソコン上達!Nagomiチャンネル | Word【テキストボックス】の入力方法3選！ |
| YEMuA0pz9O8 | below_min_score_or_cutoff | 23 | data | BI | 業務効率化・データ活用ちゃんねる | 【ChatGPT活用】Power BIでのデータ分析でAIを活用する！ |
| DTY3RBkXQBA | below_min_score_or_cutoff | 23 | prog | Git | MIXI TECH&DESIGN  | Git 研修【MIXI 25新卒技術研修】 |
| 6uAv8QZ4eZg | below_min_score_or_cutoff | 23 | marke | SEO | SEOならミエルカチャンネル | 【SEO対策の教科書】800サイト分析でわかった“順位が上がる”考え方と実践法 |
| Oukgp-UrQEw | below_min_score_or_cutoff | 23 | english | ビジネス英語 | Berlitz Japan | 【聞き流し】ネイティブが厳選！英語ビジネス会議での基本頻出フレーズ50 |
| FNHYcmZjB9U | below_min_score_or_cutoff | 22 | prog | インフラ | ひろゆき実況Y【切り抜き】 | Webエンジニアの給料や年収どれくらいか知ってるの？未経験で転職したい人はよく考えろ【ひろゆき切り抜き 論破 プログラミング SE】 |
| J85usROCWVI | below_min_score_or_cutoff | 22 | prog | SQL | こいこいの人工知能研究室 | SQLを鬼神の如く練習する方法 |
| Jdr-vU9zotU | below_min_score_or_cutoff | 22 | prog | SQL | ITすきま教室【ITパスポート.基本情報技術者試験.高校情報】 | SQL（基本編その１）／基本情報技術者 |
| DEPO58ZotE8 | below_min_score_or_cutoff | 22 | biz | Word | パソコン上達!Nagomiチャンネル | Word基本①　ワードの基本設定、各名称について |
| y0g7OuJpTno | below_min_score_or_cutoff | 22 | data | 統計 | 田中嘉博 | P値と帰無仮説について専門用語も数式も使わずにざっくりとしたイメージを説明してしまう動画 |
| Hj3kVVSyZ-U | below_min_score_or_cutoff | 22 | marke | SEO | スタビジ【誰でもAIデータサイエンス】byウマたん | 【5分で分かる】SEOの基本についてアニメーションで簡単に理解しよう！ |
| bWr3gmJl_C4 | below_min_score_or_cutoff | 22 | shikaku | IT | やるかやられるかチャンネル | 【基本情報技術者試験】あなたにおすすめの科目B参考書はこれ！【2023年新課程対応】 |
| cXQj6Dwd2cI | below_min_score_or_cutoff | 22 | prog | SQL | ITを分かりやすく解説【基本情報技術者試験・ITパスポート・プログラミング講座】 | 【データベース】ストアドプロシージャとは |
| dINHpb7SWJY | below_min_score_or_cutoff | 22 | shikaku | IT | 【資格100個合格廃人】脱線おじさんの独学記 | 【2週間で合格】ITパスポートの勉強ノウハウ大公開【エンジニア直伝】 |
| IFGZInADZ3A | below_min_score_or_cutoff | 21 | english | ビジネス英語 | NAOMI CHANNEL WORLD - 英会話・ビジネス英語・アメリカ情報 | ビジネス英語メールの書き方！ 絶対に使える、あるあるメール英語表現ご紹介 |
| 9PjSHbn8VQA | below_min_score_or_cutoff | 21 | prog | SQL | 徳田 啓【プログラミング学習チャンネル】 | PHPからデータベースを操作する手順（テンプレ）【プログラミング】 |
| 8Mpy0Kknmrk | below_min_score_or_cutoff | 21 | data | 統計 | いまにゅのAIプログラミング塾 | 統計学と機械学習 \| 知っておきたいIT用語シリーズ |
| 82LJ2Y5EqsE | below_min_score_or_cutoff | 21 | marke | SNS | 飲食店経営ワンゼミ | 【今からでも間に合う！飲食店インスタの始め方】飲食店のインスタ集客のキホン① |
| J_dHTj2zLwA | channel_cap | 30 | english | ビジネス英語 | PIVOT 公式チャンネル | 【英語のアウトプットを自動化せよ】英語学習をしても話せない理由とは？英語学習をやり尽くした元商社マンが解説／会話力向上に不可欠な要素とは／英語脳の作り方／英語を自動化するトレーニングを実践 |
| 38hw3qy_gOg | channel_cap | 29 | marke | SNS | さき-インスタの大学 | 【この1本でOK！】完全初心者でもできるインスタグラムの始め方！ |
| ImKhVN1Vf4I | channel_cap | 29 | marke | SNS | さき-インスタの大学 | 【フィード実践】インスタ投稿の作り方をフォロワー50万人インスタ運用者が実演して教えます！ |
| v5lpFzSwKbc | channel_cap | 29 | prog | Python | Pythonプログラミング VTuber サプー | 【Python 猛特訓】100本ノックで基礎力を向上させよう！プログラミング初心者向けの厳選100問を出題！ |
| AoGmv8ljC0Y | channel_cap | 29 | prog | SQL | Pythonプログラミング VTuber サプー | 【SQL入門】PostgreSQLでデータベース操作を学ぼう！〜 初心者向け 〜 |
| hDp9eVqs1-w | channel_cap | 29 | shikaku | 宅建 | 棚田行政書士の不動産大学【公式チャンネル・宅建】 | 【最新：宅建おすすめ参考書７選】こんなに違う！令和８年宅建試験の合格を目指す方へ、おすすめの参考書、テキスト、問題集を初心者向けに解説講義。 |
| 1ItmFLy0A1s | channel_cap | 29 | prog | Git | Pythonプログラミング VTuber サプー | 【コードレビューのやり方】初心者向け〜GitHubでの操作も解説！〜 |
| iumNs4pHPtw | channel_cap | 29 | shikaku | 宅建 | 棚田行政書士の不動産大学【公式チャンネル・宅建】 | 【宅建　テキストと問題集の正しい使い方！】初心者受験生必見。効率的に勉強するための勉強法の基本を解説講義。宅建合格ラジオ。 |
| EILA2SMLlrE | channel_cap | 29 | shikaku | 宅建 | 棚田行政書士の不動産大学【公式チャンネル・宅建】 | 【テキストを読み込むな！】宅建の法令上の制限で苦戦する原因はこれ。効率的な勉強法を初心者向けに解説講義。 |
| B8WnCAOcheM | channel_cap | 28 | prog | Python | Pythonプログラミング VTuber サプー | 【VSCode】無料エディターのVSCodeをPythonコーディング用にカスタマイズしよう！〜初心者向け〜 |
| G1e1y-D_d0s | channel_cap | 28 | marke | SNS | さき-インスタの大学 | 【10分でわかる！】インスタフォロワー1000人までの増やし方4ステップ |
| E0nDKxVDK0o | channel_cap | 28 | marke | SNS | さき-インスタの大学 | 【これ1本でOK！】0からでもちゃんと伸びるインスタの始め方を解説します！ |
| d0xkCp7b3FU | channel_cap | 28 | shikaku | 宅建 | 棚田行政書士の不動産大学【公式チャンネル・宅建】 | 【今から間に合わせる宅建勉強法】効率的なやり方を具体的に教えます！４月スタートで宅建に合格するための効率的な勉強法を解説します。 |
| pe5DP2-C0cw | channel_cap | 28 | prog | Web開発 | キノコード / プログラミング学習チャンネル | 【Python超入門講座】02.Pythonとは？｜Pythonの特徴やできることなどをわかりやすく解説【プログラミング初心者向け】 |
| jyZ1D9dP4fI | post_ingest_channel_cap | 31 | ai | 画像生成 | mikimiki web スクール | 【最新版】超初心者OK! 最強画像生成AI Midjourneyの始め方・基礎講座(資料付き） |
| g5q8xIQPbbs | post_ingest_channel_cap | 29 | prog | Python | キノコード / プログラミング学習チャンネル | 30分で応用まで一気に！【Python入門・応用講座】16.関数｜関数はレシピを記憶させるようなもの（初心者にもわかりやすく説明） |
| 16_SUESqk8g | post_ingest_money_safety | 32 | money | NISA | フェルミ漫画大学 | 【新NISA完全攻略】月5万円から始める「リアルすぎる」1億円の作り方【山口 貴大(ライオン兄さん)】 |
| O1q6xsWPAYE | post_ingest_money_safety | 32 | money | NISA | BANK ACADEMY / バンクアカデミー | 【2025年からでも遅くない】新NISAのやさしい始め方を超初心者向けに解説！おすすめ銘柄や手続きの流れも完全ガイド |
| EOeNtyNdLVw | post_ingest_money_safety | 32 | money | NISA | BANK ACADEMY / バンクアカデミー | 【世界一やさしい】iDeCoの入門知識や知っておくべき情報を解説！NISAとの比較、おすすめ銘柄、受け取り方の出口戦略も完全ガイド |
| Newn9NY24WE | post_ingest_money_safety | 31 | money | 投資 | 松井証券_MatsuiSecurities | "投資信託"の総まとめ!! ｢オルカン｣｢S&P500｣｢日経平均｣…初心者が買うべき投信はどれ？定期預金とも比較！【マヂカルラブリーと学ぶ 松井証券 資産運用!学べる予備校 Season1 #3】 |
| KssJh3fhlQM | post_ingest_money_safety | 30 | money | NISA | 節約オタクふゆこ | 【超初心者向け】新NISAはコレやっとけばOK！資産を増やす戦略を徹底解説【おすすめ投資信託】【インデックス投資】 |
| vnIZNoMZk8M | post_ingest_money_safety | 29 | money | NISA | 脱・税理士スガワラくん | 【新NISA】初心者は’’コレ’’で失敗します！お得な制度に潜む罠とは？ |
| gF2r8lp_DqY | post_ingest_money_safety | 29 | money | 家計 | きみチャンネル | 【最新版】結局これが1番お金が貯まる！5週間やりくり節約主婦の楽しみながら緩い節約生活で100万円貯める習慣まとめ |
| 3JBvYkIUjZE | post_ingest_money_safety | 29 | money | 投資 | がまぐち夫婦の節約チャンネル | 【投資初心者へ】結局インデックス投資が最強である理由を徹底解説！これからの日本は節約→貯金→投資が必須になります、、、。 |
| tAUnHeTWOuc | post_ingest_money_safety | 28 | money | 家計 | 4人家族ぴーちの節約術 | 【人生を変えた節約術】夫の手取り20万円台で4000万円貯めた方法15選！4人家族の節約生活 |
| Oqc9PzI_RTc | post_ingest_money_safety | 28 | money | NISA | あき姉 元銀行員FPが教える40,50代向け資産形成術 | 【iDeco 始め方】40,50代が今からiDeCoやるならコレだけで老後安泰 |
| nLWWowcotaw | post_ingest_money_safety | 28 | money | NISA | 『資産保全学』50,60代の賢い資産の守り方 | 【2026年対応】50代60代の新NISA、この３つの流れで始めれば９割問題ありません！ |
| ztWlPjrCx7E | post_ingest_money_safety | 28 | money | NISA | ななこ【シニアとお金】 | 【月1万円の積立はヤバい】50代60代の新NISA！積立額は月○万円だと超優秀です！9割の人ははこれで老後安泰【資産運用/投資】 |
| 16_SUESqk8g | money_deny_title:1億円 | 32 | money | NISA | フェルミ漫画大学 | 【新NISA完全攻略】月5万円から始める「リアルすぎる」1億円の作り方【山口 貴大(ライオン兄さん)】 |
| O1q6xsWPAYE | money_deny_title:おすすめ銘柄 | 32 | money | NISA | BANK ACADEMY / バンクアカデミー | 【2025年からでも遅くない】新NISAのやさしい始め方を超初心者向けに解説！おすすめ銘柄や手続きの流れも完全ガイド |
| EOeNtyNdLVw | money_deny_title:おすすめ銘柄 | 32 | money | NISA | BANK ACADEMY / バンクアカデミー | 【世界一やさしい】iDeCoの入門知識や知っておくべき情報を解説！NISAとの比較、おすすめ銘柄、受け取り方の出口戦略も完全ガイド |
| Newn9NY24WE | money_deny_title:買うべき | 31 | money | 投資 | 松井証券_MatsuiSecurities | "投資信託"の総まとめ!! ｢オルカン｣｢S&P500｣｢日経平均｣…初心者が買うべき投信はどれ？定期預金とも比較！【マヂカルラブリーと学ぶ 松井証券 資産運用!学べる予備校 Season1 #3】 |
| td3uNiuPovQ | money_safety_scope | 30 | money | 投資 | 両学長 リベラルアーツ大学 | 【再放送】【改訂版】新しい「ほったらかし投資術」について解説【株式投資編】：（アニメ動画）第292回 |
| KssJh3fhlQM | money_deny_title:おすすめ投資信託 | 30 | money | NISA | 節約オタクふゆこ | 【超初心者向け】新NISAはコレやっとけばOK！資産を増やす戦略を徹底解説【おすすめ投資信託】【インデックス投資】 |
| vnIZNoMZk8M | money_deny_title:失敗します | 29 | money | NISA | 脱・税理士スガワラくん | 【新NISA】初心者は’’コレ’’で失敗します！お得な制度に潜む罠とは？ |
| W4KTv2nPhgo | deny_title:絶対 | 29 | money | 家計 | 両学長 リベラルアーツ大学 | 【再放送】【家計管理の考え方】「絶対に把握すべき3つのこと」を解説します【お金の勉強 初級編】：（アニメ動画）第42回 |
| gF2r8lp_DqY | money_deny_title:[0-9０-９]+万円.*貯め | 29 | money | 家計 | きみチャンネル | 【最新版】結局これが1番お金が貯まる！5週間やりくり節約主婦の楽しみながら緩い節約生活で100万円貯める習慣まとめ |
| 3JBvYkIUjZE | money_deny_title:最強 | 29 | money | 投資 | がまぐち夫婦の節約チャンネル | 【投資初心者へ】結局インデックス投資が最強である理由を徹底解説！これからの日本は節約→貯金→投資が必須になります、、、。 |
| iVdSpq4lle4 | money_deny_title:おすすめ銘柄 | 29 | money | NISA | BANK ACADEMY / バンクアカデミー | 【2026年からでも間に合う】新NISAの始め方を世界一やさしく解説！おすすめ銘柄や手続きの流れも総まとめ |
| JGW8kh9YkEg | money_deny_title:おすすめ銘柄 | 29 | money | NISA | BANK ACADEMY / バンクアカデミー | 【決定版】50代・60代の新NISAのやさしい始め方！おすすめ銘柄や出口戦略も初心者向けに解説 |
| tAUnHeTWOuc | money_deny_title:[0-9０-９]+万円.*貯め | 28 | money | 家計 | 4人家族ぴーちの節約術 | 【人生を変えた節約術】夫の手取り20万円台で4000万円貯めた方法15選！4人家族の節約生活 |
| EL5J5GJDaUk | deny_title:誰でも | 28 | money | 家計 | 両学長 リベラルアーツ大学 | 【再放送】【誰でもできる！】目指せ+3万円！「貯まる家計簿」カスタマイズを紹介【貯める編】：（アニメ動画）第132回 |
| Oqc9PzI_RTc | money_deny_title:老後安泰 | 28 | money | NISA | あき姉 元銀行員FPが教える40,50代向け資産形成術 | 【iDeco 始め方】40,50代が今からiDeCoやるならコレだけで老後安泰 |
| ztWlPjrCx7E | money_deny_title:老後安泰 | 28 | money | NISA | ななこ【シニアとお金】 | 【月1万円の積立はヤバい】50代60代の新NISA！積立額は月○万円だと超優秀です！9割の人ははこれで老後安泰【資産運用/投資】 |
| WxlXTghnG8M | deny_title:億り人 | 28 | money | NISA | PIVOT 公式チャンネル | 【企業型DCの徹底解説：前編】新NISAよりもお得な、企業型DCの仕組み／驚きの税制優遇／30年間で1900万円貯まる／iDeCo、NISAとの違い／アメリカで億り人が多い理由【投資家の思考法】 |
| r8wcAFTmb7k | below_min_score_or_cutoff | 30 | money | NISA | BANK ACADEMY / バンクアカデミー | 【超初心者向け】つみたてNISAとは？基礎知識やメリットを丁寧に解説！ |
| heIIAwHYywk | below_min_score_or_cutoff | 29 | money | NISA | BANK ACADEMY / バンクアカデミー | 【超初心者向け】iDeCo(個人型確定拠出年金)は本当におトク？メリットやデメリットなど入門知識を解説！ |
| C4-F08EDAvw | below_min_score_or_cutoff | 29 | money | 投資 | BANK ACADEMY / バンクアカデミー | 【超初心者向け】投資信託とは？入門知識やメリット、デメリットを丁寧に解説！ |
| wnUynxpxJS4 | below_min_score_or_cutoff | 28 | money | 投資 | 両学長 リベラルアーツ大学 | 【初心者向け】資産運用って結局どうすれば良いの？に対する具体的回答【超シンプルプラン】【株式投資編】（アニメ動画）：第17回 |
| aoBmdoOeBYc | below_min_score_or_cutoff | 28 | money | 家計 | 両学長 リベラルアーツ大学 | 【家計管理の考え方】「絶対に把握すべき3つのこと」を解説します【お金の勉強 初級編】：（アニメ動画）第42回 |
| iGcY6V5zNQ4 | below_min_score_or_cutoff | 28 | money | 投資 | BANK ACADEMY / バンクアカデミー | 【超初心者向け】インデックス投資の始め方！メリットやデメリットもあわせて解説 |
| fAO7KqQ_dEk | below_min_score_or_cutoff | 27 | money | 家計 | 【SBI証券公式】ビジネスドライブ! | 【家計簿公開】借金300万円から脱却した30代主婦に密着！誰でも簡単にできる節約術と家計管理方法とは？\|密着！お金の達人 投資家たちのマイルールby SBI証券 |
| dI8RvalbC_s | below_min_score_or_cutoff | 27 | money | 家計 | 節約主婦mari | 【貯金術】元浪費家が貯金できるようになった方法、浪費を抑えるコツ7選 |
| uUz6mFXhI5A | below_min_score_or_cutoff | 27 | money | NISA | ひろゆけ【ひろゆき切り抜き】 | 2025年の新NISAおすすめ銘柄はコレ！以前に持っていた●●株は売りました…【ひろゆき 切り抜き】 |
| KGZGhm5kGiw | below_min_score_or_cutoff | 27 | money | NISA | 両学長 リベラルアーツ大学 | 【お得なのはどっち？】NISAとiDeCoの税金の違い＆どちらを選べばよいかを解説【リベ大公式切り抜き】 |
| jHrat4vwhFI | below_min_score_or_cutoff | 27 | money | NISA | 節約オタクふゆこ | 【新NISA始めた人に警告】新NISA制度でよくある勘違い6選【新NISA/つみたて投資枠/成長投資枠】 |
| Ack4h5T9eW0 | below_min_score_or_cutoff | 27 | money | 投資 | BANK ACADEMY / バンクアカデミー | 【イラスト解説】投資信託の複利ってどう効いている？つみたてNISAにおける必須の知識！ |
| 4ezOCPlgNVM | below_min_score_or_cutoff | 27 | money | 投資 | 投資うさぎ「会話で解説」 | 【新NISA】インデックス投資に複利効果はあるのか？ |
| gxvsRqKPxCE | below_min_score_or_cutoff | 27 | money | 投資 | 両学長 リベラルアーツ大学 | 【再放送】【失敗回避法】インデックス投資の魅力と「失敗させないためのコツ」5選【株式投資編】：（アニメ動画）第239回 |
| -eq0lde_KSU | below_min_score_or_cutoff | 27 | money | 投資 | 投資入門アニメ | 投資信託の複利はどう効くのか　基準価額と口数どう変わる？ |
| 65iQ7_17vTs | below_min_score_or_cutoff | 27 | money | NISA | しばとん投資信託 | 【今すぐやめて】新NISAで50代・60代が高確率でやっちゃう５つの大損行為 |
| NkpElNYzpIE | below_min_score_or_cutoff | 27 | money | 家計 | 両学長 リベラルアーツ大学 | 【お金の授業 29限目】家計管理をマスターしよう&家計改善チェックリスト【改訂版 お金の大学P154～P163】 |
| j3cB3gr1aeg | below_min_score_or_cutoff | 27 | money | 家計 | komaの家計簿〜節約生活〜 | 【家計管理】徹底解説！キャッシュレスメインのお金の管理方法/節約専業主婦/手取り約30万円５人家族/ |
| ZySlhNzy5mM | below_min_score_or_cutoff | 27 | money | 投資 | ダイヤモンド公式チャンネル | 『2026年の新NISAで買うべき投資信託は?』基本となるインデックス投信を選ぶポイントと注意点、3年目の新NISAで考えるべきこと、おススメ投資信託3本を紹介! |
| 3CbHnh1LvcA | below_min_score_or_cutoff | 27 | money | 家計 | ひだくま夫婦の家計管理🧸 | 【初心者でも簡単】袋分け家計管理のやり方を紹介！│家計簿│給料日ルーティン│封筒貯金ファイル |
| hNXxoo7IS64 | below_min_score_or_cutoff | 27 | money | 家計 | とんと | 【家計管理】来年の貯蓄準備はじめます🙂💪予算を組んでベストな貯蓄目標をたてる方法✏️｜音声あり |
| xQk-HeUZ9pg | below_min_score_or_cutoff | 27 | money | 家計 | 4人家族ぴーちの節約術 | 【お金が永遠に増える】4500万円貯めた節約主婦の家計管理方法！4人家族の節約術/家計管理術 |
| qDzIWzSSI20 | below_min_score_or_cutoff | 27 | money | NISA | FPナナコ【働く女性のお金の教養教室】 | はじめてでもやさしくわかる！iDeCoの超入門 |
| QMkyAS4IKuA | below_min_score_or_cutoff | 26 | money | NISA | 両学長 リベラルアーツ大学 | 第7回 NISAと積立NISAって何？【お金の勉強 株式投資編】 |
| 3J9Piu8nTCc | below_min_score_or_cutoff | 26 | money | NISA | 両学長 リベラルアーツ大学 | 【再放送】【2022年からほぼ全員対象】iDeCoは老後資金問題の解決策になるのか？よくある質問6つに回答【株式投資編】：（アニメ動画）第134回 |
| u60vNsYEOZ0 | below_min_score_or_cutoff | 26 | money | 家計 | フェルミ漫画大学 | 【要約】見るだけでお金が貯まる 賢者のノート【水上克朗】 |
| wp1MychqRIg | below_min_score_or_cutoff | 26 | money | 家計 | 4人家族ぴーちの節約術 | 【家計簿公開】4人家族月22万円で豊かな暮らし♪生活費を下げる方法！節約主婦の節約術 |
| VLE32fv_eQg | below_min_score_or_cutoff | 26 | money | 家計 | 両学長 リベラルアーツ大学 | 【超キホン】家計管理に役立つ、リベ大流「予算の立て方」を分かりやすく紹介【リベ大公式切り抜き】 |
| dK6S7_zygFg | below_min_score_or_cutoff | 26 | money | 家計 | 節約主婦mari | 【貯金のコツ】家計管理歴5年の私がおすすめしたい、長く続けるコツ7選 |
| G9aXqQLGCNc | below_min_score_or_cutoff | 26 | money | NISA | アシスト労務チャンネル | 【iDeCo】しくみ・メリット・デメリットを社労士が解説！！ |
| 7JFIwdxQq1o | below_min_score_or_cutoff | 25 | money | 投資 | ひろゆきの部屋【ひろゆき, hiroyuki】切り抜き | 【ひろゆき 投資】庶民が投資信託をやるとどれだけ損するか教えます。金持ち以外は絶対にやってはいけません【 切り抜き 積立NISA インデックスファンド 中田敦彦のyoutube大学 hiroyuki】 |
| khIg-kYpy5I | below_min_score_or_cutoff | 25 | money | NISA | FLYING ACEアカデミー【資産形成チャンネル】 | 【会社員の方必見】『選択性確定拠出年金』と「iDeCo」はいったいどちらがお得⁉年収別シミュレーションで超分かりやすく解説！ |
| r2aLEVJL7hI | below_min_score_or_cutoff | 25 | money | NISA | 大人の勉強会  【電卓マン】 | 【解説】iDeCoの基本について解説！　メリット？注意点？【大人の勉強会】 |
| 7ld4-TbG1jA | below_min_score_or_cutoff | 25 | money | 投資 | 中川先生のやさしいビジネス研究 | 初心者の味方。投資信託、インデックスファンドとは？【お金の新常識13】 |
| hAmZpHZnp5s | below_min_score_or_cutoff | 24 | money | 家計 | 節約主婦mari | 【お金を貯めたい人へ】貯まる人の特徴4選！真似してみよう/節約/家計簿 |
| vfqXnXkDyPM | below_min_score_or_cutoff | 24 | money | 家計 | あれもこれもん | 【お金を貯める方法】私が成功した貯金方法3選｜貯金が増える仕組み｜真似すれば絶対貯まる！｜貯金をする習慣作り【無理をしない貯金術】 |
| lZX9TCmhBLI | below_min_score_or_cutoff | 24 | money | 投資 | トウシル [楽天証券] | 【3分でわかる投資信託】ゼロから始める！投資信託（その１：仕組み編） |
| Po1565UmpSc | below_min_score_or_cutoff | 24 | money | 投資 | ZAi探の解説動画チャンネル | インデックス投資とは何か？わかりやすく解説【株式投資】 |
| -l8V23HR-OQ | below_min_score_or_cutoff | 24 | money | 家計 | ひだくま夫婦の家計管理🧸 | 【家計管理の基本】項目ごとの予算を立てる方法を紹介！│家計簿 |
| EHznU-2P2SU | below_min_score_or_cutoff | 21 | money | 投資 | FFG公式チャンネル | 【投資信託】インデックス運用とアクティブ運用の違い　#投資信託 #インデックス #アクティブ |
| bekqvm_Hfsw | channel_cap | 29 | money | NISA | コアラ先生の時事ネタ祭り | 【アニメで解説】初心者でもわかるiDeCo(イデコ)の始め方～実践編～ |
| a1VE2ZxsZPE | channel_cap | 28 | money | 投資 | コアラ先生の時事ネタ祭り | 【完全図解】投資信託ってどんな仕組み？ETFとの違いは？新NISA必須知識！ |
| E-9w7p6hVbs | channel_cap | 28 | money | 投資 | コアラ先生の時事ネタ祭り | 【アニメで解説】株式投資初心者が最初にやるべき「インデックス投資」とは？ |
| 6tSC9d1g3qU | post_ingest_money_safety | 29 | money | NISA | オタク会計士ch【山田真哉】少しだけお金で得する | 【超改正】2026年4月､iDeCoが不要になる人続出！年12万円の節税も【会社員･自営業･公務員/企業型DC確定拠出年金･マッチング/DB確定給付･共済/手数料･出口戦略/いつから･わかりやすく】 |
| nLWWowcotaw | post_ingest_money_safety | 28 | money | NISA | 『資産保全学』50,60代の賢い資産の守り方 | 【2026年対応】50代60代の新NISA、この３つの流れで始めれば９割問題ありません！ |
