import { memo, useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { MarkdownViewer } from "../../components/MarkdownViewer";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import {
  getDocSectionPosition,
  getHandbookDoc,
  getReadingSteps,
  handbookSectionPath,
  type HandbookReadingStep,
} from "../../constants/handbookManifest";
import {
  getDiagramConfig,
  LAYERS_WITH_SECTION_PAGES,
} from "../../constants/handbookLayerDiagramConfig";
import { HandbookLayout } from "../../components/handbook/HandbookLayout";
import { getHandbookDocComponent, hasHandbookDoc } from "./handbookDocRegistry";
import { HandbookContentReadyProvider } from "@/contexts/HandbookContentReadyContext";
import "github-markdown-css/github-markdown.css";
import "../../styles/markdown-theme.css";

const DOC_URL_PREFIX = "/handbook";
const LAYERS_WITH_DIAGRAM = ["core-cs", "aws-common", "saa", "dva", "soa", "cka", "aif"];
const SCROLL_BACK_KEY = "handbookScrollBackHash";
const MAIN_CLASS = "max-w-4xl mx-auto px-4 py-8";

function RelatedInSection({
  layerId,
  sectionTitle,
  docs,
  currentSlug,
}: {
  layerId: string;
  sectionTitle: string;
  docs: { slug: string; title: string }[];
  currentSlug: string;
}) {
  const siblings = docs.filter((d) => d.slug !== currentSlug);
  if (siblings.length === 0) return null;

  return (
    <aside className="mt-10 pt-8 border-t border-border">
      <h2 className="text-sm font-semibold text-foreground mb-3">
        이 섹션의 다른 개념 ({sectionTitle})
      </h2>
      <ul className="flex flex-wrap gap-x-1 gap-y-1">
        {siblings.map((d, i) => (
          <li key={d.slug} className="inline">
            <Link
              to={`/handbook/${layerId}/${d.slug}`}
              className="text-sm text-primary hover:underline"
            >
              {d.title}
            </Link>
            {i < siblings.length - 1 && (
              <span className="text-muted-foreground/60 mx-1.5">·</span>
            )}
          </li>
        ))}
      </ul>
    </aside>
  );
}

function StepLink({
  layerId,
  step,
  direction,
}: {
  layerId: string;
  step: HandbookReadingStep;
  direction: "prev" | "next";
}) {
  const forward = direction === "next";
  const label = step.crossesSection
    ? forward
      ? "다음 섹션 →"
      : "← 이전 섹션"
    : forward
      ? "다음 →"
      : "← 이전";

  return (
    <Link
      to={`/handbook/${layerId}/${step.doc.slug}`}
      className={`flex min-h-11 flex-col justify-center rounded-xl border border-border px-4 py-3.5 hover:bg-muted/50 ${
        forward ? "text-right sm:text-right" : ""
      }`}
    >
      <span className="block text-xs text-muted-foreground">{label}</span>
      <span className="block text-sm font-medium text-foreground">{step.doc.title}</span>
      {step.crossesSection && (
        <span className="mt-0.5 block text-xs text-muted-foreground">{step.section.title}</span>
      )}
    </Link>
  );
}

function DocPager({
  layerId,
  slug,
  sectionTitle,
  sectionHref,
}: {
  layerId: string;
  slug: string;
  sectionTitle: string;
  sectionHref: string;
}) {
  const { prev, next } = getReadingSteps(layerId, slug);

  useEffect(() => {
    if (window.location.hash) return;
    window.scrollTo({ top: 0 });
  }, [layerId, slug]);

  return (
    <nav aria-label="문서 이동" className="mt-10 pt-6 border-t border-border">
      <div className="grid gap-3 sm:grid-cols-2">
        {prev ? (
          <StepLink layerId={layerId} step={prev} direction="prev" />
        ) : (
          <span className="hidden sm:block" />
        )}
        {next ? (
          <StepLink layerId={layerId} step={next} direction="next" />
        ) : (
          <Link
            to={sectionHref}
            className="flex min-h-11 flex-col justify-center rounded-xl border border-border px-4 py-3.5 text-right hover:bg-muted/50"
          >
            <span className="block text-xs text-muted-foreground">섹션 끝 · 돌아가기 →</span>
            <span className="block text-sm font-medium text-foreground">{sectionTitle}</span>
          </Link>
        )}
      </div>
    </nav>
  );
}

function useHandbookDoc(layerId: string | undefined, slug: string | undefined) {
  return useMemo(
    () => (layerId && slug ? getHandbookDoc(layerId, slug) : null),
    [layerId, slug]
  );
}

const HandbookView = memo(function HandbookView() {
  const { layerId, slug } = useParams<{ layerId: string; slug: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [content, setContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [markdownVisualReady, setMarkdownVisualReady] = useState(false);

  const meta = useHandbookDoc(layerId, slug);

  const isMdxDoc = Boolean(layerId && slug && hasHandbookDoc(layerId, slug));

  useEffect(() => {
    if (layerId === "core-cs" && slug === "real-system-diagrams") {
      navigate("/handbook/core-cs", { replace: true });
    }
    if (layerId === "core-cs" && slug === "symmetric-asymmetric") {
      navigate("/handbook/core-cs/hash-vs-encryption", { replace: true });
    }
  }, [layerId, slug, navigate]);

  useEffect(() => {
    setMarkdownVisualReady(false);
  }, [layerId, slug]);

  useEffect(() => {
    if (!layerId || !slug) return;
    if (isMdxDoc) return;
    if (layerId === "core-cs" && slug === "real-system-diagrams") return;
    const resolved = getHandbookDoc(layerId, slug);
    if (!resolved) {
      setContent(null);
      setError(null);
      return;
    }

    setError(null);
    setContent(null);
    const url = `${DOC_URL_PREFIX}/${layerId}/${slug}.md`;
    const controller = new AbortController();

    fetch(url, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error("문서를 불러올 수 없습니다.");
        return res.text();
      })
      .then(setContent)
      .catch((err: unknown) => {
        const isAbort = err instanceof Error && err.name === "AbortError";
        if (!isAbort) {
          setError("문서를 불러오는 중 오류가 발생했습니다.");
        }
      });

    return () => controller.abort();
  }, [isMdxDoc, layerId, slug]);

  const onMarkdownMermaidSettled = useCallback(() => {
    setMarkdownVisualReady(true);
  }, []);

  useLayoutEffect(() => {
    if (!layerId || !slug) return;
    const hash = window.location.hash.slice(1);
    const target = hash ? document.getElementById(decodeURIComponent(hash)) : null;
    if (target) {
      target.scrollIntoView({ block: "start" });
      return;
    }
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [layerId, slug]);

  if (layerId === "core-cs" && (slug === "real-system-diagrams" || slug === "symmetric-asymmetric")) {
    return null;
  }

  if (!layerId || !slug) {
    return (
      <main className={MAIN_CLASS}>
        <p className="text-muted-foreground">잘못된 경로입니다.</p>
        <button
          type="button"
          onClick={() => navigate("/handbook")}
          className="mt-4 text-primary hover:underline"
        >
          핸드북 목록으로
        </button>
      </main>
    );
  }

  if (!meta) {
    return (
      <main className={MAIN_CLASS}>
        <p className="text-muted-foreground">문서 정보를 찾을 수 없습니다.</p>
        <button
          type="button"
          onClick={() => navigate("/handbook")}
          className="mt-4 text-primary hover:underline"
        >
          핸드북 목록으로
        </button>
      </main>
    );
  }

  if (error) {
    return (
      <main className={MAIN_CLASS}>
        <p className="text-muted-foreground">{error}</p>
        <button
          type="button"
          onClick={() => navigate(`/handbook/${layerId}`)}
          className="mt-4 text-primary hover:underline"
        >
          {meta.layer.title} 목차로
        </button>
      </main>
    );
  }

  if (!isMdxDoc && content === null) {
    return (
      <main
        className={`${MAIN_CLASS} flex justify-center items-center min-h-[200px]`}
      >
        <LoadingSpinner />
      </main>
    );
  }

  const sectionPosition = getDocSectionPosition(meta.layer.id, meta.doc.slug);
  const hasSectionPages = LAYERS_WITH_SECTION_PAGES.includes(meta.layer.id);
  const sectionHref = hasSectionPages
    ? handbookSectionPath(meta.layer.id, meta.section.id)
    : undefined;
  const backScrollHash = hasSectionPages
    ? null
    : (location.state as { scrollBackHash?: string } | null)?.scrollBackHash ??
      (typeof window !== "undefined" ? sessionStorage.getItem(SCROLL_BACK_KEY) : null);
  const backToDiagramHref = hasSectionPages
    ? sectionHref
    : LAYERS_WITH_DIAGRAM.includes(meta.layer.id) && getDiagramConfig(meta.layer.id)
      ? `/handbook/${meta.layer.id}${backScrollHash ?? ""}`
      : undefined;

  const Doc = layerId && slug ? getHandbookDocComponent(layerId, slug) : null;
  const mdxComponent = Doc ? <Doc /> : null;

  return (
    <HandbookLayout
      layerTitle={meta.layer.title}
      layerHref={hasSectionPages ? `/handbook/${meta.layer.id}` : undefined}
      sectionTitle={meta.section.title}
      sectionIndex={sectionPosition?.index}
      sectionCount={sectionPosition?.total}
      docTitle={meta.doc.title}
      backToDiagramHref={backToDiagramHref}
      centerReadingColumn
      backLabel={hasSectionPages ? "섹션으로 돌아가기" : undefined}
    >
      {isMdxDoc && (
        <HandbookContentReadyProvider
          key={`${layerId}-${slug}`}
          fallback={<LoadingSpinner />}
        >
          <div className="handbook-doc-content w-full">
            <div className="markdown-body">{mdxComponent}</div>
          </div>
        </HandbookContentReadyProvider>
      )}
      {!isMdxDoc && content !== null && (
        <div className="relative handbook-doc-content min-h-[200px] w-full">
          <MarkdownViewer
            key={`${layerId}-${slug}`}
            content={content}
            onMermaidSettled={onMarkdownMermaidSettled}
          />
          {!markdownVisualReady ? (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/85 backdrop-blur-[1px]">
              <LoadingSpinner />
            </div>
          ) : null}
        </div>
      )}
      {hasSectionPages && sectionHref ? (
        <DocPager
          layerId={meta.layer.id}
          slug={meta.doc.slug}
          sectionTitle={meta.section.title}
          sectionHref={sectionHref}
        />
      ) : (
        <RelatedInSection
          layerId={meta.layer.id}
          sectionTitle={meta.section.title}
          docs={meta.section.docs}
          currentSlug={meta.doc.slug}
        />
      )}
    </HandbookLayout>
  );
});

export default HandbookView;
