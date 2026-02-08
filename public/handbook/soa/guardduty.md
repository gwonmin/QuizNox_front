# GuardDuty

**CloudTrail·VPC Flow Logs·DNS 로그** 등을 분석해 **위협·이상 행위**를 탐지하는 관리형 서비스입니다.

---

## 특징

- **데이터 소스**: CloudTrail 이벤트, VPC Flow Logs, DNS 로그, EKS 감사 로그 등. 별도 에이전트 설치 없음.
- **Finding**: 탐지 결과를 Finding으로 표시. **EventBridge·SNS** 연동으로 알림·자동 대응.
- **계정 간**: **관리자 계정**에서 멤버 계정 초대 → 멀티 계정 통합 탐지.
- **S3 보호**: S3 데이터 이벤트 분석(선택). **Macie**는 S3 내 PII·민감 데이터 분류에 특화.
- **비용**: 분석한 로그 양 기준. 무료 체험 기간 있음.

---

## 시나리오

| 시나리오 | 접근 |
|----------|------|
| 여러 지역에서 콘솔 로그인 시도 탐지 | GuardDuty **Finding** UnauthorizedAccess:IAMUser/ConsoleLoginSuccess.B 등. |
| 의심 IP로 트래픽 차단 | GuardDuty Finding에 외부 IP 포함. 해당 IP를 **NACL** 아웃바운드 deny 또는 **WAF** IP set으로 차단. SG는 **특정 IP deny** 불가(허용만 가능). |
| S3 버킷 내 민감 정보(PII) 분류 | GuardDuty가 아닌 **Amazon Macie**로 discovery job + 관리형 데이터 식별자. |
| 멀티 계정 통합 탐지 | GuardDuty **관리자 계정**에서 멤버 계정 초대. 새 계정은 자동 연동 설정 가능. |

---

## 기출빈출

| 시나리오 | 접근 |
|----------|------|
| 여러 지역에서 콘솔 로그인 시도 탐지 | GuardDuty **Finding** UnauthorizedAccess:IAMUser/ConsoleLoginSuccess.B. |
| 의심 IP 트래픽 차단 | Finding의 외부 IP → **NACL** 아웃바운드 deny 또는 **WAF** IP set. SG는 특정 IP deny 불가. |
| S3 내 PII·민감 데이터 분류 | GuardDuty 아님. **Amazon Macie** discovery job + 관리형 데이터 식별자. |
| 멀티 계정 통합 탐지 | **관리자 계정**에서 멤버 초대. CIS 벤치마크 등은 **Security Hub**에서. |

---

## 요약

| 항목 | 내용 |
|------|------|
| 역할 | 로그 기반 위협 탐지. Finding → EventBridge/SNS 연동. |
| Macie와 차이 | GuardDuty=위협·이상 행위. Macie=S3 내 데이터 분류·PII 탐지. |
| 기출 포인트 | 콘솔 로그인 이상 탐지, 의심 IP 차단=NACL, PII=S3 Macie. |
