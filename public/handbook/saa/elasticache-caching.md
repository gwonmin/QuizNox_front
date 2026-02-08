# ElastiCache로 DB 성능 향상

**RDS·DynamoDB 앞단에 ElastiCache(Redis·Memcached)** 를 두어 **캐싱**으로 읽기 부하를 줄이고 응답 지연을 낮추는 패턴입니다. 자주 조회하는 데이터를 캐시에 두면 DB 부하·비용을 줄일 수 있습니다.

---

## 특징

- **캐시 계층**: 앱 → ElastiCache → (캐시 미스 시) RDS 또는 DynamoDB
- **Read-through**: 캐시 미스 시 DB에서 읽어 캐시에 채운 뒤 반환
- **캐시 무효화**: 데이터 변경 시 캐시 삭제 또는 TTL 활용

---

## 시나리오

| 조건 | 선택 |
|------|------|
| RDS 읽기 부하·지연 감소 | Read Replica + ElastiCache |
| DynamoDB 읽기 캐시 | DAX 또는 ElastiCache |
| 다중 인스턴스 세션 공유 | ElastiCache(Redis) 세션 스토어 |

---

## 기출빈출

| 시나리오 | 접근 |
|----------|------|
| DB 읽기 부하·지연 감소 | **ElastiCache** (Redis/Memcached) 앞단 캐시. |
| RDS + 읽기 확장 | Read Replica + **ElastiCache**. |
| 세션 공유(다중 인스턴스) | **ElastiCache Redis** 세션 스토어. |

---

## 요약

| 항목 | 설명 |
|------|------|
| 목적 | DB 읽기 부하 감소·지연 감소 |
| 구성 | 앱 → ElastiCache → RDS 또는 DynamoDB |
| 조건 | "DB 부하·지연 감소", "캐싱" → ElastiCache |