import { SectionSummary } from "@/components/handbook/SectionSummary";
import { KeyTable } from "@/components/handbook/KeyTable";
import { MermaidDiagram } from "@/components/handbook/MermaidDiagram";
import { DocLink } from "@/components/handbook/DocLink";

export default function Mlops() {
  return (
    <>
      <SectionSummary
        lead="MLOps는 ML 파이프라인과 모델 서빙을 사람 손 없이 되풀이되게 운영하는 방식이다. 코드가 바뀔 때에 더해, 데이터가 바뀌거나 모델 성능이 떨어질 때도 다시 학습하고 배포한다."
        bullets={[
          "코드 배포의 CI · CD에 지속 학습(CT, Continuous Training)이 더해진다.",
          "배포한 모델은 시간이 지나면 성능이 떨어진다. Data Drift와 Model Drift를 감지해 재학습을 일으킨다.",
          "수동 학습에서 파이프라인 자동화, CI/CD/CT 완전 자동화로 성숙도를 단계적으로 올린다.",
        ]}
      />

      <h2>ML 모델 라이프사이클</h2>

      <p>앞의 두 문서가 이 고리의 절반씩을 맡는다. 데이터에서 레지스트리 등록까지는 <DocLink slug="ml-pipeline">ML 파이프라인</DocLink>, 배포는 <DocLink slug="model-serving">모델 서빙</DocLink>이다. MLOps는 모니터링 결과가 다시 학습으로 돌아가는 화살표를 자동으로 만든다.</p>

      <MermaidDiagram
        code={`flowchart TB
        SRC[("데이터")]
        subgraph pipe ["ML 파이프라인"]
          DC["데이터 수집 · 검증"] --> FE["피처 엔지니어링"] --> TR["모델 학습"] --> EV["모델 평가"] --> RG["레지스트리 등록"]
        end
        subgraph serving ["모델 서빙"]
          DP["모델 배포"]
        end
        subgraph ops ["MLOps가 닫는 고리"]
          MN["모니터링 (Drift 감지)"] --> RT["재학습 트리거 (CT)"]
        end
        SRC --> pipe
        pipe -->|"평가를 통과한 모델 버전"| serving
        serving -->|"입력 · 예측 · 성능 지표"| ops
        ops -.->|"새 데이터로 다시 실행"| pipe`}
      />

      <h2>코드 배포와 무엇이 다른가</h2>

      <p>빌드 · 테스트 · 배포를 자동화한다는 생각은 <DocLink slug="deploy">배포 자동화</DocLink>와 같다. 배포 대상에 데이터와 모델이 더해지면서 파이프라인의 단계, 검증 방법, 다시 배포하는 이유가 달라진다.</p>

      <KeyTable
        columns={["구분", "CI/CD (소프트웨어)", "MLOps (ML 모델)"]}
        rows={[
          [
            "배포 대상",
            "코드 (애플리케이션)",
            "모델 + 코드 + 데이터",
          ],
          [
            "파이프라인",
            "빌드 → 테스트 → 배포",
            "데이터 수집 → 학습 → 평가 → 배포 → 모니터링 → 재학습",
          ],
          [
            "테스트",
            "단위·통합·E2E 테스트",
            "모델 정확도·공정성·편향 검증 + 데이터 품질 검증",
          ],
          [
            "트리거",
            "코드 변경 (git push)",
            "코드 변경 + 데이터 변경 + 성능 저하 감지",
          ],
          [
            "재배포 이유",
            "기능 추가·버그 수정",
            "데이터 분포 변화(Drift)로 인한 모델 품질 하락",
          ],
        ]}
      />

      <h2>CI · CD · CT</h2>

      <KeyTable
        columns={["구분", "자동화하는 것", "실행되는 계기"]}
        rows={[
          ["CI (지속 통합)", "코드 테스트에 더해 데이터 스키마 검증, 파이프라인 구성 요소 테스트", "코드 변경"],
          ["CD (지속 배포)", "학습 파이프라인 자체의 배포, 그리고 평가를 통과한 모델의 서빙 배포", "파이프라인 변경, 새 모델 버전 등록"],
          ["CT (지속 학습)", "새 데이터로 학습 파이프라인을 다시 실행해 새 모델 버전을 만든다", "일정, 새 데이터 도착, 드리프트 감지"],
        ]}
      />

      <MermaidDiagram
        code={`flowchart TB
        T1["일정 (매주 · 매월)"] --> CT["학습 파이프라인 재실행"]
        T2["새 데이터 도착"] --> CT
        T3["드리프트 · 성능 저하 감지"] --> CT
        CT --> GATE{"기존 모델보다 나은지 평가"}
        GATE -->|"낫다"| REL["새 버전 등록 · 배포"]
        GATE -->|"아니다"| KEEP["기존 버전 유지 · 원인 확인"]`}
      />

      <h2>MLOps 성숙도 레벨</h2>

      <KeyTable
        columns={["레벨", "이름", "특징"]}
        rows={[
          [
            "Level 0",
            "수동 프로세스",
            "노트북에서 수동으로 학습·배포. 재현성 없음. 모니터링 없음.",
          ],
          [
            "Level 1",
            "ML 파이프라인 자동화",
            "학습 파이프라인이 자동화됨. CT(Continuous Training) 도입. 데이터 변경 시 자동 재학습.",
          ],
          [
            "Level 2",
            "CI/CD/CT 완전 자동화",
            "파이프라인 코드 자체도 CI/CD로 관리. 모델 배포·롤백 자동화. A/B 테스트·카나리 배포.",
          ],
        ]}
      />

      <MermaidDiagram
        code={`flowchart TB
        subgraph level0 ["Level 0: 수동"]
          direction LR
          L0A["데이터 사이언티스트가\n노트북에서 수동 학습"] --> L0B["수동 배포\n(pkl 파일 전달)"]
        end

        subgraph level1 ["Level 1: 파이프라인 자동화"]
          direction LR
          L1A["자동 학습\n파이프라인"] --> L1B["자동 배포"]
          L1B --> L1C["모니터링"]
          L1C -->|"Drift 감지"| L1A
        end

        subgraph level2 ["Level 2: CI/CD/CT"]
          direction LR
          L2A["파이프라인 코드\nCI/CD"] --> L2B["자동 학습\n+ 평가"]
          L2B --> L2C["자동 배포\n(카나리/A/B)"]
          L2C --> L2D["모니터링\n+ 자동 재학습"]
          L2D --> L2A
        end
        level0 ~~~ level1
        level1 ~~~ level2
      `}
      />

      <h2>Data Drift / Model Drift</h2>

      <p>모델 배포 후 시간이 지나면 입력 데이터의 분포나 데이터와 타깃의 관계가 변하여 모델 성능이 저하된다.</p>

      <KeyTable
        columns={["구분", "Data Drift", "Model Drift (Concept Drift)"]}
        rows={[
          [
            "정의",
            "입력 데이터의 통계적 분포가 학습 시점과 달라지는 현상",
            "입력과 타깃 간의 관계 자체가 변하는 현상",
          ],
          [
            "예시",
            "코로나 이후 구매 패턴 변화로 입력 피처 분포가 달라짐",
            "경제 환경 변화로 기존 대출 심사 모델의 판단 기준이 맞지 않게 됨",
          ],
          [
            "감지 방법",
            "PSI, KS 테스트, 분포 비교 대시보드",
            "예측 정확도·F1 점수 등 모델 메트릭 추이 모니터링",
          ],
          [
            "대응",
            "최신 데이터로 재학습 (CT 트리거)",
            "모델 구조·피처 재설계 후 재학습",
          ],
        ]}
      />

      <MermaidDiagram
        code={`flowchart TB
        PROD["프로덕션 모델"]
        MON["모니터링\n(정확도, 분포 추적)"]
        DRIFT["Drift 감지\n(임계치 초과)"]
        ALERT["알람 발송"]
        CT["자동 재학습\n(CT 파이프라인)"]
        DEPLOY["새 모델 배포"]

        PROD --> MON --> DRIFT
        DRIFT -->|"정상"| MON
        DRIFT -->|"Drift 발생"| ALERT --> CT --> DEPLOY --> MON`}
      />

      <h2>대표 MLOps 플랫폼</h2>

      <KeyTable
        columns={["플랫폼", "유형", "특징"]}
        rows={[
          [
            "MLflow",
            "오픈소스",
            "Experiment Tracking + Model Registry + 배포. 가볍고 유연하며 다양한 ML 프레임워크와 연동.",
          ],
          [
            "Kubeflow",
            "오픈소스 (K8s)",
            "Kubernetes 위에서 ML 파이프라인을 실행. 대규모 분산 학습에 적합.",
          ],
          [
            "AWS SageMaker",
            "클라우드 관리형",
            "학습·서빙·파이프라인·Feature Store·모니터링을 통합 제공. AWS 생태계와 긴밀 연동.",
          ],
          [
            "GCP Vertex AI",
            "클라우드 관리형",
            "AutoML + 커스텀 학습 + Feature Store + 파이프라인. BigQuery와 직접 연동.",
          ],
          [
            "Azure ML",
            "클라우드 관리형",
            "디자이너 UI + SDK + 자동 ML. Azure DevOps와의 CI/CD 통합.",
          ],
        ]}
      />

      <h2>요약</h2>

      <KeyTable
        columns={["핵심 포인트", "설명"]}
        rows={[
          [
            "MLOps = CI · CD + CT",
            "코드 변경에 더해 데이터 변화와 성능 저하가 재학습과 재배포의 계기가 된다.",
          ],
          [
            "성숙도를 단계적으로 올린다",
            "수동(Level 0) → 파이프라인 자동화(Level 1) → CI/CD/CT 완전 자동화(Level 2).",
          ],
          [
            "Drift 모니터링이 고리를 닫는다",
            "배포 후 방치하면 모델 성능이 떨어진다. Data Drift와 Model Drift를 감지해 재학습으로 연결한다.",
          ],
          [
            "모델을 호출만 할 때의 운영",
            <>
              가중치를 직접 만들지 않고 LLM을 호출하는 애플리케이션은 프롬프트 · 인덱스 · 평가 세트를 버전으로 관리한다.{" "}
              <DocLink slug="llmops">LLMOps</DocLink>에서 다룬다.
            </>,
          ],
        ]}
      />
    </>
  );
}
