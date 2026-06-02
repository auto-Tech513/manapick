import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";

type PolicyPageProps = {
  title: string;
  lead: string;
  sections: {
    heading: string;
    body: string;
  }[];
};

export default function PolicyPage({ title, lead, sections }: PolicyPageProps) {
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
      </article>
    </main>
  );
}
