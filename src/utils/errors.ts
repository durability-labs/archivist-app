import * as Sentry from "@sentry/browser";
import { ArchivistError } from "@durability-labs/archivist-sdk-js";

export const Errors = {
    report(safe: { error: true, data: ArchivistError }) {
        if (safe.data.code === 502) {
            // Ignore Gateway error 
            return
        }

        Sentry.captureException(safe.data, {
            extra: {
                code: safe.data.code,
                errors: safe.data.errors,
                sourceStack: safe.data.sourceStack,
            },
        });
    }
}