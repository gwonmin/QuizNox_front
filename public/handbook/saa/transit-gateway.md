# Transit Gateway

**여러 VPC·온프레미스**를 하나의 **허브**로 연결하는 서비스입니다. **전이적 라우팅**을 지원해 연결된 VPC 간 라우팅이 가능합니다.

---

## 특징

- **허브 역할**: VPC·VPN·Direct Connect를 Transit Gateway에 연결
- **전이적 라우팅**: 연결된 VPC 간 라우팅 가능(라우팅 테이블 설정에 따름)
- **규모**: 다수 VPC·하이브리드 환경을 한 곳에서 라우팅·관리

---

## 시나리오

| 조건 | 선택 |
|------|------|
| 다수 VPC 간 연결·전이적 라우팅 | Transit Gateway |
| 두 VPC만 1:1 연결 | VPC Peering |
| 온프레미스와 AWS 연결 | VPN·Direct Connect를 TG에 연결 가능 |

---

## 기출빈출

| 시나리오 | 접근 |
|----------|------|
| 다수 VPC·온프레미스 허브형 연결 | **Transit Gateway** + VPC 첨부·라우팅 전파. |
| 전이적 라우팅 필요 | VPC Peering 대신 **Transit Gateway**. |

---

## 요약

| 항목 | 설명 |
|------|------|
| Transit Gateway | 허브형 연결, 다수 VPC·온프레미스 연동 |
| 특징 | 전이적 라우팅 지원 |
| 조건 | "다수 VPC", "허브" → Transit Gateway |
