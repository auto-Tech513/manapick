import { publishedGenreKeys } from "@/lib/manapick";
import { MANAPICK_AI_URL, MANAPICK_LICENSE_URL } from "@/lib/brand-links";

type FooterLink = {
  label: string;
  href: string;
  external?: boolean;
  icon?: "x";
  description?: string;
  site?: "ai" | "license";
};

const genreCount = publishedGenreKeys.length;

const footerLinkGroups: { title: string; links: FooterLink[] }[] = [
  {
    title: "学ぶ",
    links: [
      { label: "今日の1本診断", href: "/start/" },
      { label: "YouTube学習動画おすすめ", href: "/youtube-learning/" },
      { label: "検索で多い学習テーマ", href: "/learn/" },
      { label: "なりたい職業から選ぶ", href: "/#profession-routes" },
      { label: genreCount + "ジャンル一覧", href: "/#genre-picker" },
      { label: "ロードマップ", href: "/#roadmap" },
      { label: "ランキング", href: "/ranking/" },
      { label: "新着動画", href: "/new/" },
      { label: "用語集", href: "/glossary/" },
      { label: "FAQ", href: "/faq/" },
      { label: "マイページ", href: "/my/" },
      { label: "採点方法", href: "/about-score/" },
      { label: "manapi商店", href: "/shop/", description: "学習とAI作業の定番6商品" },
      { label: "生成AIロードマップ", href: "/guide/generative-ai/" },
      { label: "Pythonロードマップ", href: "/guide/python/" },
      { label: "動画編集ロードマップ", href: "/guide/video-editing/" },
      { label: "英語ロードマップ", href: "/guide/english/" },
      { label: "Excelデータ分析ロードマップ", href: "/guide/excel-data/" },
      { label: "Webマーケロードマップ", href: "/guide/web-marketing/" },
      { label: "Office・資料ロードマップ", href: "/guide/office-skills/" },
      { label: "資格ロードマップ", href: "/guide/certification/" },
      { label: "会計資格ロードマップ", href: "/guide/bookkeeping/" },
      { label: "お金・投資ロードマップ", href: "/guide/money-basics/" }
    ]
  },
  {
    title: "サイト情報",
    links: [
      { label: "サイトマップ（全ページ）", href: "/all/" },
      { label: "運営者情報", href: "/operator/" },
      { label: "広告・アフィリエイトについて", href: "/affiliate/" },
      { label: "プライバシーポリシー", href: "/privacy/" },
      { label: "免責事項", href: "/disclaimer/" }
    ]
  },
  {
    title: "つながる",
    links: [
      { label: "お問い合わせ", href: "/contact/" },
      { label: "姉妹サイト：manapick AI", href: MANAPICK_AI_URL, external: true, description: "使えるAIと使い方", site: "ai" },
      { label: "姉妹サイト：manapick license", href: MANAPICK_LICENSE_URL, external: true, description: "資格・検定を比較", site: "license" },
      { label: "公式X", href: "https://x.com/manapick_app", external: true, icon: "x" }
    ]
  }
];

export default function SiteFooter() {
  return (
    <footer className="border-t border-primaryInk bg-ink text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-7 min-[760px]:flex-row min-[760px]:items-center min-[760px]:justify-between min-[760px]:px-6">
        <div>
          <p className="text-xl font-black">Manapick</p>
          <p className="mt-1 text-sm text-white/68">学び直しを、最短ルートに。</p>
        </div>
        <nav className="footer-nav flex flex-wrap gap-4 text-sm font-bold text-white/78" aria-label="サイト情報">
          {footerLinkGroups.map((group) => (
            <div key={group.title} className="footer-link-group">
              <p className="footer-group-title">{group.title}</p>
              <div className="footer-group-links">
                {group.links.map((link) => (
                  <a
                    key={link.label}
                    className={[
                      "footer-link",
                      link.icon === "x" ? "footer-x-link" : "",
                      link.site === "ai" ? "footer-ai-link" : "",
                      link.site === "license" ? "footer-license-link" : ""
                    ].filter(Boolean).join(" ")}
                    href={link.href}
                    {...(link.external ? { target: "_blank", rel: "noopener" } : {})}
                  >
                    {link.icon === "x" ? (
                      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                        <path
                          fill="currentColor"
                          d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.65l-5.21-6.81-5.96 6.81H1.69l7.73-8.84L1.25 2.25h6.82l4.71 6.23 5.46-6.23Zm-1.16 17.77h1.84L7.08 3.88H5.11l11.97 16.14Z"
                        />
                      </svg>
                    ) : null}
                    <span>{link.label}</span>
                    {link.description ? <small>{link.description}</small> : null}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </div>
    </footer>
  );
}
