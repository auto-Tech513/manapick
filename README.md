# Manapick v1

社会人の学び直しに役立つYouTube学習動画を、独自3行レビューとManapickスコアでキュレーションする静的サイトです。

## 起動

```bash
npm install
npm run dev
```

## ビルド

```bash
npm run build
```

`next.config.mjs` で `output: "export"` を指定しているため、Cloudflare Pages では `out/` を配信できます。

## 検証済み学びニュースの自動更新

日次ワークフローは許可済みの公式フィードを先に確認し、品質ゲートを通過した記事を1日最大1件だけ公開します。記事生成はOpenAI互換のChat Completions APIを明示設定して使用し、未検証テンプレートへの自動フォールバックは行いません。

- GitHub Actions secret: `NEWS_LLM_API_KEY`
- GitHub Actions variable: `NEWS_LLM_API_URL`
- GitHub Actions variable: `NEWS_LLM_MODEL`

設定不足やプロバイダー障害時も公式情報の監視とサイト全体の検証は継続し、記事は公開せず、対応に必要なGitHub Issueを1件だけ維持します。

## コンテンツ編集

- ジャンル: `content/genres.json`
- 動画: `content/videos.json`
- ロードマップ: `content/roadmaps.json`

動画を追加する場合は `videos.json` に `genre, sub, ytid, level, minutes, channel, score, title, url, tags, review` を追記します。採点前は `score: null` とし、視聴後に `0〜35` の数値と `axisScores` を入れます。

## ブランド資産

- サイト用ロゴ・favicon・OGP: `public/brand/`
- QAスクリーンショット: `docs/screenshots/`

Manapickのコード、ビルド、スクリーンショット、QA成果物はこのリポジトリ配下にのみ置きます。`Documents/Claude/Projects/manapickプロジェクト/` は企画・仕様・コンテンツ・ブランドマスターの置き場です。
