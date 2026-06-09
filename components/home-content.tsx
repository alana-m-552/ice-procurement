"use client";

import useSWR from "swr";
import Link from "next/link";
import { fetcher } from "@/lib/fetcher";
import type { StatsResponse, ContractsResponse } from "@/lib/types";
import {
  formatNumber,
  formatCompact,
  formatObligated,
  truncate,
} from "@/lib/format";
import { ConfidenceBadge } from "@/components/confidence-badge";

export function HomeContent() {
  const { data: stats, error: statsError } = useSWR<StatsResponse>(
    "/api/stats",
    fetcher,
    { refreshInterval: 60_000, revalidateOnFocus: true }
  );

  const { data: featured, error: featuredError } = useSWR<ContractsResponse>(
    "/api/contracts?surveillance_only=true&sort=federal_action_obligation&order=desc&limit=5",
    fetcher
  );

  const hasStats = stats && !statsError;
  const surveillanceCount = hasStats ? stats.surveillance.total_count : null;

  return (
    <main className="mx-auto max-w-6xl">
      {/* Hero */}
      <section className="bg-ink px-5 pb-0 pt-8 text-paper">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <h1 className="text-balance font-serif text-3xl font-bold leading-tight sm:text-4xl">
              Who is ICE paying, and for what?
            </h1>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-neutral-400">
              A searchable record of every procurement action awarded by U.S.
              Immigration and Customs Enforcement from June 2025 to June 2026,
              sourced from USASpending.gov.
            </p>
          </div>
          <div className="shrink-0 pb-1 text-left sm:text-right">
            <div className="font-serif text-5xl font-bold leading-none text-amber-bright">
              {surveillanceCount === null
                ? "—"
                : formatNumber(surveillanceCount)}
            </div>
            <div className="mt-1 text-[9px] uppercase tracking-[0.15em] text-neutral-500">
              Surveillance-flagged actions
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="grid grid-cols-1 border-y-2 border-ink sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          value={hasStats ? formatNumber(stats.total_procurement_actions) : "Unavailable"}
          label="Procurement actions"
          note="Delivery orders, purchase orders, BPA calls, definitive contracts"
        />
        <StatCard
          value={hasStats ? formatCompact(stats.total_obligated_all) : "Unavailable"}
          label="Net obligated"
          note="federal_action_obligation · includes de-obligations"
        />
        <StatCard
          value={hasStats ? formatNumber(stats.surveillance.total_count) : "Unavailable"}
          label="Surveillance-flagged"
          note="$226.9M obligated · 14 states"
          amber
        />
        <StatCard
          value={hasStats ? formatNumber(stats.states_with_surveillance) : "Unavailable"}
          label="States with surveillance"
          note="Place of performance"
          last
        />
      </section>

      {/* Caveat bar */}
      <p className="border-b border-border bg-paper-alt px-5 py-2.5 text-[11px] italic leading-relaxed text-muted-foreground">
        Data reflects federal_action_obligation — funds committed in each
        transaction, including modifications and de-obligations. This figure
        represents net obligated amounts, not disbursed payments and not
        potential contract ceiling values. Source: USASpending.gov · Downloaded
        June 2026.
      </p>

      {/* Featured surveillance actions */}
      <section className="px-5 py-6">
        <h2 className="mb-3 border-b border-border pb-2 text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
          Top surveillance-flagged actions by obligated amount
        </h2>
        {featuredError ? (
          <p className="py-4 text-sm text-destructive">
            Unable to load featured actions right now.
          </p>
        ) : !featured ? (
          <FeaturedSkeleton />
        ) : (
          <ul>
            {featured.data.map((c) => (
              <li
                key={c.award_id_piid}
                className="grid grid-cols-1 gap-2 border-b border-border py-3 last:border-b-0 sm:grid-cols-[1fr_auto] sm:items-start sm:gap-6"
              >
                <div>
                  <div className="font-serif text-sm font-bold">
                    {c.recipient_name || "Unknown vendor"}
                  </div>
                  <div className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">
                    {truncate(c.transaction_description, 160)}
                  </div>
                </div>
                <div className="text-left sm:text-right">
                  <div className="font-mono text-sm font-bold text-amber tabular">
                    {formatObligated(c.federal_action_obligation)}
                  </div>
                  <div className="mt-1">
                    <ConfidenceBadge confidence={c.surveillance_confidence} full />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* CTAs */}
      <section className="flex flex-col gap-3 px-5 pb-8 sm:flex-row">
        <Link
          href="/contracts"
          className="flex items-center justify-center rounded-sm bg-ink px-5 py-3 text-center text-sm font-medium text-paper transition-colors hover:bg-ink/90"
        >
          Browse all{" "}
          {hasStats ? formatNumber(stats.total_procurement_actions) : "3,438"}{" "}
          procurement actions
        </Link>
        <Link
          href="/surveillance"
          className="flex items-center justify-center rounded-sm border border-ink px-5 py-3 text-center text-sm font-medium text-ink transition-colors hover:bg-paper-alt"
        >
          View {hasStats ? formatNumber(stats.surveillance.total_count) : "96"}{" "}
          surveillance-flagged actions
        </Link>
      </section>

      {/* About + methodology explainers */}
      <section className="grid grid-cols-1 gap-8 border-t border-border px-5 py-8 lg:grid-cols-2">
        <div>
          <h2 className="mb-3 text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
            About this database
          </h2>
          <div className="space-y-3 text-[13px] leading-relaxed text-foreground">
            <p>
              This database contains procurement actions awarded by U.S.
              Immigration and Customs Enforcement (ICE) between June 2025 and
              June 2026, as reported to USASpending.gov — the official federal
              spending transparency platform maintained by the U.S. Treasury
              Department under the Digital Accountability and Transparency Act of
              2014 (DATA Act).
            </p>
            <p>
              The dataset includes four types of procurement instruments:
              delivery orders (task orders against existing umbrella contracts),
              purchase orders (direct purchases typically under simplified
              acquisition thresholds), Blanket Purchase Agreement calls (orders
              against pre-negotiated price lists), and definitive contracts
              (standalone negotiated agreements). Not every record represents a
              new contract awarded — many are modifications, funding additions,
              or administrative actions on existing awards.
            </p>
            <p>
              Dollar figures reflect federal_action_obligation: the amount of
              federal funds committed in each individual transaction. This
              differs from potential_total_value_of_award, which represents the
              maximum ceiling if all contract options are exercised and may be
              significantly higher.
            </p>
          </div>
        </div>
        <div>
          <h2 className="mb-3 text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
            The surveillance filter
          </h2>
          <div className="space-y-3 text-[13px] leading-relaxed text-foreground">
            <p>
              96 procurement actions in this dataset have been flagged as
              potentially related to surveillance technology using a three-tier
              classification system. This classification is a research
              methodology, not a legal determination. Contracts are classified
              at three confidence levels: High (named surveillance vendors
              confirmed through public reporting), Medium (Product Service Codes
              associated with surveillance equipment), and Low (keyword matches
              in transaction descriptions). The filter is conservative by design
              — it flags what the evidence supports and documents what it
              excludes. Vendors were manually reviewed; Tribalco LLC ($348M in
              radio equipment) was excluded after verification confirmed
              operational communications use rather than surveillance
              technology.
            </p>
            <Link
              href="/methodology"
              className="inline-block text-[13px] font-medium text-amber underline-offset-2 hover:underline"
            >
              Read the full methodology →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function StatCard({
  value,
  label,
  note,
  amber,
  last,
}: {
  value: string;
  label: string;
  note: string;
  amber?: boolean;
  last?: boolean;
}) {
  return (
    <div
      className={`border-b border-border px-4 py-3 sm:border-b-0 sm:border-r ${
        last ? "sm:border-r-0" : ""
      }`}
    >
      <div
        className={`font-serif text-2xl font-bold ${
          amber ? "text-amber" : "text-ink"
        } ${value === "Unavailable" ? "text-base text-muted-foreground" : ""}`}
      >
        {value}
      </div>
      <div className="mt-1 text-[9px] uppercase tracking-[0.1em] text-muted-foreground">
        {label}
      </div>
      <div className="mt-0.5 text-[9px] italic leading-snug text-muted-foreground/80">
        {note}
      </div>
    </div>
  );
}

function FeaturedSkeleton() {
  return (
    <ul>
      {Array.from({ length: 5 }).map((_, i) => (
        <li
          key={i}
          className="grid grid-cols-[1fr_auto] gap-6 border-b border-border py-3 last:border-b-0"
        >
          <div className="space-y-2">
            <div className="h-4 w-48 animate-pulse rounded bg-paper-alt" />
            <div className="h-3 w-full animate-pulse rounded bg-paper-alt" />
          </div>
          <div className="h-4 w-24 animate-pulse rounded bg-paper-alt" />
        </li>
      ))}
    </ul>
  );
}
