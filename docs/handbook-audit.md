# 핸드북 core-cs 문서 점검표

섹션 페이지 개편과 함께 core-cs 문서를 같은 기준으로 훑은 결과입니다. 본문은 고치지 않았습니다. 점검일 2026-10-05.

## 기준

- **요약**: 문서 첫머리에 `SectionSummary`가 있는가
- **그림·표**: `MermaidDiagram`이나 `KeyTable`(또는 마크다운 표)이 하나 이상 있는가
- **관련 링크**: 본문에서 다른 핸드북 문서로 가는 링크가 있는가
- **시점**: 날짜가 지나면 틀리는 수치(모델 스펙, 가격 등)에 기준 시점이 적혀 있는가
- **제목**: 문서 제목이 매니페스트와 같은가. MDX에 자체 H1이 없고 화면 제목을 매니페스트에서 가져오므로 모든 문서가 일치합니다

## 요약

- 문서 67개 모두 `SectionSummary`가 있고, 그림이나 표가 하나 이상 있습니다.
- 본문에 다른 핸드북 문서로 가는 링크가 있는 문서는 0개입니다. 문서 사이 이동은 섹션 페이지와 하단 이전·다음 링크에만 의존합니다. 우선 보강 대상입니다.
- 다이어그램 없이 표만 있는 문서는 15개입니다. 8번 Cost & FinOps 9개 문서는 모두 21~22줄이고 표 하나뿐이라, 다른 섹션에 비해 내용이 얇습니다.
- 기준 시점이 빠진 수치는 `llm-basics`에 있었습니다. 아래 "모델 정보 원칙"에 따라 정리했습니다.

## 모델 정보 원칙

모델 이름 · 가격 · 컨텍스트 크기 · 벤치마크 순위는 몇 달 만에 바뀌므로 문서 본문에 적지 않습니다.

- 본문에는 바뀌지 않는 내용만 씁니다. 모델 유형(대형 추론형, 소형 고속형, 오픈 가중치, 임베딩 등)과 고르는 기준이 여기에 해당합니다.
- 최신 값은 `src/components/handbook/ModelReferenceLinks.tsx`의 공식 문서 · 리더보드 링크로 보냅니다. 링크가 바뀌면 이 파일 한 곳만 고칩니다.
- 사례나 동향을 인용할 때는 기준 시점과 출처 링크를 함께 적습니다. 예: "OpenAI harness engineering (2026.02)".

## 다음에 손볼 순서

1. ~~`llm-basics`의 모델별 수치 정리~~ (2026-10-05 완료: 모델 비교표를 지우고 유형 · 선택 기준 · 링크로 바꿈)
2. Cost & FinOps 9개 문서를 보강합니다. 각 문서에 비용이 생기는 구조 그림 하나와 AWS 예시를 넣고, 구매 옵션 3개(온디맨드·예약·스팟)는 한 비교 문서로 합치는 것도 검토합니다.
3. 다이어그램이 없는 CI/CD 문서(`build`, `devsecops`, `artifact`, `deploy`, `gitops`)와 `backup`에 흐름 그림을 하나씩 넣습니다.
4. 각 문서 끝에 선행·후속 개념 링크 두세 개를 넣습니다. 예: `idempotency` → `retry-backoff`, `queue-vs-pubsub`.

## 문서별

| 섹션 | 문서 | 줄 수 | 요약 | 그림 | 표 | 관련 링크 | 메모 |
|---|---|---:|:-:|---:|---:|:-:|---|
| 1. Networking Fundamentals | `ip-cidr-subnetting` | 74 | O | 1 | 3 | X |  |
| 1. Networking Fundamentals | `routing-table` | 51 | O | 1 | 2 | X |  |
| 1. Networking Fundamentals | `nat` | 64 | O | 1 | 2 | X |  |
| 1. Networking Fundamentals | `dns-resolver-vs-authoritative` | 62 | O | 1 | 2 | X |  |
| 1. Networking Fundamentals | `tcp-vs-udp` | 67 | O | 2 | 1 | X |  |
| 1. Networking Fundamentals | `http-https-tls` | 83 | O | 1 | 3 | X |  |
| 1. Networking Fundamentals | `l4-vs-l7-lb` | 53 | O | 1 | 1 | X |  |
| 2. Data & Storage Fundamentals | `block-file-object` | 66 | O | 1 | 1 | X |  |
| 2. Data & Storage Fundamentals | `rdb` | 127 | O | 1 | 7 | X |  |
| 2. Data & Storage Fundamentals | `nosql` | 94 | O | 2 | 5 | X |  |
| 2. Data & Storage Fundamentals | `vector-db` | 89 | O | 2 | 5 | X |  |
| 2. Data & Storage Fundamentals | `timeseries-db` | 87 | O | 2 | 5 | X |  |
| 2. Data & Storage Fundamentals | `search` | 85 | O | 2 | 5 | X |  |
| 2. Data & Storage Fundamentals | `log-store` | 91 | O | 2 | 5 | X |  |
| 2. Data & Storage Fundamentals | `latency-throughput-iops` | 54 | O | 1 | 1 | X |  |
| 2. Data & Storage Fundamentals | `acid-transaction-lock` | 74 | O | 1 | 2 | X |  |
| 2. Data & Storage Fundamentals | `index-why-fast` | 42 | O | 1 | 1 | X |  |
| 2. Data & Storage Fundamentals | `caching` | 59 | O | 1 | 2 | X |  |
| 2. Data & Storage Fundamentals | `data-warehouse` | 530 | O | 6 | 13 | X |  |
| 3. Security Basics | `authn-vs-authz` | 48 | O | 1 | 1 | X |  |
| 3. Security Basics | `hash-vs-encryption` | 84 | O | 2 | 2 | X |  |
| 3. Security Basics | `least-privilege` | 52 | O | 1 | 2 | X |  |
| 3. Security Basics | `firewall` | 60 | O | 1 | 2 | X |  |
| 4. Distributed Systems Essentials | `stateless-stateful` | 179 | O | 3 | 5 | X |  |
| 4. Distributed Systems Essentials | `scale-up-scale-out` | 54 | O | 1 | 1 | X |  |
| 4. Distributed Systems Essentials | `queue-vs-pubsub` | 198 | O | 4 | 6 | X |  |
| 4. Distributed Systems Essentials | `event-driven-arch` | 104 | O | 1 | 4 | X |  |
| 4. Distributed Systems Essentials | `idempotency` | 71 | O | 1 | 3 | X |  |
| 4. Distributed Systems Essentials | `consistency-model` | 77 | O | 2 | 2 | X |  |
| 4. Distributed Systems Essentials | `cap-theorem` | 78 | O | 1 | 3 | X |  |
| 4. Distributed Systems Essentials | `distributed-transaction-lock` | 131 | O | 4 | 2 | X |  |
| 5. Reliability & Operations | `observability` | 65 | O | 1 | 2 | X |  |
| 5. Reliability & Operations | `retry-backoff` | 99 | O | 2 | 4 | X |  |
| 5. Reliability & Operations | `throttling-rate-limiting` | 77 | O | 2 | 2 | X |  |
| 5. Reliability & Operations | `backup` | 33 | O | 0 | 2 | X |  |
| 5. Reliability & Operations | `replication` | 52 | O | 1 | 3 | X |  |
| 5. Reliability & Operations | `rto-rpo` | 92 | O | 1 | 4 | X |  |
| 5. Reliability & Operations | `ha-design` | 216 | O | 3 | 6 | X |  |
| 5. Reliability & Operations | `dr-strategy` | 49 | O | 1 | 2 | X |  |
| 5. Reliability & Operations | `sli-slo` | 121 | O | 2 | 5 | X |  |
| 5. Reliability & Operations | `load-testing` | 229 | O | 2 | 6 | X |  |
| 5. Reliability & Operations | `aiops` | 242 | O | 3 | 6 | X |  |
| 6. Containers & Orchestration | `container-image` | 86 | O | 1 | 4 | X |  |
| 6. Containers & Orchestration | `container-registry` | 86 | O | 1 | 5 | X |  |
| 6. Containers & Orchestration | `container-runtime` | 140 | O | 2 | 4 | X |  |
| 6. Containers & Orchestration | `container-orchestration` | 135 | O | 4 | 5 | X |  |
| 6. Containers & Orchestration | `container-service-endpoint` | 81 | O | 1 | 5 | X |  |
| 7. CI/CD | `source-control` | 113 | O | 3 | 3 | X |  |
| 7. CI/CD | `build` | 40 | O | 0 | 2 | X |  |
| 7. CI/CD | `test` | 186 | O | 2 | 6 | X |  |
| 7. CI/CD | `devsecops` | 40 | O | 0 | 2 | X |  |
| 7. CI/CD | `artifact` | 39 | O | 0 | 2 | X |  |
| 7. CI/CD | `deploy` | 75 | O | 0 | 6 | X |  |
| 7. CI/CD | `gitops` | 46 | O | 0 | 3 | X |  |
| 7. CI/CD | `mlops` | 281 | O | 4 | 7 | X |  |
| 8. Cost & FinOps | `cost-compute` | 21 | O | 0 | 1 | X |  |
| 8. Cost & FinOps | `cost-storage` | 21 | O | 0 | 1 | X |  |
| 8. Cost & FinOps | `cost-traffic` | 21 | O | 0 | 1 | X |  |
| 8. Cost & FinOps | `cost-on-demand` | 21 | O | 0 | 1 | X |  |
| 8. Cost & FinOps | `cost-reserved` | 21 | O | 0 | 1 | X |  |
| 8. Cost & FinOps | `cost-spot` | 21 | O | 0 | 1 | X |  |
| 8. Cost & FinOps | `cost-visibility` | 21 | O | 0 | 1 | X |  |
| 8. Cost & FinOps | `cost-budgets` | 21 | O | 0 | 1 | X |  |
| 8. Cost & FinOps | `cost-optimization` | 22 | O | 0 | 1 | X |  |
| 9. AI 기초 | `llm-basics` | 213 | O | 2 | 7 | O | 모델 비교표 삭제, 유형 · 선택 기준 · 공식 링크로 대체 (2026-10-05) |
| 9. AI 기초 | `rag` | 260 | O | 2 | 7 | X | 모델 · 임베딩 버전명 제거 (2026-10-05) |
| 9. AI 기초 | `ai-agent` | 432 | O | 5 | 9 | O | Workflow 패턴 · Multi-Agent · LangGraph 구조는 `agent-orchestration`으로 이동, 10번 섹션 12개 문서 링크 표 (2026-10-05) |
| 10. Agent Engineering | `agent-harness` | 149 | O | 2 | 7 | O | 2026-10-05 신규 |
| 10. Agent Engineering | `context-engineering` | 137 | O | 1 | 7 | O | 2026-10-05 신규 |
| 10. Agent Engineering | `agent-state-memory` | 139 | O | 1 | 8 | O | 2026-10-05 신규 |
| 10. Agent Engineering | `agent-loop` | 166 | O | 2 | 6 | O | 2026-10-05 신규 |
| 10. Agent Engineering | `agent-tool-use` | 159 | O | 2 | 7 | O | 2026-10-05 신규 |
| 10. Agent Engineering | `agent-orchestration` | 176 | O | 3 | 8 | O | 2026-10-05 신규 (ai-agent에서 패턴 · LangGraph 이동) |
| 10. Agent Engineering | `model-routing` | 117 | O | 1 | 6 | O | 2026-10-05 신규. 모델명 대신 `ModelReferenceLinks` |
| 10. Agent Engineering | `agent-hitl` | 137 | O | 1 | 8 | O | 2026-10-05 신규 |
| 10. Agent Engineering | `agent-guardrails-authz` | 139 | O | 1 | 9 | O | 2026-10-05 신규 |
| 10. Agent Engineering | `agent-eval` | 137 | O | 2 | 7 | O | 2026-10-05 신규 |
| 10. Agent Engineering | `agent-observability` | 127 | O | 1 | 7 | O | 2026-10-05 신규. OTel GenAI semconv는 Development 상태 (2026-10 기준) |
| 10. Agent Engineering | `agent-reliability` | 139 | O | 2 | 7 | O | 2026-10-05 신규 |
