import { useCallback, useLayoutEffect, useState, type RefObject } from "react";
import {
  sameTocItems,
  syncHandbookToc,
  type HandbookTocItem,
} from "@/utils/handbookToc";

export function useHandbookToc(containerRef: RefObject<HTMLElement | null>) {
  const [items, setItems] = useState<HandbookTocItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useLayoutEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const scan = () => {
      const next = syncHandbookToc(root);
      setItems((prev) => (sameTocItems(prev, next) ? prev : next));
    };

    scan();
    let frame = 0;
    const observer = new MutationObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(scan);
    });
    observer.observe(root, { childList: true, subtree: true });
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [containerRef]);

  useLayoutEffect(() => {
    if (items.length === 0) {
      setActiveId(null);
      return;
    }

    let frame = 0;
    const update = () => {
      const marker = 128;
      let current = items[0]?.id ?? null;
      for (const item of items) {
        const el = document.getElementById(item.id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= marker) current = item.id;
      }
      setActiveId((prev) => (prev === current ? prev : current));
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, [items]);

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", `#${id}`);
    setActiveId(id);
  }, []);

  return { items, activeId, scrollTo };
}
