import type { Metadata } from "next";
import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
import { absoluteUrl } from "@/lib/manapick";

const title = "manapi商店 | 学びとAI作業を続けやすくする6つの定番";
const description = "学習動画やAI作業を続けやすくする実在商品を、姿勢・画面・操作・ローカルAIの用途別に1商品ずつ紹介します。";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: absoluteUrl("/shop/") },
  openGraph: { title, description, url: absoluteUrl("/shop/"), type: "website" },
  twitter: { card: "summary", title, description }
};

const products = [
  { id: "flexispot-e7", category: "姿勢・デスク", maker: "FLEXISPOT", name: "FLEXISPOT E7", image: "/shop/flexispot-e7.webp", fit: "学習やAI作業が長く、座り続ける時間を区切りたい", reason: "動画を見て手を動かす日は、姿勢を変えるだけで区切りを作れます。昇降を『次の章へ進む合図』として使える一台です。", checks: ["天板サイズ", "身長に合う昇降範囲", "搬入と組み立て"], officialUrl: "https://www.flexispot.jp/standing-desk-E7-family" },
  { id: "ergotron-lx-pro", category: "姿勢・デスク", maker: "ERGOTRON", name: "ERGOTRON LX Pro", image: "/shop/ergotron-lx-pro.webp", fit: "講義画面とノートを見比べても、首と机を窮屈にしたくない", reason: "画面の位置を動かせると、動画を見る時間とノートを書く時間で姿勢を切り替えられます。机上も空き、教材を広げやすくなります。", checks: ["画面重量1.8〜10kg", "VESA規格", "天板の厚さ"], officialUrl: "https://www.ergotron.com/ja-jp/%E8%A3%BD%E5%93%81/%E8%A3%BD%E5%93%81%E8%A9%B3%E7%B4%B0/45-695" },
  { id: "dell-u3225qe", category: "学ぶ・作る", maker: "Dell", name: "Dell U3225QE", image: "/shop/dell-u3225qe.webp", fit: "講義、資料、AIの回答を同時に開いて往復を減らしたい", reason: "31.5インチ4Kの広さは、動画だけを大きくするためではなく、根拠と自分のノートを同時に残すために使えます。", checks: ["視聴距離と机幅", "PCの映像出力", "必要な接続端子"], officialUrl: "https://www.dell.com/ja-jp/shop/u3225qe-monitor/apd/210-BQMM/monitors-monitor-accessories" },
  { id: "stream-deck-neo", category: "学ぶ・作る", maker: "Elgato", name: "Stream Deck Neo", image: "/shop/stream-deck-neo.webp", fit: "教材、タイマー、ノート、AIを開く順番を毎回考えたくない", reason: "8個のキーに学習開始の操作をまとめれば、準備の面倒を減らせます。学ぶ内容ではなく、始めるまでの摩擦を小さくする道具です。", checks: ["対応OS", "USB-C接続", "短縮したい操作を3つ決める"], officialUrl: "https://www.elgato.com/jp/ja/p/stream-deck-neo" },
  { id: "mac-mini-m4", category: "AI・プログラミング", maker: "Apple", name: "Mac mini M4", image: "/shop/mac-mini-m4.webp", fit: "PythonやローカルAIを、机を圧迫しない常設環境で学びたい", reason: "小さく置けて、開発環境を毎回片づけずに済みます。ローカルAIはモデルごとに必要メモリが違うため、用途を決めてから構成を選びます。", checks: ["必要メモリ", "保存容量", "画面と入力機器は別途"], officialUrl: "https://www.apple.com/jp/mac-mini/specs/" },
  { id: "raspberry-pi-5", category: "AI・プログラミング", maker: "Raspberry Pi", name: "Raspberry Pi 5", image: "/shop/raspberry-pi-5.webp", fit: "Python、センサー、軽量AIを完成品ではなく仕組みから学びたい", reason: "小さな自動化を組む過程そのものが教材になります。大規模LLM用PCではなく、AIと現実の機器をつなぐ実験機として選びます。", checks: ["電源・冷却・保存媒体", "国内流通品", "大規模LLM向けではない"], officialUrl: "https://www.raspberrypi.com/products/raspberry-pi-5/" }
] as const;

const categories = Array.from(new Set(products.map((product) => product.category)));
const imageCredits: Record<(typeof products)[number]["id"], string> = {
  "flexispot-e7": "FLEXISPOT公式製品画像",
  "ergotron-lx-pro": "Ergotron公式資料",
  "dell-u3225qe": "Dell公式製品画像",
  "stream-deck-neo": "Elgato公式製品画像",
  "mac-mini-m4": "Apple公式製品画像",
  "raspberry-pi-5": "SimonWaldherr / Wikimedia Commons (CC BY-SA)"
};

export default function ShopPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: title,
    description,
    url: absoluteUrl("/shop/"),
    mainEntity: { "@type": "ItemList", numberOfItems: products.length, itemListElement: products.map((product, index) => ({ "@type": "ListItem", position: index + 1, name: product.name, url: absoluteUrl(`/shop/#${product.id}`) })) }
  };

  return (
    <main className="mp-shop-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
      <header className="mp-shop-topbar"><Link href="/" aria-label="Manapickトップへ"><BrandLogo /></Link><Link href="/">学習動画へ戻る</Link></header>
      <nav className="mp-shop-breadcrumbs" aria-label="パンくず"><Link href="/">トップ</Link><span>/</span><span>manapi商店</span></nav>
      <header className="mp-shop-hero">
        <span aria-hidden="true">MP</span>
        <div><p>PR / MANAPI SHOP</p><h1>manapi商店</h1><strong>学ぶ前に買うのではなく、続かない理由が道具にあるときだけ。</strong><p>6商品だけに絞り、学習とAI作業のどこで役立つか、買う前に何を見るかを整理しました。</p></div>
      </header>

      <nav className="mp-shop-network" aria-label="3サイトのmanapi商店">
        <span aria-current="page"><strong>学ぶ</strong><small>manapick</small></span>
        <a href="https://ai.manapick.app/shop/" target="_blank" rel="noopener noreferrer"><strong>AIを選ぶ</strong><small>manapick AI</small></a>
        <a href="https://license.manapick.app/shop/" target="_blank" rel="noopener noreferrer"><strong>資格を選ぶ</strong><small>manapick license</small></a>
      </nav>

      <section className="mp-shop-policy" aria-label="掲載基準"><strong>掲載基準</strong><span>✓ 1用途1商品</span><span>✓ 公式仕様を確認</span><span>✓ 価格・在庫を断定しない</span></section>
      <nav className="mp-shop-categories" aria-label="商品カテゴリ">{categories.map((category) => <a href={`#category-${category}`} key={category}>{category}</a>)}</nav>

      {categories.map((category) => (
        <section className="mp-shop-section" id={`category-${category}`} key={category}>
          <p className="mp-shop-eyebrow">ONE PICK FOR ONE JOB</p><h2>{category}</h2>
          <div className="mp-shop-grid">
            {products.filter((product) => product.category === category).map((product) => (
              <article className="mp-shop-card" id={product.id} key={product.id}>
                <figure className="mp-shop-media">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={product.image} alt={`${product.name}の製品画像`} width={900} height={560} loading="lazy" />
                  <figcaption>{imageCredits[product.id]}</figcaption>
                </figure>
                <div><p className="mp-shop-maker"><span>PR案内</span>{product.maker}</p><h3>{product.name}</h3><p className="mp-shop-fit"><strong>向いている人</strong>{product.fit}</p><p>{product.reason}</p><ul>{product.checks.map((check) => <li key={check}>{check}</li>)}</ul><div className="mp-shop-actions"><a href={`https://ai.manapick.app/shop/?utm_source=manapick&utm_medium=referral&utm_campaign=manapi_shop#${product.id}`} target="_blank" rel="noopener noreferrer">購入先をAI版で確認 <span aria-hidden="true">↗</span></a><a href={product.officialUrl} target="_blank" rel="noopener noreferrer">公式仕様 <span aria-hidden="true">↗</span></a></div></div>
              </article>
            ))}
          </div>
        </section>
      ))}
      <p className="mp-shop-disclosure">移動先のmanapick AIには広告（アフィリエイト）リンクが含まれます。価格・在庫・販売元・返品条件は購入先でご確認ください。掲載順は報酬額ではなく、学習と作業への対応関係で決めています。</p>
    </main>
  );
}
