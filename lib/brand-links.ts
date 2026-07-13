export const MANAPICK_AI_URL = "https://ai.manapick.app";
export const MANAPICK_LICENSE_URL = "https://license.manapick.app";
export const MANAPICK_CAREER_URL = "https://career.manapick.app";

const MANAPICK_LICENSE_CATEGORY_BY_GENRE: Record<string, string> = {
  ai: "it-ai",
  prog: "it-ai",
  video: "design",
  english: "language",
  data: "it-ai",
  marke: "business",
  biz: "business",
  shikaku: "practical",
  kaikei: "account",
  money: "account"
};

const MANAPICK_CAREER_CATEGORY_BY_GENRE: Record<string, string> = {
  ai: "it-ai",
  prog: "it-ai",
  video: "creative",
  english: "people-license",
  data: "data",
  marke: "marketing",
  biz: "office-accounting",
  shikaku: "people-license",
  kaikei: "office-accounting",
  money: "office-accounting"
};

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

export function manapickLicenseUrlForGenre(genreKey: string) {
  const category = MANAPICK_LICENSE_CATEGORY_BY_GENRE[genreKey];
  return category ? `${MANAPICK_LICENSE_URL}/category/${category}/` : MANAPICK_LICENSE_URL;
}

export function manapickCareerUrlForGenre(genreKey: string) {
  const category = MANAPICK_CAREER_CATEGORY_BY_GENRE[genreKey];
  return category ? `${MANAPICK_CAREER_URL}/category/${category}/` : MANAPICK_CAREER_URL;
}
