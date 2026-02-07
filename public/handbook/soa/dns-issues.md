# DNS 이슈 트러블슈팅

**이름 해석** 관련 문제를 확인하는 포인트입니다.

## 확인 사항

- **Private Hosted Zone** vs 퍼블릭 DNS: VPC DNS 설정, Resolver 규칙.
- **VPC Endpoint** DNS 활성화 여부(PrivateLink DNS).
- **Route 53** 헬스 체크·라우팅 정책. TTL·캐시.

## 요약

- DNS 이슈 = Resolver·Hosted Zone·엔드포인트 DNS·Route 53 설정 순으로 확인.
