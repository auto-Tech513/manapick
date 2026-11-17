// Server-only: computes Japanese phrase boundaries at build time with BudouX (Apache-2.0).
// Do NOT import this file from a "use client" module or from anything a client module imports
// (the BudouX model must stay out of /_next/static). Client components receive precomputed
// offsets instead (app/page.tsx → ManapickApp → components/BreakText.tsx).
// Same algorithm as the sister site ai.manapick.app (lib/phrase-breaks.ts).
// iPhone Safari does not support `word-break: auto-phrase`, so headings and titles are given
// explicit <wbr> break points instead (see components/BreakText.tsx and components/Phrase.tsx).
import { Parser } from "budoux/module/parser.js";
import { model } from "budoux/module/data/models/ja.js";

const parser = new Parser(model);
const JAPANESE = /[぀-ヿ㐀-鿿]/;
const KATAKANA = /[ァ-ヺ]/; // excludes ー (U+30FC), which joins the previous run
const KANJI = /[㐀-鿿々]/;
const LONG_PHRASE = 8;
const OPENING = /[「『（(【〔［\[〈《]/;
const NO_LINE_START = /[」』）)】〕］\]〉》、。，．,.・：:；;！？!?ー～ぁぃぅぇぉっゃゅょゎァィゥェォッャュョヮヵヶ]/;
const cache = new Map<string, number[]>();

/** Card data with title break points (GuideCard). */
export function withTitleBreaks<T extends { title: string }>(item: T): T & { titleBreaks: number[] } {
  return { ...item, titleBreaks: phraseBreaks(item.title) };
}

/** Card data with headline break points (NewsCard). */
export function withHeadlineBreaks<T extends { headline: string }>(item: T): T & { headlineBreaks: number[] } {
  return { ...item, headlineBreaks: phraseBreaks(item.headline) };
}

/** Offsets (UTF-16 indices) where a line break reads naturally. Empty when the text has no Japanese. */
export function phraseBreaks(text: string): number[] {
  if (!text || !JAPANESE.test(text)) return [];
  const hit = cache.get(text);
  if (hit) return hit;
  const breaks: number[] = [];
  let offset = 0;
  for (const chunk of parser.parse(text)) {
    // A long chunk such as 「アンバサダープログラム参加規約」 also gets a break where katakana meets kanji.
    if (chunk.length > LONG_PHRASE) {
      for (let i = 1; i < chunk.length; i++) {
        const a = chunk[i - 1], b = chunk[i];
        if ((KATAKANA.test(a) || a === "ー") && KANJI.test(b)) breaks.push(offset + i);
        else if (KANJI.test(a) && KATAKANA.test(b)) breaks.push(offset + i);
      }
    }
    // 「ChatGPT・Claude・Gemini」のように中黒・スラッシュで並べた語は BudouX が1文節にまとめるため、
    // SP で文節が行幅を超えると英単語の途中（Gem｜ini）で折れる。区切り記号の直後にも改行位置を置く。
    for (let i = 1; i < chunk.length; i++) {
      if (/[・／/→]/.test(chunk[i - 1]) && !/[・／/→]/.test(chunk[i])) breaks.push(offset + i);
      // manapick 追加: 長い動画タイトル（「【何年かかる？】英語力…」「アンソロピック「Claude…」）が1文節にまとまり、
      // 行幅を超えて任意の位置で折れるのを防ぐ。開き括弧の手前と、閉じ括弧・！？・読点の直後も改行位置にする。
      else if (OPENING.test(chunk[i]) && !OPENING.test(chunk[i - 1])) breaks.push(offset + i);
      else if (/[】」』）)！？!?、。]/.test(chunk[i - 1])) breaks.push(offset + i);
    }
    offset += chunk.length;
    if (offset < text.length) breaks.push(offset);
  }
  // Spaces already allow a break; drop break points next to whitespace.
  // 閉じ括弧・句読点・小書き仮名・長音が行頭に来る位置と、開き括弧が行末に残る位置には置かない（行頭・行末禁則）。
  const filtered = breaks.filter(
    (b) => b > 0 && b < text.length && !/\s/.test(text[b - 1]) && !/\s/.test(text[b]) && !NO_LINE_START.test(text[b]) && !OPENING.test(text[b - 1])
  );
  const result = protectCompounds(text, mergeTinySegments(text, filtered));
  cache.set(text, result);
  return result;
}

/**
 * Compounds BudouX is known to split internally (observed on real headings:
 * 「問い合わせ」 was split both as 問い｜合わせ and as …：問い｜合わせ…, depending on the
 * chunk the first half lands in, so the tiny-segment rule alone cannot catch it).
 * A break strictly inside an occurrence of these words is removed.
 */
const PROTECTED_COMPOUNDS = [
  "問い合わせ",
  "打ち合わせ",
  "申し込み",
  "受け付け",
  "見積もり",
  "立ち上げ",
  "取り組み",
  "組み合わせ",
  "切り替え",
  "並べ替え"
];

function protectCompounds(text: string, breaks: number[]): number[] {
  if (!breaks.length) return breaks;
  const inside = new Set<number>();
  for (const word of PROTECTED_COMPOUNDS) {
    let from = 0;
    for (;;) {
      const at = text.indexOf(word, from);
      if (at < 0) break;
      for (const b of breaks) if (b > at && b < at + word.length) inside.add(b);
      from = at + 1;
    }
  }
  return inside.size ? breaks.filter((b) => !inside.has(b)) : breaks;
}

/**
 * BudouX sometimes splits a compound right after a 1–2 char fragment (e.g. 「問い合わせ」 →
 * 問い｜合わせ). Inside .bx (word-break: keep-all) that break point is the only place the line
 * can wrap, so on narrow screens the fragment ends up alone on a line — the mid-compound split
 * the owner photographed on iPhone Safari. Never leave a segment of <= 2 chars isolated:
 * merge it into the following segment (or the previous one at the end of the string).
 */
function mergeTinySegments(text: string, breaks: number[]): number[] {
  if (!breaks.length) return breaks;
  const sorted = [...breaks].sort((a, b) => a - b);
  const kept: number[] = [];
  let prev = 0;
  for (const b of sorted) {
    if (b - prev <= 2) continue; // fragment before this break is too short; drop the break
    kept.push(b);
    prev = b;
  }
  while (kept.length && text.length - kept[kept.length - 1] <= 2) kept.pop();
  return kept;
}
