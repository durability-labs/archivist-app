import { createStore, get, set } from "idb-keyval";

const store = createStore("purchases", "purchases");

export const PurchaseStorage = {
  async get(key: string) {
    return get<string>(key, store);
  },

  async set(key: string, cid: string) {
    return set(key, cid, store);
  },
};
