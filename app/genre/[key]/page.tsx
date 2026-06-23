import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { guidePath, guides } from "@/lib/guides";
import { manapickAiContextForGenre, manapickAiHrefForGenre } from "@/lib/ai-crosslinks";
import {
  absoluteUrl,
  genreDisplayName,
  publishedGenreKeys,
  scoreText,
  videoPath,
  videos,
  youtubeThumbnail,
  type Video
} from "@/lib/manapick";
import { eligibleSubPagePath, eligibleSubPagesForGenre } from "@/lib/sub-pages";

type GenrePageProps = {
  params: Promise<{ key: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return publishedGenreKeys.map((key) => ({ key }));
}

function genreVideos(key: string): Video[] {
  return videos
    .filter((video) => video.genre === key)
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
}

function genreGuideSlug(key: string): string | null {
  const guide = guides.find((item) => item.genre === key);
  return guide ? guide.slug : null;
}

type GenreSeo = {
  title: string;
  description: string;
  h1: string;
  lead: string;
  links: readonly { label: string; href: string; note: string }[];
  faq: readonly { question: string; answer: string }[];
};

function genreSeoFor(key: string, label: string, count: number): GenreSeo {
  const fallback: GenreSeo = {
    title: `${label}の学習動画${count}本｜見る順に厳選・無料 | Manapick`,
    description: `${label}を学び直すための無料YouTube動画を7軸35点で採点し、見る順（ロードマップ）に整理。登録不要・全部無料。`,
    h1: `${label}の学習動画（${count}本）`,
    lead: `${label}を学び直すための無料YouTube動画を、7軸35点で採点して“見る順”に整理しました。登録不要・全部無料です。`,
    links: [],
    faq: []
  };

  const targets: Record<string, GenreSeo> = {
    video: {
      title: "YouTubeサムネイルの作り方が学べる無料動画｜初心者向け | Manapick",
      description: "YouTubeサムネイルの作り方と動画編集を学べる無料動画を厳選。初心者がカット、テロップ、デザインまで順番に学べます。",
      h1: `YouTubeサムネイルの作り方と動画編集の無料動画（${count}本）`,
      lead: "YouTubeサムネイルの作り方を探している人は、画像の作り方だけでなく、動画本編の流れと入口の見せ方を合わせて学ぶと改善しやすくなります。このページでは、動画編集・デザイン・サムネイル制作に関する無料YouTube動画を7軸35点で確認し、初心者が見る順を決めやすいように整理しています。",
      links: [
        { label: "YouTubeサムネイルの作り方を学ぶ動画", href: "/genre/video/%E3%83%87%E3%82%B6%E3%82%A4%E3%83%B3/", note: "デザイン・サムネイル制作の動画をまとめて確認" },
        { label: "動画編集ロードマップ", href: "/guide/video-editing/", note: "編集の流れからサムネイルまで順番に学ぶ" }
      ],
      faq: [
        { question: "YouTubeサムネイルの作り方は何から学べばいい？", answer: "まずは文字量、構図、背景と人物の見せ方など、クリック前に伝わる情報を整理します。その後に使うツールを選ぶと、デザインだけが先走りにくくなります。" },
        { question: "動画編集初心者はサムネイルも同時に学ぶべき？", answer: "最初は短い動画を1本完成させ、次にサムネイルを整える順番がおすすめです。動画内容と入口の見せ方を合わせると、改善点を見つけやすくなります。" },
        { question: "無料ツールだけでも練習できますか？", answer: "できます。CapCut、DaVinci Resolve、無料デザインツールなどから始められます。まずは無料で1本作り、必要になった機能だけ有料ツールを検討すれば十分です。" }
      ]
    },
    prog: {
      title: "Pythonは難しい？初心者向け無料動画ロードマップ | Manapick",
      description: "Pythonが難しいと感じる初心者向けに、環境構築・文法・Webアプリまで無料動画を整理。つまずきポイントも確認できます。",
      h1: `Pythonは難しい？プログラミング学習動画（${count}本）`,
      lead: "Pythonは難しいと感じやすい一方で、学ぶ順番を分けると進めやすくなります。最初は環境構築と基本文法を一周し、次にエラーや反復練習、最後に小さなWebアプリや自動化へ進む流れです。このページでは、Pythonを中心にプログラミングの無料YouTube動画を採点し、初心者が迷いやすい入口から順番に見られるよう整理しています。",
      links: [
        { label: "Pythonは難しい？初心者向けロードマップ", href: "/guide/python/", note: "環境構築からFlaskまで無料動画で確認" },
        { label: "Python動画だけを見る", href: "/genre/prog/Python/", note: "Python入門・基礎講座を一覧で比較" }
      ],
      faq: [
        { question: "Pythonは初心者には難しいですか？", answer: "環境構築やエラー文で難しく感じることがあります。ただ、短い動画で全体像を一周してから復習する順番なら、文法暗記だけで進めるより続けやすくなります。" },
        { question: "Pythonは何から勉強するべき？", answer: "まず実行環境と基本文法、その後にデータ処理やWebアプリなど目的別の小さな題材へ進むのがおすすめです。最初から大きなアプリを作ろうとしないほうが安全です。" },
        { question: "エラーで止まったらどうすればいい？", answer: "エラー文をそのまま検索するか、生成AIに貼って日本語で説明してもらうと原因を切り分けやすくなります。まず動く環境を保つことを優先してください。" }
      ]
    },
    data: {
      title: "エクセル統計の使い方が学べる無料動画｜データ分析入門 | Manapick",
      description: "エクセル統計の使い方、集計、分析、パワークエリを無料動画で整理。Excelからデータ分析を始めたい人向けです。",
      h1: `エクセル統計の使い方とデータ分析動画（${count}本）`,
      lead: "エクセル統計の使い方を学ぶなら、統計用語を暗記する前に、手元の表を整え、集計し、読み取る流れを体験するのが近道です。平均や割合、ピボット、グラフ、パワークエリを使う目的が見えると、業務の数字も扱いやすくなります。このページでは、Excelとデータ分析の無料YouTube動画を整理しています。",
      links: [
        { label: "エクセル統計の使い方ロードマップ", href: "/guide/excel-data/", note: "Excel分析からパワークエリまで順番に学ぶ" },
        { label: "統計の動画だけを見る", href: "/genre/data/%E7%B5%B1%E8%A8%88/", note: "統計入門・仮説検定・Excel統計を確認" }
      ],
      faq: [
        { question: "エクセル統計は何から使えばいい？", answer: "最初は平均、割合、並べ替え、ピボットテーブルなど、業務の表を読む操作から始めるのがおすすめです。必要になった統計用語をあとから確認すると理解しやすくなります。" },
        { question: "Excelだけでデータ分析はできますか？", answer: "日常業務の集計や傾向把握ならExcelだけで十分始められます。繰り返し作業が多い場合は、パワークエリやPythonへ広げると効率化できます。" },
        { question: "統計が苦手でも大丈夫ですか？", answer: "大丈夫です。最初から検定や数式へ入らず、表を整えてグラフで傾向を見るところから始めると、統計の意味も後からつながりやすくなります。" }
      ]
    },
    ai: {
      title: "AIプロンプトのコツとCopilot活用事例が学べる無料動画 | Manapick",
      description: "AIプロンプトのコツ、Copilot活用事例、ChatGPT/Gemini/Claudeの使い分けを無料動画で整理。仕事に使う順番がわかります。",
      h1: `AIプロンプトのコツとCopilot活用動画（${count}本）`,
      lead: "AIプロンプトのコツやCopilot活用事例を探すなら、まず生成AIの基本操作を触り、次に自分の仕事に近い文章作成・表整理・資料作成へ当てはめる順番が使いやすいです。プロンプトは目的、前提、出力形式を伝える設計です。このページでは、生成AIを仕事に使うための無料動画を整理しています。",
      links: [
        { label: "AIプロンプトのコツを学ぶ動画", href: "/genre/ai/%E3%83%97%E3%83%AD%E3%83%B3%E3%83%97%E3%83%88/", note: "指示出し・プロンプト設計の動画を比較" },
        { label: "Copilot活用事例を見る", href: "/genre/ai/Copilot/", note: "Microsoft 365 Copilotの業務利用を確認" },
        { label: "生成AIロードマップ", href: "/guide/generative-ai/", note: "ChatGPT/Gemini/Claudeから順番に学ぶ" }
      ],
      faq: [
        { question: "AIプロンプトのコツは何ですか？", answer: "目的、前提、出力形式、制約を分けて伝えることです。短い命令だけでなく、誰向けに何を作るかまで入れると回答のブレを減らせます。" },
        { question: "Copilot活用事例は何から見るべき？", answer: "Word、Excel、PowerPointなど、普段使う作業に近い事例から見るのがおすすめです。社内データを扱う場合は、所属先の利用ルールも確認してください。" },
        { question: "ChatGPTとCopilotはどう使い分ける？", answer: "ChatGPTは幅広い相談や文章作成、CopilotはMicrosoft 365上の文書・表・スライド作業と相性があります。用途ごとに試すと判断しやすくなります。" }
      ]
    },
    shikaku: {
      title: "社労士試験の独学に役立つ無料動画｜資格勉強ロードマップ | Manapick",
      description: "社労士試験、宅建、ITパスポートなど資格勉強の無料動画を整理。計画、範囲把握、過去問演習の順に学べます。",
      h1: `社労士試験と資格勉強の無料動画（${count}本）`,
      lead: "社労士試験や資格勉強は、いきなり全範囲を読み始めるより、試験日から逆算して計画を作り、範囲を見て、過去問へ移る順番が続けやすいです。社労士は科目数が多いため、最初に試験制度と学習時間の目安を押さえることが大切です。このページでは、資格ジャンルの無料動画を整理しています。",
      links: [
        { label: "社労士試験の動画だけを見る", href: "/genre/shikaku/%E7%A4%BE%E5%8A%B4%E5%A3%AB/", note: "社労士の試験制度・勉強法・科目対策を確認" },
        { label: "資格勉強の始め方ロードマップ", href: "/guide/certification/", note: "計画から過去問までの順番を見る" }
      ],
      faq: [
        { question: "社労士試験は独学でも始められますか？", answer: "始められます。ただし科目数が多いため、最初に試験日、学習時間、過去問演習の開始時期を決めることが重要です。" },
        { question: "社労士試験は何から勉強すればいい？", answer: "まず試験制度と全科目の地図を見て、次に労働基準法など入口になりやすい科目へ進むのがおすすめです。過去問で出方を確認しながら戻ると続けやすくなります。" },
        { question: "資格勉強は動画だけで足りますか？", answer: "動画だけでは演習量が不足します。動画で全体像をつかみ、問題集や過去問で確認する組み合わせが現実的です。" }
      ]
    },
    marke: {
      title: "マーケティングYouTubeおすすめ動画｜Canva初心者も学べる | Manapick",
      description: "マーケティングをYouTubeで学びたい初心者向けに、Webマーケ、SEO、SNS、Canva基礎の無料動画を整理します。",
      h1: `マーケティングYouTubeおすすめ動画（${count}本）`,
      lead: "マーケティングをYouTubeで学ぶときは、SNSの小技や広告操作だけを先に追うより、Webマーケティングの全体像、SEOと計測、SNS・制作の順に見ると施策のつながりが分かります。Canva初心者向けの動画も、何を誰に届けるかを理解してから見ると使いやすくなります。このページでは無料動画を整理しています。",
      links: [
        { label: "マーケティングYouTubeおすすめロードマップ", href: "/guide/web-marketing/", note: "Webマーケ・SEO・SNS・広告を順番に学ぶ" },
        { label: "Canva初心者向け動画を見る", href: "/genre/marke/SNS/", note: "SNS制作やCanva基礎の動画を確認" },
        { label: "Webマーケ動画だけを見る", href: "/genre/marke/Web%E3%83%9E%E3%83%BC%E3%82%B1/", note: "Webマーケの全体像と広告基礎を比較" }
      ],
      faq: [
        { question: "マーケティングはYouTubeだけで学べますか？", answer: "基礎の全体像や用語理解はYouTubeだけでも始められます。動画を見た後、自分のサイトやSNSに当てはめて、数字を見ながら改善する練習が必要です。" },
        { question: "Canva初心者は何から始めるべき？", answer: "まずテンプレートで1枚作り、文字量、余白、色を整えるところからで十分です。マーケティングの目的を先に決めると、作るものがぶれにくくなります。" },
        { question: "Webマーケの学習順は？", answer: "全体像、SEOと計測、SNS運用、広告の順がおすすめです。広告から始めるより、数字を見て改善する土台を先に作るほうが判断しやすくなります。" }
      ]
    }
  };

  return targets[key] ?? fallback;
}

export async function generateMetadata({ params }: GenrePageProps): Promise<Metadata> {
  const { key } = await params;
  if (!publishedGenreKeys.includes(key)) return {};

  const label = genreDisplayName(key);
  const count = genreVideos(key).length;
  const seo = genreSeoFor(key, label, count);
  const title = seo.title;
  const description = seo.description;
  const url = absoluteUrl(`/genre/${key}/`);

  return {
    title,
    description,
    alternates: {
      canonical: url
    },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      images: [absoluteUrl("/brand/ogp-manapick.png")]
    },
    twitter: {
      card: "summary_large_image",
      site: "@manapick_app",
      title,
      description,
      images: [absoluteUrl("/brand/ogp-manapick.png")]
    }
  };
}

export default async function GenrePage({ params }: GenrePageProps) {
  const { key } = await params;
  if (!publishedGenreKeys.includes(key)) notFound();

  const label = genreDisplayName(key);
  const list = genreVideos(key);
  const guideSlug = genreGuideSlug(key);
  const url = absoluteUrl(`/genre/${key}/`);
  const subPages = eligibleSubPagesForGenre(key);
  const seo = genreSeoFor(key, label, list.length);

  const collection = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: seo.h1,
    url,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: list.length,
      itemListElement: list.slice(0, 30).map((video, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: absoluteUrl(videoPath(video.ytid)),
        name: video.title
      }))
    }
  };
  const faqData = seo.faq.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: seo.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer
      }
    }))
  } : null;
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "ホーム",
        item: absoluteUrl("/")
      },
      {
        "@type": "ListItem",
        position: 2,
        name: label,
        item: url
      }
    ]
  };

  return (
    <main className="genre-hub">
      <nav className="genre-hub-crumb" aria-label="パンくず">
        <Link href="/">ホーム</Link>
        <span aria-hidden="true">›</span>
        <span>{label}</span>
      </nav>

      <h1 className="genre-hub-title">{seo.h1}</h1>
      <p className="genre-hub-lead">
        {seo.lead}
      </p>
      {guideSlug ? (
        <p className="genre-hub-roadmap">
          <Link href={guidePath(guideSlug)}>▶ {label}の完全ロードマップ（初級→上級の見る順）を読む</Link>
        </p>
      ) : null}
      {seo.links.length > 0 ? (
        <section className="genre-hub-query-links" aria-label="関連する検索意図">
          {seo.links.map((item) => (
            <Link key={item.href + item.label} href={item.href}>
              <span>{item.label}</span>
              <small>{item.note}</small>
            </Link>
          ))}
        </section>
      ) : null}
      <ManapickAiGenreBand genreKey={key} />
      {subPages.length > 0 ? (
        <section className="genre-hub-subpages" aria-labelledby="genre-hub-subpages-title">
          <h2 id="genre-hub-subpages-title">{label}のトピック別ロードマップ</h2>
          <div className="genre-hub-subpage-grid">
            {subPages.map((item) => (
              <Link key={item.key + item.sub} href={eligibleSubPagePath(item)}>
                <span>{item.sub}</span>
                <strong>{item.count}本</strong>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {seo.faq.length > 0 ? (
        <section className="genre-hub-faq" aria-labelledby="genre-hub-faq-title">
          <h2 id="genre-hub-faq-title">{label}を学ぶ前によくある質問</h2>
          <div className="genre-hub-faq-list">
            {seo.faq.map((item) => (
              <details key={item.question}>
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </section>
      ) : null}

      <ul className="genre-hub-grid" role="list">
        {list.map((video) => (
          <li key={video.ytid}>
            <Link href={videoPath(video.ytid)} className="genre-hub-card">
              <Image
                src={youtubeThumbnail(video.ytid)}
                alt={video.title + "のサムネイル"}
                width={320}
                height={180}
                sizes="(min-width: 768px) 320px, 90vw"
                loading="lazy"
              />
              <span className="genre-hub-card-title">{video.title}</span>
              <span className="genre-hub-card-meta">{scoreText(video)}・{video.minutes}分・{video.sub}</span>
            </Link>
          </li>
        ))}
      </ul>

      <p className="genre-hub-back">
        <Link href="/">← すべてのジャンルを見る</Link>
      </p>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collection).replace(/</g, "\\u003c") }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb).replace(/</g, "\\u003c") }}
      />
      {faqData ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData).replace(/</g, "\\u003c") }}
        />
      ) : null}
    </main>
  );
}

function ManapickAiGenreBand({ genreKey }: { genreKey: string }) {
  const href = manapickAiHrefForGenre(genreKey);
  const context = manapickAiContextForGenre(genreKey);
  return (
    <section className="manapick-ai-crosslink is-genre" aria-label="公式AI版 manapick AI">
      <div>
        <p className="section-eyebrow">公式AI版</p>
        <h2>“使えるAI”を選ぶなら <span className="ai-brand-word">manapick AI</span></h2>
        <p>{context}</p>
      </div>
      <a href={href} target="_blank" rel="noopener">
        manapick AIを見る ↗
      </a>
    </section>
  );
}
