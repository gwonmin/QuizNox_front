# Core CS · 실제 구조 흐름

네트워크 · 분산 시스템 · 보안 기본 · 운영 & 신뢰성이 **실제 구조에서 어떻게 쓰이는지** 흐름으로만 정리했습니다.  
다이어그램 노드를 클릭하면 해당 개념 문서로 이동합니다.

---

## 1. 네트워크

### 1-1. 주소 · 서브넷 · 라우팅 · NAT

```mermaid
flowchart LR
  subgraph addr [주소]
    IP([📍 IP / CIDR])
    SUB([🔀 서브넷])
  end
  subgraph path [경로]
    RT([📋 라우팅 테이블])
    N([🔄 NAT])
  end
  IP --> SUB
  SUB --> RT
  RT --> N
  N --> E[💻 컴퓨트]
```

### 1-2. 프로토콜 · DNS · TLS · 로드밸런서

```mermaid
flowchart TB
  U[👤 User]
  subgraph protocol [전송·프로토콜]
    P([📡 TCP/UDP])
  end
  subgraph name [이름 해석]
    D([🌐 DNS])
  end
  subgraph secure [보안]
    T([🔒 TLS])
  end
  subgraph lb [로드밸런싱]
    L7([⚖️ L7 LB])
    L4([⚖️ L4 LB])
  end
  E[💻 컴퓨트]
  U --> P
  P --> D
  D --> T
  T --> L7
  L7 --> L4
  L4 --> E
```

---

## 2. 분산 시스템

### 2-1. 확장 · Stateless · Scale-up / Scale-out

```mermaid
flowchart LR
  subgraph scale [확장]
    SU([📈 Scale-up])
    SO([↔️ Scale-out])
  end
  subgraph app [앱]
    S([⚡ Stateless])
    ST([💾 Stateful])
  end
  SU --> ST
  SO --> S
  S --> Q([📬 Queue])
```

### 2-2. Queue · Pub-Sub · Event-driven · 일관성 · CAP

```mermaid
flowchart LR
  subgraph msg [메시징]
    Q([📬 Queue])
    P([📢 Pub-Sub])
    EV([⚡ Event-driven])
  end
  subgraph safe [복원]
    ID([🔁 Idempotency])
    RB([🔄 Retry/Backoff])
  end
  subgraph data [저장]
    CAP([📐 CAP])
    CON([⚖️ Consistency Model])
  end
  Q --> ID
  P --> EV
  ID --> RB
  RB --> Q
  EV --> CON
  CAP --> CON
```

---

## 3. 보안 기본

### 3-1. 인증 · 인가 · 암호화 · 최소 권한 · 방화벽

```mermaid
flowchart TB
  subgraph auth [인증/인가]
    A1([🔐 Authentication])
    A2([🎫 Authorization])
  end
  subgraph policy [정책]
    LP([🛡️ Least Privilege])
  end
  subgraph data [해시·암호화]
    H([#️⃣ Hash vs Encryption])
  end
  subgraph boundary [경계]
    FW([🧱 Firewall])
  end
  A1 --> A2
  A2 --> LP
  LP --> H
  H --> FW
```

---

## 4. 운영 & 신뢰성

### 4-1. HA · 관측성 · 복구 · SLI/SLO · 캐시

```mermaid
flowchart TB
  subgraph ha [고가용성]
    HA([🏗️ HA 설계])
  end
  subgraph observe [관측성]
    O([📊 Logs / Metrics / Traces])
    AL([🔔 Alarm])
  end
  subgraph dr [복구]
    RPO([⏪ RPO])
    RTO([⏱️ RTO])
  end
  subgraph goal [목표]
    S([🎯 SLI / SLO])
  end
  subgraph perf [성능]
    C([💾 캐시 원리])
  end
  HA --> O
  O --> AL
  AL --> S
  RPO --> RTO
  RTO --> S
  C --> O
```

---

세부 설명은 각 개념 문서에서 이어서 읽을 수 있습니다.
