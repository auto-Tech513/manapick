export const MANAPICK_AI_URL = "https://ai.manapick.app";
export const MANAPICK_LICENSE_URL = "https://license.manapick.app";
export const MANAPICK_CAREER_URL = "https://career.manapick.app";

export const MANAPICK_AI_CATEGORY_BY_GENRE: Record<string, string> = {
  ai: "chat",
  prog: "code",
  video: "video",
  english: "translate",
  data: "search",
  marke: "chat",
  biz: "work",
  shikaku: "search",
  kaikei: "work",
  money: "search"
};

export function manapickAiCategoryUrl(category: string) {
  return `${MANAPICK_AI_URL}/category/${category}/`;
}

export function manapickAiUrlForGenre(genreKey: string) {
  const category = MANAPICK_AI_CATEGORY_BY_GENRE[genreKey];
  return category ? manapickAiCategoryUrl(category) : MANAPICK_AI_URL;
}
