// 本家のメニュー（components/SiteMenu）の中身。ホームと下層ページで同じメニューを出すため、ここを正とする。
// クライアント部品からも読むので、BudouX など重いものは import しない（文節境界は lib/site-menu-breaks.ts）。
export type MenuItem = {
  label: string;
  note: string;
  href: string;
  // 現在地の判定に使うパスの先頭（省略時は href）
  match?: string[];
};

export type MenuSection = {
  no: string;
  en: string;
  title: string;
  items: MenuItem[];
};

export const MENU_SECTIONS: MenuSection[] = [
  {
    no: "01",
    en: "START",
    title: "はじめる",
    items: [
      { label: "今日の1本診断", note: "3つの質問で、今日見る1本を選ぶ", href: "/start/" },
      { label: "7日学習プラン", note: "無料動画を、今週の予定にする", href: "/study-plan/" },
      { label: "ロードマップ", note: "分野ごとに、見る順番で進める", href: "/guide/" }
    ]
  },
  {
    no: "02",
    en: "FIND",
    title: "動画を探す",
    items: [
      { label: "おすすめ動画", note: "何から始めるか迷ったときに", href: "/youtube-learning/" },
      { label: "ランキング", note: "人気・高スコア・新着の順位", href: "/ranking/" },
      { label: "新着動画", note: "最近追加・更新した動画", href: "/new/" },
      { label: "学習テーマ", note: "検索で多いテーマを見る順で", href: "/learn/" }
    ]
  },
  {
    no: "03",
    en: "READ",
    title: "読む・調べる",
    items: [
      { label: "学びニュース", note: "公式発表を、学びに使える形へ", href: "/news/" },
      { label: "用語集", note: "動画で出てくる言葉を平易に", href: "/glossary/" },
      { label: "よくある質問", note: "使い方と採点の考え方", href: "/faq/" },
      { label: "採点方法", note: "7軸35点で採点する基準", href: "/about-score/" },
      { label: "学習動画データ", note: "掲載動画の長さと分布の集計", href: "/research/youtube-learning-data/" }
    ]
  },
  {
    no: "04",
    en: "MY",
    title: "自分の記録",
    items: [{ label: "マイページ", note: "あとで見る・学習記録・進捗", href: "/my/" }]
  }
];

export const MENU_INFO_LINKS: { label: string; href: string }[] = [
  { label: "manapi商店", href: "/shop/" },
  { label: "姉妹サイト案内", href: "/network/" },
  { label: "運営者情報", href: "/operator/" },
  { label: "サイトマップ", href: "/all/" },
  { label: "広告・アフィリエイト", href: "/affiliate/" },
  { label: "プライバシー", href: "/privacy/" },
  { label: "免責事項", href: "/disclaimer/" },
  { label: "お問い合わせ", href: "/contact/" }
];

/** 現在のパスに当たるメニュー項目の href（なければ null） */
export function currentMenuHref(pathname: string): string | null {
  const path = pathname.endsWith("/") ? pathname : pathname + "/";
  if (path === "/") return null;
  const hrefs = [...MENU_SECTIONS.flatMap((section) => section.items.map((item) => item.href)), ...MENU_INFO_LINKS.map((link) => link.href)];
  const hit = hrefs.filter((href) => path.startsWith(href)).sort((a, b) => b.length - a.length)[0];
  return hit ?? null;
}

/** メニュー内の文言（見出し・説明）。文節境界をビルド時に求める対象 */
export function menuPhrases(extra: string[] = []): string[] {
  return [
    ...MENU_SECTIONS.flatMap((section) => [section.title, ...section.items.flatMap((item) => [item.label, item.note])]),
    ...MENU_INFO_LINKS.map((link) => link.label),
    ...extra
  ];
}
