export interface HandbookTocItem {
  id: string;
  title: string;
  level?: 2 | 3;
}

export function slugifyHeading(text: string): string {
  const slug = text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\p{L}\p{N}-]+/gu, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return slug || "section";
}

/** 본문 h2·h3에 id를 붙이고 목차 항목을 돌려줍니다. */
export function syncHandbookToc(root: ParentNode): HandbookTocItem[] {
  const headings = root.querySelectorAll(".markdown-body h2, .markdown-body h3");
  const used = new Set<string>();
  const items: HandbookTocItem[] = [];

  headings.forEach((node) => {
    if (!(node instanceof HTMLElement)) return;
    const title = (node.textContent ?? "").replace(/\s+/g, " ").trim();
    if (!title) return;

    let id = node.id.trim();
    if (!id || used.has(id)) {
      const base = slugifyHeading(title);
      id = base;
      let n = 2;
      while (used.has(id)) {
        id = `${base}-${n}`;
        n += 1;
      }
      node.id = id;
    }
    used.add(id);
    node.classList.add("scroll-mt-20", "lg:scroll-mt-8");
    items.push({
      id,
      title,
      level: node.tagName === "H3" ? 3 : 2,
    });
  });

  return items;
}

export function sameTocItems(a: HandbookTocItem[], b: HandbookTocItem[]): boolean {
  if (a.length !== b.length) return false;
  return a.every(
    (item, index) =>
      item.id === b[index]?.id &&
      item.title === b[index]?.title &&
      item.level === b[index]?.level,
  );
}
