import { MermaidDiagramWithLinks } from "@/components/handbook/MermaidDiagramWithLinks";

export default function AiBasics() {
  return (
    <>
      <MermaidDiagramWithLinks
        diagramIndex={9}
        code={`flowchart TB
        subgraph app [순서를 코드가 정하는 애플리케이션]
          REQ(["요청"])
          RAG["RAG"]
          MS["Model Strategy"]
          LLM["LLM 기초"]
          RES(["응답"])
          REQ --> RAG
          RAG -->|"찾은 문서를 프롬프트에"| MS
          MS -->|"배정한 모델로 호출"| LLM
          LLM --> RES
        end
        OPS["LLMOps"]
        RES -.->|"요청별 추적 · 비용"| OPS
        OPS -.->|"평가를 통과한 버전만 릴리스"| app`}
      />
    </>
  );
}
