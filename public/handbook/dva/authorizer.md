# API Gateway Authorizer

**요청을 허용할지** 결정하는 인증·인가 단계입니다.

## 유형

- **Lambda Authorizer**: 커스텀 토큰 검증·정책 반환.
- **JWT Authorizer**(HTTP API): JWT 검증.
- **IAM**: IAM 정책으로 API 호출 권한 제어.

## 동작

- Authorizer가 **Allow/Deny** 정책 반환. Allow 시 백엔드 호출.

## 요약

- Authorizer = API 호출 전 인증·인가. Lambda/JWT/IAM 등 선택 가능.
