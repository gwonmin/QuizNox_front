

---

## 1. Networking Fundamentals

### 주소 · 라우팅 · NAT · DNS · 프로토콜 · LB

```mermaid
flowchart LR
  subgraph addr [주소·경로]
    IP([IP / CIDR / Subnet])
    RT([Routing])
    N([NAT])
  end
  subgraph protocol [프로토콜·보안]
    D([DNS])
    P([TCP / UDP])
    T([HTTP / TLS])
  end
  subgraph lb [로드밸런싱]
    L7([L7 LB])
    L4([L4 LB])
  end
  IP --> RT --> N
  N --> D --> P --> T
  T --> L7 --> L4
  L4 --> E[컴퓨트]
```

---

## 2. Data & Storage Fundamentals

### Block / File / Object · IOPS · ACID · Index · Cache

```mermaid
flowchart TB
  subgraph storage [저장 유형]
    B([Block])
    F([File])
    O([Object])
  end
  subgraph perf [성능·일관성]
    IO([Latency / Throughput / IOPS])
    AC([ACID / 트랜잭션 / 락])
    IX([Index])
  end
  subgraph cache [캐시]
    C([Cache hit/miss, TTL])
  end
  B --> IO
  F --> IO
  O --> IO
  IO --> AC
  AC --> IX
  IX --> C
```

---

## 3. Distributed Systems Essentials

### Stateless · Scale · 일관성 · Queue · Idempotency · 분산 TX · 분산 락

```mermaid
flowchart LR
  subgraph scale [확장]
    SU([Scale-up])
    SO([Scale-out])
  end
  subgraph app [앱]
    S([Stateless])
    ST([Stateful])
  end
  subgraph msg [메시징]
    Q([Queue])
    P([Pub/Sub])
  end
  subgraph event [이벤트 기반]
    EDA([Event-driven Architecture])
  end
  subgraph safe [일관성·재시도·분산]
    ID([Idempotency])
    CON([Consistency Model])
    CAP([CAP])
    DT([분산 TX · 분산 락])
  end
  SU --> ST
  SO --> S
  S --> Q
  Q --> EDA
  P --> EDA
  EDA --> ID
  ID --> CON
  CAP --> CON
  CON --> DT
```

---

## 4. Security Basics

### 인증·인가 · 암호화·해시 · 최소 권한 · 네트워크 보안

```mermaid
flowchart TB
  subgraph auth [인증·인가]
    A1([Authn])
    A2([Authz])
  end
  subgraph crypto [암호화]
    H([Hash vs Encryption])
    SY([Symmetric / Asymmetric])
  end
  subgraph policy [정책]
    LP([Least Privilege])
  end
  subgraph net [네트워크 보안]
    FW([인바운드/아웃바운드])
  end
  A1 --> A2
  A2 --> H
  H --> SY
  SY --> LP
  LP --> FW
```

---

## 5. Reliability & Operations

### 관측성 · 장애 대응 · Throttling · DR · HA · SLO

```mermaid
flowchart TB
  subgraph observe [관측성]
    O([Logs / Metrics / Traces])
  end
  subgraph failure [장애 대응]
    RB([Retry / Backoff / Jitter])
    TH([Throttling / Rate limit])
  end
  subgraph dr [복구]
    RPO([RPO])
    RTO([RTO])
  end
  subgraph ha [고가용성]
    HA([HA / active-active])
    SLO([SLI / SLO])
  end
  O --> RB
  RB --> TH
  TH --> RPO
  RPO --> RTO
  RTO --> HA
  HA --> SLO
```

---

## 6. Containers & Orchestration


```mermaid
flowchart TB

  ctHw["물리 서버"]
  ctHost["Host OS"]
  ctReg["이미지 레지스트리"]
  ctImg["컨테이너 이미지"]
  ctSvc["서비스 엔드포인트(LB 등)"]
  ctOrcNode["Container Orchestration"]

  ctHw --> ctHost --> ctOrcNode
  ctReg --> ctImg --> ctOrcNode
  ctSvc --> ctOrcNode
```

---

세부 설명은 각 개념 문서에서 이어서 읽을 수 있습니다.
