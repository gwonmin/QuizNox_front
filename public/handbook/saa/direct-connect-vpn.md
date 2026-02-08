# Direct Connect / VPN

**온프레미스와 AWS**를 연결하는 두 가지 방식입니다. 빠른 구축이면 VPN, 지연·대역폭 안정성이 중요하면 Direct Connect를 고려합니다.

---

## 특징

| 구분 | Site-to-Site VPN | Direct Connect |
|------|------------------|----------------|
| **경로** | 인터넷(VPN 터널) | 전용선(물리 연결) |
| **구성** | 가상 프라이빗 게이트웨이 + 고객 게이트웨이 | DX 로케이션·가상 인터페이스 |
| **지연·안정성** | 인터넷 영향 받음 | 상대적으로 안정적 |
| **암호화** | VPN 터널로 암호화 | VPN over Direct Connect로 암호화 가능 |

---

## 시나리오

| 조건 | 선택 |
|------|------|
| 빠른 구축·비용 최소·대역폭/지연 요구 낮음 | Site-to-Site VPN |
| 지연·대역폭 안정성·하이브리드 상시 연결 | Direct Connect |
| 규정·데이터 전용 경로 필요 | Direct Connect |
| **고가용 연결·비용 최소·장애 시 느려도 수용** | **Direct Connect 1회선 + VPN 백업**(Primary DX 실패 시 VPN으로 폴오버) |
| **대용량·민감 데이터 전송**(예: DataSync) | **DataSync over Direct Connect** → 안정·보안 |

---

## 기출빈출

| 시나리오 | 접근 |
|----------|------|
| 온프레미스–AWS 전용·안정 연결 | **Direct Connect**; VPN은 인터넷 경유. |
| DX 장애 시 백업 경로·비용 제한 | **Direct Connect + Site-to-Site VPN** 백업. |
| 대용량 이전·민감 데이터 | **DataSync over Direct Connect**. |

---

## 요약

| 항목 | 설명 |
|------|------|
| VPN | 인터넷 경유 터널, 빠른 구축 |
| Direct Connect | 전용선, 안정적 지연·대역폭 |
| DX + VPN | 비용 절감하면서 장애 시 백업 경로 확보 |
| 조건 | "빠른 연결" → VPN / "안정·전용" → Direct Connect / "백업 경로" → DX+VPN |
