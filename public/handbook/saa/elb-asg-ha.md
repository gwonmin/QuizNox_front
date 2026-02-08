# ELB · ASG 고가용성 설계

**고가용성(HA)** 요구 시 **여러 AZ에 인스턴스 분산** + **ELB(트래픽 분산)** + **ASG(자동 복구·확장)** 로 설계합니다. 단일 장애점 제거와 자동 복구가 핵심입니다.

---

## 특징

- **ELB(ALB·NLB)**: 여러 AZ·인스턴스에 트래픽 분산, Unhealthy 타깃 제외
- **ASG**: Min/Max/Desired 유지, 여러 AZ에 인스턴스 분산, Unhealthy 인스턴스 교체
- **다중 AZ**: ELB·ASG 모두 2개 이상 AZ 사용

| 구분 | ALB | NLB |
|------|-----|-----|
| **계층** | L7(HTTP/HTTPS) | L4(TCP/UDP) |
| **헬스 체크** | HTTP/HTTPS 경로·상태 코드 기반 | TCP 또는 HTTP(제한적). 앱 레벨 HTTP 오류 감지는 ALB 적합 |
| **시나리오** | 웹 앱·HTTP 오류 시 Unhealthy 제거 | UDP·초저지연·고정 IP·대량 연결 |

- **HTTP → HTTPS 리다이렉트**: ALB 리스너 규칙에서 HTTP(80) → HTTPS(443) 리다이렉트.
- **GWLB**: 트래픽을 가상 방화벽·검사 어플라이언스로 전달; 검사 VPC에 GWLB, 앱 VPC에 GWLB 엔드포인트.

---

## 시나리오

- **"고가용성"**: 다중 AZ + ELB + ASG
- **"장애 시 자동 복구"**: ASG가 Unhealthy 인스턴스 제거 후 새 인스턴스 기동
- **"트래픽 변동 대응"**: ASG 스케일링 정책(Target tracking 등) + ELB
- **"HTTP 오류로 인한 장애 감지"**: NLB는 L4라 앱 HTTP 오류 감지 어려움 → **ALB**로 교체 후 HTTP 헬스 체크 + Unhealthy 시 ASG가 인스턴스 교체
- **"모든 요청 HTTPS로"**: ALB 리스너 규칙에서 HTTP→HTTPS 리다이렉트
- **"트래픽 검사 후 웹 서버"**: GWLB + 검사 어플라이언스

---

## 기출빈출

| 시나리오 | 접근 |
|----------|------|
| HTTP/HTTPS·헬스 체크·리다이렉트 | **ALB** (L7); HTTP 오류로 Unhealthy 제거 가능. |
| UDP·저지연·고정 IP·대량 연결 | **NLB** (L4). |
| HTTP → HTTPS 리다이렉트 | ALB **리스너 규칙**에서 80 → 443 리다이렉트. |
| 트래픽 검사 후 웹 서버 | **GWLB** + 검사 어플라이언스 + GWLB 엔드포인트. |

---

## 요약

| 항목 | 설명 |
|------|------|
| HA 구성 | 다중 AZ + ELB(분산) + ASG(복구·확장) |
| ALB vs NLB | HTTP 헬스·리다이렉트 → ALB / UDP·저지연 → NLB |
| GWLB | 검사 VPC에서 어플라이언스로 트래픽 전달 |
| 조건 | "고가용성" → ELB·ASG·다중 AZ / "HTTP 오류 감지" → ALB / "검사 후 전달" → GWLB |