import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface DocLinkProps {
  slug: string;
  layer?: string;
  children: ReactNode;
  className?: string;
}

/** 본문에서 다른 핸드북 문서로 가는 링크 */
export function DocLink({ slug, layer = "core-cs", children, className }: DocLinkProps) {
  return (
    <Link
      to={`/handbook/${layer}/${slug}`}
      className={cn(
        "inline break-words text-primary underline decoration-primary/40 underline-offset-2",
        "hover:decoration-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className,
      )}
    >
      {children}
    </Link>
  );
}
