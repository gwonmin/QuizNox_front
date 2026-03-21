import { useEffect, useRef } from "react";
import { useHandbookAsyncHold } from "@/contexts/HandbookContentReadyContext";
import { useDiagramLinks } from "@/contexts/DiagramLinksContext";
import { injectDiagramLinks } from "@/utils/injectDiagramLinks";

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
  const initializedRef = useRef(false);
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
          const mermaid = await import("mermaid");
          if (cancelled) {
            return;
          }

          if (!initializedRef.current) {
            mermaid.default.initialize({
              startOnLoad: false,
              theme: "default",
              securityLevel: "loose",
            });
            initializedRef.current = true;
          }

          const uniqueId = `core-cs-mermaid-${diagramIndex}-${Date.now().toString(36)}`;
          const node = document.createElement("div");
          node.className = "mermaid";
          node.id = uniqueId;
          node.textContent = code;

          el.innerHTML = "";
          el.appendChild(node);

          try {
            await mermaid.default.run({ nodes: [node] });
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
    <div
      ref={wrapperRef}
      className={className ?? "my-4 mermaid-wrapper"}
      role="img"
      aria-label="다이어그램"
    />
  );
}
