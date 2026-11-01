# 2026-11-02 サブページのメニュー・学習プランのカレンダー書き出し・ホーム画面追加

## 変更
- サブページの下部ナビ「メニュー」: `/all/`（サイトマップ）への遷移をやめ、その場でメニューを開く（`components/SiteMobileNav.tsx`）。先頭に「トップへ戻る」、下部ナビ左端も「ホーム」に変更。Escape・背景タップで閉じる、フォーカストラップ、閉じた後はメニューボタンへフォーカスを戻す。
- 7日学習プラン: 開始日・時刻を選び、`.ics`（iPhone・Mac・Android標準カレンダー向け、10分前通知）を書き出し。Googleカレンダーは公式のイベント作成リンク（`calendar.google.com/calendar/render?action=TEMPLATE`、1リンク1件）を日ごとに表示（`lib/study-calendar.ts`, `components/StudyPlanCalendar.tsx`）。
- ホーム画面に追加: iPhone/iPadのSafariではApple公式「iPhoneユーザガイド」（iph42ab2f3a7）の手順を表示。iOSの他ブラウザ/アプリ内ブラウザではSafariで開くよう案内。Android等は `beforeinstallprompt` があればインストールダイアログを表示。ホームのメニュー・サブページのメニュー・学習プランに設置。
- `appleWebApp`（タイトル「Manapick」）メタデータ、manifest に `id`・`lang`・`shortcuts`（診断・学習プラン・マイページ・新着）を追加。

## 検証（ローカル静的ビルド）
- 913ページ: 375px で横はみ出し0、24px未満のタップ領域0。
- メニュー開閉・フォーカス・トップへ戻る遷移を Playwright で確認。
- 書き出した `.ics` を Python `icalendar` で解析し、JST 07:30 開始・動画の長さ・通知1件を確認。行は CRLF・最大75オクテット。

## 未検証
- iPhone実機の Safari で `.ics` ダウンロード後に「カレンダーに追加」画面が出るかは未確認。
