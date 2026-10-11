import { useEffect, useRef, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useHandbookToc } from "@/hooks/useHandbookToc";
import type { HandbookTocItem } from "@/utils/handbookToc";

export type { HandbookTocItem };

interface HandbookLayoutProps {
  layerTitle?: string;
  /** 있으면 브레드크럼의 레이어 제목을 링크로 */
  layerHref?: string;
  sectionTitle?: string;
  /** 섹션 안 순서. `3/7`처럼 보입니다. */
  sectionIndex?: number;
  sectionCount?: number;
  docTitle?: string;
  showBackToListLink?: boolean;
  backToListHref?: string;
  backToDiagramHref?: string;
  backLabel?: string;
  /** 넘기면 본문에서 만든 목차 대신 이 목록을 씁니다. */
  tocItems?: HandbookTocItem[];
  className?: string;
  /** 문서 헤더·본문을 max-w-4xl 블록으로 묶어 그리드 칸 안에서 가운데 정렬 */
  centerReadingColumn?: boolean;
  children: ReactNode;
}

function TocNav({
  items,
  activeId,
  onSelect,
}: {
  items: HandbookTocItem[];
  activeId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <ul className="space-y-1">
      {items.map((item) => {
        const active = item.id === activeId;
        return (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              data-toc-id={item.id}
              aria-current={active ? "location" : undefined}
              onClick={(event) => {
                event.preventDefault();
                onSelect(item.id);
              }}
              className={cn(
                "block min-h-11 border-l-2 py-2.5 pl-2 text-sm leading-snug hover:text-foreground lg:min-h-0 lg:py-0.5 lg:text-xs",
                item.level === 3 && "ml-3",
                active
                  ? "border-primary font-medium text-foreground"
                  : "border-transparent text-muted-foreground",
              )}
            >
              {item.title}
            </a>
          </li>
        );
      })}
    </ul>
  );
}

export function HandbookLayout({
  layerTitle,
  layerHref,
  sectionTitle,
  sectionIndex,
  sectionCount,
  docTitle,
  showBackToListLink = true,
  backToListHref = "/handbook",
  backToDiagramHref,
  backLabel = "다이어그램으로 돌아가기",
  tocItems,
  className,
  centerReadingColumn = false,
  children,
}: HandbookLayoutProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const asideRef = useRef<HTMLElement>(null);
  const mobileTocRef = useRef<HTMLDetailsElement>(null);
  const autoToc = useHandbookToc(contentRef);
  const items = tocItems ?? autoToc.items;
  const activeId = tocItems ? null : autoToc.activeId;
  const hasToc = items.length > 0;
  const activeTitle = items.find((item) => item.id === activeId)?.title;

  const selectHeading = (id: string) => {
    autoToc.scrollTo(id);
    if (mobileTocRef.current) mobileTocRef.current.open = false;
  };

  useEffect(() => {
    const aside = asideRef.current;
    if (!aside || !activeId) return;
    const link = aside.querySelector<HTMLElement>(
      `[data-toc-id="${CSS.escape(activeId)}"]`,
    );
    if (!link) return;
    const asideRect = aside.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();
    if (linkRect.top < asideRect.top) {
      aside.scrollTop -= asideRect.top - linkRect.top;
    } else if (linkRect.bottom > asideRect.bottom) {
      aside.scrollTop += linkRect.bottom - asideRect.bottom;
    }
  }, [activeId]);

  return (
    <main
      className={cn(
        "max-w-6xl mx-auto min-w-0 px-4 py-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_260px]",
        !hasToc && "lg:grid-cols-[minmax(0,1fr)]",
        className,
      )}
    >
      <section className="min-w-0">
        <div className={cn("min-w-0", centerReadingColumn && "mx-auto w-full max-w-4xl")}>
          <header className="mb-6">
            <nav aria-label="breadcrumb" className="text-sm text-muted-foreground">
              {showBackToListLink && (
                <>
                  <Link to={backToListHref} className="hover:text-foreground">
                    핸드북
                  </Link>
                  {layerTitle && (
                    <>
                      <span className="mx-1.5 text-muted-foreground/70">/</span>
                      {layerHref ? (
                        <Link
                          to={layerHref}
                          className="text-foreground/80 hover:text-foreground"
                        >
                          {layerTitle}
                        </Link>
                      ) : (
                        <span className="text-foreground/80">{layerTitle}</span>
                      )}
                    </>
                  )}
                </>
              )}
            </nav>
            <div className="mt-3 space-y-1">
              {docTitle && (
                <h1 className="text-xl font-semibold text-foreground">{docTitle}</h1>
              )}
              {sectionTitle && (
                <p className="text-xs text-muted-foreground">
                  {sectionTitle}
                  {sectionIndex != null && sectionCount != null && sectionCount > 0 && (
                    <>
                      <span className="mx-1.5 text-muted-foreground/60">·</span>
                      <span
                        className="font-medium text-foreground/80"
                        aria-label={`이 섹션 ${sectionIndex}번째, 총 ${sectionCount}개`}
                      >
                        {sectionIndex}/{sectionCount}
                      </span>
                    </>
                  )}
                  {backToDiagramHref && (
                    <>
                      <span className="mx-1.5 text-muted-foreground/60">·</span>
                      <Link
                        to={backToDiagramHref}
                        className="text-xs text-primary hover:underline"
                      >
                        {backLabel}
                      </Link>
                    </>
                  )}
                </p>
              )}
            </div>
          </header>

          {hasToc && (
            <div className="sticky top-0 z-20 -mx-4 mb-4 border-b border-border/80 bg-background/95 px-4 py-2 backdrop-blur lg:hidden">
              <details
                ref={mobileTocRef}
                className="rounded-lg border border-border bg-muted/40 px-3"
              >
                <summary className="flex min-h-11 cursor-pointer items-center gap-2 text-sm font-semibold text-muted-foreground">
                  <span className="shrink-0">이 페이지 목차</span>
                  {activeTitle && (
                    <span className="min-w-0 flex-1 truncate font-normal text-foreground">
                      {activeTitle}
                    </span>
                  )}
                </summary>
                <nav
                  aria-label="문서 목차"
                  className="mt-1 max-h-[min(24rem,50vh)] overflow-y-auto pb-2"
                >
                  <TocNav items={items} activeId={activeId} onSelect={selectHeading} />
                </nav>
              </details>
            </div>
          )}

          <div ref={contentRef} className="min-w-0">{children}</div>
        </div>
      </section>

      {hasToc && (
        <aside
          ref={asideRef}
          aria-label="문서 목차"
          className="sticky top-8 hidden max-h-[calc(100vh-4rem)] overflow-y-auto border-l border-border/60 pl-6 text-xs lg:block"
        >
          <p className="mb-2 font-semibold text-muted-foreground">이 페이지 목차</p>
          <TocNav items={items} activeId={activeId} onSelect={selectHeading} />
        </aside>
      )}
    </main>
  );
}
