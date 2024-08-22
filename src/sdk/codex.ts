import { Codex } from "@codex/sdk-js";

export const CodexSdk = new Codex(import.meta.env.VITE_CODEX_API_URL);
