// 動画詳細「姉妹サイトで詳細を見る」の1対1リンク（content/sister-item-links.json）を、
// 型を付けて読み込み、中身を検査する。
// JSON を `as` で型付けするだけでは、型に無い site（例：誤記）が書かれても型チェックを通り、
// 表示側で別サイトの文言に化ける。そこで読み込み時に検査し、不正があればビルドを失敗させる。
// 同じ検査は scripts/audit-content.mjs（prebuild）にもある。許可サイトを足すときは両方を直すこと。
import rawSisterItemLinks from "@/content/sister-item-links.json";

export const SISTER_SITES = ["ai", "license", "career", "company", "politics"] as const;
export type SisterSite = (typeof SISTER_SITES)[number];

/** site ごとのリンク先ホスト。url のホストは site と一致していなければならない */
export const SISTER_SITE_HOSTS: Record<SisterSite, string> = {
  ai: "ai.manapick.app",
  license: "license.manapick.app",
  career: "career.manapick.app",
  company: "company.manapick.app",
  politics: "politics.manapick.app"
};

export type SisterItemLink = {
  site: SisterSite;
  slug: string;
  name: string;
  url: string;
};

function isSisterSite(value: unknown): value is SisterSite {
  return typeof value === "string" && (SISTER_SITES as readonly string[]).includes(value);
}

/** 1件分の不備を文で返す（問題がなければ空配列） */
export function sisterItemLinkProblems(link: unknown): string[] {
  if (!link || typeof link !== "object") return ["リンクがオブジェクトではありません"];
  const item = link as Record<string, unknown>;
  const problems: string[] = [];
  if (!isSisterSite(item.site)) {
    problems.push(`site "${String(item.site)}" は許可されていません（許可：${SISTER_SITES.join("/")}）`);
  }
  if (typeof item.slug !== "string" || item.slug.trim() === "") problems.push("slug が空です");
  if (typeof item.name !== "string" || item.name.trim() === "") problems.push("name が空です");
  if (typeof item.url !== "string") {
    problems.push("url が文字列ではありません");
    return problems;
  }
  let url: URL;
  try {
    url = new URL(item.url);
  } catch {
    problems.push(`url "${item.url}" を解釈できません`);
    return problems;
  }
  if (url.protocol !== "https:") problems.push(`url "${item.url}" が https ではありません`);
  if (isSisterSite(item.site) && url.host !== SISTER_SITE_HOSTS[item.site]) {
    problems.push(`url のホスト ${url.host} が site "${item.site}"（${SISTER_SITE_HOSTS[item.site]}）と一致しません`);
  }
  const segments = url.pathname.split("/").filter(Boolean);
  if (typeof item.slug === "string" && segments[segments.length - 1] !== item.slug) {
    problems.push(`url "${item.url}" の末尾が slug "${item.slug}" と一致しません`);
  }
  if (item.site === "company" && url.pathname !== `/company/${String(item.slug)}/`) {
    problems.push(`company のリンクは /company/<slug>/ の形にしてください（${url.pathname}）`);
  }
  return problems;
}

function validateSisterItemLinks(data: unknown): Record<string, SisterItemLink[]> {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new Error("[sister-item-links] content/sister-item-links.json の最上位は「動画ID → リンク配列」のオブジェクトにしてください");
  }
  const errors: string[] = [];
  for (const [ytid, links] of Object.entries(data as Record<string, unknown>)) {
    if (!Array.isArray(links)) {
      errors.push(`${ytid}: リンクが配列ではありません`);
      continue;
    }
    links.forEach((link, index) => {
      for (const problem of sisterItemLinkProblems(link)) errors.push(`${ytid}[${index}]: ${problem}`);
    });
  }
  if (errors.length > 0) {
    throw new Error(`[sister-item-links] content/sister-item-links.json に不正な項目があります（${errors.length}件）\n- ${errors.join("\n- ")}`);
  }
  return data as Record<string, SisterItemLink[]>;
}

/** 検査済みの「動画ID → 姉妹サイトの1対1リンク」 */
export const sisterItemLinksByVideo: Readonly<Record<string, readonly SisterItemLink[]>> =
  validateSisterItemLinks(rawSisterItemLinks);
