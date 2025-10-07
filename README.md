

## 1) 소개
QUIZNOX는 자격증 시험 준비에 최적화된 빠르고 직관적인 웹 앱입니다. 토픽별 풀이, 퀴즈 목록, 모의고사 기능을 제공하며, 로그인/회원가입/로그아웃을 포함한 완전한 인증 흐름을 제공합니다.

## 2) 빌드와 기술 스택
- React 19 · Vite 6 · TypeScript 5
- Zustand(클라이언트 상태) · TanStack Query v5(서버 상태)
- React Router DOM v7 · Axios · Tailwind CSS 3
- 패키지 매니저: pnpm

## 3) 사용법
- `문제풀기`에서 토픽을 선택해 퀴즈를 풉니다.
- `모의고사`에서 랜덤 추출된 문항으로 시험을 진행합니다.(모바일 사용불가)
- 로그인 후 우상단 프로필 메뉴에서 `로그아웃`을 수행할 수 있습니다.


## 📒 패치 이력
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








