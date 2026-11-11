import { SectionSummary } from "@/components/handbook/SectionSummary";
import { KeyTable } from "@/components/handbook/KeyTable";
import { MermaidDiagram } from "@/components/handbook/MermaidDiagram";
import { DocLink } from "@/components/handbook/DocLink";

export default function AifPromptEngineering() {
  return (
    <>
      <SectionSummary
        lead={<>프롬프트 엔지니어링은 <strong>가중치를 바꾸지 않고</strong> 지시를 다듬어 출력을 개선한다. 구성 요소를 맞추고, 기법·템플릿·분해·평가 루프로 반복한다.</>}
        bullets={[
          "예시 0개 zero-shot, 몇 개 few-shot, 단계 추론 chain-of-thought, 분기 탐색 tree of thought.",
          "템플릿은 일관·재사용·테스트 가능해야 한다. 복잡한 작업은 분해 → 각각 프롬프트 → 결합.",
          "사람 또는 모델 리뷰로 평가한 뒤 프롬프트를 수정하는 루프가 핵심이다.",
        ]}
      />

      <h2>프롬프트 구성 요소</h2>

      <KeyTable
        columns={["요소", "역할", "예"]}
        rows={[
          ["지시 (Instruction)", "할 일", "다음 리뷰의 감성을 분류하라"],
          ["컨텍스트", "배경 정보, 참고 문서", "RAG가 여기 들어간다"],
          ["입력 데이터", "처리할 대상", "리뷰 본문"],
          ["출력 지시자", "형식·길이·어조", "JSON으로, 두 문장으로, 친근한 말투로"],
          ["역할 (Persona)", "모델의 입장", "너는 고객지원 담당자다"],
        ]}
      />

      <h2>기법</h2>

      <KeyTable
        columns={["기법", "뜻", "메모"]}
        rows={[
          ["Zero-shot", "예시 없이 지시만", "사전학습 지식에 의존"],
          ["Few-shot", "입력-출력 예시 몇 개 제공", "형식·톤을 예로 고정"],
          ["Chain-of-thought", "단계별 추론을 요구", "수학·논리 정확도 ↑"],
          ["Tree of Thought", "여러 추론 가지를 탐색·가지치기", "CoT의 확장. 복잡한 탐색 문제"],
          ["RAG", "검색 결과를 컨텍스트로 주입", <DocLink layer="aif" slug="rag-knowledge-bases">Knowledge Bases</DocLink>],
          ["ReAct", "이유 → 도구 선택 → 행동 → 응답", <DocLink layer="core-cs" slug="ai-agent">AI Agent</DocLink>],
          ["프롬프트 템플릿", "변수 자리의 재사용 양식", "일관 · 재사용 · 테스트 가능"],
          ["프롬프트 체이닝", "앞 출력을 다음 입력으로", "파이프라인"],
          ["Negative prompt", "제외할 내용 명시 (주로 이미지)", "배제 특성"],
          ["Directional stimulus", "힌트·키워드로 방향 유도", "원하는 출력으로 유도"],
          ["Self-consistency", "여러 번 생성해 다수결", "다중 추론 경로"],
        ]}
      />

      <h2>베스트 프랙티스 · 분해 · 평가</h2>

      <p><strong>명확하고 구체적으로</strong> 쓰고, 필요한 <strong>컨텍스트와 예시</strong>를 준다.</p>

      <KeyTable
        columns={["원칙", "내용"]}
        rows={[
          ["Clear and specific", "역할·제약·출력 형식·성공 기준을 모호하지 않게 적는다"],
          ["Context and examples", "배경·용어·Few-shot 예시로 기대 동작을 고정한다"],
          ["Templates", "변수화된 템플릿으로 일관·재사용·자동 테스트(회귀)한다"],
          ["Decompose", "작업을 쪼개 → 각각 프롬프트 → 결과를 결합"],
          ["Evaluate and iterate", "사람 또는 모델 리뷰 점수로 보고 프롬프트를 수정한다"],
        ]}
      />

      <MermaidDiagram
        code={`flowchart LR
        TASK[Complex task]
        SPLIT[Split]
        EACH[Prompt each part]
        COMBINE[Combine]
        EVAL[Human or model review]
        ITER[Revise prompt]
        TASK --> SPLIT --> EACH --> COMBINE --> EVAL --> ITER
        ITER --> SPLIT`}
      />

      <h2>공격과 방어</h2>

      <KeyTable
        columns={["공격", "뜻", "방어"]}
        rows={[
          ["프롬프트 인젝션", "사용자 입력에 숨은 지시로 원래 지시 덮어쓰기", "입력·지시 분리 템플릿, Guardrails Prompt Attack 필터"],
          ["탈옥 (Jailbreaking)", "안전 제한 우회 유도", "Guardrails, 거부 지시 템플릿"],
          ["프롬프트 유출", "시스템 프롬프트 노출 유도", "민감 정보 프롬프트에 안 넣기"],
          ["포이즈닝", "학습·RAG 데이터 오염", "데이터 출처 검증"],
          ["하이재킹", "모델을 다른 목적에 쓰도록 유도", "주제 제한(Denied topics)"],
        ]}
      />

      <h2>Bedrock의 프롬프트 기능</h2>

      <KeyTable
        columns={["기능", "하는 일"]}
        rows={[
          ["Prompt Management", "프롬프트 버전 관리·공유·재사용. 템플릿 변수 지원"],
          ["Prompt Flows (Flows)", "프롬프트·모델·KB를 시각적으로 연결한 워크플로"],
          ["Agents advanced prompts", "에이전트의 각 단계 프롬프트에 예시 추가"],
        ]}
      />

      <h2>기출빈출</h2>

      <KeyTable
        columns={["시나리오", "정답"]}
        rows={[
          ["LLM 출력을 짧고 특정 어조로", "프롬프트 조정"],
          ["흔한 프롬프트 공격으로 조작되지 않게", "공격 패턴 감지 템플릿 (+ Guardrails)"],
          ["챗봇이 숨은 입력 지시에 조작됨", "프롬프트 인젝션"],
          ["표준 템플릿 재사용으로 슬로건 생성", "Prompt Management"],
          ["Agent 정확도 개선, 예시 몇 개 보유", "Advanced prompts에 예시 추가"],
          ["지원 요청 해결에 고객 추가 정보 필요", "프롬프트에 메시지(대화 이력) 추가"],
          ["Nova Canvas에서 특정 특징 제외", "Negative prompt"],
        ]}
      />

      <h2>요약</h2>

      <KeyTable
        columns={["묻는 것", "답"]}
        rows={[
          ["예시 수", "0 zero-shot, 몇 개 few-shot"],
          ["풀이 과정", "Chain-of-thought · Tree of Thought"],
          ["형식·어조·길이", "프롬프트"],
          ["분해 · 평가", "split → each → combine → review → iterate"],
          ["지시 덮어쓰기", "프롬프트 인젝션"],
          ["템플릿 관리", "Prompt Management"],
        ]}
      />
    </>
  );
}
