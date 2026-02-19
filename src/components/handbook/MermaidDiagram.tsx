import { useEffect, useRef } from "react";

const RENDER_DELAY_MS = 200;

interface MermaidDiagramProps {
  code: string;
  className?: string;
}

export function MermaidDiagram({ code, className }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    const timer = setTimeout(async () => {
      const el = containerRef.current;
      if (!el || cancelled) return;

      try {
        const mermaid = await import("mermaid");
        if (cancelled) return;

        if (!initializedRef.current) {
          mermaid.default.initialize({
            startOnLoad: false,
            theme: "default",
            securityLevel: "loose",
          });
          initializedRef.current = true;
        }

        const uniqueId = `mdx-mermaid-${Date.now().toString(36)}-${Math.random()
          .toString(36)
          .slice(2, 8)}`;

        const node = document.createElement("div");
        node.className = "mermaid";
        node.id = uniqueId;
        node.textContent = code;

        el.innerHTML = "";
        el.appendChild(node);

        try {
          await mermaid.default.run({ nodes: [node] });
        } catch (err) {
          console.warn("MermaidDiagram render error:", err);
        }
      } catch (err) {
        if (!cancelled) {
          console.warn("MermaidDiagram: mermaid not available", err);
        }
      }
    }, RENDER_DELAY_MS);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [code]);

  return (
    <div
      ref={containerRef}
      className={className ?? "my-4 mermaid-wrapper"}
      aria-hidden="true"
    />
  );
}

