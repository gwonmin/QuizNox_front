import { MermaidDiagramWithLinks } from "@/components/handbook/MermaidDiagramWithLinks";

export default function AgentEngineering() {
  return (
    <>
      <MermaidDiagramWithLinks
        diagramIndex={9}
        code={`flowchart LR
        subgraph stack [Agent 스택]
          direction TB
          AG["AI Agent"] --> HAR["Agent Harness"]
          MODEL["Model (LLM)"] --> HAR
          HAR --> CTX["Context Engineering"]
          CTX --> MEM["State & Memory"]
          MEM --> LOOP["Agent Loop"]
          LOOP --> TOOL["Tool Use"]
          TOOL --> ORC["Orchestration"]
          ORC --> ACT["Actions"]
          MS["Model Strategy"] -.-> ORC
        end
        subgraph cross [스택 전체를 가로지르는 통제]
          direction TB
          HITL["HITL"] ~~~ GUARD["Guardrails · AuthZ"] ~~~ EVAL["Evaluation"] ~~~ TRACE["Tracing"] ~~~ REL["Reliability"]
        end
        stack ~~~ cross`}
      />
    </>
  );
}
