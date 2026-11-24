import { NETWORK_STATIONS } from "@/lib/network-stations";

// フッター路線図（manapick network 共通部品）。駅データは lib/network-stations.ts。
export default function NetworkRoute() {
  return (
    <section className="nw-route" aria-label="manapick network 路線図">
      <h4>manapick network</h4>
      <p className="lead">
        <span className="w">学びは、</span>
        <span className="w">6つの駅でつながっています。</span>
      </p>
      <div className={NETWORK_STATIONS.length >= 6 ? "map six" : "map"}>
        {NETWORK_STATIONS.map((station) =>
          station.current ? (
            <span key={station.code} className="st is-current" style={{ ["--stc" as string]: station.color }} aria-current="page">
              <i aria-hidden="true" />
              <em>{station.code}</em>
              <b>{station.name}</b>
              <span>
                {station.role} — {station.description}
              </span>
            </span>
          ) : (
            <a
              key={station.code}
              className="st"
              style={{ ["--stc" as string]: station.color }}
              href={station.url}
              target="_blank"
              rel="noopener"
            >
              <i aria-hidden="true" />
              <em>{station.code}</em>
              <b>{station.name}</b>
              <span>
                {station.role} — {station.description}
              </span>
            </a>
          )
        )}
      </div>
    </section>
  );
}
