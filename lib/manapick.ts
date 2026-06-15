import genresData from "@/content/genres.json";
import videosData from "@/content/videos.json";

const FALLBACK_SITE_URL = "https://manapick.pages.dev";

function normalizeSiteUrl(value: string | undefined) {
  const raw = value?.trim() || FALLBACK_SITE_URL;

  try {
    return new URL(raw).origin;
  } catch {
    return FALLBACK_SITE_URL;
  }
}

export const SITE_URL = normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);

export type GenreStatus = "published" | "preparing" | "checking";

export type Genre = {
  key: string;
  label: string;
  icon: string;
  status: GenreStatus;
  note?: string;
  subgenres: string[];
  monetization: string;
  prItems: string[];
};

export type AxisScore = {
  axis: string;
  score: number;
  note: string;
};

export type ScoreStatus = "confirmed" | "provisional";

export type Video = {
  genre: string;
  sub: string;
  ytid: string;
  level: "初級" | "中級" | "上級";
  minutes: number;
  channel: string;
  score: number | null;
  viewCount?: number;
  publishedAt?: string;
  scoreStatus?: ScoreStatus;
  scoreConfirmedAt?: string;
  editorNote?: string;
  axisScores: AxisScore[];
  title: string;
  url: string;
  tags: string[];
  review: string[];
};

export const genres = genresData as Genre[];
export const videos = videosData as Video[];

export const publishedGenreKeys = genres
  .filter((genre) => genre.status === "published")
  .map((genre) => genre.key);

export function videoPath(ytid: string) {
  return "/video/" + ytid + "/";
}

export function subGenrePath(key: string, sub: string) {
  return "/genre/" + key + "/" + encodeURIComponent(sub) + "/";
}

export function absoluteUrl(path: string) {
  return new URL(path, SITE_URL).toString();
}

export function youtubeThumbnail(ytid: string) {
  return "https://i.ytimg.com/vi/" + ytid + "/hqdefault.jpg";
}

export function youtubeEmbedUrl(ytid: string) {
  return "https://www.youtube-nocookie.com/embed/" + ytid;
}

export function genreDisplayName(key: string) {
  if (key === "biz") return "Office・資料作成";
  const genre = genres.find((item) => item.key === key);
  return genre ? genre.label : key;
}

export function genreLabel(key: string) {
  const shortLabels: Record<string, string> = {
    ai: "生成AI",
    prog: "プログラミング",
    video: "動画編集",
    english: "英語",
    data: "データ分析",
    marke: "Webマーケ",
    biz: "Office・資料",
    shikaku: "資格",
    kaikei: "会計資格",
    money: "お金・投資"
  };
  return shortLabels[key] ?? genreDisplayName(key);
}

export function scoreStatus(video: Video): ScoreStatus {
  return video.scoreStatus === "confirmed" ? "confirmed" : "provisional";
}

export function scoreText(video: Video) {
  return video.score === null ? "スコア準備中" : video.score + "/35";
}

export function scoreLabel(video: Video) {
  return scoreStatus(video) === "confirmed" ? scoreText(video) + " ✓ 確認済" : scoreText(video) + " 暫定";
}

export function scoreConfirmationDate(video: Video) {
  if (scoreStatus(video) !== "confirmed" || !video.scoreConfirmedAt) return null;
  return video.scoreConfirmedAt.replace(/-/g, "/");
}

export function displayChannel(video: Video) {
  const channel = video.channel?.trim();
  if (!channel || channel.includes("確認")) return null;
  return channel;
}

export function videoDescription(video: Video) {
  return (video.review[0] ?? video.title).replace(/\s+/g, " ").slice(0, 150);
}

export function videoPositionText(video: Video) {
  const genreName = genreDisplayName(video.genre);
  const duration = video.minutes >= 40 ? "じっくり取り組む" : "短時間で全体像をつかみやすい";

  return `この動画は、${genreName}の中でも「${video.sub}」に焦点を当てた${video.level}向けの${video.minutes}分コンテンツです。${duration}長さなので、${video.sub}の入口や復習ポイントを確認し、次に見る動画を選ぶための基準にできます。`;
}

export function videoAudienceText(video: Video) {
  const levelAudience: Record<Video["level"], string> = {
    初級: "前提知識が少なく、まず全体像や基本操作を押さえたい人",
    中級: "基礎を一通り触り、次に実践や応用へ進みたい人",
    上級: "実務・試験・制作などで、より具体的な使い方を確認したい人"
  };
  const genreAudience: Record<string, string> = {
    ai: "AIを仕事の調査、文章作成、思考整理に取り入れたい人",
    prog: "手を動かしながらプログラミングの理解を深めたい人",
    video: "動画編集やクリエイティブ制作の流れを整えたい人",
    english: "英語学習を習慣化し、聞く・話す・試験対策につなげたい人",
    data: "ExcelやBIで数字を読み、業務改善に生かしたい人",
    marke: "Web集客や広告運用の考え方を実務に結びつけたい人",
    biz: "Office操作や資料作成を仕事の成果物につなげたい人",
    shikaku: "資格学習の範囲をつかみ、合格までの順番を決めたい人",
    kaikei: "会計・簿記・税務の基礎を仕事や資格学習に生かしたい人",
    money: "お金や投資の基礎を、生活設計の判断材料として学びたい人"
  };

  return `${levelAudience[video.level]}に向いています。特に${genreAudience[video.genre] ?? `${genreDisplayName(video.genre)}を学び直したい人`}が、${video.sub}の要点を見比べる前の1本として使いやすい動画です。`;
}

export function videoLearningPoints(video: Video) {
  const tags = video.tags.filter(Boolean).slice(0, 3);
  const points = tags.map((tag, index) => {
    if (index === 0) return `${video.sub}で押さえたい「${tag}」の考え方。`;
    if (index === 1) return `${video.level}の段階でつまずきやすい「${tag}」の見方。`;
    return `${genreDisplayName(video.genre)}の学習に「${tag}」をどう接続するか。`;
  });

  const fallback = [
    `${video.sub}の全体像と、最初に押さえたい学習テーマ。`,
    `${video.level}レベルで確認したい用語・操作・考え方の流れ。`,
    `${video.minutes}分の中で、次に復習すべきポイント。`
  ];

  return [...points, ...fallback].slice(0, 3);
}

export function videoAxisCommentary(video: Video) {
  if (video.axisScores.length === 0) {
    const review = video.review.filter(Boolean);
    return [
      `この動画は7軸メモが未整備のため、既存レビューをもとに視聴前の判断材料を整理しています。${review[0] ?? `${video.sub}の学習テーマを確認する入口として使えます。`}`,
      review[1]
        ? `レビューでは「${review[1]}」と整理しています。${video.level}の学習者は、見終わったあとに自分の目的と合う部分をメモしておくと次の動画を選びやすくなります。`
        : `${video.level}の学習者は、見終わったあとに理解できた点と追加で調べたい点を分けておくと、次の動画を選びやすくなります。`
    ];
  }

  const descending = [...video.axisScores].sort((a, b) => b.score - a.score);
  const ascending = [...video.axisScores].sort((a, b) => a.score - b.score);
  const top = descending[0];
  const second = descending.find((axis) => axis.axis !== top.axis);
  const low = ascending[0];
  const lines = [
    `${video.sub}の観点では「${top.axis}」が${top.score}/5で、${top.note}点が評価されています。`
  ];

  if (second) {
    lines.push(`あわせて「${second.axis}」も${second.score}/5。${second.note}と整理されているため、${video.level}の学習者が視聴前に期待値を置きやすい動画です。`);
  }

  if (low.score <= 3) {
    lines.push(`一方で「${low.axis}」は${low.score}/5。${low.note}という補足があるため、必要なら関連動画や教材で補う前提で見ると安心です。`);
  } else {
    lines.push(`低めの軸でも「${low.axis}」が${low.score}/5で、${low.note}と整理されています。大きな弱点は少ないものの、自分の目的に合うかは視聴前に確認しておくと無駄がありません。`);
  }

  return lines;
}

export function videoViewingTips(video: Video) {
  const low = video.axisScores.length > 0 ? [...video.axisScores].sort((a, b) => a.score - b.score)[0] : null;
  const durationTip =
    video.minutes > 40
      ? `${video.minutes}分あるため、前半で全体像、後半で細部や演習を確認するように分けて見るのがおすすめです。`
      : `${video.minutes}分なので、1回目は止めずに流れをつかみ、2回目で気になった用語や操作をメモすると定着しやすくなります。`;
  const caution = low
    ? low.score <= 3
      ? `気をつけたい点は「${low.axis}」です。${low.note}と整理されているため、見終わったあとに同じテーマの別動画で確認すると判断が偏りにくくなります。`
      : `最低スコア軸は「${low.axis}」ですが${low.score}/5あり、${low.note}と整理されています。自分の目的と合う部分を中心に見ると使いやすいです。`
    : `7軸メモがない動画なので、レビュー本文とタイトルを照らし合わせ、必要に応じて関連動画で補足確認してください。`;

  return [durationTip, caution];
}

export function findVideo(ytid: string) {
  return videos.find((video) => video.ytid === ytid) ?? null;
}

export function relatedVideos(video: Video, limit = 6) {
  const candidates = videos
    .filter((item) => item.ytid !== video.ytid)
    .filter((item) => publishedGenreKeys.includes(item.genre));

  const sameSub = candidates
    .filter((item) => item.sub === video.sub)
    .sort((a, b) => (b.score ?? -1) - (a.score ?? -1));
  const sameGenre = candidates
    .filter((item) => item.sub !== video.sub && item.genre === video.genre)
    .sort((a, b) => (b.score ?? -1) - (a.score ?? -1));
  const fallback = candidates
    .filter((item) => item.genre !== video.genre)
    .sort((a, b) => (b.score ?? -1) - (a.score ?? -1));

  const seen = new Set<string>();
  return [...sameSub, ...sameGenre, ...fallback].filter((item) => {
    if (seen.has(item.ytid)) return false;
    seen.add(item.ytid);
    return true;
  }).slice(0, limit);
}

export function isoDuration(minutes: number) {
  return "PT" + Math.max(1, Math.round(minutes)) + "M";
}
