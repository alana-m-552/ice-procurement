"use client";

import { useRef } from "react";
import useSWR from "swr";
import {
  useQueryState,
  useQueryStates,
  parseAsInteger,
  parseAsString,
  parseAsBoolean,
  parseAsArrayOf,
} from "nuqs";
import { fetcher } from "@/lib/fetcher";
import type { ContractsResponse } from "@/lib/types";
import { FilterBar, type FilterValues } from "@/components/filter-bar";
import { ContractsTable } from "@/components/contracts-table";
import { Pagination } from "@/components/pagination";
import { ContractDrawer } from "@/components/contract-drawer";
import { formatNumber } from "@/lib/format";

const LIMIT = 50;

export function ContractsExplorer({
  forceSurveillance = false,
  defaultSort = "action_date",
  defaultOrder = "desc",
}: {
  forceSurveillance?: boolean;
  defaultSort?: string;
  defaultOrder?: "asc" | "desc";
}) {
  const tableTopRef = useRef<HTMLDivElement>(null);

  // URL state — single source of truth for all filters
  const [filters, setFilters] = useQueryStates(
    {
      search: parseAsString.withDefault(""),
      state: parseAsString.withDefault(""),
      award_type: parseAsString.withDefault(""),
      action_type: parseAsString.withDefault(""),
      surveillance_only: parseAsBoolean.withDefault(false),
      confidence: parseAsArrayOf(parseAsString).withDefault([]),
      sort: parseAsString.withDefault(defaultSort),
      order: parseAsString.withDefault(defaultOrder),
    },
    { history: "push" }
  );

  const [page, setPage] = useQueryState(
    "page",
    parseAsInteger.withDefault(1).withOptions({ history: "push" })
  );

  const [selected, setSelected] = useQueryState("id", parseAsString);

  // distinct states for dropdown
  const { data: statesData } = useSWR<{ states: string[] }>(
    "/api/states",
    fetcher
  );

  // build query string
  const surveillanceOnly = forceSurveillance || filters.surveillance_only;
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("limit", String(LIMIT));
  params.set("sort", filters.sort);
  params.set("order", filters.order);
  if (filters.search) params.set("search", filters.search);
  if (filters.state) params.set("state", filters.state);
  if (filters.award_type) params.set("award_type", filters.award_type);
  if (filters.action_type) params.set("action_type", filters.action_type);
  if (surveillanceOnly) params.set("surveillance_only", "true");
  if (filters.confidence.length > 0)
    params.set("confidence", filters.confidence.join(","));

  const { data, error, isLoading } = useSWR<ContractsResponse>(
    `/api/contracts?${params.toString()}`,
    fetcher,
    { keepPreviousData: true }
  );

  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;
  const showing = data?.data.length ?? 0;

  const rowCountLabel = error
    ? "Unable to load count"
    : data
      ? `Showing ${formatNumber(showing)} of ${formatNumber(total)} actions`
      : "Loading…";

  const filterValues: FilterValues = {
    search: filters.search,
    state: filters.state,
    awardType: filters.award_type,
    actionType: filters.action_type,
    surveillanceOnly: filters.surveillance_only,
    confidence: filters.confidence,
  };

  function handleFilterChange(patch: Partial<FilterValues>) {
    setFilters({
      ...(patch.search !== undefined ? { search: patch.search } : {}),
      ...(patch.state !== undefined ? { state: patch.state } : {}),
      ...(patch.awardType !== undefined ? { award_type: patch.awardType } : {}),
      ...(patch.actionType !== undefined
        ? { action_type: patch.actionType }
        : {}),
      ...(patch.surveillanceOnly !== undefined
        ? { surveillance_only: patch.surveillanceOnly }
        : {}),
      ...(patch.confidence !== undefined
        ? { confidence: patch.confidence }
        : {}),
    });
    // any filter change resets to page 1
    setPage(1);
  }

  function handlePageChange(next: number) {
    setPage(next);
    requestAnimationFrame(() => {
      tableTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  return (
    <>
      <div ref={tableTopRef} />
      <FilterBar
        values={filterValues}
        states={statesData?.states ?? []}
        rowCountLabel={rowCountLabel}
        lockSurveillance={forceSurveillance}
        alwaysShowConfidence={forceSurveillance}
        onChange={handleFilterChange}
      />

      {error ? (
        <p className="border-b border-border bg-paper px-5 py-6 text-sm text-destructive">
          Unable to load procurement actions right now. Please try again.
        </p>
      ) : (
        <ContractsTable
          rows={data?.data ?? []}
          loading={isLoading && !data}
          limit={LIMIT}
          activeId={selected}
          onRowClick={(id) => setSelected(id)}
        />
      )}

      {data && totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}

      <ContractDrawer awardId={selected} onClose={() => setSelected(null)} />
    </>
  );
}
