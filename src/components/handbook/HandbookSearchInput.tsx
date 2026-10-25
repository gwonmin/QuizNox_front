import type { KeyboardEvent, MouseEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { HANDBOOK_LAYERS } from "@/constants/handbookManifest";
import { useHandbookSearch } from "@/hooks/useHandbookSearch";
import { cn } from "@/lib/utils";

const LAYER_SHORT_LABEL: Record<string, string> = {
  "core-cs": "기초",
  "aws-common": "AWS",
  saa: "SAA",
  dva: "DVA",
  soa: "SOA",
  cka: "CKA",
  aif: "AIF",
};

const LAYER_FILTERS: { id: string | null; label: string }[] = [
  { id: null, label: "전체" },
  ...HANDBOOK_LAYERS.map((layer) => ({
    id: layer.id,
    label: LAYER_SHORT_LABEL[layer.id] ?? layer.title,
  })),
];

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function HighlightedText({ text, query }: { text: string; query: string }) {
  const tokens = query
    .trim()
    .split(/\s+/)
    .filter((token) => token.length >= 2)
    .sort((a, b) => b.length - a.length);
  if (!text || tokens.length === 0) return <>{text}</>;

  const pattern = new RegExp(`(${tokens.map(escapeRegExp).join("|")})`, "gi");
  const exact = new RegExp(`^(?:${tokens.map(escapeRegExp).join("|")})$`, "i");
  const parts = text.split(pattern);

  return (
    <>
      {parts.map((part, index) =>
        exact.test(part) ? (
          <mark
            key={`${part}-${index}`}
            className="rounded-sm bg-primary/15 px-0.5 text-foreground"
          >
            {part}
          </mark>
        ) : (
          <span key={`${part}-${index}`}>{part}</span>
        ),
      )}
    </>
  );
}

export function HandbookSearchInput() {
  const {
    query,
    layerId,
    results,
    hasResults,
    isEmptyQuery,
    onChangeQuery,
    setLayerId,
    clear,
  } = useHandbookSearch();
  const navigate = useNavigate();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);

  const close = () => setOpen(false);

  const handleSelect = (path: string, event?: MouseEvent<HTMLButtonElement>) => {
    event?.preventDefault();
    event?.stopPropagation();
    close();
    navigate(path);
  };

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (open && !el.open) {
      el.showModal();
      inputRef.current?.focus();
    } else if (!open && el.open) {
      el.close();
    }
  }, [open]);

  useEffect(() => {
    setHighlightedIndex(results.length > 0 ? 0 : null);
  }, [results]);

  useEffect(() => {
    if (highlightedIndex === null || !listRef.current) return;
    const item = listRef.current.querySelector<HTMLButtonElement>(
      `button[data-index="${highlightedIndex}"]`,
    );
    item?.scrollIntoView({ block: "nearest" });
  }, [highlightedIndex]);

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      if (!hasResults) return;
      event.preventDefault();
      setHighlightedIndex((prev) => {
        if (prev === null) return 0;
        return (prev + 1) % results.length;
      });
      return;
    }

    if (event.key === "ArrowUp") {
      if (!hasResults) return;
      event.preventDefault();
      setHighlightedIndex((prev) => {
        if (prev === null) return results.length - 1;
        return (prev - 1 + results.length) % results.length;
      });
      return;
    }

    if (event.key === "Enter" && hasResults) {
      event.preventDefault();
      const target = results[highlightedIndex ?? 0];
      if (target) handleSelect(`/handbook/${target.layerId}/${target.slug}`);
    }
  };

  const emptyMessage = layerId
    ? "이 레이어에서 일치하는 문서가 없습니다."
    : "일치하는 문서가 없습니다.";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex min-h-10 min-w-0 flex-1 items-center gap-2 rounded-md border border-primary-foreground/30 bg-primary-foreground/10 px-3 py-1.5 text-left text-sm text-primary-foreground/80 hover:bg-primary-foreground/15"
        aria-haspopup="dialog"
      >
        <Search className="h-3.5 w-3.5 shrink-0" aria-hidden />
        <span className="truncate">핸드북 검색</span>
      </button>

      <dialog
        ref={dialogRef}
        className="mx-auto mt-2 mb-auto w-[min(36rem,calc(100%-1rem))] max-w-[calc(100%-1rem)] rounded-xl border border-border bg-popover p-0 text-popover-foreground shadow-lg backdrop:bg-black/40 sm:mt-[10vh]"
        aria-label="핸드북 검색"
        onCancel={(event) => {
          event.preventDefault();
          if (query) {
            onChangeQuery("");
            return;
          }
          close();
        }}
        onClose={() => {
          setOpen(false);
          clear();
        }}
        onClick={(event) => {
          if (event.target === dialogRef.current) close();
        }}
      >
        <div className="flex max-h-[min(32rem,calc(100dvh-1rem))] flex-col">
          <div className="flex items-center gap-2 border-b border-border px-3">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
            <input
              ref={inputRef}
              type="text"
              value={query}
              role="combobox"
              aria-expanded={open}
              aria-controls="handbook-search-results"
              aria-autocomplete="list"
              aria-activedescendant={
                highlightedIndex !== null
                  ? `handbook-search-option-${highlightedIndex}`
                  : undefined
              }
              onChange={(event) => onChangeQuery(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="문서 제목, 요약, 소제목"
              autoComplete="off"
              spellCheck={false}
              className="w-full bg-transparent py-3 text-base text-popover-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => onChangeQuery("")}
                aria-label="검색어 지우기"
                className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-bold text-muted-foreground hover:text-foreground"
              >
                ×
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5 px-3 py-2">
            {LAYER_FILTERS.map((filter) => {
              const selected = layerId === filter.id;
              return (
                <button
                  key={filter.label}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => {
                    setLayerId(filter.id);
                    inputRef.current?.focus();
                  }}
                  className={cn(
                    "min-h-10 rounded-full border px-3 text-sm",
                    selected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-muted-foreground hover:text-foreground",
                  )}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>

          <div ref={listRef} className="min-h-0 flex-1 overflow-y-auto">
            {isEmptyQuery ? (
              <p className="px-3 py-8 text-center text-sm text-muted-foreground">
                문서 제목, 요약, 소제목으로 찾을 수 있습니다.
              </p>
            ) : !hasResults ? (
              <p className="px-3 py-8 text-center text-sm text-muted-foreground">
                {emptyMessage}
              </p>
            ) : (
              <ul id="handbook-search-results" role="listbox" className="pb-1">
                {results.map((item, index) => {
                  const path = `/handbook/${item.layerId}/${item.slug}`;
                  const isHighlighted = index === highlightedIndex;
                  return (
                    <li key={`${item.layerId}-${item.slug}`}>
                      <button
                        type="button"
                        id={`handbook-search-option-${index}`}
                        role="option"
                        aria-selected={isHighlighted}
                        data-index={index}
                        onClick={(event) => handleSelect(path, event)}
                        onMouseEnter={() => setHighlightedIndex(index)}
                        className={cn(
                          "flex w-full flex-col items-start px-3 py-3 text-left",
                          isHighlighted ? "bg-accent" : "hover:bg-accent/70",
                        )}
                      >
                        <span className="text-sm font-medium text-foreground">
                          <HighlightedText text={item.title} query={query} />
                        </span>
                        <span className="mt-0.5 text-xs text-muted-foreground">
                          {LAYER_SHORT_LABEL[item.layerId] ?? item.layerTitle}
                          <span className="mx-1 text-muted-foreground/60">&gt;</span>
                          {item.sectionTitle}
                        </span>
                        {item.snippet && (
                          <span className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                            <HighlightedText text={item.snippet} query={query} />
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <p className="hidden border-t border-border px-3 py-2 text-[11px] text-muted-foreground sm:block">
            ↑↓ 이동 · Enter 열기 · Esc 닫기
          </p>
        </div>
      </dialog>
    </>
  );
}
