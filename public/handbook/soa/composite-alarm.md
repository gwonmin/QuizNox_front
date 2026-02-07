# CloudWatch Composite Alarm

**여러 알람**의 상태를 조합해 하나의 알람으로 만드는 기능입니다.

## 동작

- **AND/OR** 조건으로 여러 알람을 묶음. 조합 결과가 ALARM이면 Composite Alarm이 ALARM.
- 노이즈 감소: 여러 알람이 동시에 나올 때만 상위 알람 발생.

## 용도

- 여러 지표·알람을 한 번에 보고, 조건 충족 시에만 알림.

## 요약

- Composite Alarm = 알람들의 AND/OR 조합. 상위 알람 하나로 정리.
