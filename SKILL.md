## 스킬 이름

- **이름**: QuizNox Frontend Helper
- **적용 범위**: `QuizNox_front` 레포 전체 (React/Vite/TypeScript, 상태관리, 라우팅, 빌드/배포)
- **우선순위**: 높음 (QuizNox 프론트엔드 관련 작업 요청 시 우선 적용)

---

## 이 스킬이 하는 일

- **목적**
  - QuizNox 프론트엔드(핸드북, 기출문제, 모의고사, 인증 UI 등)에 대한 기능 추가/수정, 상태 관리, API 연동, 빌드/배포를 일관된 방식으로 지원한다.
- **언제 사용해야 하는지**
  - 사용자가 React 컴포넌트, Zustand 상태, TanStack Query, Axios, 라우팅, UI/UX 개선, 핸드북 화면 등에 대한 변경을 요청할 때
- **하지 말아야 할 일**
  - AuthCore/QuizNox API/cluster-infra의 서버·인프라 코드를 이 레포에서 직접 수정하려고 하지 않는다(해당 레포를 안내만 한다).
  - 브라우저 보안(CORS, JWT 저장소 등)과 충돌하는 위험한 패턴(localStorage 남용 등)을 그대로 확장하는 대신, 리스크를 분명히 설명한다.

---

## 프로젝트 개요

- **한 줄 요약**: QuizNox 서비스의 사용자-facing 프론트엔드. React 19 + Vite 6 + TypeScript 5 기반 SPA로, 핸드북/퀴즈/모의고사/인증 플로우를 제공한다.
- **주요 기술 스택**
  - Framework/Build: React 19, Vite 6, TypeScript
  - 상태 관리: Zustand (클라이언트 상태), TanStack Query v5 (서버 상태)
  - 라우팅: React Router DOM v7
  - UI: Tailwind CSS, shadcn-ui, framer-motion, lucide-react
  - 마크다운/다이어그램: `react-markdown`, `remark-gfm`, `rehype-raw`, `rehype-sanitize`, `mermaid`
  - HTTP: Axios (JWT 인터셉터 포함)
- **중요 디렉토리 (일부)**
  - `src/components/` – 공통 UI 컴포넌트 및 핸드북 관련 컴포넌트 (`Navbar.tsx`, `handbook/HandbookSearchInput.tsx` 등)
  - `src/pages/Quiz/` – 퀴즈 목록/플레이 페이지 (`List.tsx`, `Play.tsx`)
  - `src/...` – 라우팅, 상태, API 클라이언트, 레이아웃 등 (실제 구조에 맞춰 탐색)

---

## 작업 방식 가이드

- **코드 스타일 / 규칙**
  - React 컴포넌트는 함수형 컴포넌트로 작성하고, TypeScript 타입 정의를 명확하게 둔다.
  - 프레젠테이션/컨테이너 역할을 분리하려 노력하되, 과한 추상화는 피한다.
  - 상태는 다음 기준으로 나눈다.
    - **Zustand**: UI/클라이언트 상태(선택한 토픽, 모달 상태 등)
    - **TanStack Query**: 서버 데이터(문제 목록, 핸드북 내용, AuthCore/QuizNox API 응답)
- **API 연동**
  - Axios 인스턴스와 인터셉터를 사용해 JWT를 자동으로 헤더에 붙이고, 401 발생 시 리프레시 흐름을 따른다.
  - AuthCore/QuizNox API 스펙 변경이 필요한 경우, 먼저 API 레포(`AuthCore`, `QuizNox_back`)의 계약을 확인한 뒤 프론트 변경을 제안한다.
- **테스트 (필요 시)**
  - 이 레포는 직접적인 테스트 스크립트가 package.json에 명시되어 있지 않지만, React Testing Library/Playwright 등의 도입을 제안할 때는 Vite + React 19와 호환되는 설정을 기준으로 설명한다.

---

## 도구 / 커맨드

- **로컬 개발**
  - 의존성 설치: `pnpm install` (pnpm 사용 전제)
  - 개발 서버:
    - 기본: `pnpm dev`
    - 로컬 백엔드용: `pnpm dev:local` (`--mode localdev`)
- **빌드/검증**
  - 타입 체크 + 빌드: `pnpm build`
  - 린트: `pnpm lint`
  - 프리뷰 서버: `pnpm preview`

---

## 제약 사항 / 주의점

- **보안 / 인증**
  - JWT는 AuthCore가 발급/검증하는 것을 전제로 한다. 프론트는 저장 위치(localStorage 등)와 인터셉터 동작, 만료/리프레시 흐름을 일관되게 유지한다.
  - 예제 코드에서 토큰 값을 노출할 때는 더미 문자열을 사용하고, 실제 토큰/유저정보는 절대 넣지 않는다.
- **아키텍처 제약**
  - AuthCore/QuizNox API와의 통신 계층(Axios 인스턴스, React Query hooks 등)을 최대한 공통화하고, 각 페이지에서 직접 `axios.get`을 난발하지 않는다.
  - 핸드북/퀴즈/모의고사 화면은 README에 정리된 UX 흐름(다이어그램↔문서 이동, 프로필 메뉴, 네비게이션 구조 등)을 해치지 않는 선에서 변경을 제안한다.

---

## 답변 스타일

- **언어**: 한국어, 코드/라이브러리/컴포넌트 이름은 영어 그대로
- **톤**: 프론트엔드 리드 개발자가 리뷰해 주듯, 구현 방향과 트레이드오프를 짚어 주는 수준
- **길이**:
  - 특정 컴포넌트/상태 변경: 예제 코드 중심, 설명은 최소한
  - 구조/아키텍처 변경: README의 아키텍처/플로우 설명을 참고해서 고수준 요약 포함

---

## 예시 시나리오

- **예시 1 – 핸드북 검색 UX 개선**
  - 사용자가 “핸드북 검색창 UX 좀 개선해 줘”라고 하면:
    - `src/components/handbook/HandbookSearchInput.tsx`를 찾아 현재 UX를 파악한다.
    - 디바운싱, 검색어 하이라이팅, 최근 검색어 등의 아이디어를 제안하고, Zustand/React Query와 어떻게 연결할지 예제 코드를 제공한다.
- **예시 2 – 모의고사 결과 화면 추가**
  - 사용자가 “모의고사 종료 후 점수 요약 화면을 만들고 싶어”라고 하면:
    - `src/pages/Quiz/Play.tsx`를 기준으로 모의고사 흐름을 분석한다.
    - Zustand/React Query에서 어떤 데이터를 재사용할지 결정하고, 새 페이지/컴포넌트 구조를 제안한다.
- **예시 3 – AuthCore 연동 변경**
  - 사용자가 “로그인 후 반환되는 사용자 정보 필드가 바뀌었어”라고 하면:
    - Axios 인터셉터 및 인증 관련 상태 관리 부분을 찾아 계약 변경 영향을 분석한다.
    - 타입 정의, 상태 구조, 라우팅 보호(ProtectedRoute 등)에서 필요한 수정 포인트를 정리하고 예제 코드를 제시한다.

