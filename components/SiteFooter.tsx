import { publishedGenreKeys } from "@/lib/manapick";
import { siteStats } from "@/lib/site-stats";
import NewsletterSignup from "@/components/NewsletterSignup";
import NetworkRoute from "@/components/NetworkRoute";

type FooterLink = {
  label: string;
  href: string;
  external?: boolean;
};

const genreCount = publishedGenreKeys.length;

// フッターの骨格は7サイト共通（pwcheck-run/FOOTER_SPEC.md）：メルマガ → サイトの案内（ロゴ＋3列×6件まで）
// → ネットワーク帯 → 注記＋最下段。6件を超えるリンクは「すべてのページ」（/all/）へ集約する。
const footerLinkGroups: { title: string; links: FooterLink[] }[] = [
  {
    title: "探す",
    links: [
      { label: `${genreCount}ジャンル一覧`, href: "/#genre-picker" },
      { label: "ロードマップ一覧", href: "/guide/" },
      { label: "検索で多い学習テーマ", href: "/learn/" },
      { label: "ランキング", href: "/ranking/" },
      { label: "新着動画", href: "/new/" },
      { label: "学びニュース", href: "/news/" }
    ]
  },
  {
    title: "使う",
    links: [
      { label: "今日の1本診断", href: "/start/" },
      { label: "7日学習プラン", href: "/study-plan/" },
      { label: "マイページ", href: "/my/" },
      { label: "YouTube学習動画おすすめ", href: "/youtube-learning/" },
      { label: `${siteStats.totalVideos}本の学習動画データ`, href: "/research/youtube-learning-data/" },
      { label: "manapi商店", href: "/shop/" }
    ]
  },
  {
    title: "サイト情報",
    links: [
      { label: "採点方法", href: "/about-score/" },
      { label: "よくある質問", href: "/faq/" },
      { label: "用語集", href: "/glossary/" },
      { label: "Manapick Network", href: "/network/" },
      { label: "公式X", href: "https://x.com/manapick_app", external: true },
      { label: "すべてのページ", href: "/all/" }
    ]
  }
];

const legalLinks: FooterLink[] = [
  { label: "運営者情報", href: "/operator/" },
  { label: "プライバシーポリシー", href: "/privacy/" },
  { label: "広告・アフィリエイト", href: "/affiliate/" },
  { label: "免責事項", href: "/disclaimer/" },
  { label: "お問い合わせ", href: "/contact/" }
];

function FooterAnchor({ link }: { link: FooterLink }) {
  return (
    <a href={link.href} {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
      {link.label}
      {link.external ? <span aria-hidden="true">↗</span> : null}
    </a>
  );
}

export default function SiteFooter() {
  return (
    <footer className="site-footer-main ft">
      <div className="ft-newsletter" id="footer-newsletter">
        <NewsletterSignup placement="footer" dark />
      </div>

      <div className="ft-guide">
        <div className="ft-brand">
          <p className="lb-wordmark ft-wordmark">manapick</p>
          <p>学び直しを、最短ルートに。</p>
        </div>
        <nav className="ft-cols" aria-label="フッターナビゲーション">
          {footerLinkGroups.map((group) => (
            <section key={group.title} className="ft-col">
              <h2>{group.title}</h2>
              <ul>
                {group.links.map((link) => (
                  <li key={link.label}>
                    <FooterAnchor link={link} />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </nav>
      </div>

      <NetworkRoute />

      <div className="ft-bottom">
        <p className="ft-note">一部のリンクには広告・アフィリエイトを含む場合があります。</p>
        <div className="ft-legal">
          <nav aria-label="運営・規約">
            {legalLinks.map((link) => (
              <FooterAnchor key={link.label} link={link} />
            ))}
          </nav>
          <p>© Manapick</p>
        </div>
      </div>
    </footer>
  );
}
