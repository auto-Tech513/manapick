import { MANAPICK_AI_URL, manapickAiUrlForGenre } from "@/lib/brand-links";
import { genreDisplayName } from "@/lib/manapick";

export function manapickAiHrefForGenre(genreKey: string) {
  return manapickAiUrlForGenre(genreKey);
}

export function manapickAiContextForGenre(genreKey: string) {
  const label = genreDisplayName(genreKey);
  if (genreKey === "ai") {
    return "生成AIを学ぶ順番はManapick、実際に使うAIツール選びはmanapick AI。料金・無料枠・使い方を7軸で正直採点しています。";
  }
  return `${label}の学習に使うAIツールを選ぶならmanapick AI。学ぶ順番はManapick、使うAI選びはmanapick AIで確認できます。`;
}
