// どのページからでも使える動画検索。送信するとホームの検索（?q=）で結果を表示する。JSなしでも動く通常のフォーム。
export default function SiteSearchForm({ id, className = "" }: { id: string; className?: string }) {
  return (
    <form action="/" method="get" role="search" className={["site-search-form", className].filter(Boolean).join(" ")}>
      <label htmlFor={id}>動画を検索</label>
      <div className="site-search-row">
        <input id={id} type="search" name="q" placeholder="例: ChatGPT / 簿記 / Python" autoComplete="off" enterKeyHint="search" required />
        <button type="submit">検索</button>
      </div>
    </form>
  );
}
