# RDS vs Aurora

**관계형 DB** 서비스 중 두 가지 옵션입니다.

## RDS

- MySQL, PostgreSQL, MariaDB 등 **엔진 선택** 후 관리형 DB.
- Multi-AZ, Read Replica로 가용성·읽기 확장.

## Aurora

- MySQL·PostgreSQL **호환** 엔진, 스토리지 자동 확장·복제.
- 읽기 복제본 수 확장 용이, 글로벌 DB 등 고급 기능.

## 요약

| 구분 | RDS | Aurora |
|------|-----|--------|
| 확장·복제 | 엔진별 지원 | 스토리지 자동 확장, 읽기 복제 유연 |
| 비용 | 상대적으로 낮음 | 상대적으로 높음 |
