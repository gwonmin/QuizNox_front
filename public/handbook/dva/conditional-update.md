# DynamoDB Conditional Update

**조건이 참일 때만** 쓰기를 수행하는 기능입니다.

## 동작

- **ConditionExpression**으로 "속성 존재·값 비교" 등 조건 지정.
- 조건 불만족 시 쓰기 실패(낙관적 락·동시성 제어에 사용).

## 용도

- 낙관적 락, "값이 X일 때만 덮어쓰기" 등.

## 요약

- Conditional Update = 조건 만족 시에만 쓰기. 동시성·무결성 제어에 사용.
