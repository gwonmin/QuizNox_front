# DynamoDB Streams

**테이블 변경**을 시간 순서로 기록하는 스트림입니다.

## 동작

- Put/Update/Delete 시 **스트림 레코드** 생성. Lambda 등으로 구독.
- 이벤트 소스 매핑으로 Lambda 자동 트리거 가능.

## 용도

- 복제, 캐시 무효화, 이벤트 기반 파이프라인.

## 요약

- Streams = 테이블 변경 이벤트 스트림. Lambda 등으로 구독·처리.
