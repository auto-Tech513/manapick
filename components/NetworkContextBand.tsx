import {
  MANAPICK_COMPANY_ORIGIN,
  manapickAiUrlForGenre,
  manapickCareerUrlForGenre,
  manapickLicenseUrlForGenre
} from "@/lib/brand-links";
import TrackedGaLink from "@/components/TrackedGaLink";
import { genreDisplayName } from "@/lib/manapick";
import aiDeepLinks from "@/content/ai-deep-links.json";
import networkRelated from "@/content/network-related.json";

type AiDeepLink = { href: string; label: string };
const AI_DEEP_LINKS = aiDeepLinks as Record<string, AiDeepLink[]>;

type NetworkSite = "ai" | "license" | "career" | "company";
type RelatedItem = { href: string; label: string };
type RelatedSites = Partial<Record<NetworkSite, RelatedItem[]>>;

// content/network-related.json には、相手サイトのページが200を返し、ページ名が学習内容と対応するものだけを登録している（2026-11-02確認）。
// ジャンル単位の既定値に、サブジャンル単位の項目を先頭で重ねる。
const RELATED = networkRelated as { checkedAt: string; genres: Record<string, RelatedSites>; subs: Record<string, RelatedSites> };
const MAX_ITEMS = 4;

type NetworkContextBandProps = {
  genreKey: string;
  /** サブジャンル（例: TOEIC）。content/network-related.json の subs にあれば先頭に出す */
  sub?: string;
  /** このページ内の別の場所ですでにリンクしているURL（重複を避ける） */
  skipHrefs?: readonly string[];
  /** このページのパス（例: /genre/ai/ChatGPT/）。content/ai-deep-links.json にあれば manapick AI の関連ページを足す */
  pagePath?: string;
};

function relatedItems(genreKey: string, sub: string | undefined, site: NetworkSite, skip: Set<string>, extra: RelatedItem[] = []) {
  const fromSub = sub ? RELATED.subs[`${genreKey}/${sub}`]?.[site] ?? [] : [];
  const fromGenre = RELATED.genres[genreKey]?.[site] ?? [];
  const seen = new Set<string>();
  const items: RelatedItem[] = [];
  for (const item of [...fromSub, ...extra, ...fromGenre]) {
    if (seen.has(item.href) || skip.has(item.href)) continue;
    seen.add(item.href);
    items.push(item);
    if (items.length >= MAX_ITEMS) break;
  }
  return items;
}

export default function NetworkContextBand({ genreKey, sub, skipHrefs = [], pagePath }: NetworkContextBandProps) {
  const genreName = genreDisplayName(genreKey);
  const skip = new Set(skipHrefs);
  const deepLinks = pagePath ? (AI_DEEP_LINKS[pagePath] ?? []).slice(0, 2) : [];

  const cards = [
    {
      site: "license" as const,
      eyebrow: "資格を選ぶ",
      title: "manapick license",
      more: manapickLicenseUrlForGenre(genreKey),
      moreLabel: "資格をもっと見る",
      items: relatedItems(genreKey, sub, "license", skip)
    },
    {
      site: "career" as const,
      eyebrow: "仕事を知る",
      title: "manapick career",
      more: manapickCareerUrlForGenre(genreKey),
      moreLabel: "仕事をもっと見る",
      items: relatedItems(genreKey, sub, "career", skip)
    },
    {
      site: "ai" as const,
      eyebrow: "学習に使うAI",
      title: "manapick AI",
      more: manapickAiUrlForGenre(genreKey),
      moreLabel: "AIをもっと見る",
      items: relatedItems(genreKey, sub, "ai", skip, deepLinks)
    },
    {
      site: "company" as const,
      eyebrow: "企業を調べる",
      title: "manapick company",
      more: `${MANAPICK_COMPANY_ORIGIN}ranking/`,
      moreLabel: "企業ランキングを見る",
      items: relatedItems(genreKey, sub, "company", skip)
    }
  ].filter((card) => card.site !== "company" || card.items.length > 0);

  const subject = sub ?? genreName;
  const hasCompany = cards.some((card) => card.site === "company");

  return (
    <section id={`network-context-${genreKey}`} className="network-context-band" aria-labelledby={`network-context-title-${genreKey}`}>
      <div className="network-context-heading">
        <p className="section-eyebrow">MANAPICK NETWORK</p>
        <h2 id={`network-context-title-${genreKey}`}>{subject}の次に調べる</h2>
        <p>関連する資格・仕事・AI{hasCompany ? "・企業" : ""}を姉妹サイトで確認できます。</p>
      </div>
      <div className={`network-context-links${cards.length === 4 ? " has-four" : ""}`}>
        {cards.map((card) => (
          <div key={card.site} className={`network-context-link is-${card.site}`}>
            <span>{card.eyebrow}</span>
            <strong>{card.title}</strong>
            {card.items.length > 0 ? (
              <ul className="network-context-items">
                {card.items.map((item) => (
                  <li key={item.href}>
                    <TrackedGaLink
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      eventName="network_click"
                      eventParams={{ destination_site: card.site, placement: "context_band_item", genre: genreKey }}
                    >
                      {item.label} <span aria-hidden="true">↗</span>
                    </TrackedGaLink>
                  </li>
                ))}
              </ul>
            ) : null}
            <TrackedGaLink
              className="network-context-more"
              href={card.more}
              target="_blank"
              rel="noopener noreferrer"
              eventName="network_click"
              eventParams={{ destination_site: card.site, placement: "context_band_more", genre: genreKey }}
            >
              {card.moreLabel} <span aria-hidden="true">↗</span>
            </TrackedGaLink>
          </div>
        ))}
      </div>
      <a className="network-context-overview" href="/network/">
        5サイトの役割と使い分けを見る <span aria-hidden="true">→</span>
      </a>
    </section>
  );
}
