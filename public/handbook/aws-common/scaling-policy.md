# Scaling Policy (Target tracking)

**지표를 목표치에 맞추도록** 인스턴스 수를 자동 조정하는 정책입니다.

## Target tracking

- **목표 지표**(예: CPU 70%, 요청 수 1000/분)를 설정
- 현재 값이 목표보다 높으면 스케일 아웃, 낮으면 스케일 인
- 단순 설정으로 자동 조정

## 기타

- Step scaling: 임계값·단계별 조정량 설정
- Scheduled: 시간대별 용량 예약

## 요약

- Target tracking = “이 지표를 이 수준으로 유지”하도록 ASG 용량 자동 조정
