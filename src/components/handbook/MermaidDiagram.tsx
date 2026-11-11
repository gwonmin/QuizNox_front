import { useEffect, useRef } from "react";
import { useHandbookAsyncHold } from "@/contexts/HandbookContentReadyContext";
import { loadMermaid, renderMermaid } from "@/utils/loadMermaid";
import { cn } from "@/lib/utils";

const RENDER_DELAY_MS = 200;

interface MermaidDiagramProps {
  code: string;
  className?: string;
}

export function MermaidDiagram({ code, className }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { completeHold } = useHandbookAsyncHold([code]);

  useEffect(() => {
    let cancelled = false;

    const timer = setTimeout(async () => {
      try {
        const el = containerRef.current;
        if (!el || cancelled) {
          return;
        }

        try {
          const mermaid = await loadMermaid();
          if (cancelled) {
            return;
          }

          const node = document.createElement("div");
          node.className = "mermaid";

          el.innerHTML = "";
          el.appendChild(node);

          try {
            await renderMermaid(mermaid, node, code);
          } catch (err) {
            console.warn("MermaidDiagram render error:", err);
          }
        } catch (err) {
          if (!cancelled) {
            console.warn("MermaidDiagram: mermaid not available", err);
          }
        }
      } finally {
        if (!cancelled) {
          completeHold();
        }
      }
    }, RENDER_DELAY_MS);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [code, completeHold]);

  return (
    <div className={cn("my-5", className)}>
      <div
        ref={containerRef}
        className="mermaid-wrapper min-h-[8rem] rounded-xl border border-border/50 bg-muted/20 p-2 sm:p-3"
        role="img"
        aria-label="다이어그램"
      />
      <p className="mt-1.5 text-center text-[0.6875rem] text-muted-foreground md:hidden">
        좌우로 밀어 도식을 볼 수 있습니다
      </p>
    </div>
  );
}
