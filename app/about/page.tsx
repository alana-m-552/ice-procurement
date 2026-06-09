import Link from "next/link";

export const metadata = {
  title: "About — ICE Procurement",
  description:
    "ICE Procurement is an independent public accountability project. Not affiliated with the U.S. government.",
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl">
      <header className="bg-ink px-5 py-7 text-paper">
        <h1 className="font-serif text-3xl font-bold">About</h1>
      </header>

      <div className="px-5 py-8">
        <div className="space-y-4 text-[14px] leading-relaxed text-foreground">
          <p>
            ICE Procurement is an independent public accountability project. It
            is not affiliated with the U.S. government, the Department of
            Homeland Security, or any advocacy organization. All data is sourced
            from USASpending.gov, a public government database. Classifications
            and analysis are the work of the project&apos;s researchers and are
            documented in full on the methodology page.
          </p>
          <p>
            The goal of this project is to make federal procurement data
            accessible to journalists, researchers, lawyers, and members of the
            public who do not have the technical background to work directly with
            raw government datasets.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/contracts"
            className="rounded-sm bg-ink px-4 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-ink/90"
          >
            Browse procurement actions
          </Link>
          <Link
            href="/methodology"
            className="rounded-sm border border-ink px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-paper-alt"
          >
            Read the methodology
          </Link>
        </div>
      </div>
    </main>
  );
}
