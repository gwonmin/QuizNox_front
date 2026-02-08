# EventBridge

**이벤트 기반** 라우팅 서비스입니다. **이벤트 버스**에 이벤트를 보내고 **규칙**으로 패턴 매칭 후 Lambda·SQS·SNS 등 **타깃**으로 라우팅합니다.

---

## 1. 특징

- **이벤트 버스**: 이벤트 수신·규칙 평가. **기본 버스**(AWS 서비스·커스텀)와 **커스텀 버스** 지원.
- **규칙(Rule)**: **이벤트 패턴** 또는 **스케줄(rate/cron)**으로 타깃(Lambda, SQS, SNS, Step Functions 등) 호출. 여러 타깃 가능.
- **스케줄**: **rate(예: 10분)**·**cron**으로 주기적 Lambda 호출 → 서버리스 크론 대체.
- **교차 계정**: 다른 계정 이벤트 버스에 전송·수신 가능(리소스 정책). S3·EC2 등 AWS 이벤트를 한 계정으로 모을 때 활용.
- **Lambda 권한**: EventBridge가 Lambda를 호출하려면 Lambda **실행 역할**에 events 규칙 실행 권한, 또는 Lambda **리소스 정책**으로 events.amazonaws.com 허용.

---

## 2. 시나리오

| 조건 | 선택 |
|------|------|
| **주기적 Lambda 실행**(10분·매일 등) | EventBridge **스케줄 규칙**(rate/cron) → Lambda 타깃 |
| S3·CodeCommit 등 **이벤트**로 Lambda 실행 | EventBridge 규칙(이벤트 패턴) 또는 S3 이벤트 알림·Lambda 트리거 직접 |
| **여러 계정** EC2 생명주기 이벤트를 한 계정 SQS로 | 각 계정 규칙에서 **메인 계정 이벤트 버스**로 전송 → 메인 버스 규칙에서 SQS 타깃 |
| CodeCommit **PR 생성·업데이트** 시 빌드 | EventBridge 규칙 detail.event: pullRequestCreated, pullRequestSourceBranchUpdated → CodeBuild 등 |
| S3 CSV 업로드 시 Lambda | S3 이벤트 알림 → Lambda 트리거 또는 EventBridge S3 패턴 → Lambda |

---

## 기출빈출

| 시나리오 | 접근 |
|----------|------|
| 10분·매일 등 주기적 Lambda 실행 | **EventBridge 스케줄 규칙**(rate/cron) → Lambda 타깃. |
| 여러 계정 EC2 생명주기 이벤트를 한 계정 SQS로 | 각 계정 규칙에서 **메인 계정 이벤트 버스**로 전송 → 메인 버스 규칙에서 SQS 타깃. |
| CodeCommit PR 생성·업데이트 시 빌드 | EventBridge 규칙 **detail.event**: pullRequestCreated, pullRequestSourceBranchUpdated → CodeBuild 등. |
| Lambda 호출 권한 오류(PutEvents) | Lambda **실행 역할**에 events:PutEvents 권한 또는 Lambda **리소스 정책**에 events.amazonaws.com 허용. |

---

## 요약

| 항목 | 설명 |
|------|------|
| EventBridge | 이벤트 버스 + 규칙(패턴/스케줄) → 타깃 라우팅 |
| 스케줄 | rate·cron으로 주기적 Lambda 등 호출 |
| 조건 | "주기 실행" → 스케줄 규칙 / "이벤트 기반" → 이벤트 패턴 규칙 |
