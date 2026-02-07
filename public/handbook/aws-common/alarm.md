# CloudWatch Alarm

**지표가 조건을 만족**하면 알림·동작을 수행하는 설정입니다.

## 동작

- **지표·조건**(임계값, 기간, 샘플 수) 설정
- 조건 충족 시 **OK / ALARM** 상태 전환
- SNS 알림, Auto Scaling 연동, 이벤트 등 액션 연결 가능

## 상태

- OK: 조건 미충족
- ALARM: 조건 충족
- INSUFFICIENT_DATA: 데이터 부족

## 요약

- Alarm = 지표 기반 조건 → 상태 변경 → 알림·연동 액션
