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
  goal: string;
  videos: string[];
};

export type SubRoadmap = {
  genre: string;
  title: string;
  steps: SubRoadmapStep[];
};

export function buildSubRoadmap(videos: SubRoadmapVideo[], genre: string, sub: string): SubRoadmap | null {
  const subVideos = videos
    .filter((video) => video.genre === genre && video.sub === sub)
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
  if (subVideos.length === 0) return null;

  const PER_STEP = 2;
  const cap = (items: SubRoadmapVideo[]) => items.slice(0, PER_STEP).map((video) => video.ytid);

  const levelDefs: Array<{ level: SubRoadmapVideo["level"]; goal: string }> = [
    { level: "初級", goal: `${sub}の全体像を入門動画でつかむ。` },
    { level: "中級", goal: `${sub}の頻出・重要分野を理解する。` },
    { level: "上級", goal: `${sub}の過去問・実践で仕上げる。` }
  ];
  const present = levelDefs.filter((definition) => subVideos.some((video) => video.level === definition.level));

  if (present.length >= 2) {
    const steps = present.map((definition, index) => ({
      label: `STEP${index + 1}`,
      level: definition.level,
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
      steps: [{ label: "STEP1", level: "まず1本", goal: `${sub}はまずこの1本から。`, videos: ids }]
    };
  }

  const phases = [
    { label: "STEP1", level: "まず1本", goal: `${sub}の全体像をつかむ最初の1本。`, videos: ids.slice(0, 1) },
    { label: "STEP2", level: "基礎", goal: `${sub}の基礎を固める。`, videos: ids.slice(1, 3) },
    { label: "STEP3", level: "仕上げ", goal: `${sub}を実践・直前対策で仕上げる。`, videos: ids.slice(3, 5) }
  ].filter((phase) => phase.videos.length > 0);

  return { genre, title: `${sub}のロードマップ`, steps: phases };
}
