"use client";

import { popularSearchKeywords } from "@/lib/search-keywords";

// 検索候補パネル（design-extra-2 01）。トップの検索欄と、メニュー・フッターの検索欄（SiteSearchForm）で共用する。
// 2文字目から、動画（最大5件・スコア順）→ ジャンル・キーワード → すべて見る。SP は入力欄を上端に固定した全画面。
export type PanelVideo = { ytid: string; title: string; minutes: number; level: string; score: number | null };
export type PanelGenre = { key: string; name: string; initial: string; count: number };
export type RecentSearches = { ready: boolean; items: string[]; clear: () => void };

export function highlightMatch(text: string, query: string) {
  const q = query.trim();
  if (q.length < 2) return text;
  const idx = text.toLowerCase().indexOf(q.toLowerCase());
  if (idx < 0) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark>{text.slice(idx, idx + q.length)}</mark>
      {text.slice(idx + q.length)}
    </>
  );
}

export default function LiveSearchPanel({
  id,
  query,
  total,
  suggestions,
  activeIndex,
  open,
  loading = false,
  recentSearches,
  genreMatches,
  keywordMatches,
  onSelect,
  onGenreSelect,
  onKeywordSelect,
  onShowAll,
  onRecentSearchSelect,
  onClose
}: {
  id: string;
  query: string;
  // null のときは件数を出さない（要約を含まない軽い索引で探す欄。件数がトップの検索結果とずれるため）
  total: number | null;
  suggestions: PanelVideo[];
  activeIndex: number;
  open: boolean;
  loading?: boolean;
  recentSearches: RecentSearches;
  genreMatches: PanelGenre[];
  keywordMatches: string[];
  onSelect: (video: PanelVideo) => void;
  onGenreSelect: (genreKey: string) => void;
  onKeywordSelect: (term: string) => void;
  onShowAll: () => void;
  onRecentSearchSelect: (term: string) => void;
  onClose: () => void;
}) {
  const trimmed = query.trim();
  const showGroups = trimmed.length >= 2 && !loading;
  const noCandidates = showGroups && suggestions.length === 0 && genreMatches.length === 0 && keywordMatches.length === 0;
  const keepFocus = {
    onPointerDown: (event: { preventDefault: () => void }) => event.preventDefault(),
    onMouseDown: (event: { preventDefault: () => void }) => event.preventDefault()
  };
  const statusText = loading
    ? "候補を読み込んでいます"
    : showGroups
      ? total === null
        ? `「${trimmed}」の候補`
        : `${total}件ヒット`
      : trimmed.length === 1
        ? "もう1文字入れると候補が出ます"
        : "キーワードで全動画を検索できます";

  return (
    <div id={id} className={open ? "lb-ls is-open google-anno-skip" : "lb-ls google-anno-skip"} role="listbox" aria-label="検索候補">
      <div className="lb-ls-status">
        <span aria-live="polite">{statusText}</span>
        <button type="button" onClick={onClose} aria-label="候補を閉じる">閉じる</button>
      </div>
      {showGroups && suggestions.length > 0 ? (
        <div className="lb-ls-g">
          <h5>動画 {total === null ? null : <small>候補 {total}件</small>}</h5>
          <ul>
            {suggestions.map((video, index) => (
              <li key={video.ytid}>
                <button
                  type="button"
                  className={index === activeIndex ? "lb-ls-row is-on" : "lb-ls-row"}
                  {...keepFocus}
                  onClick={() => onSelect(video)}
                  role="option"
                  aria-selected={index === activeIndex}
                >
                  <img className="lb-ls-th" src={"https://i.ytimg.com/vi/" + video.ytid + "/hqdefault.jpg"} alt="" loading="lazy" />
                  <span className="lb-ls-t">
                    <b>{highlightMatch(video.title, trimmed)}</b>
                    <small>
                      <span>{video.minutes}分</span>・
                      <span className={"lb-ls-lv " + (video.level === "初級" ? "is-beg" : video.level === "中級" ? "is-mid" : "is-high")}>
                        <i aria-hidden="true" />
                        {video.level}
                      </span>
                    </small>
                  </span>
                  <span className="lb-ls-s">{video.score ?? "–"}<small>/35</small></span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {showGroups && (genreMatches.length > 0 || keywordMatches.length > 0) ? (
        <div className="lb-ls-g">
          <h5>ジャンル・キーワード</h5>
          <ul>
            {genreMatches.map((genre) => (
              <li key={genre.key}>
                <button type="button" className="lb-ls-row" {...keepFocus} onClick={() => onGenreSelect(genre.key)} role="option" aria-selected={false}>
                  <span className="lb-ls-gk" aria-hidden="true">{genre.initial}</span>
                  <span className="lb-ls-t">
                    <b>{genre.name}</b>
                    <small>ジャンル ・ {genre.count}本</small>
                  </span>
                </button>
              </li>
            ))}
            {keywordMatches.map((term) => (
              <li key={term}>
                <button type="button" className="lb-ls-row" {...keepFocus} onClick={() => onKeywordSelect(term)} role="option" aria-selected={false}>
                  <span className="lb-ls-gk" aria-hidden="true">#</span>
                  <span className="lb-ls-t">
                    <b>{highlightMatch(term, trimmed)}</b>
                    <small>人気キーワード</small>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {noCandidates ? (
        <div className="lb-ls-none">
          <p>見つかりませんでした</p>
          <div>
            {popularSearchKeywords.slice(0, 3).map((term) => (
              <button key={term} type="button" {...keepFocus} onClick={() => onKeywordSelect(term)}>
                {term}
              </button>
            ))}
          </div>
        </div>
      ) : null}
      {showGroups && (total === null ? !noCandidates : total > 0) ? (
        <button type="button" className="lb-ls-all" {...keepFocus} onClick={onShowAll}>
          <span>{total === null ? `「${trimmed}」の検索結果をすべて見る` : `「${trimmed}」の検索結果をすべて見る（${total}件）`}</span>
          <span aria-hidden="true">→</span>
        </button>
      ) : null}
      {!showGroups && !loading && recentSearches.ready && recentSearches.items.length > 0 ? (
        <div className="lb-ls-recent" aria-label="最近の検索">
          <p>最近の検索</p>
          <div>
            {recentSearches.items.slice(0, 5).map((term) => (
              <button key={term} type="button" {...keepFocus} onClick={() => onRecentSearchSelect(term)}>
                {term}
              </button>
            ))}
          </div>
          <button type="button" className="lb-ls-clear" {...keepFocus} onClick={() => recentSearches.clear()}>
            履歴を消す
          </button>
        </div>
      ) : null}
      {!showGroups && !loading ? (
        <div className="lb-ls-recent lb-ls-popular" aria-label="人気キーワード">
          <p>人気キーワード</p>
          <div>
            {popularSearchKeywords.slice(0, 6).map((term) => (
              <button key={term} type="button" {...keepFocus} onClick={() => onKeywordSelect(term)}>
                {term}
              </button>
            ))}
          </div>
        </div>
      ) : null}
      <div className="lb-ls-keys" aria-hidden="true">
        <span>↑↓ 選ぶ</span>
        <span>Enter 開く</span>
        <span>Esc 閉じる</span>
      </div>
    </div>
  );
}
