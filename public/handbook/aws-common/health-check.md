# Health Check (ELB/ASG)

**대상이 정상인지** 주기적으로 확인하는 동작입니다.

## ELB 헬스 체크

- **타깃 그룹**에 등록된 대상에 주기적으로 요청
- 성공(2xx 등)이면 Healthy, 실패면 Unhealthy → 트래픽 제외
- 경로·포트·간격 설정 가능

## ASG 헬스 체크

- EC2 상태 체크 + ELB 헬스 체크(선택) 반영
- Unhealthy 인스턴스는 교체 대상

## 요약

- Health Check = 주기적 프로브로 정상 여부 판단
- Unhealthy 시 트래픽 제외 또는 인스턴스 교체
