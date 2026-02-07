# Systems Manager Session Manager

**SSH·Bastion 없이** EC2 등에 **세션** 접속하는 방식입니다.

## 동작

- **SSM Agent**가 인스턴스에 있으면, Session Manager로 **브라우저·CLI**에서 세션 시작.
- 22번 포트·Bastion 불필요, IAM·로그로 감사 가능.

## 요약

- Session Manager = 포트 개방 없이 인스턴스 접속. SSH 대체·보안 강화.
