"use client";

import { useState } from "react";

export function Pagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  const [jump, setJump] = useState("");

  function go(target: number) {
    const clamped = Math.min(Math.max(1, target), totalPages);
    onPageChange(clamped);
  }

  function handleJump(e: React.FormEvent) {
    e.preventDefault();
    const target = parseInt(jump, 10);
    if (Number.isFinite(target)) go(target);
    setJump("");
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-paper-alt px-5 py-3">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => go(page - 1)}
          disabled={page <= 1}
          className="border border-input bg-paper px-3 py-1.5 text-[11px] text-foreground transition-colors hover:bg-paper disabled:cursor-not-allowed disabled:opacity-40"
        >
          ← Previous
        </button>
        <button
          type="button"
          onClick={() => go(page + 1)}
          disabled={page >= totalPages}
          className="border border-input bg-paper px-3 py-1.5 text-[11px] text-foreground transition-colors hover:bg-paper disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next →
        </button>
      </div>

      <span className="text-[11px] text-muted-foreground">
        Page {page.toLocaleString()} of {totalPages.toLocaleString()}
      </span>

      <form onSubmit={handleJump} className="flex items-center gap-1.5">
        <label htmlFor="jump-page" className="text-[10px] text-muted-foreground">
          Jump to
        </label>
        <input
          id="jump-page"
          type="number"
          min={1}
          max={totalPages}
          value={jump}
          onChange={(e) => setJump(e.target.value)}
          className="w-16 border border-input bg-paper px-2 py-1 text-[11px] focus:outline-none focus:ring-1 focus:ring-amber"
        />
        <button
          type="submit"
          className="border border-ink bg-ink px-2.5 py-1 text-[11px] text-paper"
        >
          Go
        </button>
      </form>
    </div>
  );
}
