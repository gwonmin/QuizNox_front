import { MermaidDiagramWithLinks } from "@/components/handbook/MermaidDiagramWithLinks";

export default function AiBasics() {
  return (
    <>
      <MermaidDiagramWithLinks
        diagramIndex={8}
        code={`flowchart LR
        subgraph llm [모델 호출]
          LLM["LLM 기초"]
        end
        subgraph retrieval [고정 파이프라인]
          RAG["RAG"]
        end
        llm --> retrieval`}
      />
    </>
  );
}
