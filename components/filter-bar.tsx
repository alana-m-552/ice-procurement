"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const AWARD_TYPES = [
  "Delivery Order",
  "Purchase Order",
  "BPA Call",
  "Definitive Contract",
];

const ACTION_TYPES = [
  "Funding Only Action",
  "Exercise an Option",
  "Change Order",
  "Supplemental Agreement for Work Within Scope",
  "Other Administrative Action",
  "Terminate for Convenience (Complete or Partial)",
];

const CONFIDENCE_OPTIONS: { value: string; label: string; cls: string }[] = [
  { value: "high", label: "High", cls: "bg-ink text-paper border-ink" },
  { value: "medium", label: "Med", cls: "bg-[#8b5e00] text-paper border-[#8b5e00]" },
  { value: "low", label: "Low", cls: "bg-[#6b6000] text-paper border-[#6b6000]" },
];

const selectCls =
  "border border-input bg-paper px-2 py-1.5 text-[11px] text-foreground focus:outline-none focus:ring-1 focus:ring-amber";

export interface FilterValues {
  search: string;
  state: string;
  awardType: string;
  actionType: string;
  surveillanceOnly: boolean;
  confidence: string[];
}

export function FilterBar({
  values,
  states,
  rowCountLabel,
  lockSurveillance = false,
  alwaysShowConfidence = false,
  onChange,
}: {
  values: FilterValues;
  states: string[];
  rowCountLabel: string;
  lockSurveillance?: boolean;
  alwaysShowConfidence?: boolean;
  onChange: (patch: Partial<FilterValues>) => void;
}) {
  // local search state for debouncing
  const [searchInput, setSearchInput] = useState(values.search);

  // keep local input in sync if URL changes externally (e.g. back button)
  useEffect(() => {
    setSearchInput(values.search);
  }, [values.search]);

  // debounce 300ms before pushing to URL
  useEffect(() => {
    const handle = setTimeout(() => {
      if (searchInput !== values.search) {
        onChange({ search: searchInput });
      }
    }, 300);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  const showConfidence = alwaysShowConfidence || values.surveillanceOnly;

  function toggleConfidence(value: string) {
    const set = new Set(values.confidence);
    if (set.has(value)) set.delete(value);
    else set.add(value);
    onChange({ confidence: Array.from(set) });
  }

  return (
    <div className="flex flex-wrap items-center gap-2 border-y border-border bg-paper-alt px-5 py-3">
      <input
        type="search"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder="Search vendors, descriptions..."
        aria-label="Search vendors and descriptions"
        className="min-w-40 flex-1 border border-input bg-paper px-2.5 py-1.5 font-serif text-[11px] italic text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-amber"
      />

      <select
        aria-label="Filter by state"
        className={selectCls}
        value={values.state}
        onChange={(e) => onChange({ state: e.target.value })}
      >
        <option value="">All states</option>
        {states.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <select
        aria-label="Filter by award type"
        className={selectCls}
        value={values.awardType}
        onChange={(e) => onChange({ awardType: e.target.value })}
      >
        <option value="">All award types</option>
        {AWARD_TYPES.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>

      <select
        aria-label="Filter by action type"
        className={selectCls}
        value={values.actionType}
        onChange={(e) => onChange({ actionType: e.target.value })}
      >
        <option value="">All action types</option>
        {ACTION_TYPES.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>

      {!lockSurveillance && (
        <button
          type="button"
          onClick={() => onChange({ surveillanceOnly: !values.surveillanceOnly })}
          aria-pressed={values.surveillanceOnly}
          className={cn(
            "border px-2.5 py-1.5 text-[10px] uppercase tracking-wide transition-colors",
            values.surveillanceOnly
              ? "border-ink bg-ink text-paper"
              : "border-input bg-paper text-foreground hover:bg-paper"
          )}
        >
          Surveillance only
        </button>
      )}

      {showConfidence && (
        <div className="flex gap-1" role="group" aria-label="Confidence level">
          {CONFIDENCE_OPTIONS.map((opt) => {
            const active = values.confidence.includes(opt.value);
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => toggleConfidence(opt.value)}
                aria-pressed={active}
                className={cn(
                  "border px-2 py-1 text-[9px] uppercase tracking-wide transition-colors",
                  active
                    ? opt.cls
                    : "border-input bg-paper text-muted-foreground hover:text-foreground"
                )}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      )}

      <span className="ml-auto text-[10px] italic text-muted-foreground">
        {rowCountLabel}
      </span>
    </div>
  );
}
