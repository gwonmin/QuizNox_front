import type { Mermaid } from "mermaid";

let mermaidPromise: Promise<Mermaid> | null = null;

/**
 * 핸드북 전역에서 같은 설정으로 한 번만 초기화된 mermaid를 반환합니다.
 * 다이어그램은 원래 크기로 그리고(useMaxWidth: false), 넓으면 래퍼가 가로 스크롤합니다.
 */
export function loadMermaid(): Promise<Mermaid> {
  if (!mermaidPromise) {
    mermaidPromise = import("mermaid").then(({ default: mermaid }) => {
      mermaid.initialize({
        startOnLoad: false,
        theme: "default",
        securityLevel: "loose",
        htmlLabels: true,
        themeVariables: {
          fontSize: "15px",
        },
        flowchart: {
          useMaxWidth: false,
          wrappingWidth: 180,
          nodeSpacing: 28,
          rankSpacing: 44,
          padding: 12,
          subGraphTitleMargin: { top: 6, bottom: 6 },
        },
      });
      return mermaid;
    });
    mermaidPromise.catch(() => {
      mermaidPromise = null;
    });
  }
  return mermaidPromise;
}
