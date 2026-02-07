# Policy Evaluation Logic (IAM)

IAM에서 권한 허용/거부는 **정책 평가 로직**에 따라 결정됩니다.

## 평가 순서

1. **기본적으로 거부** (Deny by default)
2. **명시적 Deny**가 있으면 → **거부**
3. **명시적 Allow**가 있으면 → **허용**
4. Allow/Deny 모두 없으면 → **거부**

```mermaid
flowchart TD
  A[요청] --> B{명시적 Deny?}
  B -->|Yes| C[거부]
  B -->|No| D{명시적 Allow?}
  D -->|Yes| E[허용]
  D -->|No| F[거부]
```

## 핵심 원칙

- **Explicit Deny 우선**: 어떤 정책에서든 `"Effect": "Deny"`가 있으면 해당 액션은 거부됩니다.
- **Identity-based + Resource-based** 정책이 모두 적용되며, 둘 중 하나라도 Deny면 거부입니다.

## AWS 공통 연결

- **IAM 정책**, **S3 버킷 정책**, **SQS 큐 정책** 등에서 동일한 평가 로직이 사용됩니다.
