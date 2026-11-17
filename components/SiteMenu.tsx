"use client";

import { usePathname } from "next/navigation";
import type { KeyboardEvent as ReactKeyboardEvent, RefObject } from "react";
import BreakText from "@/components/BreakText";
import PwaInstallButton from "@/components/PwaInstallButton";
import SiteSearchForm from "@/components/SiteSearchForm";
import { NETWORK_STATIONS } from "@/lib/network-stations";
import { sendGaEvent } from "@/lib/retention";
import { MENU_INFO_LINKS, MENU_SECTIONS, currentMenuHref } from "@/lib/site-menu";

export type SiteMenuGenre = { key: string; label: string; count: number };
export type SiteMenuProfession = { id: string; title: string; href: string };

const STATION_EVENT: Record<string, string> = {
  AI: "ai",
  LI: "license",
  CA: "career",
  CO: "company",
  PO: "politics"
};

// 本家のメニュー（ホーム・下層ページ共通）。トップ・ヘッダーと同じ紙色の地・黒の細い線・明朝の見出し・
// Barlow の番号で組み、区分の番号・各項目の短い説明・現在地・検索・姉妹サイトへの導線を載せる。
// リンクはすべて通常の <a>（ページを読み直して先頭に着地させる。client 遷移だと前のページの位置を引き継ぐ）。
export default function SiteMenu({
  id,
  drawerRef,
  genres,
  professions,
  breaks,
  onClose,
  onKeyDown
}: {
  id: string;
  drawerRef: RefObject<HTMLElement>;
  genres: SiteMenuGenre[];
  professions: SiteMenuProfession[];
  breaks: Record<string, number[]>;
  onClose: () => void;
  onKeyDown: (event: ReactKeyboardEvent<HTMLElement>) => void;
}) {
  const pathname = usePathname() ?? "/";
  const currentHref = currentMenuHref(pathname);
  const isHome = pathname === "/" || pathname === "";
  const currentLabel = isHome
    ? "トップ"
    : currentHref
      ? [...MENU_SECTIONS.flatMap((section) => section.items), ...MENU_INFO_LINKS].find((item) => item.href === currentHref)?.label ?? null
      : pathname.startsWith("/video/")
        ? "動画ページ"
        : pathname.startsWith("/genre/")
          ? "ジャンル"
          : pathname.startsWith("/guide/")
            ? "ロードマップ"
            : null;
  const text = (value: string) => <BreakText text={value} breaks={breaks[value]} />;
  const titleId = `${id}-title`;

  return (
    <div className="mp-menu-layer">
      <button type="button" className="mp-menu-backdrop" aria-label="メニューを閉じる" tabIndex={-1} onClick={onClose} />
      <aside id={id} ref={drawerRef} className="mp-menu" role="dialog" aria-modal="true" aria-labelledby={titleId} onKeyDown={onKeyDown}>
        <div className="mp-menu-head">
          <a className="lb-wordmark mp-menu-mark" href="/" aria-label="manapick トップへ">
            manapick
          </a>
          <h2 id={titleId} className="mp-menu-kicker">
            <span className="num">MENU</span>
            <span>メニュー</span>
          </h2>
          <button type="button" className="mp-menu-close" onClick={onClose} aria-label="メニューを閉じる">
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className="mp-menu-body">
          {currentLabel ? (
            <p className="mp-menu-here">
              <b>現在地</b>
              <span>{currentLabel}</span>
            </p>
          ) : null}

          <SiteSearchForm id={`${id}-search`} className="is-menu" />

          {MENU_SECTIONS.map((section) => (
            <section key={section.no} className="mp-menu-sec" aria-labelledby={`${id}-sec-${section.no}`}>
              <h3 id={`${id}-sec-${section.no}`}>
                <span className="mp-menu-no num">{section.no}</span>
                <span className="mp-menu-ttl">{section.title}</span>
                <span className="mp-menu-en num" aria-hidden="true">
                  {section.en}
                </span>
              </h3>
              <ul className="mp-menu-list">
                {section.items.map((item) => {
                  const current = item.href === currentHref;
                  return (
                    <li key={item.href}>
                      <a href={item.href} className={current ? "is-current" : undefined} aria-current={current ? "page" : undefined} onClick={onClose}>
                        <span className="mp-menu-t">
                          <b>{text(item.label)}</b>
                          <small>{text(item.note)}</small>
                        </span>
                        {current ? <em>現在地</em> : <i className="mp-menu-go" aria-hidden="true" />}
                      </a>
                    </li>
                  );
                })}
              </ul>
              {section.no === "01" && professions.length > 0 ? (
                <details className="mp-menu-more">
                  <summary>
                    <span>なりたい職業から選ぶ</span>
                    <small className="num">{professions.length}</small>
                  </summary>
                  <ul className="mp-menu-chips">
                    {professions.map((route) => (
                      <li key={route.id}>
                        <a href={route.href} onClick={onClose}>
                          {text(route.title)}
                        </a>
                      </li>
                    ))}
                  </ul>
                </details>
              ) : null}
              {section.no === "02" && genres.length > 0 ? (
                <details className="mp-menu-more">
                  <summary>
                    <span>{genres.length}ジャンルから探す</span>
                    <small className="num">{genres.length}</small>
                  </summary>
                  <ul className="mp-menu-genres">
                    {genres.map((genre) => {
                      const current = pathname.startsWith(`/genre/${genre.key}/`);
                      return (
                        <li key={genre.key}>
                          <a href={`/genre/${genre.key}/`} className={current ? "is-current" : undefined} aria-current={current ? "page" : undefined} onClick={onClose}>
                            <span>{genre.label}</span>
                            <small className="num">{genre.count}本</small>
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </details>
              ) : null}
              {section.no === "04" ? (
                <div className="mp-menu-install">
                  <PwaInstallButton />
                </div>
              ) : null}
            </section>
          ))}

          <section className="mp-menu-sec is-info" aria-labelledby={`${id}-sec-05`}>
            <h3 id={`${id}-sec-05`}>
              <span className="mp-menu-no num">05</span>
              <span className="mp-menu-ttl">サイト情報</span>
              <span className="mp-menu-en num" aria-hidden="true">
                ABOUT
              </span>
            </h3>
            <ul className="mp-menu-info">
              {MENU_INFO_LINKS.map((link) => {
                const current = link.href === currentHref;
                return (
                  <li key={link.href}>
                    <a href={link.href} className={current ? "is-current" : undefined} aria-current={current ? "page" : undefined} onClick={onClose}>
                      {link.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </section>

          <section className="mp-menu-net" aria-labelledby={`${id}-net`}>
            <h3 id={`${id}-net`} className="num">
              MANAPICK NETWORK
            </h3>
            <ul>
              {NETWORK_STATIONS.map((station) => (
                <li key={station.code} style={{ ["--stc" as string]: station.color }}>
                  {station.current ? (
                    <span className="mp-menu-stn is-current" aria-current="page">
                      <i aria-hidden="true" />
                      <span className="mp-menu-t">
                        <b>{station.name}</b>
                        <small>
                          {text(station.role)}・{text(station.description)}
                        </small>
                      </span>
                      <em>現在地</em>
                    </span>
                  ) : (
                    <a
                      className="mp-menu-stn"
                      href={station.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        const key = STATION_EVENT[station.code];
                        if (key) sendGaEvent(`${key}_crosslink_click`, { placement: "menu", target: `manapick_${key}` });
                        onClose();
                      }}
                    >
                      <i aria-hidden="true" />
                      <span className="mp-menu-t">
                        <b>{station.name}</b>
                        <small>
                          {text(station.role)}・{text(station.description)}
                        </small>
                      </span>
                      <span className="mp-menu-ext" aria-hidden="true">
                        ↗
                      </span>
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </aside>
    </div>
  );
}
