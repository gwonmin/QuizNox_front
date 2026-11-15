import { SectionSummary } from "@/components/handbook/SectionSummary";
import { KeyTable } from "@/components/handbook/KeyTable";
import { MermaidDiagram } from "@/components/handbook/MermaidDiagram";
import { DocLink } from "@/components/handbook/DocLink";

export default function AiAgent() {
  return (
    <>
      <SectionSummary
        lead="AI Agent는 모델이 목표를 받은 뒤, 계획·도구 호출·관찰을 반복하며 다음 행동을 스스로 고르는 시스템이다. 순서가 코드로 고정된 요약·분류·RAG는 Agent가 아니다."
        bullets={[
          "한 번 호출은 질문에서 답으로 끝난다. Agent는 관찰 결과에 따라 다음 도구와 단계를 다시 정한다.",
          "RAG 파이프라인은 검색 후 생성으로 순서가 고정된다. Agent 안에서는 검색이 도구 하나가 되어, 검색할지를 모델이 판단한다.",
          "Agent의 설계는 Prompt · Context · Harness · Loop · Graph 다섯 영역으로 나뉜다. 다섯 영역은 한 Agent에서 함께 정한다.",
        ]}
      />

      <h2>누가 다음 단계를 정하나</h2>

      <p>앞 섹션 <strong>10. LLM Application Engineering</strong>까지는 단계의 순서를 코드가 정했다. 이 섹션은 그 결정을 모델에게 넘긴 구조를 다룬다.</p>

      <MermaidDiagram
        code={`flowchart TB
        subgraph one ["한 번 호출"]
          direction LR
          I1["입력"] --> M1["Model"] --> O1["출력"]
        end
        subgraph fixed ["고정 파이프라인 (예: RAG) · 순서는 코드가 정한다"]
          direction LR
          I2["입력"] --> S2["검색"] --> M2["Model"] --> O2["출력"]
        end
        subgraph agent ["Agent · 순서는 모델이 정한다"]
          direction LR
          I3["목표"] --> M3["Model"]
          M3 -->|"도구 선택"| T3["도구 실행"]
          T3 -->|"관찰"| M3
          M3 -->|"목표 달성"| O3["출력"]
        end
        one ~~~ fixed
        fixed ~~~ agent`}
      />

      <h2>한 번 호출과 Agent</h2>

      <KeyTable
        columns={["구분", "일반 LLM 호출", "AI Agent"]}
        rows={[
          [
            "동작 방식",
            "질문 → 답변 (1회성)",
            "목표 → 계획 → 도구 사용 → 관찰 → 재계획 (반복 루프)",
          ],
          [
            "외부 상호작용",
            "없음 (텍스트 생성만)",
            "API 호출, DB 조회, 파일 읽기/쓰기, 웹 검색 등",
          ],
          [
            "상태 관리",
            "컨텍스트 윈도우 내에서만",
            "단기 메모리(대화 이력) + 장기 메모리(벡터 DB 등)",
          ],
          [
            "자율성",
            "사용자가 매번 지시",
            "목표만 주면 중간 단계를 자율적으로 결정",
          ],
        ]}
      />

      <p>
        모델 자체는 입력 토큰을 받아 다음 토큰을 예측할 뿐이다. 반복·도구·기억을 붙이는 코드는{" "}
        <DocLink slug="agent-harness">Agent Harness</DocLink>가 맡는다.
      </p>

      <h2>LLM 기반 AI Agent 엔지니어링의 5가지 핵심 설계 영역</h2>

      <p>Agent 하나를 만들 때 정해야 하는 것을 다섯 영역으로 나눈다. 영역마다 답하는 질문이 다르고, 다섯 영역은 Agent를 만드는 동안 함께 정한다. 지시문을 고치면 필요한 컨텍스트가 달라지고, 도구를 바꾸면 루프의 종료 조건도 다시 봐야 한다.</p>

      <MermaidDiagram
        code={`flowchart LR
        subgraph input ["모델에게 주는 것"]
          P["Prompt\n(Instruction)\n무엇을 하라고 지시하나"]
          C["Context\n(Information)\n이번 호출에 무엇을 보여 주나"]
        end
        M(["Model (LLM)"])
        subgraph around ["모델을 둘러싼 것"]
          H["Harness\n(Runtime & Reliability)\n도구 호출 제어 · 권한\n상태 복구 · 실패 처리"]
          L["Loop\n(Iteration & Feedback)\n어떻게 반복하고 언제 멈추나"]
          G["Graph\n(Orchestration & State)\n상태 전이 · 분기 · 병렬 · 병합"]
        end
        P --- M
        C --- M
        M --- H
        M --- L
        M --- G`}
      />

      <KeyTable
        columns={["설계 영역", "답하는 질문", "문서"]}
        rows={[
          [
            "Prompt Engineering (Instruction)",
            "Agent에게 무엇을 하라고 지시하나. 역할, 도구 사용 정책, 멈추는 조건",
            <DocLink slug="agent-instructions">Agent Instructions</DocLink>,
          ],
          [
            "Context Engineering (Information)",
            "이번 호출에 무엇을 넣고 무엇을 빼나. 검색 결과, 기억, 도구 결과, 대화 이력",
            <DocLink slug="context-engineering">Context Engineering</DocLink>,
          ],
          [
            "Harness Engineering (Runtime & Reliability)",
            "모델의 출력을 누가 검증하고 실행하나. 도구 호출 제어, 권한, 상태 복구, 실패 처리",
            <>
              <DocLink slug="agent-harness">Agent Harness</DocLink>, <DocLink slug="agent-tool-use">Tool Use</DocLink>,{" "}
              <DocLink slug="agent-guardrails-authz">Guardrails / Identity / Authorization</DocLink>,{" "}
              <DocLink slug="agent-hitl">Human-in-the-Loop</DocLink>,{" "}
              <DocLink slug="agent-observability">Observability & Tracing</DocLink>,{" "}
              <DocLink slug="agent-reliability">Reliability</DocLink>
            </>,
          ],
          [
            "Loop Engineering (Iteration & Feedback)",
            "어떻게 반복하고 언제 멈추나. 결과를 어떻게 평가해 되먹이나",
            <>
              <DocLink slug="agent-loop">Agent Loop</DocLink>, <DocLink slug="agent-eval">Agent Evaluation</DocLink>
            </>,
          ],
          [
            "Graph Engineering (Orchestration & State)",
            "여러 단계와 여러 Agent를 어떻게 엮나. 상태 전이, 분기, 병렬 실행, 결과 병합",
            <>
              <DocLink slug="agent-state-memory">State & Memory</DocLink>,{" "}
              <DocLink slug="agent-orchestration">Orchestration</DocLink>
            </>,
          ],
        ]}
      />

      <p>이 다섯 이름은 관심이 넓어진 흐름으로 설명되기도 한다. 지시문 한 줄을 다듬던 데서(Prompt), 모델이 보는 정보 전체로(Context), 모델을 감싼 실행 환경으로(Harness), 반복 구조로(Loop), 여러 단계의 구조로(Graph) 설계 대상이 넓어져 왔다. 지금 Agent를 만들 때는 다섯을 함께 설계한다.</p>

      <h2>구성 요소</h2>

      <p>Agent를 소개할 때 흔히 쓰는 구성 요소 그림이다. 각 요소는 위 다섯 영역의 문서에서 설계한다.</p>

      <MermaidDiagram
        code={`flowchart TB
        LLM["LLM\n(두뇌)"]

        subgraph components ["핵심 구성 요소"]
          PLAN["Planning\n(계획 수립)"]
          TOOL["Tool Use\n(도구 호출)"]
          MEM["Memory\n(기억)"]
          REF["Reflection\n(자기 평가)"]
        end

        LLM --> PLAN
        LLM --> TOOL
        LLM --> MEM
        LLM --> REF
        REF -->|"개선"| PLAN`}
      />

      <KeyTable
        columns={["구성 요소", "역할", "이어서 보는 문서"]}
        rows={[
          [
            "Planning · Reflection",
            "목표를 하위 작업으로 나누고, 결과를 보고 다른 접근을 시도한다.",
            <DocLink slug="agent-loop">Agent Loop</DocLink>,
          ],
          [
            "Tool Use",
            "API·DB·검색처럼 모델 혼자서는 못 하는 일을 호출한다.",
            <DocLink slug="agent-tool-use">Tool Use</DocLink>,
          ],
          [
            "Memory",
            "대화 이력(단기)과 실행이 끝난 뒤에도 남는 정보(장기)를 다시 꺼낸다.",
            <DocLink slug="agent-state-memory">State & Memory</DocLink>,
          ],
        ]}
      />

      <h2>RAG를 도구로 두는 시점</h2>

      <p>
        사내 문서로 답하는 일이 항상 검색이면{" "}
        <DocLink slug="rag">RAG</DocLink> 파이프라인으로 충분하다. 질문이 올 때마다 검색이 필요한지, 날씨 API나 웹 검색을 먼저 쳐야 하는지가 달라지면 Retriever를 도구로 등록하고 루프에 맡긴다. 여행 일정처럼 날씨, 관광지 검색, 사내 가이드 검색을 결과를 보고 고르는 경우가 그 예다. 그 조립은{" "}
        <DocLink slug="agent-orchestration">Orchestration</DocLink>의 LangGraph 절에서 본다.
      </p>

      <h2>루프가 필요 없는 경우</h2>

      <p>
        분류 다음 검색 다음 답변처럼 경로를 코드로 정할 수 있으면 루프를 쓰지 않는다. 더 싸고, 실패 지점이 보인다. 판단 기준은{" "}
        <DocLink slug="agent-loop">Agent Loop</DocLink>의 「루프가 필요 없는 경우」에서 다룬다.
      </p>

      <h2>앞 섹션과 맞닿는 주제</h2>

      <KeyTable
        columns={["주제", "10. LLM Application Engineering", "이 섹션"]}
        rows={[
          ["프롬프트", <><DocLink slug="llm-basics">LLM 기초</DocLink>: 한 번 호출의 기법</>, <><DocLink slug="agent-instructions">Agent Instructions</DocLink>: 여러 턴 동안 유지되는 지시</>],
          ["검색", <><DocLink slug="rag">RAG</DocLink>: 코드가 항상 검색한다</>, <><DocLink slug="agent-tool-use">Tool Use</DocLink>: 모델이 검색할지 고른다</>],
          ["모델 선택", <><DocLink slug="model-routing">Model Strategy / Routing</DocLink>: 규칙 · cascade · fallback</>, <><DocLink slug="agent-orchestration">Orchestration</DocLink>: 노드마다 같은 원칙으로 배정</>],
          ["평가", <><DocLink slug="llmops">LLMOps</DocLink>: 답변 품질, 릴리스 기준</>, <><DocLink slug="agent-eval">Agent Evaluation</DocLink>: 도구 순서와 행동 궤적</>],
          ["추적", <><DocLink slug="llmops">LLMOps</DocLink>: 요청 단위 토큰 · 비용</>, <><DocLink slug="agent-observability">Observability & Tracing</DocLink>: 단계별 span</>],
        ]}
      />

      <h2>요약</h2>

      <KeyTable
        columns={["핵심 포인트", "설명"]}
        rows={[
          [
            "Agent = 루프 + 도구 + 상태",
            "한 번 호출과 달리, 관찰 결과에 따라 다음 행동을 모델이 고른다.",
          ],
          [
            "고정된 순서는 파이프라인",
            "요약·분류·항상 검색하는 RAG는 10. LLM Application Engineering에서 끝낸다.",
          ],
          [
            "설계 영역은 다섯",
            "Prompt, Context, Harness, Loop, Graph. 한 Agent에서 함께 정하는 영역이다.",
          ],
          [
            "RAG는 도구가 될 수 있다",
            "검색이 필요한지를 매번 판단해야 할 때만 Retriever를 루프에 넣는다.",
          ],
          ["다음 문서", "다섯 영역 중 Prompt에 해당하는 Agent Instructions부터 본다."],
        ]}
      />
    </>
  );
}
