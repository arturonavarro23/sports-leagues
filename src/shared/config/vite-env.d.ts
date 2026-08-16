/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SPORTS_DB_API_BASE_URL?: string;
  readonly VITE_ENABLE_MOCK_API?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
