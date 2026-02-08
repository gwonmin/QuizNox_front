# DynamoDB Partition Key 설계

**파티션 키** 선택이 읽기·쓰기 **분산과 성능**을 좌우합니다. 편중 시 핫 파티션·ProvisionedThroughputExceededException이 발생합니다.

---

## 1. 특징

- **고르게 분산**: 파티션 키 **카디널리티**가 높을수록 파티션 간 부하가 고르게 퍼짐. 한 값에 몰리면 **핫 파티션**.
- **접근 패턴**: 자주 함께 조회하는 항목은 **같은 파티션 키**로 묶어 Query 효율화; 다른 패턴이면 **GSI**로 별도 파티션 키.
- **복합 키**: **파티션 키 + 정렬 키**로 파티션 내 정렬·범위 쿼리(KeyConditionExpression). LSI는 같은 파티션 키에 다른 정렬 키.
- **권장**: 예측 어려운·급증 트래픽이면 **On-Demand**; 균등 분산이 필요하면 **UUID·복합 키** 등 고유·다양한 값 사용.

---

## 2. 시나리오

| 조건 | 선택 |
|------|------|
| "특정 country로 몰림"·ProvisionedThroughputExceededException | 파티션 키를 **더 세분화**(예: country+userId, UUID)하여 분산 |
| 제품별 최고 평점 리뷰 조회 | GSI: partition key = productId, sort key = rating(내림차순) |
| customerId로 주문 목록 조회 | GSI: partition key = customerId (테이블 PK가 orderId일 때) |
| 사용자별·제출 1회 제한·중복 방지 | 파티션 키에 userId(또는 username), 정렬 키에 요청 ID; Conditional Write 또는 조회 후 없을 때만 Put |
| 대량 제출·균등 분산 필요(한 파티션 몰림 방지) | 파티션 키에 **username** 등 고카디널리티·균등 분산되는 속성 사용 |
| 리더보드·과거 데이터 자동 삭제 | TTL 속성 사용; 파티션 키는 균등 분산(예: reviewId·username) |

---

## 기출빈출

| 시나리오 | 접근 |
|----------|------|
| 다른 속성(productId·customerId 등)으로 조회 | **GSI**에 해당 속성을 파티션 키(또는 정렬 키)로 설정. |
| 핫 파티션·ProvisionedThroughputExceededException | 파티션 키 **세분화**(country+userId, UUID 등)·**On-Demand** 또는 **지수 백오프**. |
| 사용자당 한 번만 제출·중복 방지 | 파티션 키에 userId, 정렬 키에 요청 ID; **Conditional Write**(attribute_not_exists). |
| 잘 분산된 파티션 키 선택 | **UUID**·복합 키 등 **고카디널리티** 값 사용. |

---

## 요약

| 항목 | 설명 |
|------|------|
| 파티션 키 | 분산 균등·접근 패턴에 맞게 설계 |
| 핫 파티션 | 한 키 값에 부하 집중 → 스로틀·지연 |
| 조건 | "다른 키로 조회" → GSI / "균등 분산" → 고카디널리티 키·UUID |
