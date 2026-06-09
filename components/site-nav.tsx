"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/contracts", label: "Browse" },
  { href: "/surveillance", label: "Surveillance" },
  { href: "/methodology", label: "Data & methodology" },
  { href: "/about", label: "About" },
];

export function SiteNav() {
  const pathname = usePathname();

  return (
    <header className="bg-ink text-paper">
      <nav className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <Link href="/" className="flex flex-col leading-none">
          <span className="font-serif text-xl font-bold tracking-tight text-paper">
            ICE Procurement
          </span>
          <span className="mt-0.5 text-[9px] uppercase tracking-[0.15em] text-neutral-400">
            A public accountability project
          </span>
        </Link>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          {LINKS.map((link) => {
            const active =
              pathname === link.href ||
              (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-xs tracking-wide text-neutral-400 transition-colors hover:text-paper",
                  active &&
                    "border-b border-amber pb-0.5 text-paper"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
