import type { ComponentType } from "react";
import NetworkingMdx from "./Networking.mdx";
import DataStorageMdx from "./DataStorage.mdx";
import SecurityBasicsMdx from "./SecurityBasics.mdx";
import DistributedMdx from "./Distributed.mdx";
import ReliabilityOperationsMdx from "./ReliabilityOperations.mdx";
import ContainersOrchestrationMdx from "./ContainersOrchestration.mdx";
import CicdMdx from "./Cicd.mdx";
import CostFinopsMdx from "./CostFinops.mdx";
import AiBasicsMdx from "./AiBasics.mdx";
import AgentEngineeringMdx from "./AgentEngineering.mdx";

/** core-cs 섹션 id → 섹션 다이어그램 MDX */
export const CORE_CS_SECTION_DIAGRAMS: Record<string, ComponentType> = {
  networking: NetworkingMdx,
  "data-storage": DataStorageMdx,
  "security-basics": SecurityBasicsMdx,
  distributed: DistributedMdx,
  "reliability-operations": ReliabilityOperationsMdx,
  "containers-orchestration": ContainersOrchestrationMdx,
  cicd: CicdMdx,
  "cost-finops": CostFinopsMdx,
  "ai-basics": AiBasicsMdx,
  "agent-engineering": AgentEngineeringMdx,
};
