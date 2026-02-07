/**
 * 레이어별 진입 다이어그램 URL 및 노드→문서 경로 맵.
 * Core CS는 real-system-diagrams, 그 외는 overview.md 사용.
 */
import { REAL_SYSTEM_DIAGRAM_LINKS } from "./handbookDiagramLinks";

const BASE = "/handbook";

export function getDiagramConfig(layerId: string): {
  diagramUrl: string;
  diagramLinks: Record<string, string>;
} | null {
  if (layerId === "core-cs") {
    return {
      diagramUrl: `${BASE}/core-cs/real-system-diagrams.md`,
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
  "Public / Private subnet": `${aws}/public-private-subnet`,
  "IGW vs NAT": `${aws}/igw-vs-nat`,
  "Security Group": `${aws}/security-group`,
  NACL: `${aws}/nacl`,
  "VPC Endpoint": `${aws}/vpc-endpoint`,
  "S3 Consistency": `${aws}/s3-consistency`,
  "S3 Versioning": `${aws}/s3-versioning`,
  "S3 Lifecycle": `${aws}/s3-lifecycle`,
  "SSE-S3 vs SSE-KMS": `${aws}/sse-s3-kms`,
  "CRR / SRR": `${aws}/crr-srr`,
  "Target Group": `${aws}/target-group`,
  "Health Check": `${aws}/health-check`,
  "Sticky Session": `${aws}/sticky-session`,
  "Scaling Policy": `${aws}/scaling-policy`,
  "CloudWatch Metrics / Logs": `${aws}/cloudwatch-metrics-logs`,
  Alarm: `${aws}/alarm`,
  "CloudTrail vs Config": `${aws}/cloudtrail-vs-config`,
};

const saaPath = `${BASE}/saa`;
export const SAA_DIAGRAM_LINKS: Record<string, string> = {
  "EC2 vs Lambda vs ECS vs EKS": `${saaPath}/ec2-vs-lambda-ecs-eks`,
  "Compute Tradeoff": `${saaPath}/compute-tradeoff`,
  "RDS vs Aurora": `${saaPath}/rds-vs-aurora`,
  "Multi-AZ vs Read Replica": `${saaPath}/multiaz-vs-read-replica`,
  "DynamoDB 사용 케이스": `${saaPath}/dynamodb-use-case`,
  "EBS vs EFS vs FSx": `${saaPath}/ebs-vs-efs-fsx`,
  "S3 정적 호스팅": `${saaPath}/s3-static-hosting`,
  "CloudFront 연동": `${saaPath}/cloudfront-integration`,
  "VPC Peering": `${saaPath}/vpc-peering`,
  "Transit Gateway": `${saaPath}/transit-gateway`,
  "Direct Connect / VPN": `${saaPath}/direct-connect-vpn`,
  Backup: `${saaPath}/backup`,
  "Pilot Light": `${saaPath}/pilot-light`,
  "Warm Standby": `${saaPath}/warm-standby`,
  "Active-Active": `${saaPath}/active-active`,
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
