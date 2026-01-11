

## 1) 소개
QUIZNOX는 토픽별 풀이, 퀴즈 목록, 모의고사 기능을 제공하며, 회원가입/로그인/로그아웃을 포함한 완전한 인증 흐름을 제공합니다.

## 2) 기술 스택

### Frontend
- React 19 · Vite 6 · TypeScript 5
- Zustand(클라이언트 상태) · TanStack Query v5(서버 상태)
- React Router DOM v7 · Axios · Tailwind CSS 3
- 패키지 매니저: pnpm

### Backend
- Node.js, Fastify, serverless-http
- Serverless / Cloud: AWS Lambda, API Gateway, Serverless Framework
- Database: DynamoDB
- CI/CD: GitHub Actions

## 3) 주요 설계 및 의사결정

- **서버리스 아키텍처 채택**으로 상시 실행 서버 제거 및 비용 최소화
- 콜드 스타트 영향을 고려해 **Fastify 기반 경량 API 구성**
- `serverless-http`를 활용해 기존 애플리케이션 구조를 유지하며 Lambda에 적용
- **DynamoDB**를 사용해 서버리스 환경에 적합한 무중단 데이터 구조 설계

## 4) CI/CD 및 운영 자동화

- **GitHub Actions 기반 CI/CD 구성**
    - Frontend: `build → S3 sync → CloudFront invalidation` 자동화
    - Backend: 테스트 통과 조건 기반 CI/CD 파이프라인을 구성하고, CodeCov 연동 및 **Serverless Framework 기반 배포 자동화**로 백엔드 배포 신뢰성 확보

## 5) 사용법
- `문제풀기`에서 토픽을 선택해 퀴즈를 풉니다.
- `모의고사`에서 랜덤 추출된 문항으로 시험을 진행합니다.(모바일 사용불가)
- 로그인 후 우상단 프로필 메뉴에서 `로그아웃`을 수행할 수 있습니다.


## 📒 패치 이력
<details>
  <summary>2025-01-11 README 업데이트</summary>
  
 - 근거: README에 서버리스 아키텍처, CI/CD 구성, 설계 의사결정 등 누락된 내용 보완 필요
 - 구현: 기술 스택 섹션에 Backend 정보 추가, 주요 설계 및 의사결정 섹션 신설,
   CI/CD 및 운영 자동화 섹션 추가
 - 효과: 프로젝트의 전체적인 아키텍처와 운영 방식을 문서화하여 가독성 향상
</details>
<details>
  <summary>2025-10-07 로딩 UX 통합</summary>
  
 - 근거: 전면 스피너로 인한 깜빡임/가림 → UX 저하
 - 구현: LoadingOverlay(파란 테마), ProtectedRoute 오버레이,
   로그인/로그아웃 맞춤 메시지
 - 효과: 화면 전환 자연스러움 개선, 스피너 노출 시간 감소,
   로그인/로그아웃 전환 안정성 향상
</details>
<details>
  <summary>2025-10-07 상태 관리/데이터 패칭 마이그레이션</summary>
  
 - 근거: Redux 보일러플레이트/복잡성 → 단순하고 타입 친화적인
   대안 필요
 - 구현: Redux → Zustand, Axios + TanStack Query 도입,
   모의고사 쿼리 키/캐시 전략 개선
 - 효과: 불필요 네트워크 요청 감소, 재렌더 횟수 감소,
   쿼리 캐시 효율 향상, 코드량 감소
</details>
<details>
  <summary>2025-10-07 CI 및 PWA 메타 업데이트</summary>
  
 - 근거: CI 속도/일관성 향상, 최신 표준 준수
 - 구현: GitHub Actions pnpm 전환,
   mobile-web-app-capable 메타 적용
 - 효과: CI 파이프라인 시간 단축, 의존성 설치 속도 개선,
   초기 구동 TTI 개선
</details>








