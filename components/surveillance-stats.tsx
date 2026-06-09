"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import type { StatsResponse } from "@/lib/types";
import { formatNumber, formatObligated } from "@/lib/format";

const TIERS = [
  { key: "high", label: "High confidence", note: "Named surveillance vendors" },
  { key: "medium", label: "Medium confidence", note: "Surveillance-associated PSC codes" },
  { key: "low", label: "Low confidence", note: "Keyword matches in descriptions" },
] as const;

export function SurveillanceStats() {
  const { data, error } = useSWR<StatsResponse>("/api/stats", fetcher, {
    refreshInterval: 60_000,
  });

  return (
    <div className="grid grid-cols-1 border-b-2 border-ink sm:grid-cols-3">
      {TIERS.map((tier, i) => {
        const tierData = data?.surveillance.breakdown[tier.key];
        const ok = data && !error && tierData;
        return (
          <div
            key={tier.key}
            className={`border-b border-border px-5 py-4 sm:border-b-0 ${
              i < 2 ? "sm:border-r" : ""
            }`}
          >
            <div className="text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
              {tier.label}
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-serif text-2xl font-bold text-ink">
                {ok ? formatNumber(tierData.count) : "Unavailable"}
              </span>
              <span className="text-[11px] text-muted-foreground">actions</span>
            </div>
            <div className="mt-0.5 font-mono text-sm font-bold text-amber tabular">
              {ok ? formatObligated(tierData.obligated) : "—"}
            </div>
            <div className="mt-0.5 text-[10px] italic text-muted-foreground">
              {tier.note}
            </div>
          </div>
        );
      })}
    </div>
  );
}
