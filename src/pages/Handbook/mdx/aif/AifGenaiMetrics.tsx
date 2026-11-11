import { SectionSummary } from "@/components/handbook/SectionSummary";
import { KeyTable } from "@/components/handbook/KeyTable";
import { DocLink } from "@/components/handbook/DocLink";

export default function AifGenaiMetrics() {
  return (
    <>
      <SectionSummary
        lead="LLM 평가보다 RAG 평가가 더 복잡하다. 프롬프트 카탈로그(프롬프트 + 라벨 출력)로 채점하고, 정확도·유사도·사람·LLM judge를 고른다."
        bullets={[
          "요약 → ROUGE, 번역 → BLEU, 의미 유사도 → BERTScore. RAGAS: retrieval은 context precision·recall, generation은 faithfulness·relevancy.",
          "Bedrock evals: programmatic · human · LLM judge. LLM 기반 지표는 비용이 더 든다.",
          "최적화: prompt caching · routing · 저지연 경로. 선택 흐름은 FM 선택 문서를 본다.",
        ]}
      />

      <h2>텍스트 지표</h2>

      <KeyTable
        columns={["지표", "재는 것", "맞는 작업", "시험 문장"]}
        rows={[
          ["ROUGE", "참조 대비 n-gram 재현율 (참조 내용을 얼마나 담았나)", "요약", "summarization quality, coverage"],
          ["BLEU", "참조 대비 n-gram 정밀도 (생성이 참조와 얼마나 일치)", "번역", "translation accuracy"],
          ["BERTScore", "임베딩 기반 의미 유사도. 표현이 달라도 의미 같으면 높음", "요약·패러프레이즈, 의미 비교", "semantic similarity"],
          ["METEOR", "동의어·어간 고려한 번역 지표", "번역", "-"],
          ["Perplexity", "모델이 다음 토큰을 얼마나 확신하나. 낮을수록 좋음", "언어 모델 자체 품질", "how well model predicts text"],
          ["F1 (추출·QA)", "정답 토큰 겹침", "추출형 QA", "-"],
        ]}
      />

      <h2>프롬프트 카탈로그 · 채점</h2>

      <p><strong>Prompt catalog</strong> = 평가용 프롬프트 + labeled outputs. 점수 축은 accuracy · similarity · human · LLM이다.</p>

      <h2>평가 방식</h2>

      <p>LLM-only 평가는 상대적으로 단순하고, RAG는 검색·생성 축이 나뉘어 더 복잡하다.</p>

      <KeyTable
        columns={["방식", "내용", "언제 · 비용"]}
        rows={[
          ["Bedrock · programmatic", "내장·자체 데이터셋으로 정확도·견고성·독성 등. ROUGE·BLEU·BERTScore", "빠른 비교 · 상대적 저비용"],
          ["Bedrock · human", "자체 팀 또는 AWS 관리 팀이 순위·선호 평가", "어조·브랜드 · 고비용"],
          ["Bedrock · LLM judge", "다른 LLM이 채점", "대량 자동화 · LLM 기반이라 비용 ↑"],
          ["Non-LLM metrics", "ROUGE·BLEU·임베딩 유사도·규칙 검사", "저비용 · 의미 미묘함은 약함"],
          ["벤치마크", "MMLU, HELM, GLUE 등 공개 데이터셋", "일반 능력 비교"],
          ["RAGAS retrieval", "Context precision, context recall", "검색 품질"],
          ["RAGAS generation", "Faithfulness, answer relevancy", "생성 품질"],
          ["비즈니스 지표", "만족도, 전환율, 처리 시간, 비용", "ROI"],
        ]}
      />

      <p>최적화 레버(prompt caching · routing · 저지연)는 <DocLink layer="aws-common" slug="bedrock-apis">Bedrock APIs</DocLink>와 <DocLink layer="aif" slug="fm-selection">FM 선택</DocLink>을 본다.</p>

      <h2>책임 있는 AI 평가 차원</h2>

      <KeyTable
        columns={["차원", "뜻"]}
        rows={[
          ["독성 (Toxicity)", "유해·공격적 출력 비율"],
          ["견고성 (Robustness)", "입력 변형에 출력이 흔들리지 않음"],
          ["정확도 (Accuracy)", "사실 일치"],
          ["편향", "집단별 출력 차이"],
        ]}
      />

      <h2>기출빈출</h2>

      <KeyTable
        columns={["시나리오", "정답"]}
        rows={[
          ["교육 자료를 영어에서 다른 언어로 번역한 품질", "BLEU"],
          ["여러 LLM의 텍스트 요약 품질 비교", "ROUGE"],
          ["요약의 의미 유사도와 핵심 정보 포함 (2개)", "BERTScore + ROUGE"],
          ["Bedrock 자동 평가에서 의미 기반 요약 지표", "BERTScore"],
          ["다국어 요약 번역 품질", "BLEU"],
          ["JumpStart의 LLM 몇 개 중 요약 성능 비교, 최소 노력", "자동 모델 평가"],
          ["LLM 운영 효율 지표", "평균 응답 시간"],
        ]}
      />

      <h2>요약</h2>

      <KeyTable
        columns={["작업", "지표"]}
        rows={[
          ["요약", "ROUGE"],
          ["번역", "BLEU"],
          ["의미 비교", "BERTScore"],
          ["언어 모델 자체", "Perplexity"],
          ["RAG retrieval", "Context precision · recall"],
          ["RAG generation", "Faithfulness · relevancy"],
          ["주관 품질", "사람 평가 · LLM judge"],
        ]}
      />
    </>
  );
}
