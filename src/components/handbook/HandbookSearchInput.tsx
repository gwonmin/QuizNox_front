import type { KeyboardEvent, MouseEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useHandbookSearch } from "@/hooks/useHandbookSearch";

export function HandbookSearchInput() {
  const { query, results, hasResults, onChangeQuery, clear } = useHandbookSearch();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);

  const handleSelect = (path: string, e?: MouseEvent<HTMLButtonElement>) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    clear();
    setHighlightedIndex(null);
    navigate(path);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      if (!hasResults) return;
      e.preventDefault();
      setHighlightedIndex((prev) => {
        if (prev === null) return 0;
        return (prev + 1) % results.length;
      });
      return;
    }

    if (e.key === "ArrowUp") {
      if (!hasResults) return;
      e.preventDefault();
      setHighlightedIndex((prev) => {
        if (prev === null) return results.length - 1;
        return (prev - 1 + results.length) % results.length;
      });
      return;
    }

    if (e.key === "Enter" && hasResults) {
      e.preventDefault();
      const index = highlightedIndex ?? 0;
      const target = results[index];
      if (target) {
        const path = `/handbook/${target.layerId}/${target.slug}`;
        handleSelect(path);
      }
      return;
    }

    if (e.key === "Escape") {
      clear();
      setHighlightedIndex(null);
      (e.target as HTMLInputElement).blur();
    }
  };

  const baseInputClasses =
    "w-full rounded-md border border-primary-foreground/30 bg-primary-foreground/10 pl-3 pr-7 py-1.5 text-sm text-primary-foreground placeholder:text-primary-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary-foreground/60 focus:border-transparent";

  const wrapperClasses = "relative w-full";

  useEffect(() => {
    if (highlightedIndex === null) return;
    if (!listRef.current) return;

    const item = listRef.current.querySelector<HTMLButtonElement>(
      `button[data-index="${highlightedIndex}"]`,
    );
    if (item) {
      item.scrollIntoView({ block: "nearest" });
    }
  }, [highlightedIndex]);

  return (
    <div
      ref={containerRef}
      className={wrapperClasses}
    >
      <input
        type="text"
        value={query}
        onChange={(e) => onChangeQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="핸드북 키워드 검색 (예: RDS)"
        className={baseInputClasses}
      />

      {query && (
        <button
          type="button"
          onClick={() => {
            clear();
            setHighlightedIndex(null);
          }}
          aria-label="검색어 지우기"
          className="absolute inset-y-0 right-2 my-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary-foreground/30 text-primary text-[10px] font-bold hover:bg-primary-foreground/50 transition-colors"
        >
          ×
        </button>
      )}

      {hasResults && (
        <div
          ref={listRef}
          className="absolute z-50 mt-1 w-full rounded-md bg-white text-xs text-gray-900 shadow-lg border border-gray-200 max-h-72 overflow-y-auto"
        >
          <ul>
            {results.map((item, index) => {
              const path = `/handbook/${item.layerId}/${item.slug}`;
              const isHighlighted = index === highlightedIndex;
              return (
                <li key={`${item.layerId}-${item.slug}`}>
                  <button
                    type="button"
                    onClick={(e) => handleSelect(path, e)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    data-index={index}
                    className={`flex w-full flex-col items-start px-3 py-2 text-left ${
                      isHighlighted ? "bg-gray-100" : "hover:bg-gray-100"
                    }`}
                  >
                    <span className="text-[0.8rem] font-medium">{item.title}</span>
                    <span className="mt-0.5 text-[0.7rem] text-gray-500">
                      {item.layerTitle} &gt; {item.sectionTitle}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

