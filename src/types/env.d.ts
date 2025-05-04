interface ImportMetaEnv {
  VITE_API_GATEWAY_URL: string;
  VITE_APP_NAME: string;
  VITE_APP_VERSION: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
