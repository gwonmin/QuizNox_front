# DynamoDB Conditional Update

**조건이 참일 때만** 쓰기(Put/Update/Delete)를 수행하는 기능입니다. **ConditionExpression**으로 낙관적 락·중복 방지·무결성 제어에 사용합니다.

---

## 1. 특징

- **ConditionExpression**: 속성 존재 여부(**attribute_exists**·**attribute_not_exists**), 값 비교(**=**, **<>** 등)로 조건 지정. 조건 불만족 시 쓰기 실패(조건부 실패).
- **용도**: "값이 X일 때만 덮어쓰기", **낙관적 락**(버전 속성 비교), **한 번만 쓰기**(attribute_not_exists로 중복 Put 방지).
- **Idempotency**: 동일 요청 ID로 재시도 시 attribute_not_exists(requestId)로 첫 요청만 성공시키고 중복 처리 방지.
- **IAM**: GetItem, PutItem, UpdateItem, BatchGetItem, BatchWriteItem 등 필요한 최소 액션만 부여.

---

## 2. 시나리오

| 조건 | 선택 |
|------|------|
| IoT·재시도 시 **중복 요청 방지** | 파티션/정렬 키 또는 GSI에 **요청 ID** 저장; Put/Update 시 **attribute_not_exists**로 첫 요청만 성공 |
| 좌석·재고 등 **동시성 제어** | Conditional Update로 "재고 > 0" 등 조건 검사 후 감소; 실패 시 재시도 또는 클라이언트 에러 |
| "첫 주문만 처리"·한 번만 쓰기 | attribute_not_exists(orderId) 또는 유니크 식별자로 조건 |
| UnprocessedKeys·일시적 실패 | **지수 백오프·재시도**; 필요 시 용량(On-Demand·프로비저닝) 검토 |

---

## 기출빈출

| 시나리오 | 접근 |
|----------|------|
| IoT·재시도 시 중복 요청 방지 | 요청 ID를 파티션/정렬 키 또는 GSI에 저장; **attribute_not_exists**로 첫 요청만 성공. |
| UnprocessedKeys 반환 시 | **지수 백오프·랜덤 지연** 재시도; 필요 시 테이블 용량(Read/Write) 검토. |
| 좌석·재고 동시성 제어 | **ConditionExpression**으로 "재고 > 0" 등 검사 후 감소. |
| 한 번만 쓰기·첫 주문만 처리 | **attribute_not_exists**(orderId 등) 조건. |
| BatchGetItem 시 UnprocessedKeys 반환 | **지수 백오프·재시도**; 필요 시 Read Capacity·On-Demand 검토. |

---

## 요약

| 항목 | 설명 |
|------|------|
| Conditional Update | ConditionExpression 만족 시에만 쓰기 |
| 용도 | 낙관적 락, 중복 방지(Idempotency), 무결성 |
| 조건 | "중복 방지" → attribute_not_exists / "동시성" → 값 비교 조건 |
