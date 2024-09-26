/// <reference types='vite/client' />

declare const __APP_VERSION__: string;

interface ImportMetaEnv {
  VITE_CODEX_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
