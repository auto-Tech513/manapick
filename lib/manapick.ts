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

export type ScoreStatus = "confirmed";

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

const nonConfirmedVideos = videos.filter((video) => video.scoreStatus !== "confirmed");

if (nonConfirmedVideos.length > 0) {
  const sampleIds = nonConfirmedVideos.slice(0, 8).map((video) => video.ytid).join(", ");
  throw new Error(
    "All Manapick videos must be owner-confirmed before build. " +
      "nonConfirmed=" +
      nonConfirmedVideos.length +
      (sampleIds ? " sample=" + sampleIds : "")
  );
}

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

export function scoreStatus(_video: Video): ScoreStatus {
  return "confirmed";
}

export function scoreText(video: Video) {
  return video.score === null ? "スコア準備中" : video.score + "/35";
}

export function scoreLabel(video: Video) {
  return scoreText(video) + " 運営者が視聴確認済み";
}

export function scoreConfirmationDate(video: Video) {
  if (!video.scoreConfirmedAt) return null;
  return video.scoreConfirmedAt.replace(/-/g, "/");
}

export function videoFreshness(video: Video): { label: string; tone: "new" | "evergreen"; note: string } | null {
  if (!video.publishedAt) return null;
  const publishedTime = new Date(video.publishedAt).getTime();
  if (Number.isNaN(publishedTime)) return null;
  const ageDays = Math.max(0, (Date.now() - publishedTime) / (1000 * 60 * 60 * 24));
  if (ageDays <= 180) {
    return { label: "新着", tone: "new", note: "公開から半年以内の動画です。" };
  }
  if (ageDays >= 365 * 3 && (video.score ?? 0) >= 28) {
    return { label: "定番", tone: "evergreen", note: "公開から時間が経っても基礎確認に使いやすい動画です。" };
  }
  return null;
}

export function displayChannel(video: Video) {
  const channel = video.channel?.trim();
  if (!channel || channel.includes("確認")) return null;
  return channel;
}

export function videoDescription(video: Video) {
  return (video.review[0] ?? video.title).replace(/\s+/g, " ").slice(0, 150);
}

function compactText(value: string, maxLength: number) {
  const normalized = value.replace(/\s+/g, " ").trim();
  return normalized.length > maxLength ? normalized.slice(0, maxLength - 1) + "…" : normalized;
}

function stableIndex(value: string, length: number, salt = 0) {
  if (length <= 0) return 0;
  return (Array.from(value).reduce((total, char, index) => {
    return (total + char.charCodeAt(0) * (index + 1 + salt)) % 1000003;
  }, 97 + salt) % length);
}

function includesEither(a: string, b: string) {
  const left = a.trim().toLowerCase();
  const right = b.trim().toLowerCase();
  if (!left || !right) return false;
  return left.includes(right) || right.includes(left);
}

function subjectTagKind(video: Video, tag: string) {
  if (includesEither(tag, video.sub)) return "sub";
  if (includesEither(tag, genreDisplayName(video.genre)) || includesEither(tag, genreLabel(video.genre))) return "genre";
  return null;
}

function isLowValueLearningTag(tag: string) {
  const value = tag.trim();
  return /^\d+$/.test(value) || /^20\d{2}$/.test(value);
}

export function videoPositionText(video: Video) {
  const genreName = genreDisplayName(video.genre);
  const duration = video.minutes >= 40 ? "じっくり取り組む" : "短時間で全体像をつかみやすい";
  const variants = [
    `この動画は、${genreName}の中でも「${video.sub}」に焦点を当てた${video.level}向けの${video.minutes}分コンテンツです。${duration}長さなので、学習の入口や復習ポイントを確認し、次に見る動画を選ぶための基準にできます。`,
    `${video.minutes}分という尺で、${genreName}の「${video.sub}」を${video.level}の視点から扱う1本です。先に全体像をつかみたいときも、見終わった後に理解の抜けを探したいときも使いやすい位置づけです。`,
    `${video.level}の学習者が「${video.sub}」（${genreName}）の要点をつかむための${video.minutes}分です。長すぎず短すぎない範囲で、重要なテーマを確認してから次の学習へ進めます。`,
    `${genreName}を学び直す中で「${video.sub}」を確認したい人向けに、${video.minutes}分でまとまった動画です。まず見る動画を絞りたいときの候補として、レベル感と所要時間を見ながら選べます。`
  ];

  return variants[stableIndex(video.ytid, variants.length, 3)];
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
  const level = levelAudience[video.level];
  const genre = genreAudience[video.genre] ?? `${genreDisplayName(video.genre)}を学び直したい人`;
  const variants = [
    `${level}に向いています。特に${genre}が、${video.sub}の要点を見比べる前の1本として使いやすい動画です。`,
    `おすすめしたいのは、${level}です。${genre}なら、視聴後に自分の目的と合う部分をメモしておくと次の動画へ進みやすくなります。`,
    `${video.level}の学習段階で、迷わずテーマを絞りたい人に合います。${genre}にとって、最初の確認や復習の材料にしやすい内容です。`,
    `基礎確認から一歩進めたい人まで、${video.level}の前提に合わせて見やすい動画です。${genre}は、関連動画を見る前の判断材料として活用できます。`
  ];

  return variants[stableIndex(video.ytid, variants.length, 17)];
}

export function videoLearningPoints(video: Video) {
  const tags = video.tags.filter((tag) => tag && !isLowValueLearningTag(tag));
  const points: string[] = [];

  for (const tag of tags) {
    const kind = subjectTagKind(video, tag);
    if (kind === "sub") {
      points.push(`この動画で押さえたい「${tag}」の考え方。`);
    } else if (kind === "genre") {
      continue;
    } else if (points.length === 0) {
      points.push(`視聴前に知っておきたい「${tag}」の見方。`);
    } else if (points.length === 1) {
      points.push(`${video.level}の段階でつまずきやすい「${tag}」の確認ポイント。`);
    } else {
      points.push(`学んだ「${tag}」を次の行動にどうつなげるか。`);
    }
    if (points.length >= 3) break;
  }

  const fallback = [
    "最初に確認したい全体像と学習テーマ。",
    `${video.level}レベルで確認したい用語・操作・考え方の流れ。`,
    `${video.minutes}分の中で、視聴後に復習すべきポイント。`,
    "関連動画へ進む前にメモしておきたい疑問点。"
  ];

  return Array.from(new Set([...points, ...fallback])).slice(0, 3);
}

export function videoAxisCommentary(video: Video) {
  const axisStyle = stableIndex(video.ytid, 2, 31);

  if (video.axisScores.length === 0) {
    const review = video.review.filter(Boolean);
    if (axisStyle === 0) {
      return [
        `この動画は7軸メモが未整備のため、既存レビューをもとに視聴前の判断材料を整理しています。${review[0] ?? `${video.sub}の学習テーマを確認する入口として使えます。`}`,
        review[1]
          ? `レビューでは「${review[1]}」と整理しています。${video.level}の学習者は、見終わったあとに自分の目的と合う部分をメモしておくと次の動画を選びやすくなります。`
          : `${video.level}の学習者は、見終わったあとに理解できた点と追加で調べたい点を分けておくと、次の動画を選びやすくなります。`
      ];
    }

    return [
      `7軸メモがない動画では、レビュー本文を中心に確認します。${review[0] ?? `${video.sub}の学習テーマを確認する入口として使えます。`}`,
      review[1]
        ? `補足として「${review[1]}」という見立てがあります。視聴後は、分かった点と追加確認したい点を分けておくと関連動画を選びやすくなります。`
        : `視聴後は、分かった点と追加確認したい点を分けておくと関連動画を選びやすくなります。`
    ];
  }

  const descending = [...video.axisScores].sort((a, b) => b.score - a.score);
  const ascending = [...video.axisScores].sort((a, b) => a.score - b.score);
  const top = descending[0];
  const second = descending.find((axis) => axis.axis !== top.axis);
  const low = ascending[0];
  const lines =
    axisStyle === 0
      ? [`${video.sub}の観点では「${top.axis}」が${top.score}/5で、${top.note}点が評価されています。`]
      : [`採点上の強みは「${top.axis}」で${top.score}/5。${top.note}という点から、視聴前の期待値を置きやすい動画です。`];

  if (second) {
    lines.push(
      axisStyle === 0
        ? `あわせて「${second.axis}」も${second.score}/5。${second.note}と整理されているため、${video.level}の学習者が視聴前に期待値を置きやすい動画です。`
        : `次に高いのは「${second.axis}」で${second.score}/5です。${second.note}というメモがあり、強みを複数の角度から確認できます。`
    );
  }

  if (low.score <= 3) {
    lines.push(
      axisStyle === 0
        ? `一方で「${low.axis}」は${low.score}/5。${low.note}という補足があるため、必要なら関連動画や教材で補う前提で見ると安心です。`
        : `注意して見たいのは「${low.axis}」です。${low.score}/5で、${low.note}という補足があるため、必要なら別動画で確認すると判断が偏りにくくなります。`
    );
  } else {
    lines.push(
      axisStyle === 0
        ? `低めの軸でも「${low.axis}」が${low.score}/5で、${low.note}と整理されています。大きな弱点は少ないものの、自分の目的に合うかは視聴前に確認しておくと無駄がありません。`
        : `最も控えめな軸は「${low.axis}」ですが${low.score}/5です。${low.note}と整理されており、弱点を把握したうえで視聴できます。`
    );
  }

  return lines;
}

export function videoViewingTips(video: Video) {
  const low = video.axisScores.length > 0 ? [...video.axisScores].sort((a, b) => a.score - b.score)[0] : null;
  const longTips = [
    `${video.minutes}分あるため、前半で全体像、後半で細部や演習を確認するように分けて見るのがおすすめです。`,
    `少し長めの${video.minutes}分です。最初は流れをつかみ、必要な章だけ戻って見直すと負担を抑えられます。`,
    `${video.minutes}分の動画なので、一度に完走しようとせず、区切りごとにメモを残す見方が合います。`
  ];
  const shortTips = [
    `${video.minutes}分なので、1回目は止めずに流れをつかみ、2回目で気になった用語や操作をメモすると定着しやすくなります。`,
    `${video.minutes}分で見られるため、まず通して確認し、必要な部分だけ後から戻る使い方が向いています。`,
    `短めの${video.minutes}分です。視聴後に「分かったこと」と「まだ曖昧なこと」を分けておくと次の学習につながります。`
  ];
  const durationTip =
    video.minutes >= 40
      ? longTips[stableIndex(video.ytid, longTips.length, 43)]
      : shortTips[stableIndex(video.ytid, shortTips.length, 43)];
  const caution = low
    ? low.score <= 3
      ? `気をつけたい点は「${low.axis}」です。${low.note}と整理されているため、見終わったあとに同じテーマの別動画で確認すると判断が偏りにくくなります。`
      : `最低スコア軸は「${low.axis}」ですが${low.score}/5あり、${low.note}と整理されています。自分の目的と合う部分を中心に見ると使いやすいです。`
    : `7軸メモがない動画なので、レビュー本文とタイトルを照らし合わせ、必要に応じて関連動画で補足確認してください。`;

  return [durationTip, caution];
}

export function videoEditorialSummary(video: Video, nextVideo?: Video) {
  const genreName = genreDisplayName(video.genre);
  const review = compactText(video.review.find(Boolean) ?? video.title, 52);
  const topAxis = video.axisScores.length > 0 ? [...video.axisScores].sort((a, b) => b.score - a.score)[0] : null;
  const lowAxis = video.axisScores.length > 0 ? [...video.axisScores].sort((a, b) => a.score - b.score)[0] : null;
  const audienceByLevel: Record<Video["level"], string> = {
    初級: "基礎や全体像を押さえたい人",
    中級: "実践や応用へ進みたい人",
    上級: "実務や試験対策で具体的に確認したい人"
  };
  const topAxisText = topAxis
    ? `採点では「${topAxis.axis}」が${topAxis.score}/5で、${compactText(topAxis.note, 28)}点を評価しています。`
    : "採点メモが薄い動画では、レビュー本文とタイトルの一致を中心に確認しています。";
  const cautionText = lowAxis
    ? `一方で「${lowAxis.axis}」は${lowAxis.score}/5。${compactText(lowAxis.note, 28)}という補足を意識すると判断が偏りにくくなります。`
    : "視聴後は、分かったことと残った疑問を分けてメモすると次の動画を選びやすくなります。";
  const nextText = nextVideo
    ? `続けるなら、次は「${compactText(nextVideo.title, 30)}」で別角度から補えます。`
    : "続けるなら、同じジャンルの関連動画へ進み、今回の理解を別角度から補うと学習が続きます。";

  return `${genreName}の「${video.sub}」を${video.level}で学ぶ人向けに、${video.minutes}分で確認できる1本です。${audienceByLevel[video.level]}に向いています。レビューでは「${review}」と整理しています。${topAxisText}${cautionText}${nextText}`;
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
