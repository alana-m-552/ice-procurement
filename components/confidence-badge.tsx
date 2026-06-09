import { cn } from "@/lib/utils";
import { CONFIDENCE_LABEL, CONFIDENCE_FULL_LABEL } from "@/lib/format";

const STYLES: Record<string, string> = {
  high: "bg-ink text-paper",
  medium: "bg-[#8b5e00] text-paper",
  low: "bg-[#6b6000] text-paper",
};

export function ConfidenceBadge({
  confidence,
  full = false,
  className,
}: {
  confidence: string | null | undefined;
  full?: boolean;
  className?: string;
}) {
  if (!confidence || !STYLES[confidence]) return null;
  const label = full
    ? CONFIDENCE_FULL_LABEL[confidence]
    : CONFIDENCE_LABEL[confidence];
  return (
    <span
      className={cn(
        "inline-block rounded-[2px] px-1.5 py-0.5 text-[8px] font-medium uppercase tracking-[0.08em]",
        STYLES[confidence],
        className
      )}
    >
      {label}
    </span>
  );
}
