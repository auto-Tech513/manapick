"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { NETWORK_STATIONS } from "@/lib/network-stations";

// SP下部タブバーの「乗り換え」。路線図をボトムシートで開く。
// 駅データは lib/network-stations.ts の配列が正（6駅目追加はそちらへ）。
export default function TransferNavItem() {
  const [open, setOpen] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => {
      sheetRef.current?.querySelector<HTMLElement>(".nw-sheet-close")?.focus();
    }, 0);
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", handleKey);
    };
  }, [open ]);

  function close() {
    setOpen(false);
    buttonRef.current?.focus();
  }

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <circle cx="6" cy="18" r="2.4" />
          <circle cx="18" cy="6" r="2.4" />
          <path d="M8 16.5 16 7.5" />
        </svg>
        <span>乗り換え</span>
      </button>

      {open ? (
        <div className="nw-sheet-layer google-anno-skip">
          <button type="button" className="nw-sheet-backdrop" aria-label="乗り換えを閉じる" onClick={close} />
          <div
            ref={sheetRef}
            className="nw-sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby="nw-sheet-title"
          >
            <div className="nw-sheet-head">
              <h2 id="nw-sheet-title">学びの路線図</h2>
              <button type="button" className="nw-sheet-close" onClick={close} aria-label="乗り換えを閉じる">
                ×
              </button>
            </div>
            <p className="nw-sheet-lead">{NETWORK_STATIONS.length}つの駅で、学びがつながっています。</p>
            <ul className="nw-sheet-list">
              {NETWORK_STATIONS.map((station) => {
                const badge = (
                  <span className="nw-stn" style={{ "--stc": station.color } as CSSProperties}>
                    {station.code}
                    <small>{station.number}</small>
                  </span>
                );
                const body = (
                  <>
                    {badge}
                    <span className="nw-sheet-text">
                      <span className="nw-sheet-name">
                        {station.name}
                        {station.current ? <span className="nw-sheet-here">現在地</span> : null}
                      </span>
                      <span className="nw-sheet-role">{station.role}</span>
                    </span>
                  </>
                );
                return (
                  <li key={station.code}>
                    {station.current ? (
                      <span className="nw-sheet-row is-current" aria-current="page">
                        {body}
                      </span>
                    ) : (
                      <a className="nw-sheet-row" href={station.url} target="_blank" rel="noopener noreferrer">
                        {body}
                        <span className="nw-sheet-arr" aria-hidden="true">
                          ↗
                        </span>
                      </a>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      ) : null}
    </>
  );
}
