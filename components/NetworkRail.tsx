import RailMenuButton from "@/components/RailMenuButton";
import { NETWORK_STATIONS } from "@/lib/network-stations";

// 全ページ最上部のネットワークレール（manapick network 共通部品）。
// 駅データは lib/network-stations.ts の配列が正で、6駅目の追加はそちらへ1要素足すだけ。
export default function NetworkRail() {
  return (
    <div className="nw-rail google-anno-skip">
      <span className="nw-rail-label">manapick network</span>
      <nav className="nw-rail-line" aria-label="manapick network の姉妹サイト">
        {NETWORK_STATIONS.map((station) =>
          station.current ? (
            <span key={station.code} className="nw-rail-station is-current" style={{ ["--stc" as string]: station.color }} aria-current="page">
              <i aria-hidden="true" />
              <span className="nw-rail-name">
                {station.shortName} {station.role}
              </span>
              <b>現在地</b>
            </span>
          ) : (
            <a
              key={station.code}
              className="nw-rail-station"
              style={{ ["--stc" as string]: station.color }}
              href={station.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <i aria-hidden="true" />
              <span className="nw-rail-name">
                {station.shortName} {station.role}
              </span>
            </a>
          )
        )}
      </nav>
      <div className="nw-rail-side">
        <a href="#footer-newsletter">メルマガ</a>
        <a href="https://x.com/manapick_app" target="_blank" rel="noopener noreferrer">
          X @manapick_app
        </a>
      </div>
      <RailMenuButton />
    </div>
  );
}
