import {
  HANDBOOK_LAYERS,
  type HandbookLayer,
  type HandbookSection,
  type HandbookDoc,
} from "@/constants/handbookManifest";

export interface HandbookSearchItem {
  layerId: string;
  layerTitle: string;
  sectionId: string;
  sectionTitle: string;
  slug: string;
  title: string;
  keywords: string[];
}

const HANDBOOK_SEARCH_ALIASES: Record<string, string[]> = {
  // Core CS
  rdb: ["rdb", "relational database", "관계형 데이터베이스"],
  nosql: ["nosql", "no sql", "비관계형 데이터베이스"],
  cache: ["cache", "캐시"],
  "ac id": ["acid", "a c i d"],

  // AWS common / RDS 등
  rds: ["rds", "aurora", "관계형 데이터베이스 서비스"],
  "rds basics": ["rds basics", "rds 기본"],
  "rds vs aurora": ["rds vs aurora", "rds 대 aurora", "rds와 aurora"],
};

const normalizeToken = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[\s/·]+/g, " ")
    .trim();

const tokenize = (value: string | undefined | null): string[] => {
  if (!value) return [];
  const normalized = normalizeToken(value);
  if (!normalized) return [];
  return normalized.split(" ");
};

const buildKeywordsForDoc = (
  layer: HandbookLayer,
  section: HandbookSection,
  doc: HandbookDoc,
): string[] => {
  const baseTokens = [
    ...tokenize(doc.title),
    ...tokenize(doc.slug),
    ...tokenize(section.title),
    ...tokenize(layer.title),
  ];

  const aliasTokens: string[] = [];

  const possibleKeys = new Set<string>();
  possibleKeys.add(normalizeToken(doc.slug));
  possibleKeys.add(normalizeToken(doc.title));

  for (const key of possibleKeys) {
    const aliases = HANDBOOK_SEARCH_ALIASES[key];
    if (!aliases) continue;
    for (const alias of aliases) {
      aliasTokens.push(...tokenize(alias));
    }
  }

  const all = [...baseTokens, ...aliasTokens];
  return Array.from(new Set(all));
};

export const buildHandbookSearchIndex = (
  layers: HandbookLayer[] = HANDBOOK_LAYERS,
): HandbookSearchItem[] => {
  const items: HandbookSearchItem[] = [];

  for (const layer of layers) {
    for (const section of layer.sections) {
      for (const doc of section.docs) {
        items.push({
          layerId: layer.id,
          layerTitle: layer.title,
          sectionId: section.id,
          sectionTitle: section.title,
          slug: doc.slug,
          title: doc.title,
          keywords: buildKeywordsForDoc(layer, section, doc),
        });
      }
    }
  }

  return items;
};

const scoreMatch = (queryTokens: string[], item: HandbookSearchItem): number => {
  if (queryTokens.length === 0) return 0;

  const titleNorm = normalizeToken(item.title);
  const slugNorm = normalizeToken(item.slug);
  const sectionNorm = normalizeToken(item.sectionTitle);
  const layerNorm = normalizeToken(item.layerTitle);

  let score = 0;

  for (const token of queryTokens) {
    if (!token) continue;

    const tokenInTitle = titleNorm.includes(token);
    const tokenInSlug = slugNorm.includes(token);
    const tokenInSection = sectionNorm.includes(token);
    const tokenInLayer = layerNorm.includes(token);
    const tokenInKeywords = item.keywords.some((k) => k.includes(token));

    if (tokenInTitle && titleNorm === token) score += 8;
    else if (tokenInTitle) score += 5;

    if (tokenInSlug && slugNorm === token) score += 7;
    else if (tokenInSlug) score += 4;

    if (tokenInSection) score += 3;
    if (tokenInLayer) score += 2;
    if (tokenInKeywords) score += 3;
  }

  return score;
};

export interface HandbookSearchOptions {
  limit?: number;
}

export interface HandbookSearchResult extends HandbookSearchItem {
  score: number;
}

export const searchHandbook = (
  query: string,
  index: HandbookSearchItem[],
  options: HandbookSearchOptions = {},
): HandbookSearchResult[] => {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const queryTokens = tokenize(trimmed);
  if (queryTokens.length === 0) return [];

  const scored: HandbookSearchResult[] = [];

  for (const item of index) {
    const score = scoreMatch(queryTokens, item);
    if (score <= 0) continue;
    scored.push({ ...item, score });
  }

  scored.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));

  const limit = options.limit ?? 10;
  return scored.slice(0, limit);
};

