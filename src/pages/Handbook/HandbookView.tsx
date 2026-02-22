import { memo, useEffect, useMemo, useState } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { MarkdownViewer } from "../../components/MarkdownViewer";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { getHandbookDoc } from "../../constants/handbookManifest";
import { getDiagramConfig } from "../../constants/handbookLayerDiagramConfig";
import { HandbookLayout } from "../../components/handbook/HandbookLayout";
import QueueVsPubsubMdx from "./mdx/core-cs/QueueVsPubsub.mdx";
import SoaOverviewMdx from "./mdx/soa/SoaOverview.mdx";
import DvaOverviewMdx from "./mdx/dva/DvaOverview.mdx";
import AwsCommonOverviewMdx from "./mdx/aws-common/AwsCommonOverview.mdx";
import PublicPrivateSubnetMdx from "./mdx/aws-common/PublicPrivateSubnet.mdx";
import VpcRouteTableMdx from "./mdx/aws-common/VpcRouteTable.mdx";
import IgwVsNatMdx from "./mdx/aws-common/IgwVsNat.mdx";
import ElasticIpMdx from "./mdx/aws-common/ElasticIp.mdx";
import SecurityGroupMdx from "./mdx/aws-common/SecurityGroup.mdx";
import NaclMdx from "./mdx/aws-common/Nacl.mdx";
import VpcEndpointMdx from "./mdx/aws-common/VpcEndpoint.mdx";
import IamUserVsRoleMdx from "./mdx/aws-common/IamUserVsRole.mdx";
import PolicyEvaluationMdx from "./mdx/aws-common/PolicyEvaluation.mdx";
import IdentityVsResourcePolicyMdx from "./mdx/aws-common/IdentityVsResourcePolicy.mdx";
import ExplicitDenyMdx from "./mdx/aws-common/ExplicitDeny.mdx";
import StsAssumeroleMdx from "./mdx/aws-common/StsAssumerole.mdx";
import CrossAccountMdx from "./mdx/aws-common/CrossAccount.mdx";
import MfaMdx from "./mdx/aws-common/Mfa.mdx";
import S3OverviewMdx from "./mdx/aws-common/S3Overview.mdx";
import EbsBasicsMdx from "./mdx/aws-common/EbsBasics.mdx";
import EfsBasicsMdx from "./mdx/aws-common/EfsBasics.mdx";
import RdsBasicsMdx from "./mdx/aws-common/RdsBasics.mdx";
import DynamodbBasicsMdx from "./mdx/aws-common/DynamodbBasics.mdx";
import ElastiCacheBasicsMdx from "./mdx/aws-common/ElastiCacheBasics.mdx";
import Ec2OverviewMdx from "./mdx/aws-common/Ec2Overview.mdx";
import LambdaBasicsMdx from "./mdx/aws-common/LambdaBasics.mdx";
import EcsBasicsMdx from "./mdx/aws-common/EcsBasics.mdx";
import EksBasicsMdx from "./mdx/aws-common/EksBasics.mdx";
import ElbTypesMdx from "./mdx/aws-common/ElbTypes.mdx";
import TargetGroupMdx from "./mdx/aws-common/TargetGroup.mdx";
import HealthCheckMdx from "./mdx/aws-common/HealthCheck.mdx";
import StickySessionMdx from "./mdx/aws-common/StickySession.mdx";
import AsgBasicsMdx from "./mdx/aws-common/AsgBasics.mdx";
import ScalingPolicyMdx from "./mdx/aws-common/ScalingPolicy.mdx";
import CloudwatchMetricsLogsMdx from "./mdx/aws-common/CloudwatchMetricsLogs.mdx";
import CloudwatchDashboardMdx from "./mdx/aws-common/CloudwatchDashboard.mdx";
import AlarmMdx from "./mdx/aws-common/Alarm.mdx";
import CloudtrailVsConfigMdx from "./mdx/aws-common/CloudtrailVsConfig.mdx";
import AcidTransactionLockMdx from "./mdx/core-cs/AcidTransactionLock.mdx";
import AuthnVsAuthzMdx from "./mdx/core-cs/AuthnVsAuthz.mdx";
import IpCidrSubnettingMdx from "./mdx/core-cs/IpCidrSubnetting.mdx";
import RoutingTableMdx from "./mdx/core-cs/RoutingTable.mdx";
import NatMdx from "./mdx/core-cs/Nat.mdx";
import DnsResolverVsAuthoritativeMdx from "./mdx/core-cs/DnsResolverVsAuthoritative.mdx";
import TcpVsUdpMdx from "./mdx/core-cs/TcpVsUdp.mdx";
import HttpHttpsTlsMdx from "./mdx/core-cs/HttpHttpsTls.mdx";
import L4VsL7LbMdx from "./mdx/core-cs/L4VsL7Lb.mdx";
import BlockFileObjectMdx from "./mdx/core-cs/BlockFileObject.mdx";
import RdbMdx from "./mdx/core-cs/Rdb.mdx";
import NoSqlMdx from "./mdx/core-cs/NoSql.mdx";
import VectorDbMdx from "./mdx/core-cs/VectorDb.mdx";
import TimeseriesDbMdx from "./mdx/core-cs/TimeseriesDb.mdx";
import SearchMdx from "./mdx/core-cs/Search.mdx";
import LogStoreMdx from "./mdx/core-cs/LogStore.mdx";
import LatencyThroughputIopsMdx from "./mdx/core-cs/LatencyThroughputIops.mdx";
import IndexWhyFastMdx from "./mdx/core-cs/IndexWhyFast.mdx";
import CachingMdx from "./mdx/core-cs/Caching.mdx";
import ScaleUpScaleOutMdx from "./mdx/core-cs/ScaleUpScaleOut.mdx";
import StatelessStatefulMdx from "./mdx/core-cs/StatelessStateful.mdx";
import IdempotencyMdx from "./mdx/core-cs/Idempotency.mdx";
import CapTheoremMdx from "./mdx/core-cs/CapTheorem.mdx";
import ConsistencyModelMdx from "./mdx/core-cs/ConsistencyModel.mdx";
import DistributedTransactionLockMdx from "./mdx/core-cs/DistributedTransactionLock.mdx";
import EventDrivenArchMdx from "./mdx/core-cs/EventDrivenArch.mdx";
import HashVsEncryptionMdx from "./mdx/core-cs/HashVsEncryption.mdx";
import LeastPrivilegeMdx from "./mdx/core-cs/LeastPrivilege.mdx";
import FirewallMdx from "./mdx/core-cs/Firewall.mdx";
import ObservabilityMdx from "./mdx/core-cs/Observability.mdx";
import RetryBackoffMdx from "./mdx/core-cs/RetryBackoff.mdx";
import ThrottlingRateLimitingMdx from "./mdx/core-cs/ThrottlingRateLimiting.mdx";
import BackupMdx from "./mdx/core-cs/Backup.mdx";
import ReplicationMdx from "./mdx/core-cs/Replication.mdx";
import DrStrategyMdx from "./mdx/core-cs/DrStrategy.mdx";
import SourceControlMdx from "./mdx/core-cs/SourceControl.mdx";
import BuildMdx from "./mdx/core-cs/Build.mdx";
import TestMdx from "./mdx/core-cs/Test.mdx";
import DevSecOpsMdx from "./mdx/core-cs/DevSecOps.mdx";
import ArtifactMdx from "./mdx/core-cs/Artifact.mdx";
import DeployMdx from "./mdx/core-cs/Deploy.mdx";
import GitOpsMdx from "./mdx/core-cs/GitOps.mdx";
import RtoRpoMdx from "./mdx/core-cs/RtoRpo.mdx";
import HaDesignMdx from "./mdx/core-cs/HaDesign.mdx";
import SliSloMdx from "./mdx/core-cs/SliSlo.mdx";
import ContainerImageMdx from "./mdx/core-cs/ContainerImage.mdx";
import ContainerRegistryMdx from "./mdx/core-cs/ContainerRegistry.mdx";
import ContainerRuntimeMdx from "./mdx/core-cs/ContainerRuntime.mdx";
import ContainerOrchestrationMdx from "./mdx/core-cs/ContainerOrchestration.mdx";
import ContainerServiceEndpointMdx from "./mdx/core-cs/ContainerServiceEndpoint.mdx";
import CostComputeMdx from "./mdx/core-cs/CostCompute.mdx";
import CostStorageMdx from "./mdx/core-cs/CostStorage.mdx";
import CostTrafficMdx from "./mdx/core-cs/CostTraffic.mdx";
import CostOnDemandMdx from "./mdx/core-cs/CostOnDemand.mdx";
import CostReservedMdx from "./mdx/core-cs/CostReserved.mdx";
import CostSpotMdx from "./mdx/core-cs/CostSpot.mdx";
import CostVisibilityMdx from "./mdx/core-cs/CostVisibility.mdx";
import CostBudgetsMdx from "./mdx/core-cs/CostBudgets.mdx";
import CostOptimizationMdx from "./mdx/core-cs/CostOptimization.mdx";
import SaaVpcPeeringMdx from "./mdx/saa/SaaVpcPeering.mdx";
import SaaTransitGatewayMdx from "./mdx/saa/SaaTransitGateway.mdx";
import SaaDirectConnectVpnMdx from "./mdx/saa/SaaDirectConnectVpn.mdx";
import SaaRoute53RoutingMdx from "./mdx/saa/SaaRoute53Routing.mdx";
import SaaCloudfrontIntegrationMdx from "./mdx/saa/SaaCloudfrontIntegration.mdx";
import SaaEbsVsEfsFsxMdx from "./mdx/saa/SaaEbsVsEfsFsx.mdx";
import SaaS3StaticHostingMdx from "./mdx/saa/SaaS3StaticHosting.mdx";
import SaaEc2VsLambdaEcsEksMdx from "./mdx/saa/SaaEc2VsLambdaEcsEks.mdx";
import SaaComputeTradeoffMdx from "./mdx/saa/SaaComputeTradeoff.mdx";
import SaaElbAsgHaMdx from "./mdx/saa/SaaElbAsgHa.mdx";
import SaaRdsVsAuroraMdx from "./mdx/saa/SaaRdsVsAurora.mdx";
import SaaMultiazVsReadReplicaMdx from "./mdx/saa/SaaMultiazVsReadReplica.mdx";
import SaaDynamodbUseCaseMdx from "./mdx/saa/SaaDynamodbUseCase.mdx";
import SaaElasticacheCachingMdx from "./mdx/saa/SaaElasticacheCaching.mdx";
import SaaSecuritySaaMdx from "./mdx/saa/SaaSecuritySaa.mdx";
import SaaWafBasicsMdx from "./mdx/saa/SaaWafBasics.mdx";
import SaaSqsSnsPatternMdx from "./mdx/saa/SaaSqsSnsPattern.mdx";
import SaaBackupMdx from "./mdx/saa/SaaBackup.mdx";
import SaaPilotLightMdx from "./mdx/saa/SaaPilotLight.mdx";
import SaaWarmStandbyMdx from "./mdx/saa/SaaWarmStandby.mdx";
import SaaActiveActiveMdx from "./mdx/saa/SaaActiveActive.mdx";
import SaaCostOptimizationMdx from "./mdx/saa/SaaCostOptimization.mdx";
import SaaServerlessPatternMdx from "./mdx/saa/SaaServerlessPattern.mdx";
import DvaLambdaConcurrencyMdx from "./mdx/dva/DvaLambdaConcurrency.mdx";
import DvaColdStartMdx from "./mdx/dva/DvaColdStart.mdx";
import DvaDlqDestinationsMdx from "./mdx/dva/DvaDlqDestinations.mdx";
import DvaRestVsHttpApiMdx from "./mdx/dva/DvaRestVsHttpApi.mdx";
import DvaAuthorizerMdx from "./mdx/dva/DvaAuthorizer.mdx";
import DvaThrottlingMdx from "./mdx/dva/DvaThrottling.mdx";
import DvaPartitionKeyDesignMdx from "./mdx/dva/DvaPartitionKeyDesign.mdx";
import DvaGsiLsiMdx from "./mdx/dva/DvaGsiLsi.mdx";
import DvaConditionalUpdateMdx from "./mdx/dva/DvaConditionalUpdate.mdx";
import DvaStreamsMdx from "./mdx/dva/DvaStreams.mdx";
import DvaSqsVisibilityTimeoutMdx from "./mdx/dva/DvaSqsVisibilityTimeout.mdx";
import DvaSnsFanoutMdx from "./mdx/dva/DvaSnsFanout.mdx";
import DvaEventbridgeMdx from "./mdx/dva/DvaEventbridge.mdx";
import DvaCodepipelineMdx from "./mdx/dva/DvaCodepipeline.mdx";
import DvaCodebuildMdx from "./mdx/dva/DvaCodebuild.mdx";
import DvaSamMdx from "./mdx/dva/DvaSam.mdx";
import SoaMetricFilterMdx from "./mdx/soa/SoaMetricFilter.mdx";
import SoaCompositeAlarmMdx from "./mdx/soa/SoaCompositeAlarm.mdx";
import SoaLogsInsightsMdx from "./mdx/soa/SoaLogsInsights.mdx";
import SoaSessionManagerMdx from "./mdx/soa/SoaSessionManager.mdx";
import SoaPatchManagerMdx from "./mdx/soa/SoaPatchManager.mdx";
import SoaRunCommandMdx from "./mdx/soa/SoaRunCommand.mdx";
import SoaLaunchTemplateMdx from "./mdx/soa/SoaLaunchTemplate.mdx";
import SoaAmiManagementMdx from "./mdx/soa/SoaAmiManagement.mdx";
import SoaEbsSnapshotMdx from "./mdx/soa/SoaEbsSnapshot.mdx";
import SoaFlowLogsMdx from "./mdx/soa/SoaFlowLogs.mdx";
import SoaDnsIssuesMdx from "./mdx/soa/SoaDnsIssues.mdx";
import SoaSgNaclAnalysisMdx from "./mdx/soa/SoaSgNaclAnalysis.mdx";
import SoaAwsConfigMdx from "./mdx/soa/SoaAwsConfig.mdx";
import SoaGuarddutyMdx from "./mdx/soa/SoaGuardduty.mdx";
import SoaCostExplorerBudgetsMdx from "./mdx/soa/SoaCostExplorerBudgets.mdx";

const DOC_URL_PREFIX = "/handbook";
const LAYERS_WITH_DIAGRAM = ["core-cs", "aws-common", "saa", "dva", "soa"];
const SCROLL_BACK_KEY = "handbookScrollBackHash";
const MAIN_CLASS = "max-w-4xl mx-auto px-4 py-8";

function RelatedInSection({
  layerId,
  sectionTitle,
  docs,
  currentSlug,
}: {
  layerId: string;
  sectionTitle: string;
  docs: { slug: string; title: string }[];
  currentSlug: string;
}) {
  const siblings = docs.filter((d) => d.slug !== currentSlug);
  if (siblings.length === 0) return null;

  return (
    <aside className="mt-10 pt-8 border-t border-border">
      <h2 className="text-sm font-semibold text-foreground mb-3">
        이 섹션의 다른 개념 ({sectionTitle})
      </h2>
      <ul className="flex flex-wrap gap-x-1 gap-y-1">
        {siblings.map((d, i) => (
          <li key={d.slug} className="inline">
            <Link
              to={`/handbook/${layerId}/${d.slug}`}
              className="text-sm text-primary hover:underline"
            >
              {d.title}
            </Link>
            {i < siblings.length - 1 && (
              <span className="text-muted-foreground/60 mx-1.5">·</span>
            )}
          </li>
        ))}
      </ul>
    </aside>
  );
}

function useHandbookDoc(layerId: string | undefined, slug: string | undefined) {
  return useMemo(
    () => (layerId && slug ? getHandbookDoc(layerId, slug) : null),
    [layerId, slug]
  );
}

const HandbookView = memo(function HandbookView() {
  const { layerId, slug } = useParams<{ layerId: string; slug: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [content, setContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const meta = useHandbookDoc(layerId, slug);

  const isMdxDoc = (() => {
    if (!layerId || !slug) return false;
    if (layerId === "core-cs" && slug === "observability") return true;
    if (layerId === "core-cs" && slug === "retry-backoff") return true;
    if (layerId === "core-cs" && slug === "throttling-rate-limiting") return true;
    if (layerId === "core-cs" && slug === "backup") return true;
    if (layerId === "core-cs" && slug === "replication") return true;
    if (layerId === "core-cs" && slug === "dr-strategy") return true;
    if (layerId === "core-cs" && slug === "source-control") return true;
    if (layerId === "core-cs" && slug === "build") return true;
    if (layerId === "core-cs" && slug === "test") return true;
    if (layerId === "core-cs" && slug === "devsecops") return true;
    if (layerId === "core-cs" && slug === "artifact") return true;
    if (layerId === "core-cs" && slug === "deploy") return true;
    if (layerId === "core-cs" && slug === "gitops") return true;
    if (layerId === "core-cs" && slug === "rto-rpo") return true;
    if (layerId === "core-cs" && slug === "ha-design") return true;
    if (layerId === "core-cs" && slug === "sli-slo") return true;
    if (layerId === "core-cs" && slug === "ip-cidr-subnetting") return true;
    if (layerId === "core-cs" && slug === "routing-table") return true;
    if (layerId === "core-cs" && slug === "nat") return true;
    if (layerId === "core-cs" && slug === "dns-resolver-vs-authoritative") return true;
    if (layerId === "core-cs" && slug === "tcp-vs-udp") return true;
    if (layerId === "core-cs" && slug === "http-https-tls") return true;
    if (layerId === "core-cs" && slug === "l4-vs-l7-lb") return true;
    if (layerId === "core-cs" && slug === "block-file-object") return true;
    if (layerId === "core-cs" && slug === "rdb") return true;
    if (layerId === "core-cs" && slug === "nosql") return true;
    if (layerId === "core-cs" && slug === "vector-db") return true;
    if (layerId === "core-cs" && slug === "timeseries-db") return true;
    if (layerId === "core-cs" && slug === "search") return true;
    if (layerId === "core-cs" && slug === "log-store") return true;
    if (layerId === "core-cs" && slug === "latency-throughput-iops") return true;
    if (layerId === "core-cs" && slug === "index-why-fast") return true;
    if (layerId === "core-cs" && slug === "caching") return true;
    if (layerId === "core-cs" && slug === "scale-up-scale-out") return true;
    if (layerId === "core-cs" && slug === "stateless-stateful") return true;
    if (layerId === "core-cs" && slug === "idempotency") return true;
    if (layerId === "core-cs" && slug === "cap-theorem") return true;
    if (layerId === "core-cs" && slug === "consistency-model") return true;
    if (layerId === "core-cs" && slug === "event-driven-arch") return true;
    if (layerId === "core-cs" && slug === "container-image") return true;
    if (layerId === "core-cs" && slug === "container-registry") return true;
    if (layerId === "core-cs" && slug === "container-runtime") return true;
    if (layerId === "core-cs" && slug === "container-service-endpoint") return true;
    if (layerId === "core-cs" && slug === "container-orchestration") return true;
    if (layerId === "core-cs" && slug === "distributed-transaction-lock") return true;
    if (layerId === "core-cs" && slug === "hash-vs-encryption") return true;
    if (layerId === "core-cs" && slug === "least-privilege") return true;
    if (layerId === "core-cs" && slug === "firewall") return true;
    if (layerId === "core-cs" && slug === "queue-vs-pubsub") return true;
    if (layerId === "core-cs" && slug === "acid-transaction-lock") return true;
    if (layerId === "core-cs" && slug === "authn-vs-authz") return true;
    if (layerId === "core-cs" && slug === "cost-compute") return true;
    if (layerId === "core-cs" && slug === "cost-storage") return true;
    if (layerId === "core-cs" && slug === "cost-traffic") return true;
    if (layerId === "core-cs" && slug === "cost-on-demand") return true;
    if (layerId === "core-cs" && slug === "cost-reserved") return true;
    if (layerId === "core-cs" && slug === "cost-spot") return true;
    if (layerId === "core-cs" && slug === "cost-visibility") return true;
    if (layerId === "core-cs" && slug === "cost-budgets") return true;
    if (layerId === "core-cs" && slug === "cost-optimization") return true;
    if (layerId === "soa" && slug === "overview") return true;
    if (layerId === "dva" && slug === "overview") return true;
    if (layerId === "aws-common" && slug === "overview") return true;
    if (layerId === "aws-common" && slug === "public-private-subnet") return true;
    if (layerId === "aws-common" && slug === "vpc-route-table") return true;
    if (layerId === "aws-common" && slug === "igw-vs-nat") return true;
    if (layerId === "aws-common" && slug === "elastic-ip") return true;
    if (layerId === "aws-common" && slug === "security-group") return true;
    if (layerId === "aws-common" && slug === "nacl") return true;
    if (layerId === "aws-common" && slug === "vpc-endpoint") return true;
    if (layerId === "aws-common" && slug === "iam-user-vs-role") return true;
    if (layerId === "aws-common" && slug === "policy-evaluation") return true;
    if (layerId === "aws-common" && slug === "identity-vs-resource-policy") return true;
    if (layerId === "aws-common" && slug === "explicit-deny") return true;
    if (layerId === "aws-common" && slug === "sts-assumerole") return true;
    if (layerId === "aws-common" && slug === "cross-account") return true;
    if (layerId === "aws-common" && slug === "mfa") return true;
    if (layerId === "aws-common" && slug === "s3-overview") return true;
    if (layerId === "aws-common" && slug === "ebs-basics") return true;
    if (layerId === "aws-common" && slug === "efs-basics") return true;
    if (layerId === "aws-common" && slug === "rds-basics") return true;
    if (layerId === "aws-common" && slug === "dynamodb-basics") return true;
    if (layerId === "aws-common" && slug === "elasticache-basics") return true;
    if (layerId === "aws-common" && slug === "ec2-overview") return true;
    if (layerId === "aws-common" && slug === "lambda-basics") return true;
    if (layerId === "aws-common" && slug === "ecs-basics") return true;
    if (layerId === "aws-common" && slug === "eks-basics") return true;
    if (layerId === "aws-common" && slug === "elb-types") return true;
    if (layerId === "aws-common" && slug === "target-group") return true;
    if (layerId === "aws-common" && slug === "health-check") return true;
    if (layerId === "aws-common" && slug === "sticky-session") return true;
    if (layerId === "aws-common" && slug === "asg-basics") return true;
    if (layerId === "aws-common" && slug === "scaling-policy") return true;
    if (layerId === "aws-common" && slug === "cloudwatch-metrics-logs") return true;
    if (layerId === "aws-common" && slug === "cloudwatch-dashboard") return true;
    if (layerId === "aws-common" && slug === "alarm") return true;
    if (layerId === "aws-common" && slug === "cloudtrail-vs-config") return true;
    if (layerId === "saa" && slug === "vpc-peering") return true;
    if (layerId === "saa" && slug === "transit-gateway") return true;
    if (layerId === "saa" && slug === "direct-connect-vpn") return true;
    if (layerId === "saa" && slug === "route53-routing") return true;
    if (layerId === "saa" && slug === "cloudfront-integration") return true;
    if (layerId === "saa" && slug === "ebs-vs-efs-fsx") return true;
    if (layerId === "saa" && slug === "s3-static-hosting") return true;
    if (layerId === "saa" && slug === "ec2-vs-lambda-ecs-eks") return true;
    if (layerId === "saa" && slug === "compute-tradeoff") return true;
    if (layerId === "saa" && slug === "elb-asg-ha") return true;
    if (layerId === "saa" && slug === "rds-vs-aurora") return true;
    if (layerId === "saa" && slug === "multiaz-vs-read-replica") return true;
    if (layerId === "saa" && slug === "dynamodb-use-case") return true;
    if (layerId === "saa" && slug === "elasticache-caching") return true;
    if (layerId === "saa" && slug === "security-saa") return true;
    if (layerId === "saa" && slug === "waf-basics") return true;
    if (layerId === "saa" && slug === "sqs-sns-pattern") return true;
    if (layerId === "saa" && slug === "backup") return true;
    if (layerId === "saa" && slug === "pilot-light") return true;
    if (layerId === "saa" && slug === "warm-standby") return true;
    if (layerId === "saa" && slug === "active-active") return true;
    if (layerId === "saa" && slug === "cost-optimization") return true;
    if (layerId === "saa" && slug === "serverless-pattern") return true;
    if (layerId === "dva" && slug === "lambda-concurrency") return true;
    if (layerId === "dva" && slug === "cold-start") return true;
    if (layerId === "dva" && slug === "dlq-destinations") return true;
    if (layerId === "dva" && slug === "rest-vs-http-api") return true;
    if (layerId === "dva" && slug === "authorizer") return true;
    if (layerId === "dva" && slug === "throttling") return true;
    if (layerId === "dva" && slug === "partition-key-design") return true;
    if (layerId === "dva" && slug === "gsi-lsi") return true;
    if (layerId === "dva" && slug === "conditional-update") return true;
    if (layerId === "dva" && slug === "streams") return true;
    if (layerId === "dva" && slug === "sqs-visibility-timeout") return true;
    if (layerId === "dva" && slug === "sns-fanout") return true;
    if (layerId === "dva" && slug === "eventbridge") return true;
    if (layerId === "dva" && slug === "codepipeline") return true;
    if (layerId === "dva" && slug === "codebuild") return true;
    if (layerId === "dva" && slug === "sam") return true;
    if (layerId === "soa" && slug === "metric-filter") return true;
    if (layerId === "soa" && slug === "composite-alarm") return true;
    if (layerId === "soa" && slug === "logs-insights") return true;
    if (layerId === "soa" && slug === "session-manager") return true;
    if (layerId === "soa" && slug === "patch-manager") return true;
    if (layerId === "soa" && slug === "run-command") return true;
    if (layerId === "soa" && slug === "launch-template") return true;
    if (layerId === "soa" && slug === "ami-management") return true;
    if (layerId === "soa" && slug === "ebs-snapshot") return true;
    if (layerId === "soa" && slug === "flow-logs") return true;
    if (layerId === "soa" && slug === "dns-issues") return true;
    if (layerId === "soa" && slug === "sg-nacl-analysis") return true;
    if (layerId === "soa" && slug === "aws-config") return true;
    if (layerId === "soa" && slug === "guardduty") return true;
    if (layerId === "soa" && slug === "cost-explorer-budgets") return true;
    return false;
  })();

  useEffect(() => {
    if (layerId === "core-cs" && slug === "real-system-diagrams") {
      navigate("/handbook/core-cs", { replace: true });
    }
    if (layerId === "core-cs" && slug === "symmetric-asymmetric") {
      navigate("/handbook/core-cs/hash-vs-encryption", { replace: true });
    }
  }, [layerId, slug, navigate]);

  if (layerId === "core-cs" && (slug === "real-system-diagrams" || slug === "symmetric-asymmetric")) {
    return null;
  }

  useEffect(() => {
    if (!layerId || !slug) return;
    if (isMdxDoc) return;
    if (layerId === "core-cs" && slug === "real-system-diagrams") return;
    const resolved = getHandbookDoc(layerId, slug);
    if (!resolved) {
      setContent(null);
      setError(null);
      return;
    }

    setError(null);
    setContent(null);
    const url = `${DOC_URL_PREFIX}/${layerId}/${slug}.md`;
    const controller = new AbortController();

    fetch(url, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error("문서를 불러올 수 없습니다.");
        return res.text();
      })
      .then(setContent)
      .catch((err: unknown) => {
        const isAbort = err instanceof Error && err.name === "AbortError";
        if (!isAbort) {
          setError("문서를 불러오는 중 오류가 발생했습니다.");
        }
      });

    return () => controller.abort();
  }, [layerId, slug]);

  if (!layerId || !slug) {
    return (
      <main className={MAIN_CLASS}>
        <p className="text-muted-foreground">잘못된 경로입니다.</p>
        <button
          type="button"
          onClick={() => navigate("/handbook")}
          className="mt-4 text-primary hover:underline"
        >
          핸드북 목록으로
        </button>
      </main>
    );
  }

  if (!meta) {
    return (
      <main className={MAIN_CLASS}>
        <p className="text-muted-foreground">문서 정보를 찾을 수 없습니다.</p>
        <button
          type="button"
          onClick={() => navigate("/handbook")}
          className="mt-4 text-primary hover:underline"
        >
          핸드북 목록으로
        </button>
      </main>
    );
  }

  if (error) {
    return (
      <main className={MAIN_CLASS}>
        <p className="text-muted-foreground">{error}</p>
        <button
          type="button"
          onClick={() => navigate(`/handbook/${layerId}`)}
          className="mt-4 text-primary hover:underline"
        >
          {meta.layer.title} 목차로
        </button>
      </main>
    );
  }

  if (!isMdxDoc && content === null) {
    return (
      <main
        className={`${MAIN_CLASS} flex justify-center items-center min-h-[200px]`}
      >
        <LoadingSpinner />
      </main>
    );
  }

  const backScrollHash =
    (location.state as { scrollBackHash?: string } | null)?.scrollBackHash ??
    (typeof window !== "undefined" ? sessionStorage.getItem(SCROLL_BACK_KEY) : null);
  const backToDiagramHref =
    meta.layer.id && LAYERS_WITH_DIAGRAM.includes(meta.layer.id) && getDiagramConfig(meta.layer.id)
      ? `/handbook/${meta.layer.id}${backScrollHash ?? ""}`
      : undefined;

  const mdxComponent = (() => {
    if (!isMdxDoc) return null;
    if (layerId === "core-cs" && slug === "observability") return <ObservabilityMdx />;
    if (layerId === "core-cs" && slug === "retry-backoff") return <RetryBackoffMdx />;
    if (layerId === "core-cs" && slug === "throttling-rate-limiting") {
      return <ThrottlingRateLimitingMdx />;
    }
    if (layerId === "core-cs" && slug === "backup") return <BackupMdx />;
    if (layerId === "core-cs" && slug === "replication") return <ReplicationMdx />;
    if (layerId === "core-cs" && slug === "dr-strategy") return <DrStrategyMdx />;
    if (layerId === "core-cs" && slug === "source-control") return <SourceControlMdx />;
    if (layerId === "core-cs" && slug === "build") return <BuildMdx />;
    if (layerId === "core-cs" && slug === "test") return <TestMdx />;
    if (layerId === "core-cs" && slug === "devsecops") return <DevSecOpsMdx />;
    if (layerId === "core-cs" && slug === "artifact") return <ArtifactMdx />;
    if (layerId === "core-cs" && slug === "deploy") return <DeployMdx />;
    if (layerId === "core-cs" && slug === "gitops") return <GitOpsMdx />;
    if (layerId === "core-cs" && slug === "rto-rpo") return <RtoRpoMdx />;
    if (layerId === "core-cs" && slug === "ha-design") return <HaDesignMdx />;
    if (layerId === "core-cs" && slug === "sli-slo") return <SliSloMdx />;
    if (layerId === "core-cs" && slug === "ip-cidr-subnetting") return <IpCidrSubnettingMdx />;
    if (layerId === "core-cs" && slug === "routing-table") return <RoutingTableMdx />;
    if (layerId === "core-cs" && slug === "nat") return <NatMdx />;
    if (layerId === "core-cs" && slug === "dns-resolver-vs-authoritative") {
      return <DnsResolverVsAuthoritativeMdx />;
    }
    if (layerId === "core-cs" && slug === "tcp-vs-udp") return <TcpVsUdpMdx />;
    if (layerId === "core-cs" && slug === "http-https-tls") return <HttpHttpsTlsMdx />;
    if (layerId === "core-cs" && slug === "l4-vs-l7-lb") return <L4VsL7LbMdx />;
    if (layerId === "core-cs" && slug === "block-file-object") return <BlockFileObjectMdx />;
    if (layerId === "core-cs" && slug === "rdb") return <RdbMdx />;
    if (layerId === "core-cs" && slug === "nosql") return <NoSqlMdx />;
    if (layerId === "core-cs" && slug === "vector-db") return <VectorDbMdx />;
    if (layerId === "core-cs" && slug === "timeseries-db") return <TimeseriesDbMdx />;
    if (layerId === "core-cs" && slug === "search") return <SearchMdx />;
    if (layerId === "core-cs" && slug === "log-store") return <LogStoreMdx />;
    if (layerId === "core-cs" && slug === "latency-throughput-iops") {
      return <LatencyThroughputIopsMdx />;
    }
    if (layerId === "core-cs" && slug === "index-why-fast") return <IndexWhyFastMdx />;
    if (layerId === "core-cs" && slug === "caching") return <CachingMdx />;
    if (layerId === "core-cs" && slug === "scale-up-scale-out") return <ScaleUpScaleOutMdx />;
    if (layerId === "core-cs" && slug === "stateless-stateful") return <StatelessStatefulMdx />;
    if (layerId === "core-cs" && slug === "idempotency") return <IdempotencyMdx />;
    if (layerId === "core-cs" && slug === "cap-theorem") return <CapTheoremMdx />;
    if (layerId === "core-cs" && slug === "consistency-model") return <ConsistencyModelMdx />;
    if (layerId === "core-cs" && slug === "event-driven-arch") return <EventDrivenArchMdx />;
    if (layerId === "core-cs" && slug === "container-image") return <ContainerImageMdx />;
    if (layerId === "core-cs" && slug === "container-registry") return <ContainerRegistryMdx />;
    if (layerId === "core-cs" && slug === "container-runtime") return <ContainerRuntimeMdx />;
    if (layerId === "core-cs" && slug === "container-service-endpoint") {
      return <ContainerServiceEndpointMdx />;
    }
    if (layerId === "core-cs" && slug === "container-orchestration") {
      return <ContainerOrchestrationMdx />;
    }
    if (layerId === "core-cs" && slug === "distributed-transaction-lock") {
      return <DistributedTransactionLockMdx />;
    }
    if (layerId === "core-cs" && slug === "hash-vs-encryption") return <HashVsEncryptionMdx />;
    if (layerId === "core-cs" && slug === "least-privilege") return <LeastPrivilegeMdx />;
    if (layerId === "core-cs" && slug === "firewall") return <FirewallMdx />;
    if (layerId === "core-cs" && slug === "queue-vs-pubsub") return <QueueVsPubsubMdx />;
    if (layerId === "core-cs" && slug === "acid-transaction-lock") return <AcidTransactionLockMdx />;
    if (layerId === "core-cs" && slug === "authn-vs-authz") return <AuthnVsAuthzMdx />;
    if (layerId === "core-cs" && slug === "cost-compute") return <CostComputeMdx />;
    if (layerId === "core-cs" && slug === "cost-storage") return <CostStorageMdx />;
    if (layerId === "core-cs" && slug === "cost-traffic") return <CostTrafficMdx />;
    if (layerId === "core-cs" && slug === "cost-on-demand") return <CostOnDemandMdx />;
    if (layerId === "core-cs" && slug === "cost-reserved") return <CostReservedMdx />;
    if (layerId === "core-cs" && slug === "cost-spot") return <CostSpotMdx />;
    if (layerId === "core-cs" && slug === "cost-visibility") return <CostVisibilityMdx />;
    if (layerId === "core-cs" && slug === "cost-budgets") return <CostBudgetsMdx />;
    if (layerId === "core-cs" && slug === "cost-optimization") return <CostOptimizationMdx />;
    if (layerId === "soa" && slug === "overview") return <SoaOverviewMdx />;
    if (layerId === "dva" && slug === "overview") return <DvaOverviewMdx />;
    if (layerId === "aws-common" && slug === "overview") return <AwsCommonOverviewMdx />;
    if (layerId === "aws-common" && slug === "public-private-subnet") return <PublicPrivateSubnetMdx />;
    if (layerId === "aws-common" && slug === "vpc-route-table") return <VpcRouteTableMdx />;
    if (layerId === "aws-common" && slug === "igw-vs-nat") return <IgwVsNatMdx />;
    if (layerId === "aws-common" && slug === "elastic-ip") return <ElasticIpMdx />;
    if (layerId === "aws-common" && slug === "security-group") return <SecurityGroupMdx />;
    if (layerId === "aws-common" && slug === "nacl") return <NaclMdx />;
    if (layerId === "aws-common" && slug === "vpc-endpoint") return <VpcEndpointMdx />;
    if (layerId === "aws-common" && slug === "iam-user-vs-role") return <IamUserVsRoleMdx />;
    if (layerId === "aws-common" && slug === "policy-evaluation") return <PolicyEvaluationMdx />;
    if (layerId === "aws-common" && slug === "identity-vs-resource-policy") return <IdentityVsResourcePolicyMdx />;
    if (layerId === "aws-common" && slug === "explicit-deny") return <ExplicitDenyMdx />;
    if (layerId === "aws-common" && slug === "sts-assumerole") return <StsAssumeroleMdx />;
    if (layerId === "aws-common" && slug === "cross-account") return <CrossAccountMdx />;
    if (layerId === "aws-common" && slug === "mfa") return <MfaMdx />;
    if (layerId === "aws-common" && slug === "s3-overview") return <S3OverviewMdx />;
    if (layerId === "aws-common" && slug === "ebs-basics") return <EbsBasicsMdx />;
    if (layerId === "aws-common" && slug === "efs-basics") return <EfsBasicsMdx />;
    if (layerId === "aws-common" && slug === "rds-basics") return <RdsBasicsMdx />;
    if (layerId === "aws-common" && slug === "dynamodb-basics") return <DynamodbBasicsMdx />;
    if (layerId === "aws-common" && slug === "elasticache-basics") return <ElastiCacheBasicsMdx />;
    if (layerId === "aws-common" && slug === "ec2-overview") return <Ec2OverviewMdx />;
    if (layerId === "aws-common" && slug === "lambda-basics") return <LambdaBasicsMdx />;
    if (layerId === "aws-common" && slug === "ecs-basics") return <EcsBasicsMdx />;
    if (layerId === "aws-common" && slug === "eks-basics") return <EksBasicsMdx />;
    if (layerId === "aws-common" && slug === "elb-types") return <ElbTypesMdx />;
    if (layerId === "aws-common" && slug === "target-group") return <TargetGroupMdx />;
    if (layerId === "aws-common" && slug === "health-check") return <HealthCheckMdx />;
    if (layerId === "aws-common" && slug === "sticky-session") return <StickySessionMdx />;
    if (layerId === "aws-common" && slug === "asg-basics") return <AsgBasicsMdx />;
    if (layerId === "aws-common" && slug === "scaling-policy") return <ScalingPolicyMdx />;
    if (layerId === "aws-common" && slug === "cloudwatch-metrics-logs") return <CloudwatchMetricsLogsMdx />;
    if (layerId === "aws-common" && slug === "cloudwatch-dashboard") return <CloudwatchDashboardMdx />;
    if (layerId === "aws-common" && slug === "alarm") return <AlarmMdx />;
    if (layerId === "aws-common" && slug === "cloudtrail-vs-config") return <CloudtrailVsConfigMdx />;
    if (layerId === "saa" && slug === "vpc-peering") return <SaaVpcPeeringMdx />;
    if (layerId === "saa" && slug === "transit-gateway") return <SaaTransitGatewayMdx />;
    if (layerId === "saa" && slug === "direct-connect-vpn") return <SaaDirectConnectVpnMdx />;
    if (layerId === "saa" && slug === "route53-routing") return <SaaRoute53RoutingMdx />;
    if (layerId === "saa" && slug === "cloudfront-integration") return <SaaCloudfrontIntegrationMdx />;
    if (layerId === "saa" && slug === "ebs-vs-efs-fsx") return <SaaEbsVsEfsFsxMdx />;
    if (layerId === "saa" && slug === "s3-static-hosting") return <SaaS3StaticHostingMdx />;
    if (layerId === "saa" && slug === "ec2-vs-lambda-ecs-eks") return <SaaEc2VsLambdaEcsEksMdx />;
    if (layerId === "saa" && slug === "compute-tradeoff") return <SaaComputeTradeoffMdx />;
    if (layerId === "saa" && slug === "elb-asg-ha") return <SaaElbAsgHaMdx />;
    if (layerId === "saa" && slug === "rds-vs-aurora") return <SaaRdsVsAuroraMdx />;
    if (layerId === "saa" && slug === "multiaz-vs-read-replica") return <SaaMultiazVsReadReplicaMdx />;
    if (layerId === "saa" && slug === "dynamodb-use-case") return <SaaDynamodbUseCaseMdx />;
    if (layerId === "saa" && slug === "elasticache-caching") return <SaaElasticacheCachingMdx />;
    if (layerId === "saa" && slug === "security-saa") return <SaaSecuritySaaMdx />;
    if (layerId === "saa" && slug === "waf-basics") return <SaaWafBasicsMdx />;
    if (layerId === "saa" && slug === "sqs-sns-pattern") return <SaaSqsSnsPatternMdx />;
    if (layerId === "saa" && slug === "backup") return <SaaBackupMdx />;
    if (layerId === "saa" && slug === "pilot-light") return <SaaPilotLightMdx />;
    if (layerId === "saa" && slug === "warm-standby") return <SaaWarmStandbyMdx />;
    if (layerId === "saa" && slug === "active-active") return <SaaActiveActiveMdx />;
    if (layerId === "saa" && slug === "cost-optimization") return <SaaCostOptimizationMdx />;
    if (layerId === "saa" && slug === "serverless-pattern") return <SaaServerlessPatternMdx />;
    if (layerId === "dva" && slug === "lambda-concurrency") return <DvaLambdaConcurrencyMdx />;
    if (layerId === "dva" && slug === "cold-start") return <DvaColdStartMdx />;
    if (layerId === "dva" && slug === "dlq-destinations") return <DvaDlqDestinationsMdx />;
    if (layerId === "dva" && slug === "rest-vs-http-api") return <DvaRestVsHttpApiMdx />;
    if (layerId === "dva" && slug === "authorizer") return <DvaAuthorizerMdx />;
    if (layerId === "dva" && slug === "throttling") return <DvaThrottlingMdx />;
    if (layerId === "dva" && slug === "partition-key-design") return <DvaPartitionKeyDesignMdx />;
    if (layerId === "dva" && slug === "gsi-lsi") return <DvaGsiLsiMdx />;
    if (layerId === "dva" && slug === "conditional-update") return <DvaConditionalUpdateMdx />;
    if (layerId === "dva" && slug === "streams") return <DvaStreamsMdx />;
    if (layerId === "dva" && slug === "sqs-visibility-timeout") return <DvaSqsVisibilityTimeoutMdx />;
    if (layerId === "dva" && slug === "sns-fanout") return <DvaSnsFanoutMdx />;
    if (layerId === "dva" && slug === "eventbridge") return <DvaEventbridgeMdx />;
    if (layerId === "dva" && slug === "codepipeline") return <DvaCodepipelineMdx />;
    if (layerId === "dva" && slug === "codebuild") return <DvaCodebuildMdx />;
    if (layerId === "dva" && slug === "sam") return <DvaSamMdx />;
    if (layerId === "soa" && slug === "metric-filter") return <SoaMetricFilterMdx />;
    if (layerId === "soa" && slug === "composite-alarm") return <SoaCompositeAlarmMdx />;
    if (layerId === "soa" && slug === "logs-insights") return <SoaLogsInsightsMdx />;
    if (layerId === "soa" && slug === "session-manager") return <SoaSessionManagerMdx />;
    if (layerId === "soa" && slug === "patch-manager") return <SoaPatchManagerMdx />;
    if (layerId === "soa" && slug === "run-command") return <SoaRunCommandMdx />;
    if (layerId === "soa" && slug === "launch-template") return <SoaLaunchTemplateMdx />;
    if (layerId === "soa" && slug === "ami-management") return <SoaAmiManagementMdx />;
    if (layerId === "soa" && slug === "ebs-snapshot") return <SoaEbsSnapshotMdx />;
    if (layerId === "soa" && slug === "flow-logs") return <SoaFlowLogsMdx />;
    if (layerId === "soa" && slug === "dns-issues") return <SoaDnsIssuesMdx />;
    if (layerId === "soa" && slug === "sg-nacl-analysis") return <SoaSgNaclAnalysisMdx />;
    if (layerId === "soa" && slug === "aws-config") return <SoaAwsConfigMdx />;
    if (layerId === "soa" && slug === "guardduty") return <SoaGuarddutyMdx />;
    if (layerId === "soa" && slug === "cost-explorer-budgets") return <SoaCostExplorerBudgetsMdx />;
    return null;
  })();

  return (
    <HandbookLayout
      layerTitle={meta.layer.title}
      sectionTitle={meta.section.title}
      docTitle={meta.doc.title}
      backToDiagramHref={backToDiagramHref}
    >
      {isMdxDoc && (
        <div className="handbook-doc-content max-w-4xl">
          <div className="markdown-body">{mdxComponent}</div>
        </div>
      )}
      {!isMdxDoc && content !== null && (
        <div className="handbook-doc-content max-w-4xl">
          <MarkdownViewer key={`${layerId}-${slug}`} content={content} />
        </div>
      )}
      <RelatedInSection
        layerId={meta.layer.id}
        sectionTitle={meta.section.title}
        docs={meta.section.docs}
        currentSlug={meta.doc.slug}
      />
    </HandbookLayout>
  );
});

export default HandbookView;
