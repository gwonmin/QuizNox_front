# Cross-account 접근 패턴

**다른 AWS 계정**의 리소스에 접근하는 방식입니다.

## 패턴

- **역할 위임**: 계정 A가 계정 B의 역할을 AssumeRole하도록 B가 허용(Trust policy)
- **리소스 정책**: 계정 B의 S3 버킷 정책 등에서 계정 A의 역할/사용자 허용
- **AssumeRole**로 계정 B 역할을 맡으면, B 계정 내 리소스에 접근

## 요약

- Cross-account = 계정 B가 A에게 역할 Assume 허용 + A가 AssumeRole 호출
- 리소스 정책(Resource-based)으로 “어떤 외부 주체를 허용할지” 정의
