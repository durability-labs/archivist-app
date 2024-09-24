import { createFileRoute } from "@tanstack/react-router";
import { Availabilities } from "../../components/Availailibities/Availabilities";
import { ErrorBoundary } from "@sentry/react";
import { ErrorPlaceholder } from "../../components/ErrorPlaceholder/ErrorPlaceholder";

export const Route = createFileRoute("/dashboard/availabilities")({
  component: () => (
    <ErrorBoundary
      fallback={({ error }) => (
        <ErrorPlaceholder error={error} subtitle="Cannot retrive the data." />
      )}>
      <Availabilities />
    </ErrorBoundary>
  ),
});
