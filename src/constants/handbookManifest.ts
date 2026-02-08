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
    description: "순수 CS 기반 개념",
    sections: [
      {
        id: "networking",
        title: "1. Networking Fundamentals",
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
        docs: [
          { slug: "block-file-object", title: "Block vs File vs Object" },
          { slug: "latency-throughput-iops", title: "Latency / Throughput / IOPS" },
          { slug: "acid-transaction-lock", title: "ACID · 트랜잭션 · 락" },
          { slug: "index-why-fast", title: "Index가 왜 빠른가" },
          { slug: "caching", title: "Cache (hit/miss, TTL, write strategies)" },
        ],
      },
      {
        id: "distributed",
        title: "3. Distributed Systems Essentials",
        docs: [
          { slug: "stateless-stateful", title: "Stateless vs Stateful" },
          { slug: "scale-up-scale-out", title: "Scale up / Scale out" },
          { slug: "consistency-model", title: "Consistency models (Strong / Eventual)" },
          { slug: "distributed-transaction-lock", title: "분산 트랜잭션 · 분산 락" },
          { slug: "queue-vs-pubsub", title: "Queue vs Pub/Sub" },
          { slug: "idempotency", title: "Idempotency" },
          { slug: "cap-theorem", title: "CAP Theorem" },
          { slug: "event-driven-arch", title: "Event-driven Architecture" },
        ],
      },
      {
        id: "security-basics",
        title: "4. Security Basics",
        docs: [
          { slug: "authn-vs-authz", title: "Authn vs Authz" },
          { slug: "hash-vs-encryption", title: "Encryption vs Hash, Symmetric vs Asymmetric" },
          { slug: "least-privilege", title: "Least Privilege" },
          { slug: "firewall", title: "Network security (인바운드/아웃바운드)" },
        ],
      },
      {
        id: "reliability-operations",
        title: "5. Reliability & Operations",
        docs: [
          { slug: "observability", title: "Observability (logs / metrics / traces)" },
          { slug: "retry-backoff", title: "Failure modes: timeout / retry / backoff / jitter" },
          { slug: "throttling-rate-limiting", title: "Throttling / Rate limiting / Backpressure" },
          { slug: "rto-rpo", title: "DR: RTO / RPO" },
          { slug: "ha-design", title: "HA · active-active 개념" },
          { slug: "sli-slo", title: "SLI / SLO" },
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
