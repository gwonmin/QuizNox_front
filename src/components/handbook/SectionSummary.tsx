import type { ReactNode } from "react";

interface SectionSummaryProps {
  title?: string;
  lead?: string;
  bullets?: ReactNode[];
}

export function SectionSummary({ title, lead, bullets }: SectionSummaryProps) {
  return (
    <section className="mb-6 rounded-lg border border-border/60 bg-muted/40 px-4 py-3">
      {title && (
        <h2 className="text-sm font-semibold text-foreground mb-1.5">
          {title}
        </h2>
      )}
      {lead && (
        <p className="text-xs text-muted-foreground mb-2 leading-relaxed">
          {lead}
        </p>
      )}
      {bullets && bullets.length > 0 && (
        <ul className="list-disc list-inside space-y-0.5 text-xs text-muted-foreground">
          {bullets.map((item, idx) => (
            // eslint-disable-next-line react/no-array-index-key
            <li key={idx}>{item}</li>
          ))}
        </ul>
      )}
    </section>
  );
}

