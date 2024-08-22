// TODO remove this for WebStorage
export const BrowserStorage = {
  toggle(key: string, value: string) {
    const previous = JSON.parse(window.localStorage.getItem(key) || "[]");

    if (previous.includes(value)) {
      const values = previous.filter((v: string) => v !== value);
      window.localStorage.setItem(key, JSON.stringify(values));
      return;
    }

    window.localStorage.setItem(key, JSON.stringify([...previous, value]));
  },

  values(key: string) {
    return JSON.parse(window.localStorage.getItem(key) || "[]");
  },
};
