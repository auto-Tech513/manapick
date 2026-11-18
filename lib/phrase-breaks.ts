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
const OPENING = /[「『（(【〔［\[〈《＜]/;
// 〜（U+301C 波ダッシュ）と ＞ も行頭禁則（「始め方｜〜アニメーション」「＜初心者・入門＞」で行頭に来ていた）
const NO_LINE_START = /[」』）)】〕］\]〉》＞、。，．,.・：:；;！？!?ー～〜ぁぃぅぇぉっゃゅょゎァィゥェォッャュョヮヵヶ]/;
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
        // 英字と漢字・カタカナの境目（「【無料｜YouTube｜動画4本】」）。長い文節が行幅を超えて「4｜本】」と折れるのを防ぐ
        else if (/[A-Za-z]/.test(a) && (KANJI.test(b) || KATAKANA.test(b))) breaks.push(offset + i);
        else if ((KANJI.test(a) || KATAKANA.test(a) || a === "ー") && /[A-Za-z]/.test(b)) breaks.push(offset + i);
        // 助詞などのひらがなの後ろに漢字が続く所（「スプレッドシートにも｜拡大」「初期設定まで｜解説」）
        else if (/[ぁ-ゖ]/.test(a) && KANJI.test(b)) breaks.push(offset + i);
      }
    }
    // 「ChatGPT・Claude・Gemini」のように中黒・スラッシュで並べた語は BudouX が1文節にまとめるため、
    // SP で文節が行幅を超えると英単語の途中（Gem｜ini）で折れる。区切り記号の直後にも改行位置を置く。
    for (let i = 1; i < chunk.length; i++) {
      if (/[・／/→｜|_＿：〜～＊※◆◇■□●○★☆]/.test(chunk[i - 1]) && !/[・／/→｜|_＿：〜～＊※◆◇■□●○★☆]/.test(chunk[i])) breaks.push(offset + i);
      // 漢字・かなの後ろの「ー」はダッシュとして使われている（「初期設定ー非エンジニア向け」）。その後ろで折れるように
      else if (chunk[i - 1] === "ー" && i >= 2 && !/[ァ-ヺー]/.test(chunk[i - 2]) && chunk[i] !== "ー") breaks.push(offset + i);
      // ハッシュタグの前（「育休中#保育士試験#…」）
      else if (/[#＃]/.test(chunk[i]) && !/[#＃\s]/.test(chunk[i - 1])) breaks.push(offset + i);
      // manapick 追加: 長い動画タイトル（「【何年かかる？】英語力…」「アンソロピック「Claude…」）が1文節にまとまり、
      // 行幅を超えて任意の位置で折れるのを防ぐ。開き括弧の手前と、閉じ括弧・！？・読点の直後も改行位置にする。
      else if (OPENING.test(chunk[i]) && !OPENING.test(chunk[i - 1])) breaks.push(offset + i);
      else if (/[】」』）)〉》＞！？!?、。]/.test(chunk[i - 1])) breaks.push(offset + i);
    }
    offset += chunk.length;
    if (offset < text.length) breaks.push(offset);
  }
  // 長いカタカナの複合語は語の切れ目にも区切りを置く（狭いカードで「プランナ｜ー」「プラクテ｜ィショナー」と禁則を破って折れるのを防ぐ）
  for (const w of KATAKANA_COMPOUNDS) {
    const plain = w.replace(/\|/g, "");
    let from = 0;
    for (;;) {
      const at = text.indexOf(plain, from);
      if (at < 0) break;
      let k = at;
      for (const part of w.split("|").slice(0, -1)) {
        k += part.length;
        breaks.push(k);
      }
      from = at + 1;
    }
  }
  // 9字以上続く漢字（「管理栄養士国家試験対策」「基本情報技術者試験完全攻略」）は BudouX が区切らないことがあり、
  // 狭いカードで強制改行（行頭「】」）になる。よく使う語の手前に区切りを置く
  const KANJI_RUN = /[㐀-鿿々]{9,}/g;
  let km: RegExpExecArray | null;
  while ((km = KANJI_RUN.exec(text))) {
    for (const w of KANJI_SPLIT_BEFORE) {
      let from = km.index + 2;
      for (;;) {
        const at = text.indexOf(w, from);
        if (at < 0 || at > km.index + km[0].length - 2) break;
        breaks.push(at);
        from = at + 1;
      }
    }
  }
  // Spaces already allow a break; drop break points next to whitespace.
  // 閉じ括弧・句読点・小書き仮名・長音が行頭に来る位置と、開き括弧が行末に残る位置には置かない（行頭・行末禁則）。
  const filtered = breaks.filter(
    (b) => b > 0 && b < text.length && !/\s/.test(text[b - 1]) && !/\s/.test(text[b]) && !NO_LINE_START.test(text[b]) && !OPENING.test(text[b - 1])
  );
  const merged = mergeTinySegments(text, protectCompounds(text, dropShortSameClass(text, filtered)));
  const result = protectCompounds(text, splitLongSegments(text, merged));
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
  "並べ替え",
  // 数と月の間（「3ヶ｜月」）
  "ヶ月",
  "ヵ月",
  "カ月",
  "ケ月",
  "か月",
  "初心者",
  "入門者",
  "使い方",
  "勉強法"
];

const KANJI_SPLIT_BEFORE = ["国家", "試験", "対策", "講座", "入門", "解説", "攻略", "完全", "勉強", "合格", "基礎", "過去問", "技術", "検定", "講義"];

const KATAKANA_COMPOUNDS = [
  "セキュリティ|マネジメント",
  "クラウド|プラクティショナー",
  "ファイナンシャル|プランナー",
  "テキスト|アニメーション",
  "ネットワーク|エンジニア",
  "ソリューション|アーキテクト",
  "カラー|グレーディング",
  "プロンプト|エンジニアリング",
  "インデックス|ファンド",
  "デジタル|マーケティング",
  "タックス|プランニング",
  "ニューラル|ネットワーク",
  "アガルート|アカデミー",
  "アーキテクト|アソシエイト",
  "インデックス|レポート",
  "ファシリテーション|スキル",
  "ライフ|プランニング",
  "データ|サイエンティスト",
  "アフター|エフェクト",
  "クリエイティブ|ロードマップ"
];

type CharClass = "kanji" | "kata" | "latin" | "other";
const classOf = (c: string | undefined): CharClass =>
  !c ? "other" : KANJI.test(c) ? "kanji" : /[ァ-ヺー]/.test(c) ? "kata" : /[A-Za-z0-9０-９Ａ-Ｚａ-ｚ]/.test(c) ? "latin" : "other";

/** 同じ字種が続く長さ（b の左側・右側）。 */
function runAround(text: string, b: number): [number, number] {
  const k = classOf(text[b]);
  let l = 0, r = 0;
  while (b - 1 - l >= 0 && classOf(text[b - 1 - l]) === k) l++;
  while (b + r < text.length && classOf(text[b + r]) === k) r++;
  return [l, r];
}

/**
 * 漢字どうし・カタカナどうし・英数字どうしの間の区切りで、どちらかの側が2字以下のものは熟語・語の途中なので外す
 * （BudouX が「完全解｜説【」「編集方｜法を」「完全マ｜スター」と区切ることがあり、keep-all の中ではそこが唯一の改行位置になる）。
 */
function dropShortSameClass(text: string, breaks: number[]): number[] {
  return breaks.filter((b) => {
    const k = classOf(text[b]);
    if (k === "other" || classOf(text[b - 1]) !== k) return true;
    const [l, r] = runAround(text, b);
    if (Math.min(l, r) <= 2) return false;
    // 漢字の熟語は2字ずつが多い。短い側が3字で、漢字の並びの奇数字目の区切りは熟語の途中（「活用方｜法完全」「完全合｜格講義」）
    if (k === "kanji" && Math.min(l, r) === 3 && l % 2 === 1) return false;
    return true;
  });
}

/** 字種の変わり目（英字↔和字、カタカナ↔漢字、ひらがな→漢字、カタカナ→ひらがな）で、禁則にならない位置 */
function isClassBoundary(text: string, i: number): boolean {
  const a = text[i - 1], b = text[i];
  if (!a || !b || /\s/.test(a) || /\s/.test(b) || NO_LINE_START.test(b) || OPENING.test(a)) return false;
  // 数字は前後の語（「第1回」「3級」「2026年」）と離さない
  if (/[0-9０-９]/.test(a) || /[0-9０-９]/.test(b)) return false;
  const ka = classOf(a), kb = classOf(b);
  if (ka !== "other" && kb !== "other") return ka !== kb;
  if (/[ぁ-ゖ]/.test(a) && kb === "kanji") return true;
  if (ka === "kata" && /[ぁ-ゖ]/.test(b)) return true;
  return false;
}

/**
 * 区切りのない長い文節（12字超）は、行幅を超えると overflow-wrap で禁則を無視して強制的に折れる
 * （「決算書⏎、」「…ショナー⏎】」）。文節の中の字種の変わり目に区切りを足し、両側を3字以上残す。
 */
function splitLongSegments(text: string, breaks: number[]): number[] {
  const out = [...breaks].sort((a, b) => a - b);
  const bounds = [0, ...out, text.length];
  for (let j = 0; j < bounds.length - 1; j++) {
    const s = bounds[j], e = bounds[j + 1];
    if (e - s <= 12) continue;
    let last = s;
    let added = false;
    for (let i = s + 2; i <= e - 2; i++) {
      // 文末の区切りは、後ろに3字以上（閉じ括弧などは数えない）残す（「アドビ｜公式」「Mac｜対応】」の最終行2字を防ぐ）
      if (e === text.length && tailLength(text, i) <= 2) break;
      if (i - last >= 2 && isClassBoundary(text, i)) {
        out.push(i);
        last = i;
        added = true;
      }
    }
    // 字種の変わり目が無い長い文節（「高校情報Ⅰ教科書完全準拠版」）は、よく使う語の手前で区切る（両側3字以上）
    if (!added) {
      for (const w of KANJI_SPLIT_BEFORE) {
        const at = text.indexOf(w, s + 3);
        if (at > 0 && at <= e - 3 && tailLength(text, at) >= 3 && !NO_LINE_START.test(text[at])) {
          out.push(at);
          break;
        }
      }
    }
  }
  return Array.from(new Set(out)).sort((a, b) => a - b);
}

/** 区切り b の後ろの文字数（末尾の閉じ括弧・句読点・！？は数えない） */
function tailLength(text: string, b: number): number {
  return text.slice(b).replace(/[\s】」』）)〕］\]〉》＞、。，．,.！？!?]+$/, "").length;
}

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
  // 末尾の1〜2字だけの文節は残さない（見出しの最終行が「拡大」「格」だけになる）。前の文節が長い（8字以上）ときは、
  // 前の文節の中の字種の変わり目へ区切りを移し（「スプレッドシート｜にも拡大」）、無ければ前の文節につなぐ
  // 末尾の閉じ括弧・句読点は数えない（「Mac｜対応】」も2字扱い）
  while (kept.length && tailLength(text, kept[kept.length - 1]) <= 2) {
    const last = kept.pop() as number;
    const start = kept[kept.length - 1] ?? 0;
    if (last - start < 8) continue;
    for (let i = last - 1; i >= start + 3; i--) {
      if (tailLength(text, i) >= 3 && isClassBoundary(text, i)) {
        kept.push(i);
        break;
      }
    }
    break;
  }
  return kept;
}

/**
 * 幅の狭い札（トピックチップ）用。文節の区切りに加えて、長いカタカナ語（7字以上）の中にも
 * 行頭禁則にならない位置（ー・小書き仮名の前を除く、語の端から3字以上内側）に区切りを置く。
 * 1語が札の幅を超えると keep-all の強制改行で「ア｜ーキテクト」「プラクテ｜ィショナー」と禁則が崩れるため。
 */
export function chipBreaks(text: string): number[] {
  const set = new Set(phraseBreaks(text));
  const KANA_RUN = /[ァ-ヺー]{7,}/g;
  let m: RegExpExecArray | null;
  while ((m = KANA_RUN.exec(text))) {
    const start = m.index;
    const end = start + m[0].length;
    for (let i = start + 3; i <= end - 3; i++) {
      if (!NO_LINE_START.test(text[i])) set.add(i);
    }
  }
  return Array.from(set).sort((a, b) => a - b);
}
