import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MarkdownViewer } from "../../components/MarkdownViewer";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { REAL_SYSTEM_DIAGRAM_LINKS } from "../../constants/handbookDiagramLinks";

const CORE_CS_DIAGRAM_URL = "/handbook/core-cs/real-system-diagrams.md";
const MAIN_CLASS = "max-w-4xl mx-auto px-4 py-8";

let coreCsDiagramCache: string | null = null;

export function CoreCSDiagramPage() {
  const [content, setContent] = useState<string | null>(() => coreCsDiagramCache);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const diagramRef = useRef<HTMLDivElement>(null);

  const H2_TO_SECTION_ID: Record<string, string> = {
    "1. 네트워크": "section-network",
    "2. 분산 시스템": "section-distributed",
    "3. 보안 기본": "section-security-basics",
    "4. 운영 & 신뢰성": "section-operations-reliability",
  };

  useEffect(() => {
    if (!content) return;
    const wrapper = diagramRef.current;
    if (wrapper) {
      wrapper.querySelectorAll("h2").forEach((el) => {
        const text = el.textContent?.trim();
        if (text && H2_TO_SECTION_ID[text]) (el as HTMLElement).id = H2_TO_SECTION_ID[text];
      });
    }

    const hash = window.location.hash?.slice(1);
    const scrollToTarget = () => {
      if (hash?.startsWith("section-")) {
        const el = document.getElementById(hash);
        el?.scrollIntoView({ behavior: "smooth", block: "start" });
      } else if (hash === "diagram" || !window.location.hash) {
        diagramRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };
    const t = setTimeout(scrollToTarget, 600);
    return () => clearTimeout(t);
  }, [content]);

  useEffect(() => {
    setError(null);
    if (!coreCsDiagramCache) setContent(null);
    fetch(CORE_CS_DIAGRAM_URL)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load");
        return res.text();
      })
      .then((text) => {
        coreCsDiagramCache = text;
        setContent(text);
      })
      .catch(() => setError("콘텐츠를 불러올 수 없습니다."));
  }, []);

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
      <main className={`${MAIN_CLASS} flex justify-center items-center min-h-[200px]`}>
        <LoadingSpinner />
      </main>
    );
  }

  return (
    <main className={MAIN_CLASS}>
      <div className="mb-6">
        <Link
          to="/handbook"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← 핸드북 목록
        </Link>
        <h1 className="text-xl font-bold mt-2 text-foreground">1. Core CS</h1>
        <p className="text-sm text-muted-foreground mt-1">
          순수 CS 기반 개념 · 실제 구조 흐름 (노드 클릭 시 개념 문서로 이동)
        </p>
      </div>
      <div id="diagram" ref={diagramRef}>
        <MarkdownViewer
          content={content}
          className="max-w-4xl"
          diagramLinks={REAL_SYSTEM_DIAGRAM_LINKS}
          onDiagramLinkClick={(path) => navigate(path)}
        />
      </div>
    </main>
  );
}
