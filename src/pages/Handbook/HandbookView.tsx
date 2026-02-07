import { memo, useEffect, useMemo, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { MarkdownViewer } from "../../components/MarkdownViewer";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { getHandbookDoc } from "../../constants/handbookManifest";
import { getDiagramConfig } from "../../constants/handbookLayerDiagramConfig";

const DOC_URL_PREFIX = "/handbook";
const LAYERS_WITH_DIAGRAM = ["core-cs", "aws-common", "saa", "dva", "soa"];
const MAIN_CLASS = "max-w-4xl mx-auto px-4 py-8";

function DocHeader({
  layerId,
  layerTitle,
  sectionTitle,
  sectionId,
}: {
  layerId: string;
  layerTitle: string;
  sectionTitle: string;
  sectionId?: string;
}) {
  const hasDiagram = layerId && LAYERS_WITH_DIAGRAM.includes(layerId) && getDiagramConfig(layerId);
  const diagramHref =
    hasDiagram && layerId && sectionId
      ? `/handbook/${layerId}#section-${sectionId}`
      : hasDiagram && layerId
        ? `/handbook/${layerId}#diagram`
        : `/handbook/${layerId}`;
  return (
    <header className="mb-6">
      <nav aria-label="breadcrumb" className="text-sm text-muted-foreground">
        <Link to="/handbook" className="hover:text-foreground">
          핸드북
        </Link>
        <span className="mx-1.5 text-muted-foreground/70">/</span>
        <Link to={diagramHref} className="hover:text-foreground">
          {hasDiagram ? "← 이전 (다이어그램)" : `${layerTitle} · ${sectionTitle}`}
        </Link>
      </nav>
    </header>
  );
}

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

function useHandbookDoc(layerId: string | undefined, slug: string | undefined) {
  return useMemo(
    () => (layerId && slug ? getHandbookDoc(layerId, slug) : null),
    [layerId, slug]
  );
}

const HandbookView = memo(function HandbookView() {
  const { layerId, slug } = useParams<{ layerId: string; slug: string }>();
  const navigate = useNavigate();
  const [content, setContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const meta = useHandbookDoc(layerId, slug);

  useEffect(() => {
    if (layerId === "core-cs" && slug === "real-system-diagrams") {
      navigate("/handbook/core-cs", { replace: true });
    }
    if (layerId === "core-cs" && slug === "symmetric-asymmetric") {
      navigate("/handbook/core-cs/hash-vs-encryption", { replace: true });
    }
  }, [layerId, slug, navigate]);

  if (layerId === "core-cs" && (slug === "real-system-diagrams" || slug === "symmetric-asymmetric")) {
    return null;
  }

  useEffect(() => {
    if (!layerId || !slug) return;
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
  }, [layerId, slug]);

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

  if (content === null) {
    return (
      <main
        className={`${MAIN_CLASS} flex justify-center items-center min-h-[200px]`}
      >
        <LoadingSpinner />
      </main>
    );
  }

  return (
    <main className={MAIN_CLASS}>
      <DocHeader
        layerId={meta.layer.id}
        layerTitle={meta.layer.title}
        sectionTitle={meta.section.title}
        sectionId={meta.section.id}
      />
      <MarkdownViewer
        key={`${layerId}-${slug}`}
        content={content}
        className="max-w-4xl"
      />
      <RelatedInSection
        layerId={meta.layer.id}
        sectionTitle={meta.section.title}
        docs={meta.section.docs}
        currentSlug={meta.doc.slug}
      />
    </main>
  );
});

export default HandbookView;
