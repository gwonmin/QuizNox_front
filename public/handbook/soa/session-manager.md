# Systems Manager - Session Manager

SSH·Bastion 없이 **EC2 인스턴스에 브라우저/CLI 세션**으로 접속하는 AWS Systems Manager 기능입니다.

---

## 특징

- **SSM Agent**가 설치된 인스턴스만 대상. 포트 22·Bastion·퍼블릭 IP 불필요.
- **IAM**: 인스턴스에 **IAM Instance Profile**(AmazonSSMManagedInstanceCore 등) 연결 필수. 사용자 쪽에는 **ssm:StartSession** 등 권한 필요.
- **Private 서브넷**에서도 인터넷 게이트웨이 없이 VPC 엔드포인트(ssm, ssmmessages, ec2messages)로 동작 가능.
- 세션 로그를 S3·CloudWatch Logs로 남겨 **감사·트러블슈팅** 가능.
- 태그 기반으로 접근 제어 시, IAM 정책 **Condition**에 태그 조건 지정.

---

## 시나리오

| 시나리오 | 접근 |
|----------|------|
| Private 서브넷 EC2에 SSH 없이 접속 | **Session Manager** 사용. 인스턴스에 **IAM Instance Profile**(AmazonSSMManagedInstanceCore) 부여. |
| 특정 태그가 있는 인스턴스만 접근 허용 | IAM 정책에서 **ssm:StartSession** + Resource 조건에 태그 지정. 사용자/그룹에 해당 정책 부여. |
| 인스턴스가 Session Manager 목록에 안 보임 | SSM Agent 설치 여부, **IAM Instance Profile** 부착, VPC 엔드포인트(또는 NAT) 확인. |
| 명령·세션 기록을 감사·알람에 활용 | Session Manager에서 **CloudWatch Logs**로 세션 로그 전송 → 메트릭 필터·알람 연동. |

---

## 기출빈출

| 시나리오 | 접근 |
|----------|------|
| Private 서브넷 EC2에 SSH 없이 접속 | **Session Manager**. 인스턴스에 **IAM Instance Profile**(AmazonSSMManagedInstanceCore) 부여. |
| 특정 태그 인스턴스만 접근 허용 | IAM 정책 **Condition**에 태그 조건 + **ssm:StartSession** Resource. |
| 세션 로그 감사·알람 | Session Manager에서 **CloudWatch Logs**로 세션 로그 전송. |
| 인스턴스가 Session Manager 목록에 안 보임 | **IAM Instance Profile** 부착 여부, SSM Agent, VPC 엔드포인트(또는 NAT) 확인. |

---

## 요약

| 항목 | 내용 |
|------|------|
| 전제 조건 | SSM Agent, IAM Instance Profile(AmazonSSMManagedInstanceCore), 네트워크(퍼블릭 또는 VPC 엔드포인트). |
| 보안 | 포트 개방 없음. IAM·태그로 접근 제어. 세션 로그 S3/CloudWatch 저장 가능. |
| 기출 포인트 | IAM 역할로 Session Manager 접속, 태그 기반 접근, 세션 로그 CloudWatch. |
