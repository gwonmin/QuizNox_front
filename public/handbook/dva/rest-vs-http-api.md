# REST vs HTTP API (API Gateway)

**API Gateway**의 두 가지 API 유형입니다. REST API는 기능·캐싱이 풍부하고, HTTP API는 비용·지연이 낮고 JWT·CORS에 유리합니다.

---

## 1. 특징

- **REST API**: 리소스·메서드 기반, **API 키·IAM·Lambda Authorizer·Cognito Authorizer** 지원. **캐싱**, 요청/응답 매핑, Mock 통합, 스테이지·스테이지 변수, **Canary 배포** 지원.
- **HTTP API**: HTTP 기반 간소화. **JWT Authorizer**(Cognito 등), CORS 설정 용이. **비용·지연**이 REST보다 낮음. Lambda 연동·OIDC·OAuth2 지원.
- **공통**: Lambda 동기/비동기 연동, VPC 내 백엔드, 사용량 기반 과금.

---

## 2. 시나리오

| 조건 | 선택 |
|------|------|
| 기존 Cognito·Lambda Authorizer·캐싱·Mock | REST API |
| 비용·지연 최소화·JWT만 필요 | HTTP API |
| 프론트엔드 팀에 즉시 엔드포인트 제공 | **Mock 통합**: 통합 유형 Mock, integration request/response에서 HTTP 상태·JSON 응답 지정 |
| dev/prod 분리·백엔드 변경 없이 테스트 | **스테이지** 분리(예: dev 스테이지에 새 Lambda 버전 연결) |
| 소수 사용자만 새 버전 테스트 | **Canary 배포**로 트래픽 비율 지정 |
| 새 API 키 생성 후 403 | **createUsagePlanKey**로 API 키를 해당 **Usage Plan**에 연결해야 호출 가능 |
| REST API 502 | Lambda 응답 형식(statusCode·body 등)이 API Gateway 기대 형식과 일치하는지 확인 |

---

## 기출빈출

| 시나리오 | 접근 |
|----------|------|
| 백엔드 없이 프론트엔드 팀에 엔드포인트 제공 | **Mock 통합**: integration request/response에서 HTTP 상태·JSON 지정. |
| 새 API 버전 테스트·기존 고객 무영향 | **새 스테이지** 배포 또는 **Canary 배포**로 트래픽 비율 지정. |
| 비용·지연 최소화·JWT만 필요 | **HTTP API** 사용. |
| 캐싱·API 키·Cognito Authorizer 필요 | **REST API** 사용. |

---

## 요약

| 구분 | REST API | HTTP API |
|------|----------|----------|
| 비용·지연 | 상대적으로 높음 | 낮음 |
| 인증 | API 키, IAM, Lambda, Cognito | JWT, OIDC, OAuth2 |
| 캐싱·Mock·Canary | 지원 | 제한적 |
| 조건 | "캐싱·Mock·Cognito Authorizer" → REST / "저비용·JWT" → HTTP API |
