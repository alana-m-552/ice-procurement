import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-12 border-t-2 border-ink bg-paper-alt">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-6 text-[11px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-xl leading-relaxed">
          Independent public accountability project. Not affiliated with the
          U.S. government. All data sourced from{" "}
          <a
            href="https://www.usaspending.gov"
            className="text-amber underline-offset-2 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            USASpending.gov
          </a>
          {" · "}Downloaded June 2026.
        </p>
        <nav className="flex gap-4">
          <Link href="/methodology" className="hover:text-ink">
            Methodology
          </Link>
          <Link href="/about" className="hover:text-ink">
            About
          </Link>
        </nav>
      </div>
    </footer>
  );
}
