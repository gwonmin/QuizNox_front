# SG / NACL 분석 (트러블슈팅)

**트래픽 차단** 원인을 Security Group·NACL 기준으로 파악하는 방법입니다.

## 순서

- **NACL**: 서브넷 경계, Stateless이므로 인바운드·아웃바운드 **둘 다** 허용 규칙 필요.
- **Security Group**: 인스턴스·ENI에 연결된 SG 인바운드/아웃바운드. Stateful이므로 응답은 자동.
- **Flow Logs**로 실제 Accept/Reject 확인.

## 요약

- SG/NACL 분석 = NACL(서브넷)·SG(인스턴스) 규칙 + Flow Logs로 차단 구간 특정.
