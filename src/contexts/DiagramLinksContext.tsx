import { createContext, useContext } from "react";

export interface DiagramLinksContextValue {
  diagramLinks: Record<string, string>;
  onDiagramLinkClick?: (path: string, scrollHash?: string) => void;
}

export const DiagramLinksContext = createContext<DiagramLinksContextValue | null>(null);

export function useDiagramLinks(): DiagramLinksContextValue | null {
  return useContext(DiagramLinksContext);
}
