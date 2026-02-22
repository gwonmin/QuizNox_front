import type React from "react";
import { useEffect, useRef } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { getHandbookLayer } from "../../constants/handbookManifest";
import { getDiagramConfig } from "../../constants/handbookLayerDiagramConfig";
import { injectDiagramLinks } from "../../utils/injectDiagramLinks";

import AwsCommonLayerDiagramMdx from "./mdx/aws-common/AwsCommonLayerDiagram.mdx";
import SaaLayerDiagramMdx from "./mdx/saa/SaaLayerDiagram.mdx";
import DvaLayerDiagramMdx from "./mdx/dva/DvaLayerDiagram.mdx";
import SoaLayerDiagramMdx from "./mdx/soa/SoaLayerDiagram.mdx";

const MAIN_CLASS = "max-w-4xl mx-auto px-4 py-8";
const SCROLL_BACK_KEY = "handbookScrollBackHash";
const DIAGRAM_LINKS_INJECT_DELAY_MS = 1500;

const LAYER_DIAGRAM_MDX: Record<
  string,
  React.ComponentType<Record<string, unknown>>
> = {
  "aws-common": AwsCommonLayerDiagramMdx,
  saa: SaaLayerDiagramMdx,
  dva: DvaLayerDiagramMdx,
  soa: SoaLayerDiagramMdx,
};

export function LayerDiagramPage() {
  const { layerId } = useParams<{ layerId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const diagramRef = useRef<HTMLDivElement>(null);

  const layer = layerId ? getHandbookLayer(layerId) : undefined;
  const config = layerId ? getDiagramConfig(layerId) : null;
  const DiagramContent = layerId ? LAYER_DIAGRAM_MDX[layerId] : null;

  useEffect(() => {
    if (!layer) return;
    const fromStorage = sessionStorage.getItem(SCROLL_BACK_KEY);
    const hash = window.location.hash?.slice(1);
    const scrollToId =
      (fromStorage?.startsWith("#") ? fromStorage.slice(1) : fromStorage) ||
      (hash?.startsWith("doc-") ? hash : null);

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
  }, [layer, location.hash]);

  useEffect(() => {
    if (!diagramRef.current || !config || !DiagramContent) return;
    const timer = setTimeout(() => {
      injectDiagramLinks(
        diagramRef.current!,
        config.diagramLinks,
        (path, scrollHash) => {
          if (scrollHash) sessionStorage.setItem(SCROLL_BACK_KEY, scrollHash);
          navigate(path);
        }
      );
    }, DIAGRAM_LINKS_INJECT_DELAY_MS);
    return () => clearTimeout(timer);
  }, [config, DiagramContent, navigate]);

  if (!layerId || !layer) return null;
  if (!config || !DiagramContent) {
    return (
      <main className={MAIN_CLASS}>
        <p className="text-muted-foreground">다이어그램을 사용할 수 없습니다.</p>
        <Link to="/handbook" className="mt-4 inline-block text-primary hover:underline">
          ← 핸드북 목록
        </Link>
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
        <p className="text-sm text-muted-foreground mt-1">
          아래 다이어그램의 <strong className="font-semibold text-primary">각 박스를 클릭</strong>하면 해당 개념 문서로 이동합니다.
        </p>
      </div>
      <div id="diagram" ref={diagramRef} className="handbook-doc-content">
        <div className="markdown-body">
          <DiagramContent />
        </div>
      </div>
    </main>
  );
}
