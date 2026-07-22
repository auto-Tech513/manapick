import { publishedGenreKeys } from "@/lib/manapick";
import { MANAPICK_AI_URL, MANAPICK_CAREER_URL, MANAPICK_LICENSE_URL } from "@/lib/brand-links";

type FooterLink = {
  label: string;
  href: string;
  external?: boolean;
};

const genreCount = publishedGenreKeys.length;

const footerLinkGroups: { title: string; links: FooterLink[] }[] = [
  {
    title: "探す・学ぶ",
    links: [
      { label: "今日の1本診断", href: "/start/" },
      { label: "7日学習プラン", href: "/study-plan/" },
      { label: "YouTube学習動画おすすめ", href: "/youtube-learning/" },
      { label: "検索で多い学習テーマ", href: "/learn/" },
      { label: "なりたい職業から選ぶ", href: "/#profession-routes" },
      { label: `${genreCount}ジャンル一覧`, href: "/#genre-picker" },
      { label: "ランキング", href: "/ranking/" },
      { label: "新着動画", href: "/new/" },
      { label: "学びニュース", href: "/news/" },
      { label: "マイページ", href: "/my/" },
      { label: "manapi商店", href: "/shop/" }
    ]
  },
  {
    title: "ロードマップ",
    links: [
      { label: "ロードマップ一覧", href: "/guide/" },
      { label: "生成AI", href: "/guide/generative-ai/" },
      { label: "Python", href: "/guide/python/" },
      { label: "動画編集", href: "/guide/video-editing/" },
      { label: "英語", href: "/guide/english/" },
      { label: "Excelデータ分析", href: "/guide/excel-data/" },
      { label: "Webマーケ", href: "/guide/web-marketing/" },
      { label: "Office・資料", href: "/guide/office-skills/" },
      { label: "資格", href: "/guide/certification/" },
      { label: "会計資格", href: "/guide/bookkeeping/" },
      { label: "お金・投資", href: "/guide/money-basics/" }
    ]
  },
  {
    title: "サイト情報",
    links: [
      { label: "採点方法", href: "/about-score/" },
      { label: "よくある質問", href: "/faq/" },
      { label: "用語集", href: "/glossary/" },
      { label: "Manapick Network", href: "/network/" },
      { label: "サイトマップ", href: "/all/" },
      { label: "運営者情報", href: "/operator/" },
      { label: "広告・アフィリエイト", href: "/affiliate/" },
      { label: "プライバシーポリシー", href: "/privacy/" },
      { label: "免責事項", href: "/disclaimer/" },
      { label: "お問い合わせ", href: "/contact/" },
      { label: "公式X", href: "https://x.com/manapick_app", external: true }
    ]
  }
];

const networkLinks = [
  {
    label: "Manapick",
    description: "動画で学ぶ",
    href: "/",
    className: "is-current"
  },
  {
    label: "manapick AI",
    description: "AIを選ぶ",
    href: MANAPICK_AI_URL,
    className: "is-ai",
    external: true
  },
  {
    label: "manapick license",
    description: "資格を選ぶ",
    href: MANAPICK_LICENSE_URL,
    className: "is-license",
    external: true
  },
  {
    label: "manapick career",
    description: "仕事を知る",
    href: MANAPICK_CAREER_URL,
    className: "is-career",
    external: true
  }
];

export default function SiteFooter() {
  return (
    <footer className="site-footer-main">
      <div className="site-footer-inner">
        <div className="site-footer-brand">
          <div className="site-footer-brand-mark" aria-hidden="true">✓</div>
          <div>
            <p>Manapick</p>
            <span>学び直しを、最短ルートに。</span>
          </div>
          <small>
            無料のYouTube学習動画を運営者が視聴し、7軸35点で採点。次に見る一本と学ぶ順番を整理しています。
          </small>
        </div>

        <nav className="site-footer-sections" aria-label="フッターナビゲーション">
          {footerLinkGroups.map((group) => (
            <section key={group.title} className="site-footer-section">
              <h2>{group.title}</h2>
              <div className="site-footer-links">
                {group.links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    {link.label}
                    {link.external ? <span aria-hidden="true">↗</span> : null}
                  </a>
                ))}
              </div>
            </section>
          ))}
        </nav>
      </div>

      <div className="site-footer-lower">
        <nav className="site-footer-network" aria-label="Manapick姉妹サイト">
          {networkLinks.map((link) => (
            <a
              key={link.label}
              className={link.className}
              href={link.href}
              aria-current={link.className === "is-current" ? "page" : undefined}
              {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              <strong>{link.label}</strong>
              <small>{link.description}</small>
              {link.external ? <span aria-hidden="true">↗</span> : null}
            </a>
          ))}
        </nav>
        <p>一部のリンクには広告・アフィリエイトを含む場合があります。</p>
        <p>© Manapick</p>
      </div>
    </footer>
  );
}
