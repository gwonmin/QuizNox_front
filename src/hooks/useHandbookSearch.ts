import { useMemo, useState } from "react";
import {
  buildHandbookSearchIndex,
  searchHandbook,
  type HandbookSearchItem,
  type HandbookSearchResult,
} from "@/utils/handbookSearchIndex";

export interface UseHandbookSearchResult {
  query: string;
  results: HandbookSearchResult[];
  hasResults: boolean;
  isEmptyQuery: boolean;
  onChangeQuery: (value: string) => void;
  clear: () => void;
  index: HandbookSearchItem[];
}

export const useHandbookSearch = (): UseHandbookSearchResult => {
  const index = useMemo(() => buildHandbookSearchIndex(), []);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<HandbookSearchResult[]>([]);

  const handleChange = (value: string) => {
    setQuery(value);
    const trimmed = value.trim();
    if (!trimmed) {
      setResults([]);
      return;
    }
    const nextResults = searchHandbook(trimmed, index, { limit: 10 });
    setResults(nextResults);
  };

  const clear = () => {
    setQuery("");
    setResults([]);
  };

  return {
    query,
    results,
    hasResults: results.length > 0,
    isEmptyQuery: query.trim().length === 0,
    onChangeQuery: handleChange,
    clear,
    index,
  };
};

