import { SafeValue } from "@codex/sdk-js";

export const Promises = {
  rejectOnError: <T>(safe: SafeValue<T>) =>
    safe.error ? Promise.reject(safe.data) : Promise.resolve(safe.data),
};
