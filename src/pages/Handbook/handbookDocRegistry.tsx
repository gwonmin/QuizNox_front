import type { ComponentType } from "react";
import AifAiGovernance from "./mdx/aif/AifAiGovernance";
import AifAiSecurity from "./mdx/aif/AifAiSecurity";
import AifAwsAiServices from "./mdx/aif/AifAwsAiServices";
import AifBedrockFeatures from "./mdx/aif/AifBedrockFeatures";
import AifCustomizationLadder from "./mdx/aif/AifCustomizationLadder";
import AifExamStrategy from "./mdx/aif/AifExamStrategy";
import AifExplainabilityTools from "./mdx/aif/AifExplainabilityTools";
import AifFmSelection from "./mdx/aif/AifFmSelection";
import AifGenaiConcepts from "./mdx/aif/AifGenaiConcepts";
import AifGenaiMetrics from "./mdx/aif/AifGenaiMetrics";
import AifInferenceParams from "./mdx/aif/AifInferenceParams";
import AifLearningTypes from "./mdx/aif/AifLearningTypes";
import AifMlLifecycle from "./mdx/aif/AifMlLifecycle";
import AifMlMetrics from "./mdx/aif/AifMlMetrics";
import AifOverfittingBias from "./mdx/aif/AifOverfittingBias";
import AifPromptEngineering from "./mdx/aif/AifPromptEngineering";
import AifRagKnowledgeBases from "./mdx/aif/AifRagKnowledgeBases";
import AifResponsibleAiDimensions from "./mdx/aif/AifResponsibleAiDimensions";
import Alarm from "./mdx/aws-common/Alarm";
import AsgBasics from "./mdx/aws-common/AsgBasics";
import BedrockAgent from "./mdx/aws-common/BedrockAgent";
import BedrockAgentCore from "./mdx/aws-common/BedrockAgentCore";
import BedrockApis from "./mdx/aws-common/BedrockApis";
import BedrockOverview from "./mdx/aws-common/BedrockOverview";
import CloudtrailVsConfig from "./mdx/aws-common/CloudtrailVsConfig";
import CloudwatchDashboard from "./mdx/aws-common/CloudwatchDashboard";
import CloudwatchMetricsLogs from "./mdx/aws-common/CloudwatchMetricsLogs";
import CrossAccount from "./mdx/aws-common/CrossAccount";
import DynamodbBasics from "./mdx/aws-common/DynamodbBasics";
import EbsBasics from "./mdx/aws-common/EbsBasics";
import Ec2Overview from "./mdx/aws-common/Ec2Overview";
import EcsBasics from "./mdx/aws-common/EcsBasics";
import EfsBasics from "./mdx/aws-common/EfsBasics";
import EksBasics from "./mdx/aws-common/EksBasics";
import ElastiCacheBasics from "./mdx/aws-common/ElastiCacheBasics";
import ElasticIp from "./mdx/aws-common/ElasticIp";
import ElbTypes from "./mdx/aws-common/ElbTypes";
import ExplicitDeny from "./mdx/aws-common/ExplicitDeny";
import HealthCheck from "./mdx/aws-common/HealthCheck";
import IamUserVsRole from "./mdx/aws-common/IamUserVsRole";
import IdentityVsResourcePolicy from "./mdx/aws-common/IdentityVsResourcePolicy";
import IgwVsNat from "./mdx/aws-common/IgwVsNat";
import KmsBasics from "./mdx/aws-common/KmsBasics";
import LambdaBasics from "./mdx/aws-common/LambdaBasics";
import Mfa from "./mdx/aws-common/Mfa";
import Nacl from "./mdx/aws-common/Nacl";
import PolicyEvaluation from "./mdx/aws-common/PolicyEvaluation";
import PublicPrivateSubnet from "./mdx/aws-common/PublicPrivateSubnet";
import RdsBasics from "./mdx/aws-common/RdsBasics";
import S3Overview from "./mdx/aws-common/S3Overview";
import ScalingPolicy from "./mdx/aws-common/ScalingPolicy";
import SecretsManagerBasics from "./mdx/aws-common/SecretsManagerBasics";
import SecurityGroup from "./mdx/aws-common/SecurityGroup";
import SsmParameterStore from "./mdx/aws-common/SsmParameterStore";
import StickySession from "./mdx/aws-common/StickySession";
import StsAssumerole from "./mdx/aws-common/StsAssumerole";
import TargetGroup from "./mdx/aws-common/TargetGroup";
import VpcEndpoint from "./mdx/aws-common/VpcEndpoint";
import VpcRouteTable from "./mdx/aws-common/VpcRouteTable";
import CkaCertRenewal from "./mdx/cka/CkaCertRenewal";
import CkaConfigmapSecret from "./mdx/cka/CkaConfigmapSecret";
import CkaControlPlane from "./mdx/cka/CkaControlPlane";
import CkaCoredns from "./mdx/cka/CkaCoredns";
import CkaCrdOperator from "./mdx/cka/CkaCrdOperator";
import CkaDeploymentRollout from "./mdx/cka/CkaDeploymentRollout";
import CkaEtcdBackup from "./mdx/cka/CkaEtcdBackup";
import CkaExamWorkflow from "./mdx/cka/CkaExamWorkflow";
import CkaGatewayApi from "./mdx/cka/CkaGatewayApi";
import CkaHaControlPlane from "./mdx/cka/CkaHaControlPlane";
import CkaHeadlessStatefulset from "./mdx/cka/CkaHeadlessStatefulset";
import CkaHelm from "./mdx/cka/CkaHelm";
import CkaIngress from "./mdx/cka/CkaIngress";
import CkaKubeadmInstall from "./mdx/cka/CkaKubeadmInstall";
import CkaKubeadmUpgrade from "./mdx/cka/CkaKubeadmUpgrade";
import CkaKustomize from "./mdx/cka/CkaKustomize";
import CkaNetworkPolicy from "./mdx/cka/CkaNetworkPolicy";
import CkaNetworkTroubleshooting from "./mdx/cka/CkaNetworkTroubleshooting";
import CkaNodeNotready from "./mdx/cka/CkaNodeNotready";
import CkaNodePrep from "./mdx/cka/CkaNodePrep";
import CkaPodFailure from "./mdx/cka/CkaPodFailure";
import CkaPvPvc from "./mdx/cka/CkaPvPvc";
import CkaRbac from "./mdx/cka/CkaRbac";
import CkaResourceUsage from "./mdx/cka/CkaResourceUsage";
import CkaScheduling from "./mdx/cka/CkaScheduling";
import CkaSelfHealing from "./mdx/cka/CkaSelfHealing";
import CkaServiceTypes from "./mdx/cka/CkaServiceTypes";
import CkaStorageclass from "./mdx/cka/CkaStorageclass";
import AcidTransactionLock from "./mdx/core-cs/AcidTransactionLock";
import AgentEval from "./mdx/core-cs/AgentEval";
import AgentGuardrailsAuthz from "./mdx/core-cs/AgentGuardrailsAuthz";
import AgentHarness from "./mdx/core-cs/AgentHarness";
import AgentHitl from "./mdx/core-cs/AgentHitl";
import AgentLoop from "./mdx/core-cs/AgentLoop";
import AgentObservability from "./mdx/core-cs/AgentObservability";
import AgentOrchestration from "./mdx/core-cs/AgentOrchestration";
import AgentReliability from "./mdx/core-cs/AgentReliability";
import AgentStateMemory from "./mdx/core-cs/AgentStateMemory";
import AgentToolUse from "./mdx/core-cs/AgentToolUse";
import AiAgent from "./mdx/core-cs/AiAgent";
import Aiops from "./mdx/core-cs/Aiops";
import Artifact from "./mdx/core-cs/Artifact";
import AuthnVsAuthz from "./mdx/core-cs/AuthnVsAuthz";
import Backup from "./mdx/core-cs/Backup";
import BlockFileObject from "./mdx/core-cs/BlockFileObject";
import Build from "./mdx/core-cs/Build";
import Caching from "./mdx/core-cs/Caching";
import CapTheorem from "./mdx/core-cs/CapTheorem";
import ConsistencyModel from "./mdx/core-cs/ConsistencyModel";
import ContainerImage from "./mdx/core-cs/ContainerImage";
import ContainerOrchestration from "./mdx/core-cs/ContainerOrchestration";
import ContainerRegistry from "./mdx/core-cs/ContainerRegistry";
import ContainerRuntime from "./mdx/core-cs/ContainerRuntime";
import ContainerServiceEndpoint from "./mdx/core-cs/ContainerServiceEndpoint";
import ContextEngineering from "./mdx/core-cs/ContextEngineering";
import CostBudgets from "./mdx/core-cs/CostBudgets";
import CostCompute from "./mdx/core-cs/CostCompute";
import CostOnDemand from "./mdx/core-cs/CostOnDemand";
import CostOptimization from "./mdx/core-cs/CostOptimization";
import CostReserved from "./mdx/core-cs/CostReserved";
import CostSpot from "./mdx/core-cs/CostSpot";
import CostStorage from "./mdx/core-cs/CostStorage";
import CostTraffic from "./mdx/core-cs/CostTraffic";
import CostVisibility from "./mdx/core-cs/CostVisibility";
import DataWarehouse from "./mdx/core-cs/DataWarehouse";
import Deploy from "./mdx/core-cs/Deploy";
import DevSecOps from "./mdx/core-cs/DevSecOps";
import DistributedTransactionLock from "./mdx/core-cs/DistributedTransactionLock";
import DnsResolverVsAuthoritative from "./mdx/core-cs/DnsResolverVsAuthoritative";
import DrStrategy from "./mdx/core-cs/DrStrategy";
import EventDrivenArch from "./mdx/core-cs/EventDrivenArch";
import Firewall from "./mdx/core-cs/Firewall";
import GitOps from "./mdx/core-cs/GitOps";
import HaDesign from "./mdx/core-cs/HaDesign";
import HashVsEncryption from "./mdx/core-cs/HashVsEncryption";
import HttpHttpsTls from "./mdx/core-cs/HttpHttpsTls";
import Idempotency from "./mdx/core-cs/Idempotency";
import IndexWhyFast from "./mdx/core-cs/IndexWhyFast";
import IpCidrSubnetting from "./mdx/core-cs/IpCidrSubnetting";
import L4VsL7Lb from "./mdx/core-cs/L4VsL7Lb";
import LatencyThroughputIops from "./mdx/core-cs/LatencyThroughputIops";
import LeastPrivilege from "./mdx/core-cs/LeastPrivilege";
import LlmBasics from "./mdx/core-cs/LlmBasics";
import LoadTesting from "./mdx/core-cs/LoadTesting";
import LogStore from "./mdx/core-cs/LogStore";
import Mlops from "./mdx/core-cs/Mlops";
import ModelRouting from "./mdx/core-cs/ModelRouting";
import Nat from "./mdx/core-cs/Nat";
import NoSql from "./mdx/core-cs/NoSql";
import Observability from "./mdx/core-cs/Observability";
import QueueVsPubsub from "./mdx/core-cs/QueueVsPubsub";
import Rag from "./mdx/core-cs/Rag";
import Rdb from "./mdx/core-cs/Rdb";
import Replication from "./mdx/core-cs/Replication";
import RetryBackoff from "./mdx/core-cs/RetryBackoff";
import RoutingTable from "./mdx/core-cs/RoutingTable";
import RtoRpo from "./mdx/core-cs/RtoRpo";
import ScaleUpScaleOut from "./mdx/core-cs/ScaleUpScaleOut";
import Search from "./mdx/core-cs/Search";
import SliSlo from "./mdx/core-cs/SliSlo";
import SourceControl from "./mdx/core-cs/SourceControl";
import StatelessStateful from "./mdx/core-cs/StatelessStateful";
import TcpVsUdp from "./mdx/core-cs/TcpVsUdp";
import Test from "./mdx/core-cs/Test";
import ThrottlingRateLimiting from "./mdx/core-cs/ThrottlingRateLimiting";
import TimeseriesDb from "./mdx/core-cs/TimeseriesDb";
import VectorDb from "./mdx/core-cs/VectorDb";
import DvaAuthorizer from "./mdx/dva/DvaAuthorizer";
import DvaCodebuild from "./mdx/dva/DvaCodebuild";
import DvaCodepipeline from "./mdx/dva/DvaCodepipeline";
import DvaColdStart from "./mdx/dva/DvaColdStart";
import DvaConditionalUpdate from "./mdx/dva/DvaConditionalUpdate";
import DvaDlqDestinations from "./mdx/dva/DvaDlqDestinations";
import DvaEventbridge from "./mdx/dva/DvaEventbridge";
import DvaGsiLsi from "./mdx/dva/DvaGsiLsi";
import DvaLambdaConcurrency from "./mdx/dva/DvaLambdaConcurrency";
import DvaPartitionKeyDesign from "./mdx/dva/DvaPartitionKeyDesign";
import DvaRestVsHttpApi from "./mdx/dva/DvaRestVsHttpApi";
import DvaSam from "./mdx/dva/DvaSam";
import DvaSnsFanout from "./mdx/dva/DvaSnsFanout";
import DvaSqsVisibilityTimeout from "./mdx/dva/DvaSqsVisibilityTimeout";
import DvaStreams from "./mdx/dva/DvaStreams";
import DvaThrottling from "./mdx/dva/DvaThrottling";
import SaaActiveActive from "./mdx/saa/SaaActiveActive";
import SaaBackup from "./mdx/saa/SaaBackup";
import SaaCloudfrontIntegration from "./mdx/saa/SaaCloudfrontIntegration";
import SaaComputeTradeoff from "./mdx/saa/SaaComputeTradeoff";
import SaaCostOptimization from "./mdx/saa/SaaCostOptimization";
import SaaDirectConnectVpn from "./mdx/saa/SaaDirectConnectVpn";
import SaaDynamodbUseCase from "./mdx/saa/SaaDynamodbUseCase";
import SaaEbsVsEfsFsx from "./mdx/saa/SaaEbsVsEfsFsx";
import SaaEc2VsLambdaEcsEks from "./mdx/saa/SaaEc2VsLambdaEcsEks";
import SaaElasticacheCaching from "./mdx/saa/SaaElasticacheCaching";
import SaaElbAsgHa from "./mdx/saa/SaaElbAsgHa";
import SaaMultiazVsReadReplica from "./mdx/saa/SaaMultiazVsReadReplica";
import SaaPilotLight from "./mdx/saa/SaaPilotLight";
import SaaRdsVsAurora from "./mdx/saa/SaaRdsVsAurora";
import SaaRoute53Routing from "./mdx/saa/SaaRoute53Routing";
import SaaS3StaticHosting from "./mdx/saa/SaaS3StaticHosting";
import SaaSecuritySaa from "./mdx/saa/SaaSecuritySaa";
import SaaServerlessPattern from "./mdx/saa/SaaServerlessPattern";
import SaaSqsSnsPattern from "./mdx/saa/SaaSqsSnsPattern";
import SaaTransitGateway from "./mdx/saa/SaaTransitGateway";
import SaaVpcPeering from "./mdx/saa/SaaVpcPeering";
import SaaWafBasics from "./mdx/saa/SaaWafBasics";
import SaaWarmStandby from "./mdx/saa/SaaWarmStandby";
import SoaAmiManagement from "./mdx/soa/SoaAmiManagement";
import SoaAwsConfig from "./mdx/soa/SoaAwsConfig";
import SoaCompositeAlarm from "./mdx/soa/SoaCompositeAlarm";
import SoaCostExplorerBudgets from "./mdx/soa/SoaCostExplorerBudgets";
import SoaDnsIssues from "./mdx/soa/SoaDnsIssues";
import SoaEbsSnapshot from "./mdx/soa/SoaEbsSnapshot";
import SoaFlowLogs from "./mdx/soa/SoaFlowLogs";
import SoaGuardduty from "./mdx/soa/SoaGuardduty";
import SoaLaunchTemplate from "./mdx/soa/SoaLaunchTemplate";
import SoaLogsInsights from "./mdx/soa/SoaLogsInsights";
import SoaMetricFilter from "./mdx/soa/SoaMetricFilter";
import SoaPatchManager from "./mdx/soa/SoaPatchManager";
import SoaRunCommand from "./mdx/soa/SoaRunCommand";
import SoaSessionManager from "./mdx/soa/SoaSessionManager";
import SoaSgNaclAnalysis from "./mdx/soa/SoaSgNaclAnalysis";

/** layerId/slug → handbook document component */
export const HANDBOOK_DOC_REGISTRY: Record<string, ComponentType> = {
  "core-cs/observability": Observability,
  "core-cs/retry-backoff": RetryBackoff,
  "core-cs/throttling-rate-limiting": ThrottlingRateLimiting,
  "core-cs/backup": Backup,
  "core-cs/replication": Replication,
  "core-cs/dr-strategy": DrStrategy,
  "core-cs/source-control": SourceControl,
  "core-cs/build": Build,
  "core-cs/test": Test,
  "core-cs/devsecops": DevSecOps,
  "core-cs/artifact": Artifact,
  "core-cs/deploy": Deploy,
  "core-cs/gitops": GitOps,
  "core-cs/mlops": Mlops,
  "core-cs/rto-rpo": RtoRpo,
  "core-cs/ha-design": HaDesign,
  "core-cs/sli-slo": SliSlo,
  "core-cs/load-testing": LoadTesting,
  "core-cs/aiops": Aiops,
  "core-cs/ip-cidr-subnetting": IpCidrSubnetting,
  "core-cs/routing-table": RoutingTable,
  "core-cs/nat": Nat,
  "core-cs/dns-resolver-vs-authoritative": DnsResolverVsAuthoritative,
  "core-cs/tcp-vs-udp": TcpVsUdp,
  "core-cs/http-https-tls": HttpHttpsTls,
  "core-cs/l4-vs-l7-lb": L4VsL7Lb,
  "core-cs/block-file-object": BlockFileObject,
  "core-cs/rdb": Rdb,
  "core-cs/nosql": NoSql,
  "core-cs/vector-db": VectorDb,
  "core-cs/timeseries-db": TimeseriesDb,
  "core-cs/search": Search,
  "core-cs/log-store": LogStore,
  "core-cs/latency-throughput-iops": LatencyThroughputIops,
  "core-cs/index-why-fast": IndexWhyFast,
  "core-cs/caching": Caching,
  "core-cs/data-warehouse": DataWarehouse,
  "core-cs/scale-up-scale-out": ScaleUpScaleOut,
  "core-cs/stateless-stateful": StatelessStateful,
  "core-cs/idempotency": Idempotency,
  "core-cs/cap-theorem": CapTheorem,
  "core-cs/consistency-model": ConsistencyModel,
  "core-cs/event-driven-arch": EventDrivenArch,
  "core-cs/container-image": ContainerImage,
  "core-cs/container-registry": ContainerRegistry,
  "core-cs/container-runtime": ContainerRuntime,
  "core-cs/container-service-endpoint": ContainerServiceEndpoint,
  "core-cs/container-orchestration": ContainerOrchestration,
  "core-cs/distributed-transaction-lock": DistributedTransactionLock,
  "core-cs/hash-vs-encryption": HashVsEncryption,
  "core-cs/least-privilege": LeastPrivilege,
  "core-cs/firewall": Firewall,
  "core-cs/queue-vs-pubsub": QueueVsPubsub,
  "core-cs/acid-transaction-lock": AcidTransactionLock,
  "core-cs/authn-vs-authz": AuthnVsAuthz,
  "core-cs/cost-compute": CostCompute,
  "core-cs/cost-storage": CostStorage,
  "core-cs/cost-traffic": CostTraffic,
  "core-cs/cost-on-demand": CostOnDemand,
  "core-cs/cost-reserved": CostReserved,
  "core-cs/cost-spot": CostSpot,
  "core-cs/cost-visibility": CostVisibility,
  "core-cs/cost-budgets": CostBudgets,
  "core-cs/cost-optimization": CostOptimization,
  "core-cs/llm-basics": LlmBasics,
  "core-cs/ai-agent": AiAgent,
  "core-cs/rag": Rag,
  "core-cs/agent-harness": AgentHarness,
  "core-cs/context-engineering": ContextEngineering,
  "core-cs/agent-state-memory": AgentStateMemory,
  "core-cs/agent-loop": AgentLoop,
  "core-cs/agent-tool-use": AgentToolUse,
  "core-cs/agent-orchestration": AgentOrchestration,
  "core-cs/model-routing": ModelRouting,
  "core-cs/agent-hitl": AgentHitl,
  "core-cs/agent-guardrails-authz": AgentGuardrailsAuthz,
  "core-cs/agent-eval": AgentEval,
  "core-cs/agent-observability": AgentObservability,
  "core-cs/agent-reliability": AgentReliability,
  "aws-common/public-private-subnet": PublicPrivateSubnet,
  "aws-common/vpc-route-table": VpcRouteTable,
  "aws-common/igw-vs-nat": IgwVsNat,
  "aws-common/elastic-ip": ElasticIp,
  "aws-common/security-group": SecurityGroup,
  "aws-common/nacl": Nacl,
  "aws-common/vpc-endpoint": VpcEndpoint,
  "aws-common/iam-user-vs-role": IamUserVsRole,
  "aws-common/policy-evaluation": PolicyEvaluation,
  "aws-common/identity-vs-resource-policy": IdentityVsResourcePolicy,
  "aws-common/explicit-deny": ExplicitDeny,
  "aws-common/sts-assumerole": StsAssumerole,
  "aws-common/cross-account": CrossAccount,
  "aws-common/mfa": Mfa,
  "aws-common/s3-overview": S3Overview,
  "aws-common/ebs-basics": EbsBasics,
  "aws-common/efs-basics": EfsBasics,
  "aws-common/rds-basics": RdsBasics,
  "aws-common/dynamodb-basics": DynamodbBasics,
  "aws-common/elasticache-basics": ElastiCacheBasics,
  "aws-common/ec2-overview": Ec2Overview,
  "aws-common/lambda-basics": LambdaBasics,
  "aws-common/ecs-basics": EcsBasics,
  "aws-common/eks-basics": EksBasics,
  "aws-common/elb-types": ElbTypes,
  "aws-common/target-group": TargetGroup,
  "aws-common/health-check": HealthCheck,
  "aws-common/sticky-session": StickySession,
  "aws-common/asg-basics": AsgBasics,
  "aws-common/scaling-policy": ScalingPolicy,
  "aws-common/cloudwatch-metrics-logs": CloudwatchMetricsLogs,
  "aws-common/cloudwatch-dashboard": CloudwatchDashboard,
  "aws-common/alarm": Alarm,
  "aws-common/cloudtrail-vs-config": CloudtrailVsConfig,
  "aws-common/kms-basics": KmsBasics,
  "aws-common/secrets-manager-basics": SecretsManagerBasics,
  "aws-common/ssm-parameter-store": SsmParameterStore,
  "aws-common/bedrock-overview": BedrockOverview,
  "aws-common/bedrock-apis": BedrockApis,
  "aws-common/bedrock-agent": BedrockAgent,
  "aws-common/bedrock-agentcore": BedrockAgentCore,
  "saa/vpc-peering": SaaVpcPeering,
  "saa/transit-gateway": SaaTransitGateway,
  "saa/direct-connect-vpn": SaaDirectConnectVpn,
  "saa/route53-routing": SaaRoute53Routing,
  "saa/cloudfront-integration": SaaCloudfrontIntegration,
  "saa/ebs-vs-efs-fsx": SaaEbsVsEfsFsx,
  "saa/s3-static-hosting": SaaS3StaticHosting,
  "saa/ec2-vs-lambda-ecs-eks": SaaEc2VsLambdaEcsEks,
  "saa/compute-tradeoff": SaaComputeTradeoff,
  "saa/elb-asg-ha": SaaElbAsgHa,
  "saa/rds-vs-aurora": SaaRdsVsAurora,
  "saa/multiaz-vs-read-replica": SaaMultiazVsReadReplica,
  "saa/dynamodb-use-case": SaaDynamodbUseCase,
  "saa/elasticache-caching": SaaElasticacheCaching,
  "saa/security-saa": SaaSecuritySaa,
  "saa/waf-basics": SaaWafBasics,
  "saa/sqs-sns-pattern": SaaSqsSnsPattern,
  "saa/backup": SaaBackup,
  "saa/pilot-light": SaaPilotLight,
  "saa/warm-standby": SaaWarmStandby,
  "saa/active-active": SaaActiveActive,
  "saa/cost-optimization": SaaCostOptimization,
  "saa/serverless-pattern": SaaServerlessPattern,
  "dva/lambda-concurrency": DvaLambdaConcurrency,
  "dva/cold-start": DvaColdStart,
  "dva/dlq-destinations": DvaDlqDestinations,
  "dva/rest-vs-http-api": DvaRestVsHttpApi,
  "dva/authorizer": DvaAuthorizer,
  "dva/throttling": DvaThrottling,
  "dva/partition-key-design": DvaPartitionKeyDesign,
  "dva/gsi-lsi": DvaGsiLsi,
  "dva/conditional-update": DvaConditionalUpdate,
  "dva/streams": DvaStreams,
  "dva/sqs-visibility-timeout": DvaSqsVisibilityTimeout,
  "dva/sns-fanout": DvaSnsFanout,
  "dva/eventbridge": DvaEventbridge,
  "dva/codepipeline": DvaCodepipeline,
  "dva/codebuild": DvaCodebuild,
  "dva/sam": DvaSam,
  "soa/metric-filter": SoaMetricFilter,
  "soa/composite-alarm": SoaCompositeAlarm,
  "soa/logs-insights": SoaLogsInsights,
  "soa/session-manager": SoaSessionManager,
  "soa/patch-manager": SoaPatchManager,
  "soa/run-command": SoaRunCommand,
  "soa/launch-template": SoaLaunchTemplate,
  "soa/ami-management": SoaAmiManagement,
  "soa/ebs-snapshot": SoaEbsSnapshot,
  "soa/flow-logs": SoaFlowLogs,
  "soa/dns-issues": SoaDnsIssues,
  "soa/sg-nacl-analysis": SoaSgNaclAnalysis,
  "soa/aws-config": SoaAwsConfig,
  "soa/guardduty": SoaGuardduty,
  "soa/cost-explorer-budgets": SoaCostExplorerBudgets,
  "cka/exam-workflow": CkaExamWorkflow,
  "cka/node-prep": CkaNodePrep,
  "cka/ha-control-plane": CkaHaControlPlane,
  "cka/cert-renewal": CkaCertRenewal,
  "cka/self-healing": CkaSelfHealing,
  "cka/kustomize": CkaKustomize,
  "cka/helm": CkaHelm,
  "cka/gateway-api": CkaGatewayApi,
  "cka/crd-operator": CkaCrdOperator,
  "cka/resource-usage": CkaResourceUsage,
  "cka/headless-statefulset": CkaHeadlessStatefulset,
  "cka/rbac": CkaRbac,
  "cka/kubeadm-install": CkaKubeadmInstall,
  "cka/kubeadm-upgrade": CkaKubeadmUpgrade,
  "cka/etcd-backup": CkaEtcdBackup,
  "cka/deployment-rollout": CkaDeploymentRollout,
  "cka/configmap-secret": CkaConfigmapSecret,
  "cka/scheduling": CkaScheduling,
  "cka/service-types": CkaServiceTypes,
  "cka/ingress": CkaIngress,
  "cka/network-policy": CkaNetworkPolicy,
  "cka/coredns": CkaCoredns,
  "cka/pv-pvc": CkaPvPvc,
  "cka/storageclass": CkaStorageclass,
  "cka/pod-failure": CkaPodFailure,
  "cka/node-notready": CkaNodeNotready,
  "cka/control-plane": CkaControlPlane,
  "cka/network-troubleshooting": CkaNetworkTroubleshooting,
  "aif/exam-strategy": AifExamStrategy,
  "aif/learning-types": AifLearningTypes,
  "aif/ml-lifecycle": AifMlLifecycle,
  "aif/ml-metrics": AifMlMetrics,
  "aif/overfitting-bias": AifOverfittingBias,
  "aif/genai-concepts": AifGenaiConcepts,
  "aif/inference-params": AifInferenceParams,
  "aif/fm-selection": AifFmSelection,
  "aif/prompt-engineering": AifPromptEngineering,
  "aif/customization-ladder": AifCustomizationLadder,
  "aif/rag-knowledge-bases": AifRagKnowledgeBases,
  "aif/genai-metrics": AifGenaiMetrics,
  "aif/bedrock-features": AifBedrockFeatures,
  "aif/responsible-ai-dimensions": AifResponsibleAiDimensions,
  "aif/explainability-tools": AifExplainabilityTools,
  "aif/ai-security": AifAiSecurity,
  "aif/ai-governance": AifAiGovernance,
  "aif/aws-ai-services": AifAwsAiServices,
};

export function getHandbookDocComponent(layerId: string, slug: string): ComponentType | null {
  return HANDBOOK_DOC_REGISTRY[`${layerId}/${slug}`] ?? null;
}

export function hasHandbookDoc(layerId: string, slug: string): boolean {
  return `${layerId}/${slug}` in HANDBOOK_DOC_REGISTRY;
}
