# 2. AWS 공통 · 개요

시험 공통 기반 서비스 사고와 의사결정 프레임을 한눈에 볼 수 있습니다.  
노드를 클릭하면 해당 개념 문서로 이동합니다.

---

## IAM 심화

```mermaid
flowchart TB
  subgraph iam [IAM 심화]
    P([Policy Evaluation])
    I([Identity-based vs Resource-based])
    E([Explicit Deny])
    S([STS / AssumeRole])
    C([Cross-account])
  end
  P --> I --> E
  S --> C
```

---

## VPC 기본 구조

```mermaid
flowchart TB
  subgraph vpc [VPC 기본]
    SUB([Public / Private subnet])
    GW([IGW vs NAT])
    SG([Security Group])
    NL([NACL])
    EP([VPC Endpoint])
  end
  SUB --> GW --> SG
  NL --> EP
```

---

## S3 핵심

```mermaid
flowchart TB
  subgraph s3 [S3 핵심]
    CON([S3 Consistency])
    VER([S3 Versioning])
    LIF([S3 Lifecycle])
    SSE([SSE-S3 vs SSE-KMS])
    CR([CRR / SRR])
  end
  CON --> VER --> LIF
  SSE --> CR
```

---

## Auto Scaling & ELB

```mermaid
flowchart TB
  subgraph asg [ASG & ELB]
    TG([Target Group])
    HC([Health Check])
    ST([Sticky Session])
    SC([Scaling Policy])
  end
  TG --> HC
  ST --> SC
```

---

## Monitoring & Logging

```mermaid
flowchart TB
  subgraph mon [Monitoring & Logging]
    CW([CloudWatch Metrics / Logs])
    AL([Alarm])
    CT([CloudTrail vs Config])
  end
  CW --> AL
  AL --> CT
```

---

세부 설명은 각 개념 문서에서 이어서 읽을 수 있습니다.
