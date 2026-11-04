import { videoPath, youtubeThumbnail, type Video } from "@/lib/manapick";

// 7日学習プランの構築ロジック。もとは StudyPlanBuilder 内にあったが、
// マイページのプラン進捗表示（UX改善 P0-2）でも同じ計算が必要になったため、
// 部品を変えずにここへ切り出した。保存キーと計算方法は従来どおり。

export type StudyPlanVideo = {
  ytid: string;
  genre: string;
  title: string;
  sub: string;
  level: string;
  minutes: number;
  score: number | null;
  detailUrl: string;
  thumbnailUrl: string;
  sequence: number;
};

export type StudyPlanSession = {
  day: number;
  videos: StudyPlanVideo[];
  minutes: number;
};

export type SavedPlan = {
  genre: string;
  dailyMinutes: number;
  frequency: number;
  // 「次の7日を作る」で除外した視聴済み動画と、何週目か
  skip?: string[];
  week?: number;
};

export const STUDY_PLAN_KEY = "manapick-study-plan-v1";

const sessionDays: Record<number, number[]> = {
  3: [1, 3, 6],
  5: [1, 2, 4, 5, 7],
  7: [1, 2, 3, 4, 5, 6, 7]
};

// 1回の学習時間（dailyMinutes）に収まるよう、ロードマップ順の動画を学習日ごとに詰める。
// 上限は目安時間の115%。目安の85%に達したらその日は締める。どの動画も収まらない日は、残りで最も短い1本を入れる。
export function buildSessions(videos: StudyPlanVideo[], dailyMinutes: number, frequency: number): StudyPlanSession[] {
  const learningDays = sessionDays[frequency] ?? sessionDays[5];
  const cap = Math.round(dailyMinutes * 1.15);
  const queue = [...videos].sort(
    (a, b) => a.sequence - b.sequence || (b.score ?? -1) - (a.score ?? -1) || a.minutes - b.minutes
  );
  const sessions: StudyPlanSession[] = [];

  for (const day of learningDays) {
    const picked: StudyPlanVideo[] = [];
    let total = 0;
    for (let index = 0; index < queue.length; ) {
      const video = queue[index];
      if (total + video.minutes <= cap) {
        picked.push(video);
        total += video.minutes;
        queue.splice(index, 1);
        if (total >= dailyMinutes * 0.85) break;
      } else {
        index += 1;
      }
    }
    if (picked.length === 0 && queue.length > 0) {
      let shortest = 0;
      queue.forEach((video, index) => {
        if (video.minutes < queue[shortest].minutes) shortest = index;
      });
      const [video] = queue.splice(shortest, 1);
      picked.push(video);
      total = video.minutes;
    }
    if (picked.length === 0) break;
    picked.sort((a, b) => a.sequence - b.sequence);
    sessions.push({ day, videos: picked, minutes: total });
  }

  return sessions;
}

type RoadmapLike = {
  genre: string;
  steps: { videos: string[] }[];
};

// 学習プランページがプラン候補として渡す動画列を作る（ジャンルごとに
// ロードマップ順→スコア順→短い順、上限48本）。マイページの進捗再計算でも
// 同じ候補列が必要なため、ページ側の実装をそのまま移した。
export function buildPlanVideos(
  allVideos: readonly Video[],
  roadmaps: readonly RoadmapLike[],
  genreKeys: readonly string[]
): StudyPlanVideo[] {
  const publishedVideos = allVideos.filter((video) => genreKeys.includes(video.genre));

  return genreKeys.flatMap((genre) => {
    const roadmapIds = roadmaps
      .find((item) => item.genre === genre)
      ?.steps.flatMap((step) => step.videos) ?? [];
    const roadmapIndex = new Map(roadmapIds.map((ytid, index) => [ytid, index]));

    return publishedVideos
      .filter((video) => video.genre === genre)
      .sort((a, b) => {
        const indexA = roadmapIndex.get(a.ytid) ?? 1000;
        const indexB = roadmapIndex.get(b.ytid) ?? 1000;
        return indexA - indexB || (b.score ?? -1) - (a.score ?? -1) || a.minutes - b.minutes;
      })
      .slice(0, 48)
      .map((video, sequence) => ({
        ytid: video.ytid,
        genre: video.genre,
        title: video.title,
        sub: video.sub,
        level: video.level,
        minutes: video.minutes,
        score: video.score,
        detailUrl: videoPath(video.ytid),
        thumbnailUrl: youtubeThumbnail(video.ytid),
        sequence
      }));
  });
}

export function readSavedPlan(): SavedPlan | null {
  try {
    const raw = window.localStorage.getItem(STUDY_PLAN_KEY);
    if (!raw) return null;
    const value = JSON.parse(raw) as Partial<SavedPlan>;
    if (typeof value.genre !== "string") return null;
    if (![15, 30, 60].includes(Number(value.dailyMinutes))) return null;
    if (![3, 5, 7].includes(Number(value.frequency))) return null;
    return {
      genre: value.genre,
      dailyMinutes: Number(value.dailyMinutes),
      frequency: Number(value.frequency),
      skip: Array.isArray(value.skip) ? value.skip.filter((item): item is string => typeof item === "string") : [],
      week: Number.isInteger(value.week) && Number(value.week) > 0 ? Number(value.week) : 1
    };
  } catch {
    return null;
  }
}

export type PlanSummary = {
  genre: string;
  week: number;
  sessions: StudyPlanSession[];
  doneCount: number;
  allDone: boolean;
  nextSession: StudyPlanSession | null;
  nextVideo: StudyPlanVideo | null;
};

// 保存済みプランと視聴済み集合から、マイページ表示用の進捗を再計算する。
// StudyPlanBuilder の isDone（セッション内の全動画が視聴済み）と同じ定義。
export function summarizeSavedPlan(
  plan: SavedPlan,
  allVideos: readonly Video[],
  roadmaps: readonly RoadmapLike[],
  genreKeys: readonly string[],
  watched: ReadonlySet<string>
): PlanSummary {
  const skip = plan.skip ?? [];
  const candidates = buildPlanVideos(allVideos, roadmaps, genreKeys)
    .filter((video) => video.genre === plan.genre && !skip.includes(video.ytid));
  const sessions = buildSessions(candidates, plan.dailyMinutes, plan.frequency);
  const isDone = (session: StudyPlanSession) => session.videos.every((video) => watched.has(video.ytid));
  const doneCount = sessions.filter(isDone).length;
  const nextSession = sessions.find((session) => !isDone(session)) ?? null;
  return {
    genre: plan.genre,
    week: plan.week ?? 1,
    sessions,
    doneCount,
    allDone: sessions.length > 0 && doneCount === sessions.length,
    nextSession,
    nextVideo: nextSession?.videos[0] ?? null
  };
}
