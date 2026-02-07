# REST vs HTTP API (API Gateway)

**API Gateway**의 두 가지 API 유형입니다.

## REST API

- **REST** 스타일, 리소스·메서드 기반. API 키·IAM·Lambda Authorizer 등.
- 캐싱, 요청/응답 변환 등 기능 풍부.

## HTTP API

- **HTTP** 기반, 간소화. **JWT Authorizer**, CORS 등. **비용·지연**이 REST보다 낮음.
- 대부분 REST 기능은 지원하나 REST보다 옵션 적음.

## 요약

| 구분 | REST API | HTTP API |
|------|----------|----------|
| 비용·지연 | 상대적으로 높음 | 낮음 |
| 기능 | 풍부 | 간소화 |
