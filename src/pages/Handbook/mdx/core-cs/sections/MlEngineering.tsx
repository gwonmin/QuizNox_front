import { MermaidDiagramWithLinks } from "@/components/handbook/MermaidDiagramWithLinks";

/** 노드 첫 줄은 handbookDiagramLinks의 키와 맞춘다. 둘째 줄은 그 문서가 맡는 일이다. */
export default function MlEngineering() {
  return (
    <>
      <MermaidDiagramWithLinks
        diagramIndex={8}
        code={`flowchart TB
        DATA[("학습 데이터")]
        PIPE["ML 파이프라인\n모델을 만든다"]
        SERVE["모델 서빙\n요청에 응답한다"]
        OPS["MLOps\n이 과정을 되풀이한다"]
        DATA --> PIPE
        PIPE -->|"평가를 통과한 모델 버전"| SERVE
        SERVE -->|"입력 · 예측 · 성능 지표"| OPS
        OPS -.->|"드리프트 감지 시 재학습"| PIPE`}
      />
    </>
  );
}
