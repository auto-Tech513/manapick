// Server-only: メニュー文言の文節境界（BudouX、ビルド時）。クライアント部品 SiteMenu へはオフセットだけ渡す。
import { phraseBreaks } from "@/lib/phrase-breaks";
import { menuPhrases } from "@/lib/site-menu";
import professionRoutes from "@/content/professions.json";
import { NETWORK_STATIONS } from "@/lib/network-stations";

export function siteMenuBreaks(): Record<string, number[]> {
  const extra = [
    ...(professionRoutes as { title: string }[]).map((route) => route.title),
    ...NETWORK_STATIONS.flatMap((station) => [station.role, station.description])
  ];
  const out: Record<string, number[]> = {};
  for (const text of menuPhrases(extra)) {
    const breaks = phraseBreaks(text);
    if (breaks.length) out[text] = breaks;
  }
  return out;
}
