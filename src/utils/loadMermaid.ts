import type { Mermaid } from "mermaid";

let mermaidPromise: Promise<Mermaid> | null = null;

/**
 * 핸드북 전역에서 같은 설정으로 한 번만 초기화된 mermaid를 반환합니다.
 * 다이어그램은 원래 크기로 그리고(useMaxWidth: false), 넓으면 래퍼가 가로 스크롤합니다.
 * 배치는 v12 기본값(ELK · neo · redux-color)을 따르되, 노드 최소 폭(기본 120)은 0으로 두어
 * 노드가 라벨 길이만큼만 그려지게 합니다. 화살표 없는 목록처럼 ELK가 선언 순서를 지키지 않는
 * 다이어그램은 코드 앞 frontmatter(`config: { layout: dagre }`)로 개별 지정합니다.
 * JSX 템플릿은 들여쓰기를 남기므로, 닫는 `---`가 들여쓰기되면 mermaid가 렌더를 거부합니다.
 * renderMermaid가 그 펜스만 열의 처음으로 맞춥니다.
 */
export function loadMermaid(): Promise<Mermaid> {
  if (!mermaidPromise) {
    mermaidPromise = import("mermaid").then(({ default: mermaid }) => {
      mermaid.initialize({
        startOnLoad: false,
        layout: "elk",
        look: "neo",
        theme: "redux-color",
        securityLevel: "loose",
        htmlLabels: true,
        themeVariables: {
          fontSize: "15px",
        },
        flowchart: {
          useMaxWidth: false,
          wrappingWidth: 180,
          minNodeWidth: 0,
          nodeSpacing: 28,
          rankSpacing: 44,
          padding: 12,
          subGraphTitleMargin: { top: 6, bottom: 6 },
        },
      } as Parameters<Mermaid["initialize"]>[0]);
      return mermaid;
    });
    mermaidPromise.catch(() => {
      mermaidPromise = null;
    });
  }
  return mermaidPromise;
}

let renderCount = 0;

function leadingIndent(line: string): number {
  const match = /^[ \t]*/.exec(line);
  return match ? match[0].length : 0;
}

function dedent(text: string): string {
  const lines = text.split("\n");
  const nonEmpty = lines.filter((line) => line.trim() !== "");
  if (nonEmpty.length === 0) {
    return "";
  }
  const min = Math.min(...nonEmpty.map(leadingIndent));
  return lines
    .map((line) => (line.trim() === "" ? "" : line.slice(min)))
    .join("\n")
    .trim();
}

/**
 * `---` frontmatter의 닫는 펜스가 들여쓰기되면 mermaid는 다이어그램 전체를
 * 닫히지 않은 YAML로 보고 렌더를 거부합니다. 펜스만 열 처음으로 맞추고,
 * frontmatter와 본문의 공통 들여쓰기는 제거합니다.
 * frontmatter가 없는 코드는 trim만 해서 기존 다이어그램 소스를 유지합니다.
 */
function normalizeMermaidSource(code: string): string {
  const trimmed = code.trim();
  if (!trimmed.startsWith("---")) {
    return trimmed;
  }

  const lines = trimmed.split("\n");
  const closeIndex = lines.findIndex(
    (line, index) => index > 0 && line.trim() === "---"
  );
  if (closeIndex === -1) {
    return trimmed;
  }

  const frontmatter = dedent(lines.slice(1, closeIndex).join("\n"));
  const body = dedent(lines.slice(closeIndex + 1).join("\n"));
  return `---\n${frontmatter}\n---\n${body}`;
}

/**
 * 다이어그램을 그려 target 안에 넣습니다.
 * mermaid.run은 같은 밀리초에 시작한 다이어그램에 같은 SVG id를 붙여 서로 덮어쓰므로,
 * 페이지 안에서 겹치지 않는 id로 render를 직접 호출합니다.
 */
export async function renderMermaid(
  mermaid: Mermaid,
  target: HTMLElement,
  code: string
): Promise<void> {
  renderCount += 1;
  const { svg, bindFunctions } = await mermaid.render(
    `handbook-mermaid-${renderCount}`,
    normalizeMermaidSource(code)
  );
  target.innerHTML = svg;
  bindFunctions?.(target);
}
