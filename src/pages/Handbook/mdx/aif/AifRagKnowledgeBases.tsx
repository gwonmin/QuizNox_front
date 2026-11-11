import { SectionSummary } from "@/components/handbook/SectionSummary";
import { KeyTable } from "@/components/handbook/KeyTable";
import { MermaidDiagram } from "@/components/handbook/MermaidDiagram";
import { DocLink } from "@/components/handbook/DocLink";

export default function AifRagKnowledgeBases() {
  return (
    <>
      <SectionSummary
        lead="**커스터마이징 사다리**: Prompt engineering → RAG → 모델 커스터마이징. RAG는 앱 → orchestrator → 증강 프롬프트 → LLM이다. Bedrock Knowledge Bases가 청킹·임베딩·검색·생성을 관리한다."
        bullets={[
          "모델을 재학습하지 않고 최신·사내 지식을 반영한다. RetrieveAndGenerate로 답과 출처(citations)를 받는다.",
          "Hydrate: data → chunks → embeddings → KB. Orchestrator: query embedding → semantic search → 증강 프롬프트.",
          "저장소는 벡터 · 그래프(관계) · 하이브리드를 고른다.",
        ]}
      />

      <h2>흐름</h2>

      <p>수집(사전 처리)은 한 번, 질의는 요청마다 orchestrator가 실행한다.</p>

      <MermaidDiagram
        code={`flowchart LR
        D[Data] --> CH[Chunks] --> EM[Embeddings] --> KB[Knowledge Base]`}
      />

      <MermaidDiagram
        code={`flowchart LR
        APP[App] --> ORCH[Orchestrator]
        ORCH --> QE[Query embedding]
        QE --> SS[Semantic search]
        SS --> AUG[Augmented prompt]
        AUG --> LLM[LLM]
        LLM --> ANS[Answer with citations]`}
      />

      <h2>RAG vs 파인튜닝</h2>

      <KeyTable
        columns={["", "RAG", "파인튜닝"]}
        rows={[
          ["지식 갱신", "문서만 바꾸면 즉시 반영", "재학습 필요"],
          ["출처 표시", "가능", "불가"],
          ["비용", "낮음 (임베딩·검색)", "높음 (학습 + Provisioned)"],
          ["환각", "근거 제공으로 감소", "도메인 지식은 늘지만 환각 보장 없음"],
          ["맞는 것", "사실·지식 질문", "스타일·형식·작업 특화"],
        ]}
      />

      <h2>Bedrock Knowledge Bases 구성</h2>

      **Setup**: create KB → add data source → sync.

      <KeyTable
        columns={["요소", "선택지"]}
        rows={[
          ["데이터 소스", "S3, 웹 크롤러, Confluence, SharePoint, Salesforce"],
          ["청킹 전략", "고정 크기, 기본(300 토큰), 계층형, 시맨틱, 청킹 없음"],
          ["임베딩 모델", "Titan Text Embeddings, Cohere Embed"],
          ["벡터 저장소", "OpenSearch Serverless(빠른 생성 기본), Aurora PostgreSQL pgvector, Neptune Analytics(GraphRAG), Pinecone, Redis Enterprise, MongoDB Atlas"],
          ["Store 유형", "벡터(유사도), 그래프(관계), 하이브리드"],
          ["API", "Retrieve (검색만), RetrieveAndGenerate (검색 + 생성 + citations)"],
          ["고급", "메타데이터 필터링, 하이브리드 검색, 리랭킹, 쿼리 분해"],
        ]}
      />

      <h2>청킹</h2>

      <KeyTable
        columns={["전략", "특징"]}
        rows={[
          ["고정 크기", "단순. 토큰 수와 오버랩 지정"],
          ["계층형 (Hierarchical)", "부모-자식 청크. 검색은 자식, 컨텍스트는 부모"],
          ["시맨틱", "의미 경계로 분할. 품질 ↑ 비용 ↑"],
          ["Small chunks", "검색이 빠르고 정밀. 문맥은 상대적으로 적음"],
          ["Large chunks", "더 많은 컨텍스트. 노이즈·토큰 비용 ↑"],
        ]}
      />

      <h2>기출빈출</h2>

      <KeyTable
        columns={["시나리오", "정답"]}
        rows={[
          ["정책이 자주 바뀌는 사내 챗봇", "RAG + Knowledge Bases"],
          ["항공사 상담 비서, LLM + 사내 데이터", "RAG 에이전트 (Bedrock)"],
          ["임베딩을 벡터 DB에 저장해 RAG에 쓰는 서비스", "OpenSearch Service"],
          ["RAG의 핵심 이점", "모델 재학습 없이 외부·최신 지식 반영, 환각 감소"],
          ["구조화된 환자 기록에서 정보 추출 후 요약", "Comprehend Medical + Bedrock"],
          ["RAG 응답 품질 측정", "Faithfulness(근거 충실), Answer relevance, Context precision"],
        ]}
      />

      <h2>요약</h2>

      <KeyTable
        columns={["묻는 것", "답"]}
        rows={[
          ["최신·사내 지식", "RAG"],
          ["관리형 RAG", "Bedrock Knowledge Bases"],
          ["벡터 저장소", "OpenSearch Serverless, Aurora pgvector"],
          ["임베딩 모델", "Titan Embeddings"],
          ["더 깊이", <DocLink layer="core-cs" slug="rag">RAG (core-cs)</DocLink>],
        ]}
      />
    </>
  );
}
