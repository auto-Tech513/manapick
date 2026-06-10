import Link from "next/link";
import type { ReactNode } from "react";
import BrandLogo from "@/components/BrandLogo";

type PolicyPageProps = {
  title: string;
  lead: string;
  sections: {
    heading: string;
    body: string;
  }[];
  children?: ReactNode;
};

export default function PolicyPage({ title, lead, sections, children }: PolicyPageProps) {
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
      <article className="mx-auto max-w-4xl px-4 py-10">
        <p className="text-sm font-bold text-leaf">固定ページ</p>
        <h1 className="mt-2 text-3xl font-black">{title}</h1>
        <p className="mt-4 max-w-3xl leading-8 text-ink/76">{lead}</p>
        <div className="mt-8 grid gap-6">
          {sections.map((section) => (
            <section key={section.heading} className="border-t border-ink/10 pt-5">
              <h2 className="text-xl font-black">{section.heading}</h2>
              <p className="mt-3 leading-8 text-ink/76">{section.body}</p>
            </section>
          ))}
        </div>
        {children ? <div className="mt-8">{children}</div> : null}
        <nav className="mt-10 grid gap-3 rounded-xl border border-ink/10 bg-white p-4 shadow-line sm:grid-cols-3" aria-label="次に見るページ">
          <Link className="rounded-lg border border-ink/10 px-4 py-3 text-sm font-black text-primary hover:border-leaf" href="/">
            トップへ戻る
          </Link>
          <Link className="rounded-lg border border-ink/10 px-4 py-3 text-sm font-black text-primary hover:border-leaf" href="/#roadmap">
            ロードマップを見る
          </Link>
          <Link className="rounded-lg border border-ink/10 px-4 py-3 text-sm font-black text-primary hover:border-leaf" href="/guide/generative-ai/">
            ガイド記事を読む
          </Link>
        </nav>
      </article>
    </main>
  );
}
