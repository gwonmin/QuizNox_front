# DLQ / Destinations (Lambda)

**실패한 비동기 호출 이벤트**를 보관·재처리하거나, **성공·실패별로** 다른 대상으로 보내기 위한 기능입니다.

---

## 1. 특징

- **DLQ(Dead Letter Queue)**: Lambda **비동기 호출**이 재시도 후 최종 실패했을 때, 해당 이벤트를 **SQS 큐 또는 SNS 토픽**으로 전달. 수동·자동 재처리 가능.
- **Destinations**: 비동기 호출에 대해 **성공 시**와 **실패 시** 대상(다른 Lambda, SQS, SNS, EventBridge 등)을 각각 지정. 실패 시 DLQ 대신 특정 Lambda로 넘겨 후속 처리(리사이즈·알람 등) 가능.
- **동기 호출**(API Gateway, ALB 등)에는 DLQ/Destinations 적용되지 않음; 실패는 클라이언트 응답으로 반환.

---

## 2. 시나리오

| 조건 | 선택 |
|------|------|
| 비동기 호출 실패 이벤트 보관·조사 | Lambda 실패 대상으로 SQS DLQ 또는 SNS 지정 |
| 실패 시 자동으로 다른 Lambda에서 리사이즈·알람 | Destinations에서 On failure → Lambda(처리 함수) 지정 |
| 주문 미처리·에러 로그 없음 | 비동기 호출이면 DLQ 확인; 타임아웃·재시도 후 DLQ로 전달됨 |
| 재처리 파이프라인 | DLQ를 Lambda 이벤트 소스로 매핑해 수정 후 재처리 |

---

## 기출빈출

| 시나리오 | 접근 |
|----------|------|
| 비동기 호출인데 로그에 에러 없음 | **DLQ** 확인; 재시도 후 최종 실패 이벤트가 DLQ로 전달됨. |
| 실패 시 다른 Lambda에서 리사이즈·후속 처리 | **Destinations** On failure → Lambda(처리 함수) 지정. |
| 실패 이벤트 수집·조사 | Lambda 비동기 실패 대상으로 **SQS DLQ** 또는 **SNS** 지정. |
| 재처리 | DLQ를 Lambda 이벤트 소스로 매핑해 수정 후 재처리. |

---

## 요약

| 항목 | 설명 |
|------|------|
| DLQ | 비동기 호출 재시도 후 최종 실패 이벤트 → SQS/SNS 보관 |
| Destinations | 비동기 호출 성공/실패 각각 다른 대상(Lambda·SQS·SNS 등) 지정 |
| 조건 | "실패 이벤트 보관·재처리" → DLQ / "실패 시 다른 Lambda 실행" → Destinations |
