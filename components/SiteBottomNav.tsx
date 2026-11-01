import SiteMobileNav from "@/components/SiteMobileNav";
import { genreLabel, publishedGenreKeys } from "@/lib/manapick";

// 全ページ共通のモバイル下部ナビ。ホームには既存のインタラクティブ版（.mobile-bottom-nav）があるため、
// globals.css の :has() ルールで本コンポーネントはホームでは非表示にし、サブページでのみ表示する。
// ジャンル名はサーバー側で渡し、動画データをクライアントのJSに含めない。
export default function SiteBottomNav() {
  const genres = publishedGenreKeys.map((key) => ({ key, label: genreLabel(key) }));
  return <SiteMobileNav genres={genres} />;
}
