/**
 * QUIZNOX Handbook — 5 Layer Architecture
 * Core CS → AWS 공통 → SAA → DVA → SOA
 */

export interface HandbookDoc {
  slug: string;
  title: string;
}

export interface HandbookSection {
  id: string;
  title: string;
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
    title: "1. Core CS",
    description: "순수 CS 기반 개념 · AWS를 이해하기 위한 사고 체계",
    sections: [
      {
        id: "network",
        title: "네트워크",
        docs: [
          { slug: "ip-cidr-subnetting", title: "IP / CIDR / Subnetting" },
          { slug: "routing-table", title: "Routing Table 구조" },
          { slug: "nat", title: "NAT 개념 (Outbound 전용)" },
          { slug: "dns-resolver-vs-authoritative", title: "DNS Resolver vs Authoritative" },
          { slug: "tcp-vs-udp", title: "TCP vs UDP" },
          { slug: "http-https-tls", title: "HTTP / HTTPS / TLS handshake" },
          { slug: "l4-vs-l7-lb", title: "L4 vs L7 Load Balancer" },
        ],
      },
      {
        id: "distributed",
        title: "분산 시스템",
        docs: [
          { slug: "stateless-stateful", title: "Stateless vs Stateful" },
          { slug: "scale-up-scale-out", title: "Scale-up vs Scale-out" },
          { slug: "cap-theorem", title: "CAP Theorem" },
          { slug: "consistency-model", title: "Consistency Model (Strong / Eventual)" },
          { slug: "idempotency", title: "Idempotency" },
          { slug: "retry-backoff", title: "Retry / Backoff 전략" },
          { slug: "queue-vs-pubsub", title: "Queue vs Pub/Sub" },
          { slug: "event-driven-arch", title: "Event-driven Architecture" },
        ],
      },
      {
        id: "security-basics",
        title: "보안 기본",
        docs: [
          { slug: "authn-vs-authz", title: "Authentication vs Authorization" },
          { slug: "hash-vs-encryption", title: "Hash vs Encryption" },
          { slug: "least-privilege", title: "Principle of Least Privilege" },
          { slug: "firewall", title: "Firewall 개념" },
        ],
      },
      {
        id: "operations-reliability",
        title: "운영 & 신뢰성",
        docs: [
          { slug: "rto-rpo", title: "RTO / RPO" },
          { slug: "ha-design", title: "HA 설계 원칙" },
          { slug: "observability", title: "Observability (Logs / Metrics / Traces)" },
          { slug: "sli-slo", title: "SLI / SLO 개념" },
          { slug: "caching", title: "캐시 원리" },
        ],
      },
    ],
  },
  {
    id: "aws-common",
    title: "2. AWS 공통",
    description: "시험 공통 기반 서비스 사고 · 의사결정 프레임 중심",
    sections: [
      {
        id: "iam-deep",
        title: "IAM 심화",
        docs: [
          { slug: "policy-evaluation", title: "Policy Evaluation Logic" },
          { slug: "identity-vs-resource-policy", title: "Identity-based vs Resource-based" },
          { slug: "explicit-deny", title: "Explicit Deny 우선" },
          { slug: "sts-assumerole", title: "STS / AssumeRole" },
          { slug: "cross-account", title: "Cross-account 접근 패턴" },
        ],
      },
      {
        id: "vpc-basics",
        title: "VPC 기본 구조",
        docs: [
          { slug: "public-private-subnet", title: "Public / Private subnet 정의" },
          { slug: "igw-vs-nat", title: "IGW vs NAT Gateway" },
          { slug: "security-group", title: "Security Group (stateful)" },
          { slug: "nacl", title: "NACL (stateless)" },
          { slug: "vpc-endpoint", title: "VPC Endpoint" },
        ],
      },
      {
        id: "s3-core",
        title: "S3 핵심",
        docs: [
          { slug: "s3-consistency", title: "Consistency 모델" },
          { slug: "s3-versioning", title: "Versioning" },
          { slug: "s3-lifecycle", title: "Lifecycle" },
          { slug: "sse-s3-kms", title: "SSE-S3 vs SSE-KMS" },
          { slug: "crr-srr", title: "CRR / SRR" },
        ],
      },
      {
        id: "asg-elb",
        title: "Auto Scaling & ELB",
        docs: [
          { slug: "target-group", title: "Target Group 개념" },
          { slug: "health-check", title: "Health Check" },
          { slug: "sticky-session", title: "Sticky Session" },
          { slug: "scaling-policy", title: "Scaling Policy (Target tracking)" },
        ],
      },
      {
        id: "monitoring-logging",
        title: "Monitoring & Logging",
        docs: [
          { slug: "cloudwatch-metrics-logs", title: "CloudWatch Metrics / Logs" },
          { slug: "alarm", title: "Alarm" },
          { slug: "cloudtrail-vs-config", title: "CloudTrail vs Config 차이" },
        ],
      },
    ],
  },
  {
    id: "saa",
    title: "3. SAA (Architect)",
    description: "요구사항 기반 아키텍처 설계 능력",
    sections: [
      {
        id: "compute-choice",
        title: "Compute 선택 프레임",
        docs: [
          { slug: "ec2-vs-lambda-ecs-eks", title: "EC2 vs Lambda vs ECS vs EKS" },
          { slug: "compute-tradeoff", title: "운영 부담 vs 확장성 vs 비용" },
        ],
      },
      {
        id: "database-choice",
        title: "Database 선택",
        docs: [
          { slug: "rds-vs-aurora", title: "RDS vs Aurora" },
          { slug: "multiaz-vs-read-replica", title: "Multi-AZ vs Read Replica" },
          { slug: "dynamodb-use-case", title: "DynamoDB 사용 케이스" },
        ],
      },
      {
        id: "storage-design",
        title: "Storage 설계",
        docs: [
          { slug: "ebs-vs-efs-fsx", title: "EBS vs EFS vs FSx" },
          { slug: "s3-static-hosting", title: "S3 정적 호스팅" },
          { slug: "cloudfront-integration", title: "CloudFront 연동" },
        ],
      },
      {
        id: "connectivity",
        title: "Connectivity",
        docs: [
          { slug: "vpc-peering", title: "VPC Peering" },
          { slug: "transit-gateway", title: "Transit Gateway" },
          { slug: "direct-connect-vpn", title: "Direct Connect / VPN" },
        ],
      },
      {
        id: "dr-patterns",
        title: "DR 패턴",
        docs: [
          { slug: "backup", title: "Backup" },
          { slug: "pilot-light", title: "Pilot Light" },
          { slug: "warm-standby", title: "Warm Standby" },
          { slug: "active-active", title: "Active-Active" },
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
