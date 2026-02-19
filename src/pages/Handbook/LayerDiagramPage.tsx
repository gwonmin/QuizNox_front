import { useEffect, useRef, useState } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { MarkdownViewer } from "../../components/MarkdownViewer";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { getHandbookLayer } from "../../constants/handbookManifest";
import { getDiagramConfig } from "../../constants/handbookLayerDiagramConfig";

const MAIN_CLASS = "max-w-4xl mx-auto px-4 py-8";
const SCROLL_BACK_KEY = "handbookScrollBackHash";

const diagramContentCache: Record<string, string> = {};

export function LayerDiagramPage() {
  const { layerId } = useParams<{ layerId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [content, setContent] = useState<string | null>(() =>
    layerId ? diagramContentCache[layerId] ?? null : null
  );
  const [error, setError] = useState<string | null>(null);
  const diagramRef = useRef<HTMLDivElement>(null);

  const layer = layerId ? getHandbookLayer(layerId) : undefined;
  const config = layerId ? getDiagramConfig(layerId) : null;

  useEffect(() => {
    if (!content || !layer) return;
    const fromStorage = sessionStorage.getItem(SCROLL_BACK_KEY);
    const hash = window.location.hash?.slice(1);
    const scrollToId = (fromStorage?.startsWith("#") ? fromStorage.slice(1) : fromStorage) || (hash?.startsWith("doc-") ? hash : null);

    if (scrollToId?.startsWith("doc-")) {
      const POLL_MS = 80;
      const MAX_WAIT_MS = 6000;
      const started = Date.now();
      const interval = setInterval(() => {
        const el = document.getElementById(scrollToId);
        if (el) {
          clearInterval(interval);
          sessionStorage.removeItem(SCROLL_BACK_KEY);
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        } else if (Date.now() - started > MAX_WAIT_MS) {
          clearInterval(interval);
        }
      }, POLL_MS);
      return () => clearInterval(interval);
    }

    if (hash === "diagram" || !hash) {
      const t = setTimeout(
        () => diagramRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
        100
      );
      return () => clearTimeout(t);
    }
  }, [content, layer, location.hash]);

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
          onDiagramLinkClick={(path, scrollHash) => {
          if (scrollHash) sessionStorage.setItem(SCROLL_BACK_KEY, scrollHash);
          navigate(path);
        }}
        />
      </div>
    </main>
  );
}
