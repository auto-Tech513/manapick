// OG 画像生成で共有するジャンル色と日本語折返し（guide / video 共通）。
export const genreColors = {
  ai: { accent: "#cf493b", soft: "#fff1ef" },
  prog: { accent: "#2563eb", soft: "#eff4ff" },
  data: { accent: "#0f766e", soft: "#ecfdf8" },
  money: { accent: "#a45a16", soft: "#fff7ed" },
  biz: { accent: "#7c3aed", soft: "#f4efff" },
  kaikei: { accent: "#0e7490", soft: "#ecfafe" },
  shikaku: { accent: "#b45309", soft: "#fdf6ec" },
  english: { accent: "#be3455", soft: "#fdf0f3" },
  video: { accent: "#9333ea", soft: "#f8efff" },
  marke: { accent: "#15803d", soft: "#effdf3" }
};

export function visualLength(value) {
  return [...value].reduce((sum, char) => sum + (/^[\u0000-\u00ff]$/.test(char) ? 0.62 : 1), 0);
}

export function wrapJapanese(value, limit) {
  const segmenter = new Intl.Segmenter("ja", { granularity: "word" });
  const tokens = [...segmenter.segment(value)].map((part) => part.segment);
  const lines = [];
  let current = "";
  for (const token of tokens) {
    if (current && visualLength(current + token) > limit) {
      lines.push(current.trim());
      current = token;
    } else {
      current += token;
    }
  }
  if (current.trim()) lines.push(current.trim());
  return lines;
}
