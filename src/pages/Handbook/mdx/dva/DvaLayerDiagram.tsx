import { KeyTable } from "@/components/handbook/KeyTable";
import { MermaidDiagram } from "@/components/handbook/MermaidDiagram";

export default function DvaLayerDiagram() {
  return (
    <>
      <p><strong>AWS Certified Developer - Associate (DVA-C02)</strong> 시험은 서버리스 아키텍처와 개발자 도구에 집중하며, 실제 개발 시나리오에서 AWS 서비스를 어떻게 설계·구현하는지 평가합니다.  </p>
      <p>아래 노드를 클릭하면 해당 개념 문서로 이동합니다.</p>

      <hr />

      <h2>DVA-C02 시험 구조 (4개 도메인)</h2>

      <KeyTable
        columns={["도메인", "비중", "핵심 주제"]}
        rows={[
          ["개발", "32%", "Lambda(기능·Function URL·런타임), DynamoDB(TTL·Streams·RCU/WCU), API Gateway(REST/HTTP API·통합 유형), AppSync"],
          ["보안", "26%", "IAM 역할·정책, Cognito(User/Identity Pools·SAML), KMS/암호화(S3·Lambda)"],
          ["배포", "24%", "SAM, CI/CD(CodeCommit·CodePipeline·CodeDeploy·블루/그린), CloudFormation"],
          ["문제 해결 및 최적화", "18%", "X-Ray(추적·샘플링), CloudWatch, DynamoDB 성능 튜닝, S3 최적화"],
        ]}
      />

      <hr />

      <h2>가장 많이 나오는 서비스 (Top Services)</h2>

      <p>시험 후기 기준으로 다음 서비스가 특히 자주 출제됩니다.</p>

      <ul>
        <li><strong>Lambda & API Gateway</strong> — 서버리스 핵심 (통합 유형, Authorizer, 캐싱, 스테이지·별칭)</li>
        <li><strong>DynamoDB</strong> — 테이블 설계, RCU/WCU, TTL, Streams, GSI/LSI, 조건부 업데이트</li>
        <li><strong>Cognito</strong> — User Pool / Identity Pool, 인증·인가, SAML 연동</li>
        <li><strong>SAM & CloudFormation</strong> — 서버리스/인프라 코드, 파라미터·DeletionPolicy</li>
        <li><strong>CodePipeline / CodeDeploy</strong> — 파이프라인 구성, 블루/그린·롤링 배포, 훅 순서</li>
      </ul>

      <hr />

      <h2>공부 팁</h2>

      <ul>
        <li><strong>시나리오 기반</strong>: "어떤 상황에서 어떤 서비스를 쓰는가?"가 핵심입니다. 기능 나열보다 요구사항→선택지 비교를 연습하세요.</li>
        <li><strong>IAM 최소 권한</strong>: 각 서비스 간 리소스 접근 시 <strong>최소 권한 원칙</strong>과 역할/리소스 정책 구분을 이해해야 합니다.</li>
        <li><strong>서버리스 우선</strong>: Lambda, DynamoDB, API Gateway, SAM이 시험의 상당 비중을 차지합니다. 코드·배포·이벤트 흐름을 함께 익혀 두면 유리합니다.</li>
      </ul>

      <hr />

      <h2>1. 개발 (32%)</h2>

      <p>Lambda, API Gateway, DynamoDB, 이벤트 드리븐 패턴까지 개발 관점에서 한눈에 볼 수 있습니다.</p>

      <MermaidDiagram
        code={`flowchart TB
        subgraph lambda [Lambda]
          LC([Lambda Concurrency])
          CS([Cold Start])
          DL([DLQ / Destinations])
        end
        subgraph api [API Gateway]
          RH([REST vs HTTP API])
          AZ([Authorizer])
          TH([Throttling])
        end
        subgraph ddb [DynamoDB]
          PK([Partition Key 설계])
          GI([GSI / LSI])
          CU([Conditional Update])
          ST([Streams])
        end
        subgraph evt [Event-Driven]
          SQ([SQS Visibility Timeout])
          SN([SNS Fan-out])
          EB([EventBridge])
        end
        LC --> CS
        RH --> AZ --> TH
        PK --> GI
        CU --> ST
        SQ --> SN --> EB
        lambda ~~~ api
        api ~~~ ddb
        ddb ~~~ evt
      `}
      />

      <hr />

      <h2>2. 보안 (26%)</h2>

      <p>API 인가, Cognito, KMS/암호화까지 시험에 자주 나오는 보안 주제입니다.</p>

      <ul>
        <li><strong>IAM</strong>: 역할(Role)과 정책(정책 평가·리소스 기반 정책), 교차 계정·AssumeRole</li>
        <li><strong>Cognito</strong>: User Pool(가입·로그인·MFA), Identity Pool(임시 자격 증명), SAML 연동</li>
        <li><strong>KMS/암호화</strong>: S3·Lambda에서 SSE-KMS, 고객 관리 키·키 정책, 전송 중 암호화(aws:SecureTransport)</li>
      </ul>

      <p>아래 노드는 API Gateway 인가(Authorizer)와 연관된 문서로 연결됩니다.</p>

      <MermaidDiagram
        code={`flowchart TB
        subgraph security [보안]
          AZ([Authorizer])
        end`}
      />

      <hr />

      <h2>3. 배포 (24%)</h2>

      <p>SAM, CodePipeline, CodeBuild 등 CI/CD와 인프라 코드 배포 흐름입니다.</p>

      <MermaidDiagram
        code={`flowchart TB
        subgraph cicd [CI/CD · 배포]
          CP([CodePipeline])
          CB([CodeBuild])
          SAM([SAM])
        end
        CP --> CB
        SAM`}
      />

      <ul>
        <li><strong>CodeDeploy</strong>: 블루/그린·롤링, In-place 훅 순서(ApplicationStop → BeforeInstall → AfterInstall → ApplicationStart)</li>
        <li><strong>CloudFormation</strong>: 파라미터(AllowedValues), DeletionPolicy(Retain), 스택 정책</li>
      </ul>

      <hr />

      <h2>4. 문제 해결 및 최적화 (18%)</h2>

      <p>X-Ray(추적·샘플링), CloudWatch(로그·메트릭·알람), DynamoDB·S3 성능 관련 주제입니다.</p>

      <ul>
        <li><strong>X-Ray</strong>: 분산 추적, 샘플링 규칙, 세그먼트/서비스 맵, 온프레미스·Lambda 연동</li>
        <li><strong>CloudWatch</strong>: 로그 그룹·메트릭 필터·알람, Lambda/API Gateway 지표(IntegrationLatency·Latency)</li>
        <li><strong>DynamoDB</strong>: 파티션 키 설계·핫 파티션, GSI/LSI·용량, 지수 백오프·UnprocessedKeys</li>
        <li><strong>S3</strong>: 전송 중 암호화 정책, 라이프사이클·스토리지 클래스, CORS·Presigned URL</li>
      </ul>

      <p>아래 노드는 성능·이벤트 추적과 관련된 문서로 연결됩니다.</p>

      <MermaidDiagram
        code={`flowchart TB
        subgraph troubleshoot [문제 해결 · 최적화]
          CS([Cold Start])
          ST([Streams])
          GI([GSI / LSI])
        end
        CS
        ST --> GI`}
      />

      <hr />

      <p>세부 설명은 각 개념 문서에서 이어서 읽을 수 있습니다.</p>
    </>
  );
}
