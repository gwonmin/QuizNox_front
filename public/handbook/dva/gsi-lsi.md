# GSI / LSI (DynamoDB)

**다른 키**로 조회할 수 있게 하는 **인덱스**입니다. 접근 패턴별로 파티션 키·정렬 키를 다르게 두려면 GSI; 같은 파티션 키에 정렬 키만 추가하려면 LSI를 사용합니다.

---

## 1. 특징

- **GSI(Global Secondary Index)**: 테이블과 **다른 파티션 키·정렬 키** 가능. **비동기** 복제. 테이블 생성 **후** 추가 가능. 별도 용량·비용.
- **LSI(Local Secondary Index)**: **같은 파티션 키**, **다른 정렬 키**만. **테이블 생성 시에만** 추가 가능. 같은 파티션 내 범위 쿼리.
- **Query**: 파티션 키(필수) + 정렬 키 조건(선택). **Scan**은 테이블 전체 스캔 → 비용·지연 큼; 가능하면 Query·GSI/LSI 사용.
- **정렬**: Query 시 **ScanIndexForward=false**로 정렬 키 **내림차순**; 기본은 오름차순.

---

## 2. 시나리오

| 조건 | 선택 |
|------|------|
| productId·rating 등 **다른 속성**으로 조회 | **GSI**: 해당 속성을 파티션 키(또는 정렬 키)로 설정 |
| productFamily·productType으로 조회 | GSI: partition key = productFamily, sort key = productType |
| 제품별 최고 평점 리뷰 상위 N개 | GSI: partition key = productId, sort key = rating(내림차순 Query) |
| customer_type + email_address 부분 일치 | GSI: partition key = customer_type, sort key = email_address; Query에 begins_with 사용 |
| 테이블은 이미 있고, 새 조회 패턴만 추가 | GSI 추가(LSI는 생성 시에만 가능) |
| 파티션 키는 그대로, 정렬 키만 다르게 범위 쿼리 | LSI(테이블 생성 시 정의) |

---

## 기출빈출

| 시나리오 | 접근 |
|----------|------|
| productId·rating 등 다른 속성으로 조회 | **GSI**: 해당 속성을 파티션 키·정렬 키로 설정. |
| 제품별 최고 평점 리뷰 상위 N개 | GSI: partition key = productId, sort key = rating; Query + **ScanIndexForward=false**. |
| customer_type + email_address 부분 일치 | GSI: partition key = customer_type, sort key = email_address; Query에 **begins_with**. |
| 테이블 이미 있음·새 조회 패턴만 추가 | **GSI** 추가(LSI는 테이블 생성 시에만 가능). |
| Scan 느림·다른 키로 조회 필요 | **GSI** 추가 후 Query 사용. |
| Query 결과를 정렬 키 내림차순으로 | **ScanIndexForward=false** 지정. |

---

## 요약

| 구분 | GSI | LSI |
|------|-----|-----|
| 파티션 키 | 테이블과 다를 수 있음 | 테이블과 동일 |
| 추가 시점 | 나중에 추가 가능 | 테이블 생성 시만 |
| 조건 | "다른 키·새 조회 패턴" → GSI / "같은 PK, 다른 정렬" → LSI(생성 시) |
