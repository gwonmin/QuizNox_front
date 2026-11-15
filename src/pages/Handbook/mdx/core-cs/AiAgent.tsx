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
          "루프·도구·상태·권한의 설계는 이 문서 다음의 Harness부터 Reliability까지에서 계층별로 다룬다.",
        ]}
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

      <h2>구성 요소</h2>

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

      <h2>이 섹션에서 이어서 보는 것</h2>

      <KeyTable
        columns={["필요한 설계", "문서"]}
        rows={[
          ["실행 환경, 프레임워크 선택", <DocLink slug="agent-harness">Agent Harness / Runtime</DocLink>],
          ["매 턴 컨텍스트에 무엇을 넣을지", <DocLink slug="context-engineering">Context Engineering</DocLink>],
          ["Memory, Checkpoint", <DocLink slug="agent-state-memory">State & Memory Architecture</DocLink>],
          ["ReAct, Planning, Reflection, 종료 조건", <DocLink slug="agent-loop">Agent Loop</DocLink>],
          ["Function calling, MCP", <DocLink slug="agent-tool-use">Tool Use</DocLink>],
          ["Workflow, Multi-Agent, LangGraph", <DocLink slug="agent-orchestration">Orchestration</DocLink>],
          ["단계마다 모델을 나누는 법", <DocLink slug="model-routing">Model Strategy / Routing</DocLink>],
          ["사람 승인", <DocLink slug="agent-hitl">Human-in-the-Loop</DocLink>],
          ["권한 · 샌드박스", <DocLink slug="agent-guardrails-authz">Guardrails / Identity / Authorization</DocLink>],
          ["행동 궤적 평가", <DocLink slug="agent-eval">Agent Evaluation</DocLink>],
          ["Tracing, Metrics", <DocLink slug="agent-observability">Observability & Tracing</DocLink>],
          ["재시도, 중단 후 재개", <DocLink slug="agent-reliability">Reliability / Production Engineering</DocLink>],
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
            "요약·분류·항상 검색하는 RAG는 9. AI Engineering에서 끝낸다.",
          ],
          [
            "RAG는 도구가 될 수 있다",
            "검색이 필요한지를 매번 판단해야 할 때만 Retriever를 루프에 넣는다.",
          ],
        ]}
      />
    </>
  );
}
