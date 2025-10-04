interface ImportMetaEnv {
  VITE_QUIZNOX_API_GATEWAY_URL: string;  // 퀴즈/모의고사 API Gateway
  VITE_AUTH_API_URL: string;             // 인증 API Gateway
  VITE_APP_NAME: string;
  VITE_APP_VERSION: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
