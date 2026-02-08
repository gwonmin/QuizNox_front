# API Gateway Authorizer

**API 호출 전**에 요청을 허용할지 결정하는 **인증·인가** 단계입니다. Cognito·JWT·Lambda 등으로 토큰·헤더 검증 후 백엔드 호출을 제어합니다.

---

## 1. 특징

- **Lambda Authorizer(Token 기반)**: 커스텀 토큰(헤더 등) 검증 후 **IAM 정책(Allow/Deny)** 반환. **캐싱** 가능 → 동일 토큰 재검증 감소. 캐시 때문에 IdP에서 권한 변경해도 일정 시간 반영 안 될 수 있음.
- **Lambda Authorizer(Request 기반)**: 요청 파라미터·헤더·라우팅 등 여러 요소로 인가. 캐싱 옵션 있음.
- **Cognito User Pool Authorizer**: **JWT(Id/Access 토큰)** 검증. 회원가입·로그인·MFA는 Cognito User Pool; API 인증은 Authorizer에서 Cognito 토큰 검증. **토큰 만료·자동 갱신** 지원.
- **JWT Authorizer(HTTP API)**: JWT 검증만 필요할 때 HTTP API에서 JWT Authorizer 사용(코드 없이).
- **IAM Authorizer**: IAM 정책으로 API 호출 권한 제어(주로 AWS 내부 호출).

---

## 2. 시나리오

| 조건 | 선택 |
|------|------|
| 회원가입·로그인·MFA 후 API 접근 | Cognito User Pool + Cognito User Pool Authorizer; Authorization 헤더에 토큰 전달 |
| 부서·역할별 API 접근 제한 | Lambda Authorizer에서 토큰 클레임(예: Department) 검사; 캐시 사용 시 권한 변경 지연 가능 |
| JWT만 검증·간단한 구성 | HTTP API + JWT Authorizer |
| 로그인 시 이메일 알림(운영 효율) | **Cognito post-authentication Lambda trigger**에서 SES로 이메일 전송. |
| REST API에서 토큰·커스텀 로직 | Lambda Authorizer(Token 또는 Request) |
| 403 Forbidden(Cognito 사용 시) | Authorization 헤더에 **유효한 Cognito 토큰** 포함 여부 확인 |

---

## 기출빈출

| 시나리오 | 접근 |
|----------|------|
| 등록 사용자만 API 접근 | **Cognito User Pool** + **Cognito User Pool Authorizer**; Authorization 헤더에 토큰. |
| 부서·역할별 접근(Sales만 등) | **Lambda Authorizer**에서 토큰 클레임(예: Department) 검사. |
| 권한 변경했는데 API는 이전 권한으로 동작 | Authorizer **캐시** 비활성화 또는 TTL 짧게 해서 즉시 반영. |
| JWT만 검증·코드 없이 | **HTTP API** + **JWT Authorizer**. |

---

## 요약

| 항목 | 설명 |
|------|------|
| Authorizer | API 호출 전 인증·인가; Allow 시 백엔드 호출 |
| Cognito | User Pool(가입·로그인) + Authorizer로 JWT 검증 |
| Lambda Authorizer | 커스텀 토큰·요청 검증, 캐싱 가능 |
| 조건 | "회원만 API" → Cognito Authorizer / "역할·속성 기반" → Lambda Authorizer |
