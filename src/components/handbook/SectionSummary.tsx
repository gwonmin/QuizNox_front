import type { ReactNode } from "react";

interface SectionSummaryProps {
  title?: string;
  lead?: ReactNode;
  bullets?: ReactNode[];
}

export function SectionSummary({ title, lead, bullets }: SectionSummaryProps) {
  return (
    <section className="mb-8 rounded-xl border border-border/70 bg-muted/30 px-4 py-4 sm:px-5 sm:py-5">
      {title && (
        <h2 className="mb-2 text-base font-semibold tracking-tight text-foreground sm:text-lg">
          {title}
        </h2>
      )}
      {lead && (
        <p className="text-sm leading-relaxed text-foreground/90 sm:text-[0.9375rem] sm:leading-7">
          {lead}
        </p>
      )}
      {bullets && bullets.length > 0 && (
        <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">
          {bullets.map((item, idx) => (
            // eslint-disable-next-line react/no-array-index-key
            <li key={idx} className="flex gap-2.5">
              <span
                aria-hidden
                className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/70"
              />
              <span className="min-w-0">{item}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
