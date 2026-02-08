# MFA (Multi-Factor Authentication)

**비밀번호 외에 두 번째 요소**(OTP·하드웨어 키)로 **본인 확인**을 요구하는 보안 기능입니다.  
Root 계정과 권한이 큰 IAM 사용자에는 **MFA 활성화**를 권장합니다.

---

## 1. AWS에서의 MFA

- **Root 계정**: MFA 설정 시 콘솔 로그인·결제 변경 등에 MFA 입력 필요
- **IAM User**: MFA 디바이스(Virtual MFA, 하드웨어) 연결 가능
- **콘솔 로그인**: 비밀번호 + MFA 코드로 로그인
- **CLI/API**: MFA가 있으면 AssumeRole 시 MFA 코드 요구 가능(정책으로 설정)

---

## 2. 용도

- Root·관리자 계정 탈취 방지
- 중요 작업(삭제·정책 변경) 전 재인증
- 규정 준수 요구사항 충족

---

## 요약

| 항목 | 설명 |
|------|------|
| MFA | 비밀번호 + 두 번째 요소(OTP 등) |
| Root | MFA 활성화 강력 권장 |
| IAM User | Virtual MFA 또는 하드웨어 MFA 연결 |
