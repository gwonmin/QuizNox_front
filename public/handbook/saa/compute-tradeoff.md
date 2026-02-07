# Compute 선택: 운영 부담 vs 확장성 vs 비용

Compute 선택 시 **트레이드오프**를 이해하는 프레임입니다.

## 운영 부담

- EC2 > ECS/EKS > Lambda 순으로 관리할 것이 많음.
- Lambda는 런타임·패치 대부분 AWS 책임.

## 확장성

- Lambda·ECS/EKS는 자동 확장 용이. EC2는 ASG로 확장.
- 짧은 트래픽 폭: Lambda. 지속·컨테이너: ECS/EKS.

## 비용

- 항상 켜진 워크로드: EC2/예약이 유리할 수 있음.
- 간헐적·피크: Lambda·온디맨드가 유리할 수 있음.

## 요약

- 운영 줄이기 → Lambda/관리형 서비스
- 비용 최적화 → 워크로드 패턴에 따라 예약·스팟·Lambda 조합
