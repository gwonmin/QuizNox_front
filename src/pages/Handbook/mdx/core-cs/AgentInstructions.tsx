import { SectionSummary } from "@/components/handbook/SectionSummary";
import { KeyTable } from "@/components/handbook/KeyTable";
import { MermaidDiagram } from "@/components/handbook/MermaidDiagram";
import { Callout } from "@/components/handbook/Callout";
import { DocLink } from "@/components/handbook/DocLink";

export default function AgentInstructions() {
  return (
    <>
      <SectionSummary
        lead="Agent Instructions는 Agent가 한 작업의 모든 턴에서 따르는 고정 지시(system prompt)다. 다섯 설계 영역 중 Prompt에 해당하며, 역할 · 도구 사용 정책 · 멈추는 조건 · 출력 형식을 정한다."
        bullets={[
          "한 번 호출의 프롬프트는 답 하나를 얻는 문장이다. Agent의 지시는 수십 번의 모델 호출 내내 맨 앞에 놓이는 행동 규칙이다.",
          "경우마다 규칙을 나열하는 것과 막연한 원칙만 주는 것 사이에서, 원칙과 판단 기준과 대표 예시를 주는 높이로 쓴다.",
          "지시문은 행동을 안내한다. 반드시 지켜야 하는 한도와 권한은 Harness의 코드로 강제한다.",
        ]}
      />

      <h2>한 번 호출의 프롬프트와 무엇이 다른가</h2>

      <MermaidDiagram
        code={`flowchart TB
        subgraph one ["한 번 호출"]
          direction LR
          P1["프롬프트"] --> M1["Model"] --> A1["답"]
        end
        subgraph agent ["Agent"]
          direction LR
          I2["Instructions"] --> T1["턴 1\n도구 호출"] --> T2["턴 2\n결과 관찰"] --> T3["턴 3 ..."] --> A2["최종 답"]
          I2 -.->|"매 턴 다시 들어감"| T2
          I2 -.-> T3
        end
        one ~~~ agent`}
      />

      <KeyTable
        columns={["구분", "한 번 호출의 프롬프트", "Agent Instructions"]}
        rows={[
          ["수명", "호출 한 번", "작업이 끝날 때까지 모든 턴"],
          ["다루는 것", "이번 답의 내용과 형식", "어떤 도구를 언제 쓰는지, 언제 멈추는지, 누구에게 넘기는지"],
          ["쓰는 시점에 아는 것", "입력이 무엇인지 안다", "도구 결과와 중간 상황을 미리 알 수 없다"],
          ["잘못 쓰면", "답 하나가 틀린다", "잘못된 행동이 여러 단계에 걸쳐 반복된다"],
        ]}
      />

      <p>Zero-shot, Few-shot, Chain-of-Thought, 구조화 출력 같은 기법은 <DocLink slug="llm-basics">LLM 기초</DocLink>의 Prompt Engineering에서 다뤘고, 여기서도 그대로 쓴다. 이 문서는 Agent에서 더해지는 부분을 본다.</p>

      <h2>지시문의 구성</h2>

      <MermaidDiagram
        code={`flowchart LR
        subgraph sys ["Agent Instructions"]
          direction TB
          R["역할 · 목표"]
          P["행동 원칙"]
          TP["도구 사용 정책"]
          ST["멈추는 조건 · 인계 조건"]
          OF["출력 형식"]
          R ~~~ P ~~~ TP ~~~ ST ~~~ OF
        end
        sys -->|"매 호출의 맨 앞에 고정"| CTX["컨텍스트 창"]
        CTX --> M["Model"]
        M -->|"도구 결과를 더해 다음 턴"| CTX`}
      />

      <KeyTable
        columns={["구성 요소", "적는 것", "예시"]}
        rows={[
          ["역할 · 목표", "누구를 위해 무엇을 끝내야 하는지, 맡지 않는 일은 무엇인지", "고객지원 Agent로서 주문 조회와 환불 접수를 돕는다. 법률 · 의료 상담은 하지 않는다."],
          ["행동 원칙", "판단이 갈릴 때 따를 기준", "주문 정보는 추측하지 않고 조회한 값만 말한다."],
          ["도구 사용 정책", "도구를 쓰는 순서와 전제 조건, 쓰면 안 되는 상황", "환불 요청 도구는 주문을 조회해 금액을 확인한 뒤에만 호출한다."],
          ["멈추는 조건 · 인계 조건", "작업이 끝난 것으로 볼 기준, 사용자에게 물을 때, 사람에게 넘길 때", "같은 도구가 두 번 실패하면 상담원 연결을 호출한다."],
          ["출력 형식", "언어, 길이, 구조, 꼭 들어가야 할 항목", "한국어 세 문장 이내로 처리 결과와 다음 단계를 적는다."],
        ]}
      />

      <p>항목마다 제목을 붙여 구획을 나누면 모델이 규칙을 찾기 쉽고, 사람이 바뀐 부분을 리뷰하기도 쉽다. 아래는 구획만 잡은 예시다.</p>

      <pre><code className="language-markdown">{`# 역할
당신은 OO몰 고객지원 Agent다. 주문 조회와 환불 접수를 돕는다.

# 원칙
- 주문 정보는 추측하지 않고 get_order로 확인한 값만 말한다.
- 정책에 없는 보상은 약속하지 않는다.

# 도구 사용
- 주문 번호가 없으면 먼저 사용자에게 묻는다.
- request_refund는 get_order로 금액을 확인한 뒤에만 호출한다.

# 멈추는 조건
- 요청이 해결되면 결과를 요약하고 끝낸다.
- 같은 도구가 두 번 실패하면 handoff_to_human을 호출한다.
- 환불 금액이 한도를 넘으면 직접 처리하지 않고 상담원에게 넘긴다.

# 출력
- 한국어 존댓말, 세 문장 이내. 처리 결과와 다음 단계를 포함한다.`}</code></pre>

      <h2>지시가 놓이는 세 곳</h2>

      <p>Agent에게 주는 지시는 system prompt 한 곳에만 있지 않다. 어디에 두느냐에 따라 컨텍스트에 들어가는 시점과 비용이 달라진다.</p>

      <MermaidDiagram
        code={`flowchart LR
        SYS["System prompt\n항상 들어간다"] --> CTX["컨텍스트 창"]
        TD["도구 설명\n노출한 도구 수만큼 들어간다"] --> CTX
        DOC["규칙 · 스킬 문서\n필요할 때 읽어 온다"] -.-> CTX
        CTX --> M["Model"]`}
      />

      <KeyTable
        columns={["위치", "적는 것", "들어가는 시점"]}
        rows={[
          ["System prompt", "모든 작업에 공통인 역할 · 원칙 · 멈추는 조건", "매 호출. 짧게 유지해야 캐시가 적중하고 비용이 덜 든다."],
          ["도구 설명", "그 도구를 언제 쓰는지, 인자의 뜻, 쓰면 안 되는 경우", "도구가 노출될 때. 도구를 고르는 근거가 되므로 도구별 사용법은 여기에 둔다."],
          ["규칙 · 스킬 문서", "특정 작업에서만 필요한 긴 절차와 예시", "system prompt에는 목차만 두고, 해당 작업일 때 본문을 읽게 한다."],
        ]}
      />

      <p>도구 설명을 쓰는 원칙은 <DocLink slug="agent-tool-use">Tool Use</DocLink>, 무엇을 언제 불러올지는 <DocLink slug="context-engineering">Context Engineering</DocLink>에서 다룬다.</p>

      <h2>적정 높이로 쓰기</h2>

      <MermaidDiagram
        code={`flowchart LR
        LOW["너무 구체적\n경우마다 규칙을 나열"] --- MID["적정\n원칙 + 판단 기준 + 대표 예시"] --- HIGH["너무 막연\n알아서 잘 처리하라"]`}
      />

      <KeyTable
        columns={["높이", "지시문 예", "결과"]}
        rows={[
          ["너무 구체적", "주문 상태가 A이고 결제 수단이 B이며 3일이 지났으면 ..., 아니면 ... (수십 줄)", "나열하지 않은 경우에 멈추거나 엉뚱한 규칙을 적용한다. 규칙끼리 충돌한다."],
          ["적정", "환불은 정책 문서를 확인한 뒤 진행한다. 정책에 없는 경우와 금액이 한도를 넘는 경우는 상담원에게 넘긴다. 예: ...", "처음 보는 상황에도 기준을 적용한다."],
          ["너무 막연", "고객을 친절하게 돕고 문제를 해결하라.", "무엇이 해결인지, 어디까지 해도 되는지 모델이 임의로 정한다."],
        ]}
      />

      <blockquote><p>Anthropic은 <a href="https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents" target="_blank" rel="noreferrer">Effective context engineering for AI agents</a>에서 이 중간 지점을 "right altitude"라고 부르고, 예외를 빠짐없이 나열하기보다 기대하는 행동을 보여 주는 다양한 대표 예시를 고르라고 권한다.</p></blockquote>

      <h2>멈추는 조건과 인계 조건</h2>

      <p>한 번 호출은 답을 내면 끝난다. Agent는 스스로 끝을 판단해야 하므로, 무엇이 "끝"인지를 지시문에 적는다.</p>

      <MermaidDiagram
        code={`flowchart TB
        S["한 단계가 끝났다"] --> D1{"목표가 달성됐는가"}
        D1 -->|"예"| FIN["결과를 요약하고 종료"]
        D1 -->|"아니오"| D2{"진행에 필요한 정보가\n사용자에게 있는가"}
        D2 -->|"예"| ASK["사용자에게 질문"]
        D2 -->|"아니오"| D3{"권한 밖이거나\n같은 실패가 반복되는가"}
        D3 -->|"예"| HO["사람에게 인계"]
        D3 -->|"아니오"| NEXT["다음 단계 진행"]`}
      />

      <KeyTable
        columns={["조건", "지시문에 적는 내용", "코드로 함께 두는 것"]}
        rows={[
          ["완료", "검증할 수 있는 기준. 예: 테스트 통과, 주문 상태가 환불 접수로 바뀜", "결과 검증기"],
          ["질문", "어떤 정보가 없을 때 추측하지 않고 묻는지", "필수 인자 검증"],
          ["인계", "어떤 상황에서 사람에게 넘기고, 넘길 때 무엇을 요약해 전달하는지", "승인 대기 흐름"],
          ["포기", "같은 시도를 몇 번 반복하면 방법을 바꾸거나 멈추는지", "최대 단계 수, 시간 · 비용 한도"],
        ]}
      />

      <p>루프 쪽에서 본 종료 조건은 <DocLink slug="agent-loop">Agent Loop</DocLink>, 사람에게 넘기는 흐름은 <DocLink slug="agent-hitl">Human-in-the-Loop</DocLink>에서 다룬다.</p>

      <h2>지시와 강제의 경계</h2>

      <MermaidDiagram
        code={`flowchart LR
        RULE["규칙: 환불은 5만 원까지"] --> INS["지시문에 적는다"]
        RULE --> CODE["도구 코드가 검사한다"]
        INS --> R1["모델이 대체로 따른다\n섞여 든 지시에 뚫릴 수 있다"]
        CODE --> R2["한도를 넘는 호출은\n실행되지 않는다"]`}
      />

      <KeyTable
        columns={["규칙의 성격", "두는 곳", "이유"]}
        rows={[
          ["말투, 답변 구조, 우선순위", "지시문", "어겨도 피해가 작고, 상황에 따라 유연해야 한다."],
          ["도구를 쓰는 순서, 확인 절차", "지시문에 적고 코드로도 검사", "모델이 순서를 알아야 계획을 세우고, 건너뛰면 코드가 막는다."],
          ["금액 한도, 접근 권한, 되돌릴 수 없는 행동", "코드 (권한 · 검증 · 승인)", "한 번이라도 어기면 안 된다. 지시문에는 왜 막히는지 알 수 있게 한도만 알려 준다."],
        ]}
      />

      <p>사용자 입력이나 검색된 문서에 "이전 지시를 무시하라" 같은 문장이 섞여 들어올 수 있다. 지시문만으로 지키던 규칙은 이때 뚫린다. 코드로 강제하는 방법은 <DocLink slug="agent-guardrails-authz">Guardrails / Identity / Authorization</DocLink>과 <DocLink slug="agent-harness">Agent Harness</DocLink>에서 다룬다.</p>

      <Callout variant="info" title="지시문도 릴리스 대상이다">
        <p>지시문 한 줄이 바뀌면 Agent가 고르는 도구와 단계가 달라진다. 저장소에서 리뷰하고 버전을 붙인 뒤, 평가 세트로 이전 버전과 비교해 내보낸다. 절차는 <DocLink slug="llmops">LLMOps</DocLink>의 릴리스 게이트, 행동 궤적의 채점은 <DocLink slug="agent-eval">Agent Evaluation</DocLink>에 있다.</p>
      </Callout>

      <h2>흔한 실수</h2>

      <KeyTable
        columns={["실수", "결과", "대응"]}
        rows={[
          ["문제가 생길 때마다 예외 규칙을 덧붙임", "지시문이 길어지고 규칙끼리 충돌한다.", "예외를 묶는 원칙으로 바꿔 쓰고, 대표 예시로 보여 준다."],
          ["멈추는 조건을 적지 않음", "일찍 끝내거나, 끝난 뒤에도 불필요한 단계를 계속한다.", "검증할 수 있는 완료 기준을 적는다."],
          ["도구 사용법을 system prompt에 전부 적음", "쓰지 않는 도구의 설명까지 매번 들어간다.", "도구별 사용법은 도구 설명에 두고, system prompt에는 도구 사이의 순서만 둔다."],
          ["안전 규칙을 지시문에만 둠", "입력에 섞인 지시에 규칙이 뚫린다.", "한도와 권한은 코드로 강제한다."],
          ["고친 지시문을 평가 없이 배포", "한 사례는 고쳐지고 다른 사례가 나빠진다.", "평가 세트로 이전 버전과 비교한다."],
        ]}
      />

      <h2>요약</h2>

      <KeyTable
        columns={["핵심 포인트", "설명"]}
        rows={[
          ["지시는 모든 턴에 걸친 행동 규칙", "역할, 원칙, 도구 사용 정책, 멈추는 조건, 출력 형식으로 구성한다."],
          ["원칙과 대표 예시의 높이로", "경우의 수를 나열하지 않고, 처음 보는 상황에 적용할 기준을 준다."],
          ["위치를 나눈다", "공통 규칙은 system prompt, 도구별 사용법은 도구 설명, 긴 절차는 필요할 때 읽는 문서."],
          ["지시는 안내, 강제는 코드", "어기면 안 되는 한도와 권한은 Harness가 막는다."],
          ["다음 문서", "지시문을 포함해 매 호출에 무엇을 넣을지는 Context Engineering에서 본다."],
        ]}
      />
    </>
  );
}
