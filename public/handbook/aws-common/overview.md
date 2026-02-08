

---

## 1. Networking (VPC · 서브넷 · 보안)

```mermaid
flowchart TB
  subgraph vpc [VPC · 서브넷 · 보안]
    SUB([Public / Private subnet])
    RT([Route Table])
    GW([IGW vs NAT])
    EIP([Elastic IP])
    SG([Security Group])
    NL([NACL])
    EP([VPC Endpoint])
  end
```

---

## 2. Identity & Access (IAM)

```mermaid
flowchart TB
  subgraph iam [IAM]
    UR([User vs Role])
    P([Policy Evaluation])
    I([Identity-based vs Resource-based])
    E([Explicit Deny])
    S([STS / AssumeRole])
    C([Cross-account])
    M([MFA])
  end
```

---

## 3. Storage & Data (S3 · EBS · EFS · RDS · DynamoDB · ElastiCache)

```mermaid
flowchart TB
  subgraph stor [S3 · EBS · EFS · RDS · DynamoDB · ElastiCache]
    S3([S3])
    EBS([EBS 기본])
    EFS([EFS 기본])
    RDS([RDS 기본])
    DDB([DynamoDB])
    EC([ElastiCache])
  end
```

---

## 4. Compute & Scaling (EC2 · Lambda · ECS · EKS · ELB · ASG)

```mermaid
flowchart TB
  subgraph comp [EC2 · Lambda · ECS · EKS · ELB · ASG]
    EC2([EC2 개요])
    LB([Lambda])
    ECS([ECS 기본])
    EKS([EKS 기본])
    ELB([ALB vs NLB])
    TG([Target Group])
    HC([Health Check])
    ST([Sticky Session])
    ASG([ASG 기본])
    SC([Scaling Policy])
  end
```

---

## 5. Monitoring & Logging (CloudWatch · 감사)

```mermaid
flowchart TB
  subgraph mon [CloudWatch · 감사]
    CW([CloudWatch Metrics / Logs])
    DB([Dashboard])
    AL([Alarm])
    CT([CloudTrail vs Config])
  end
```

---

세부 설명은 각 대분류 아래 개념 문서에서 이어서 읽을 수 있습니다.
