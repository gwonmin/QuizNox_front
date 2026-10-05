# 핸드북 문서 점검표

핸드북 5개 레이어, 172개 문서를 같은 기준으로 훑은 결과입니다. 점검일 2026-10-05. 표의 수치는 `src/pages/Handbook/mdx` 아래 MDX를 기준으로 집계했습니다.

## 기준

- **요약**: 문서 첫머리에 `SectionSummary`가 있는가
- **그림**: `MermaidDiagram` 수
- **표**: `KeyTable` 수
- **관련 링크**: 본문에서 다른 핸드북 문서로 가는 `DocLink` 수
- **시점**: 날짜가 지나면 틀리는 수치(모델 스펙, 가격 등)에 기준 시점이 적혀 있는가
- **도달 가능**: 매니페스트에 있고 `HandbookView`에 매핑되어 실제로 열리는가

## 요약

- 172개 문서 모두 `SectionSummary`와 표가 있습니다. 매니페스트에 있는데 열리지 않는 문서, 본문 안 링크가 존재하지 않는 문서를 가리키는 경우는 0건입니다.
- 그림이 없는 문서는 54개이며 모두 SAA · DVA · SOA 레이어입니다. 이 세 레이어는 시나리오 · 기출 표 중심의 시험 대비 문서라 구조가 같고, 그림은 선택 사항으로 둡니다. Core CS와 AWS 공통은 전 문서에 그림이 있습니다.
- 관련 링크가 있는 문서는 33개(Core CS 29, AWS 공통 4)입니다. 나머지 문서 사이 이동은 섹션 페이지와 하단 이전 · 다음 링크에 의존합니다.
- 40줄 미만 문서는 26개, 모두 AWS 공통 레이어입니다. 요약 · 표 · 그림이 갖춰진 짧은 개념 문서라 그대로 둡니다.
- 다이어그램 205개 모두 본문 폭 864px 안에 들어옵니다. 가로 스크롤이 생기던 26개는 세로 방향 전환, 서브그래프 세로 쌓기(`~~~`), 서브그래프 안 `direction LR` 제거로 고쳤습니다(2026-10-05). sequenceDiagram은 컨테이너에 맞춰 축소되므로 축소율이 큰 `container-runtime`과 `secrets-manager-basics`만 참여자를 줄이고 메시지를 짧게 했습니다.
- 비교용 서브그래프(예: Prompt Engineering · RAG · Fine-tuning)는 ELK가 선언 순서를 뒤집어 그리는 일이 있어 20개를 `flowchart TB` + 서브그래프 안 `direction LR` + `a ~~~ b` 체인으로 바꿨습니다. 서브그래프 하나가 한 행이 되고 선언 순서대로 위에서 아래로 놓입니다.

## 2026-10-05 보강 내역

- **삭제**: 매니페스트에 없어 열 수 없던 `aws-common/overview`, `soa/overview`, `dva/overview` MDX와 매핑, 재export만 하던 `CoreCsQueueVsPubsub.mdx`. 레이어 개요는 `LayerDiagramPage`가 담당합니다.
- **Cost & FinOps 9개 (Core CS)**: 21줄 · 표 하나였던 문서를 비용이 생기는 구조 그림, 리소스 유형별 과금 방식, 줄이는 방법, 실수하기 쉬운 곳, 관련 링크로 보강했습니다. 구매 옵션 3개는 "기준선은 예약, 변동분은 온디맨드, 중단 허용은 스팟"으로 서로 연결되게 썼습니다.
- **IAM 3개 (AWS 공통)**: `iam-user-vs-role`, `explicit-deny`, `mfa`를 자격이 생기는 경로 · 평가 흐름 · 로그인과 정책 평가에서의 위치 그림과 선택 기준 표로 보강했습니다.
- **CI/CD 5개 + 백업 (Core CS)**: `build`, `devsecops`, `artifact`, `deploy`, `gitops`, `backup`에 흐름 그림 하나씩과 관련 링크를 넣었습니다.
- **`s3-overview` (AWS 공통)**: 객체 수명(클래스 전환 · 만료 · 복제 · 버저닝) 그림과 관련 링크.
- 새로 넣은 다이어그램 19개는 모두 폭 864px 이내이고 렌더 오류가 없습니다. 211개 라우트를 모두 열어 렌더 오류 0, 빈 다이어그램 0, 깨진 링크 0을 확인했습니다.

## 모델 정보 원칙

모델 이름 · 가격 · 컨텍스트 크기 · 벤치마크 순위는 몇 달 만에 바뀌므로 문서 본문에 적지 않습니다.

- 본문에는 바뀌지 않는 내용만 씁니다. 모델 유형(대형 추론형, 소형 고속형, 오픈 가중치, 임베딩 등)과 고르는 기준이 여기에 해당합니다.
- 최신 값은 `src/components/handbook/ModelReferenceLinks.tsx`의 공식 문서 · 리더보드 링크로 보냅니다. 링크가 바뀌면 이 파일 한 곳만 고칩니다.
- 사례나 동향을 인용할 때는 기준 시점과 출처 링크를 함께 적습니다. 예: "OpenAI harness engineering (2026.02)".

## 다이어그램 작성 규칙 (Mermaid 12)

- 전역 설정은 ELK · neo · redux-color, 노드 최소 폭 0 (`src/utils/loadMermaid.ts`).
- 본문 폭 864px 안에 들어오게 그립니다. 가로로 5단계를 넘는 흐름은 `flowchart TB`로 바꿉니다. 서브그래프 여러 개가 나란히 놓여 넓어지면 `a ~~~ b`로 서브그래프끼리 세로로 쌓습니다. 서브그래프 안의 `direction LR`은 ELK가 때에 따라 따르므로 가로 체인이 길면 지웁니다.
- ELK는 화살표 없는 노드 목록의 순서를 지키지 않고, 서로 연결되지 않은 서브그래프는 선언 순서를 뒤집어 놓기도 합니다. 서브그래프 순서가 중요하면 `flowchart TB`로 두고 각 서브그래프 안에 `direction LR`, 서브그래프 사이에 `a ~~~ b` 체인을 넣습니다(이 조합에서는 안쪽 `direction LR`도 지켜집니다). 서브그래프 없이 노드만 나열한 목록은 코드 첫 줄에 `config: { layout: dagre }` frontmatter(한 줄 YAML)를 붙입니다. dagre는 ELK보다 넓게 그리므로 폭을 다시 확인합니다.
- 서브그래프 제목에 괄호 · 특수문자가 들어가면 큰따옴표로 감쌉니다. `subgraph a ["사용량 (시간)"]`

## 다음에 손볼 순서

1. 관련 링크가 없는 문서 139개에 선행 · 후속 개념 링크 두세 개씩. 매니페스트에 `related` 필드를 두고 공통 컴포넌트로 뿌리는 방식이 MDX마다 손으로 넣는 것보다 유지하기 쉽습니다.
2. SAA · DVA · SOA 중 구조가 핵심인 문서(`vpc-peering`, `transit-gateway`, `sns-fanout`, `multiaz-vs-read-replica`, `pilot-light` · `warm-standby` · `active-active`)에 그림 하나씩.

## 문서별

### 1. Core CS (79)

| 섹션 | 문서 | 줄 수 | 그림 | 표 | 관련 링크 |
|---|---|---:|---:|---:|---:|
| 1. Networking Fundamentals | `ip-cidr-subnetting` | 75 | 1 | 3 | 0 |
| 1. Networking Fundamentals | `routing-table` | 52 | 1 | 2 | 0 |
| 1. Networking Fundamentals | `nat` | 65 | 1 | 2 | 0 |
| 1. Networking Fundamentals | `dns-resolver-vs-authoritative` | 63 | 1 | 2 | 0 |
| 1. Networking Fundamentals | `tcp-vs-udp` | 68 | 2 | 1 | 0 |
| 1. Networking Fundamentals | `http-https-tls` | 84 | 1 | 3 | 0 |
| 1. Networking Fundamentals | `l4-vs-l7-lb` | 54 | 1 | 1 | 0 |
| 2. Data & Storage Fundamentals | `block-file-object` | 67 | 1 | 1 | 0 |
| 2. Data & Storage Fundamentals | `rdb` | 128 | 1 | 7 | 0 |
| 2. Data & Storage Fundamentals | `nosql` | 95 | 2 | 5 | 0 |
| 2. Data & Storage Fundamentals | `vector-db` | 93 | 2 | 5 | 0 |
| 2. Data & Storage Fundamentals | `timeseries-db` | 88 | 2 | 5 | 0 |
| 2. Data & Storage Fundamentals | `search` | 86 | 2 | 5 | 0 |
| 2. Data & Storage Fundamentals | `log-store` | 92 | 2 | 5 | 0 |
| 2. Data & Storage Fundamentals | `latency-throughput-iops` | 55 | 1 | 1 | 0 |
| 2. Data & Storage Fundamentals | `acid-transaction-lock` | 75 | 1 | 2 | 0 |
| 2. Data & Storage Fundamentals | `index-why-fast` | 43 | 1 | 1 | 0 |
| 2. Data & Storage Fundamentals | `caching` | 60 | 1 | 2 | 0 |
| 2. Data & Storage Fundamentals | `data-warehouse` | 531 | 6 | 13 | 0 |
| 3. Security Basics | `authn-vs-authz` | 49 | 1 | 1 | 0 |
| 3. Security Basics | `hash-vs-encryption` | 85 | 2 | 2 | 0 |
| 3. Security Basics | `least-privilege` | 53 | 1 | 2 | 0 |
| 3. Security Basics | `firewall` | 61 | 1 | 2 | 0 |
| 4. Distributed Systems Essentials | `stateless-stateful` | 180 | 3 | 5 | 0 |
| 4. Distributed Systems Essentials | `scale-up-scale-out` | 55 | 1 | 1 | 0 |
| 4. Distributed Systems Essentials | `queue-vs-pubsub` | 199 | 4 | 6 | 0 |
| 4. Distributed Systems Essentials | `event-driven-arch` | 105 | 1 | 4 | 0 |
| 4. Distributed Systems Essentials | `idempotency` | 72 | 1 | 3 | 0 |
| 4. Distributed Systems Essentials | `consistency-model` | 78 | 2 | 2 | 0 |
| 4. Distributed Systems Essentials | `cap-theorem` | 79 | 1 | 3 | 0 |
| 4. Distributed Systems Essentials | `distributed-transaction-lock` | 132 | 4 | 2 | 0 |
| 5. Reliability & Operations | `observability` | 66 | 1 | 2 | 0 |
| 5. Reliability & Operations | `retry-backoff` | 100 | 2 | 4 | 0 |
| 5. Reliability & Operations | `throttling-rate-limiting` | 78 | 2 | 2 | 0 |
| 5. Reliability & Operations | `backup` | 64 | 1 | 2 | 6 |
| 5. Reliability & Operations | `replication` | 53 | 1 | 3 | 0 |
| 5. Reliability & Operations | `rto-rpo` | 93 | 1 | 4 | 0 |
| 5. Reliability & Operations | `ha-design` | 217 | 3 | 6 | 0 |
| 5. Reliability & Operations | `dr-strategy` | 50 | 1 | 2 | 0 |
| 5. Reliability & Operations | `sli-slo` | 122 | 2 | 5 | 0 |
| 5. Reliability & Operations | `load-testing` | 230 | 2 | 6 | 0 |
| 5. Reliability & Operations | `aiops` | 243 | 3 | 6 | 0 |
| 6. Containers & Orchestration | `container-image` | 87 | 1 | 4 | 0 |
| 6. Containers & Orchestration | `container-registry` | 87 | 1 | 5 | 0 |
| 6. Containers & Orchestration | `container-runtime` | 141 | 2 | 4 | 0 |
| 6. Containers & Orchestration | `container-orchestration` | 136 | 4 | 5 | 0 |
| 6. Containers & Orchestration | `container-service-endpoint` | 82 | 1 | 5 | 0 |
| 7. CI/CD | `source-control` | 114 | 3 | 3 | 0 |
| 7. CI/CD | `build` | 65 | 1 | 2 | 6 |
| 7. CI/CD | `test` | 187 | 2 | 6 | 0 |
| 7. CI/CD | `devsecops` | 67 | 1 | 2 | 7 |
| 7. CI/CD | `artifact` | 63 | 1 | 2 | 6 |
| 7. CI/CD | `deploy` | 103 | 1 | 6 | 8 |
| 7. CI/CD | `gitops` | 74 | 1 | 3 | 5 |
| 7. CI/CD | `mlops` | 282 | 4 | 7 | 0 |
| 8. Cost & FinOps | `cost-compute` | 71 | 1 | 2 | 8 |
| 8. Cost & FinOps | `cost-storage` | 74 | 1 | 2 | 7 |
| 8. Cost & FinOps | `cost-traffic` | 72 | 1 | 2 | 6 |
| 8. Cost & FinOps | `cost-on-demand` | 63 | 1 | 2 | 4 |
| 8. Cost & FinOps | `cost-reserved` | 76 | 1 | 3 | 5 |
| 8. Cost & FinOps | `cost-spot` | 75 | 1 | 3 | 7 |
| 8. Cost & FinOps | `cost-visibility` | 83 | 1 | 3 | 4 |
| 8. Cost & FinOps | `cost-budgets` | 73 | 1 | 3 | 3 |
| 8. Cost & FinOps | `cost-optimization` | 73 | 1 | 3 | 7 |
| 9. AI 기초 | `llm-basics` | 235 | 2 | 6 | 3 |
| 9. AI 기초 | `rag` | 297 | 2 | 8 | 0 |
| 9. AI 기초 | `ai-agent` | 473 | 5 | 10 | 23 |
| 10. Agent Engineering | `agent-harness` | 150 | 2 | 7 | 7 |
| 10. Agent Engineering | `context-engineering` | 138 | 1 | 7 | 3 |
| 10. Agent Engineering | `agent-state-memory` | 140 | 1 | 8 | 2 |
| 10. Agent Engineering | `agent-loop` | 167 | 2 | 6 | 6 |
| 10. Agent Engineering | `agent-tool-use` | 160 | 2 | 7 | 4 |
| 10. Agent Engineering | `agent-orchestration` | 177 | 3 | 8 | 4 |
| 10. Agent Engineering | `model-routing` | 118 | 1 | 6 | 1 |
| 10. Agent Engineering | `agent-hitl` | 138 | 1 | 8 | 3 |
| 10. Agent Engineering | `agent-guardrails-authz` | 140 | 1 | 9 | 5 |
| 10. Agent Engineering | `agent-eval` | 138 | 2 | 7 | 1 |
| 10. Agent Engineering | `agent-observability` | 128 | 1 | 7 | 2 |
| 10. Agent Engineering | `agent-reliability` | 140 | 2 | 7 | 4 |

### 2. AWS 공통 (39)

| 섹션 | 문서 | 줄 수 | 그림 | 표 | 관련 링크 |
|---|---|---:|---:|---:|---:|
| 1. Networking (VPC · 서브넷 · 보안) | `public-private-subnet` | 40 | 1 | 1 | 0 |
| 1. Networking (VPC · 서브넷 · 보안) | `vpc-route-table` | 34 | 1 | 1 | 0 |
| 1. Networking (VPC · 서브넷 · 보안) | `igw-vs-nat` | 36 | 1 | 1 | 0 |
| 1. Networking (VPC · 서브넷 · 보안) | `elastic-ip` | 33 | 1 | 1 | 0 |
| 1. Networking (VPC · 서브넷 · 보안) | `security-group` | 35 | 1 | 1 | 0 |
| 1. Networking (VPC · 서브넷 · 보안) | `nacl` | 38 | 1 | 1 | 0 |
| 1. Networking (VPC · 서브넷 · 보안) | `vpc-endpoint` | 35 | 1 | 1 | 0 |
| 2. Identity & Access (IAM) | `iam-user-vs-role` | 73 | 1 | 2 | 5 |
| 2. Identity & Access (IAM) | `policy-evaluation` | 35 | 1 | 1 | 0 |
| 2. Identity & Access (IAM) | `identity-vs-resource-policy` | 38 | 1 | 1 | 0 |
| 2. Identity & Access (IAM) | `explicit-deny` | 65 | 1 | 2 | 4 |
| 2. Identity & Access (IAM) | `sts-assumerole` | 37 | 1 | 1 | 0 |
| 2. Identity & Access (IAM) | `cross-account` | 37 | 1 | 1 | 0 |
| 2. Identity & Access (IAM) | `mfa` | 65 | 1 | 2 | 6 |
| 3. Storage & Data (S3 · EBS · EFS · RDS · DynamoDB · ElastiCache) | `s3-overview` | 70 | 1 | 3 | 6 |
| 3. Storage & Data (S3 · EBS · EFS · RDS · DynamoDB · ElastiCache) | `ebs-basics` | 44 | 1 | 2 | 0 |
| 3. Storage & Data (S3 · EBS · EFS · RDS · DynamoDB · ElastiCache) | `efs-basics` | 34 | 1 | 1 | 0 |
| 3. Storage & Data (S3 · EBS · EFS · RDS · DynamoDB · ElastiCache) | `rds-basics` | 38 | 1 | 1 | 0 |
| 3. Storage & Data (S3 · EBS · EFS · RDS · DynamoDB · ElastiCache) | `dynamodb-basics` | 45 | 1 | 2 | 0 |
| 3. Storage & Data (S3 · EBS · EFS · RDS · DynamoDB · ElastiCache) | `elasticache-basics` | 45 | 1 | 2 | 0 |
| 4. Compute & Scaling (EC2 · Lambda · ECS · EKS · ELB · ASG) | `ec2-overview` | 35 | 1 | 1 | 0 |
| 4. Compute & Scaling (EC2 · Lambda · ECS · EKS · ELB · ASG) | `lambda-basics` | 33 | 1 | 1 | 0 |
| 4. Compute & Scaling (EC2 · Lambda · ECS · EKS · ELB · ASG) | `ecs-basics` | 34 | 1 | 1 | 0 |
| 4. Compute & Scaling (EC2 · Lambda · ECS · EKS · ELB · ASG) | `eks-basics` | 35 | 1 | 1 | 0 |
| 4. Compute & Scaling (EC2 · Lambda · ECS · EKS · ELB · ASG) | `elb-types` | 36 | 1 | 1 | 0 |
| 4. Compute & Scaling (EC2 · Lambda · ECS · EKS · ELB · ASG) | `target-group` | 34 | 1 | 1 | 0 |
| 4. Compute & Scaling (EC2 · Lambda · ECS · EKS · ELB · ASG) | `health-check` | 34 | 1 | 1 | 0 |
| 4. Compute & Scaling (EC2 · Lambda · ECS · EKS · ELB · ASG) | `sticky-session` | 33 | 1 | 1 | 0 |
| 4. Compute & Scaling (EC2 · Lambda · ECS · EKS · ELB · ASG) | `asg-basics` | 36 | 1 | 1 | 0 |
| 4. Compute & Scaling (EC2 · Lambda · ECS · EKS · ELB · ASG) | `scaling-policy` | 34 | 1 | 1 | 0 |
| 5. Monitoring & Logging (CloudWatch · 감사) | `cloudwatch-metrics-logs` | 38 | 1 | 1 | 0 |
| 5. Monitoring & Logging (CloudWatch · 감사) | `cloudwatch-dashboard` | 34 | 1 | 1 | 0 |
| 5. Monitoring & Logging (CloudWatch · 감사) | `alarm` | 34 | 1 | 1 | 0 |
| 5. Monitoring & Logging (CloudWatch · 감사) | `cloudtrail-vs-config` | 36 | 1 | 1 | 0 |
| 6. Security & Secrets (KMS · Secrets Manager · Parameter Store) | `kms-basics` | 90 | 1 | 4 | 0 |
| 6. Security & Secrets (KMS · Secrets Manager · Parameter Store) | `secrets-manager-basics` | 72 | 1 | 3 | 0 |
| 6. Security & Secrets (KMS · Secrets Manager · Parameter Store) | `ssm-parameter-store` | 86 | 1 | 4 | 0 |
| 7. AI & Bedrock | `bedrock-overview` | 222 | 2 | 5 | 0 |
| 7. AI & Bedrock | `bedrock-agent` | 267 | 5 | 5 | 0 |

### 3. SAA (23)

| 섹션 | 문서 | 줄 수 | 그림 | 표 | 관련 링크 |
|---|---|---:|---:|---:|---:|
| 네트워킹 및 콘텐츠 전송 | `vpc-peering` | 44 | 0 | 3 | 0 |
| 네트워킹 및 콘텐츠 전송 | `transit-gateway` | 44 | 0 | 3 | 0 |
| 네트워킹 및 콘텐츠 전송 | `direct-connect-vpn` | 60 | 0 | 4 | 0 |
| 네트워킹 및 콘텐츠 전송 | `route53-routing` | 62 | 0 | 4 | 0 |
| 네트워킹 및 콘텐츠 전송 | `cloudfront-integration` | 47 | 0 | 3 | 0 |
| 스토리지 | `ebs-vs-efs-fsx` | 62 | 0 | 4 | 0 |
| 스토리지 | `s3-static-hosting` | 49 | 0 | 3 | 0 |
| 컴퓨팅 | `ec2-vs-lambda-ecs-eks` | 59 | 0 | 4 | 0 |
| 컴퓨팅 | `compute-tradeoff` | 46 | 0 | 3 | 0 |
| 컴퓨팅 | `elb-asg-ha` | 59 | 0 | 4 | 0 |
| 데이터베이스 | `rds-vs-aurora` | 60 | 0 | 4 | 0 |
| 데이터베이스 | `multiaz-vs-read-replica` | 60 | 0 | 4 | 0 |
| 데이터베이스 | `dynamodb-use-case` | 48 | 0 | 3 | 0 |
| 데이터베이스 | `elasticache-caching` | 45 | 0 | 3 | 0 |
| 보안 및 권한 | `security-saa` | 57 | 0 | 3 | 0 |
| 보안 및 권한 | `waf-basics` | 45 | 0 | 3 | 0 |
| 통합 및 모니터링 | `sqs-sns-pattern` | 48 | 0 | 3 | 0 |
| 아키텍처 패턴 | `backup` | 46 | 0 | 3 | 0 |
| 아키텍처 패턴 | `pilot-light` | 43 | 0 | 3 | 0 |
| 아키텍처 패턴 | `warm-standby` | 43 | 0 | 3 | 0 |
| 아키텍처 패턴 | `active-active` | 43 | 0 | 3 | 0 |
| 아키텍처 패턴 | `cost-optimization` | 51 | 0 | 3 | 0 |
| 아키텍처 패턴 | `serverless-pattern` | 48 | 0 | 3 | 0 |

### 4. DVA (16)

| 섹션 | 문서 | 줄 수 | 그림 | 표 | 관련 링크 |
|---|---|---:|---:|---:|---:|
| Lambda 심화 | `lambda-concurrency` | 49 | 0 | 3 | 0 |
| Lambda 심화 | `cold-start` | 49 | 0 | 3 | 0 |
| Lambda 심화 | `dlq-destinations` | 47 | 0 | 3 | 0 |
| API Gateway | `rest-vs-http-api` | 48 | 0 | 3 | 0 |
| API Gateway | `authorizer` | 48 | 0 | 3 | 0 |
| API Gateway | `throttling` | 47 | 0 | 3 | 0 |
| DynamoDB 심화 | `partition-key-design` | 49 | 0 | 3 | 0 |
| DynamoDB 심화 | `gsi-lsi` | 50 | 0 | 3 | 0 |
| DynamoDB 심화 | `conditional-update` | 48 | 0 | 3 | 0 |
| DynamoDB 심화 | `streams` | 47 | 0 | 3 | 0 |
| Event-Driven | `sqs-visibility-timeout` | 47 | 0 | 3 | 0 |
| Event-Driven | `sns-fanout` | 48 | 0 | 3 | 0 |
| Event-Driven | `eventbridge` | 48 | 0 | 3 | 0 |
| CI/CD | `codepipeline` | 50 | 0 | 3 | 0 |
| CI/CD | `codebuild` | 48 | 0 | 3 | 0 |
| CI/CD | `sam` | 51 | 0 | 3 | 0 |

### 5. SOA (15)

| 섹션 | 문서 | 줄 수 | 그림 | 표 | 관련 링크 |
|---|---|---:|---:|---:|---:|
| CloudWatch 고급 | `metric-filter` | 48 | 0 | 3 | 0 |
| CloudWatch 고급 | `composite-alarm` | 45 | 0 | 3 | 0 |
| CloudWatch 고급 | `logs-insights` | 47 | 0 | 3 | 0 |
| Systems Manager | `session-manager` | 47 | 0 | 3 | 0 |
| Systems Manager | `patch-manager` | 46 | 0 | 3 | 0 |
| Systems Manager | `run-command` | 47 | 0 | 3 | 0 |
| EC2 운영 | `launch-template` | 46 | 0 | 3 | 0 |
| EC2 운영 | `ami-management` | 46 | 0 | 3 | 0 |
| EC2 운영 | `ebs-snapshot` | 49 | 0 | 3 | 0 |
| 트러블슈팅 | `flow-logs` | 48 | 0 | 3 | 0 |
| 트러블슈팅 | `dns-issues` | 49 | 0 | 3 | 0 |
| 트러블슈팅 | `sg-nacl-analysis` | 50 | 0 | 3 | 0 |
| 거버넌스 | `aws-config` | 50 | 0 | 3 | 0 |
| 거버넌스 | `guardduty` | 47 | 0 | 3 | 0 |
| 거버넌스 | `cost-explorer-budgets` | 49 | 0 | 3 | 0 |
