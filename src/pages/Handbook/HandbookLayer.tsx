import { memo } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle } from "../../components/ui/card";
import { getHandbookLayer } from "../../constants/handbookManifest";
import { getDiagramConfig } from "../../constants/handbookLayerDiagramConfig";
import { CoreCSDiagramPage } from "./CoreCSDiagramPage";
import { LayerDiagramPage } from "./LayerDiagramPage";

const MAIN_CLASS = "flex flex-col items-center p-4 max-w-3xl mx-auto";

const LAYERS_WITH_DIAGRAM = ["core-cs", "aws-common", "saa", "dva", "soa"];

function HandbookLayer() {
  const { layerId } = useParams<{ layerId: string }>();
  const navigate = useNavigate();
  const layer = layerId ? getHandbookLayer(layerId) : undefined;
  const hasDiagram = layerId && LAYERS_WITH_DIAGRAM.includes(layerId) && getDiagramConfig(layerId);

  if (layerId === "core-cs") {
    return <CoreCSDiagramPage />;
  }
  if (hasDiagram && layerId) {
    return <LayerDiagramPage />;
  }

  if (!layerId || !layer) {
    return (
      <main className={MAIN_CLASS}>
        <p className="text-muted-foreground mb-4">존재하지 않는 레이어입니다.</p>
        <button
          type="button"
          onClick={() => navigate("/handbook")}
          className="text-primary hover:underline"
        >
          핸드북 목록으로
        </button>
      </main>
    );
  }

  return (
    <main className={MAIN_CLASS}>
      <div className="w-full mb-4">
        <Link
          to="/handbook"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← 핸드북 목록
        </Link>
        <h1 className="text-xl font-bold mt-2 text-foreground">{layer.title}</h1>
        {layer.description && (
          <p className="text-sm text-muted-foreground mt-1">
            {layer.description}
          </p>
        )}
      </div>

      <nav
        className="w-full mb-6 py-3 px-4 rounded-lg bg-muted/50 border border-border"
        aria-label="이 레이어 구성"
      >
        <p className="text-xs font-medium text-muted-foreground mb-2">
          이 레이어 구성
        </p>
        <ul className="flex flex-wrap gap-x-1 gap-y-1">
          {layer.sections.map((section, i) => (
            <li key={section.id} className="inline">
              <a
                href={`#section-${section.id}`}
                className="text-sm text-primary hover:underline"
              >
                {section.title}
              </a>
              {i < layer.sections.length - 1 && (
                <span className="text-muted-foreground/60 mx-1.5">·</span>
              )}
            </li>
          ))}
        </ul>
      </nav>

      <ul className="w-full space-y-6">
        {layer.sections.map((section) => (
          <li key={section.id} id={`section-${section.id}`}>
            <h2 className="text-sm font-semibold text-foreground mb-2 sticky top-0 bg-background/95 py-1">
              {section.title}
            </h2>
            <ul className="space-y-2">
              {section.docs.map((doc) => (
                <li key={doc.slug}>
                  <Link to={`/handbook/${layer.id}/${doc.slug}`}>
                    <Card className="hover:shadow-md transition-all active:scale-[0.99] cursor-pointer">
                      <CardHeader className="py-3 px-4">
                        <CardTitle className="text-sm font-medium text-foreground">
                          {doc.title}
                        </CardTitle>
                      </CardHeader>
                    </Card>
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </main>
  );
}

export default memo(HandbookLayer);
