export type SubRoadmapVideo = {
  genre: string;
  sub: string;
  ytid: string;
  level: "初級" | "中級" | "上級";
  score: number | null;
};

export type SubRoadmapStep = {
  label: string;
  level: string;
  /** 表示する段階名（2026-11-13: レベル表示をやめ段階名で示す、所有者承認 2026-11-11） */
  stage: string;
  goal: string;
  videos: string[];
};

export type SubRoadmap = {
  genre: string;
  title: string;
  steps: SubRoadmapStep[];
};

// 資格系（試験がある）ジャンルだけ「過去問・直前対策」を使い、スキル系は「実践」で仕上げる表現にする。
const EXAM_GENRES = new Set(["shikaku", "kaikei"]);

export function buildSubRoadmap(videos: SubRoadmapVideo[], genre: string, sub: string): SubRoadmap | null {
  const exam = EXAM_GENRES.has(genre);
  const subVideos = videos
    .filter((video) => video.genre === genre && video.sub === sub)
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
  if (subVideos.length === 0) return null;

  const PER_STEP = 2;
  const cap = (items: SubRoadmapVideo[]) => items.slice(0, PER_STEP).map((video) => video.ytid);

  const levelDefs: Array<{ level: SubRoadmapVideo["level"]; stage: string; goal: string }> = [
    { level: "初級", stage: "全体像をつかむ", goal: `${sub}の全体像を入門動画でつかむ。` },
    { level: "中級", stage: "重要分野を固める", goal: `${sub}の頻出・重要分野を理解する。` },
    { level: "上級", stage: exam ? "過去問で仕上げる" : "実践で仕上げる", goal: exam ? `${sub}の過去問・直前対策で仕上げる。` : `${sub}を実践的な内容で使いこなす。` }
  ];
  const present = levelDefs.filter((definition) => subVideos.some((video) => video.level === definition.level));

  if (present.length >= 2) {
    const steps = present.map((definition, index) => ({
      label: `STEP${index + 1}`,
      level: definition.level,
      stage: definition.stage,
      goal: definition.goal,
      videos: cap(subVideos.filter((video) => video.level === definition.level))
    }));
    return { genre, title: `${sub}のロードマップ`, steps };
  }

  const ids = subVideos.slice(0, 5).map((video) => video.ytid);
  if (ids.length === 1) {
    return {
      genre,
      title: `${sub}のロードマップ`,
      steps: [{ label: "STEP1", level: "まず1本", stage: "まず1本", goal: `${sub}はまずこの1本から。`, videos: ids }]
    };
  }

  const phases = [
    { label: "STEP1", level: "まず1本", stage: "まず1本", goal: `${sub}の全体像をつかむ最初の1本。`, videos: ids.slice(0, 1) },
    { label: "STEP2", level: "基礎", stage: "基礎", goal: `${sub}の基礎を固める。`, videos: ids.slice(1, 3) },
    { label: "STEP3", level: "仕上げ", stage: "仕上げ", goal: exam ? `${sub}を過去問・直前対策で仕上げる。` : `${sub}を実践で仕上げる。`, videos: ids.slice(3, 5) }
  ].filter((phase) => phase.videos.length > 0);

  return { genre, title: `${sub}のロードマップ`, steps: phases };
}
