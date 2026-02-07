# 3. SAA (Architect) · 개요

요구사항 기반 아키텍처 설계를 한눈에 볼 수 있습니다.  
노드를 클릭하면 해당 개념 문서로 이동합니다.

---

## Compute 선택 프레임

```mermaid
flowchart TB
  subgraph compute [Compute 선택]
    EC([EC2 vs Lambda vs ECS vs EKS])
    TR([Compute Tradeoff])
  end
  EC --> TR
```

---

## Database 선택

```mermaid
flowchart TB
  subgraph db [Database]
    RD([RDS vs Aurora])
    MR([Multi-AZ vs Read Replica])
    DY([DynamoDB 사용 케이스])
  end
  RD --> MR
  DY
```

---

## Storage 설계

```mermaid
flowchart TB
  subgraph storage [Storage]
    EB([EBS vs EFS vs FSx])
    S3([S3 정적 호스팅])
    CF([CloudFront 연동])
  end
  EB --> S3 --> CF
```

---

## Connectivity

```mermaid
flowchart TB
  subgraph conn [Connectivity]
    VP([VPC Peering])
    TG([Transit Gateway])
    DX([Direct Connect / VPN])
  end
  VP --> TG --> DX
```

---

## DR 패턴

```mermaid
flowchart TB
  subgraph dr [DR 패턴]
    BK([Backup])
    PL([Pilot Light])
    WS([Warm Standby])
    AA([Active-Active])
  end
  BK --> PL --> WS --> AA
```

---

세부 설명은 각 개념 문서에서 이어서 읽을 수 있습니다.
