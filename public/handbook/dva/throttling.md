# API Gateway Throttling

**요청 속도**를 제한해 백엔드·계정을 보호하는 기능입니다. 초과 시 **429 TooManyRequestsException** 반환.

---

## 1. 특징

- **동작**: 계정·API·스테이지·메서드별로 **초당 요청 수** 한도 설정. 한도 초과 시 429.
- **Usage Plan**: API 키별·토큰 버킷 기반으로 호출 수·초당 rate 제한.
- **캐싱**: Throttling과 별개로 **API 캐싱**을 켜면 동일 요청에 대한 백엔드 호출·지연 감소 → 응답성 향상.
- **CloudWatch 지표**: IntegrationLatency, Latency 등으로 API·Lambda 구간 지연·타임아웃 원인 분석.

---

## 2. 시나리오

| 조건 | 선택 |
|------|------|
| 일일 통계·동일 요청 많음 | API Gateway에서 **캐싱** 활성화로 응답 속도·백엔드 부하 감소 |
| API 타임아웃(Lambda는 정상 완료) | IntegrationLatency·Latency 지표로 구간 확인; Lambda 타임아웃·동기 호출 29초 제한 고려 |
| 429 발생 | Usage Plan·Throttling 한도 상향 또는 클라이언트 지수 백오프 |
| 비인증 읽기 API 응답 개선 | 캐싱 활성화(비용·지연 감소) |

---

## 기출빈출

| 시나리오 | 접근 |
|----------|------|
| API 응답 느림·동일 요청 많음 | API Gateway **캐싱** 활성화. |
| API는 타임아웃, Lambda 로그는 정상 완료 | **IntegrationLatency·Latency** 지표 확인; 동기 호출 29초 제한 고려. |
| 429 TooManyRequestsException | Usage Plan·Throttling 한도 상향 또는 클라이언트 **지수 백오프**. |
| 일일 통계·읽기 위주 API | **캐싱**으로 백엔드 호출·지연 감소. |

---

## 요약

| 항목 | 설명 |
|------|------|
| Throttling | 초당 요청 수 제한, 초과 시 429 |
| 캐싱 | 동일 요청 재사용 → 지연·백엔드 부하 감소 |
| 조건 | "응답 속도 개선" → 캐싱 / "429" → 한도·Usage Plan 확인 |
