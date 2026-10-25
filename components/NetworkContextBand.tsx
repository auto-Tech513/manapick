import {
  manapickAiUrlForGenre,
  manapickCareerUrlForGenre,
  manapickLicenseUrlForGenre
} from "@/lib/brand-links";
import { genreDisplayName } from "@/lib/manapick";
import aiDeepLinks from "@/content/ai-deep-links.json";

type AiDeepLink = { href: string; label: string };
const AI_DEEP_LINKS = aiDeepLinks as Record<string, AiDeepLink[]>;

type NetworkSite = "ai" | "license" | "career";

type NetworkContextBandProps = {
  genreKey: string;
  exclude?: readonly NetworkSite[];
  /** このページのパス（例: /genre/ai/ChatGPT/）。content/ai-deep-links.json にあれば manapick AI の関連ページを出す */
  pagePath?: string;
};

export default function NetworkContextBand({ genreKey, exclude = [], pagePath }: NetworkContextBandProps) {
  const genreName = genreDisplayName(genreKey);
  const excluded = new Set(exclude);
  const links = [
    {
      site: "ai" as const,
      eyebrow: "AIを選ぶ",
      title: "manapick AI",
      description: `${genreName}の学習や実務を助けるAIの料金・無料枠・使い方を確認`,
      href: manapickAiUrlForGenre(genreKey)
    },
    {
      site: "license" as const,
      eyebrow: "資格を選ぶ",
      title: "manapick license",
      description: `${genreName}に関連する資格の要件・費用・申込方法を確認`,
      href: manapickLicenseUrlForGenre(genreKey)
    },
    {
      site: "career" as const,
      eyebrow: "仕事を知る",
      title: "manapick career",
      description: `${genreName}を生かせる仕事・必要スキル・学ぶ順番を確認`,
      href: manapickCareerUrlForGenre(genreKey)
    }
  ].filter((link) => !excluded.has(link.site));

  const deepLinks = pagePath && !excluded.has("ai") ? (AI_DEEP_LINKS[pagePath] ?? []).slice(0, 2) : [];

  if (links.length === 0) return null;

  return (
    <section id={`network-context-${genreKey}`} className="network-context-band" aria-labelledby={`network-context-title-${genreKey}`}>
      <div className="network-context-heading">
        <p className="section-eyebrow">MANAPICK NETWORK</p>
        <h2 id={`network-context-title-${genreKey}`}>学んだ先まで、同じ基準で迷わない</h2>
        <p>動画で学ぶManapickから、AI・資格・仕事の詳しい比較へつながります。</p>
      </div>
      <div className="network-context-links">
        {links.map((link) => (
          <a
            key={link.site}
            className={`network-context-link is-${link.site}`}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>{link.eyebrow}</span>
            <strong>{link.title} <span aria-hidden="true">↗</span></strong>
            <small>{link.description}</small>
          </a>
        ))}
      </div>
      {deepLinks.length ? (
        <div className="network-context-deep" aria-label="manapick AIの関連ページ">
          <span>manapick AIの関連ページ</span>
          <ul>
            {deepLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} target="_blank" rel="noopener noreferrer">
                  {link.label} <span aria-hidden="true">↗</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      <a className="network-context-overview" href="/network/">
        4サイトの役割と使い分けを見る <span aria-hidden="true">→</span>
      </a>
    </section>
  );
}
