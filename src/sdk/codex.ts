import { Codex } from "@codex-storage/sdk-js";
import { WebStorage } from "../utils/web-storage";

// TODO rename
let _client: Codex;
let _url: string;

export const CodexSdk = {
  url() {
    return _url;
  },

  load() {
    return WebStorage.get<string>("codex-node-url").then((url) => {
      _url = url || import.meta.env.VITE_CODEX_API_URL;
      _client = new Codex(_url);
    });
  },

  updateURL(url: string) {
    _url = url;
    _client = new Codex(url);

    return WebStorage.set("codex-node-url", url);
  },

  get debug() {
    return _client.debug;
  },

  get data() {
    return _client.data;
  },

  get node() {
    return _client.node;
  },

  get marketplace() {
    return _client.marketplace;
  },
};
