# Manapick コンテンツ整合性チェックリスト

最終更新: 2026-06-13

## 原則

`content/videos.json` を動画本数・ジャンル別件数・サブトピック件数・確認済み件数の唯一の真実にする。サイト表示は `lib/site-stats.ts` から派生させ、静的な本数表記を増やさない。

## コンテンツ push 前チェック

- [ ] `jq 'length' content/videos.json` で総本数を確認する
- [ ] `npx next build` が通る
- [ ] ヒーローの「厳選◯本掲載」と「確認済◯本」が `content/videos.json` 由来で更新されている
- [ ] ジャンル別件数・サブトピック件数が `content/videos.json` 由来で更新されている
- [ ] Short `scenarios.json` の本数文言が実数と大きくズレていない
- [ ] SNS bio の本数表記は、大きく変わった時だけ更新する
- [ ] 新サブトピックを追加した場合は `content/naming-map.json` に呼称を追記する
- [ ] 会計・税務領域は実務助言に踏み込まず、学習動画紹介に留める
- [ ] money は中立表現を守り、特定銘柄・金融商品の推奨にしない

## 実装メモ

- サイト本数は `lib/site-stats.ts` の `siteStats.totalVideos` を使う
- 公開ジャンル数は `siteStats.publishedGenreCount` を使う
- 確認済み件数は `siteStats.confirmedVideoCount` を使う
- 「◯本超」は `roundedVideoCountLabel(total)` で `floor(total / 50) * 50` に丸める
