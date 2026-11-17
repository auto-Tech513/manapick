import Link from "next/link";
import Phrase from "@/components/Phrase";
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
    <section className="lb-sec" aria-labelledby="latest-news-title">
      <div className="lb-news-hd">
        <div className="lb-eh-stack">
          <span className="lb-news-code">Learning News</span>
          <h2 id="latest-news-title" className="lb-news-title">
            <span>学びに関係する更新を、</span>
            <span>使い方まで</span>
          </h2>
          <p>公式発表の事実と、学習や仕事で確認する順番を分けて整理しています。</p>
        </div>
        <div className="lb-news-meta">
          {checkedAt ? <span className="lb-news-chk">{formatDate(checkedAt)} 確認</span> : null}
          <Link className="lb-more" href="/news/">
            学びニュース一覧 →
          </Link>
        </div>
      </div>

      <div className="lb-nlist">
        {latest.map((item) => (
          <Link key={item.id} className="lb-ni" href={newsPath(item.id)}>
            <span className="lb-ni-top">
              <span className="lb-ni-g">{item.categoryLabel}</span>
              <time className="lb-ni-dt" dateTime={item.publishedAt}>
                {formatDate(item.publishedAt)}
              </time>
            </span>
            <h3><Phrase>{item.headline}</Phrase></h3>
            <p>{item.description}</p>
            <span className="lb-ni-rd">約{newsReadingMinutes(item)}分で読む →</span>
          </Link>
        ))}
      </div>

      <nav className="lb-themes" aria-label="検索の多い学習テーマ">
        <span>検索の多いテーマ</span>
        {intentLinks.map((item) => (
          <Link key={item.href} className="lb-chip" href={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>
    </section>
  );
}
