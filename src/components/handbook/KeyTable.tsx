import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface KeyTableProps {
  columns: string[];
  rows: ReactNode[][];
  className?: string;
}

export function KeyTable({ columns, rows, className }: KeyTableProps) {
  return (
    <div className={cn("my-5 max-w-full", className)}>
      {/* Mobile: stacked cards — avoid horizontal scroll */}
      <div className="space-y-3 md:hidden">
        {rows.map((row, rowIndex) => (
          // eslint-disable-next-line react/no-array-index-key
          <article
            key={rowIndex}
            className="rounded-xl border border-border/70 bg-card/40 px-3.5 py-3 shadow-sm"
          >
            <dl className="space-y-2.5">
              {columns.map((col, colIndex) => (
                // eslint-disable-next-line react/no-array-index-key
                <div key={colIndex} className="min-w-0">
                  <dt className="text-[0.6875rem] font-semibold uppercase tracking-wide text-muted-foreground">
                    {col}
                  </dt>
                  <dd className="mt-0.5 break-words text-sm leading-relaxed text-foreground/90">
                    {row[colIndex]}
                  </dd>
                </div>
              ))}
            </dl>
          </article>
        ))}
      </div>

      {/* md+: table */}
      <div className="hidden max-w-full overflow-x-auto md:block">
        <table className="w-full border-collapse overflow-hidden rounded-lg border border-border/60 text-sm">
          <thead className="bg-muted/80">
            <tr>
              {columns.map((col) => (
                <th
                  key={col}
                  className="border-b border-border/60 px-3.5 py-2.5 text-left text-xs font-semibold tracking-wide text-foreground"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              // eslint-disable-next-line react/no-array-index-key
              <tr
                key={rowIndex}
                className="odd:bg-background even:bg-muted/30 hover:bg-muted/50"
              >
                {row.map((cell, cellIndex) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <td
                    key={cellIndex}
                    className={cn(
                      "border-b border-border/40 px-3.5 py-2.5 align-top leading-relaxed text-muted-foreground",
                      cellIndex === 0 && "font-medium text-foreground",
                    )}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
