import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import readmeContent from "../../README.md?raw";
import "github-markdown-css/github-markdown.css";
import "../styles/markdown-theme.css";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mermaidInitialized = useRef(false);

  useEffect(() => {
    const renderMermaid = async () => {
      if (!containerRef.current) return;

      try {
        const mermaid = await import("mermaid");
        
        if (!mermaidInitialized.current) {
          mermaid.default.initialize({ 
            startOnLoad: false,
            theme: 'default',
            securityLevel: 'loose'
          });
          mermaidInitialized.current = true;
        }

        // Mermaid 코드 블록 찾기
        const mermaidCodeBlocks = containerRef.current.querySelectorAll('code.language-mermaid');
        
        // 각 다이어그램을 순차적으로 렌더링하여 충돌 방지
        for (let index = 0; index < mermaidCodeBlocks.length; index++) {
          const codeBlock = mermaidCodeBlocks[index];
          const code = codeBlock.textContent || '';
          
          // 이미 렌더링된 경우 스킵
          if (codeBlock.parentElement?.classList.contains('mermaid-wrapper')) {
            continue;
          }

          // 고유한 ID 생성 (인덱스와 타임스탬프 조합)
          const uniqueId = `mermaid-diagram-${index}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

          // Mermaid div 생성
          const mermaidDiv = document.createElement('div');
          mermaidDiv.className = 'mermaid';
          mermaidDiv.id = uniqueId;
          mermaidDiv.textContent = code;

          // Wrapper 생성
          const wrapper = document.createElement('div');
          wrapper.className = 'mermaid-wrapper my-4';
          wrapper.setAttribute('data-mermaid-index', index.toString());
          wrapper.appendChild(mermaidDiv);

          // 코드 블록을 wrapper로 교체
          const preElement = codeBlock.parentElement;
          if (preElement) {
            preElement.replaceWith(wrapper);
            
            // 각 다이어그램을 개별적으로 렌더링
            try {
              await mermaid.default.run({
                nodes: [mermaidDiv],
              });
            } catch (renderError) {
              console.warn(`Mermaid diagram ${index} rendering error:`, renderError);
            }
          }
        }
      } catch (error) {
        console.warn('Mermaid library not available:', error);
      }
    };

    // 마크다운 렌더링 후 Mermaid 처리 (더 긴 딜레이로 안정성 확보)
    const timer = setTimeout(renderMermaid, 500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <article className="markdown-body" ref={containerRef}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw, rehypeSanitize]}
        >
          {readmeContent}
        </ReactMarkdown>
      </article>
    </div>
  );
}
