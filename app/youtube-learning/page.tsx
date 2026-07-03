import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
import { learningIntentPath, learningIntents } from "@/lib/learning-intents";
import { absoluteUrl, genreDisplayName, genreLabel, scoreText, videoPath, youtubeThumbnail, type Video } from "@/lib/manapick";
import { rankedVideos } from "@/lib/rankings";
import { siteStats } from "@/lib/site-stats";

const pageTitle = "YouTube学習動画おすすめ｜無料で何から始めるか迷わない | Manapick";
const pageDescription =
  "YouTubeで勉強したい社会人向けに、無料学習動画の選び方、リスキリングで何から始めるか、ジャンル別おすすめ動画を整理。" +
  siteStats.totalVideos +
  "本の視聴確認済み動画を7軸35点で採点しています。";
const pageUrl = absoluteUrl("/youtube-learning/");

const intentCards = [
  {
    label: "youtube おすすめ",
    title: "おすすめ欄で迷う人へ",
    body: "視聴時間ではなく、学習に役立つかを基準に選びます。まずは総合人気と高スコアを見比べるのが近道です。",
    href: "/ranking/"
  },
  {
    label: "動画 勉強",
    title: "動画で勉強を始めたい人へ",
    body: "1本だけ選ぶより、初級→中級→上級の順番を決めると挫折しにくくなります。ジャンル別ロードマップから始められます。",
    href: "/#roadmap"
  },
  {
    label: "リスキリング 何から始める",
    title: "何から始めるか決まらない人へ",
    body: "職業ゴール、ジャンル、所要時間のどれか1つだけ決めれば十分です。3つの質問で今日の1本を提案します。",
    href: "/start/"
  },
  {
    label: "学習 無料 動画",
    title: "無料で学べる動画を探す人へ",
    body: "ManapickはYouTube公式動画だけを紹介します。会員登録不要で、あとで見る・視聴済みの記録もこの端末だけで使えます。",
    href: "/new/"
  }
] as const;

const steps = [
  {
    title: "目的を1つに絞る",
    body: "転職、仕事効率化、資格、英語など、いま必要な目的を1つだけ選びます。目的が曖昧なら「今日の1本診断」から始めるのが安全です。",
    href: "/start/"
  },
  {
    title: "15〜30分で見切れる1本から始める",
    body: "最初から長尺を選ぶと続きにくくなります。短めの動画で全体像をつかみ、必要なら長尺や教材で補う順番にします。",
    href: "/ranking/#score"
  },
  {
    title: "視聴済みを残して次へ進む",
    body: "見終わった動画を記録すると、学習が中断しても戻りやすくなります。小さな達成感を積み上げる設計にしています。",
    href: "/my/"
  }
] as const;

const faq = [
  {
    question: "YouTubeのおすすめ動画だけで勉強しても大丈夫ですか？",
    answer:
      "入口としては便利ですが、視聴時間を伸ばす動画と学習に役立つ動画は一致しないことがあります。Manapickでは運営者が視聴確認し、7軸35点で学習用途として採点した動画だけを掲載しています。"
  },
  {
    question: "リスキリングは何から始めればいいですか？",
    answer:
      "まずは目的を1つに絞り、初級向けの短い動画を1本見るところから始めるのがおすすめです。迷う場合は、生成AI、Office・資料作成、英語、資格のどれかを選ぶと仕事に結びつけやすくなります。"
  },
  {
    question: "無料動画だけで足りますか？",
    answer:
      "基礎の入口や全体像の把握には無料動画で十分なことが多いです。演習量や試験対策が必要になった段階で、書籍や講座を補助教材として検討してください。PRリンクがある場合も、順位は報酬で操作しません。"
  },
  {
    question: "スマホだけでも使えますか？",
    answer:
      "はい。スマホでは今日の1本診断、あとで見る、視聴済み、ロードマップの横スクロール表示を使えます。通勤や休憩の15分から始めやすい導線にしています。"
  }
] as const;

const genreStarterLinks = [
  { genre: "ai", href: "/guide/generative-ai/", note: "仕事でAIを使い始めたい" },
  { genre: "biz", href: "/guide/office-skills/", note: "資料作成やExcelを整えたい" },
  { genre: "english", href: "/guide/english/", note: "英語をやり直したい" },
  { genre: "shikaku", href: "/guide/certification/", note: "資格勉強の順番を決めたい" },
  { genre: "prog", href: "/guide/python/", note: "プログラミングを始めたい" },
  { genre: "data", href: "/guide/excel-data/", note: "データ分析を仕事に使いたい" }
] as const;

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: pageUrl
  },
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

export default function YoutubeLearningPage() {
  const topVideos = rankedVideos("score", 6);
  const popularVideos = rankedVideos("popular", 6);
  const itemList = topVideos.map((video, index) => ({
    "@type": "ListItem",
    position: index + 1,
    url: absoluteUrl(videoPath(video.ytid)),
    name: video.title
  }));
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: pageTitle,
        description: pageDescription,
        inLanguage: "ja",
        mainEntityOfPage: pageUrl,
        author: { "@id": absoluteUrl("/#organization") },
        publisher: { "@id": absoluteUrl("/#organization") }
      },
      {
        "@type": "ItemList",
        name: "無料YouTube学習動画のおすすめ",
        numberOfItems: topVideos.length,
        itemListElement: itemList
      },
      {
        "@type": "HowTo",
        name: "リスキリングを無料動画で始める手順",
        description: "YouTube学習動画を使って、迷わず最初の1本を選ぶための手順です。",
        step: steps.map((step, index) => ({
          "@type": "HowToStep",
          position: index + 1,
          name: step.title,
          text: step.body,
          url: absoluteUrl(step.href)
        }))
      },
      {
        "@type": "FAQPage",
        mainEntity: faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer
          }
        }))
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "ホーム", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: "YouTube学習動画おすすめ", item: pageUrl }
        ]
      }
    ]
  };

  return (
    <main className="knowledge-page youtube-learning-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />
      <header className="knowledge-header">
        <Link href="/" aria-label="Manapick トップへ">
          <BrandLogo compact />
        </Link>
        <Link className="knowledge-header-link" href="/start/">今日の1本診断</Link>
      </header>

      <nav className="knowledge-breadcrumb" aria-label="パンくず">
        <Link href="/">ホーム</Link>
        <span aria-hidden="true">›</span>
        <span>YouTube学習動画おすすめ</span>
      </nav>

      <section className="knowledge-hero youtube-learning-hero">
        <p className="section-eyebrow">無料動画で学び直す</p>
        <h1>
          YouTube学習動画のおすすめを、
          <span className="knowledge-title-phrase">見る順まで決める。</span>
        </h1>
        <p>
          「youtube おすすめ」「動画 勉強」「リスキリング 何から始める」で迷う人向けに、
          視聴確認済み{siteStats.totalVideos}本から、最初の1本と次の順番を整理しました。
        </p>
        <div className="youtube-learning-cta-row">
          <Link href="/start/">3つの質問で今日の1本を選ぶ</Link>
          <Link href="/ranking/">人気ランキングを見る</Link>
        </div>
      </section>

      <section className="knowledge-section youtube-answer-section" aria-labelledby="youtube-answer-title">
        <p className="section-eyebrow">結論</p>
        <h2 id="youtube-answer-title">無料動画で勉強するなら、まず「目的・レベル・時間」を1つずつ決める</h2>
        <p>
          YouTubeには良い動画が多い一方で、サムネイルの強さや再生数だけでは学習向きか判断しにくいことがあります。
          Manapickでは、誇大な成果保証や情報商材誘導が強い動画を外し、公式YouTube動画だけを7軸35点で採点しています。
        </p>
        <div className="youtube-intent-grid">
          {intentCards.map((item) => (
            <Link key={item.label} href={item.href}>
              <span>{item.label}</span>
              <strong>{item.title}</strong>
              <small>{item.body}</small>
            </Link>
          ))}
        </div>
      </section>

      <section className="knowledge-section" aria-labelledby="youtube-steps-title">
        <p className="section-eyebrow">続ける設計</p>
        <h2 id="youtube-steps-title">スマホでも続きやすい3ステップ</h2>
        <div className="youtube-step-grid">
          {steps.map((step, index) => (
            <Link key={step.title} href={step.href} className="youtube-step-card">
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{step.title}</strong>
              <small>{step.body}</small>
            </Link>
          ))}
        </div>
        <p className="youtube-ethics-note">
          連続学習や「あとで見る」は、学習を戻しやすくするための補助機能です。焦らせる通知や成果保証ではなく、上達実感を残すために使います。
        </p>
      </section>

      <section className="knowledge-section" aria-labelledby="youtube-search-intents-title">
        <p className="section-eyebrow">検索でよく探されるテーマ</p>
        <h2 id="youtube-search-intents-title">よく探される悩みから、見る順を決める</h2>
        <div className="learning-intent-grid">
          {learningIntents.map((intent) => (
            <Link key={intent.slug} href={learningIntentPath(intent.slug)} className="learning-intent-card">
              <span>{intent.query}</span>
              <strong>{intent.h1}</strong>
              <small>{intent.audience}</small>
            </Link>
          ))}
        </div>
      </section>

      <section className="knowledge-section" aria-labelledby="youtube-top-title">
        <div className="youtube-section-head">
          <div>
            <p className="section-eyebrow">まず見る候補</p>
            <h2 id="youtube-top-title">高スコアの無料学習動画</h2>
          </div>
          <Link href="/ranking/#score">高スコア順をもっと見る</Link>
        </div>
        <div className="youtube-video-grid">
          {topVideos.map((video, index) => (
            <LearningVideoCard key={video.ytid} video={video} rank={index + 1} />
          ))}
        </div>
      </section>

      <section className="knowledge-section" aria-labelledby="youtube-genre-title">
        <p className="section-eyebrow">目的別</p>
        <h2 id="youtube-genre-title">リスキリングで何から始めるか</h2>
        <div className="youtube-genre-grid">
          {genreStarterLinks.map((item) => (
            <Link key={item.genre} href={item.href}>
              <span>{genreLabel(item.genre)}</span>
              <strong>{item.note}</strong>
              <small>{genreDisplayName(item.genre)}のロードマップへ</small>
            </Link>
          ))}
        </div>
      </section>

      <section className="knowledge-section" aria-labelledby="youtube-popular-title">
        <div className="youtube-section-head">
          <div>
            <p className="section-eyebrow">比較用</p>
            <h2 id="youtube-popular-title">再生数ベースの総合人気も確認する</h2>
          </div>
          <Link href="/ranking/#popular">総合人気を見る</Link>
        </div>
        <ol className="youtube-popular-list">
          {popularVideos.map((video, index) => (
            <li key={video.ytid}>
              <Link href={videoPath(video.ytid)}>
                <span>{index + 1}</span>
                <strong>{video.title}</strong>
                <small>{genreLabel(video.genre)} / {scoreText(video)} / {video.minutes}分</small>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section className="knowledge-section" aria-labelledby="youtube-pr-title">
        <p className="section-eyebrow">教材・講座の考え方</p>
        <h2 id="youtube-pr-title">有料教材は「足りないところを補う」ために使う</h2>
        <p>
          Manapickは無料動画から始められる設計です。書籍や講座のPRリンクがある場合も、
          「動画で全体像をつかむ → 演習量が必要なら教材で補う」という順番を推奨します。
          広告報酬でランキングやスコアを操作しません。
        </p>
        <nav className="knowledge-link-grid youtube-monetize-links" aria-label="教材と広告方針">
          <Link href="/affiliate/">広告・アフィリエイト方針を見る</Link>
          <Link href="/about-score/">採点方法を見る</Link>
          <Link href="/faq/">よくある質問を見る</Link>
        </nav>
      </section>

      <section className="knowledge-section" aria-labelledby="youtube-faq-title">
        <p className="section-eyebrow">FAQ</p>
        <h2 id="youtube-faq-title">無料学習動画のよくある質問</h2>
        <div className="guide-faq-list">
          {faq.map((item) => (
            <details key={item.question}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}

function LearningVideoCard({ video, rank }: { video: Video; rank: number }) {
  return (
    <Link className="youtube-video-card" href={videoPath(video.ytid)}>
      <span className="youtube-video-thumb">
        <Image
          src={youtubeThumbnail(video.ytid)}
          alt={video.title + "のサムネイル"}
          width={480}
          height={270}
          sizes="(min-width: 920px) 320px, (min-width: 560px) 46vw, 92vw"
          loading={rank <= 2 ? "eager" : "lazy"}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <span>{rank}</span>
      </span>
      <span className="youtube-video-body">
        <small>{genreLabel(video.genre)} / {scoreText(video)} / {video.minutes}分</small>
        <strong>{video.title}</strong>
      </span>
    </Link>
  );
}
