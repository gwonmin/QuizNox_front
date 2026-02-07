# STS / AssumeRole

**임시 보안 자격 증명**을 발급하는 서비스와 **역할 전환** 방식입니다.

## STS (Security Token Service)

- **임시 자격 증명** 발급 (Access Key, Secret Key, Session Token)
- 만료 시간이 있어 장기 보관 키보다 안전
- AssumeRole, GetSessionToken 등으로 발급

## AssumeRole

- **다른 IAM 역할**을 “맡아서” 그 역할의 권한으로 동작
- STS가 해당 역할의 임시 자격 증명을 반환
- 크로스 계정·서비스 간 위임에 사용

## 요약

| 구분 | 설명 |
|------|------|
| STS | 임시 자격 증명 발급 |
| AssumeRole | 다른 역할로 전환 후 임시 자격 증명 사용 |
