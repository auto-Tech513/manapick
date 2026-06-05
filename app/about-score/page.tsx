import type { Metadata } from "next";
import BrandLogo, { BrandMark } from "@/components/BrandLogo";

export const metadata: Metadata = {
  title: "採点方法 | Manapick",
  description: "Manapickスコアの考え方、確認済と暫定の違い、除外方針を説明します。"
};

const axes = [
  ["実用性", "仕事や学習の次の行動につながるか"],
  ["正確性・鮮度", "公開時期や内容が現在の学習に使いやすいか"],
  ["分かりやすさ", "初学者にも追いやすい説明か"],
  ["体系性", "単発Tipsで終わらず順序立てて学べるか"],
  ["信頼性", "チャンネルや説明の姿勢に不自然な誘導がないか"],
  ["視聴体験", "長さ、構成、見やすさが社会人の学習に合うか"],
  ["規約・権利", "公式YouTubeで視聴でき、紹介上のリスクが低いか"]
];

export default function AboutScorePage() {
  return (
    <main className="score-page">
      <header className="score-page-header">
        <a href="/" aria-label="Manapick トップへ">
          <BrandLogo compact />
        </a>
      </header>

      <section className="score-hero">
        <p className="section-eyebrow">Manapickスコア</p>
        <h1>採点方法</h1>
        <p>
          Manapickは、学習動画を過度に大きく見せず、選定理由と確認状況を分けて表示します。
          スコアは7軸×5点の35点満点です。
        </p>
      </section>

      <section className="score-explain-grid" aria-label="スコア表示の種類">
        <article>
          <span className="score-page-badge confirmed">31/35 ✓確認済</span>
          <h2>確認済</h2>
          <p>編集者が動画本編を確認し、内容・誘導・権利面を見たうえで公開している状態です。</p>
        </article>
        <article>
          <span className="score-page-badge provisional">31/35 暫定</span>
          <h2>暫定</h2>
          <p>自動採点やメタデータをもとにした候補です。順次、人の視聴確認で確定します。</p>
        </article>
      </section>

      <section className="score-section">
        <h2>7軸×5点で見る理由</h2>
        <div className="score-axis-grid">
          {axes.map(([axis, body]) => (
            <article key={axis}>
              <h3>{axis}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="score-section muted">
        <h2>足切りと除外方針</h2>
        <p>
          正確性・鮮度が低い動画、規約・権利面で扱いにくい動画は、高得点でも掲載しません。
          誤情報、釣りタイトル、情報商材への強い誘導、過度な収益保証を含む動画も不採用にします。
        </p>
      </section>

      <section className="score-section">
        <h2>編集メモについて</h2>
        <p>
          各動画に編集者の1行メモがある場合は、スコアとは別に「なぜ選んだか」を表示します。
          メモが空の動画では表示しません。
        </p>
      </section>

      <footer className="score-page-footer">
        <p>
          <BrandMark className="h-7 w-7" />
          <span>Manapick</span>
        </p>
        <a href="/">トップへ戻る</a>
      </footer>
    </main>
  );
}
