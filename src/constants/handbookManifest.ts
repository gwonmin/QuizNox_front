/**
 * QUIZNOX Handbook — 5 Layer Architecture
 * Systems Fundamentals → AWS 공통 → SAA → DVA → SOA
 */

export interface HandbookDoc {
  slug: string;
  title: string;
}

export interface HandbookSection {
  id: string;
  title: string;
  /** 섹션 카드에 보이는 한 줄 요약 */
  summary?: string;
  /** 섹션 페이지 상단 "왜 배우나요?" 단락 */
  why?: string;
  /** 섹션 다이어그램 위 학습 흐름 한 줄 */
  flow?: string;
  /** 학습 순서대로 정렬 */
  docs: HandbookDoc[];
}

export interface HandbookLayer {
  id: string;
  title: string;
  description?: string;
  sections: HandbookSection[];
}

export const HANDBOOK_LAYERS: HandbookLayer[] = [
  {
    id: "core-cs",
    title: "1. Systems Fundamentals",
    description: "시스템 기초 개념 (네트워크·스토리지·보안·분산·운영·배포·비용·AI)",
    sections: [
      {
        id: "networking",
        title: "1. Networking Fundamentals",
        summary: "요청이 주소·경로·프로토콜·로드밸런서를 거쳐 서버에 닿기까지",
        why: "요청이 어디서 막혔는지 짚으려면 주소와 경로, 이름 해석, 전송 프로토콜, 로드밸런서를 순서대로 알아야 합니다. VPC·DNS·ALB 설계도 같은 순서로 결정됩니다.",
        flow: "주소·경로 → 프로토콜 → 로드밸런싱 → 컴퓨트",
        docs: [
          { slug: "ip-cidr-subnetting", title: "IP / CIDR / Subnet" },
          { slug: "routing-table", title: "Routing" },
          { slug: "nat", title: "NAT / Firewall 개념" },
          { slug: "dns-resolver-vs-authoritative", title: "DNS (records, TTL, resolver)" },
          { slug: "tcp-vs-udp", title: "TCP vs UDP" },
          { slug: "http-https-tls", title: "HTTP / HTTPS / TLS" },
          { slug: "l4-vs-l7-lb", title: "L4 vs L7 LB" },
        ],
      },
      {
        id: "data-storage",
        title: "2. Data & Storage Fundamentals",
        summary: "저장 방식과 DB 유형을 고르고, 성능·일관성·캐시를 설계하기",
        why: "데이터를 어디에 어떤 모델로 둘지에 따라 성능과 일관성, 비용이 정해집니다. 저장 방식과 DB 유형을 먼저 고르고, 그다음 인덱스·트랜잭션·캐시로 다듬습니다.",
        flow: "저장 방식·DB 유형 → 성능·일관성·인덱스 → 캐시 · 분석 저장소",
        docs: [
          { slug: "block-file-object", title: "Block vs File vs Object" },
          { slug: "rdb", title: "RDB" },
          { slug: "nosql", title: "NoSQL" },
          { slug: "vector-db", title: "벡터 DB" },
          { slug: "timeseries-db", title: "시계열 DB" },
          { slug: "search", title: "검색" },
          { slug: "log-store", title: "로그 스토어" },
          { slug: "latency-throughput-iops", title: "Latency / Throughput / IOPS" },
          { slug: "acid-transaction-lock", title: "ACID · 트랜잭션 · 락" },
          { slug: "index-why-fast", title: "Index가 왜 빠른가" },
          { slug: "caching", title: "Cache (hit/miss, TTL, write strategies)" },
          { slug: "data-warehouse", title: "DW / DM (데이터 웨어하우스 · 데이터 마트)" },
        ],
      },
      {
        id: "security-basics",
        title: "3. Security Basics",
        summary: "누가 무엇에 접근하는지, 데이터를 어떻게 보호하는지",
        why: "인증과 인가, 해시와 암호화를 섞어 쓰면 권한 설계가 흔들립니다. 신원 확인, 데이터 보호, 접근 경계를 따로 떼어 생각해야 IAM·KMS·Security Group을 제대로 쓸 수 있습니다.",
        flow: "인증·인가 → 데이터 보호 → 접근 경계",
        docs: [
          { slug: "authn-vs-authz", title: "Authn vs Authz" },
          { slug: "hash-vs-encryption", title: "Encryption vs Hash, Symmetric vs Asymmetric" },
          { slug: "least-privilege", title: "Least Privilege" },
          { slug: "firewall", title: "Network security (인바운드/아웃바운드)" },
        ],
      },
      {
        id: "distributed",
        title: "4. Distributed Systems Essentials",
        summary: "서버를 늘리고 메시지로 나눌 때 생기는 일관성·중복 문제",
        why: "서버를 여러 대로 늘리고 작업을 메시지로 나누는 순간, 같은 요청이 두 번 처리되거나 노드마다 데이터가 달라질 수 있습니다. 확장 방식부터 메시징, 멱등성, 일관성 모델 순으로 보면 장애 원인을 좁히기 쉽습니다.",
        flow: "확장 → 앱 상태 → 메시징·이벤트 → 멱등성·일관성·분산 처리",
        docs: [
          { slug: "stateless-stateful", title: "Stateless vs Stateful" },
          { slug: "scale-up-scale-out", title: "Scale up / Scale out" },
          { slug: "queue-vs-pubsub", title: "Queue vs Pub/Sub" },
          { slug: "event-driven-arch", title: "Event-driven Architecture" },
          { slug: "idempotency", title: "Idempotency" },
          { slug: "consistency-model", title: "Consistency models (Strong / Eventual)" },
          { slug: "cap-theorem", title: "CAP Theorem" },
          { slug: "distributed-transaction-lock", title: "분산 트랜잭션 · 분산 락" },
        ],
      },
      {
        id: "reliability-operations",
        title: "5. Reliability & Operations",
        summary: "장애를 보고, 완화하고, 복구하고, 목표를 정하는 SRE 흐름",
        why: "운영은 장애를 보는 것(관측)에서 시작해, 재시도·쓰로틀링으로 번지지 않게 막고(완화), 백업·복제로 되살리고(복구), HA·DR·SLO로 목표를 정하는 순서로 이어집니다. RPO·RTO는 백업과 DR 전략을 고르는 기준입니다.",
        flow: "관측 → 완화 → 복구(백업·복제·RPO/RTO) → 운영 목표(HA·DR·SLO)",
        docs: [
          { slug: "observability", title: "Observability (logs / metrics / traces)" },
          { slug: "retry-backoff", title: "Failure modes: timeout / retry / backoff / jitter" },
          { slug: "throttling-rate-limiting", title: "Throttling / Rate limiting / Backpressure" },
          { slug: "backup", title: "백업 (유형 · 보존 · RPO 연계)" },
          { slug: "replication", title: "복제 (동기/비동기 · RPO·RTO)" },
          { slug: "rto-rpo", title: "DR: RTO / RPO" },
          { slug: "ha-design", title: "HA · active-active 개념" },
          { slug: "dr-strategy", title: "DR 전략 (Backup · Pilot Light · Warm Standby · Active-Active)" },
          { slug: "sli-slo", title: "SLI / SLO" },
          { slug: "load-testing", title: "부하 테스트 (Load · Stress · Spike · Soak)" },
          { slug: "aiops", title: "AIOps (AI 기반 운영 자동화)" },
        ],
      },
      {
        id: "containers-orchestration",
        title: "6. Containers & Orchestration",
        summary: "이미지를 만들고, 노드에서 실행하고, 오케스트레이터로 관리하기",
        why: "Kubernetes·ECS 설정은 이미지, 런타임, 오케스트레이션의 세 층을 알고 나면 읽힙니다. 이미지가 어디에 저장되고, 노드에서 무엇이 실행하며, 누가 배치와 서비스 노출을 맡는지 구분합니다.",
        flow: "이미지·레지스트리 → 런타임 → 오케스트레이션·서비스 엔드포인트",
        docs: [
          { slug: "container-image", title: "Container Image (레이어 · 태그 · 불변성)" },
          { slug: "container-registry", title: "Container Registry (이미지 저장·배포)" },
          { slug: "container-runtime", title: "Container Runtime (노드 · CRI · OCI)" },
          { slug: "container-orchestration", title: "Container Orchestration (스케줄링 · Service · 단일/멀티 클러스터)" },
          {
            slug: "container-service-endpoint",
            title: "Service Endpoint (LB · Service)",
          },
        ],
      },
      {
        id: "cicd",
        title: "7. CI/CD",
        summary: "소스에서 배포까지, 검증과 보안을 파이프라인에 넣기",
        why: "빌드·테스트·보안 검증·배포를 사람 손이 아닌 파이프라인에 맡겨야 같은 결과를 반복할 수 있습니다. 배포 자동화 다음 단계인 GitOps는 Git을 배포의 기준으로 두고 클러스터가 스스로 맞춰 가는 방식입니다.",
        flow: "소스 → 빌드 → 테스트 → 보안 스캔 → 아티팩트 → 배포 → GitOps",
        docs: [
          { slug: "source-control", title: "소스 관리 (버전 관리 · 브랜치 · 트리거)" },
          { slug: "build", title: "빌드 (컴파일 · 패키징 · 재현성)" },
          { slug: "test", title: "테스트 (단위·통합·E2E · 피라미드)" },
          { slug: "devsecops", title: "DevSecOps (보안 스캔 · SAST·의존성·이미지)" },
          { slug: "artifact", title: "아티팩트 (산출물 · 버전 · 저장)" },
          { slug: "deploy", title: "배포 자동화 (전략 · 롤백 · 환경)" },
          { slug: "gitops", title: "GitOps (선언적 배포 · Git 동기화)" },
          { slug: "mlops", title: "MLOps (ML 모델 배포 · 재학습 자동화)" },
        ],
      },
      {
        id: "cost-finops",
        title: "8. Cost & FinOps",
        summary: "비용이 생기는 곳, 구매 옵션, 관측과 예산, 최적화",
        why: "클라우드 비용은 컴퓨트·스토리지·트래픽에서 생기고, 같은 자원이라도 구매 방식에 따라 값이 크게 달라집니다. 어디서 얼마나 쓰는지 먼저 보이게 만든 뒤 예산과 최적화를 정합니다.",
        flow: "비용 발생 → 구매 옵션 → 비용 관측·예산 → 최적화",
        docs: [
          { slug: "cost-compute", title: "컴퓨트 비용" },
          { slug: "cost-storage", title: "스토리지 비용" },
          { slug: "cost-traffic", title: "트래픽 비용" },
          { slug: "cost-on-demand", title: "온디맨드" },
          { slug: "cost-reserved", title: "예약" },
          { slug: "cost-spot", title: "스팟" },
          { slug: "cost-visibility", title: "비용 관측 (Cost visibility)" },
          { slug: "cost-budgets", title: "예산 (Budgets)" },
          { slug: "cost-optimization", title: "비용 최적화" },
        ],
      },
      {
        id: "ai-basics",
        title: "9. AI 기초",
        summary: "LLM의 동작 원리, 외부 지식을 붙이는 RAG, 스스로 행동하는 Agent의 개요",
        why: "LLM이 토큰 단위로 다음 말을 예측한다는 점을 알면, 왜 RAG로 외부 지식을 넣어야 하고 왜 Agent에 도구와 루프가 필요한지가 이어집니다.",
        flow: "LLM 기초 → RAG(외부 지식 연동) → AI Agent(자율 수행)",
        docs: [
          { slug: "llm-basics", title: "LLM 기초 (Transformer · 토큰 · 프롬프트 · 구조화 출력 · MCP)" },
          { slug: "rag", title: "RAG (검색 증강 · 고급 파이프라인 · 평가 · 보안)" },
          { slug: "ai-agent", title: "AI Agent (ReAct · 도구 · MCP · 프로덕션 개요)" },
        ],
      },
      {
        id: "agent-engineering",
        title: "10. Agent Engineering",
        summary: "모델을 감싸는 런타임부터 컨텍스트·상태·루프·도구, 그리고 운영에 필요한 통제까지",
        why: "Agent의 품질은 모델 자체보다 모델을 감싼 실행 환경과 모델에 넣는 컨텍스트에서 더 많이 갈립니다. 모델에서 실제 행동까지 스택을 위에서 아래로 따라간 뒤, 권한·평가·관측·신뢰성처럼 스택 전체에 걸치는 관심사를 봅니다.",
        flow: "Harness → Context → State & Memory → Loop → Tools → Orchestration · Model Strategy → HITL · Guardrails · Eval · Tracing · Reliability",
        docs: [
          { slug: "agent-harness", title: "Agent Harness / Runtime" },
          { slug: "context-engineering", title: "Context Engineering" },
          { slug: "agent-state-memory", title: "State & Memory Architecture" },
          { slug: "agent-loop", title: "Agent Loop (Observe → Plan → Act → Stop)" },
          { slug: "agent-tool-use", title: "Tool Use (Function Calling · MCP)" },
          { slug: "agent-orchestration", title: "Orchestration (Router · Supervisor · Sub-agent · Graph)" },
          { slug: "model-routing", title: "Model Strategy / Routing" },
          { slug: "agent-hitl", title: "Human-in-the-Loop" },
          { slug: "agent-guardrails-authz", title: "Guardrails / Identity / Authorization" },
          { slug: "agent-eval", title: "Agent Evaluation" },
          { slug: "agent-observability", title: "Observability & Tracing" },
          { slug: "agent-reliability", title: "Reliability / Production Engineering" },
        ],
      },
    ],
  },
  {
    id: "aws-common",
    title: "2. AWS 공통",
    description: "AWS 주요 서비스 개념 이해",
    sections: [
      {
        id: "networking",
        title: "1. Networking (VPC · 서브넷 · 보안)",
        docs: [
          { slug: "public-private-subnet", title: "Public / Private subnet 정의" },
          { slug: "vpc-route-table", title: "VPC Route Table" },
          { slug: "igw-vs-nat", title: "IGW vs NAT Gateway" },
          { slug: "elastic-ip", title: "Elastic IP" },
          { slug: "security-group", title: "Security Group (stateful)" },
          { slug: "nacl", title: "NACL (stateless)" },
          { slug: "vpc-endpoint", title: "VPC Endpoint" },
        ],
      },
      {
        id: "identity-access",
        title: "2. Identity & Access (IAM)",
        docs: [
          { slug: "iam-user-vs-role", title: "IAM User vs Role" },
          { slug: "policy-evaluation", title: "Policy Evaluation Logic" },
          { slug: "identity-vs-resource-policy", title: "Identity-based vs Resource-based" },
          { slug: "explicit-deny", title: "Explicit Deny 우선" },
          { slug: "sts-assumerole", title: "STS / AssumeRole" },
          { slug: "cross-account", title: "Cross-account 접근 패턴" },
          { slug: "mfa", title: "MFA" },
        ],
      },
      {
        id: "storage",
        title: "3. Storage & Data (S3 · EBS · EFS · RDS · DynamoDB · ElastiCache)",
        docs: [
          { slug: "s3-overview", title: "S3 개요" },
          { slug: "ebs-basics", title: "EBS 기본 (볼륨 · 스냅샷)" },
          { slug: "efs-basics", title: "EFS 기본 (공유 파일 스토리지)" },
          { slug: "rds-basics", title: "RDS 기본 (관리형 RDB)" },
          { slug: "dynamodb-basics", title: "DynamoDB 기본 (NoSQL)" },
          { slug: "elasticache-basics", title: "ElastiCache (Redis vs Memcached)" },
        ],
      },
      {
        id: "compute-scaling",
        title: "4. Compute & Scaling (EC2 · Lambda · ECS · EKS · ELB · ASG)",
        docs: [
          { slug: "ec2-overview", title: "EC2 개요 (인스턴스 · AMI · 상태)" },
          { slug: "lambda-basics", title: "Lambda 기본" },
          { slug: "ecs-basics", title: "ECS 기본 (컨테이너)" },
          { slug: "eks-basics", title: "EKS 기본 (Kubernetes)" },
          { slug: "elb-types", title: "ELB 종류 (ALB vs NLB)" },
          { slug: "target-group", title: "Target Group 개념" },
          { slug: "health-check", title: "Health Check" },
          { slug: "sticky-session", title: "Sticky Session" },
          { slug: "asg-basics", title: "ASG 기본 (Min/Max/Desired)" },
          { slug: "scaling-policy", title: "Scaling Policy (Target tracking)" },
        ],
      },
      {
        id: "monitoring-logging",
        title: "5. Monitoring & Logging (CloudWatch · 감사)",
        docs: [
          { slug: "cloudwatch-metrics-logs", title: "CloudWatch Metrics / Logs" },
          { slug: "cloudwatch-dashboard", title: "CloudWatch 대시보드" },
          { slug: "alarm", title: "Alarm" },
          { slug: "cloudtrail-vs-config", title: "CloudTrail vs Config 차이" },
        ],
      },
      {
        id: "security-secrets",
        title: "6. Security & Secrets (KMS · Secrets Manager · Parameter Store)",
        docs: [
          { slug: "kms-basics", title: "KMS 기본 (키 관리 · Envelope Encryption)" },
          { slug: "secrets-manager-basics", title: "Secrets Manager 기본 (시크릿 저장 · 회전)" },
          { slug: "ssm-parameter-store", title: "SSM Parameter Store (구성값 · 시크릿)" },
        ],
      },
      {
        id: "ai-bedrock",
        title: "7. AI & Bedrock",
        docs: [
          { slug: "bedrock-overview", title: "Bedrock 개요 (관리형 FM · Converse · 모델 선택)" },
          { slug: "bedrock-agent", title: "Bedrock Agent (Action Group · KB · Guardrails · 운영)" },
        ],
      },
    ],
  },
  {
    id: "saa",
    title: "3. SAA (Architect)",
    description: "고가용성·보안·성능·비용 최적화 기반 아키텍처 설계",
    sections: [
      {
        id: "networking",
        title: "네트워킹 및 콘텐츠 전송",
        docs: [
          { slug: "vpc-peering", title: "VPC Peering" },
          { slug: "transit-gateway", title: "Transit Gateway" },
          { slug: "direct-connect-vpn", title: "Direct Connect / VPN" },
          { slug: "route53-routing", title: "Route 53 라우팅" },
          { slug: "cloudfront-integration", title: "CloudFront 연동" },
        ],
      },
      {
        id: "storage-design",
        title: "스토리지",
        docs: [
          { slug: "ebs-vs-efs-fsx", title: "EBS vs EFS vs FSx" },
          { slug: "s3-static-hosting", title: "S3 정적 호스팅" },
        ],
      },
      {
        id: "compute-choice",
        title: "컴퓨팅",
        docs: [
          { slug: "ec2-vs-lambda-ecs-eks", title: "EC2 vs Lambda vs ECS vs EKS" },
          { slug: "compute-tradeoff", title: "운영 부담 vs 확장성 vs 비용" },
          { slug: "elb-asg-ha", title: "ELB · ASG 고가용성" },
        ],
      },
      {
        id: "database-choice",
        title: "데이터베이스",
        docs: [
          { slug: "rds-vs-aurora", title: "RDS vs Aurora" },
          { slug: "multiaz-vs-read-replica", title: "Multi-AZ vs Read Replica" },
          { slug: "dynamodb-use-case", title: "DynamoDB 사용 케이스" },
          { slug: "elasticache-caching", title: "ElastiCache 캐싱" },
        ],
      },
      {
        id: "security",
        title: "보안 및 권한",
        docs: [
          { slug: "security-saa", title: "보안 · 권한 시나리오" },
          { slug: "waf-basics", title: "WAF" },
        ],
      },
      {
        id: "integration-monitoring",
        title: "통합 및 모니터링",
        docs: [
          { slug: "sqs-sns-pattern", title: "SQS · SNS 패턴" },
        ],
      },
      {
        id: "architectural-patterns",
        title: "아키텍처 패턴",
        docs: [
          { slug: "backup", title: "Backup" },
          { slug: "pilot-light", title: "Pilot Light" },
          { slug: "warm-standby", title: "Warm Standby" },
          { slug: "active-active", title: "Active-Active" },
          { slug: "cost-optimization", title: "비용 최적화" },
          { slug: "serverless-pattern", title: "서버리스 패턴" },
        ],
      },
    ],
  },
  {
    id: "dva",
    title: "4. DVA (Developer)",
    description: "실제 코드/서비스 동작 이해",
    sections: [
      {
        id: "lambda-deep",
        title: "Lambda 심화",
        docs: [
          { slug: "lambda-concurrency", title: "Concurrency" },
          { slug: "cold-start", title: "Cold Start" },
          { slug: "dlq-destinations", title: "DLQ / Destinations" },
        ],
      },
      {
        id: "api-gateway",
        title: "API Gateway",
        docs: [
          { slug: "rest-vs-http-api", title: "REST vs HTTP API" },
          { slug: "authorizer", title: "Authorizer" },
          { slug: "throttling", title: "Throttling" },
        ],
      },
      {
        id: "dynamodb-deep",
        title: "DynamoDB 심화",
        docs: [
          { slug: "partition-key-design", title: "Partition Key 설계" },
          { slug: "gsi-lsi", title: "GSI / LSI" },
          { slug: "conditional-update", title: "Conditional Update" },
          { slug: "streams", title: "Streams" },
        ],
      },
      {
        id: "event-driven",
        title: "Event-Driven",
        docs: [
          { slug: "sqs-visibility-timeout", title: "SQS Visibility Timeout" },
          { slug: "sns-fanout", title: "SNS Fan-out" },
          { slug: "eventbridge", title: "EventBridge" },
        ],
      },
      {
        id: "cicd",
        title: "CI/CD",
        docs: [
          { slug: "codepipeline", title: "CodePipeline" },
          { slug: "codebuild", title: "CodeBuild" },
          { slug: "sam", title: "SAM 개념" },
        ],
      },
    ],
  },
  {
    id: "soa",
    title: "5. SOA (Operations)",
    description: "운영/모니터링/자동화 중심",
    sections: [
      {
        id: "cloudwatch-advanced",
        title: "CloudWatch 고급",
        docs: [
          { slug: "metric-filter", title: "Metric Filter" },
          { slug: "composite-alarm", title: "Composite Alarm" },
          { slug: "logs-insights", title: "Logs Insights" },
        ],
      },
      {
        id: "systems-manager",
        title: "Systems Manager",
        docs: [
          { slug: "session-manager", title: "Session Manager" },
          { slug: "patch-manager", title: "Patch Manager" },
          { slug: "run-command", title: "Run Command" },
        ],
      },
      {
        id: "ec2-operations",
        title: "EC2 운영",
        docs: [
          { slug: "launch-template", title: "Launch Template" },
          { slug: "ami-management", title: "AMI 관리" },
          { slug: "ebs-snapshot", title: "EBS 스냅샷" },
        ],
      },
      {
        id: "troubleshooting",
        title: "트러블슈팅",
        docs: [
          { slug: "flow-logs", title: "Flow Logs" },
          { slug: "dns-issues", title: "DNS 이슈" },
          { slug: "sg-nacl-analysis", title: "SG/NACL 분석" },
        ],
      },
      {
        id: "governance",
        title: "거버넌스",
        docs: [
          { slug: "aws-config", title: "AWS Config" },
          { slug: "guardduty", title: "GuardDuty" },
          { slug: "cost-explorer-budgets", title: "Cost Explorer / Budgets" },
        ],
      },
    ],
  },
];

export const HANDBOOK_LAYER_IDS = HANDBOOK_LAYERS.map((l) => l.id);

export function getHandbookLayer(layerId: string): HandbookLayer | undefined {
  return HANDBOOK_LAYERS.find((l) => l.id === layerId);
}

export function getHandbookDoc(
  layerId: string,
  slug: string
): { layer: HandbookLayer; doc: HandbookDoc; section: HandbookSection } | null {
  const layer = getHandbookLayer(layerId);
  if (!layer) return null;
  for (const section of layer.sections) {
    const doc = section.docs.find((d) => d.slug === slug);
    if (doc) return { layer, doc, section };
  }
  return null;
}

export function getHandbookSection(
  layerId: string,
  sectionId: string
): { layer: HandbookLayer; section: HandbookSection; index: number } | null {
  const layer = getHandbookLayer(layerId);
  if (!layer) return null;
  const index = layer.sections.findIndex((s) => s.id === sectionId);
  if (index < 0) return null;
  return { layer, section: layer.sections[index], index };
}

export function getSectionOfDoc(layerId: string, slug: string): HandbookSection | null {
  return getHandbookDoc(layerId, slug)?.section ?? null;
}

export function getAdjacentSections(
  layerId: string,
  sectionId: string
): { prev: HandbookSection | null; next: HandbookSection | null } {
  const found = getHandbookSection(layerId, sectionId);
  if (!found) return { prev: null, next: null };
  const { sections } = found.layer;
  return {
    prev: sections[found.index - 1] ?? null,
    next: sections[found.index + 1] ?? null,
  };
}

/** 같은 섹션 안에서 학습 순서상 앞뒤 문서 */
export function getAdjacentDocs(
  layerId: string,
  slug: string
): { prev: HandbookDoc | null; next: HandbookDoc | null } {
  const section = getSectionOfDoc(layerId, slug);
  if (!section) return { prev: null, next: null };
  const i = section.docs.findIndex((d) => d.slug === slug);
  return {
    prev: section.docs[i - 1] ?? null,
    next: section.docs[i + 1] ?? null,
  };
}

export function handbookSectionPath(layerId: string, sectionId: string): string {
  return `/handbook/${layerId}/section/${sectionId}`;
}
