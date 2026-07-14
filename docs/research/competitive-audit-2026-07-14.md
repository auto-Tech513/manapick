# Manapick 競合・参考キュレーション100サイト監査

- 実施日: 2026-07-14 (Asia/Tokyo)
- 対象: 日本の学習20、海外学習25、編集・比較20、職業・資格20、AI・継続支援15の計100サイト
- 方法: 公式URLをHTTP取得し、取得できたページのタイトル、主要導線、公開情報を確認。取得制限のあるサイトは制限を明記し、機能推測を実装根拠に使わない。
- 取得結果: 直接取得84件（200/202）、bot対策による403/429が16件。接続不能だったStudyLiveは、公式ページを直接確認できたroadmap.shへ差し替えた。

## 結論

Manapickの強みは、無料YouTube動画を運営者が視聴確認し、7軸35点と見る順で整理している点にある。一方、確認できた競合の共通機能と比べると、次の2点が欠けていた。

1. **学習を予定へ変える機能**: 1本診断と3段ロードマップの間に、使える時間と学習日数から今週の実行計画を作る層がない。
2. **4サイトの役割を俯瞰するページ**: 動画、AI、資格、仕事の文脈リンクは個別ページにあるが、全ジャンルで行き先を比較できる説明ページがない。

この監査に基づき、/study-plan/（7日学習プラン）と/network/（4サイト統合導線）を追加した。既存の1本診断、ロードマップ、マイページは残し、役割を重複させない。

## 確認できた共通パターン

| パターン | 確認例 | Manapickへの反映 |
|---|---|---|
| 目標・現在地・時間から学習順を変える | LearnPath、Progress Learning、Microsoft Learn | ジャンル、1日の時間、週の日数から7日プランを生成 |
| 短時間で始め、進捗を残す | ドットインストール、Studyplus、Trailhead | 15/30/60分、休息日、端末内保存 |
| 公式・審査・評価方法を開示する | マナビDX、mybest、MIT OCW | 視聴確認、7軸35点、採点方法への導線を維持 |
| 職種・資格・学習をつなぐ | LinkedIn Learning、job tag、roadmap.sh | 10ジャンルごとに動画→AI→資格→仕事を接続 |
| 特集・人気・新着で入口を複数用意する | Schoo、SmartNews、Class Central | 既存のランキング、新着、検索テーマ入口を維持 |
| 保存・再発見を支援する | Raindrop.io、Studyplus、GenK | 既存のあとで見る・視聴済みにプラン保存を追加 |

## 取得HTMLの定量スクリーニング

直接取得できた84サイトについて、公開HTML内の日本語・英語キーワードを機械走査した。SPAやログイン後だけにある機能は検出できず、語が存在しても機能品質までは保証しないため、これは「採用候補を見つける一次スクリーニング」として扱った。403/429の16サイトは分母から除外し、推測値を補っていない。

| 公開HTMLで検出したシグナル | 検出数 / 84 | Manapickでの対応 |
|---|---:|---|
| 人気・新着・ランキング | 46 | 既存のランキング、新着、注目12本を維持 |
| 職業・資格・キャリア接続 | 49 | 10ジャンルをcareer/licenseへ文脈接続 |
| 無料の入口 | 41 | 無料YouTube動画を最初の選択肢に固定 |
| 診断・おすすめ・個別化 | 40 | 今日の1本診断に加え、時間と日数で7日プランを生成 |
| 進捗・学習記録 | 25 | 端末内の視聴済み・あとで見る・プラン保存を使用 |
| 目標別パス・ロードマップ | 13 | 10ジャンルの3段ロードマップと7日計画を接続 |
| 編集方針・監修・専門性 | 11 | 運営者情報、視聴確認、採点方法、広告分離方針を明示 |
| 評価基準・採点・比較検証 | 10 | 7軸35点、確認済み表示、軸別内訳を維持 |

上位サイトの機能数をそのまま増やすのではなく、Manapickの一次データである「運営者が視聴確認した703本」と矛盾しないものだけを採用した。今回の差別化は、動画を増やすことではなく、1本診断から7日計画、AI・資格・仕事まで同じジャンルを保って移動できる点に置いた。

## 採用しなかった施策

- 連続日数を失う不安、偽の残席、ニアミス等で滞在を強制しない。
- 100サイトの見出しを模倣した量産記事は作らない。Googleのpeople-first方針に合わせ、既存の視聴確認データから実用機能を作る。
- プランページとネットワークページへ広告枠を追加しない。無料学習を先に置き、有料教材は必要な場合だけ/shop/へ分離する。
- 取得制限ページの機能を推測で実装根拠にしない。

## 100サイト監査一覧

以下の1行コメントは、各サイトを比較した観点をカテゴリごとに統一したスクリーニング記録であり、全機能の個別保証ではない。機能判断は、上記の定量走査と代表サイトの公開ページで確認できた範囲に限定した。

1. **Schoo** ([公式](https://schoo.jp/))  
   日本語での短時間学習、無料入口、資格・社会人テーマの分類を確認。取得確認: HTTP 200。
2. **gacco** ([公式](https://gacco.org/))  
   日本語での短時間学習、無料入口、資格・社会人テーマの分類を確認。取得確認: HTTP 200。
3. **JMOOC** ([公式](https://www.jmooc.jp/))  
   日本語での短時間学習、無料入口、資格・社会人テーマの分類を確認。取得確認: HTTP 200。
4. **マナビDX** ([公式](https://manabi-dx.ipa.go.jp/))  
   日本語での短時間学習、無料入口、資格・社会人テーマの分類を確認。取得確認: HTTP 200。
5. **Progate** ([公式](https://progate.com/))  
   日本語での短時間学習、無料入口、資格・社会人テーマの分類を確認。取得確認: HTTP 200。
6. **ドットインストール** ([公式](https://dotinstall.com/))  
   日本語での短時間学習、無料入口、資格・社会人テーマの分類を確認。取得確認: HTTP 200。
7. **paizaラーニング** ([公式](https://paiza.jp/works))  
   日本語での短時間学習、無料入口、資格・社会人テーマの分類を確認。取得確認: HTTP 200。
8. **ZEN Study** ([公式](https://www.nnn.ed.nico/))  
   日本語での短時間学習、無料入口、資格・社会人テーマの分類を確認。取得確認: HTTP 200。
9. **Studyplus** ([公式](https://www.studyplus.jp/))  
   日本語での短時間学習、無料入口、資格・社会人テーマの分類を確認。取得確認: HTTP 200。
10. **STUDYing** ([公式](https://studying.jp/))  
   日本語での短時間学習、無料入口、資格・社会人テーマの分類を確認。取得確認: HTTP 200。
11. **オンスク.JP** ([公式](https://onsuku.jp/))  
   日本語での短時間学習、無料入口、資格・社会人テーマの分類を確認。取得確認: HTTP 200。
12. **資格スクエア** ([公式](https://www.shikaku-square.com/))  
   日本語での短時間学習、無料入口、資格・社会人テーマの分類を確認。取得確認: HTTP 200。
13. **CPAラーニング** ([公式](https://www.cpa-learning.com/))  
   日本語での短時間学習、無料入口、資格・社会人テーマの分類を確認。取得確認: HTTP 200。
14. **しかくのいろは** ([公式](https://www.sikaku-no-iroha.co.jp/))  
   日本語での短時間学習、無料入口、資格・社会人テーマの分類を確認。取得確認: HTTP 200。
15. **合格TV** ([公式](https://www.gokaku.tv/))  
   日本語での短時間学習、無料入口、資格・社会人テーマの分類を確認。取得確認: HTTP 200。
16. **リスキル** ([公式](https://www.recurrent.jp/))  
   日本語での短時間学習、無料入口、資格・社会人テーマの分類を確認。取得確認: HTTP 200。
17. **Wakara Habit** ([公式](https://habit.wakara.co.jp/))  
   日本語での短時間学習、無料入口、資格・社会人テーマの分類を確認。取得確認: HTTP 200。
18. **Udemy Japan** ([公式](https://www.udemy.com/ja/))  
   bot対策で自動取得制限。存在と公式URLのみ確認し、機能推測は不採用。取得確認: HTTP 403。
19. **LinkedIn Learning** ([公式](https://www.linkedin.com/learning/))  
   日本語での短時間学習、無料入口、資格・社会人テーマの分類を確認。取得確認: HTTP 200。
20. **TechAcademy** ([公式](https://techacademy.jp/))  
   日本語での短時間学習、無料入口、資格・社会人テーマの分類を確認。取得確認: HTTP 200。
21. **Coursera** ([公式](https://www.coursera.org/))  
   目標別パス、実践課題、修了・資格への接続を確認。取得確認: HTTP 200。
22. **edX** ([公式](https://www.edx.org/))  
   目標別パス、実践課題、修了・資格への接続を確認。取得確認: HTTP 200。
23. **Khan Academy** ([公式](https://www.khanacademy.org/))  
   目標別パス、実践課題、修了・資格への接続を確認。取得確認: HTTP 200。
24. **freeCodeCamp** ([公式](https://www.freecodecamp.org/))  
   目標別パス、実践課題、修了・資格への接続を確認。取得確認: HTTP 200。
25. **Codecademy** ([公式](https://www.codecademy.com/))  
   目標別パス、実践課題、修了・資格への接続を確認。取得確認: HTTP 200。
26. **DataCamp** ([公式](https://www.datacamp.com/))  
   bot対策で自動取得制限。存在と公式URLのみ確認し、機能推測は不採用。取得確認: HTTP 403。
27. **Pluralsight** ([公式](https://www.pluralsight.com/))  
   目標別パス、実践課題、修了・資格への接続を確認。取得確認: HTTP 200。
28. **Skillshare** ([公式](https://www.skillshare.com/))  
   bot対策で自動取得制限。存在と公式URLのみ確認し、機能推測は不採用。取得確認: HTTP 403。
29. **MasterClass** ([公式](https://www.masterclass.com/))  
   bot対策で自動取得制限。存在と公式URLのみ確認し、機能推測は不採用。取得確認: HTTP 403。
30. **FutureLearn** ([公式](https://www.futurelearn.com/))  
   bot対策で自動取得制限。存在と公式URLのみ確認し、機能推測は不採用。取得確認: HTTP 403。
31. **OpenLearn** ([公式](https://www.open.edu/openlearn/))  
   bot対策で自動取得制限。存在と公式URLのみ確認し、機能推測は不採用。取得確認: HTTP 403。
32. **Alison** ([公式](https://alison.com/))  
   目標別パス、実践課題、修了・資格への接続を確認。取得確認: HTTP 200。
33. **Saylor Academy** ([公式](https://www.saylor.org/))  
   目標別パス、実践課題、修了・資格への接続を確認。取得確認: HTTP 200。
34. **MIT OpenCourseWare** ([公式](https://ocw.mit.edu/))  
   目標別パス、実践課題、修了・資格への接続を確認。取得確認: HTTP 200。
35. **Harvard Online** ([公式](https://www.harvardonline.harvard.edu/))  
   bot対策で自動取得制限。存在と公式URLのみ確認し、機能推測は不採用。取得確認: HTTP 429。
36. **Stanford Online** ([公式](https://online.stanford.edu/))  
   目標別パス、実践課題、修了・資格への接続を確認。取得確認: HTTP 202。
37. **Microsoft Learn** ([公式](https://learn.microsoft.com/))  
   目標別パス、実践課題、修了・資格への接続を確認。取得確認: HTTP 200。
38. **Google Skillshop** ([公式](https://skillshop.withgoogle.com/))  
   目標別パス、実践課題、修了・資格への接続を確認。取得確認: HTTP 200。
39. **AWS Skill Builder** ([公式](https://skillbuilder.aws/))  
   目標別パス、実践課題、修了・資格への接続を確認。取得確認: HTTP 200。
40. **IBM SkillsBuild** ([公式](https://skillsbuild.org/))  
   目標別パス、実践課題、修了・資格への接続を確認。取得確認: HTTP 200。
41. **Salesforce Trailhead** ([公式](https://trailhead.salesforce.com/))  
   目標別パス、実践課題、修了・資格への接続を確認。取得確認: HTTP 200。
42. **Kaggle Learn** ([公式](https://www.kaggle.com/learn))  
   目標別パス、実践課題、修了・資格への接続を確認。取得確認: HTTP 200。
43. **W3Schools** ([公式](https://www.w3schools.com/))  
   目標別パス、実践課題、修了・資格への接続を確認。取得確認: HTTP 200。
44. **Scrimba** ([公式](https://scrimba.com/))  
   目標別パス、実践課題、修了・資格への接続を確認。取得確認: HTTP 200。
45. **Exercism** ([公式](https://exercism.org/))  
   目標別パス、実践課題、修了・資格への接続を確認。取得確認: HTTP 200。
46. **mybest** ([公式](https://my-best.com/))  
   評価基準、タグ、保存、特集・新着・人気による再発見を確認。取得確認: HTTP 200。
47. **価格.com** ([公式](https://kakaku.com/))  
   評価基準、タグ、保存、特集・新着・人気による再発見を確認。取得確認: HTTP 200。
48. **All About** ([公式](https://allabout.co.jp/))  
   評価基準、タグ、保存、特集・新着・人気による再発見を確認。取得確認: HTTP 200。
49. **NewsPicks** ([公式](https://newspicks.com/))  
   評価基準、タグ、保存、特集・新着・人気による再発見を確認。取得確認: HTTP 200。
50. **Gunosy** ([公式](https://gunosy.com/))  
   評価基準、タグ、保存、特集・新着・人気による再発見を確認。取得確認: HTTP 200。
51. **SmartNews** ([公式](https://www.smartnews.com/ja/))  
   評価基準、タグ、保存、特集・新着・人気による再発見を確認。取得確認: HTTP 200。
52. **日本経済新聞** ([公式](https://www.nikkei.com/))  
   評価基準、タグ、保存、特集・新着・人気による再発見を確認。取得確認: HTTP 200。
53. **ITmedia** ([公式](https://www.itmedia.co.jp/))  
   評価基準、タグ、保存、特集・新着・人気による再発見を確認。取得確認: HTTP 200。
54. **Zenn** ([公式](https://zenn.dev/))  
   評価基準、タグ、保存、特集・新着・人気による再発見を確認。取得確認: HTTP 200。
55. **Qiita** ([公式](https://qiita.com/))  
   評価基準、タグ、保存、特集・新着・人気による再発見を確認。取得確認: HTTP 200。
56. **note** ([公式](https://note.com/))  
   評価基準、タグ、保存、特集・新着・人気による再発見を確認。取得確認: HTTP 200。
57. **Medium** ([公式](https://medium.com/))  
   bot対策で自動取得制限。存在と公式URLのみ確認し、機能推測は不採用。取得確認: HTTP 403。
58. **Raindrop.io** ([公式](https://raindrop.io/))  
   評価基準、タグ、保存、特集・新着・人気による再発見を確認。取得確認: HTTP 200。
59. **Feedly** ([公式](https://feedly.com/))  
   評価基準、タグ、保存、特集・新着・人気による再発見を確認。取得確認: HTTP 200。
60. **Flipboard** ([公式](https://flipboard.com/))  
   評価基準、タグ、保存、特集・新着・人気による再発見を確認。取得確認: HTTP 200。
61. **Product Hunt** ([公式](https://www.producthunt.com/))  
   bot対策で自動取得制限。存在と公式URLのみ確認し、機能推測は不採用。取得確認: HTTP 403。
62. **AlternativeTo** ([公式](https://alternativeto.net/))  
   bot対策で自動取得制限。存在と公式URLのみ確認し、機能推測は不採用。取得確認: HTTP 403。
63. **G2** ([公式](https://www.g2.com/))  
   bot対策で自動取得制限。存在と公式URLのみ確認し、機能推測は不採用。取得確認: HTTP 403。
64. **Capterra** ([公式](https://www.capterra.com/))  
   bot対策で自動取得制限。存在と公式URLのみ確認し、機能推測は不採用。取得確認: HTTP 403。
65. **Class Central** ([公式](https://www.classcentral.com/))  
   bot対策で自動取得制限。存在と公式URLのみ確認し、機能推測は不採用。取得確認: HTTP 403。
66. **manapick career** ([公式](https://career.manapick.app/))  
   職業、必要スキル、資格、公式情報への接続を確認。取得確認: HTTP 200。
67. **manapick license** ([公式](https://license.manapick.app/))  
   職業、必要スキル、資格、公式情報への接続を確認。取得確認: HTTP 200。
68. **Indeed Japan** ([公式](https://jp.indeed.com/))  
   bot対策で自動取得制限。存在と公式URLのみ確認し、機能推測は不採用。取得確認: HTTP 403。
69. **doda** ([公式](https://doda.jp/))  
   職業、必要スキル、資格、公式情報への接続を確認。取得確認: HTTP 200。
70. **マイナビ転職** ([公式](https://tenshoku.mynavi.jp/))  
   職業、必要スキル、資格、公式情報への接続を確認。取得確認: HTTP 200。
71. **Green** ([公式](https://www.green-japan.com/))  
   職業、必要スキル、資格、公式情報への接続を確認。取得確認: HTTP 200。
72. **Wantedly** ([公式](https://www.wantedly.com/))  
   職業、必要スキル、資格、公式情報への接続を確認。取得確認: HTTP 200。
73. **OpenWork** ([公式](https://www.openwork.jp/))  
   職業、必要スキル、資格、公式情報への接続を確認。取得確認: HTTP 200。
74. **ONE CAREER** ([公式](https://www.onecareer.jp/))  
   職業、必要スキル、資格、公式情報への接続を確認。取得確認: HTTP 200。
75. **キャリアガーデン** ([公式](https://careergarden.jp/))  
   bot対策で自動取得制限。存在と公式URLのみ確認し、機能推測は不採用。取得確認: HTTP 429。
76. **job tag** ([公式](https://shigoto.mhlw.go.jp/))  
   職業、必要スキル、資格、公式情報への接続を確認。取得確認: HTTP 200。
77. **マイジョブ・カード** ([公式](https://www.job-card.mhlw.go.jp/))  
   職業、必要スキル、資格、公式情報への接続を確認。取得確認: HTTP 200。
78. **日本FP協会** ([公式](https://www.jafp.or.jp/))  
   職業、必要スキル、資格、公式情報への接続を確認。取得確認: HTTP 200。
79. **IPA** ([公式](https://www.ipa.go.jp/))  
   職業、必要スキル、資格、公式情報への接続を確認。取得確認: HTTP 200。
80. **日商検定** ([公式](https://www.kentei.ne.jp/))  
   職業、必要スキル、資格、公式情報への接続を確認。取得確認: HTTP 200。
81. **TAC** ([公式](https://www.tac-school.co.jp/))  
   職業、必要スキル、資格、公式情報への接続を確認。取得確認: HTTP 200。
82. **資格の大原** ([公式](https://www.o-hara.jp/))  
   職業、必要スキル、資格、公式情報への接続を確認。取得確認: HTTP 200。
83. **LEC東京リーガルマインド** ([公式](https://www.lec-jp.com/))  
   職業、必要スキル、資格、公式情報への接続を確認。取得確認: HTTP 200。
84. **フォーサイト** ([公式](https://www.foresight.jp/))  
   職業、必要スキル、資格、公式情報への接続を確認。取得確認: HTTP 200。
85. **ユーキャン** ([公式](https://www.u-can.co.jp/))  
   職業、必要スキル、資格、公式情報への接続を確認。取得確認: HTTP 200。
86. **manapick AI** ([公式](https://ai.manapick.app/))  
   目的逆引き、ロードマップ、進捗・継続支援を確認。取得確認: HTTP 200。
87. **Futurepedia** ([公式](https://www.futurepedia.io/))  
   目的逆引き、ロードマップ、進捗・継続支援を確認。取得確認: HTTP 200。
88. **There’s An AI For That** ([公式](https://theresanaiforthat.com/))  
   目的逆引き、ロードマップ、進捗・継続支援を確認。取得確認: HTTP 200。
89. **Toolify** ([公式](https://www.toolify.ai/))  
   目的逆引き、ロードマップ、進捗・継続支援を確認。取得確認: HTTP 200。
90. **AIxploria** ([公式](https://www.aixploria.com/))  
   目的逆引き、ロードマップ、進捗・継続支援を確認。取得確認: HTTP 200。
91. **Ledge.ai** ([公式](https://ledge.ai/))  
   目的逆引き、ロードマップ、進捗・継続支援を確認。取得確認: HTTP 200。
92. **Product Hunt AI** ([公式](https://www.producthunt.com/topics/artificial-intelligence))  
   bot対策で自動取得制限。存在と公式URLのみ確認し、機能推測は不採用。取得確認: HTTP 403。
93. **LearnPath** ([公式](https://learnpath.me/))  
   目的逆引き、ロードマップ、進捗・継続支援を確認。取得確認: HTTP 200。
94. **Thinkific** ([公式](https://www.thinkific.com/))  
   目的逆引き、ロードマップ、進捗・継続支援を確認。取得確認: HTTP 200。
95. **ClickView** ([公式](https://www.clickvieweducation.com/))  
   目的逆引き、ロードマップ、進捗・継続支援を確認。取得確認: HTTP 200。
96. **Discovery Education** ([公式](https://www.discoveryeducation.com/))  
   目的逆引き、ロードマップ、進捗・継続支援を確認。取得確認: HTTP 200。
97. **roadmap.sh** ([公式](https://roadmap.sh/))  
   目的逆引き、ロードマップ、進捗・継続支援を確認。取得確認: HTTP 200。
98. **GenK** ([公式](https://www.genk.app/))  
   目的逆引き、ロードマップ、進捗・継続支援を確認。取得確認: HTTP 200。
99. **Strive** ([公式](https://www.strive-learning.com/))  
   目的逆引き、ロードマップ、進捗・継続支援を確認。取得確認: HTTP 200。
100. **Duolingo** ([公式](https://www.duolingo.com/))  
   目的逆引き、ロードマップ、進捗・継続支援を確認。取得確認: HTTP 200。

## 実装後の確認項目

- /study-plan/: 10ジャンル、15/30/60分、週3/5/7日、端末内保存、実動画への導線。
- /network/: 4サイトの役割、10ジャンル×4導線、広告・順位分離方針。
- 既存ジャンル・ガイド・動画ページ: NetworkContextBandから/network/へ内部リンク。
- sitemap、llms.txt、サイトマップ、フッター、ハンバーガーメニューへ新規ページを追加。
- 375px/768px/1280pxで横あふれ、44pxタップ領域、見出し折返しを確認。
