import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import "github-markdown-css/github-markdown.css";
import "../styles/markdown-theme.css";
import { injectDiagramLinks } from "@/utils/injectDiagramLinks";

const MERMAID_RENDER_DELAY_MS = 400;

interface MarkdownViewerProps {
  content: string;
  className?: string;
  /** 노드 텍스트 → 핸드북 경로. 있으면 다이어그램 노드 클릭 시 해당 문서로 이동 */
  diagramLinks?: Record<string, string>;
  /** diagramLinks 사용 시 클릭 시 SPA 이동용. (path, scrollHash) 전달 시 이전 버튼에서 해당 노드로 스크롤 가능 */
  onDiagramLinkClick?: (path: string, scrollHash?: string) => void;
  /** Mermaid 블록 처리(또는 없음)까지 끝났을 때 한 번 호출 */
  onMermaidSettled?: () => void;
}

export function MarkdownViewer({
  content,
  className = "",
  diagramLinks,
  onDiagramLinkClick,
  onMermaidSettled,
}: MarkdownViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mermaidInitialized = useRef(false);

  useEffect(() => {
    let cancelled = false;

    const timer = setTimeout(async () => {
      try {
        const container = containerRef.current;
        if (!container || cancelled) {
          return;
        }

        try {
          const mermaid = await import("mermaid");
          if (cancelled) {
            return;
          }

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
      } finally {
        if (!cancelled) {
          onMermaidSettled?.();
        }
      }
    }, MERMAID_RENDER_DELAY_MS);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [content, diagramLinks, onDiagramLinkClick, onMermaidSettled]);

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
