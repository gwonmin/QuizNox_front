# DLQ / Destinations (Lambda)

**실패한 이벤트**를 보관·재처리하기 위한 대상입니다.

## DLQ (Dead Letter Queue)

- **비동기 호출** 실패 시 SQS/SNS로 전달. 재시도 후 최종 실패한 메시지 보관.
- 수동·자동 재처리 가능.

## Destinations

- **성공·실패** 각각 다른 대상(SQS, SNS, Lambda 등)으로 라우팅.
- 실패 시 특정 큐로 보내 알람·재처리 파이프라인 구성.

## 요약

- DLQ = 실패 메시지 보관. Destinations = 성공/실패별 라우팅.
