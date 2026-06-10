import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-paper text-ink">
      <header className="border-b border-ink/10 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-4">
          <Link href="/" aria-label="Manapick トップ">
            <BrandLogo compact />
          </Link>
          <Link href="/" className="rounded-lg border border-ink/12 px-3 py-2 text-sm font-black hover:border-leaf">
            トップへ
          </Link>
        </div>
      </header>
      <section className="mx-auto grid min-h-[70vh] max-w-4xl place-items-center px-4 py-12">
        <div className="w-full rounded-2xl border border-ink/10 bg-white p-6 shadow-card sm:p-10">
          <p className="text-sm font-bold text-leaf">404</p>
          <h1 className="mt-2 text-3xl font-black leading-tight sm:text-5xl">ページが見つかりません</h1>
          <p className="mt-4 max-w-2xl leading-8 text-ink/76">
            URLが変更されたか、ページが削除された可能性があります。トップページ、ロードマップ、ガイド記事から目的の学習動画を探せます。
          </p>
          <nav className="mt-7 grid gap-3 sm:grid-cols-3" aria-label="次に見るページ">
            <Link className="rounded-lg bg-primary px-4 py-3 text-center text-sm font-black text-white shadow-button hover:bg-primaryInk" href="/">
              トップへ戻る
            </Link>
            <Link className="rounded-lg border border-ink/10 px-4 py-3 text-center text-sm font-black text-primary hover:border-leaf" href="/#roadmap">
              ロードマップを見る
            </Link>
            <Link className="rounded-lg border border-ink/10 px-4 py-3 text-center text-sm font-black text-primary hover:border-leaf" href="/guide/generative-ai/">
              ガイド記事を読む
            </Link>
          </nav>
        </div>
      </section>
    </main>
  );
}
