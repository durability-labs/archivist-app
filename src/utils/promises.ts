import { SafeValue } from "@codex-storage/sdk-js";
import * as Sentry from "@sentry/browser";

export const Promises = {
  rejectOnError: <T>(safe: SafeValue<T>) => {
    if (safe.error) {
      Sentry.captureException(safe.data);
      return Promise.reject(safe.data);
    }

    return Promise.resolve(safe.data);
  },
};
