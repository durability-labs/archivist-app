import { createFileRoute } from "@tanstack/react-router";
import { ErrorBoundary } from "../../components/ErrorBoundary/ErrorBoundary";
import { Manifests } from "../../components/Manifests/Manitests";

export const Route = createFileRoute("/dashboard/favorites")({
  component: () => (
    <>
      <ErrorBoundary fallback={() => ""}>
        <div className="container">
          <Manifests />
        </div>
      </ErrorBoundary>
    </>
  ),
});
