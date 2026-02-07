# Direct Connect / VPN

**온프레미스와 AWS**를 연결하는 두 가지 방식입니다.

## Site-to-Site VPN

- **VPN 터널** over 인터넷. 가상 프라이빗 게이트웨이 + 고객 게이트웨이.
- 빠른 구축, 대역폭·지연은 인터넷 영향 받음.

## Direct Connect

- **전용선**으로 AWS와 물리 연결. 지연·대역폭 안정적.
- VPN over Direct Connect로 암호화·프라이빗 통신 가능.

## 요약

| 구분 | VPN | Direct Connect |
|------|-----|----------------|
| 경로 | 인터넷 | 전용선 |
| 지연·안정성 | 인터넷 의존 | 상대적으로 안정 |
