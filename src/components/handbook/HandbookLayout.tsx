import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export interface HandbookTocItem {
  id: string;
  title: string;
  level?: 2 | 3;
}

interface HandbookLayoutProps {
  layerTitle?: string;
  sectionTitle?: string;
  docTitle?: string;
  showBackToListLink?: boolean;
  backToListHref?: string;
  backToDiagramHref?: string;
  tocItems?: HandbookTocItem[];
  className?: string;
  children: ReactNode;
}

export function HandbookLayout({
  layerTitle,
  sectionTitle,
  docTitle,
  showBackToListLink = true,
  backToListHref = "/handbook",
  backToDiagramHref,
  tocItems,
  className,
  children,
}: HandbookLayoutProps) {
  const hasToc = tocItems && tocItems.length > 0;

  return (
    <main
      className={cn(
        "max-w-6xl mx-auto px-4 py-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_260px]",
        !hasToc && "lg:grid-cols-[minmax(0,1fr)]",
        className
      )}
    >
      <section>
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
                    <span className="text-foreground/80">{layerTitle}</span>
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
                {backToDiagramHref && (
                  <>
                    <span className="mx-1.5 text-muted-foreground/60">·</span>
                    <Link
                      to={backToDiagramHref}
                      className="text-xs text-primary hover:underline"
                    >
                      다이어그램으로 돌아가기
                    </Link>
                  </>
                )}
              </p>
            )}
          </div>
        </header>
        <div>{children}</div>
      </section>

      {hasToc && (
        <aside
          aria-label="문서 목차"
          className="hidden lg:block border-l border-border/60 pl-6 text-xs"
        >
          <p className="mb-2 font-semibold text-muted-foreground">이 페이지 목차</p>
          <ul className="space-y-1">
            {tocItems.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={cn(
                    "text-muted-foreground hover:text-foreground inline-block",
                    item.level === 3 && "ml-3"
                  )}
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </aside>
      )}
    </main>
  );
}

