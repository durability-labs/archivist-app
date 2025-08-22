import { Archivist } from "@durability-labs/archivist-sdk-js";
import { WebStorage } from "../utils/web-storage";

let client: Archivist = new Archivist(import.meta.env.VITE_ARCHIVIST_API_URL);
let url: string = import.meta.env.VITE_ARCHIVIST_API_URL;

export const ArchivistSdk = {
  url() {
    return url;
  },

  load() {
    return WebStorage.get<string>("archivist-node-url").then((u) => {
      url = u || import.meta.env.VITE_ARCHIVIST_API_URL;
      client = new Archivist(url);
    });
  },

  updateURL(u: string) {
    url = u;
    client = new Archivist(url);

    return WebStorage.set("archivist-node-url", url);
  },

  debug() {
    return client.debug
  },

  data() {
    return client.data
  },

  node() {
    return client.node
  },

  marketplace() {
    return client.marketplace
  },
};
