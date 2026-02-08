# 보안 및 권한 (SAA 시나리오)

**고가용성·보안** 요구 시 **IAM 최소 권한·역할·KMS·방화벽·WAF**를 조합해 설계합니다. "EC2가 S3 접근", "암호화", "웹 공격 방어" 등 시나리오별로 적절한 서비스를 선택합니다.

---

## 특징

### IAM

- **최소 권한**: 필요한 액션·리소스만 허용
- **역할(Role)**: EC2·Lambda 등에 **역할 부여**로 임시 자격 사용(키 하드코드 금지)
- **조건부 정책**: IP·MFA·태그 등 조건으로 제한

---

### KMS (Key Management Service)

- **데이터 암호화**: EBS·S3·RDS 등에서 CMK(고객 마스터 키)로 암호화
- **키 관리**: 키 정책·권한·자동 로테이션
- **시나리오**: "암호화 필수", "키 관리·감사" → KMS(SSE-KMS 등)

---

### 방화벽

- **Security Group vs NACL**: SG=인스턴스·Stateful, NACL=서브넷·Stateless·Deny 규칙 가능
- **계층화**: 퍼블릭 서브넷(ALB만) → 프라이빗(앱·DB), NACL로 서브넷 간 제한

---

### WAF

- **웹 공격 방어**: SQL 인젝션·XSS 등, CloudFront·ALB 앞단
- **시나리오**: "웹 앱 보호", "OWASP" → WAF

---

### 조직·감사·DDoS

- **PrincipalOrgID**: S3 버킷 정책 등에서 `aws:PrincipalOrgID`(조직 ID) 조건으로 **조직 내 계정만** 접근 허용 → 최소 운영으로 조직 단위 제한
- **AWS Config vs CloudTrail**: **Config** = 리소스 **설정 변경** 추적(태그·규칙 위반 감지); **CloudTrail** = **API 호출** 기록(누가 언제 무엇을 했는지). "설정 변경 감사" → Config, "API 감사" → CloudTrail
- **AWS Shield**: **Standard** = 기본 DDoS 방어(무료). **Advanced** = 대규모 DDoS·비용 보호·ELB/Route 53 등 리소스 할당 필요(유료)
- **트래픽 검사**: **Network Firewall** = VPC 트래픽 검사·필터링. **GWLB(Gateway Load Balancer)** = 서드파티 가상 방화벽 어플라이언스에 트래픽 전달(검사 VPC에 GWLB + GWLB 엔드포인트)

---

### 자격 증명·원격·인증서

- **Secrets Manager**: DB 비밀 등 저장, **자동 로테이션** 지원. RDS·Aurora 연동 시 최소 운영. 다중 리전 시 **multi-Region secret 복제**로 여러 리전에서 동일 비밀 사용
- **Parameter Store**: 설정값·SecureString 저장 가능. **자동 로테이션은 Secrets Manager**에서 제공
- **Session Manager**: EC2 원격 관리 시 **배스천 불필요**. IAM 역할 부여 후 SSM Agent로 터미널 세션 → SSH 키·배스천 운영 최소화
- **ACM**: 퍼블릭 인증서는 **관리형 갱신** 가능. **외부 CA 인증서**는 ACM에 **import** 후 만료 알림(EventBridge·Config 등)으로 **수동 로테이션**

---

### KMS·암호화

- **SSE-KMS**: S3·EBS 등에서 고객 마스터 키(CMK)로 암호화
- **Multi-Region KMS 키**: 두 리전 S3를 **같은 키**로 암호화·복호화할 때 사용. 한 리전에 키 생성 후 multi-Region 복제
- **AMI 공유(다른 계정)**: KMS 고객 관리 키로 암호화된 스냅샷/AMI는 **키 정책**에 대상 계정 추가 후 launchPermission으로 AMI 공유

---

## 시나리오

| 요구 | 선택 |
|------|------|
| EC2·Lambda가 다른 서비스 접근 | IAM 역할 부여 |
| 데이터 암호화·키 관리 | KMS(SSE-KMS, EBS 암호화) |
| 인스턴스·서브넷 트래픽 제어 | Security Group, NACL |
| 웹 계층 공격 방어 | WAF |
| S3를 조직 내 계정만 접근 | 버킷 정책에 aws:PrincipalOrgID |
| 설정 변경·태그 위반 감지 | AWS Config |
| API 호출 감사 | CloudTrail |
| 대규모 DDoS·ELB 보호 | AWS Shield Advanced |
| VPC 트래픽 검사·필터링 | Network Firewall |
| 서드파티 방화벽 어플라이언스에 트래픽 전달 | GWLB + GWLB 엔드포인트 |
| DB 비밀·자동 로테이션 | Secrets Manager |
| EC2 원격 관리·배스천 제거 | Session Manager |
| 두 리전 동일 키 암호화 | KMS Multi-Region 키 |
| 배스천·앱 서버 SG | 배스천: 회사 IP만 인바운드; 앱: SSH는 배스천 **프라이빗 IP**만 허용 |

---

## 기출빈출

| 시나리오 | 접근 |
|----------|------|
| EC2/Lambda가 다른 서비스 접근 | **IAM 역할** 부여(키 하드코드 금지). |
| 데이터 암호화·키 관리 | **KMS**(SSE-KMS, EBS 암호화). |
| S3 조직 내 계정만 | 버킷 정책 **aws:PrincipalOrgID**. |
| 설정 변경·태그 위반 감지 | **AWS Config**; API 호출 감사 → **CloudTrail**. |
| 대규모 DDoS·비용 보호 | **AWS Shield Advanced**. |
| DB 비밀·자동 로테이션 | **Secrets Manager**; 다중 리전 시 multi-Region secret. |
| EC2 원격·배스천 제거 | **Session Manager**. |

---

## 요약

| 항목 | 설명 |
|------|------|
| IAM | 최소 권한·역할·조건부 정책 |
| KMS | 데이터 암호화·키 관리·Multi-Region 키 |
| Config vs CloudTrail | 설정 변경 vs API 호출 |
| Shield | Standard(기본) / Advanced(DDoS·비용 보호) |
| 조건 | "조직만" → PrincipalOrgID / "설정 감사" → Config / "API 감사" → CloudTrail / "DDoS" → Shield |