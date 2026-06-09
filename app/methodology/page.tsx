export const metadata = {
  title: "Data & Methodology — ICE Procurement",
  description:
    "How this database was built, what the data is and is not, and how surveillance classifications were made.",
};

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-border py-7">
      <h2 className="mb-3 text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
        {label}
      </h2>
      <div className="space-y-3 text-[13px] leading-relaxed text-foreground">
        {children}
      </div>
    </section>
  );
}

export default function MethodologyPage() {
  return (
    <main className="mx-auto max-w-3xl">
      <header className="bg-ink px-5 py-7 text-paper">
        <h1 className="font-serif text-3xl font-bold">Data &amp; methodology</h1>
        <p className="mt-2 max-w-xl text-sm text-neutral-400">
          How this database was assembled, the limits of what it represents, and
          the full surveillance classification logic — including documented
          exclusions.
        </p>
      </header>

      <div className="px-5">
        <Section label="Data source">
          <p>
            All data in this database was downloaded from USASpending.gov, the
            official federal spending transparency platform maintained by the
            U.S. Department of the Treasury under the Digital Accountability and
            Transparency Act of 2014 (DATA Act). USASpending.gov aggregates
            procurement data submitted by federal agencies to government-wide
            systems including the Federal Procurement Data System (FPDS-NG).
          </p>
          <p>
            This dataset covers procurement actions where the awarding agency is
            U.S. Immigration and Customs Enforcement (ICE), a component of the
            Department of Homeland Security (DHS), with action dates between June
            2025 and June 2026. The data was downloaded in June 2026 and reflects
            the state of USASpending.gov at that time. USASpending.gov notes a
            90-day reporting delay for some contract data; recent transactions
            may be underreported.
          </p>
        </Section>

        <Section label="What this data is — and is not">
          <p>
            The 3,438 records in this database represent individual procurement
            transactions, not necessarily individual contracts. A single base
            contract may generate dozens of records as funding is added, options
            are exercised, or administrative modifications are made.
          </p>
          <p>
            The dataset includes four award types: delivery orders (task orders
            against an existing IDIQ or umbrella contract), purchase orders
            (direct simplified acquisitions, generally under $250,000), BPA calls
            (orders against a Blanket Purchase Agreement), and definitive
            contracts (standalone negotiated agreements).
          </p>
          <p>
            Action types further describe what each transaction represents.
            &apos;Funding only action&apos; adds money to an existing award.
            &apos;Exercise an option&apos; extends a contract into a
            pre-negotiated option period. &apos;Change order&apos; modifies scope
            or terms. Not every record represents new procurement activity.
          </p>
        </Section>

        <Section label="Dollar amounts">
          <p>
            This database displays federal_action_obligation — the amount of
            federal funds legally committed in each individual transaction. This
            is the standard measure used by USASpending.gov and the Office of
            Management and Budget.
          </p>
          <p>
            This differs from potential_total_value_of_award, which represents
            the maximum possible contract value if all options are exercised.
            That figure can be substantially higher and is not shown in primary
            displays to avoid misrepresentation of actual committed spending.
          </p>
          <p>
            The total net obligated figure of $6,637,254,967 includes
            de-obligations — negative transactions that reduce previously
            committed funds, typically during contract closeouts. The gross
            obligated figure (positive transactions only) is approximately
            $6,734,071,810.
          </p>
        </Section>

        <Section label="Surveillance classification">
          <p>
            96 procurement actions have been flagged as potentially related to
            surveillance technology using a three-tier classification system.
            This classification reflects research judgment and should not be
            construed as a legal determination about the nature or legality of
            any contract.
          </p>

          <div className="mt-2 space-y-4">
            <div className="border-l-2 border-ink bg-paper-alt p-3">
              <div className="text-[11px] font-bold uppercase tracking-wide text-ink">
                High confidence — 48 actions, $188,532,198 obligated
              </div>
              <p className="mt-1 text-[12px]">
                Vendor name match. Vendors: Palantir Technologies Inc., Axon
                Enterprise Inc., Cellebrite Inc., Clearview AI Inc., L3Harris
                Technologies Inc., LexisNexis Special Services Inc., Thomson
                Reuters Special Services LLC, Magnet Forensics LLC, BI2
                Technologies LLC, LiveView Technologies Inc., TechOps Specialty
                Vehicles LLC, Paragon Solutions (US) Inc.
              </p>
            </div>

            <div className="border-l-2 border-[#8b5e00] bg-paper-alt p-3">
              <div className="text-[11px] font-bold uppercase tracking-wide text-[#8b5e00]">
                Medium confidence — 18 actions, $31,723,005 obligated
              </div>
              <p className="mt-1 text-[12px]">PSC code match:</p>
              <ul className="mt-1 list-inside list-disc space-y-0.5 text-[12px]">
                <li>
                  5820 — Radio and Television Communication Equipment (excluding
                  Tribalco LLC — see documented exclusions)
                </li>
                <li>5836 — Video Recording and Reproducing Equipment</li>
                <li>
                  5865 — Electronic Countermeasures, Counter-Countermeasures and
                  Quick Reaction Capability Equipment
                </li>
                <li>5895 — Miscellaneous Communication Equipment</li>
              </ul>
            </div>

            <div className="border-l-2 border-[#6b6000] bg-paper-alt p-3">
              <div className="text-[11px] font-bold uppercase tracking-wide text-[#6b6000]">
                Low confidence — 30 actions, $6,607,317 obligated
              </div>
              <p className="mt-1 text-[12px]">
                Keyword match on transaction_description: biometric, facial
                recognition, license plate, drone, UAV, UAS, stingray, IMSI,
                geospatial, watchlist, body camera, bodycam, thermal imaging,
                intercept, OSINT, open source intelligence, location tracking,
                identity verification, GrayKey, mobile device extraction, cell
                site simulator, Griffeye.
              </p>
            </div>
          </div>
        </Section>

        <Section label="Documented exclusions">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-[12px]">
              <thead>
                <tr className="bg-ink text-left text-paper">
                  <th className="px-3 py-2 font-medium">Vendor</th>
                  <th className="px-3 py-2 font-medium">Amount</th>
                  <th className="px-3 py-2 font-medium">Reason for exclusion</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border align-top">
                  <td className="px-3 py-2 font-serif font-bold">Tribalco LLC</td>
                  <td className="px-3 py-2 font-mono text-amber">$348,149,617</td>
                  <td className="px-3 py-2 leading-relaxed">
                    PSC 5820. Manual review confirmed Motorola APX Next portable
                    two-way radios and batteries for field personnel. Operational
                    communications equipment, not surveillance technology.
                  </td>
                </tr>
                <tr className="border-b border-border align-top">
                  <td className="px-3 py-2 font-serif font-bold">
                    Motorola Solutions (StarCom21 contracts)
                  </td>
                  <td className="px-3 py-2 font-mono text-amber">$267,300</td>
                  <td className="px-3 py-2 leading-relaxed">
                    StarCom21 radio network infrastructure for field
                    communications. Radio network, not surveillance.
                  </td>
                </tr>
                <tr className="align-top">
                  <td className="px-3 py-2 font-serif font-bold">
                    Paragon Professional Services LLC
                  </td>
                  <td className="px-3 py-2 font-mono text-muted-foreground">
                    Multiple
                  </td>
                  <td className="px-3 py-2 leading-relaxed">
                    Different legal entity from Paragon Solutions (US) Inc.
                    Provides detainee transportation and guard services.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="italic text-muted-foreground">
            Documenting exclusions is as important as documenting inclusions. The
            surveillance filter is conservative and transparent about its limits.
          </p>
        </Section>

        <Section label="Limitations">
          <p>
            This classification system has known limitations. It may undercount
            surveillance procurement where contract descriptions are vague, use
            indirect language, or are partially redacted — a documented practice
            in sensitive law enforcement technology procurement. It may overcount
            where PSC codes or keywords appear in non-surveillance contexts not
            identified during manual review. The low confidence tier should be
            treated as indicative rather than definitive. Users conducting
            research or legal analysis should verify individual records against
            primary sources on USASpending.gov.
          </p>
        </Section>

        <Section label="Source and reproducibility">
          <p>
            The underlying dataset is available for download from
            USASpending.gov using the Advanced Search tool, filtering by awarding
            agency (ICE) and date range. The classification logic, SQL queries
            used to flag and correct records, and the full list of documented
            exclusions are available on request. All dollar figures are sourced
            directly from USASpending.gov&apos;s federal_action_obligation field
            and have not been independently verified against agency financial
            statements or Treasury disbursement records.
          </p>
        </Section>
      </div>
    </main>
  );
}
