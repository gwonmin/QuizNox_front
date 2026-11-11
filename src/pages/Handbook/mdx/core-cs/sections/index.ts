import type { ComponentType } from "react";
import Networking from "./Networking";
import DataStorage from "./DataStorage";
import SecurityBasics from "./SecurityBasics";
import Distributed from "./Distributed";
import ReliabilityOperations from "./ReliabilityOperations";
import ContainersOrchestration from "./ContainersOrchestration";
import Cicd from "./Cicd";
import CostFinops from "./CostFinops";
import AiBasics from "./AiBasics";
import AgentEngineering from "./AgentEngineering";

/** core-cs 섹션 id → 섹션 다이어그램 */
export const CORE_CS_SECTION_DIAGRAMS: Record<string, ComponentType> = {
  networking: Networking,
  "data-storage": DataStorage,
  "security-basics": SecurityBasics,
  distributed: Distributed,
  "reliability-operations": ReliabilityOperations,
  "containers-orchestration": ContainersOrchestration,
  cicd: Cicd,
  "cost-finops": CostFinops,
  "ai-basics": AiBasics,
  "agent-engineering": AgentEngineering,
};
