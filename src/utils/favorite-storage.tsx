import { createStore, del, keys, set } from "idb-keyval";

const store = createStore("favorites", "favorites");

export const FavoriteStorage = {
  list() {
    return keys<string>(store);
  },

  delete(key: string) {
    return del(key, store);
  },

  async add(key: string) {
    return set(key, "1", store);
  },
};
