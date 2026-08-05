import type { Metadata } from "next";
import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
import {
  absoluteUrl,
  genreDisplayName,
  videos
} from "@/lib/manapick";

const REVIEWED_AT = "2026-08-05";
const pageUrl = absoluteUrl("/research/youtube-learning-data/");

function percent(value: number, total = videos.length) {
  return total > 0 ? Math.round((value / total) * 1000) / 10 : 0;
}

const durations = videos.map((video) => video.minutes).sort((a, b) => a - b);
const durationGroups = [
  { label: "15分以下", count: durations.filter((minutes) => minutes <= 15).length, note: "通勤・休憩の入口" },
  { label: "16〜30分", count: durations.filter((minutes) => minutes >= 16 && minutes <= 30).length, note: "1テーマを学ぶ" },
  { label: "31〜60分", count: durations.filter((minutes) => minutes >= 31 && minutes <= 60).length, note: "まとまった基礎学習" },
  { label: "61分以上", count: durations.filter((minutes) => minutes >= 61).length, note: "体系的に深掘り" }
] as const;
const underThirtyCount = durations.filter((minutes) => minutes <= 30).length;
const medianMinutes = durations[Math.floor(durations.length / 2)] ?? 0;
const scores = videos.map((video) => video.score).filter((score): score is number => score !== null);
const averageScore = scores.length > 0
  ? Math.round((scores.reduce((total, score) => total + score, 0) / scores.length) * 10) / 10
  : null;
const genreCounts = Array.from(new Set(videos.map((video) => video.genre)))
  .map((genre) => ({
    genre,
    label: genreDisplayName(genre),
    count: videos.filter((video) => video.genre === genre).length
  }))
  .sort((a, b) => b.count - a.count);
const reviewTime = Date.parse(`${REVIEWED_AT}T23:59:59+09:00`);
const recentNinetyCount = videos.filter((video) => {
  const published = video.publishedAt ? Date.parse(video.publishedAt) : Number.NaN;
  return Number.isFinite(published) && published <= reviewTime && reviewTime - published <= 90 * 24 * 60 * 60 * 1000;
}).length;
const recentYearCount = videos.filter((video) => {
  const published = video.publishedAt ? Date.parse(video.publishedAt) : Number.NaN;
  return Number.isFinite(published) && published <= reviewTime && reviewTime - published <= 365 * 24 * 60 * 60 * 1000;
}).length;

const pageTitle = `YouTube学習動画${videos.length}本を分析｜選びやすい長さとジャンル | Manapick`;
const pageDescription =
  `運営者が視聴確認したYouTube学習動画${videos.length}本を集計。中央値${medianMinutes}分、30分以下${underThirtyCount}本。` +
  "社会人が無料動画を選ぶときの長さ・ジャンル・鮮度の見方を、調査方法と限界を含めて公開します。";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: { canonical: pageUrl },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: pageUrl,
    type: "article",
    images: [absoluteUrl("/brand/ogp-manapick.png")]
  },
  twitter: {
    card: "summary_large_image",
    site: "@manapick_app",
    title: pageTitle,
    description: pageDescription,
    images: [absoluteUrl("/brand/ogp-manapick.png")]
  }
};

export default function YoutubeLearningDataPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: pageTitle,
        description: pageDescription,
        dateModified: REVIEWED_AT,
        inLanguage: "ja",
        mainEntityOfPage: pageUrl,
        author: { "@id": absoluteUrl("/#organization") },
        publisher: { "@id": absoluteUrl("/#organization") }
      },
      {
        "@type": "Dataset",
        name: `Manapick掲載YouTube学習動画${videos.length}本の集計`,
        description: "Manapick運営者が視聴確認した掲載動画について、所要時間、ジャンル、公開日、7軸35点のスコアを集計したデータです。YouTube全体を代表する標本ではありません。",
        url: pageUrl,
        dateModified: REVIEWED_AT,
        creator: { "@id": absoluteUrl("/#organization") },
        inLanguage: "ja",
        measurementTechnique: "運営者による全編視聴確認と7軸35点採点、動画メタデータの集計",
        variableMeasured: ["動画本数", "動画時間", "ジャンル", "公開日", "Manapickスコア"]
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "ホーム", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: "YouTube学習動画データ", item: pageUrl }
        ]
      }
    ]
  };

  return (
    <main className="knowledge-page research-data-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />
      <header className="knowledge-header">
        <Link href="/" aria-label="Manapick トップへ">
          <BrandLogo compact />
        </Link>
        <Link className="knowledge-header-link" href="/about-score/">採点方法</Link>
      </header>

      <nav className="knowledge-breadcrumb" aria-label="パンくず">
        <Link href="/">ホーム</Link>
        <span aria-hidden="true">›</span>
        <span>YouTube学習動画データ</span>
      </nav>

      <section className="knowledge-hero research-data-hero">
        <p className="section-eyebrow">Manapick独自集計</p>
        <h1>YouTube学習動画{videos.length}本を見て分かった、選びやすい1本の条件</h1>
        <p>
          Manapick掲載動画を、長さ・ジャンル・公開日・スコアで集計しました。
          最初の1本は「30分以下」と「次に見る順番」がある動画を候補にすると、選択肢を絞りやすくなります。
        </p>
        <div className="research-data-hero-actions">
          <Link href="/start/">3つの質問で今日の1本を選ぶ</Link>
          <Link href="/study-plan/">7日学習プランを作る</Link>
        </div>
        <p className="research-caution">最終集計日: 2026年8月5日 ／ 対象: Manapick掲載動画。YouTube全体を代表する調査ではありません。</p>
      </section>

      <section className="knowledge-section" aria-labelledby="data-summary-title">
        <p className="section-eyebrow">結論先出し</p>
        <h2 id="data-summary-title">掲載動画の{percent(underThirtyCount)}%が30分以下。中央値は{medianMinutes}分</h2>
        <div className="research-metric-grid">
          <article>
            <span>視聴確認済み</span>
            <strong>{videos.length}<small>本</small></strong>
            <p>全件を運営者が視聴確認</p>
          </article>
          <article>
            <span>動画時間の中央値</span>
            <strong>{medianMinutes}<small>分</small></strong>
            <p>長い一部の動画に引っ張られにくい中央値</p>
          </article>
          <article>
            <span>30分以下</span>
            <strong>{underThirtyCount}<small>本</small></strong>
            <p>掲載全体の{percent(underThirtyCount)}%</p>
          </article>
          <article>
            <span>平均スコア</span>
            <strong>{averageScore ?? "—"}<small>/35</small></strong>
            <p>採用基準を通過した動画だけの平均</p>
          </article>
        </div>
      </section>

      <section className="knowledge-section" aria-labelledby="duration-data-title">
        <p className="section-eyebrow">動画の長さ</p>
        <h2 id="duration-data-title">使える時間から、無理のない長さを選ぶ</h2>
        <p>
          短ければ必ず良いわけではありません。最初は15〜30分で全体像をつかみ、必要になった段階で長尺に進むと、視聴前の判断を減らせます。
        </p>
        <figure className="research-bar-chart" aria-labelledby="duration-chart-caption">
          <figcaption id="duration-chart-caption">Manapick掲載{videos.length}本を動画時間別に集計</figcaption>
          {durationGroups.map((group) => (
            <div key={group.label}>
              <span>{group.label}</span>
              <span className="research-bar-track" aria-hidden="true">
                <i style={{ width: `${percent(group.count)}%` }} />
              </span>
              <strong>{group.count}本</strong>
              <small>{group.note} ／ {percent(group.count)}%</small>
            </div>
          ))}
        </figure>
      </section>

      <section className="knowledge-section" aria-labelledby="genre-data-title">
        <p className="section-eyebrow">ジャンル構成</p>
        <h2 id="genre-data-title">資格からAIまで、10ジャンルの掲載本数</h2>
        <p>本数は学びやすさや重要度の順位ではありません。目的に近いジャンルを選び、各ロードマップのSTEP1から始めてください。</p>
        <div className="research-genre-table-wrap">
          <table className="research-genre-table">
            <thead><tr><th>ジャンル</th><th>掲載本数</th><th>構成比</th><th>次の行動</th></tr></thead>
            <tbody>
              {genreCounts.map((item) => (
                <tr key={item.genre}>
                  <th scope="row">{item.label}</th>
                  <td>{item.count}本</td>
                  <td>{percent(item.count)}%</td>
                  <td><Link href={`/genre/${item.genre}/`}>見る順を確認 →</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="knowledge-section" aria-labelledby="freshness-data-title">
        <p className="section-eyebrow">鮮度の読み方</p>
        <h2 id="freshness-data-title">新しさだけでなく、内容が現在も使えるかを確認する</h2>
        <div className="research-method-grid">
          <article>
            <h3>公開から90日以内</h3>
            <p><strong>{recentNinetyCount}本</strong>。変化の速いテーマでは、新着ページと公開日を優先して確認します。</p>
          </article>
          <article>
            <h3>公開から1年以内</h3>
            <p><strong>{recentYearCount}本</strong>。新しさだけでなく、現在も入口として使えるかを全編視聴で確認します。</p>
          </article>
        </div>
        <p>AI・制度・ソフトウェア操作は公開日を重く見ます。一方、英語の基礎や考え方のように変化が緩やかなテーマは、古くても内容を視聴確認し、現在も入口として使える動画を残しています。</p>
      </section>

      <section className="knowledge-section research-method-section" aria-labelledby="data-method-title">
        <p className="section-eyebrow">調査方法と限界</p>
        <h2 id="data-method-title">数字を過大に見せないための前提</h2>
        <ul>
          <li>対象はManapickに掲載している動画だけです。YouTube上の全学習動画を無作為抽出した調査ではありません。</li>
          <li>運営者が全編を視聴し、実用性・正確性と鮮度・分かりやすさ・体系性・信頼性・視聴体験・規約と権利の7軸で採点しています。</li>
          <li>平均スコアは採用基準を通過した動画だけの値です。YouTube動画全体の平均品質を示しません。</li>
          <li>動画の完視聴率や学習成果は測定していません。時間分布から効果を断定せず、選ぶ負担を減らす目安として公開しています。</li>
        </ul>
        <div className="research-method-links">
          <Link href="/about-score/">7軸35点の採点方法</Link>
          <Link href="/youtube-learning/">無料動画で学ぶ手順</Link>
          <Link href="/network/">動画からAI・資格・仕事へ広げる</Link>
        </div>
      </section>
    </main>
  );
}
