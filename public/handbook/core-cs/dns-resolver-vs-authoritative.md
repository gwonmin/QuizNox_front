# DNS Resolver vs Authoritative

DNS에서 **이름을 누가 물어보고, 누가 답하는지** 역할만 구분합니다.

## Resolver (해석자)

- **클라이언트 대신** 도메인 이름을 조회하는 주체
- “www.example.com → IP가 뭐야?”라고 **질문**하는 쪽
- 재귀 조회: 여러 네임서버를 거쳐 최종 IP를 가져와 클라이언트에 전달

## Authoritative (권한 서버)

- 해당 도메인에 대한 **정답을 갖고 있는** 네임서버
- “example.com” 구간에 대한 레코드를 **직접 보관·응답**
- Resolver가 이 서버에게 물어보면, 여기서 IP(또는 CNAME 등)를 답함

```mermaid
flowchart LR
  C[클라이언트] --> R[Resolver]
  R --> A[Authoritative]
  A --> R
  R --> C
```

## 구분 요약

| 구분 | Resolver | Authoritative |
|------|----------|---------------|
| 역할 | 이름 → IP 조회 요청·수집 | 해당 도메인 레코드 보관·응답 |
| 방향 | 질문하는 쪽 | 답하는 쪽 |
