import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import "github-markdown-css/github-markdown.css";
import "../styles/markdown-theme.css";

const MERMAID_RENDER_DELAY_MS = 400;
const SVG_NS = "http://www.w3.org/2000/svg";
const XLINK_NS = "http://www.w3.org/1999/xlink";

interface MarkdownViewerProps {
  content: string;
  className?: string;
  /** 노드 텍스트 → 핸드북 경로. 있으면 다이어그램 노드 클릭 시 해당 문서로 이동 */
  diagramLinks?: Record<string, string>;
  /** diagramLinks 사용 시 클릭 시 SPA 이동용. (path, scrollHash) 전달 시 이전 버튼에서 해당 노드로 스크롤 가능 */
  onDiagramLinkClick?: (path: string, scrollHash?: string) => void;
}

function injectDiagramLinks(
  container: HTMLElement,
  links: Record<string, string>,
  onNavigate?: (path: string, scrollHash?: string) => void
): void {
  const wrappers = container.querySelectorAll(".mermaid-wrapper");
  wrappers.forEach((wrapper, wrapperIndex) => {
    const svg = wrapper.querySelector("svg");
    if (!svg) return;
    const nodes = svg.querySelectorAll("g.node");
    nodes.forEach((g) => {
      if (g.getAttribute("data-handbook-linked") === "true") return;
      const text = (g.textContent ?? "").trim();
      for (const [key, path] of Object.entries(links)) {
        if (text.includes(key)) {
          const slug = path.split("/").filter(Boolean).pop() ?? "";
          const nodeId = slug ? `doc-${wrapperIndex}-${slug}` : "";
          const a = document.createElementNS(SVG_NS, "a");
          a.setAttributeNS(XLINK_NS, "href", path);
          if (nodeId) a.setAttribute("id", nodeId);
          a.setAttribute("data-handbook-diagram-link", "true");
          a.setAttribute("class", "handbook-diagram-link");
          a.style.cursor = "pointer";
          g.parentNode?.insertBefore(a, g);
          a.appendChild(g);
          g.setAttribute("data-handbook-linked", "true");
          if (onNavigate) {
            const scrollHash = nodeId ? `#${nodeId}` : undefined;
            a.addEventListener("click", (e) => {
              e.preventDefault();
              onNavigate(path, scrollHash);
            });
          }
          break;
        }
      }
    });
  });
}

export function MarkdownViewer({
  content,
  className = "",
  diagramLinks,
  onDiagramLinkClick,
}: MarkdownViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mermaidInitialized = useRef(false);

  useEffect(() => {
    let cancelled = false;

    const timer = setTimeout(async () => {
      const container = containerRef.current;
      if (!container || cancelled) return;

      try {
        const mermaid = await import("mermaid");
        if (cancelled) return;

        if (!mermaidInitialized.current) {
          mermaid.default.initialize({
            startOnLoad: false,
            theme: "default",
            securityLevel: "loose",
          });
          mermaidInitialized.current = true;
        }

        const blocks = container.querySelectorAll("code.language-mermaid");

        for (let i = 0; i < blocks.length && !cancelled; i++) {
          const codeBlock = blocks[i];
          if (codeBlock.parentElement?.classList.contains("mermaid-wrapper")) {
            continue;
          }

          const code = codeBlock.textContent ?? "";
          const uniqueId = `mermaid-${i}-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;

          const wrapper = document.createElement("div");
          wrapper.className = "mermaid-wrapper my-4";
          wrapper.setAttribute("data-mermaid-index", String(i));

          const mermaidDiv = document.createElement("div");
          mermaidDiv.className = "mermaid";
          mermaidDiv.id = uniqueId;
          mermaidDiv.textContent = code;
          wrapper.appendChild(mermaidDiv);

          const pre = codeBlock.parentElement;
          if (pre) {
            pre.replaceWith(wrapper);
            try {
              await mermaid.default.run({ nodes: [mermaidDiv] });
            } catch (err) {
              console.warn("Mermaid render error:", err);
            }
          }
        }

        if (!cancelled && diagramLinks && Object.keys(diagramLinks).length > 0) {
          injectDiagramLinks(container, diagramLinks, onDiagramLinkClick);
        }
      } catch (err) {
        if (!cancelled) console.warn("Mermaid not available:", err);
      }
    }, MERMAID_RENDER_DELAY_MS);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [content, diagramLinks, onDiagramLinkClick]);

  return (
    <div className={className} ref={containerRef}>
      <article className="markdown-body">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw, rehypeSanitize]}
        >
          {content}
        </ReactMarkdown>
      </article>
    </div>
  );
}
