import {
  manapickAiUrlForGenre,
  manapickCareerUrlForGenre,
  manapickLicenseUrlForGenre
} from "@/lib/brand-links";
import { genreDisplayName } from "@/lib/manapick";

type NetworkSite = "ai" | "license" | "career";

type NetworkContextBandProps = {
  genreKey: string;
  exclude?: readonly NetworkSite[];
};

export default function NetworkContextBand({ genreKey, exclude = [] }: NetworkContextBandProps) {
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

  if (links.length === 0) return null;

  return (
    <section className="network-context-band" aria-labelledby={`network-context-${genreKey}`}>
      <div className="network-context-heading">
        <p className="section-eyebrow">MANAPICK NETWORK</p>
        <h2 id={`network-context-${genreKey}`}>学んだ先まで、同じ基準で迷わない</h2>
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
      <a className="network-context-overview" href="/network/">
        4サイトの役割と使い分けを見る <span aria-hidden="true">→</span>
      </a>
    </section>
  );
}
