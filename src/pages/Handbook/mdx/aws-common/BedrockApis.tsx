import { SectionSummary } from "@/components/handbook/SectionSummary";
import { KeyTable } from "@/components/handbook/KeyTable";
import { MermaidDiagram } from "@/components/handbook/MermaidDiagram";
import { DocLink } from "@/components/handbook/DocLink";

export default function BedrockApis() {
  return (
    <>
      <SectionSummary
        lead={
          <>
            <strong>제어 영역(bedrock)</strong>으로 모델·리소스를 관리하고,{" "}
            <strong>데이터 영역(bedrock-runtime)</strong>의{" "}
            <strong>InvokeModel · Converse · ConverseStream</strong>으로 추론한 뒤 text ·
            stop_reason · usage를 처리한다.
          </>
        }
        bullets={[
          "제어 영역(Control plane, API: bedrock): 모델 목록·액세스·KB·Agent·Guardrails 등 관리.",
          "데이터 영역(Data plane, API: bedrock-runtime): 실시간·스트리밍 추론만. InvokeModel·Converse는 여기.",
          "Converse는 공통 messages API(채팅·tool·Guardrails). InvokeModel은 임베딩·이미지 등 모델별 JSON.",
          "tool_use면 앱이 도구를 실행하고 toolResult를 붙여 다시 Converse한다. IAM은 InvokeModel 계열.",
          "앱 스택은 apps → models & tools → infrastructure. 서버리스 백본은 API Gateway → Lambda → bedrock-runtime.",
        ]}
      />

      <h2>GenAI 앱 스택 · 코어 컴포넌트</h2>

      <p><strong>스택</strong>: 애플리케이션 → 모델·도구 → 인프라. <strong>코어</strong>: frontend, app logic, FM interface, FM.</p>

      <MermaidDiagram
        code={`flowchart TB
        subgraph stack [GenAI Stack]
          APPS[Apps]
          MODELS[Models and Tools]
          INFRA[Infrastructure]
          APPS --> MODELS --> INFRA
        end

        subgraph core [Core Components]
          FE[Frontend]
          LOGIC[App Logic]
          FMI[FM Interface]
          FM[Foundation Model]
          FE --> LOGIC --> FMI --> FM
        end`}
      />

      <KeyTable
        columns={["계층", "역할", "예시"]}
        rows={[
          ["Apps", "사용자 경험 · 세션 · 권한", "웹·모바일 UI, BFF"],
          ["Models and Tools", "FM 호출 · RAG · 에이전트 · Guardrails", "Bedrock, Knowledge Bases, Agents"],
          ["Infrastructure", "네트워크 · 컴퓨트 · 스토리지 · IAM", "VPC, Lambda, S3, DynamoDB"],
          ["Frontend", "입력 수집 · 스트리밍 표시", "채팅 UI"],
          ["App Logic", "오케스트레이션 · 검증 · 메모리", "Lambda 핸들러"],
          ["FM Interface", "SDK 호출 · 파라미터 · 가드레일", "bedrock-runtime client"],
          ["FM", "토큰 생성", "Bedrock 호스팅 모델"],
        ]}
      />

      <h2>서버리스 백본</h2>

      <p><strong>API Gateway</strong> → <strong>Lambda</strong> → <strong>Bedrock</strong> (bedrock-runtime).</p>

      <MermaidDiagram
        code={`sequenceDiagram
        participant Client
        participant APIGW as API Gateway
        participant Lambda
        participant Bedrock as bedrock-runtime
        Client->>APIGW: HTTP request
        APIGW->>Lambda: invoke
        Lambda->>Bedrock: Converse or ConverseStream
        Bedrock-->>Lambda: text stop_reason usage
        Lambda-->>APIGW: JSON or stream
        APIGW-->>Client: response`}
      />

      <h2>제어 영역 vs 데이터 영역</h2>

      <p>
        Bedrock은 AWS 서비스처럼 <strong>제어 영역(Control plane)</strong>과{" "}
        <strong>데이터 영역(Data plane)</strong>이 나뉜다. SDK 클라이언트 이름도 다르다:{" "}
        <code>bedrock</code> vs <code>bedrock-runtime</code>.
      </p>

      <MermaidDiagram
        code={`flowchart LR
        subgraph ctrl [Control plane bedrock]
          LIST["ListFoundationModels"]
          ACCESS["모델 액세스 · 평가 · 커스터마이징"]
          RES["KB · Agent · Guardrails CRUD"]
        end
        subgraph data [Data plane bedrock-runtime]
          INV["InvokeModel"]
          CONV["Converse"]
          STR["ConverseStream"]
        end
        APP["애플리케이션"] -->|"관리 · 설정"| ctrl
        APP -->|"추론 요청"| data
        data -->|"text · stop_reason · usage"| APP`}
      />

      <KeyTable
        columns={["구분", "한국어", "클라이언트 · 엔드포인트", "하는 일"]}
        rows={[
          [
            "Control plane",
            "제어 영역",
            "bedrock",
            "모델·리소스·작업을 만들고 조회·변경한다. 추론 토큰을 생성하지 않는다",
          ],
          [
            "Data plane",
            "데이터 영역",
            "bedrock-runtime",
            "프롬프트를 넣고 모델 출력을 받는다. 앱의 핫패스는 여기",
          ],
        ]}
      />

      <KeyTable
        columns={["영역", "대표 API · 작업", "예"]}
        rows={[
          [
            "제어 (bedrock)",
            "ListFoundationModels, GetFoundationModel, 모델 액세스, Create/Update Guardrail · Knowledge Base · Agent, 평가·배치 작업 관리",
            "콘솔에서 모델 켜기, KB 생성, Guardrail 버전 배포",
          ],
          [
            "데이터 (bedrock-runtime)",
            "InvokeModel, InvokeModelWithResponseStream, Converse, ConverseStream, ApplyGuardrail(추론 경로)",
            "채팅 응답, 임베딩·이미지 생성, 스트리밍 UX",
          ],
        ]}
      />

      <KeyTable
        columns={["상황", "어느 영역"]}
        rows={[
          ["사용 가능한 모델 ID를 조회한다", "제어 (bedrock)"],
          ["Knowledge Base·Agent·Guardrails를 생성·수정한다", "제어 (bedrock)"],
          ["사용자 메시지에 답을 생성한다", "데이터 (bedrock-runtime)"],
          ["타이핑 UX를 위해 토큰을 스트리밍한다", "데이터 (bedrock-runtime)"],
          ["Lambda가 매 요청마다 FM을 호출한다", "데이터 (bedrock-runtime)"],
        ]}
      />

      <KeyTable
        columns={["IAM 관점", "요지"]}
        rows={[
          [
            "런타임 역할",
            "앱·Lambda에는 추론 권한만. Converse도 별도 액션이 아니라 bedrock:InvokeModel, 스트리밍은 bedrock:InvokeModelWithResponseStream",
          ],
          [
            "관리 역할",
            "플랫폼·IaC·운영자만 bedrock 제어 API(리소스 CRUD·모델 액세스)를 허용",
          ],
          [
            "분리 이유",
            "추론 폭주·권한 과다 부여를 막는다. 핫패스와 관리 면을 클라이언트로도 나눈다",
          ],
        ]}
      />

      <h2>요청 구조</h2>

      <p>요청은 <strong>input</strong> + <strong>config</strong> + <strong>inference params</strong>로 구성한다.</p>

      <KeyTable
        columns={["부분", "내용", "예"]}
        rows={[
          ["Input", "프롬프트 · 메시지 · 문서 바이트", "user message, system prompt, document"],
          ["Config", "모델 ID · Inference Profile · Guardrails · 캐시", "modelId, guardrailIdentifier"],
          ["Inference params", "생성 동작 조절", "temperature, top_p, maxTokens, stopSequences"],
        ]}
      />

      <KeyTable
        columns={["파라미터", "낮추면", "올리면"]}
        rows={[
          ["temperature", "사실·일관 중심", "창의·다양"],
          ["top_p", "정확한·좁은 후보", "다양·넓은 후보"],
        ]}
      />

      <p>더 상세한 파라미터 해석은 <DocLink layer="aif" slug="inference-params">추론 파라미터</DocLink>를 본다.</p>

      <h2>InvokeModel · Converse · ConverseStream</h2>

      <p>
        <strong>Converse</strong>는 메시지 기반 모델을 하나의 공통 API로 호출한다. 모델이 바뀌어도
        같은 <code>messages</code> · <code>system</code> · <code>toolConfig</code> 형태를 재사용할 수
        있다. 스트리밍은 <strong>ConverseStream</strong>, 모델 고유 JSON이 필요하면{" "}
        <strong>InvokeModel</strong>을 쓴다.
      </p>

      <KeyTable
        columns={["API", "특징", "언제"]}
        rows={[
          [
            "Converse",
            "모델 공통 메시지 포맷. system · tools · Guardrails · inferenceConfig를 한곳에서",
            "채팅 · Q&A · tool use · 문서·이미지 입력이 있는 대화형 추론",
          ],
          [
            "ConverseStream",
            "Converse와 동일 요청을 이벤트 스트림으로 반환",
            "타이핑 UX · TTFB 단축. CLI는 스트리밍 미지원",
          ],
          [
            "InvokeModel",
            "모델별 native JSON body. 제공사 스키마를 직접 맞춤",
            "임베딩 · Nova Canvas 이미지 생성 등 Converse 미적합·모델 고유 페이로드, 레거시",
          ],
        ]}
      />

      <KeyTable
        columns={["선택", "Converse", "InvokeModel"]}
        rows={[
          ["요청 형식", "공통 messages · system · toolConfig", "모델별 JSON (Anthropic·Titan·Stability 등)"],
          ["모델 교체", "코드 재사용이 쉽다", "스키마를 모델마다 다시 맞춤"],
          ["도구 호출", "toolConfig · toolUse · toolResult 표준 루프", "모델별로 직접 구현"],
          ["적합한 작업", "대화·요약·Q&A·에이전트 도구", "임베딩·이미지·고유 파라미터만 있는 API"],
        ]}
      />

      <MermaidDiagram
        code={`flowchart LR
        REQ[Request]
        INV[InvokeModel]
        CONV[Converse]
        STR[ConverseStream]
        RES[content stop_reason usage]
        CHUNK[stream events then assemble]
        REQ --> INV --> RES
        REQ --> CONV --> RES
        REQ --> STR --> CHUNK`}
      />

      <h3>Converse 요청 필드</h3>

      <KeyTable
        columns={["필드", "역할"]}
        rows={[
          ["modelId", "FM 또는 Inference Profile ID"],
          ["messages", "user · assistant 턴 배열. 멀티턴은 앱이 이력을 누적해 넣는다"],
          ["system", "시스템 지시(역할·규칙). messages와 분리"],
          ["inferenceConfig", "temperature · topP · maxTokens · stopSequences 등 공통 추론 파라미터"],
          ["additionalModelRequestFields", "모델 고유 파라미터를 그대로 전달할 때"],
          ["toolConfig", "도구 이름·JSON 스키마·toolChoice. Function calling"],
          ["guardrailConfig", "Guardrails ID·버전을 추론 경로에 연결"],
          ["promptVariables · Prompt management ARN", "콘솔 Prompt Management 버전을 재사용할 때"],
        ]}
      />

      <p>
        메시지·스트리밍 지원 여부는 제어 영역{" "}
        <code>GetFoundationModel</code>의 응답(예: responseStreamingSupported)으로 확인한다. 상세
        파라미터는 <DocLink layer="aif" slug="inference-params">추론 파라미터</DocLink>를 본다.
      </p>

      <h3>Tool use 루프</h3>

      <p>
        Converse가 도구가 필요하다고 판단하면 <code>stop_reason = tool_use</code>와 함께{" "}
        <code>toolUse</code> 블록을 반환한다. <strong>앱이 도구를 실행</strong>한 뒤{" "}
        <code>toolResult</code>를 messages에 붙여 다시 Converse를 호출한다. Bedrock이 대신
        Lambda를 돌리는 것이 아니라, 앱(또는 Agent)이 오케스트레이션한다.
      </p>

      <MermaidDiagram
        code={`sequenceDiagram
        participant App
        participant RT as bedrock-runtime
        participant Tool as Tool or API
        App->>RT: Converse messages toolConfig
        RT-->>App: stop_reason tool_use
        App->>Tool: 도구 실행
        Tool-->>App: result
        App->>RT: Converse plus toolResult
        RT-->>App: stop_reason end_turn content`}
      />

      <KeyTable
        columns={["단계", "누가", "내용"]}
        rows={[
          ["1. 요청", "앱", "messages + toolConfig로 Converse"],
          ["2. 도구 요청", "모델", "toolUse 블록 · stop_reason=tool_use"],
          ["3. 실행", "앱", "스키마에 맞는 함수·API·DB 호출"],
          ["4. 결과 반환", "앱", "assistant toolUse 턴 + user toolResult를 messages에 추가"],
          ["5. 최종 답", "모델", "stop_reason=end_turn 등으로 사용자용 content"],
        ]}
      />

      <p>
        관리형 에이전트 루프는{" "}
        <DocLink layer="aws-common" slug="bedrock-agent">
          Bedrock Agent
        </DocLink>
        , 도구·MCP 개념은{" "}
        <DocLink layer="core-cs" slug="agent-tool-use">
          Tool Use
        </DocLink>
        를 본다.
      </p>

      <h3>ConverseStream · Guardrails</h3>

      <KeyTable
        columns={["주제", "요지"]}
        rows={[
          ["ConverseStream", "동일 Converse 요청을 contentBlockDelta 등 이벤트로 흘린다. 권한은 InvokeModelWithResponseStream"],
          ["Guardrails", "guardrailConfig로 입출력 필터. ApplyGuardrail은 Bedrock 밖 모델에도 적용 가능"],
          ["저장", "Bedrock은 요청의 텍스트·이미지·문서를 영속 저장하지 않는다. 세션 이력은 앱이 보관"],
        ]}
      />

      <h2>응답 필드</h2>

      <KeyTable
        columns={["필드", "의미"]}
        rows={[
          ["content / message", "assistant 메시지 블록. text · toolUse 등"],
          ["stop_reason", "종료 사유. end_turn, max_tokens, stop_sequence, tool_use 등"],
          ["usage", "input · output 토큰 수. 비용·쿼터 추적"],
          ["metrics (선택)", "지연 등 호출 메트릭"],
        ]}
      />

      <h2>공통 아키텍처 패턴</h2>

      <KeyTable
        columns={["패턴", "요지", "API · 메모"]}
        rows={[
          ["Generation", "지시만으로 새 텍스트·코드 생성", "Converse, temperature 조절"],
          ["Summarization", "긴 입력을 짧게", "extractive는 원문 발췌, abstractive는 재작성"],
          ["Q&A", "질문 + 문서 근거로 답", "Converse에 document bytes 또는 S3 참조"],
          ["Chat", "멀티턴 대화", "메시지를 누적 전달. FM 자체는 컨텍스트를 영속 저장하지 않음"],
        ]}
      />

      <h3>요약: extractive vs abstractive</h3>

      <KeyTable
        columns={["유형", "동작", "특징"]}
        rows={[
          ["Extractive", "원문에서 문장·구를 뽑아 조합", "사실 충실, 문체 통일은 약함"],
          ["Abstractive", "의미를 이해해 새 문장으로 생성", "읽기 쉬움, 환각 위험 상대적 증가"],
        ]}
      />

      <h3>Q&A와 문서</h3>

      <p>Converse에 <strong>document bytes</strong>를 넣거나 <strong>S3</strong>의 객체를 연결해 문서 기반 Q&A를 구성한다. 대량·반복 지식은 <DocLink layer="aif" slug="rag-knowledge-bases">Knowledge Bases</DocLink>가 맞다.</p>

      <h2>Inference Profile · Prompt caching</h2>

      <KeyTable
        columns={["기능", "하는 일", "효과"]}
        rows={[
          ["Inference Profile", "교차 리전 라우팅으로 처리량을 확보", "단일 리전 한도 완화, On-Demand 가격대"],
          ["Prompt caching", "긴 고정 접두를 캐시 체크포인트로 재사용", "반복 호출의 입력 토큰 비용·지연 감소"],
        ]}
      />

      <p>처리량 옵션(On-Demand · Provisioned · Batch)은 <DocLink layer="aif" slug="bedrock-features">Bedrock 기능 지도</DocLink>를 본다.</p>

      <h2>대화 메모리: 단기 vs 장기</h2>

      <p>FM 컨텍스트는 <strong>교환(요청) 단위</strong>이며 모델 쪽에 영속되지 않는다. 앱이 저장한다.</p>

      <KeyTable
        columns={["저장소", "용도", "특징"]}
        rows={[
          ["ElastiCache Redis 등", "단기 세션 이력", "저지연, TTL로 만료"],
          ["DynamoDB", "장기 · 세션별 이력", "내구성, session_id 키로 조회"],
        ]}
      />

      <p>상태 설계는 <DocLink slug="agent-state-memory">State & Memory</DocLink>를 본다.</p>

      <h2>요약</h2>

      <KeyTable
        columns={["키워드", "한 줄"]}
        rows={[
          ["bedrock (제어 영역)", "모델·KB·Agent·Guardrails 관리. 추론 아님"],
          ["bedrock-runtime (데이터 영역)", "InvokeModel · Converse · ConverseStream 추론"],
          ["Converse", "공통 messages API. 채팅·tool·Guardrails"],
          ["ConverseStream", "동일 요청의 스트림. IAM은 InvokeModelWithResponseStream"],
          ["InvokeModel", "모델별 JSON. 임베딩·이미지 등"],
          ["tool_use 루프", "모델 요청 → 앱이 도구 실행 → toolResult → 재호출"],
          ["IAM (추론)", "InvokeModel / InvokeModelWithResponseStream (Converse 전용 액션 없음)"],
          ["stop_reason · usage", "종료 사유 · 토큰 사용량"],
          ["Inference Profile", "교차 리전 라우팅"],
          ["Prompt caching", "캐시 체크포인트 재사용"],
          ["더 깊이", <DocLink layer="aws-common" slug="bedrock-overview">Bedrock 개요</DocLink>],
        ]}
      />
    </>
  );
}
