import { Codex } from "@codex-storage/sdk-js";
import { WebStorage } from "../utils/web-storage";

let client: Codex;
let url: string;

export const CodexSdk = {
  url() {
    return url;
  },

  load() {
    return WebStorage.get<string>("codex-node-url").then((url) => {
      url = url || import.meta.env.VITE_CODEX_API_URL;
      client = new Codex(url);
    });
  },

  updateURL(url: string) {
    url = url;
    client = new Codex(url);

    return WebStorage.set("codex-node-url", url);
  },

  get debug() {
    return client.debug;
  },

  get data() {
    return client.data;
  },

  get node() {
    return client.node;
  },

  get marketplace() {
    return client.marketplace;
  },
};
