# Claude引継書: Manapick本体の監査・改善と本番反映確認

更新日: 2026-11-01 (JST)

## 0. この引継ぎの対象

- 対象は **Manapick本体 `manapick.app` のみ**。
- **追記（2026-11-01）: SSD256GBの容量不足のため、正本は `/Volumes/HDD2TB/20_開発/Manapick/01_ACTIVE_REPOS/manapick-repo` に移行した。SSD上の旧コピーは更新しない。** 動画追加の記録は `docs/content/2026-11-01-freshness-additions.md`。
- 正本リポジトリ（移行前）: `/Volumes/SSD256GB/My Folder/02_CODEX/Manapick/01_ACTIVE_REPOS/manapick-repo`
- Git remote: `https://github.com/auto-Tech513/manapick.git`
- ブランチ: `main`
- 本体の今回の実装commit: `b38c9fe083a75c4ac19aa13e09cbded58a197a30` (`fix: verify content freshness and improve network links`)
- この作業では `manapick AI` / `manapick license` / `manapick career` / `manapick company` の各リポジトリを変更していない。
- Claude側では、まずこの正本リポジトリと本番の状態を確認し、下記の未解決事項を優先して扱う。既に反映済みと推定してはならない。

## 1. 最重要: 本番反映状態

GitHubへのpushは成功し、GitHub `main` の先端が上記commitであることを確認した。一方、push後の本番確認では、公開サイトが今回の成果物に切り替わっていなかった。

2026-11-01のHTTP確認結果:

- `https://manapick.app/network/` はHTTP 200だが、HTMLのtitle・description・構造化データは旧版のまま。今回追加したmanapick company案内セクションも、本番HTMLでは確認できなかった。
- `https://manapick.pages.dev/network/` も同じ旧版HTMLだった。
- `https://manapick.app/` はHTTP 200だが、HTML内の動画掲載数は703本のまま。ローカル正本の動画数701本と一致しなかった。
- URLに確認用クエリを付けても旧版HTMLだった。
- GitHubリポジトリのDeployments APIは空だった。ただし、Cloudflare PagesのGit連携でGitHub Deployments記録を作らない構成の可能性もあるため、これだけでデプロイ未実行・失敗の原因とは断定できない。
- Cloudflareダッシュボード/APIでデプロイ履歴・ビルドログを確認していない。したがって、原因は未特定。キャッシュ・Webhook・ビルド・公開先設定のどれかと断定しない。

### Claude側で最初にすること

1. `git -C "/Volumes/SSD256GB/My Folder/02_CODEX/Manapick/01_ACTIVE_REPOS/manapick-repo" status --short` と `git log -1 --oneline` で正本・HEAD・作業ツリーを確認する。
2. Cloudflare Pagesの対象プロジェクト名、Production branch、最新deploymentのcommit SHA、build status/log、production aliasを確認する。Cloudflare操作は利用者の権限・指示に従い、別プロジェクトへ変更しない。
3. Cloudflare側のlatest deployment SHAが `b38c9fe...` 以降か確認。異なる場合は、まずGit integration/build logsを調べる。設定を推測で変更しない。
4. 公開後、次を再取得してローカルの期待値と一致するまで完了扱いにしない。
   - `/network/`: titleに「企業情報」、companyリンクの実在、OrganizationのsameAs/subOrganization
   - `/`: 「701本」の表示（実データ変更が別commitでなければ）
   - `/llms.txt`: 「YouTube公式動画」という古い説明がないこと
5. HTTP statusだけで反映済みと判断せず、HTML本文・構造化データも確認する。

本番の旧HTMLをこの引継ぎ内で再デプロイ・手動アップロードしてはいない。pushと本番反映は別の状態として扱う。

## 2. 今回実施した改善

### 2.1 動画データの公開状態・説明

- ローカル正本の動画数は **703 → 701**。
- `nkzi5jnhBOQ` と `Av9EjgOJKrM` は、YouTube Data APIの応答対象外だったため、個別にYouTube watchページのプレイヤー状態を確認。双方ともYouTubeが「非公開動画」と明示していたため `content/videos.json` から除外した。
- これらのytidがroadmap/guide等の別参照に残っていないことをリポジトリ内検索で確認した。
- 残る701件について `npm run content:availability` を再実行し、701/701件の照合、API欠落0、利用不可0、公開日不一致0を確認した (監査時刻 `2026-11-01T06:21:03Z`)。
- 「YouTube公式動画だけ」と誤読されうる表現を修正。ManapickはYouTube上で公開された動画を紹介し、YouTube標準リンクまたはYouTube公式プレーヤーで視聴する、という趣旨に統一した。動画のスコア値は変更していない。
- `content/videos.json` の規約・権利軸の既存メモも同じ趣旨に調整し、今後 `score-draft` が作る暫定メモも誤認を誘わない表現に修正した。

### 2.2 コンテンツ鮮度と候補取得

- 監査日 `2026-11-01` 時点で、正本にある最新公開日は `2026-07-16`。公開日から **107日** 経過し、直近90日以内の公開動画は **0件**。
- 10公開ジャンル中、最新動画が180日を超えているジャンルは5つ:
  - 動画編集 `video`: 253日
  - データ分析 `data`: 181日
  - Webマーケ `marke`: 273日
  - 会計資格 `kaikei`: 207日
  - お金 `money`: 302日
- `scripts/fetch-candidates.mjs` と `scripts/pipeline-config.json` の候補検索既定をYouTube公開日順 (`order=date`) に変更。CLIで `date` / `relevance` / `viewCount` / `rating` / `title` / `videoCount` を指定でき、無効値はエラーにする。
- 候補取得は候補発見の改善であり、採用・掲載を自動承認する変更ではない。人による確認フローを維持する。
- 通常の `content:audit` では鮮度超過を警告扱いにし、`content:freshness` では鮮度超過をエラーにするよう分離した。更新されていない動画を新しいことにしたり、publishedAtを偽装したりはしていない。
- `scripts/fetch-candidates.mjs` の2週ローテーションは通常設定で週あたり39件/84件のクエリ計画となり、各週90件以内。以前 `--max-queries 1` を使った確認で `[123,0]` と見えたのは上限を人為的に1にしたためで、通常ローテーションの不具合ではなかった。ローテーション設定自体は変更していない。

### 2.3 姉妹サイト連携

- `app/network/page.tsx` にmanapick company向け独立セクションを追加。4サイトの学習者向け導線と、法人向け案内を混同しない構成。
- 遷移先: `https://company.manapick.app/?utm_source=manapick&utm_medium=network&utm_campaign=manapick_to_company#companies`。別タブ、`noopener noreferrer`。
- Networkページのtitle/descriptionとJSON-LDに会社向け情報を追加。
- `app/layout.tsx` のOrganization `sameAs` と `subOrganization` にmanapick companyを追加。
- `public/llms.txt` とその生成元 `scripts/generate-llms.mjs` を更新。
- 公開サイト内容はこのターンでは確認できていないため、companyサイトの最新サービス詳細を推測して本文へ書き足していない。

## 3. 検証結果

- `npx next build`: 成功、静的ページ **873** 件を生成。
- `npm run content:audit`: 成功。701動画、10ジャンル、10ロードマップ。警告21件。
- `npm run content:availability`: 701件照合、利用不可0、API欠落0、公開日不一致0。
- `npm run site:links`: 静的HTML 872ファイルに対する内部リンク **54,407件** 合格。
- `git diff --check`: 合格。
- `npm run news:test`: 8/8成功。
- `npm run lint`: 成功。
- Local static exportを実ブラウザで確認。トップは375/1280/1920px、Networkは375/1280/1920pxで document/body幅の横はみ出しなし。Network画面のcompany CTAは375pxでも幅351px・高さ約50px、1280/1920pxでは幅220px・高さ約69pxで表示。
- NetworkページのローカルQA画像:
  - `docs/screenshots/qa-network-375.png`
  - `docs/screenshots/qa-network-1280.png`
  - `docs/screenshots/qa-network-1920.png`
- 一時ローカルサーバーとPlaywrightセッションは終了済み。

## 4. 未解決事項・注意点

1. `npm run content:freshness` は **失敗が想定される実データ上の鮮度アラート**。確認時は最新107日と上記5ジャンルが超過。
2. 15件でaxis breakdownが保存されていない警告がある。スコア集計値だけを根拠なく7軸に分割しない。視聴・根拠確認後にのみ補完する。
3. `recent90=0` と表示される状態で「毎週更新」「常に最新」と強く訴求するのは避ける。更新頻度を約束するコピーと実績を一致させる必要がある。
4. 今回の作業で検索順位・流入増は計測しておらず、順位上昇や流入増を成果として主張できない。公開後にSearch Console/GA4の実測で評価する。
5. Cloudflareの反映遅延/失敗の原因は未調査。Cloudflareアカウントを確認せず原因を推測しない。

## 5. commitに含まれる主なファイル

- 動画・説明: `content/videos.json`, `content/site-faq.ts`, `app/page.tsx`, `app/study-plan/page.tsx`, `app/youtube-learning/page.tsx`, `app/guide/page.tsx`, `app/about-score/page.tsx`, `app/disclaimer/page.tsx`, `app/operator/page.tsx`, `components/ManapickApp.tsx`
- Network/SEO: `app/network/page.tsx`, `app/globals.css`, `app/layout.tsx`, `lib/brand-links.ts`, `scripts/generate-llms.mjs`, `public/llms.txt`
- 鮮度・候補取得: `scripts/audit-content.mjs`, `scripts/fetch-candidates.mjs`, `scripts/pipeline-config.json`, `scripts/score-draft.mjs`, `package.json`
- QA画像: `docs/screenshots/qa-network-{375,1280,1920}.png`

## 6. Claudeへの作業指示

- まず本番デプロイ状況を解決し、実際の本番HTMLがcommitと一致するまでデプロイ完了と言わない。
- 動画の鮮度改善は、YouTube公開状態・埋め込み可否・公開日・内容を確認した候補だけを採用する。動画内容を見ていない状態でレビュー・スコア・confirmedを作らない。
- 調査上の未確認事項を推測で補わない。外部アカウントやCloudflare設定を変更する必要がある場合は、対象プロジェクトと変更内容を明示してから実施する。
- 姉妹サイトのリポジトリ・設定・表示は対象外。今回追加したのはManapick本体からcompanyへの導線と本体側のOrganization情報のみ。
- 今回の作業範囲の成果物は上記の正本リポジトリ内に保存する。別の日付フォルダや旧パスへ同じコードを複製しない。
