import { useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { DiagramLinksContext } from "../../contexts/DiagramLinksContext";
import { REAL_SYSTEM_DIAGRAM_LINKS } from "../../constants/handbookDiagramLinks";
import RealSystemDiagramsMdx from "./mdx/core-cs/RealSystemDiagrams.mdx";
import "github-markdown-css/github-markdown.css";
import "../../styles/markdown-theme.css";

const MAIN_CLASS = "max-w-4xl mx-auto px-4 py-8";
const SCROLL_BACK_KEY = "handbookScrollBackHash";

export function CoreCSDiagramPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const diagramRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hash = window.location.hash?.slice(1);
    const fromStorage = sessionStorage.getItem(SCROLL_BACK_KEY);
    const scrollBackHash =
      (fromStorage?.startsWith("#") ? fromStorage.slice(1) : fromStorage) ||
      (hash?.startsWith("doc-") ? hash : undefined);

    const scrollToTarget = () => {
      if (scrollBackHash?.startsWith("doc-")) {
        const el = document.getElementById(scrollBackHash);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }
      if (hash?.startsWith("section-")) {
        const el = document.getElementById(hash);
        el?.scrollIntoView({ behavior: "smooth", block: "start" });
      } else if (hash === "diagram" || !window.location.hash) {
        diagramRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

    if (scrollBackHash?.startsWith("doc-")) {
      const POLL_MS = 80;
      const MAX_WAIT_MS = 6000;
      const started = Date.now();
      const interval = setInterval(() => {
        const el = document.getElementById(scrollBackHash);
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

    const t = setTimeout(scrollToTarget, 100);
    return () => clearTimeout(t);
  }, [location.hash, location.state]);

  return (
    <main className={MAIN_CLASS}>
      <div className="mb-6">
        <Link
          to="/handbook"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← 핸드북 목록
        </Link>
        <h1 className="text-xl font-bold mt-2 text-foreground">1. Systems Fundamentals</h1>
        <p className="text-sm text-muted-foreground mt-1">
          아래 다이어그램의 <strong className="font-semibold text-primary">각 박스(IP, DNS, RDB 등)를 클릭</strong>하면 해당 개념 문서로 이동합니다.
        </p>
      </div>
      <div id="diagram" ref={diagramRef} className="markdown-body">
        <DiagramLinksContext.Provider
          value={{
            diagramLinks: REAL_SYSTEM_DIAGRAM_LINKS,
            onDiagramLinkClick: (path, scrollHash) => {
              if (scrollHash) sessionStorage.setItem(SCROLL_BACK_KEY, scrollHash);
              navigate(path);
            },
          }}
        >
          <RealSystemDiagramsMdx />
        </DiagramLinksContext.Provider>
      </div>
    </main>
  );
}
