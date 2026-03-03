import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface KeyTableProps {
  columns: string[];
  rows: ReactNode[][];
  className?: string;
}

export function KeyTable({ columns, rows, className }: KeyTableProps) {
  return (
    <div className={cn("my-4 overflow-x-auto", className)}>
      <table className="max-w-full text-xs border-collapse border border-border/60 rounded-md overflow-hidden">
        <thead className="bg-muted">
          <tr>
            {columns.map((col) => (
              <th
                key={col}
                className="border border-border/60 px-3 py-1.5 text-left font-semibold text-foreground whitespace-nowrap"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            // eslint-disable-next-line react/no-array-index-key
            <tr key={rowIndex} className="odd:bg-background even:bg-muted/40">
              {row.map((cell, cellIndex) => (
                // eslint-disable-next-line react/no-array-index-key
                <td
                  key={cellIndex}
                  className="border border-border/60 px-3 py-1.5 align-top text-muted-foreground"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

