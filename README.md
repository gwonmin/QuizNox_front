# QUIZNOX Frontend

QUIZNOX는 빠르고 직관적인 웹 기반 퀴즈 플랫폼입니다.  
본 프로젝트는 React 19와 Vite를 기반으로 하며, AWS 환경에 최적화된 클라이언트 앱입니다.

---

## 🚀 기술 스택

| 영역 | 기술 |
|------|------|
| 프레임워크 | [React 19](https://react.dev/) + [Vite 6](https://vitejs.dev/) |
| 언어 | TypeScript 5 |
| 상태 관리 | Redux Toolkit |
| 라우팅 | React Router DOM v7 |
| 스타일 | Tailwind CSS v3.4 |
| 리스트 렌더링 최적화 | react-window |
| 빌드 배포 | AWS S3 + CloudFront |

---

## 📦 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 빌드 결과물 미리보기
npm run preview
```
## 🌐 환경변수 설정

```bash
VITE_API_GATEWAY_URL=https://your-api-gateway-url
```
## ☁️ 배포 (S3 + CloudFront)
```bash
npm run build

# S3에 업로드
aws s3 sync dist/ s3://your-bucket-name --delete

# CloudFront 캐시 무효화 (선택)
aws cloudfront create-invalidation \
  --distribution-id <배포 ID> \
  --paths "/*"
```

## 🎯 Lighthouse 최적화 체크리스트

✅ 코드 스플리팅 (React.lazy + Suspense)

