import { useEffect, useRef } from "react";
import { useHandbookAsyncHold } from "@/contexts/HandbookContentReadyContext";
import { loadMermaid, renderMermaid } from "@/utils/loadMermaid";

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
    <div
      ref={containerRef}
      className={className ?? "my-4 mermaid-wrapper"}
      role="img"
      aria-label="다이어그램"
    />
  );
}
