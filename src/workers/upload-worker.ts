import { Codex } from "@codex/sdk-js";

const codex = new Codex(import.meta.env.VITE_CODEX_API_URL);
let abort: () => void;

self.addEventListener("message", function (e) {
  const { type, ...rest } = e.data;

  if (type === "abort") {
    console.debug("Aborting request");

    abort?.();

    return;
  }

  const onProgress = (loaded: number, total: number) => {
    self.postMessage({
      type: "progress",
      loaded,
      total,
    });
  };

  return codex
    .data()
    .then((data) => data.upload(rest.file, onProgress))
    .then((result) => {
      abort = result.abort;

      return result.result;
    })
    .then((value) => {
      self.postMessage({
        type: "completed",
        value,
      });
    });
});
