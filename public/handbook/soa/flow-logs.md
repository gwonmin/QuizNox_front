# VPC Flow Logs

**VPC·서브넷·ENI**의 **네트워크 트래픽** 로그입니다.

## 동작

- Accept/Reject 트래픽을 **로그**로 기록. CloudWatch Logs·S3에 저장.
- 원본·대상 IP, 포트, 프로토콜, 액션 등.

## 용도

- 트러블슈팅(차단된 트래픽), 보안 분석, 트래픽 패턴 파악.

## 요약

- Flow Logs = 네트워크 트래픽 로그. Accept/Reject·5튜플 등 기록.
