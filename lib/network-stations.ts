import { MANAPICK_AI_URL, MANAPICK_CAREER_URL, MANAPICK_COMPANY_ORIGIN, MANAPICK_LICENSE_URL, MANAPICK_POLITICS_URL } from "@/lib/brand-links";

// manapick network の「駅」データ。レール（全ページ最上部）・フッター路線図・
// SPタブバーの乗り換えシートは、すべてこの配列から描画する。
// 駅の追加・変更はこの配列だけで全箇所へ反映される（現在6駅）。
export type NetworkStation = {
  code: string;
  number: string;
  name: string;
  shortName: string;
  role: string;
  description: string;
  url: string;
  color: string;
  current?: boolean;
};

export const NETWORK_STATIONS: NetworkStation[] = [
  {
    code: "MP",
    number: "01",
    name: "manapick",
    shortName: "manapick",
    role: "学ぶ",
    description: "無料の学習動画",
    url: "https://manapick.app/",
    color: "#1F3A8A",
    current: true
  },
  {
    code: "AI",
    number: "02",
    name: "manapick AI",
    shortName: "AI",
    role: "道具を選ぶ",
    description: "AIの比較と使い方",
    url: MANAPICK_AI_URL,
    color: "#FF4438"
  },
  {
    code: "LI",
    number: "03",
    name: "manapick license",
    shortName: "license",
    role: "証明する",
    description: "資格・検定の比較",
    url: MANAPICK_LICENSE_URL,
    color: "#15803D"
  },
  {
    code: "CA",
    number: "04",
    name: "manapick career",
    shortName: "career",
    role: "仕事につなぐ",
    description: "職業と学ぶ順番",
    url: MANAPICK_CAREER_URL,
    color: "#FFD700"
  },
  {
    code: "CO",
    number: "05",
    name: "manapick company",
    shortName: "company",
    role: "企業を読む",
    description: "企業の物語と数字",
    url: MANAPICK_COMPANY_ORIGIN,
    color: "#BE185D"
  },
  {
    code: "PO",
    number: "06",
    name: "manapick politics",
    shortName: "politics",
    role: "政治と法律",
    description: "コミカルに易しく",
    url: MANAPICK_POLITICS_URL,
    color: "#6D28D9"
  }
];

export const CURRENT_STATION = NETWORK_STATIONS.find((station) => station.current) ?? NETWORK_STATIONS[0];
export const SISTER_STATIONS = NETWORK_STATIONS.filter((station) => !station.current);
