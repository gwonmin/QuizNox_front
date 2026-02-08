# WAF (Web Application Firewall)

**웹 애플리케이션 계층**에서 **SQL 인젝션·XSS·악성 요청**을 차단하는 방화벽입니다. ALB·CloudFront·API Gateway 앞단에 배치해 규칙 기반으로 요청을 허용·차단·모니터링합니다.

---

## 특징

- **L7 방화벽**: HTTP/HTTPS 요청의 URI·헤더·본문·규칙 세트로 판단
- **연동**: CloudFront, ALB, API Gateway에 Web ACL 연결
- **규칙**: AWS 관리 규칙(SQL 인젝션, XSS 등) + 커스텀 규칙

---

## 시나리오

| 조건 | 선택 |
|------|------|
| OWASP Top 10·SQL 인젝션·XSS | WAF 관리형 규칙 활용 |
| 특정 IP 과도한 요청 | Rate-based 규칙 |
| 특정 국가 차단/허용 | 지역·IP 조건 규칙 |

---

## 기출빈출

| 시나리오 | 접근 |
|----------|------|
| 웹 앱 계층 공격 방어 | **WAF** (CloudFront·ALB·API Gateway 앞단). |
| SQL 인젝션·XSS 차단 | WAF **AWS 관리형 규칙** 또는 커스텀. |
| 과도한 요청 제한 | **Rate-based** 규칙. |

---

## 요약

| 항목 | 설명 |
|------|------|
| WAF | 웹 앱 계층 방화벽(SQL 인젝션·XSS 등) |
| 배치 | CloudFront·ALB·API Gateway 앞단 |
| 조건 | "웹 공격 방어", "SQL 인젝션 차단" → WAF |