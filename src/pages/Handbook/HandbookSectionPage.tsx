import { memo, useCallback, useEffect, useMemo, type ComponentType } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Card, CardHeader, CardTitle } from "../../components/ui/card";
import { DiagramLinksContext } from "../../contexts/DiagramLinksContext";
import {
  getAdjacentSections,
  getHandbookSection,
  handbookSectionPath,
} from "../../constants/handbookManifest";
import {
  getDiagramConfig,
  LAYERS_WITH_SECTION_PAGES,
} from "../../constants/handbookLayerDiagramConfig";
import { CORE_CS_SECTION_DIAGRAMS } from "./mdx/core-cs/sections";
import "github-markdown-css/github-markdown.css";
import "../../styles/markdown-theme.css";

const MAIN_CLASS = "max-w-4xl mx-auto px-4 py-8";

const SECTION_DIAGRAMS: Record<string, Record<string, ComponentType>> = {
  "core-cs": CORE_CS_SECTION_DIAGRAMS,
};

function HandbookSectionPage() {
  const { layerId, sectionId } = useParams<{ layerId: string; sectionId: string }>();
  const navigate = useNavigate();

  const found =
    layerId && sectionId && LAYERS_WITH_SECTION_PAGES.includes(layerId)
      ? getHandbookSection(layerId, sectionId)
      : null;

  const diagramLinks = useMemo(
    () => (layerId ? getDiagramConfig(layerId)?.diagramLinks ?? {} : {}),
    [layerId]
  );
  const onDiagramLinkClick = useCallback((path: string) => navigate(path), [navigate]);
  const linksContext = useMemo(
    () => ({ diagramLinks, onDiagramLinkClick }),
    [diagramLinks, onDiagramLinkClick]
  );

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [layerId, sectionId]);

  if (!found || !layerId) {
    return (
      <main className={MAIN_CLASS}>
        <p className="text-muted-foreground mb-4">존재하지 않는 섹션입니다.</p>
        <Link to={layerId ? `/handbook/${layerId}` : "/handbook"} className="text-primary hover:underline">
          섹션 목록으로
        </Link>
      </main>
    );
  }

  const { layer, section } = found;
  const Diagram = SECTION_DIAGRAMS[layer.id]?.[section.id];
  const { prev, next } = getAdjacentSections(layer.id, section.id);

  return (
    <main className={MAIN_CLASS}>
      <nav aria-label="breadcrumb" className="text-sm text-muted-foreground">
        <Link to="/handbook" className="hover:text-foreground">
          핸드북
        </Link>
        <span className="mx-1.5 text-muted-foreground/70">/</span>
        <Link to={`/handbook/${layer.id}`} className="hover:text-foreground">
          {layer.title}
        </Link>
      </nav>

      <h1 className="text-xl font-bold mt-3 text-foreground">{section.title}</h1>

      {section.why && (
        <section className="mt-4">
          <h2 className="text-sm font-semibold text-foreground">왜 배우나요?</h2>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{section.why}</p>
        </section>
      )}

      {Diagram && (
        <section className="mt-6" aria-labelledby="section-diagram-title">
          <h2 id="section-diagram-title" className="text-sm font-semibold text-foreground">
            한눈에 보기
          </h2>
          {section.flow && <p className="mt-1 text-sm text-muted-foreground">{section.flow}</p>}
          <p className="mt-1 text-xs text-muted-foreground">박스를 누르면 해당 개념 문서로 이동합니다.</p>
          <div className="handbook-doc-content">
            <div className="markdown-body">
              <DiagramLinksContext.Provider value={linksContext}>
                <Diagram />
              </DiagramLinksContext.Provider>
            </div>
          </div>
        </section>
      )}

      <section className="mt-6" aria-labelledby="section-docs-title">
        <h2 id="section-docs-title" className="text-sm font-semibold text-foreground mb-2">
          학습 순서
        </h2>
        <ol className="space-y-2">
          {section.docs.map((doc, i) => (
            <li key={doc.slug}>
              <Link to={`/handbook/${layer.id}/${doc.slug}`}>
                <Card className="hover:shadow-md transition-all active:scale-[0.99] cursor-pointer">
                  <CardHeader className="py-3 px-4 flex-row items-baseline gap-3 space-y-0">
                    <span className="w-5 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
                      {i + 1}
                    </span>
                    <CardTitle className="text-sm font-medium leading-snug text-foreground">
                      {doc.title}
                    </CardTitle>
                  </CardHeader>
                </Card>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <nav
        aria-label="섹션 이동"
        className="mt-10 pt-4 border-t border-border flex justify-between gap-4 text-sm"
      >
        {prev ? (
          <Link to={handbookSectionPath(layer.id, prev.id)} className="text-muted-foreground hover:text-foreground">
            ← {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            to={handbookSectionPath(layer.id, next.id)}
            className="text-right text-muted-foreground hover:text-foreground"
          >
            {next.title} →
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </main>
  );
}

export default memo(HandbookSectionPage);
