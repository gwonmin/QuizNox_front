import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ComparisonRow {
  label: string;
  left: ReactNode;
  right: ReactNode;
}

interface ComparisonGridProps {
  leftTitle: string;
  rightTitle: string;
  rows: ComparisonRow[];
  className?: string;
}

export function ComparisonGrid({
  leftTitle,
  rightTitle,
  rows,
  className,
}: ComparisonGridProps) {
  if (rows.length === 0) return null;

  return (
    <section
      className={cn(
        "my-5 grid gap-3 rounded-lg border border-border/70 bg-muted/40 p-3 text-xs md:grid-cols-[minmax(0,1.2fr)_minmax(0,1.2fr)]",
        className
      )}
    >
      <header className="md:col-span-2 mb-1 flex items-baseline justify-between">
        <p className="text-[11px] font-semibold text-muted-foreground">
          비교 요약
        </p>
      </header>
      <div className="space-y-1">
        <p className="text-xs font-semibold text-foreground mb-1">{leftTitle}</p>
        <ul className="space-y-1">
          {rows.map((row) => (
            <li key={row.label} className="flex flex-col">
              <span className="text-[11px] font-medium text-muted-foreground">
                {row.label}
              </span>
              <span className="text-[11px] text-foreground/90">{row.left}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="space-y-1">
        <p className="text-xs font-semibold text-foreground mb-1">{rightTitle}</p>
        <ul className="space-y-1">
          {rows.map((row) => (
            <li key={row.label} className="flex flex-col">
              <span className="text-[11px] font-medium text-muted-foreground">
                {row.label}
              </span>
              <span className="text-[11px] text-foreground/90">{row.right}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

