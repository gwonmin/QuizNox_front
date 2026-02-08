# AWS Config

**리소스 설정·변경 이력**을 기록하고 **규칙(Config Rule)**으로 준수 여부를 평가·자동 수정하는 서비스입니다.

---

## 특징

- **설정 스냅샷**·**변경 이벤트** 기록. S3에 설정 히스토리 저장, **SNS**로 변경 알림.
- **관리형 규칙**: required-tags, restricted-ssh, s3-bucket-public-read-prohibited, s3-bucket-logging-enabled 등. **자동 수정**은 AWS 제공 **Automation runbook** 연결.
- **CloudTrail 비활성화 감지**: Config 규칙으로 CloudTrail 설정 변경 탐지 → **자동 수정**으로 AWS-ConfigureCloudTrailLogging 실행.
- **SG 0.0.0.0/0 제한**: Config 규칙으로 비준수 SG 탐지 → 자동 수정으로 특정 CIDR로 제한. **SSH 공개 차단**은 restricted-ssh + AWS-DisablePublicAccessForSecurityGroup.
- **태그 미부여 인스턴스 종료**: required-tags + **AWS-TerminateEC2Instance** 자동 수정.
- **변경 주체 파악**: “누가 ASG 최소 용량을 바꿨는지” 등 **Config 히스토리**로 확인.

---

## 시나리오

| 시나리오 | 접근 |
|----------|------|
| CloudTrail이 꺼지면 즉시 다시 켜기 | Config 규칙(CloudTrail 설정 변경) + **자동 수정** AWS-ConfigureCloudTrailLogging. |
| SG에 0.0.0.0/0 인바운드 금지 + 자동 수정 | Config 규칙으로 비준수 SG 탐지 → 자동 수정 runbook으로 허용 CIDR로 변경. |
| 필수 태그 없는 EC2 자동 종료 | **required-tags** 관리형 규칙 + **AWS-TerminateEC2Instance** 자동 수정. |
| S3 버킷 공개 읽기 금지 + 알림 | **s3-bucket-public-read-prohibited** 관리형 규칙. SNS 구독으로 알림. |
| S3 버킷 로깅 미설정 시 자동 활성화 | **s3-bucket-logging-enabled** + **AWS-ConfigureS3BucketLogging** 자동 수정. |
| 누가 리소스 설정을 바꿨는지 확인 | **Config** 설정/변경 이력으로 조회. |
| DynamoDB 태그 준수 + 자동 수정 | required-tags + 커스텀 **Systems Manager Automation runbook**으로 수정. |

---

## 기출빈출

| 시나리오 | 접근 |
|----------|------|
| CloudTrail 비활성화 시 즉시 재활성화(코드 없이) | Config 규칙(CloudTrail 설정 변경) + **자동 수정** AWS-ConfigureCloudTrailLogging. |
| SG 0.0.0.0/0·SSH 공개 금지 + 자동 수정 | **restricted-ssh** 등 Config 규칙 + **AWS-DisablePublicAccessForSecurityGroup** runbook. |
| 필수 태그 없는 EC2 자동 종료 | **required-tags** + **AWS-TerminateEC2Instance** 자동 수정. |
| S3 버킷 공개 읽기 금지 + 알림/자동 제거 | **s3-bucket-public-read-prohibited** 규칙. 자동 수정 runbook 연결 시 자동 제거. |
| S3 버킷 로깅 미설정 시 자동 활성화 | **s3-bucket-logging-enabled** + **AWS-ConfigureS3BucketLogging** 자동 수정. |
| “누가 리소스 설정을 변경했는지” 확인 | **Config** 설정/변경 이력(Configuration history) 조회. |

---

## 요약

| 항목 | 내용 |
|------|------|
| 역할 | 리소스 설정·변경 이력 + 규칙 기반 준수 평가·자동 수정. |
| 자동 수정 | Config Rule에 **Remediation** 연결 → SSM Automation runbook 실행. |
| 기출 포인트 | CloudTrail 자동 재활성화, SG 0.0.0.0/0/SSH 수정, required-tags+종료, S3 공개/로깅, 변경 주체, S3 공개 자동 제거. |
