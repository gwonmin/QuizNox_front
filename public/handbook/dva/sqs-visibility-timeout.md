# SQS Visibility Timeout

**메시지를 가져간 후** 다른 소비자가 보지 못하게 하는 **숨김 시간**입니다. 처리 시간보다 짧으면 **중복 처리**, 길면 실패 시 **복구 지연**이 발생합니다.

---

## 1. 특징

- **동작**: **ReceiveMessage**로 메시지를 가져오면 **Visibility Timeout** 동안 해당 메시지는 **다른 소비자에게 보이지 않음**. 처리 후 **DeleteMessage** 하면 완전 삭제.
- **미삭제 시**: 타임아웃이 지나면 메시지가 다시 **노출**되어 다른(또는 같은) 소비자가 다시 가져갈 수 있음 → **at-least-once**, 중복 가능성.
- **설정**: Lambda가 SQS를 이벤트 소스로 쓰면, **Visibility Timeout ≥ Lambda 타임아웃의 6배** 권장. 배치 처리 시간이 길면 타임아웃을 충분히 크게.
- **FIFO**: 메시지 그룹 ID·중복 제거 ID로 순서·중복 제어; 표준 큐는 순서·중복 보장 없음.

---

## 2. 시나리오

| 조건 | 선택 |
|------|------|
| Lambda가 SQS 처리 중 **중복 메시지** 발생 | **Visibility Timeout**을 Lambda 타임아웃(및 배치 처리 시간)보다 **충분히 크게** 설정 |
| 서드파티 API 호출이 길어 메시지 재노출 | Visibility Timeout 증가 또는 **최대 동시성**으로 호출 수 제한 |
| 정확히 한 번·순서 보장 필요 | **SQS FIFO** + 메시지 그룹 ID·중복 제거 ID; 필요 시 Conditional Update로 중복 처리 방지 |
| 처리 실패 메시지 수집 | **DLQ** 설정; 최대 수신 횟수 초과 시 DLQ로 이동 |

---

## 기출빈출

| 시나리오 | 접근 |
|----------|------|
| Lambda 처리 중 메시지 재노출·중복 처리 | **Visibility Timeout**을 Lambda 타임아웃(및 배치 처리 시간)보다 충분히 크게(예: 6배). |
| 순서 보장·중복 없이 처리 | **SQS FIFO** + 메시지 그룹 ID·중복 제거 ID; 필요 시 DynamoDB Conditional Update로 중복 방지. |
| 서드파티 API 호출이 길어 메시지 재노출 | Visibility Timeout 증가 또는 Lambda **최대 동시성**으로 호출 수 제한. |
| 표준 큐에서 중복 이메일 | Visibility Timeout을 처리 완료 시간보다 길게; at-least-once 특성 이해. |

---

## 요약

| 항목 | 설명 |
|------|------|
| Visibility Timeout | 수신 후 다른 소비자에게 숨기는 시간 |
| 미삭제 시 | 타임아웃 후 재노출 → 중복 처리 가능 |
| 조건 | "중복 감소" → Timeout ≥ 처리 시간(×6 등) / "순서·중복 제어" → FIFO |
