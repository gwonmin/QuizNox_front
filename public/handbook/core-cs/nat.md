# NAT 개념 (Outbound 전용)

**Private 주소**를 쓰는 호스트가 외부(인터넷)로 나갈 때 **하나의 공인 IP**로 보이게 하는 개념입니다.

## 역할

- 내부 IP는 그대로 두고, **나갈 때만** 출구에서 IP를 공인 주소로 치환(Source NAT)
- 외부에서는 “한 공인 IP에서 나온 트래픽”으로 보임
- 응답은 같은 NAT 장비가 다시 내부 IP로 되돌려 보냄

## Outbound 전용

- 여기서 다루는 NAT는 **내부 → 외부** 방향만 해당
- 외부에서 내부로 들어오는 Inbound NAT(포트 포워딩 등)는 별도 개념

```mermaid
flowchart LR
  subgraph private [내부]
    A[Private IP]
  end
  subgraph nat [NAT]
    N[NAT 변환]
  end
  subgraph public [외부]
    B[공인 IP로 보임]
  end
  A --> N
  N --> B
```

## 요약

- Private 대역이 인터넷에 나갈 수 있게 해주는 것
- 한 공인 IP를 여러 내부 호스트가 공유하는 패턴의 기반
