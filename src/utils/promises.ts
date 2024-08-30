import { SafeValue } from "@codex/sdk-js";

export const Promises = {
  rejectOnError: <T>(safe: SafeValue<T>) => {
    // TODO Sentry
    return safe.error ? Promise.reject(safe.data) : Promise.resolve(safe.data);
  },
};
