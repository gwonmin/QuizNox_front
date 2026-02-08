# RDS vs Aurora

**관계형 DB** 서비스 중 두 가지 옵션입니다. 표준 엔진·비용 우선이면 RDS, 자동 확장·고급 복제·글로벌이면 Aurora를 고려합니다.

---

## 특징

| 구분 | RDS | Aurora |
|------|-----|--------|
| **엔진** | MySQL, PostgreSQL, MariaDB 등 선택 | MySQL·PostgreSQL 호환 |
| **스토리지** | 엔진별 지원 | 자동 확장·6 copy 3 AZ 복제 |
| **읽기 확장** | Read Replica(엔진별 제한) | 읽기 복제본 수 확장 용이 |
| **기능** | Multi-AZ, Read Replica | 글로벌 DB, 서버리스 등 |
| **비용** | 상대적으로 낮음 | 상대적으로 높음 |

---

## 시나리오

| 조건 | 선택 |
|------|------|
| 표준 RDB·비용 우선 | RDS |
| 읽기 부하 크고 복제본 다수 필요 | Aurora |
| **쓰기 지연·스토리지 병목** | RDS **Provisioned IOPS** |
| **가끔만 사용·비용 최소** | 스냅샷 후 종료, 필요 시 복원 |
| 글로벌 읽기·재해 복구 | Aurora Global Database |
| "고가용성" + 관계형 | RDS Multi-AZ 또는 Aurora |

---

## 기출빈출

| 시나리오 | 접근 |
|----------|------|
| 쓰기 지연·스토리지 병목 | **RDS Provisioned IOPS**(io1/io2). |
| 가끔만 사용·비용 최소 | 스냅샷 생성 후 인스턴스 종료, 필요 시 복원. |
| 읽기 확장·글로벌 | **Aurora**·Aurora Global Database. |

---

## 요약

| 항목 | 설명 |
|------|------|
| RDS | 관리형 관계형 DB, 엔진별 기능 |
| Aurora | MySQL/PostgreSQL 호환, 자동 확장·복제·글로벌 |
| 조건 | "비용 우선" → RDS / "읽기 확장·글로벌" → Aurora |
