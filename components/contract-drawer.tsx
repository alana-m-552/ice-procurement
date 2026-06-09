"use client";

import { useEffect, useRef } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import type { Contract } from "@/lib/types";
import { formatObligated, formatDate } from "@/lib/format";
import { ConfidenceBadge } from "@/components/confidence-badge";

export function ContractDrawer({
  awardId,
  onClose,
}: {
  awardId: string | null;
  onClose: () => void;
}) {
  const open = Boolean(awardId);
  const panelRef = useRef<HTMLDivElement>(null);

  const { data, error, isLoading } = useSWR<Contract>(
    awardId ? `/api/contracts/${encodeURIComponent(awardId)}` : null,
    fetcher
  );

  // Escape to close + focus trap
  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;

    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === "Tab" && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button, input, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    // focus the panel on open
    const t = setTimeout(() => panelRef.current?.focus(), 0);

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
      clearTimeout(t);
      previouslyFocused?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex"
      role="dialog"
      aria-modal="true"
      aria-label="Procurement action detail"
    >
      <button
        type="button"
        aria-label="Close detail"
        onClick={onClose}
        className="flex-1 cursor-default bg-black/30"
        tabIndex={-1}
      />
      <div
        ref={panelRef}
        tabIndex={-1}
        className="ml-auto h-full w-full max-w-md overflow-y-auto border-l-2 border-ink bg-paper p-5 shadow-xl outline-none sm:w-[26rem]"
      >
        <div className="mb-2 flex items-start justify-between gap-4">
          {data?.surveillance_confidence ? (
            <ConfidenceBadge confidence={data.surveillance_confidence} full />
          ) : (
            <span />
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="-mt-1 text-2xl leading-none text-muted-foreground transition-colors hover:text-ink"
          >
            ×
          </button>
        </div>

        {error ? (
          <p className="py-6 text-sm text-destructive">
            {error.message === "Not found"
              ? "This procurement action could not be found."
              : "Unable to load this record right now."}
          </p>
        ) : isLoading || !data ? (
          <DrawerSkeleton />
        ) : (
          <>
            <h2 className="font-serif text-xl font-bold leading-tight">
              {data.recipient_name || "Unknown vendor"}
            </h2>

            <div className="my-3 h-px bg-border" />

            <Field label="Amount obligated">
              <span className="font-serif text-2xl font-bold text-amber tabular">
                {formatObligated(data.federal_action_obligation)}
              </span>
            </Field>

            <Field label="Award type">{data.award_type || "—"}</Field>
            <Field label="Action type">
              {data.action_type || "—"}
              {data.action_type_description &&
              data.action_type_description !== data.action_type ? (
                <span className="block text-[11px] text-muted-foreground">
                  {data.action_type_description}
                </span>
              ) : null}
            </Field>

            <Field label="Contract ID">
              <span className="font-mono text-[11px]">
                {data.award_id_piid}
              </span>
            </Field>

            <Field label="PSC code">
              <span className="font-mono text-[11px]">
                {data.product_or_service_code || "—"}
              </span>
              {data.product_or_service_code_description ? (
                <span className="ml-1">
                  — {data.product_or_service_code_description}
                </span>
              ) : null}
            </Field>

            <Field label="NAICS code">
              <span className="font-mono text-[11px]">
                {data.naics_code || "—"}
              </span>
              {data.naics_description ? (
                <span className="ml-1">— {data.naics_description}</span>
              ) : null}
            </Field>

            <Field label="Transaction description">
              <span className="leading-relaxed">
                {data.transaction_description || "—"}
              </span>
            </Field>

            <Field label="Period of performance">
              {formatDate(data.period_of_performance_start_date)} →{" "}
              {formatDate(data.period_of_performance_current_end_date)}
            </Field>

            <Field label="Place of performance">
              {[
                data.primary_place_of_performance_city_name,
                data.primary_place_of_performance_state_code,
              ]
                .filter(Boolean)
                .join(", ") || "—"}
            </Field>

            <Field label="Awarding office">
              {data.awarding_office_name || "—"}
            </Field>

            <div className="my-3 h-px bg-border" />

            <p className="text-[10px] italic leading-relaxed text-muted-foreground">
              federal_action_obligation reflects funds obligated in this
              transaction only. potential_total_value_of_award (contract
              ceiling) may differ significantly and is not displayed to avoid
              misrepresentation of actual committed spending.
            </p>

            <a
              href={`https://www.usaspending.gov/award/${encodeURIComponent(
                data.award_id_piid
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-xs font-medium text-amber underline underline-offset-2"
            >
              View on USASpending.gov ↗
            </a>
          </>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-2.5">
      <div className="mb-0.5 text-[8px] uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </div>
      <div className="text-[12px] leading-relaxed text-foreground">
        {children}
      </div>
    </div>
  );
}

function DrawerSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-6 w-3/4 animate-pulse rounded bg-paper-alt" />
      <div className="h-8 w-1/2 animate-pulse rounded bg-paper-alt" />
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="space-y-1.5">
          <div className="h-2 w-20 animate-pulse rounded bg-paper-alt" />
          <div className="h-3 w-full animate-pulse rounded bg-paper-alt" />
        </div>
      ))}
    </div>
  );
}
