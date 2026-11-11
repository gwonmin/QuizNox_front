import { SectionSummary } from "@/components/handbook/SectionSummary";
import { KeyTable } from "@/components/handbook/KeyTable";
import { MermaidDiagram } from "@/components/handbook/MermaidDiagram";
import { DocLink } from "@/components/handbook/DocLink";

export default function AifResponsibleAiDimensions() {
  return (
    <>
      <SectionSummary
        lead="Responsible AI는 안전·데이터 위험을 최소화한다. 위험축은 veracity · toxicity · IP · privacy이며, 약한 데이터가 모델·앱으로 전파되는 bias cycle을 끊는다."
        bullets={[
          "특정 집단에 불리 → 공정성. 왜 그 결정인지 모름 → 설명 가능성. 모델 정보 공개 안 됨 → 투명성.",
          "프롬프트 인젝션은 의도치 않은 출력, 프롬프트 유출은 민감 정보 노출. 검증·접근 제어·모니터링으로 방어한다.",
          "Bedrock Guardrails는 프롬프트·응답을 평가하고, contextual grounding · Automated Reasoning을 제공한다.",
        ]}
      />

      <h2>핵심 차원</h2>

      <KeyTable
        columns={["차원", "질문", "위반 예", "도구"]}
        rows={[
          ["공정성 (Fairness)", "집단 간 결과가 공평한가", "대표성 없는 데이터로 특정 집단 불리", "Clarify (편향 지표), 다양한 데이터"],
          ["설명 가능성 (Explainability)", "왜 그 예측인지 설명되는가", "대출 거절 이유 설명 불가", "Clarify (SHAP), PDP"],
          ["프라이버시 · 보안", "개인 정보가 보호되는가", "학습 데이터 PII 노출", "Macie, Guardrails PII, KMS"],
          ["안전성 (Safety)", "해로운 출력을 막는가", "유해 콘텐츠 생성", "Guardrails"],
          ["제어 가능성 (Controllability)", "행동을 모니터링·조정할 수 있나", "통제 불가 출력", "Model Monitor, 사람 검토"],
          ["진실성 · 견고성 (Veracity & Robustness)", "정확하고 입력 변형에 안정적인가", "환각, 적대적 입력에 붕괴", "RAG, 평가, Guardrails grounding"],
          ["거버넌스 (Governance)", "정책·책임·감사 체계가 있나", "정책 없이 배포", "Audit Manager, Model Cards"],
          ["투명성 (Transparency)", "모델 정보·한계가 공개되나", "이해관계자가 모델을 모름", "Model Cards, AI Service Cards"],
        ]}
      />

      <h2>편향 · 공정성 용어</h2>

      <KeyTable
        columns={["용어", "뜻"]}
        rows={[
          ["데이터 편향", "학습 데이터가 현실을 왜곡 대표"],
          ["알고리즘 편향", "모델 구조·목표가 특정 집단에 불리"],
          ["인간 편향", "레이블링·설계자 선택에 든 선입견"],
          ["Pre-training bias", "데이터 단계 편향. Clarify가 학습 전 측정"],
          ["Post-training bias", "예측 결과 편향. Clarify가 학습 후 측정"],
          ["Disparate impact", "집단 간 긍정 결과 비율 차이"],
        ]}
      />

      <h2>Bias cycle</h2>

      <p><strong>Weak data → model → apps.</strong> 약한 데이터가 모델에 스며들고 앱 동작으로 확대된다. 데이터 교정·평가·Guardrails로 고리를 끊는다.</p>

      <MermaidDiagram
        code={`flowchart LR
        DATA[Weak data]
        MODEL[Model]
        APPS[Apps]
        DATA --> MODEL --> APPS
        APPS -->|"feedback without fix"| DATA`}
      />

      <h2>생성형 AI의 책임 과제</h2>

      <KeyTable
        columns={["과제", "완화"]}
        rows={[
          ["Veracity 환각", "RAG, Temperature ↓, grounding check, 사람 검토"],
          ["Toxicity", "Guardrails content filters, 큐레이션 데이터"],
          ["IP · 표절·저작권", "출처 표시, 사용 정책"],
          ["Privacy", "PII 마스킹, 고객 데이터 미학습 (Bedrock 기본)"],
          ["Prompt injection", "입력 검증, 템플릿 분리, Prompt Attack 필터"],
          ["Prompt leaking", "민감 정보를 시스템 프롬프트에 두지 않음, 접근 제어"],
          ["Defend", "validation · access control · monitoring"],
        ]}
      />

      <p>Guardrails 세부(content · topics · words · sensitive info · grounding · Automated Reasoning)는 <DocLink layer="aif" slug="bedrock-features">Bedrock 기능 지도</DocLink>를 본다.</p>

      <h2>사람 중심 설계</h2>

      <KeyTable
        columns={["원칙", "내용"]}
        rows={[
          ["Human-in-the-loop", "낮은 신뢰도 예측은 사람이 검토. A2I"],
          ["해석 가능 모델 선택", "규제 분야는 성능 조금 낮아도 설명 쉬운 모델 (의사결정 트리, 선형)"],
          ["이해관계자 소통", "Model Cards로 용도·한계·성능 공개"],
          ["피드백 루프", "사용자 피드백으로 지속 개선"],
          ["환경 영향", "더 작은 모델·효율 인프라로 탄소 ↓"],
        ]}
      />

      <h2>기출빈출</h2>

      <KeyTable
        columns={["시나리오", "정답"]}
        rows={[
          ["이력서 심사 모델이 대표성 없는 데이터로 학습", "공정성"],
          ["벌레 물림 진단 앱, 특정 피부색 데이터 부족", "공정성"],
          ["대출 할인 AI를 책임 있게 (2개)", "데이터 불균형 탐지 + 모델 행동 평가(투명성)"],
          ["문서 처리 LLM을 책임 있게 (2개)", "공정성 지표 평가 + 학습 데이터 편향 수정"],
          ["AI 거버넌스 프레임워크의 특징", "데이터·투명성·책임 AI·컴플라이언스 정책 수립"],
          ["모델 결정 과정의 투명성 제공", "Model Cards"],
          ["ISO AI 인증 의미", "개발 프레임워크가 ISO 기준 인증"],
        ]}
      />

      <h2>요약</h2>

      <KeyTable
        columns={["증상", "차원"]}
        rows={[
          ["집단별 불리", "공정성"],
          ["이유 모름", "설명 가능성"],
          ["정보 비공개", "투명성"],
          ["유해 출력", "안전성"],
          ["틀림·흔들림", "진실성 · 견고성"],
        ]}
      />
    </>
  );
}
