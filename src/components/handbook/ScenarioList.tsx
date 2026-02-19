import type { ReactNode } from "react";

interface ScenarioItem {
  title: string;
  description: ReactNode;
  badge?: string;
}

interface ScenarioListProps {
  items: ScenarioItem[];
}

export function ScenarioList({ items }: ScenarioListProps) {
  if (items.length === 0) return null;

  return (
    <section className="my-5 space-y-3">
      {items.map((item) => (
        <article
          key={item.title}
          className="rounded-lg border border-border/70 bg-background px-3 py-2 text-xs"
        >
          <header className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-foreground">{item.title}</h3>
            {item.badge && (
              <span className="ml-2 inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                {item.badge}
              </span>
            )}
          </header>
          <div className="text-muted-foreground leading-relaxed">
            {item.description}
          </div>
        </article>
      ))}
    </section>
  );
}

