import { SectionSummary } from "@/components/handbook/SectionSummary";
import { KeyTable } from "@/components/handbook/KeyTable";
import { DocLink } from "@/components/handbook/DocLink";

export default function AifFmSelection() {
  return (
    <>
      <SectionSummary
        lead={<>FM 선택은 <strong>shortlist → benchmark → priorities</strong> 순이다. 모달리티·크기·지연·비용·컨텍스트·커스터마이징을 저울질하고 Bedrock 한 API로 후보를 비교한다.</>}
        bullets={[
          "후보를 좁힌 뒤 동일 프롬프트 세트로 벤치마크하고, 비용·지연·품질 우선순위로 고른다.",
          "실시간 응답 → 추론 속도, 긴 문서 → 컨텍스트 윈도우, 이미지+텍스트 → 멀티모달.",
          "Bedrock 모델 평가(자동·사람·LLM judge)와 Prompt Router로 선택을 돕는다.",
        ]}
      />

      <h2>선택 흐름</h2>

      <p><strong>Shortlist</strong> (후보 압축) → <strong>Benchmark</strong> (동일 데이터로 비교) → <strong>Priorities</strong> (비용·지연·품질·컴플라이언스 가중).</p>

      <h2>선택 기준</h2>

      <KeyTable
        columns={["기준", "질문", "시험 문장"]}
        rows={[
          ["모달리티", "텍스트만? 이미지·오디오도?", "process images and text"],
          ["모델 크기", "큰 모델은 성능 ↑ 비용·지연 ↑", "balance performance and cost"],
          ["추론 속도 · 지연", "실시간 대화인가?", "respond in real time"],
          ["컨텍스트 윈도우", "긴 문서를 통째로 넣는가?", "long documents"],
          ["커스터마이징", "파인튜닝 지원 여부", "customize with company data"],
          ["비용", "토큰당 가격, Provisioned 여부", "cost-effective"],
          ["언어", "다국어 지원", "multiple languages"],
          ["라이선스 · 컴플라이언스", "상용 사용, 데이터 처리 지역", "regulatory"],
        ]}
      />

      <h2>Amazon Nova 계열</h2>

      <KeyTable
        columns={["모델", "입력", "특징"]}
        rows={[
          ["Nova Micro", "텍스트", "가장 빠르고 저렴. 텍스트 전용"],
          ["Nova Lite", "텍스트·이미지·영상", "저비용 멀티모달, 다국어"],
          ["Nova Pro", "텍스트·이미지·영상", "고성능 멀티모달"],
          ["Nova Premier", "텍스트·이미지·영상", "최상위 성능, 모델 증류의 교사 모델"],
          ["Nova Canvas", "텍스트 → 이미지", "이미지 생성·편집. Negative prompt 지원"],
          ["Nova Reel", "텍스트·이미지 → 영상", "짧은 영상 생성"],
        ]}
      />

      <h2>Bedrock의 다른 모델 공급사</h2>

      <KeyTable
        columns={["공급사", "모델", "용도"]}
        rows={[
          ["Amazon", "Titan Text, Titan Embeddings, Titan Image", "텍스트, 임베딩(RAG), 이미지"],
          ["Anthropic", "Claude", "긴 컨텍스트, 추론, 코딩"],
          ["Meta", "Llama", "오픈 가중치"],
          ["Stability AI", "Stable Diffusion", "이미지 생성"],
          ["Mistral, Cohere, AI21", "Mistral, Command, Jamba", "텍스트·임베딩"],
        ]}
      />

      <h2>선택 도구</h2>

      <KeyTable
        columns={["도구", "하는 일"]}
        rows={[
          ["Bedrock 평가 · programmatic", "ROUGE·BLEU·BERTScore 등 지표로 모델 비교. 내장 또는 자체 데이터셋"],
          ["Bedrock 평가 · human", "자체 팀 또는 AWS 관리 팀이 출력 비교"],
          ["Bedrock 평가 · LLM judge", "다른 모델이 채점. 대량·주관 품질에 사용, 비용 상대적 증가"],
          ["Prompt Router", "하나의 엔드포인트로 요청별 최적 모델 자동 선택. 비용·품질 균형"],
          ["Model Distillation", "큰 교사 모델의 응답으로 작은 학생 모델 학습. 비용·지연 ↓"],
          ["PartyRock", "코드 없이 생성형 AI 앱 실험. 학습·프로토타입용"],
          ["Bedrock Playground", "콘솔에서 모델·파라미터 바로 시험"],
        ]}
      />

      <h2>기출빈출</h2>

      <KeyTable
        columns={["시나리오", "정답"]}
        rows={[
          ["사용자에게 실시간 응답해야 하는 모델 특성", "추론 속도"],
          ["다국어 지원 멀티모달 Nova 모델", "Nova Lite"],
          ["영상 콘텐츠 생성으로 제작 시간 단축", "Nova Reel"],
          ["단일 엔드포인트, 요청별 최적 FM 자동 선택", "Prompt Router"],
          ["JumpStart의 여러 LLM 중 요약 성능 비교", "자동 모델 평가"],
          ["생성형 AI를 실험 환경에서 가장 저렴하게 배우기", "PartyRock"],
          ["스토리 생성 앱에 텍스트→이미지 추가", "Stable Diffusion / Nova Canvas"],
        ]}
      />

      <h2>요약</h2>

      <KeyTable
        columns={["묻는 것", "답"]}
        rows={[
          ["실시간", "추론 속도"],
          ["긴 입력", "컨텍스트 윈도우"],
          ["이미지 생성", "Nova Canvas, Stable Diffusion"],
          ["영상 생성", "Nova Reel"],
          ["모델 비교", "Bedrock 모델 평가"],
          ["Bedrock 구조", <DocLink layer="aws-common" slug="bedrock-overview">Bedrock 개요</DocLink>],
        ]}
      />
    </>
  );
}
