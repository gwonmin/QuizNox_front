# 서버리스 아키텍처 패턴

**Lambda·API Gateway·S3·DynamoDB** 등 **관리형 서비스** 조합으로 서버 프로비저닝 없이 동작하는 아키텍처입니다. "최소 운영 노력", "자동 확장", "사용한 만큼 과금" 요구에 적합합니다.

---

## 특징

- **API 백엔드**: API Gateway + Lambda (REST·HTTP API)
- **정적·동적 웹**: S3 정적 호스팅 + CloudFront + Lambda(동적 처리)
- **데이터 저장**: DynamoDB(NoSQL), S3(객체)
- **이벤트·비동기**: S3 이벤트 → Lambda, SQS → Lambda, SNS → Lambda
- **순서 보장·주문 처리**: API Gateway → **SQS FIFO** → Lambda (FIFO로 수신 순서 유지)
- **대용량 수집·변환·저장**: API Gateway → **Kinesis Data Streams** → Lambda(변환) → DynamoDB·S3; 또는 Kinesis Data Firehose로 S3 적재
- **파일 변환(이미지·PDF 등)**: S3 업로드 → **S3 이벤트 → SQS** → Lambda(변환) → 다른 S3 버킷; SQS로 내구성·재시도 확보

---

## 시나리오

| 조건 | 선택 |
|------|------|
| 최소 운영·API 백엔드 | API Gateway + Lambda |
| 정적+동적 웹 | S3 + CloudFront + Lambda |
| 순서 보장·주문 처리 | API Gateway → SQS FIFO → Lambda |
| 대용량 수집·변환·저장 | Kinesis Data Streams/Firehose + Lambda |
| 파일 변환·내구성 | S3 이벤트 → SQS → Lambda |

---

## 기출빈출

| 시나리오 | 접근 |
|----------|------|
| 최소 운영·자동 확장 | **Lambda**·API Gateway·관리형 서비스. |
| 순서 보장 필요 | **SQS FIFO** → Lambda. |
| 이벤트 기반·내구성 | **S3 이벤트 → SQS → Lambda** (SQS로 재시도). |

---

## 요약

| 항목 | 설명 |
|------|------|
| 서버리스 | Lambda·API Gateway·S3·DynamoDB·SQS·SNS 조합 |
| 장점 | 최소 운영, 자동 확장, 사용량 과금 |
| 조건 | "최소 운영", "서버리스" → Lambda·API Gateway·관리형 서비스 |