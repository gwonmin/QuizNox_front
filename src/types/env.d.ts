interface ImportMetaEnv {
  VITE_QUIZNOX_API_GATEWAY_URL: string;  // QuizNox 백엔드 공통 (퀴즈·이용 후기 등)
  VITE_AUTH_API_URL: string;             // 인증 API Gateway
  VITE_APP_NAME: string;
  VITE_APP_VERSION: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
