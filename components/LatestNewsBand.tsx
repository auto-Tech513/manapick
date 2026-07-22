import Link from "next/link";
import { newsItems, newsPath, newsReadingMinutes } from "@/lib/news";

const intentLinks = [
  { label: "Excel統計", href: "/learn/excel-statistics/" },
  { label: "Pythonが難しい", href: "/learn/python-hard/" },
  { label: "Webマーケ動画", href: "/learn/web-marketing-youtube/" },
  { label: "Power BI", href: "/learn/power-bi/" }
];

function formatDate(value: string) {
  return value.replaceAll("-", "/");
}

export default function LatestNewsBand() {
  const latest = newsItems.slice(0, 3);
  const checkedAt = latest[0]?.lastChecked;

  return (
    <section className="latest-news-band" aria-labelledby="latest-news-title">
      <header className="latest-news-heading">
        <div>
          <p className="section-eyebrow">Learning News</p>
          <h2 id="latest-news-title" className="section-title">学びに関係する更新を、使い方まで</h2>
          <p>公式発表の事実と、学習や仕事で確認する順番を分けて整理しています。</p>
        </div>
        <div className="latest-news-status">
          {checkedAt ? <span>{formatDate(checkedAt)} 確認</span> : null}
          <Link href="/news/">学びニュース一覧</Link>
        </div>
      </header>

      <div className="latest-news-grid">
        {latest.map((item) => (
          <Link key={item.id} className={`latest-news-card is-${item.category}`} href={newsPath(item.id)}>
            <span className="latest-news-meta">
              <span>{item.categoryLabel}</span>
              <time dateTime={item.publishedAt}>{formatDate(item.publishedAt)}</time>
            </span>
            <strong>{item.headline}</strong>
            <span className="latest-news-summary">{item.description}</span>
            <span className="latest-news-read">約{newsReadingMinutes(item)}分で読む <span aria-hidden="true">→</span></span>
          </Link>
        ))}
      </div>

      <nav className="search-demand-links" aria-label="検索の多い学習テーマ">
        <strong>検索の多いテーマ</strong>
        {intentLinks.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}
      </nav>
    </section>
  );
}
