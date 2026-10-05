import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import {
  getSectionOfDoc,
  handbookSectionPath,
  type HandbookLayer,
} from "../../constants/handbookManifest";

const MAIN_CLASS = "flex flex-col items-center p-4 max-w-3xl mx-auto";

/** 이름이 바뀐 섹션의 예전 id → 현재 id */
const RENAMED_SECTION_IDS: Record<string, string> = {
  "ai-agent": "ai-basics",
};

/** 예전 한 장짜리 레이어 페이지의 해시(#section-*, #doc-<n>-<slug>)를 섹션 페이지 경로로 바꿉니다. */
function legacyHashToSectionPath(layer: HandbookLayer, hash: string): string | null {
  if (hash.startsWith("section-")) {
    const rawId = hash.slice("section-".length);
    const sectionId = RENAMED_SECTION_IDS[rawId] ?? rawId;
    return layer.sections.some((s) => s.id === sectionId)
      ? handbookSectionPath(layer.id, sectionId)
      : null;
  }
  const docMatch = /^doc-\d+-(.+)$/.exec(hash);
  if (docMatch) {
    const section = getSectionOfDoc(layer.id, docMatch[1]);
    return section ? handbookSectionPath(layer.id, section.id) : null;
  }
  return null;
}

export function LayerSectionListPage({ layer }: { layer: HandbookLayer }) {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const hash = location.hash.slice(1);
    if (!hash) return;
    const target = legacyHashToSectionPath(layer, hash);
    if (target) navigate(target, { replace: true });
  }, [layer, location.hash, navigate]);

  return (
    <main className={MAIN_CLASS}>
      <div className="w-full mb-6">
        <Link to="/handbook" className="text-sm text-muted-foreground hover:text-foreground">
          ← 핸드북 목록
        </Link>
        <h1 className="text-xl font-bold mt-2 text-foreground">{layer.title}</h1>
        {layer.description && (
          <p className="text-sm text-muted-foreground mt-1">{layer.description}</p>
        )}
        <p className="text-xs text-muted-foreground mt-3">
          위에서부터 순서대로 읽으면 앞 섹션의 개념을 뒤 섹션에서 다시 씁니다.
        </p>
      </div>

      <ol className="w-full space-y-3">
        {layer.sections.map((section) => (
          <li key={section.id}>
            <Link to={handbookSectionPath(layer.id, section.id)}>
              <Card className="hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer">
                <CardHeader className="pb-2">
                  <div className="flex items-baseline justify-between gap-3">
                    <CardTitle className="text-base text-foreground">{section.title}</CardTitle>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      문서 {section.docs.length}개
                    </span>
                  </div>
                </CardHeader>
                {section.summary && (
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground">{section.summary}</p>
                  </CardContent>
                )}
              </Card>
            </Link>
          </li>
        ))}
      </ol>
    </main>
  );
}
