/**
 * Mermaid SVG 노드에 핸드북 링크를 주입합니다.
 * MarkdownViewer와 MermaidDiagramWithLinks에서 공용.
 */
const SVG_NS = "http://www.w3.org/2000/svg";
const XLINK_NS = "http://www.w3.org/1999/xlink";

export function injectDiagramLinks(
  container: HTMLElement,
  links: Record<string, string>,
  onNavigate?: (path: string, scrollHash?: string) => void,
  /** 단일 다이어그램 wrapper일 때 사용. 지정하면 doc-${diagramIndex}-${slug} 로 id 부여 */
  diagramIndex?: number
): void {
  const descendants = container.querySelectorAll(".mermaid-wrapper");
  const selfMatch = container.classList.contains("mermaid-wrapper") ? [container] : [];
  const wrappers = selfMatch.length > 0 ? selfMatch : Array.from(descendants);
  wrappers.forEach((wrapper, wrapperIndex) => {
    const svg = wrapper.querySelector("svg");
    if (!svg) return;
    const index = diagramIndex !== undefined ? diagramIndex : wrapperIndex;
    const nodes = svg.querySelectorAll("g.node");
    nodes.forEach((g) => {
      if (g.getAttribute("data-handbook-linked") === "true") return;
      const text = (g.textContent ?? "").trim();
      for (const [key, path] of Object.entries(links)) {
        if (text.includes(key)) {
          const slug = path.split("/").filter(Boolean).pop() ?? "";
          const nodeId = slug ? `doc-${index}-${slug}` : "";
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
