# DNS 이슈 트러블슈팅

**이름 해석** 실패·잘못된 라우팅을 **Resolver·Hosted Zone·Route 53·엔드포인트** 순으로 확인하는 방법입니다.

---

## 특징

- **Zone apex**(루트 도메인)에는 **CNAME 불가**. **Alias 레코드** 사용.
- **S3 정적 웹사이트**: 버킷 이름이 **레코드 이름과 일치**해야 함(예: www.example.com → 버킷 www.example.com).
- **Private Hosted Zone**: VPC 연동. **Resolver** – 온프레미스에서 조회 시 **Inbound Endpoint**; VPC에서 온프레미스 도메인 조회 시 **Outbound Endpoint** + forwarding rule.
- **CNAME**: 다른 도메인 이름 가리킴(예: www.company.com → app.example.com).
- **라우팅 정책**: Failover+헬스체크, Weighted, Latency, Geolocation 등.

---

## 시나리오

| 시나리오 | 접근 |
|----------|------|
| Zone apex를 ALB/NLB/CloudFront로 연결 | **Alias 레코드** 사용. CNAME은 apex에서 사용 불가. |
| www.example.com이 S3 웹사이트에 안 열림 | S3 버킷 이름이 **레코드 이름과 동일**해야 함. |
| VPC에서 on-prem 도메인(ex: mssql.example.com) 조회 실패 | **Route 53 Resolver Outbound Endpoint** + 해당 도메인에 대한 **forwarding rule**을 on-prem DNS로. |
| on-prem에서 VPC Private Hosted Zone 조회 | **Route 53 Resolver Inbound Endpoint** 생성. on-prem DNS에서 해당 도메인을 Inbound Endpoint IP로 conditional forward. |
| 다른 계정 VPC의 Private Hosted Zone 사용 | **공유 계정**에서 VPC association **authorization** 생성 → 사용할 계정에서 해당 Hosted Zone에 VPC 연결. |
| 앱을 특정 국가만 허용 | **Geolocation** 라우팅 정책. |

---

## 기출빈출

| 시나리오 | 접근 |
|----------|------|
| Zone apex를 ALB/NLB/CloudFront로 연결 | **Alias 레코드**. CNAME은 apex에서 사용 불가. |
| S3 정적 웹사이트 레코드에 안 열림 | S3 버킷 이름이 **레코드 이름과 동일**해야 함(www.example.com → 버킷 www.example.com). |
| VPC에서 온프레미스 도메인 조회 | **Route 53 Resolver Outbound Endpoint** + 해당 도메인 **forwarding rule**을 온프레미스 DNS로. |
| 온프레미스에서 VPC Private Hosted Zone 조회 | **Resolver Inbound Endpoint** 생성. 온프레미스 DNS에서 conditional forward. |
| Failover + 헬스체크 | Alias/CNAME + **Evaluate Target Health** + Route 53 헬스체크. |

---

## 요약

| 항목 | 내용 |
|------|------|
| Apex | CNAME 불가 → Alias 사용. |
| S3 웹사이트 | 버킷 이름 = 레코드 이름. |
| Resolver | VPC→on-prem: Outbound + forwarding. on-prem→VPC Private Zone: Inbound + conditional forward. |
| 기출 포인트 | Alias apex, S3 버킷 이름=레코드, Outbound/Inbound Resolver, 공유 Hosted Zone. |
