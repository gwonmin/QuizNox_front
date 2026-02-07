# Multi-AZ vs Read Replica

**가용성** vs **읽기 확장** 목적의 복제 방식입니다.

## Multi-AZ

- **Standby** 한 대를 다른 AZ에 두고, 장애 시 자동 전환.
- 쓰기·읽기 모두 Primary만 사용(고가용성 목적).

## Read Replica

- **읽기 전용** 복제본을 추가해 읽기 부하 분산.
- 장애 시 자동 전환 없음(수동 프로모션 가능).

## 요약

| 구분 | Multi-AZ | Read Replica |
|------|----------|--------------|
| 목적 | 고가용성(자동 장애 전환) | 읽기 부하 분산 |
| 쓰기 | Primary만 | Primary만 |
