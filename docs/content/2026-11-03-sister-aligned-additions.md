# 2026-11-03 姉妹サイトと噛み合う動画の追加記録

運営者による本編視聴を経ずに、YouTube Data API v3 の公開情報だけを根拠に追加した動画の記録（`scoreBasis: "public-metadata"`、`scoreConfirmedAt: "2026-11-03"`）。

## 事前確認
- 掲載中745本を `scripts/audit-video-availability.mjs` で再確認: 非公開・削除・埋め込み不可 0件（2026-11-03）。

## 取得
- `content/network-related.json`（姉妹サイトの実在ページ）と掲載動画を照合し、動画が無い・少ないテーマを選んで53クエリ（search.list、regionCode=JP、relevanceLanguage=ja、order=relevance、publishedAfter=2025-05-01、videoEmbeddable=true）。
- 狙い: license（応用情報・iパス・FP3級・簿記2/3級・英検準1級・AWS CLF ほか）、ai（Gemini・Microsoft Copilot・NotebookLM ほか）、鮮度の薄い marke・prog・money・data。

## 機械判定の除外条件（2026-11-01 と同じ）
- 非公開・埋め込み不可・子ども向け・ライブ、タイトルが日本語でない、4分未満・150分超
- `scripts/pipeline-config.json` の deny / weak / money_deny、煽り語、税務助言系
- 概要欄の販売導線（公式LINE、無料プレゼント、個別相談、セミナー、コンサル、スポンサー、キャンペーン、教材、会員・月額、通信講座、有料、コーチング、アフィリエイト 等）
- テーマ語・学習語がタイトルにない、再生1,000回未満、登録者1,000人未満、チャプター3個未満かつ本文150字未満
- 同一チャンネルはジャンル内で既存含め2本、同一サブは新規3本まで

## 概要欄を読んで除外したもの（機械判定は通過）
- 楽天・Amazonのアフィリエイトリンク: `4tDJY_kFCAg` `yzy_Rm38KXc` `bb2dYhFS0jk`
- 自社書籍・テキストの販売: `8fZt7pMlNTQ` `MIfIJ6m_ESk`
- 有料講座の体験版・定額サービス・研修・メルマガ特典・LINE特典: `FyRM1UWiljM` `u3InRORz630` `epTwqBnA4M4` `ENrLuO1CDOg` `b7qM0NsgYtY` `itbs03vzas0` `6NyhOfuX6hE` `NbtxVfgxkvQ` `dZhcZpnWWT8`
- 自社サービス・相談・制作依頼・採用・資料ダウンロード: `epx9uh2-Nu8` `T9A9XaW_Eyo` `TbYX80DgR-M` `A0WIASmsdH0` `vEaQIW8PveQ` `wbyh15WThjQ` `wzpRh4RbP_o` `kqMpZ-06xh8`
- 有料PDF・フォロワークラブ: `ocedfcSlPi0` `2YLY8_E835g`
- テーマ違い・娯楽: `VHfCJx_h7CU`（釣り）`f8aK65K22s8`（切り抜き）`wCVcS0oAyT4`（一夜漬け企画）`w0UzA1wGZVA` `sxC2j8M4J6c`（個人のInstagram操作でSNS運用ではない）
- シリーズ途中回のみ: `JC2oTs34LCs` `5gS8JhSkI4Q`
- 内容の手がかりが概要欄に乏しい: `cNIX7vFHw1A`／生成AIの音声で制作と明記: `-yIUvXhUT50`

## 採点・表記
- 7軸は `scripts/score-draft.mjs` と同じ規則。noteは根拠の事実。
- レビュー3行はタイトル・概要欄・チャプターの記載のみ。
- 難易度: タイトルに「2級・２級・二級・準1級・科目B・応用情報・連結」を含むものを中級、それ以外を初級。
- 英語ジャンルのサブに「英検」を追加。
- 姉妹サイトリンク（`content/sister-item-links.json`）は、ページの実在（HTTP 200）と見出しを確認し、タイトルに資格・ツール名が明記された12本に付与。

## 追加した動画（15本）
| genre/sub | ytid | 姉妹サイト |
|---|---|---|
| shikaku/IT | `0R3m6gTji4g` `GBXantggKhU` | license/ap |
| shikaku/ITパスポート | `guTJ3zjAONs` | license/it-passport |
| kaikei/FP | `yJS1A1JEVtc` | license/fp-3 |
| kaikei/簿記 | `X-iZFnuwXjI` `62JcKRHh18s` | license/boki-2 |
| kaikei/簿記 | `w40zRfN1P0w` | license/boki-3 |
| english/英検 | `LmbLijdLhiQ` | license/eiken-pre1 |
| prog/インフラ | `aQx3804fhQg` | license/aws-clf |
| prog/アプリ | `cClpzva20AA` | （ai側にGoogle AI Studioのページなし） |
| data/Excel | `-b2jmF653sw` | ai/gemini |
| data/データサイエンス | `9N8JfpLIKBs` | — |
| ai/Copilot | `bc7aLyuPwMs` `-l8SzZP1XOg` | ai/copilot |
| money/家計 | `AFAH0RqDZyM` | — |

## 残った課題
- Webマーケ（marke）は候補の概要欄がすべて相談・制作依頼・講座の導線で、条件を満たす動画がなかった（最新公開から275日のまま）。
