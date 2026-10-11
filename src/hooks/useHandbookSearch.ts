import { useMemo, useState } from "react";
import {
  buildHandbookSearchIndex,
  searchHandbook,
  type HandbookSearchResult,
} from "@/utils/handbookSearchIndex";

export interface UseHandbookSearchResult {
  query: string;
  layerId: string | null;
  results: HandbookSearchResult[];
  hasResults: boolean;
  isEmptyQuery: boolean;
  onChangeQuery: (value: string) => void;
  setLayerId: (layerId: string | null) => void;
  clear: () => void;
}

export const useHandbookSearch = (): UseHandbookSearchResult => {
  const index = useMemo(() => buildHandbookSearchIndex(), []);
  const [query, setQuery] = useState("");
  const [layerId, setLayerId] = useState<string | null>(null);

  const results = useMemo(() => {
    const trimmed = query.trim();
    if (!trimmed) return [];
    return searchHandbook(trimmed, index, { limit: 20, layerId });
  }, [query, index, layerId]);

  const clear = () => {
    setQuery("");
    setLayerId(null);
  };

  return {
    query,
    layerId,
    results,
    hasResults: results.length > 0,
    isEmptyQuery: query.trim().length === 0,
    onChangeQuery: setQuery,
    setLayerId,
    clear,
  };
};
