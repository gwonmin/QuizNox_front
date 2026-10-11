import {
  HANDBOOK_LAYERS,
  type HandbookLayer,
  type HandbookDoc,
} from "@/constants/handbookManifest";
import {
  HANDBOOK_DOC_EXCERPTS,
  type HandbookDocExcerpt,
} from "@/constants/handbookDocExcerpts";

export interface HandbookSearchItem {
  layerId: string;
  layerTitle: string;
  sectionId: string;
  sectionTitle: string;
  slug: string;
  title: string;
  keywords: string[];
  excerpt: string;
  headings: string[];
  lines: string[];
  terms: string[];
}

const EMPTY_EXCERPT: HandbookDocExcerpt = {
  excerpt: "",
  headings: [],
  lines: [],
  terms: [],
};

const excerptFor = (layerId: string, slug: string): HandbookDocExcerpt =>
  HANDBOOK_DOC_EXCERPTS[`${layerId}/${slug}`] ?? EMPTY_EXCERPT;

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

  // CKA
  rbac: ["권한", "rolebinding", "clusterrole"],
  kubeadm: ["쿠버네티스 설치", "클러스터 업그레이드"],
  etcd: ["스냅샷", "snapshot"],
  "network policy": ["네트워크 정책", "네트워크폴리시"],
  ingress: ["인그레스"],
  coredns: ["클러스터 dns", "코어디엔에스"],
  "exam workflow": ["컨텍스트", "jsonpath", "dry-run", "드라이런"],
  "node prep": ["스왑", "containerd", "컨테이너 런타임"],
  "ha control plane": ["고가용", "컨트롤 플레인 추가"],
  "cert renewal": ["인증서", "kubeadm certs"],
  "self healing": ["프로브", "daemonset", "cronjob", "hpa"],
  kustomize: ["apply -k", "overlay", "쿠스토마이즈"],
  helm: ["헬름", "차트", "helm upgrade"],
  "gateway api": ["httproute", "게이트웨이"],
  "crd operator": ["커스텀 리소스", "오퍼레이터"],
  crd: ["커스텀 리소스", "오퍼레이터"],
  "resource usage": ["kubectl top", "metrics-server", "메트릭"],
  "headless statefulset": ["headless", "statefulset", "볼륨클레임"],
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

const buildKeywordsForDoc = (doc: HandbookDoc): string[] => {
  const baseTokens = [...tokenize(doc.title), ...tokenize(doc.slug)];

  const aliasTokens: string[] = [];

  const possibleKeys = new Set<string>();
  possibleKeys.add(normalizeToken(doc.slug));
  possibleKeys.add(normalizeToken(doc.slug.replace(/-/g, " ")));
  possibleKeys.add(normalizeToken(doc.slug.split("-")[0]));
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
        const extra = excerptFor(layer.id, doc.slug);
        items.push({
          layerId: layer.id,
          layerTitle: layer.title,
          sectionId: section.id,
          sectionTitle: section.title,
          slug: doc.slug,
          title: doc.title,
          keywords: buildKeywordsForDoc(doc),
          excerpt: extra.excerpt,
          headings: extra.headings,
          lines: extra.lines,
          terms: extra.terms,
        });
      }
    }
  }

  return items;
};

const MIN_TOKEN_LENGTH = 2;

/** 제목·본문·별칭만 봅니다. 섹션 제목에 나열된 형제 주제로는 맞추지 않습니다. */
const matchText = (item: HandbookSearchItem): string =>
  normalizeToken(
    [
      item.title,
      item.slug.replace(/-/g, " "),
      item.excerpt,
      item.headings.join(" "),
      item.lines.join(" "),
      item.terms.join(" "),
      item.keywords.join(" "),
    ].join(" "),
  );

const scoreMatch = (
  query: string,
  queryTokens: string[],
  item: HandbookSearchItem,
): number => {
  if (queryTokens.length === 0) return 0;
  if (!queryTokens.every((token) => matchText(item).includes(token))) return 0;

  const titleNorm = normalizeToken(item.title);
  const slugNorm = normalizeToken(item.slug);
  const sectionNorm = normalizeToken(item.sectionTitle);
  const layerNorm = normalizeToken(item.layerTitle);
  const excerptNorm = normalizeToken(item.excerpt);
  const headingNorm = normalizeToken(item.headings.join(" "));
  const lineNorm = normalizeToken(item.lines.join(" "));
  const termNorm = normalizeToken(item.terms.join(" "));
  const phrase = normalizeToken(query);

  let score = 0;
  if (phrase && titleNorm.includes(phrase)) score += 8;
  if (phrase && excerptNorm.includes(phrase)) score += 4;

  for (const token of queryTokens) {
    if (titleNorm === token) score += 8;
    else if (titleNorm.includes(token)) score += 5;

    if (slugNorm === token) score += 7;
    else if (slugNorm.includes(token)) score += 4;

    if (headingNorm.includes(token)) score += 4;
    if (lineNorm.includes(token)) score += 3;
    if (excerptNorm.includes(token)) score += 3;
    if (termNorm.includes(token)) score += 2;
    if (sectionNorm.includes(token)) score += 2;
    if (layerNorm.includes(token)) score += 1;
    if (item.keywords.some((keyword) => keyword.includes(token))) score += 3;
  }

  return score;
};

const pickSnippet = (item: HandbookSearchItem, queryTokens: string[]): string => {
  const candidates = [item.excerpt, ...item.headings, ...item.lines].filter(
    (text) => text.trim().length > 0,
  );
  const matched = candidates.filter((text) => {
    const norm = normalizeToken(text);
    return queryTokens.every((token) => norm.includes(token));
  });
  if (matched.includes(item.excerpt)) return item.excerpt;
  const shortest = matched.slice().sort((a, b) => a.length - b.length)[0];
  return shortest ?? item.excerpt;
};

export interface HandbookSearchOptions {
  limit?: number;
  layerId?: string | null;
}

export interface HandbookSearchResult extends HandbookSearchItem {
  score: number;
  snippet: string;
}

export const searchHandbook = (
  query: string,
  index: HandbookSearchItem[],
  options: HandbookSearchOptions = {},
): HandbookSearchResult[] => {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const queryTokens = tokenize(trimmed).filter(
    (token) => token.length >= MIN_TOKEN_LENGTH,
  );
  if (queryTokens.length === 0) return [];

  const scored: HandbookSearchResult[] = [];

  for (const item of index) {
    if (options.layerId && item.layerId !== options.layerId) continue;
    const score = scoreMatch(trimmed, queryTokens, item);
    if (score <= 0) continue;
    scored.push({
      ...item,
      score,
      snippet: pickSnippet(item, queryTokens),
    });
  }

  scored.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));

  const limit = options.limit ?? 10;
  return scored.slice(0, limit);
};

