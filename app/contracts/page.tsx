import { Suspense } from "react";
import { ContractsExplorer } from "@/components/contracts-explorer";

export const metadata = {
  title: "Browse procurement actions — ICE Procurement",
  description:
    "Search and filter every ICE procurement action awarded June 2025 to June 2026.",
};

export default function ContractsPage() {
  return (
    <main className="mx-auto max-w-6xl">
      <header className="bg-ink px-5 py-6 text-paper">
        <h1 className="font-serif text-2xl font-bold">
          All procurement actions
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-neutral-400">
          Below are the procurement actions awarded by U.S. Immigration and Customs
          Enforcement from June 2025 to June 2026. Search, filter, and click any
          row for more details on what ICE acquired, from whom, and how much it cost. 
          
          You may also filter for procurement actions flagged as potentially related to surveillance technology. Learn more about the surveillance classification tiers in the methodology section.
          
          All dollar figures are net obligated amounts (federal_action_obligation), including de-obligations.
        </p>
      </header>

      <Suspense fallback={null}>
        <ContractsExplorer />
      </Suspense>
    </main>
  );
}
