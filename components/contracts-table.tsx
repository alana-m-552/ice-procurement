"use client";

import type { Contract } from "@/lib/types";
import { formatObligated, formatDate, truncate } from "@/lib/format";
import { ConfidenceBadge } from "@/components/confidence-badge";

const GRID =
  "grid grid-cols-[88px_minmax(120px,1fr)_minmax(160px,1.6fr)_64px_110px_48px_72px]";

export function ContractsTable({
  rows,
  loading,
  limit,
  activeId,
  onRowClick,
}: {
  rows: Contract[];
  loading: boolean;
  limit: number;
  activeId: string | null;
  onRowClick: (id: string) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[700px]">
        {/* Header */}
        <div className={`${GRID} bg-ink`}>
          {[
            "Date",
            "Vendor",
            "Description",
            "PSC",
            "Obligated",
            "State",
            "Flag",
          ].map((h, i) => (
            <div
              key={h}
              className={`px-2 py-2 text-[8px] uppercase tracking-[0.1em] text-neutral-400 ${
                i === 4 ? "text-right" : i === 5 ? "text-center" : ""
              }`}
            >
              {h}
            </div>
          ))}
        </div>

        {/* Body */}
        {loading ? (
          <SkeletonRows count={limit > 20 ? 15 : limit} />
        ) : rows.length === 0 ? (
          <div className="border-b border-border bg-paper px-4 py-10 text-center text-sm text-muted-foreground">
            No procurement actions match these filters.
          </div>
        ) : (
          rows.map((c, idx) => {
            const active = c.contract_transaction_unique_key === activeId;
            return (
              <button
                type="button"
                key={c.contract_transaction_unique_key}
                onClick={() => onRowClick(c.contract_transaction_unique_key)}
                className={`${GRID} w-full border-b border-border text-left transition-colors hover:bg-[#fdf8ec] focus:outline-none focus-visible:ring-1 focus-visible:ring-amber ${
                  active
                    ? "bg-[#fdf8ec]"
                    : idx % 2 === 1
                      ? "bg-[#fdfaf2]"
                      : "bg-paper"
                }`}
              >
                <Cell className="font-mono text-[9px] text-muted-foreground">
                  {formatDate(c.action_date)}
                </Cell>
                <Cell className="truncate font-serif text-[11px] font-bold">
                  {truncate(c.recipient_name, 40)}
                </Cell>
                <Cell className="truncate text-[10px] text-foreground/70">
                  {truncate(c.transaction_description, 80)}
                </Cell>
                <Cell className="font-mono text-[9px] text-muted-foreground">
                  {c.product_or_service_code || "—"}
                </Cell>
                <Cell className="text-right font-mono text-[10px] font-bold text-amber tabular">
                  {formatObligated(c.federal_action_obligation)}
                </Cell>
                <Cell className="text-center font-mono text-[10px]">
                  {c.primary_place_of_performance_state_code || "—"}
                </Cell>
                <Cell>
                  {c.is_surveillance ? (
                    <ConfidenceBadge confidence={c.surveillance_confidence} />
                  ) : null}
                </Cell>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

function Cell({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`overflow-hidden px-2 py-2 ${className}`}>{children}</div>
  );
}

function SkeletonRows({ count }: { count: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`${GRID} border-b border-border ${
            i % 2 === 1 ? "bg-[#fdfaf2]" : "bg-paper"
          }`}
        >
          {Array.from({ length: 7 }).map((__, j) => (
            <div key={j} className="px-2 py-2.5">
              <div className="h-3 w-full animate-pulse rounded bg-paper-alt" />
            </div>
          ))}
        </div>
      ))}
    </>
  );
}
