import { useEffect, useRef, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { MarkdownViewer } from "../../components/MarkdownViewer";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { getHandbookLayer } from "../../constants/handbookManifest";
import { getDiagramConfig } from "../../constants/handbookLayerDiagramConfig";

const MAIN_CLASS = "max-w-4xl mx-auto px-4 py-8";

const diagramContentCache: Record<string, string> = {};

export function LayerDiagramPage() {
  const { layerId } = useParams<{ layerId: string }>();
  const navigate = useNavigate();
  const [content, setContent] = useState<string | null>(() =>
    layerId ? diagramContentCache[layerId] ?? null : null
  );
  const [error, setError] = useState<string | null>(null);
  const diagramRef = useRef<HTMLDivElement>(null);

  const layer = layerId ? getHandbookLayer(layerId) : undefined;
  const config = layerId ? getDiagramConfig(layerId) : null;

  useEffect(() => {
    if (!content || !layer) return;
    const wrapper = diagramRef.current;
    if (wrapper) {
      wrapper.querySelectorAll("h2").forEach((el) => {
        const text = el.textContent?.trim();
        const section = layer.sections.find((s) => s.title === text);
        if (section) (el as HTMLElement).id = `section-${section.id}`;
      });
    }
    const hash = window.location.hash?.slice(1);
    const scrollToTarget = () => {
      if (hash?.startsWith("section-")) {
        document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
      } else if (hash === "diagram" || !window.location.hash) {
        diagramRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };
    const t = setTimeout(scrollToTarget, 600);
    return () => clearTimeout(t);
  }, [content, layer]);

  useEffect(() => {
    if (!layerId || !config) return;
    setError(null);
    if (!diagramContentCache[layerId]) setContent(null);
    fetch(config.diagramUrl)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load");
        return res.text();
      })
      .then((text) => {
        diagramContentCache[layerId] = text;
        setContent(text);
      })
      .catch(() => {
        setError("콘텐츠를 불러올 수 없습니다.");
      });
  }, [layerId, config]);

  if (!layerId || !layer) return null;
  if (!config) {
    return (
      <main className={MAIN_CLASS}>
        <p className="text-muted-foreground">다이어그램을 사용할 수 없습니다.</p>
        <Link to="/handbook" className="mt-4 inline-block text-primary hover:underline">
          ← 핸드북 목록
        </Link>
      </main>
    );
  }

  if (error) {
    return (
      <main className={MAIN_CLASS}>
        <p className="text-muted-foreground">{error}</p>
        <Link to="/handbook" className="mt-4 inline-block text-primary hover:underline">
          ← 핸드북 목록
        </Link>
      </main>
    );
  }

  if (content === null) {
    return (
      <main className={`${MAIN_CLASS} flex justify-center items-center min-h-[280px]`}>
        <LoadingSpinner />
      </main>
    );
  }

  return (
    <main className={MAIN_CLASS}>
      <div className="mb-6">
        <Link to="/handbook" className="text-sm text-muted-foreground hover:text-foreground">
          ← 핸드북 목록
        </Link>
        <h1 className="text-xl font-bold mt-2 text-foreground">{layer.title}</h1>
        {layer.description && (
          <p className="text-sm text-muted-foreground mt-1">{layer.description}</p>
        )}
        <p className="text-xs text-muted-foreground mt-1">
          노드 클릭 시 해당 문서로 이동
        </p>
      </div>
      <div id="diagram" ref={diagramRef}>
        <MarkdownViewer
          content={content}
          className="max-w-4xl"
          diagramLinks={config.diagramLinks}
          onDiagramLinkClick={(path) => navigate(path)}
        />
      </div>
      <nav className="mt-10 pt-8 border-t border-border" aria-label="섹션별 목차">
        <h2 className="text-sm font-semibold text-foreground mb-3">섹션별 목차</h2>
        <ul className="space-y-4">
          {layer.sections.map((section) => (
            <li key={section.id}>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                {section.title}
              </h3>
              <ul className="flex flex-wrap gap-x-2 gap-y-1">
                {section.docs.map((doc) => (
                  <li key={doc.slug}>
                    <Link
                      to={`/handbook/${layerId}/${doc.slug}`}
                      className="text-sm text-primary hover:underline"
                    >
                      {doc.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </nav>
    </main>
  );
}
