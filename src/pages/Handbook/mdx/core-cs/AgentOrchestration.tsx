import { SectionSummary } from "@/components/handbook/SectionSummary";
import { KeyTable } from "@/components/handbook/KeyTable";
import { MermaidDiagram } from "@/components/handbook/MermaidDiagram";
import { Callout } from "@/components/handbook/Callout";
import { DocLink } from "@/components/handbook/DocLink";

export default function AgentOrchestration() {
  return (
    <>
      <SectionSummary
        lead="Orchestration은 여러 단계 · 여러 Agent · 여러 모델을 어떤 구조로 엮어 하나의 작업을 끝낼지 정하는 계층이다. 누가 다음 일을 정하고, 일을 어떻게 나누고, 결과를 어떻게 모을지가 핵심 질문이다."
        bullets={[
          "대표 패턴은 Router(분기), Supervisor(중앙 조율), Planner-Dispatcher(계획 후 배분), 병렬 실행, Evaluator-Optimizer(평가 후 개선), Handoff(제어권 넘기기)다.",
          "Multi-Agent는 만능이 아니다. 도구 · 권한 · 컨텍스트를 분리해야 할 때 나누고, 그 전에는 Single Agent가 더 싸고 디버깅이 쉽다.",
          "그래프(DAG · 상태 머신)로 표현하면 분기 · 루프 · 병렬 · 중단 후 재개를 코드로 명확히 통제할 수 있다.",
        ]}
      />

      <h2>누가 다음 단계를 정하나</h2>

      <KeyTable
        columns={["방식", "다음 단계를 정하는 주체", "예"]}
        rows={[
          ["정해진 workflow", "코드", "분류 → 검색 → 답변을 항상 같은 순서로"],
          ["Router", "분류 결과에 따라 코드가 경로 선택", "문의 유형별로 다른 처리 흐름"],
          ["Agent Loop", "모델", "도구를 몇 번 쓸지 모델이 판단"],
          ["Supervisor", "상위 Agent", "하위 Agent에게 일을 나눠 주고 결과를 합침"],
        ]}
      />

      <p>경로를 코드로 정할 수 있을수록 싸고 예측 가능하다. 루프 하나의 설계는 <DocLink slug="agent-loop">Agent Loop</DocLink>에서 다뤘고, 이 문서는 그 루프와 단계들을 어떻게 조합하는지를 다룬다.</p>

      <h2>주요 패턴</h2>

      <KeyTable
        columns={["패턴", "구조", "사용 시나리오"]}
        rows={[
          ["Router", "입력을 분류해 전문 경로 · Agent 하나로 보낸다.", "고객 문의를 기술지원 · 결제 · 일반으로 분기"],
          ["Supervisor (Orchestrator-Workers)", "중앙 Agent가 작업을 쪼개 하위 Agent에게 맡기고 결과를 종합한다.", "조사 · 작성 · 검수 Agent를 조율해 보고서 생성"],
          ["Planner-Dispatcher", "계획을 먼저 세우고, 디스패처가 단계별로 알맞은 실행기(도구 · Agent · 모델)에 배분한다.", "여러 시스템에 걸친 마이그레이션 작업"],
          ["병렬 실행 (fan-out / fan-in)", "독립적인 하위 작업을 동시에 실행하고 결과를 모은다.", "여러 소스를 동시에 검색해 종합"],
          ["Evaluator-Optimizer", "생성기가 만들고 평가기가 기준에 맞는지 판단해, 부족하면 다시 만들게 한다.", "코드 생성 → 리뷰 → 개선 반복"],
          ["Handoff", "현재 Agent가 대화의 제어권을 다른 Agent에게 넘긴다. 이후 응답은 받은 쪽이 한다.", "상담 Agent → 환불 전문 Agent"],
          ["Agent-as-tool (Sub-agent)", "하위 Agent를 도구처럼 호출하고 요약된 결과만 돌려받는다. 제어권은 넘기지 않는다.", "메인 Agent가 조사용 하위 Agent에게 '이 주제 요약'을 맡김"],
        ]}
      />

      <MermaidDiagram
        code={`flowchart TB
        subgraph router ["Router"]
          direction LR
          RI["입력"] --> RR["분류"]
          RR --> RA1["기술지원"]
          RR --> RA2["결제"]
          RR --> RA3["일반"]
        end
        subgraph supervisor ["Supervisor"]
          direction LR
          OI["목표"] --> OO["Supervisor"]
          OO --> OA1["조사 Agent"]
          OO --> OA2["작성 Agent"]
          OO --> OA3["검수 Agent"]
          OA1 --> OO
          OA2 --> OO
          OA3 --> OO
          OO --> OR["최종 결과"]
        end
        router ~~~ supervisor`}
      />

      <h3>Handoff vs Agent-as-tool</h3>

      <MermaidDiagram
        code={`flowchart LR
        subgraph handoff ["Handoff: 제어권 이동"]
          direction TB
          H1["상담 Agent"] -->|"넘김 + 요약"| H2["환불 Agent"]
          H2 --> HU["사용자와 계속 대화"]
        end
        subgraph astool ["Agent-as-tool: 제어권 유지"]
          direction TB
          T1["메인 Agent"] -->|"작업 요청"| T2["조사 Agent"]
          T2 -->|"요약 결과"| T1
          T1 --> TU["사용자에게 답변"]
        end
        handoff ~~~ astool`}
      />

      <h2>Single Agent vs Multi-Agent</h2>

      <KeyTable
        columns={["구분", "Single Agent", "Multi-Agent"]}
        rows={[
          ["구조", "하나의 루프가 모든 도구와 판단을 담당", "역할이 다른 여러 Agent가 협업"],
          ["비용 · 지연", "낮음", "Agent마다 모델 호출이 생겨 몇 배로 늘 수 있음"],
          ["디버깅", "trace 하나만 보면 됨", "Agent 사이 전달 내용까지 추적해야 함"],
          ["강점", "단순하고 일관됨", "전문성 · 권한 · 컨텍스트 분리, 병렬 처리"],
        ]}
      />

      <Callout variant="info" title="나눌 때의 신호">
        <p>Single Agent로 시작하고, 아래 신호가 보일 때 나눈다. 도구가 많아져 선택 정확도가 떨어질 때, 단계마다 필요한 권한이 달라 한 Agent에 다 주기 위험할 때, 깊은 탐색 때문에 메인 컨텍스트가 넘칠 때, 독립 작업을 병렬로 돌려 시간을 줄일 수 있을 때.</p>
      </Callout>

      <h2>넘겨줄 때의 계약</h2>

      <p>Agent 사이에서 일을 넘길 때는 대화 원문 전체가 아니라 받는 쪽에 필요한 최소 정보를 정해진 형식으로 넘긴다. AWS <a href="https://docs.aws.amazon.com/wellarchitected/latest/agentic-ai-lens/agentops01-bp02.html" target="_blank" rel="noreferrer">Well-Architected Agentic AI Lens</a>(2026.10 확인)도 handoff를 "작업 설명 · 완료한 일 · 기억 · 넘기는 이유"를 담은 버전 있는 스키마로 정의하라고 권한다.</p>

      <KeyTable
        columns={["넘길 것", "예"]}
        rows={[
          ["작업 설명", "'주문 ORD-20261005의 부분 환불 처리'"],
          ["지금까지 한 일", "주문 조회 완료, 환불 가능 금액 32,000원 확인"],
          ["제약 · 권한", "환불 한도 50,000원, 고객 동의 받음"],
          ["넘기는 이유", "환불 실행 권한이 없는 Agent라서"],
        ]}
      />

      <h2>그래프로 표현하기</h2>

      <p>여러 단계와 분기 · 루프를 코드로 통제하려면 작업을 그래프(<strong>nodes · edges · states</strong>)로 표현한다. LangGraph 같은 프레임워크가 이 방식을 쓴다. 에이전트 간 작업 위임 표준으로는 <strong>A2A</strong>(Agent-to-Agent) 개방 프로토콜이 있다. CrewAI는 <strong>Crews</strong>(agency)와 <strong>Flows</strong>(precision)를 구분해 쓴다.</p>

      <MermaidDiagram
        code={`flowchart TB
        START(["시작"]) --> AGENT["agent 노드: 모델이 판단"]
        AGENT -->|"도구 필요"| TOOLS["tools 노드: 도구 실행"]
        TOOLS -->|"결과 반환"| AGENT
        AGENT -->|"승인 필요"| HUMAN["human 노드: 사람 승인"]
        HUMAN -->|"승인 완료"| AGENT
        AGENT -->|"답변 완료"| END_NODE(["완료"])`}
      />

      <KeyTable
        columns={["개념", "역할"]}
        rows={[
          ["State (공유 상태)", "그래프 전체가 읽고 쓰는 객체. 노드 사이 정보 전달 통로"],
          ["Node", "작업 단위. 모델 호출, 도구 실행, 조건 판단 등"],
          ["Conditional Edge", "결과에 따라 다음 노드를 고른다. 분기 · 루프를 만드는 핵심"],
          ["병렬 브랜치", "독립 노드를 동시에 실행하고 다음 노드에서 결과를 합친다"],
          ["Checkpoint", "노드 단위로 상태를 저장해 장애 후 재개, 이전 시점으로 되돌리기"],
          ["Interrupt", "특정 노드 앞에서 멈추고 사람 입력을 받은 뒤 이어서 실행"],
        ]}
      />

      <KeyTable
        columns={["구분", "단순 체인 (LangChain 체인 등)", "그래프 (LangGraph 등)"]}
        rows={[
          ["실행 흐름", "직선 (A → B → C)", "분기 · 루프 · 병렬"],
          ["적합한 경우", "RAG 파이프라인, 짧은 정해진 흐름", "여러 단계 Agent, 사람 승인 · 재개가 필요한 작업"],
          ["상태", "단계 사이 값 전달", "중앙 상태 객체 + checkpoint"],
        ]}
      />

      <p>Checkpoint와 재개는 <DocLink slug="agent-state-memory">State & Memory</DocLink>, 사람 승인 흐름은 <DocLink slug="agent-hitl">Human-in-the-Loop</DocLink>, 각 노드에 어떤 모델을 쓸지는 <DocLink slug="model-routing">Model Strategy / Routing</DocLink>에서 다룬다.</p>

      <h2>LangChain으로 부품을 만들고 LangGraph로 조립하기</h2>

      <p>LangChain은 <strong>부품(모듈)</strong>, LangGraph는 그 부품을 <strong>조립하는 설계도(그래프)</strong>이다.</p>

      <p>
        LangChain은 prompts · memory · chains · agents 모듈을 제공하고,{" "}
        <code>prompt_template | model</code>처럼 파이프(<code>|</code>)로 한 번에 실행한다. 호출은{" "}
        <code>SystemMessage</code> + <code>HumanMessage</code> 뒤 <code>model.invoke()</code>다.{" "}
        <strong>ChatPromptTemplate</strong>은 <code>{"{variables}"}</code>를 채운 채팅 프롬프트를 만든다. 멀티턴은{" "}
        <strong>RunnableWithMessageHistory</strong>, 세션별 영속은{" "}
        <strong>DynamoDBChatMessageHistory(<code>session_id</code>)</strong>로 붙인다. 배포는 frontend → Lambda → LangChain → Bedrock이 한 경로다.
      </p>

      <MermaidDiagram
        code={`flowchart TB
        subgraph modules ["LangChain 모듈 (부품)"]
          subgraph io ["입출력"]
            PT["Prompt Template\n(프롬프트 틀)"]
            OP["Output Parser\n(응답 구조화)"]
            PT ~~~ OP
          end
          subgraph brain ["두뇌"]
            LLM_MOD["LLM / ChatModel\n(GPT, Claude 등)"]
          end
          subgraph hands ["손 (외부 상호작용)"]
            TOOL["Tool\n(API, 계산기, 검색...)"]
            RET["Retriever\n(벡터 DB 검색 = RAG)"]
            TOOL ~~~ RET
          end
          subgraph memory ["기억"]
            MEM["Memory\n(대화 이력 관리)"]
          end
          io ~~~ hands
          brain ~~~ memory
        end

        subgraph chain ["이 부품들을 파이프로 연결하면 → 체인"]
          direction LR
          C1["질문"] -->|"|"| C2["Prompt"] -->|"|"| C3["LLM"] -->|"|"| C4["Parser"] --> C5["답변"]
        end

        modules --> chain`}
      />

      <KeyTable
        columns={["모듈", "역할", "RAG 해당"]}
        rows={[
          [
            "Prompt Template",
            "변수를 포함한 프롬프트 틀. 런타임에 값을 주입하여 일관된 프롬프트를 생성.",
            "",
          ],
          [
            "Tool / Tool Calling",
            "함수·API를 도구로 등록하면 LLM이 필요할 때 자동 호출. @tool 데코레이터로 간단히 등록.",
            "",
          ],
          [
            "Retriever",
            "벡터 DB에서 관련 문서를 가져오는 인터페이스. RAG 파이프라인의 검색 담당.",
            "RAG 핵심",
          ],
          [
            "Memory",
            "대화 이력 관리. 전체 보관(Buffer) 또는 요약 보관(Summary) 등 전략 선택.",
            "",
          ],
        ]}
      />

      <p>단순 체인(<code>A → B → C</code>)은 직선형이라 도구를 쓸지 모델이 판단하는 루프를 표현하지 못한다. LangGraph는 노드 · 조건부 엣지 · 공유 상태로 그 루프와 분기를 표현한다.</p>

      <h3>예: 여행 계획</h3>

      <p>사용자가 "이번 주말 부산 여행 계획 세워줘"라고 했을 때, agent 노드와 tools 노드가 상태를 주고받으며 돈다.</p>

      <MermaidDiagram
        code={`flowchart TB
        USER["사용자: 이번 주말 부산 여행 계획 세워줘"]
        START(["__start__"])

        AGENT1["agent 노드\nLLM 판단: 날씨 확인 필요\n→ weather_tool 호출"]
        TOOLS1["tools 노드\n날씨 API 호출 → 맑음 18°C"]

        AGENT2["agent 노드\nLLM 판단: 관광지 검색 필요\n→ search_tool 호출"]
        TOOLS2["tools 노드\n웹 검색 → 해운대, 감천문화마을, 태종대"]

        AGENT3["agent 노드\nLLM 판단: 사내 가이드 참고\n→ retriever_tool 호출"]
        TOOLS3["tools 노드\n벡터 DB 검색 (RAG)\n→ 사내 부산 출장 가이드"]

        AGENT4["agent 노드\nLLM 판단: 정보 충분, 일정 구성\n→ 도구 호출 없이 답변 생성"]

        END_NODE(["__end__"])
        RESULT["최종 답변:\n토요일 오전 해운대 → 오후 감천문화마을\n일요일 태종대\n맛집: 돼지국밥 (사내 가이드 추천)\n날씨 맑음 18°C, 가벼운 겉옷 권장"]

        USER --> START --> AGENT1
        AGENT1 -->|"tool_call"| TOOLS1 -->|"State 업데이트"| AGENT2
        AGENT2 -->|"tool_call"| TOOLS2 -->|"State 업데이트"| AGENT3
        AGENT3 -->|"tool_call (RAG)"| TOOLS3 -->|"State 업데이트"| AGENT4
        AGENT4 -->|"답변 완료"| END_NODE --> RESULT`}
      />

      <KeyTable
        columns={["회차", "LLM의 판단", "사용된 모듈", "RAG 여부"]}
        rows={[
          ["1회차", "'날씨부터 확인해야겠다'", "Tool (weather_tool → 날씨 API)", ""],
          ["2회차", "'야외 관광지를 검색하자'", "Tool (search_tool → 웹 검색)", ""],
          [
            "3회차",
            "'사내 여행 가이드도 참고하자'",
            "Tool (retriever_tool → Retriever → Vector Store)",
            "RAG 검색",
          ],
          [
            "4회차",
            "'정보가 충분하다. 일정을 구성하자'",
            "LLM + Prompt Template + Output Parser",
            "",
          ],
        ]}
      />

      <blockquote>
        <p>
          핵심은 <strong>agent ↔ tools 루프</strong>다. 3회차에서 Retriever를 호출한 것이, 검색이 Agent 안에서 도구 하나로 동작하는 패턴이다. 항상 검색하는 RAG 파이프라인은{" "}
          <DocLink slug="rag">RAG</DocLink>에 두고, 검색할지를 매번 판단할 때만 이 루프를 쓴다.
        </p>
      </blockquote>

      <h3>서비스 안의 라우터</h3>

      <p>요청마다 같은 Agent 루프를 돌리면 단순한 질문에도 도구 호출 비용이 든다. Runtime 앞에서 의도를 나눈다. 단순 질의는 RAG 노드, 작업 요청은 Action 노드, 복합 작업만 Planner로 보낸다.</p>

      <MermaidDiagram
        code={`flowchart TB
        WEB[Frontend] --> GW[API Gateway]
        GW --> LAMBDA[Lambda with LangChain]
        LAMBDA --> BEDROCK[Amazon Bedrock]
        LAMBDA --> ROUTER[Router]
        ROUTER --> RAG[RAG node]
        ROUTER --> ACTION[Action node]
        RAG --> RESP[Response]
        ACTION --> RESP
        RAG --> VDB[Vector DB]
        ACTION --> EXTAPI[External APIs]
        LAMBDA --> MEM[ElastiCache or DynamoDB]`}
      />

      <KeyTable
        columns={["계층", "구성 요소", "역할"]}
        rows={[
          [
            "API Gateway",
            "ALB / API Gateway / Kong",
            "인증, Rate Limiting, 요청 라우팅. Agent로 들어오는 트래픽의 첫 관문.",
          ],
          [
            "Agent Runtime",
            "LangGraph + LangChain 모듈",
            "그래프 실행 엔진. 라우터가 의도를 분류하고, RAG/Action/Planner 노드를 조합하여 처리.",
          ],
          [
            "외부 도구",
            "REST API, DB Client",
            "Agent가 Tool Calling으로 실행. 예약·결제 같은 부수 효과가 있는 작업 담당.",
          ],
          [
            "데이터 소스 (RAG)",
            "Vector DB + 문서 저장소",
            "Retriever가 벡터 유사도 검색으로 관련 문서를 가져온다.",
          ],
          [
            "상태 · 메모리",
            "Checkpoint Store, Conversation Memory",
            "Checkpoint는 실행 중간 상태, Memory는 대화 맥락이다.",
          ],
          [
            "관측성",
            "LangSmith / Langfuse, CloudWatch",
            "실행 트레이스, 토큰·비용, 품질 평가.",
          ],
        ]}
      />

      <p>
        Runtime이 검증·재시도·제한·격리를 어떻게 맡는지는 <DocLink slug="agent-harness">Agent Harness</DocLink>, Checkpoint와 Memory 설계는{" "}
        <DocLink slug="agent-state-memory">State & Memory</DocLink>, 트레이스 필드는{" "}
        <DocLink slug="agent-observability">Observability & Tracing</DocLink>에서 다룬다.
      </p>

      <h2>흔한 실수</h2>

      <KeyTable
        columns={["실수", "결과", "대응"]}
        rows={[
          ["처음부터 Multi-Agent", "비용 증가, 원인 추적 어려움", "Single Agent로 시작하고 나눌 신호가 보일 때 분리"],
          ["대화 원문을 통째로 넘김", "받는 Agent의 컨텍스트 낭비, 핵심 누락", "정해진 handoff 스키마로 요약해서 전달"],
          ["위임 깊이 제한 없음", "Agent가 Agent를 끝없이 부름", "위임 깊이 · 전체 단계 · 예산을 상위에서 제한"],
          ["병렬 작업의 결과 충돌 무시", "서로 다른 결론을 그대로 이어 붙임", "합치는 단계에서 충돌을 확인하고 해소"],
          ["하위 Agent에 상위와 같은 권한", "권한 범위가 불필요하게 넓어짐", "역할별로 도구와 권한을 좁혀 줌"],
        ]}
      />

      <h2>요약</h2>

      <KeyTable
        columns={["핵심 포인트", "설명"]}
        rows={[
          ["코드가 정할 수 있으면 코드로", "workflow → Router → Agent Loop → Multi-Agent 순으로 필요할 때만 복잡도를 올린다."],
          ["패턴은 조합해서 쓴다", "Router로 나누고, 각 경로 안에서 Supervisor나 Loop를 쓰고, 결과물에 Evaluator를 붙인다."],
          ["넘길 때는 계약으로", "필요한 최소 정보를 정해진 스키마로 넘긴다."],
          ["다음 문서", "각 단계에 어떤 모델을 쓸지는 Model Strategy / Routing에서 본다."],
        ]}
      />
    </>
  );
}
