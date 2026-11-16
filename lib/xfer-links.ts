// 乗り換えカードの行き先（姉妹サイトの個別ページ）。
// 行き先は各サイトの sitemap で実在を確認したものだけを載せる。
// 確認日: 2026-11-15（sitemap.xml の <loc> 一覧＋各URLのHTTP 200とタイトルで照合）。
// AIカードは動画詳細と同じ sister-item-links の実データを使い、
// 対象動画にツールリンクが無いジャンルのときだけ下の固定先を使う。

export type XferTarget = {
  name: string;
  url: string;
};

export const XFER_LICENSE_BY_GENRE: Record<string, XferTarget> = {
  ai: { name: "G検定", url: "https://license.manapick.app/license/g-kentei/" },
  prog: { name: "基本情報技術者試験", url: "https://license.manapick.app/license/fe/" },
  video: { name: "CGクリエイター検定", url: "https://license.manapick.app/license/cg-creator-2/" },
  english: { name: "TOEIC", url: "https://license.manapick.app/license/toeic-lr/" },
  data: { name: "統計検定2級", url: "https://license.manapick.app/license/statistics-2/" },
  marke: { name: "ウェブ解析士", url: "https://license.manapick.app/license/web-analyst-waca/" },
  biz: { name: "MOS", url: "https://license.manapick.app/license/mos/" },
  shikaku: { name: "宅地建物取引士（宅建士）", url: "https://license.manapick.app/license/takken/" },
  kaikei: { name: "日商簿記検定2級", url: "https://license.manapick.app/license/boki-2/" },
  money: { name: "FP技能検定2級", url: "https://license.manapick.app/license/fp-2/" }
};

export const XFER_CAREER_BY_GENRE: Record<string, XferTarget> = {
  ai: { name: "ITコンサルタント", url: "https://career.manapick.app/career/it-consultant/" },
  prog: { name: "ソフトウェアエンジニア", url: "https://career.manapick.app/career/software-engineer/" },
  video: { name: "動画編集者", url: "https://career.manapick.app/career/video-editor/" },
  english: { name: "英語を使う営業・カスタマーサポート", url: "https://career.manapick.app/career/english-sales-support/" },
  data: { name: "データアナリスト", url: "https://career.manapick.app/career/data-analyst/" },
  marke: { name: "Webマーケター", url: "https://career.manapick.app/career/web-marketer/" },
  biz: { name: "一般事務・営業事務", url: "https://career.manapick.app/career/office-administration/" },
  shikaku: { name: "登録販売者", url: "https://career.manapick.app/career/registered-salesperson/" },
  kaikei: { name: "経理", url: "https://career.manapick.app/career/accounting/" },
  money: { name: "経理", url: "https://career.manapick.app/career/accounting/" }
};

export const XFER_COMPANY_BY_GENRE: Record<string, XferTarget> = {
  ai: { name: "ソフトバンクグループ", url: "https://company.manapick.app/company/softbank-group/" },
  prog: { name: "富士通", url: "https://company.manapick.app/company/fujitsu/" },
  video: { name: "ソニーグループ", url: "https://company.manapick.app/company/sony-group/" },
  english: { name: "学研ホールディングス", url: "https://company.manapick.app/company/gakken-holdings/" },
  data: { name: "データセクション", url: "https://company.manapick.app/company/datasection/" },
  marke: { name: "サイバーエージェント", url: "https://company.manapick.app/company/cyberagent/" },
  biz: { name: "リクルートホールディングス", url: "https://company.manapick.app/company/recruit-holdings/" },
  shikaku: { name: "早稲田アカデミー", url: "https://company.manapick.app/company/waseda-academy/" },
  kaikei: { name: "フリー", url: "https://company.manapick.app/company/freee/" },
  money: { name: "SBIホールディングス", url: "https://company.manapick.app/company/sbi-holdings/" }
};

export const XFER_AI_FALLBACK: XferTarget = {
  name: "ChatGPT",
  url: "https://ai.manapick.app/tool/chatgpt/"
};

// politics は法律・制度と結びつくジャンルでのみ候補に入る（行き先は実在確認済み）。
export const XFER_POLITICS_BY_GENRE: Record<string, XferTarget> = {
  biz: { name: "労働基準法と労働契約法の違い", url: "https://politics.manapick.app/law/labor-standards-vs-labor-contract/" },
  shikaku: { name: "法律・施行令・施行規則の違い", url: "https://politics.manapick.app/guide/law-hierarchy/" },
  money: { name: "国の予算はどう決まるか", url: "https://politics.manapick.app/guide/budget-flow/" }
};

export type XferSite = "ai" | "license" | "career" | "company" | "politics";

// 乗り換えカードは4枚構成。自分以外の5サイトから、内容に対応する4枚をこの順で選ぶ。
export const XFER_ORDER: Record<string, XferSite[]> = {
  shikaku: ["license", "career", "company", "politics"],
  money: ["license", "career", "company", "politics"],
  biz: ["ai", "license", "career", "politics"]
};

export const XFER_ORDER_DEFAULT: XferSite[] = ["ai", "license", "career", "company"];

// カード右端のCTA文言（デザインモックの go ラベル。politics のみモック未収録のため同型で作成）。
export const XFER_CTA: Record<XferSite, string> = {
  ai: "ツールを比べる",
  license: "資格ページへ",
  career: "職業ページへ",
  company: "企業を読む",
  politics: "しくみを読む"
};
