import { Codex } from "@codex-storage/sdk-js";
import { WebStorage } from "../utils/web-storage";

export class CodexSdk {
  static _client: Codex;
  static _url: string;

  static client() {
    if (this._client) {
      return Promise.resolve(this._client);
    }

    return WebStorage.get<string>("codex-node-url")
      .then((url) => {
        this._url = url || import.meta.env.VITE_CODEX_API_URL;
        this._client = new Codex(this._url);
      })
      .then(() => this._client);
  }

  static url() {
    return this.client().then(() => this._url);
  }

  static updateURL(url: string) {
    this._url = url;
    this._client = new Codex(url);

    return WebStorage.set("codex-node-url", url);
  }

  static debug() {
    return this.client().then((client) => client.debug());
  }

  static data() {
    return this.client().then((client) => client.data());
  }

  static node() {
    return this.client().then((client) => client.node());
  }

  static marketplace() {
    return this.client().then((client) => client.marketplace());
  }
}
