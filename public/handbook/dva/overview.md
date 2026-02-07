# 4. DVA (Developer) · 개요

실제 코드·서비스 동작 이해를 한눈에 볼 수 있습니다.  
노드를 클릭하면 해당 개념 문서로 이동합니다.

---

## Lambda 심화

```mermaid
flowchart TB
  subgraph lambda [Lambda]
    LC([Lambda Concurrency])
    CS([Cold Start])
    DL([DLQ / Destinations])
  end
  LC --> CS
  DL
```

---

## API Gateway

```mermaid
flowchart TB
  subgraph api [API Gateway]
    RH([REST vs HTTP API])
    AZ([Authorizer])
    TH([Throttling])
  end
  RH --> AZ --> TH
```

---

## DynamoDB 심화

```mermaid
flowchart TB
  subgraph ddb [DynamoDB]
    PK([Partition Key 설계])
    GI([GSI / LSI])
    CU([Conditional Update])
    ST([Streams])
  end
  PK --> GI
  CU --> ST
```

---

## Event-Driven

```mermaid
flowchart TB
  subgraph evt [Event-Driven]
    SQ([SQS Visibility Timeout])
    SN([SNS Fan-out])
    EB([EventBridge])
  end
  SQ --> SN --> EB
```

---

## CI/CD

```mermaid
flowchart TB
  subgraph cicd [CI/CD]
    CP([CodePipeline])
    CB([CodeBuild])
    SAM([SAM])
  end
  CP --> CB
  SAM
```

---

세부 설명은 각 개념 문서에서 이어서 읽을 수 있습니다.
