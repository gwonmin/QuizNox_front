# DynamoDB Streams

**테이블 항목 변경**(Put/Update/Delete)을 **시간 순서**로 기록하는 스트림입니다. Lambda 이벤트 소스 매핑으로 변경 발생 시 자동 호출해 근실시간 처리·복제·캐시 무효화에 사용합니다.

---

## 1. 특징

- **스트림 레코드**: 항목 변경 시 **스트림 레코드** 생성. StreamViewType에 따라 KEYS_ONLY, NEW_IMAGE, OLD_IMAGE, NEW_AND_OLD_IMAGES 선택.
- **Lambda 연동**: **이벤트 소스 매핑**으로 스트림 → Lambda 연결. Lambda 실행 역할에 DynamoDB 스트림 읽기 권한 필요; **리소스 정책**으로 DynamoDB가 Lambda를 호출할 수 있게 설정(콘솔에서 트리거 추가 시 자동).
- **순서**: 같은 파티션 키 내에서만 순서 보장. 여러 파티션은 병렬 처리.
- **Kinesis Data Streams와 구분**: DynamoDB 변경만 구독할 때는 **Streams**; 범용 이벤트·다수 소스는 EventBridge·Kinesis.

---

## 2. 시나리오

| 조건 | 선택 |
|------|------|
| DynamoDB 변경 시 Lambda로 **즉시 처리** | 테이블에 **Streams 활성화** → Lambda **이벤트 소스 매핑**으로 스트림 연결 |
| 스트림 켰는데 Lambda 미호출 | **이벤트 소스 매핑**이 있는지 확인; Lambda 리소스 정책에 dynamodb.amazonaws.com 권한 |
| 주문·데이터 변경을 S3·다른 서비스에 반영 | Streams → Lambda → S3·SNS·다른 DynamoDB 등 |
| TTL로 삭제된 항목도 처리 | Streams ViewType에 OLD_IMAGE 또는 NEW_AND_OLD_IMAGES 사용 후 Lambda에서 삭제 레코드 처리 |
| 실패·재처리 | Lambda 배치 실패 시 해당 레코드 재시도; DLQ·Destinations로 최종 실패 수집 |

---

## 기출빈출

| 시나리오 | 접근 |
|----------|------|
| DynamoDB 변경 시 Lambda 즉시 실행 | 테이블에 **Streams** 활성화 → Lambda **이벤트 소스 매핑**으로 스트림 연결. |
| Streams 켰는데 Lambda 미호출 | **이벤트 소스 매핑** 존재·Lambda 리소스 정책(dynamodb.amazonaws.com) 확인. |
| 주문·변경 이벤트를 S3·다른 서비스에 반영 | **DynamoDB Streams** → Lambda → S3·SNS 등(EventBridge·Kinesis가 아닌 Streams). |
| TTL로 삭제된 항목도 Lambda에서 처리 | StreamViewType **OLD_IMAGE** 또는 **NEW_AND_OLD_IMAGES**. |

---

## 요약

| 항목 | 설명 |
|------|------|
| Streams | 테이블 변경 이벤트를 시간순 기록 |
| Lambda | 이벤트 소스 매핑으로 스트림 → Lambda 자동 호출 |
| 조건 | "테이블 변경 시 처리" → Streams + Lambda 매핑 |
