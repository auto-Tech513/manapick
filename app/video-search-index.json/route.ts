import { genres, publishedGenreKeys, videos } from "@/lib/manapick";

// メニュー・フッターの検索欄（components/SiteSearchForm）が候補を出すための軽い索引。
// 入力欄にフォーカスしたときだけ読み込む（動画データを各ページの JS に含めないため）。
// 要約（review）は重いので含めない。並び順はトップの検索と同じ関数（lib/search-keywords）で決める。
export const dynamic = "force-static";

const GENRE_ENGLISH: Record<string, string> = {
  ai: "Generative AI",
  prog: "Programming",
  video: "Creative",
  english: "English",
  data: "Data & DX",
  marke: "Marketing",
  biz: "Office skills",
  shikaku: "Certification",
  kaikei: "Accounting",
  money: "Money"
};

export function GET() {
  const published = genres.filter((genre) => genre.status === "published" && publishedGenreKeys.includes(genre.key));
  const body = {
    g: published
      .map((genre) => {
        const en = GENRE_ENGLISH[genre.key] ?? genre.key;
        return {
          key: genre.key,
          name: genre.label,
          en,
          initial: (en.charAt(0) || "G").toUpperCase(),
          count: videos.filter((video) => video.genre === genre.key).length
        };
      })
      .filter((genre) => genre.count > 0),
    v: videos.map((video) => [video.ytid, video.title, video.genre, video.sub, video.channel, video.tags.join(" "), video.minutes, video.level, video.score])
  };
  return new Response(JSON.stringify(body), { headers: { "content-type": "application/json; charset=utf-8" } });
}
