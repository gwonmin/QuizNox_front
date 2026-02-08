# Multi-AZ vs Read Replica

**가용성** vs **읽기 확장** 목적의 복제 방식입니다. 자동 장애 전환이 목적이면 Multi-AZ, 읽기 부하 분산이 목적이면 Read Replica를 선택합니다.

---

## 특징

| 구분 | Multi-AZ | Read Replica |
|------|----------|--------------|
| **목적** | 고가용성(자동 장애 전환) | 읽기 부하 분산 |
| **쓰기** | Primary만 사용 | Primary만 사용 |
| **읽기** | Primary만(Standby는 대기) | Primary + Replica로 분산 가능 |
| **장애 전환** | 자동 전환 | 없음(수동 프로모션 가능) |
| **구성** | Standby 한 대 다른 AZ | 읽기 전용 복제본 추가 |

---

## 시나리오

| 조건 | 선택 |
|------|------|
| "고가용성"·자동 장애 전환 필요 | Multi-AZ |
| 읽기 부하 분산·쓰기는 단일 노드 | Read Replica |
| **읽기 부하 예측 어렵고 자동 확장** | **Aurora Multi-AZ + Aurora Replicas + Aurora Auto Scaling** |
| 둘 다 필요 | Multi-AZ + Read Replica(Replica는 Primary/Standby 중에서 복제) |
| 연결 풀·장애 전환 시 끊김 최소 | RDS Proxy |

---

## 기출빈출

| 시나리오 | 접근 |
|----------|------|
| 고가용성·자동 장애 전환 | **Multi-AZ**; Standby 대기. |
| 읽기 부하 분산 | **Read Replica**; Aurora는 Replica 수 확장 용이. |
| 읽기 부하 변동·자동 확장 | **Aurora Auto Scaling**으로 Replica 수 자동 증감. |
| 연결 풀·장애 전환 시 끊김 최소 | **RDS Proxy** + Secrets Manager. |

---

## 요약

| 항목 | 설명 |
|------|------|
| Multi-AZ | Standby 대기, 장애 시 자동 전환 |
| Read Replica | 읽기 전용 복제본, 부하 분산 |
| 조건 | "장애 전환" → Multi-AZ / "읽기 분산" → Read Replica |
