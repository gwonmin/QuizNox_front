# CloudWatch Metric Filter

로그 패턴을 **메트릭**으로 변환해 알람·대시보드에 활용하는 CloudWatch 기능입니다.

---

## 특징

- **로그 그룹**에 Metric Filter를 정의하고, 지정한 **패턴**(예: `ERROR`, `[ip, user, timestamp, request, status_code]`)이 매칭될 때마다 카운트 등 **메트릭** 발생.
- **값 추출**: 패턴에서 숫자·문자열을 캡처해 메트릭 값 또는 차원으로 사용 가능(예: 지연 시간 p90).
- 해당 메트릭으로 **CloudWatch 알람** 설정 → SNS 알림, EC2 복구 액션 등 연동.
- **append_dimensions** 등으로 커스텀 차원 추가 시, 에이전트 설정 파일에서 지정.

---

## 시나리오

| 시나리오 | 접근 |
|----------|------|
| 매시간 도착해야 하는 S3 파일이 없을 때 알림 | Lambda Invocations 메트릭이 1시간 동안 0이면 알람 + **missing data = breaching**. |
| 로그 필드의 p90 지연 시간을 시간별로 모니터링 | 로그에 latency 필드가 있으면 **Metric Filter**로 해당 필드를 메트릭화한 뒤, 통계(p90)로 알람·대시보드 구성. |
| 웹 서버 로그에서 HTTP 404 응답 횟수 모니터링 | **Metric Filter**로 404 패턴 매칭 → 카운트 메트릭 생성 → 알람. |
| EC2에서 커스텀 차원이 포함된 메트릭 수집 | CloudWatch **에이전트** 설정에 **append_dimensions** 필드로 차원 정의. |

---

## 기출빈출

| 시나리오 | 접근 |
|----------|------|
| 로그→메트릭→알람 기반 모니터링·알람 설계 | “파일 미도착 알림”, “에러 횟수 알림”, “p90 지연 모니터링” 등에서 **Metric Filter** 정답. |
| 매시간 S3 파일 미도착 시 알림 | Lambda Invocations 1시간 0이면 알람 + **missing data = breaching**. Lifecycle·SQS 등은 오답. |
| EC2에서 커스텀 차원이 포함된 메트릭 수집 | **CloudWatch 에이전트** 설정의 **append_dimensions** 필드. Lambda·EventBridge는 오답. |
| 로그 latency 필드의 p90을 시간별로 통계 | **Metric Filter**로 해당 필드 메트릭화. Contributor Insights·Subscription filter는 용도 다름. |
| 웹 서버 404 횟수 모니터링(운영 효율 최우선) | **Metric Filter**로 404 패턴 매칭 → 카운트 메트릭·알람. Lambda·스크립트는 오답. |
| 시험 표현: “most operationally efficient”, “without custom code”, “log-based metric”, “custom dimension” | Metric Filter·에이전트 append_dimensions 등 연상. |

---

## 요약

| 항목 | 내용 |
|------|------|
| 역할 | 로그 패턴 → 메트릭 변환. 로그 기반 알람·대시보드의 기반. |
| 설정 위치 | CloudWatch Logs → 로그 그룹 → Metric filters. |
| 기출 포인트 | Lambda Invocations=0 + missing data=breaching, p90 메트릭, 404 카운트, append_dimensions. |
