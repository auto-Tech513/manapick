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

`next.config.mjs` で `output: "export"` を指定しているため、Cloudflare Pages では `out/` を配信できます。公開デプロイ、GitHub連携、ASP/AdSense等の外部連携は承認後に実行します。

## コンテンツ編集

- ジャンル: `content/genres.json`
- 動画: `content/videos.json`
- ロードマップ: `content/roadmaps.json`

動画を追加する場合は `videos.json` に `genre, sub, ytid, level, minutes, channel, score, title, url, tags, review` を追記します。採点前は `score: null` とし、視聴後に `0〜35` の数値と `axisScores` を入れます。

## ブランド資産

- サイト用ロゴ・favicon・OGP: `public/brand/`
- QAスクリーンショット: `docs/screenshots/`

Manapickのコード、ビルド、スクリーンショット、QA成果物はこのリポジトリ配下にのみ置きます。`Documents/Claude/Projects/manapickプロジェクト/` は企画・仕様・コンテンツ・ブランドマスターの置き場です。
