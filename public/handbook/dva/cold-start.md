# Lambda Cold Start

**첫 호출·오래 비사용 후** 런타임 초기화로 인한 지연입니다.

## 원인

- 인스턴스가 없을 때 **새 인스턴스**를 올리고 런타임·초기화 코드 실행.
- 이 구간이 Cold Start 지연.

## 완화

- **Provisioned Concurrency**: 미리 인스턴스 워밍 유지.
- 패키지 축소, 간단한 런타임 선택으로 초기화 시간 단축.

## 요약

- Cold Start = 첫 실행·오래 비사용 후 초기화 지연. Provisioned Concurrency 등으로 완화.
