import { MermaidDiagramWithLinks } from "@/components/handbook/MermaidDiagramWithLinks";

/**
 * 다섯 설계 영역은 순서가 없으므로 영역 사이에 화살표를 두지 않는다.
 * 영역이 Prompt · Context · Harness · Loop · Graph 순으로 놓이도록 행마다 direction LR과 ~~~ 체인을 쓴다.
 * 노드 라벨은 handbookDiagramLinks의 키와 맞춘다.
 */
export default function AgentEngineering() {
  return (
    <>
      <MermaidDiagramWithLinks
        diagramIndex={10}
        code={`flowchart TB
        AG["AI Agent"]
        subgraph areas ["LLM 기반 AI Agent 엔지니어링의 5가지 핵심 설계 영역"]
          direction TB
          subgraph given ["모델에게 주는 것"]
            direction LR
            subgraph areaPrompt ["Prompt (Instruction)"]
              INS["Agent Instructions"]
            end
            subgraph areaContext ["Context (Information)"]
              CTX["Context Engineering"]
            end
            areaPrompt ~~~ areaContext
          end
          subgraph around ["모델을 둘러싼 것"]
            direction LR
            subgraph areaHarness ["Harness (Runtime & Reliability)"]
              direction TB
              HAR["Agent Harness"]
              TOOL["Tool Use"]
              GUARD["Guardrails · AuthZ"]
              HITL["HITL"]
              TRACE["Tracing"]
              REL["Reliability"]
              HAR ~~~ TOOL ~~~ GUARD ~~~ HITL ~~~ TRACE ~~~ REL
            end
            subgraph areaLoop ["Loop (Iteration & Feedback)"]
              direction TB
              LOOP["Agent Loop"]
              EVAL["Evaluation"]
              LOOP ~~~ EVAL
            end
            subgraph areaGraph ["Graph (Orchestration & State)"]
              direction TB
              MEM["State & Memory"]
              ORC["Orchestration"]
              MEM ~~~ ORC
            end
            areaHarness ~~~ areaLoop ~~~ areaGraph
          end
          given ~~~ around
        end
        AG --> areas`}
      />
    </>
  );
}
