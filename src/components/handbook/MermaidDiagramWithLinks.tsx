import { useEffect, useRef } from "react";
import { useHandbookAsyncHold } from "@/contexts/HandbookContentReadyContext";
import { useDiagramLinks } from "@/contexts/DiagramLinksContext";
import { injectDiagramLinks } from "@/utils/injectDiagramLinks";
import { loadMermaid, renderMermaid } from "@/utils/loadMermaid";
import { cn } from "@/lib/utils";

const RENDER_DELAY_MS = 200;

interface MermaidDiagramWithLinksProps {
  code: string;
  diagramIndex: number;
  className?: string;
}

export function MermaidDiagramWithLinks({
  code,
  diagramIndex,
  className,
}: MermaidDiagramWithLinksProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const ctx = useDiagramLinks();
  const { completeHold } = useHandbookAsyncHold([
    code,
    diagramIndex,
    ctx?.diagramLinks,
    ctx?.onDiagramLinkClick,
  ]);

  useEffect(() => {
    let cancelled = false;

    const timer = setTimeout(async () => {
      try {
        const el = wrapperRef.current;
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
            if (cancelled) {
              return;
            }
            if (ctx?.diagramLinks && Object.keys(ctx.diagramLinks).length > 0) {
              injectDiagramLinks(
                el,
                ctx.diagramLinks,
                ctx.onDiagramLinkClick,
                diagramIndex
              );
            }
          } catch (err) {
            console.warn("MermaidDiagramWithLinks render error:", err);
          }
        } catch (err) {
          if (!cancelled) {
            console.warn("MermaidDiagramWithLinks: mermaid not available", err);
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
  }, [code, completeHold, diagramIndex, ctx?.diagramLinks, ctx?.onDiagramLinkClick]);

  return (
    <div className={cn("my-5", className)}>
      <div
        ref={wrapperRef}
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
