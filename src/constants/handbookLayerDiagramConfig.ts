/**
 * 레이어별 진입 다이어그램 URL 및 노드→문서 경로 맵.
 * Systems Fundamentals(core-cs)는 MDX(RealSystemDiagrams.mdx) 사용, diagramUrl 미사용.
 * 그 외 레이어는 overview.md → MDX 컴포넌트로 렌더하며 diagramUrl은 레거시 참조용.
 */
import { REAL_SYSTEM_DIAGRAM_LINKS } from "./handbookDiagramLinks";

const BASE = "/handbook";

export function getDiagramConfig(layerId: string): {
  diagramUrl: string;
  diagramLinks: Record<string, string>;
} | null {
  if (layerId === "core-cs") {
    return {
      diagramUrl: "",
      diagramLinks: REAL_SYSTEM_DIAGRAM_LINKS,
    };
  }
  const links = LAYER_DIAGRAM_LINKS[layerId as keyof typeof LAYER_DIAGRAM_LINKS];
  if (!links) return null;
  return {
    diagramUrl: `${BASE}/${layerId}/overview.md`,
    diagramLinks: links,
  };
}

const aws = `${BASE}/aws-common`;
export const AWS_COMMON_DIAGRAM_LINKS: Record<string, string> = {
  "Policy Evaluation": `${aws}/policy-evaluation`,
  "Identity-based vs Resource-based": `${aws}/identity-vs-resource-policy`,
  "Explicit Deny": `${aws}/explicit-deny`,
  "STS / AssumeRole": `${aws}/sts-assumerole`,
  "Cross-account": `${aws}/cross-account`,
  "User vs Role": `${aws}/iam-user-vs-role`,
  MFA: `${aws}/mfa`,
  "Public / Private subnet": `${aws}/public-private-subnet`,
  "Route Table": `${aws}/vpc-route-table`,
  "IGW vs NAT": `${aws}/igw-vs-nat`,
  "Elastic IP": `${aws}/elastic-ip`,
  "Security Group": `${aws}/security-group`,
  NACL: `${aws}/nacl`,
  "VPC Endpoint": `${aws}/vpc-endpoint`,
  S3: `${aws}/s3-overview`,
  "EBS 기본": `${aws}/ebs-basics`,
  "EFS 기본": `${aws}/efs-basics`,
  "RDS 기본": `${aws}/rds-basics`,
  DynamoDB: `${aws}/dynamodb-basics`,
  ElastiCache: `${aws}/elasticache-basics`,
  "EC2 개요": `${aws}/ec2-overview`,
  Lambda: `${aws}/lambda-basics`,
  "ECS 기본": `${aws}/ecs-basics`,
  "EKS 기본": `${aws}/eks-basics`,
  "ALB vs NLB": `${aws}/elb-types`,
  "Target Group": `${aws}/target-group`,
  "Health Check": `${aws}/health-check`,
  "Sticky Session": `${aws}/sticky-session`,
  "ASG 기본": `${aws}/asg-basics`,
  "Scaling Policy": `${aws}/scaling-policy`,
  "CloudWatch Metrics / Logs": `${aws}/cloudwatch-metrics-logs`,
  Dashboard: `${aws}/cloudwatch-dashboard`,
  Alarm: `${aws}/alarm`,
  "CloudTrail vs Config": `${aws}/cloudtrail-vs-config`,
};

const saaPath = `${BASE}/saa`;
export const SAA_DIAGRAM_LINKS: Record<string, string> = {
  "VPC Peering": `${saaPath}/vpc-peering`,
  "Transit Gateway": `${saaPath}/transit-gateway`,
  "Direct Connect / VPN": `${saaPath}/direct-connect-vpn`,
  "Route 53 라우팅": `${saaPath}/route53-routing`,
  "CloudFront 연동": `${saaPath}/cloudfront-integration`,
  "EBS vs EFS vs FSx": `${saaPath}/ebs-vs-efs-fsx`,
  "S3 정적 호스팅": `${saaPath}/s3-static-hosting`,
  "EC2 vs Lambda vs ECS vs EKS": `${saaPath}/ec2-vs-lambda-ecs-eks`,
  "Compute Tradeoff": `${saaPath}/compute-tradeoff`,
  "ELB · ASG 고가용성": `${saaPath}/elb-asg-ha`,
  "RDS vs Aurora": `${saaPath}/rds-vs-aurora`,
  "Multi-AZ vs Read Replica": `${saaPath}/multiaz-vs-read-replica`,
  "DynamoDB 사용 케이스": `${saaPath}/dynamodb-use-case`,
  "ElastiCache 캐싱": `${saaPath}/elasticache-caching`,
  "보안 · 권한 시나리오": `${saaPath}/security-saa`,
  WAF: `${saaPath}/waf-basics`,
  "SQS · SNS 패턴": `${saaPath}/sqs-sns-pattern`,
  Backup: `${saaPath}/backup`,
  "Pilot Light": `${saaPath}/pilot-light`,
  "Warm Standby": `${saaPath}/warm-standby`,
  "Active-Active": `${saaPath}/active-active`,
  "비용 최적화": `${saaPath}/cost-optimization`,
  "서버리스 패턴": `${saaPath}/serverless-pattern`,
};

const dvaPath = `${BASE}/dva`;
export const DVA_DIAGRAM_LINKS: Record<string, string> = {
  "Lambda Concurrency": `${dvaPath}/lambda-concurrency`,
  "Cold Start": `${dvaPath}/cold-start`,
  "DLQ / Destinations": `${dvaPath}/dlq-destinations`,
  "REST vs HTTP API": `${dvaPath}/rest-vs-http-api`,
  Authorizer: `${dvaPath}/authorizer`,
  Throttling: `${dvaPath}/throttling`,
  "Partition Key 설계": `${dvaPath}/partition-key-design`,
  "GSI / LSI": `${dvaPath}/gsi-lsi`,
  "Conditional Update": `${dvaPath}/conditional-update`,
  Streams: `${dvaPath}/streams`,
  "SQS Visibility Timeout": `${dvaPath}/sqs-visibility-timeout`,
  "SNS Fan-out": `${dvaPath}/sns-fanout`,
  EventBridge: `${dvaPath}/eventbridge`,
  CodePipeline: `${dvaPath}/codepipeline`,
  CodeBuild: `${dvaPath}/codebuild`,
  SAM: `${dvaPath}/sam`,
};

const soaPath = `${BASE}/soa`;
export const SOA_DIAGRAM_LINKS: Record<string, string> = {
  "Metric Filter": `${soaPath}/metric-filter`,
  "Composite Alarm": `${soaPath}/composite-alarm`,
  "Logs Insights": `${soaPath}/logs-insights`,
  "Session Manager": `${soaPath}/session-manager`,
  "Patch Manager": `${soaPath}/patch-manager`,
  "Run Command": `${soaPath}/run-command`,
  "Launch Template": `${soaPath}/launch-template`,
  "AMI 관리": `${soaPath}/ami-management`,
  "EBS 스냅샷": `${soaPath}/ebs-snapshot`,
  "Flow Logs": `${soaPath}/flow-logs`,
  "DNS 이슈": `${soaPath}/dns-issues`,
  "SG/NACL 분석": `${soaPath}/sg-nacl-analysis`,
  "AWS Config": `${soaPath}/aws-config`,
  GuardDuty: `${soaPath}/guardduty`,
  "Cost Explorer / Budgets": `${soaPath}/cost-explorer-budgets`,
};

const LAYER_DIAGRAM_LINKS: Record<string, Record<string, string>> = {
  "aws-common": AWS_COMMON_DIAGRAM_LINKS,
  saa: SAA_DIAGRAM_LINKS,
  dva: DVA_DIAGRAM_LINKS,
  soa: SOA_DIAGRAM_LINKS,
};
