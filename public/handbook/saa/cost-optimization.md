# 비용 최적화 (SAA 관점)

**최저 비용** 요구 시 **인스턴스 타입·구매 옵션·스토리지 수명 주기**를 조합해 비용을 줄이는 설계입니다. Reserved Instance·Spot·적정 사이징·스토리지 클래스·라이프사이클을 시나리오에 맞게 선택합니다.

---

## 특징

### 컴퓨트

- **Reserved Instance(RI)**: 1·3년 약정으로 On-Demand 대비 할인, 안정 워크로드
- **Savings Plans**: EC2·Lambda·Fargate 등 유연한 사용량 기반 할인
- **Spot**: 중단 허용 가능 워크로드(배치·플렉시블)에서 최대 할인
- **적정 사이징**: 사용률 낮으면 작은 인스턴스·오토 스케일로 조정

---

### 스토리지

- **S3**: 수명 주기(Lifecycle)로 Standard → IA → Glacier 전환, 불필요 객체 만료
- **S3 Intelligent-Tiering**: 접근 빈도가 예측 어려울 때 자동으로 자주 접근/드물게 접근 티어 이동 → AZ 손실 복원력 유지하면서 비용 절감
- **S3 Lifecycle**: "1개월 후 거의 미접근" → Standard-IA 또는 Glacier(Deep Archive) 전환; "장기 보관·최저 비용" → Glacier Deep Archive
- **EBS**: gp3 등 적정 타입, 미사용 볼륨·스냅샷 정리
- **데이터 정리**: 로그·임시 데이터 보관 기간·접근 빈도에 맞춰 클래스 선택

---

### 네트워크·비용

- **VPC Gateway Endpoint(S3)**: 프라이빗 서브넷에서 S3 접근 시 NAT Gateway 경유 없이 접근 → 리전 데이터 전송·NAT 비용 절감
- **Cost Explorer**: 인스턴스 타입·기간별 비용 세부 분석(예: EC2 비용 급증 원인 파악), 그래프·필터로 비교

---

## 시나리오

| 조건 | 선택 |
|------|------|
| 안정·예측 가능 워크로드 | Reserved Instance 또는 Savings Plans |
| 중단 가능·배치 | Spot |
| "최저 비용" + 스토리지 | S3 라이프사이클·스토리지 클래스 |
| 접근 패턴 예측 어려움 + AZ 복원력 | S3 Intelligent-Tiering |
| 장기 보관·거의 미접근 | S3 Lifecycle → Glacier(Deep Archive) |
| EC2 비용·인스턴스 타입 분석 | Cost Explorer 세부 필터 |
| 프라이빗 EC2의 S3 접근 비용 절감 | VPC Gateway Endpoint(S3) |
| "최소 운영" + 비용 | 서버리스(Lambda·관리형 서비스) |

---

## 기출빈출

| 시나리오 | 접근 |
|----------|------|
| 안정 워크로드·비용 절감 | **Reserved Instance**·**Savings Plans**. |
| 중단 가능·배치 | **Spot**. |
| 접근 패턴 예측 어려움 + AZ 복원력 | **S3 Intelligent-Tiering**. |
| 장기 보존·거의 미접근 | **S3 Lifecycle** → Glacier(Deep Archive). |
| 프라이빗 EC2의 S3 접근 비용 절감 | **VPC Gateway Endpoint(S3)**. |
| 비용 원인 분석 | **Cost Explorer** 세부 필터. |

---

## 요약

| 영역 | 비용 최적화 수단 |
|------|------------------|
| 컴퓨트 | RI, Savings Plans, Spot, 적정 사이징 |
| 스토리지 | S3 라이프사이클·클래스, EBS 타입·정리 |
| 조건 | "최저 비용" → RI·Spot·라이프사이클 조합 |