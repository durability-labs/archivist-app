import { createFileRoute } from "@tanstack/react-router";
import { ErrorBoundary } from "../../components/ErrorBoundary/ErrorBoundary";
import { Files } from "../../components/Files/Files";

export const Route = createFileRoute("/dashboard/favorites")({
  component: () => (
    <>
      <ErrorBoundary card={true}>
        <div className="container">
          <Files />
        </div>
      </ErrorBoundary>
    </>
  ),
});
