import SiteMobileNav from "@/components/SiteMobileNav";
import professionRoutes from "@/content/professions.json";
import { genreLabel, publishedGenreKeys } from "@/lib/manapick";
import { siteStats } from "@/lib/site-stats";
import { siteMenuBreaks } from "@/lib/site-menu-breaks";

// 全ページ共通のモバイル下部ナビ。ホームには既存のインタラクティブ版（.mobile-bottom-nav）があるため、
// globals.css の :has() ルールで本コンポーネントはホームでは非表示にし、サブページでのみ表示する。
// ジャンル名・件数・メニュー文言の文節境界はサーバー側で渡し、動画データをクライアントのJSに含めない。
export default function SiteBottomNav() {
  const genres = publishedGenreKeys
    .map((key) => ({ key, label: genreLabel(key), count: siteStats.genreCounts[key] ?? 0 }))
    .filter((genre) => genre.count > 0);
  const professions = (professionRoutes as { id: string; title: string; href: string }[]).map(({ id, title, href }) => ({ id, title, href }));
  return <SiteMobileNav genres={genres} professions={professions} breaks={siteMenuBreaks()} />;
}
