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

  // AIF
  "learning types": ["지도학습", "비지도학습", "강화학습", "분류", "회귀", "클러스터링"],
  "ml lifecycle": ["데이터 전처리", "피처 엔지니어링", "eda", "탐색적 데이터 분석"],
  "ml metrics": ["정확도", "정밀도", "재현율", "f1", "confusion matrix", "혼동 행렬", "rmse", "auc"],
  "overfitting bias": ["과적합", "과소적합", "편향", "샘플링 편향", "정규화", "regularization"],
  "genai concepts": ["토큰", "임베딩", "컨텍스트 윈도우", "환각", "hallucination", "트랜스포머", "멀티모달"],
  "inference params": ["temperature", "top k", "top p", "온도", "응답 길이"],
  "fm selection": ["nova", "모달리티", "모델 크기", "지연 시간", "파운데이션 모델 선택"],
  "prompt engineering": ["zero-shot", "few-shot", "chain of thought", "프롬프트 인젝션", "negative prompt", "프롬프트 템플릿"],
  "customization ladder": ["파인튜닝", "fine-tuning", "continued pre-training", "계속 사전학습", "instruction tuning", "rlhf"],
  "rag knowledge bases": ["knowledge base", "청킹", "chunking", "벡터 db", "opensearch", "pgvector", "검색 증강"],
  "genai metrics": ["rouge", "bleu", "bertscore", "model evaluation", "모델 평가", "llm-as-a-judge", "faithfulness"],
  "bedrock features": ["guardrails", "가드레일", "agents", "에이전트", "prompt management", "provisioned throughput", "batch inference", "prompt router"],
  "responsible ai dimensions": ["공정성", "fairness", "설명 가능성", "explainability", "투명성", "transparency", "거버넌스"],
  "explainability tools": ["clarify", "model cards", "모델 카드", "model monitor", "shap", "a2i", "augmented ai", "drift", "드리프트"],
  "ai security": ["privatelink", "kms", "macie", "pii", "프라이빗 연결", "데이터 보호"],
  "ai governance": ["cloudtrail", "audit manager", "artifact", "aws config", "데이터 보존", "data lifecycle", "iso"],
  "aws ai services": ["comprehend", "transcribe", "translate", "polly", "rekognition", "textract", "kendra", "personalize", "lex", "q developer", "q business"],
  "exam strategy": ["시험 전략", "least effort", "most cost-effective", "키워드"],
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

