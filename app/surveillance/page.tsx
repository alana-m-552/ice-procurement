import { Suspense } from "react";
import Link from "next/link";
import { ContractsExplorer } from "@/components/contracts-explorer";
import { SurveillanceStats } from "@/components/surveillance-stats";

export const metadata = {
  title: "Surveillance-flagged actions — ICE Procurement",
  description:
    "96 ICE procurement actions flagged as potentially related to surveillance technology, classified by confidence level.",
};

export default function SurveillancePage() {
  return (
    <main className="mx-auto max-w-6xl">
      <header className="bg-ink px-5 py-6 text-paper">
        <h1 className="font-serif text-2xl font-bold">
          Surveillance-flagged procurement actions
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-neutral-400">
          96 procurement actions flagged as potentially related to surveillance
          technology, classified into three confidence tiers. Sorted by net
          obligated amount. This classification is a research methodology, not a
          legal determination.
        </p>
      </header>

      <Suspense fallback={null}>
        <SurveillanceStats />
      </Suspense>

      <p className="border-b border-border bg-paper-alt px-5 py-3 text-[11px] italic leading-relaxed text-muted-foreground">
        Surveillance classification is a research methodology, not a legal
        determination. Procurement actions are flagged using vendor name
        matching (high confidence), Product Service Codes associated with
        surveillance equipment (medium confidence), and keyword analysis on
        transaction descriptions (low confidence). All classifications were
        subject to manual review.{" "}
        <Link
          href="/methodology"
          className="font-medium text-amber underline underline-offset-2 not-italic"
        >
          See full methodology
        </Link>{" "}
        for vendor list, PSC codes used, keywords applied, and documented
        exclusions.
      </p>

      <Suspense fallback={null}>
        <ContractsExplorer
          forceSurveillance
          defaultSort="federal_action_obligation"
          defaultOrder="desc"
        />
      </Suspense>
    </main>
  );
}
