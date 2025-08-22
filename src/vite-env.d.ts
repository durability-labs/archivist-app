/// <reference types='vite/client' />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
  VITE_ARCHIVIST_API_URL: string;
  VITE_GEO_IP_URL: string;
  VITE_DISCORD_LINK: string;
}

interface ImportMeta {
  readonly PACKAGE_VERSION: string;
  readonly env: ImportMetaEnv;
}
