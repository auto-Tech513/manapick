# Manapick 半自動コンテンツ収集パイプライン

Mac mini 上で YouTube Data API v3 の公開メタデータを取得し、§23ルーブリックの暫定採点を付け、人間レビュー後に `content/videos.json` へ取り込むための運用スクリプトです。

Codex サンドボックスでは外部ネットワークとローカル Ollama を使わない前提なので、ここではコード作成のみです。実行は Mac mini で行います。

## ファイル

- `scripts/fetch-candidates.mjs`: YouTube Data API v3 から候補取得
- `scripts/score-draft.mjs`: 7軸ヒューリスティック採点とレビュー草案生成
- `scripts/ingest.mjs`: 採用済みdraftを `content/videos.json` へマージ
- `scripts/audit-video-availability.mjs`: 全掲載動画の公開・埋め込み可否を50件ずつ再確認
- `scripts/pipeline-config.json`: ジャンル/サブジャンル/検索キーワード設定
- `scripts/com.manapick.pipeline.example.plist`: launchd例
- `data/candidates.json`: 生成物。gitignore対象
- `data/drafts.json`: 生成物。gitignore対象

## 1. APIキー設定

`.env` はgitignore済みです。Mac mini上でどちらかを設定します。

```sh
export YT_API_KEY="YOUR_YOUTUBE_DATA_API_KEY"
```

または、リポ直下に `.env` を作ります。

```sh
YT_API_KEY=YOUR_YOUTUBE_DATA_API_KEY
```

秘密情報はコミットしないでください。

## 2. 候補取得

```sh
npm run pipeline:fetch
```

出力: `data/candidates.json`

よく使う例:

```sh
node scripts/fetch-candidates.mjs --genre data,marke --min-views 20000 --fresh-years 5
node scripts/fetch-candidates.mjs --dry-run
```

候補取得は以下を行います。

- `search.list` でキーワード検索
- `videos.list` で長さ、再生数、公開日、チャンネル名を取得
- 既存 `content/videos.json` の `ytid` を除外
- 日本語判定、再生数、鮮度、長さでフィルタ

## 3. 暫定採点

```sh
npm run pipeline:score
```

出力: `data/drafts.json`

ローカルOllamaは既定で試行します。無効化する場合のみ `--no-ollama` を付けます。

```sh
node scripts/score-draft.mjs
node scripts/score-draft.mjs --no-ollama
```

Ollamaの既定モデルは `qwen3.6:35b-a3b` です。`OLLAMA_MODEL` または `--ollama-model` があればそちらを優先します。エンドポイントは `http://localhost:11434/api/generate` 固定です。各対象動画ごとに `OLLAMA ok ytid=...` または `OLLAMA fail ytid=... reason=...` をstderrへ出し、最後に成功数を集計します。接続・生成に失敗した場合はテンプレ草案へフォールバックします。既定タイムアウトは120秒です。

重いモデルを使う場合の例:

```sh
node scripts/score-draft.mjs --limit 5
node scripts/score-draft.mjs --ollama-excellent-only --ollama-timeout 180000
```

採点軸:

- 実用性
- 正確性・鮮度
- 分かりやすさ
- 体系性
- 信頼性
- 視聴体験
- 規約・権利

合計28点以上かつ足切りなしを `excellent: true` にします。これは採用確定ではなく、人間レビューの優先順位です。


## Denylist / リスク語

`scripts/pipeline-config.json` の `exclude_ytids` は、fetch/score/ingestで除外します。現在の除外ID:

- `IcQwLGDzmVQ`
- `YNT-KnjbVkU`
- `hNGAW5Z1vgQ`
- `rN8D_d21Mdk`

`weak_title_terms` は「稼ぐ」「副業」「切り抜き」「食いっぱぐれ」などの強い煽り語です。score-draftでは減点と足切り理由に入り、ingestでは `overrideRisk: true` を付けない限り取り込みません。

## 4. 人間レビュー

`data/drafts.json` を開き、採用するdraftに次のいずれかを付けます。

```json
"accepted": true
```

または:

```json
"status": "accepted"
```

この段階で以下も必要に応じて修正します。リスク語タイトルを例外採用する場合のみ `overrideRisk: true` を明示します。

- `level`
- `score` または `finalScore`
- `axisScores`
- `review`
- `channelTitle` / `channel`
- `tags`

公開前に必ず動画本編を確認し、情報商材誘導、古い情報、誤情報、権利面の問題がある候補は採用しないでください。

## 5. 本データへ取り込み

```sh
npm run pipeline:ingest
```

dry-run:

```sh
node scripts/ingest.mjs --dry-run
```

`accepted` の新規draftだけを `content/videos.json` に追記します。既存 `ytid` は重複除外します。書き込み前に `content/videos.json.*.bak` を作りますが、`*.bak` はgitignore対象です。

`excellent: true` をまとめて取り込む場合だけ、明示的に使います。

```sh
node scripts/ingest.mjs --all-good
```

## 6. launchd例

`com.manapick.pipeline.example.plist` の `REPO_PATH` と `YOUR_USER` を実環境に合わせて置き換えます。

```sh
cp scripts/com.manapick.pipeline.example.plist ~/Library/LaunchAgents/com.manapick.pipeline.plist
plutil -lint ~/Library/LaunchAgents/com.manapick.pipeline.plist
launchctl load ~/Library/LaunchAgents/com.manapick.pipeline.plist
```

毎朝7時に `fetch-candidates` と `score-draft` を実行し、成功時にmacOS通知を出します。自動ingestはしません。最後は必ず人間レビューを挟みます。

## 7. サイト反映

人間レビュー後:

```sh
npm run pipeline:ingest
npm run build
```

問題なければ、既存の `push-manapick.command` など手元の承認済み手順でpushします。

## 8. 公開状態の定期監査

YouTube側で削除・非公開化・埋め込み不可になった動画を検出します。ビルド時の外部API依存を避けるため、候補収集時または週次点検時に実行します。

```sh
npm run content:availability
```

公開状態をJSONへ保存する場合:

```sh
node scripts/audit-video-availability.mjs --report data/availability-audit.json
```

1本でも応答なし、非公開、未処理、埋め込み不可、公開日の不一致があれば終了コード1を返します。APIキーはログやレポートへ出力しません。
