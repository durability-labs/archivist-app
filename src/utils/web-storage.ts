import { del, get, set } from "idb-keyval";

export const WebStorage = {
  set(key: string, value: unknown) {
    return set(key, value);
  },

  get<T>(key: string) {
    return get<T>(key);
  },

  delete(key: string) {
    return del(key);
  },
};
