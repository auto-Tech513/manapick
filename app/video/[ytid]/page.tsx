import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import BrandLogo from "@/components/BrandLogo";
import LearningNote from "@/components/LearningNote";
import NetworkContextBand from "@/components/NetworkContextBand";
import FoldSection from "@/components/FoldSection";
import VideoActions from "@/components/VideoActions";
import VideoEmbed from "@/components/VideoEmbed";
import TrackedGaLink from "@/components/TrackedGaLink";
import sisterItemLinks from "@/content/sister-item-links.json";
import roadmapsData from "@/content/roadmaps.json";
import { guidePath, guides } from "@/lib/guides";
import {
  absoluteUrl,
  displayChannel,
  findVideo,
  genreDisplayName,
  genreLabel,
  isoDuration,
  relatedVideos,
  scoreConfirmationDate,
  youtubePublishedDate,
  scoreText,
  videoAudienceText,
  genericAxisNoteCount,
  videoLargeImage,
  isGenericAxisNote,
  videoAxisCommentary,
  videoDescription,
  videoEditorialSummary,
  videoFreshness,
  videoLearningPoints,
  videoPath,
  videoPositionText,
  videoViewingTips,
  videos,
  youtubeEmbedUrl,
  youtubeThumbnail
} from "@/lib/manapick";
import { nextWatchVideo } from "@/lib/rankings";
import { genrePosition } from "@/lib/site-stats";
import AdSlot from "@/components/AdSlot";
import "../../video-detail.css";

type VideoPageProps = {
  params: Promise<{ ytid: string }>;
};

type SisterItemLink = {
  site: "ai" | "license" | "career" | "politics";
  slug: string;
  name: string;
  url: string;
};

type RoadmapStepShape = {
  stage?: string;
  videos?: string[];
};

type RoadmapShape = {
  genre: string;
  steps?: RoadmapStepShape[];
};

export const dynamicParams = false;

export function generateStaticParams() {
  return videos.map((video) => ({ ytid: video.ytid }));
}

export async function generateMetadata({ params }: VideoPageProps): Promise<Metadata> {
  const { ytid } = await params;
  const video = findVideo(ytid);
  if (!video) return {};

  const title = video.title + " | Manapick";
  const description = videoDescription(video);
  const pageUrl = absoluteUrl(videoPath(video.ytid));
  const image = videoLargeImage(video);

  return {
    title,
    description,
    alternates: {
      canonical: pageUrl
    },
    openGraph: {
      title,
      description,
      url: pageUrl,
      type: "video.other",
      images: [
        {
          url: image,
          width: 1280,
          height: 720,
          alt: video.title + "のサムネイル"
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      site: "@manapick_app",
      title,
      description,
      images: [image]
    }
  };
}

export default async function VideoPage({ params }: VideoPageProps) {
  const { ytid } = await params;
  const video = findVideo(ytid);
  if (!video) notFound();

  const channel = displayChannel(video);
  const related = relatedVideos(video);
  const nextPick = nextWatchVideo(video);
  const position = genrePosition(video);
  const guide = guides.find((item) => item.genre === video.genre) ?? null;
  const pageUrl = absoluteUrl(videoPath(video.ytid));
  const confirmationDate = scoreConfirmationDate(video);
  const publishedDate = youtubePublishedDate(video);
  const hasStoredAxisBreakdown = video.axisScores.length === 7;
  const scoreConfirmationText = hasStoredAxisBreakdown
    ? "運営者が7軸35点で採点したスコアです" + (confirmationDate ? "（確認日: " + confirmationDate + "）" : "")
    : "運営者が確認済みの総合スコアです。軸別内訳は準備中です" + (confirmationDate ? "（確認日: " + confirmationDate + "）" : "");
  const positionText = videoPositionText(video);
  const audienceText = videoAudienceText(video);
  const learningPoints = videoLearningPoints(video);
  const axisCommentary = videoAxisCommentary(video);
  // 表示側の正直化の段階（専門家裁定 2026-11-05）：0=全軸固有、1=一部汎用、2=全6軸汎用。
  const genericNoteCount = genericAxisNoteCount(video);
  const noteStage = video.axisScores.length === 0 ? 0 : genericNoteCount >= 6 ? 2 : genericNoteCount > 0 ? 1 : 0;
  const viewingTips = videoViewingTips(video);
  // 「次に見る1本」はページ内で nextPick（ロードマップ上の次を最優先）に統一する。
  // quick-next ナビ・独自解説・下部の次カードが別々の動画を指す矛盾をなくす（UX改善 P0-1）。
  const editorialSummary = videoEditorialSummary(video, nextPick?.video ?? related[0]);
  const freshness = videoFreshness(video);
  const sisterLinks = (sisterItemLinks as Record<string, SisterItemLink[]>)[video.ytid] ?? [];
  const linkedSisterHrefs = sisterLinks.map((link) => link.url);
  // ロードマップに載っている動画は、その段階名（例：仕事で使う）を出す。無ければレベル名をテキストで出す。
  const roadmapStage = (() => {
    const roadmap = (roadmapsData as RoadmapShape[]).find((item) => item.genre === video.genre);
    const step = roadmap?.steps?.find((item) => item.videos?.includes(video.ytid));
    return step?.stage ?? null;
  })();
  // ジャンル内の位置プロット：この動画以下のスコアの割合（パーセンタイル）。中央値は定義上 50%。
  const positionPercent =
    position !== null && position.count > 0
      ? Math.min(96, Math.max(4, Math.round((100 * (position.count - position.higherCount)) / position.count)))
      : null;
  const videoObject = {
    "@type": "VideoObject",
    name: video.title,
    description: videoDescription(video),
    thumbnailUrl: [videoLargeImage(video), youtubeThumbnail(video.ytid)],
    ...(video.publishedAt ? { uploadDate: video.publishedAt } : {}),
    duration: isoDuration(video.minutes),
    embedUrl: youtubeEmbedUrl(video.ytid),
    contentUrl: video.url,
    url: pageUrl,
    // 再生回数は保存データがある動画だけ出す（無い動画は捏造せず省略）。
    ...(typeof video.viewCount === "number"
      ? {
          interactionStatistic: {
            "@type": "InteractionCounter",
            interactionType: "https://schema.org/WatchAction",
            userInteractionCount: video.viewCount
          }
        }
      : {}),
    isAccessibleForFree: true,
    inLanguage: "ja",
    genre: genreDisplayName(video.genre),
    publisher: {
      "@id": absoluteUrl("/#organization")
    }
  };
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      videoObject,
      {
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
            name: genreDisplayName(video.genre),
            item: absoluteUrl(`/genre/${video.genre}/`)
          },
          {
            "@type": "ListItem",
            position: 3,
            name: video.title,
            item: pageUrl
          }
        ]
      }
    ]
  };

  return (
    <main className="video-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />
      <header className="video-page-header">
        <Link href="/" aria-label="Manapick トップへ">
          <BrandLogo compact />
        </Link>
        <Link className="video-header-link" href="/about-score/">採点方法</Link>
      </header>

      <nav className="video-breadcrumb" aria-label="パンくず">
        <Link href="/">ホーム</Link>
        <span aria-hidden="true">/</span>
        <Link href={`/genre/${video.genre}/`}>{genreDisplayName(video.genre)}</Link>
        <span aria-hidden="true">/</span>
        <span>{video.title}</span>
      </nav>

      <div className="vd-head">
        <div className="vd-head-main">
          <div className="video-detail-media">
            <VideoEmbed ytid={video.ytid} title={video.title} poster={videoLargeImage(video)} />
          </div>
          <div className="vd-tags">
            <Link className="vd-genre-pill" href={`/genre/${video.genre}/`}>
              {genreDisplayName(video.genre)}
            </Link>
            {video.sub ? <span className="vd-tag">{video.sub}</span> : null}
            <span className="vd-tag">{roadmapStage ? `段階：${roadmapStage}` : video.level}</span>
            {freshness ? (
              <span className="vd-tag" title={freshness.note}>
                {freshness.label}
              </span>
            ) : null}
          </div>
          <h1 className="vd-title">{video.title}</h1>
          <p className="vd-meta">
            {channel ? <span>{channel}</span> : null}
            {publishedDate ? (
              <span>
                YouTube公開日 <time dateTime={video.publishedAt}>{publishedDate}</time>
              </span>
            ) : null}
            <span>
              <b>{video.minutes}分</b>
              {video.minutes >= 6 ? (
                <span className="vd-meta-sub">（1.5倍速なら約<b>{Math.ceil(video.minutes / 1.5)}分</b>）</span>
              ) : null}
            </span>
          </p>
        </div>

        <aside className="vd-score" aria-label="Manapickスコア">
          <p className="vd-score-k">MANAPICK SCORE · 7 AXES</p>
          <p className="vd-score-total">
            {video.score ?? "–"}
            <small>/35</small>
          </p>
          <p className="vd-score-by">
            <span>運営者が採点済み</span>
            {confirmationDate ? <span>確認日 {confirmationDate}</span> : null}
          </p>
          {position && positionPercent !== null ? (
            <div className="vd-pos">
              <p className="vd-pos-k">ジャンル内の位置（掲載{position.count}本）</p>
              <div
                className="vd-plot"
                role="img"
                aria-label={`スコア${video.score}点。ジャンル中央値は${position.medianScore}点です`}
              >
                <span className="vd-plot-line" aria-hidden="true" />
                <span className="vd-plot-median" style={{ left: "50%" }} aria-hidden="true" />
                <span
                  className="vd-plot-dot"
                  style={{ left: `${positionPercent}%` } as CSSProperties}
                  aria-hidden="true"
                />
                <span
                  className="vd-plot-label"
                  style={{ left: `${positionPercent}%` } as CSSProperties}
                  aria-hidden="true"
                >
                  この動画 {video.score}点
                </span>
              </div>
              <p className="vd-pos-note">
                点線＝中央値 {position.medianScore}点 ／ 長さ {video.minutes}分（中央値 {position.medianMinutes}分）
              </p>
              <p className="vd-pos-link">
                <Link href="/research/youtube-learning-data/">
                  集計の方法と全ジャンルの分布を見る <span aria-hidden="true">→</span>
                </Link>
              </p>
            </div>
          ) : null}
          <VideoActions
            ytid={video.ytid}
            nextVideo={nextPick ? { ytid: nextPick.video.ytid, title: nextPick.video.title } : null}
          />
        </aside>
      </div>
      <p className="vd-score-note">{scoreConfirmationText}</p>

      <nav className="video-quick-next" aria-label="この動画のあとに">
        {nextPick ? (
          <TrackedGaLink
            className="video-next-link"
            href={videoPath(nextPick.video.ytid)}
            eventName="next_video_click"
            eventParams={{ placement: "quick_next", from_video_id: video.ytid, to_video_id: nextPick.video.ytid }}
          >
            次に見る1本：{nextPick.video.title}
          </TrackedGaLink>
        ) : null}
        {guide ? (
          <Link className="video-guide-link" href={guidePath(guide.slug)}>
            {videoGuideLinkLabel(video.genre)}
          </Link>
        ) : null}
      </nav>

      <AdSlot slot="1438236565" />

      <div className="vd-body">
        <nav className="vd-toc" aria-label="目次">
          <p className="vd-toc-k">CONTENTS</p>
          <ol>
            <li>
              <a href="#vd-summary">
                <span>01</span>動画の要約
              </a>
            </li>
            <li>
              <a href="#vd-memo">
                <span>02</span>学びメモ
              </a>
            </li>
            <li>
              <a href="#vd-howto">
                <span>03</span>この動画をどう使うか
              </a>
            </li>
            <li>
              <a href="#vd-guide">
                <span>04</span>視聴前ガイド
              </a>
            </li>
            <li>
              <a href="#vd-axes">
                <span>05</span>7軸のスコア
              </a>
            </li>
            <li>
              <a href="#vd-network">
                <span>06</span>
                {video.sub ?? genreDisplayName(video.genre)}の次に調べる
              </a>
            </li>
            <li>
              <a href="#vd-next">
                <span>07</span>次に見る1本
              </a>
            </li>
          </ol>
        </nav>

        <div className="vd-content">
          <section id="vd-summary" className="vd-sec" aria-labelledby="vd-summary-title">
            <header className="vd-sec-head">
              <span className="vd-sec-no">01</span>
              <h2 id="vd-summary-title">動画の要約</h2>
            </header>
            <ol className="vd-review">
              {video.review.map((line, index) => (
                <li key={`${index}-${line}`}>
                  <span className="vd-review-no">{index + 1}</span>
                  <p>{line}</p>
                </li>
              ))}
            </ol>
            {video.editorNote ? <p className="editor-note">編集メモ: {video.editorNote}</p> : null}
            <TrackedGaLink
              className="vd-watch"
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
              eventName="youtube_click"
              eventParams={{ video_id: video.ytid, placement: "video_detail", genre: video.genre, score_total: video.score ?? 0 }}
            >
              YouTubeで視聴 <span aria-hidden="true">↗</span>
            </TrackedGaLink>
            <p className="video-embed-note">※埋め込み再生できない動画はYouTubeでご覧ください。</p>
          </section>

          <section id="vd-memo" className="vd-sec" aria-labelledby="vd-memo-title">
            <header className="vd-sec-head">
              <span className="vd-sec-no">02</span>
              <h2 id="vd-memo-title">学びメモ</h2>
            </header>
            <LearningNote ytid={video.ytid} />
          </section>

          <div id="vd-howto" className="vd-anchor">
            <FoldSection
              className="vd-sec vd-fold"
              titleId="video-editorial-title"
              titleClassName="vd-fold-title"
              eyebrow="03"
              title="この動画をどう使うか"
            >
              <p className="video-editorial-body">{editorialSummary}</p>
              <ol className="video-learning-loop" aria-label="動画を学びにつなげる4ステップ">
                <li>
                  <span>01 WATCH</span>
                  <strong>見る</strong>
                  <small>{video.minutes}分で「{video.sub}」の要点を確認</small>
                </li>
                <li>
                  <span>02 NOTE</span>
                  <strong>残す</strong>
                  <small>視聴済み・あとで見るで、この端末に記録</small>
                </li>
                <li>
                  <span>03 TRY</span>
                  <strong>試す</strong>
                  <small>{learningPoints[0]}</small>
                </li>
                <li>
                  <span>04 EXPAND</span>
                  <strong>広げる</strong>
                  <small><a href={`#network-context-${video.genre}`}>AI・資格・仕事の詳しい情報へ</a></small>
                </li>
              </ol>
            </FoldSection>
          </div>

          <AdSlot slot="1438236565" />

          <div id="vd-guide" className="vd-anchor">
            <FoldSection
              className="vd-sec vd-fold"
              titleId="video-context-title"
              titleClassName="vd-fold-title"
              eyebrow="04"
              title="視聴前ガイド"
              hint="位置づけ・おすすめの人・学べること・注意点"
            >
              <div className="vd-guide">
                <section>
                  <h3>この動画の位置づけ</h3>
                  <p>{positionText}</p>
                </section>
                <section>
                  <h3>こんな人におすすめ</h3>
                  <p>{audienceText}</p>
                </section>
                <section>
                  <h3>この1本で学べること</h3>
                  <ul>
                    {learningPoints.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </section>
                <section>
                  <h3>視聴のポイント／気をつけたい点</h3>
                  {viewingTips.map((tip) => (
                    <p key={tip}>{tip}</p>
                  ))}
                </section>
              </div>
            </FoldSection>
          </div>

          <div id="vd-axes" className="vd-anchor">
            <FoldSection
              className="vd-sec vd-fold"
              titleId="score-detail-title"
              titleClassName="vd-fold-title"
              eyebrow="05"
              title={noteStage === 2 ? "7軸のスコア（一次評価）" : "7軸のスコア"}
              hint={scoreText(video)}
            >
              {noteStage === 2 ? (
                <p className="video-axis-note-disclosure">この動画の軸別コメントは作成中のため、点数のみを表示しています。点数は、運営者の視聴またはYouTube上の公開情報の確認に基づく一次評価です。採点の考え方は「採点方法」で説明しています。</p>
              ) : noteStage === 1 ? (
                <p className="video-axis-note-disclosure">一部の軸は個別コメントを作成中のため、「一次評価」と付いた軸は点数のみを表示しています。点数は、運営者の視聴またはYouTube上の公開情報の確認に基づく評価です。</p>
              ) : null}
              <div className="video-axis-commentary">
                {axisCommentary.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
              {video.axisScores.length > 0 ? (
                <div className="vd-axes-list">
                  {video.axisScores.map((axis) => {
                    const generic = isGenericAxisNote(axis);
                    return (
                      <div className="vd-axis" key={axis.axis}>
                        <div className="vd-axis-row">
                          <span className="vd-axis-name">
                            {axis.axis}
                            {generic ? <em className="vd-axis-tag">一次評価</em> : null}
                          </span>
                          <span className="vd-dots" aria-hidden="true">
                            {[1, 2, 3, 4, 5].map((i) => (
                              <i key={i} className={i <= axis.score ? "is-on" : undefined} />
                            ))}
                          </span>
                          <span className="vd-axis-score">
                            {axis.score}
                            <small>/5</small>
                          </span>
                        </div>
                        {generic ? null : <p className="vd-axis-note">{axis.note}</p>}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="video-empty-score">{scoreConfirmationText}</p>
              )}
              <p className="vd-method">
                「一次評価」は点数のみ表示（現行ルール）。
                <Link href="/about-score/">
                  採点方法を見る <span aria-hidden="true">→</span>
                </Link>
              </p>
            </FoldSection>
          </div>
        </div>
      </div>

      <div className="vd-wide">
        <div id="vd-network" className="vd-anchor">
          <NetworkContextBand genreKey={video.genre} sub={video.sub} skipHrefs={linkedSisterHrefs} />
        </div>

          {sisterLinks.length > 0 ? (
            <section className="sister-item-section vd-sister" aria-labelledby="sister-item-title">
              <div>
                <p className="section-eyebrow">もっと詳しく</p>
                <h2 id="sister-item-title" className="section-title">姉妹サイトで詳細を見る</h2>
              </div>
              <div className="sister-item-links">
                {sisterLinks.map((link) => (
                  <TrackedGaLink
                    key={`${link.site}-${link.slug}`}
                    className={`sister-item-link is-${link.site}`}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    eventName="network_click"
                    eventParams={{ destination_site: link.site, placement: "video_detail_items", genre: video.genre, video_id: video.ytid }}
                  >
                    {link.site === "ai" ? (
                      <>
                        <span aria-hidden="true">🔧</span>
                        <span>「{link.name}」の料金・無料枠・使い方を manapick AI で見る</span>
                      </>
                    ) : link.site === "license" ? (
                      <>
                        <span aria-hidden="true">📜</span>
                        <span>「{link.name}」の難易度・費用・申込を manapick license で見る</span>
                      </>
                    ) : link.site === "politics" ? (
                      <>
                        <span aria-hidden="true">§</span>
                        <span>「{link.name}」を manapick politics で見る</span>
                      </>
                    ) : (
                      <>
                        <span aria-hidden="true">→</span>
                        <span>「{link.name}」の仕事内容・必要スキルを manapick career で見る</span>
                      </>
                    )}
                    <span className="sister-item-arrow" aria-hidden="true">→</span>
                  </TrackedGaLink>
                ))}
              </div>
            </section>
          ) : null}

          <AdSlot slot="1438236565" />

          {nextPick ? (
            <section id="vd-next" className="vd-sec" aria-labelledby="vd-next-title">
              <header className="vd-sec-head">
                <span className="vd-sec-no">07</span>
                <h2 id="vd-next-title">次に見る1本</h2>
                <Link className="vd-sec-more" href={`/genre/${video.genre}/`}>
                  {genreDisplayName(video.genre)}の一覧へ
                </Link>
              </header>
              <TrackedGaLink
                className="vd-next-card"
                href={videoPath(nextPick.video.ytid)}
                eventName="next_video_click"
                eventParams={{ placement: "next_section", from_video_id: video.ytid, to_video_id: nextPick.video.ytid }}
              >
                <span className="vd-card-thumb">
                  <Image
                    src={youtubeThumbnail(nextPick.video.ytid)}
                    alt={nextPick.video.title + "のサムネイル"}
                    width={480}
                    height={270}
                    sizes="(min-width: 760px) 220px, 92vw"
                    loading="lazy"
                  />
                </span>
                <span className="vd-next-body">
                  <span className="vd-card-genre">{genreLabel(nextPick.video.genre)}</span>
                  <strong>{nextPick.video.title}</strong>
                  <span className="vd-card-meta">
                    {scoreText(nextPick.video)} ・ {nextPick.video.minutes}分
                  </span>
                  <span className="vd-next-reason">{nextPick.reason}</span>
                </span>
              </TrackedGaLink>
            </section>
          ) : null}

          <section className="vd-sec" aria-labelledby="related-title">
            <header className="vd-sec-head">
              <span className="vd-sec-no">NEXT</span>
              <h2 id="related-title">次に見る6本</h2>
              <Link className="vd-sec-more" href="/#search">一覧へ戻る</Link>
            </header>
            <div className="vd-related-grid">
              {related.map((item) => (
                <Link key={item.ytid} className="vd-rel-card" href={videoPath(item.ytid)}>
                  <span className="vd-card-thumb">
                    <Image
                      src={youtubeThumbnail(item.ytid)}
                      alt={item.title + "のサムネイル"}
                      width={480}
                      height={270}
                      sizes="(min-width: 920px) 180px, (min-width: 560px) 45vw, 92vw"
                      loading="lazy"
                    />
                  </span>
                  <span className="vd-rel-body">
                    <span className="vd-card-genre">{genreLabel(item.genre)}</span>
                    <span className="vd-rel-title">{item.title}</span>
                    <span className="vd-card-meta">
                      {scoreText(item)} ・ {item.minutes}分
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </section>
      </div>
    </main>
  );
}

function videoGuideLinkLabel(genre: string) {
  const labels: Record<string, string> = {
    ai: "AIプロンプト・Copilot活用のロードマップへ",
    prog: "Pythonは難しい？独学ロードマップへ",
    video: "YouTubeサムネイルと動画編集ロードマップへ",
    data: "エクセル統計の使い方ロードマップへ",
    shikaku: "社労士試験・資格勉強ロードマップへ",
    marke: "マーケティングYouTubeおすすめロードマップへ"
  };
  return labels[genre] ?? "このジャンルのロードマップへ";
}
