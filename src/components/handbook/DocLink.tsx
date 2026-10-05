import type { ReactNode } from "react";
import { Link } from "react-router-dom";

interface DocLinkProps {
  slug: string;
  layer?: string;
  children: ReactNode;
}

/** 본문에서 다른 핸드북 문서로 가는 링크 */
export function DocLink({ slug, layer = "core-cs", children }: DocLinkProps) {
  return (
    <Link
      to={`/handbook/${layer}/${slug}`}
      className="text-primary underline underline-offset-2 hover:opacity-80"
    >
      {children}
    </Link>
  );
}
