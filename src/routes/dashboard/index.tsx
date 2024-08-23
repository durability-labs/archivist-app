import { createFileRoute } from "@tanstack/react-router";
import { Debug } from "../../components/Debug/Debug.tsx";
import { ErrorBoundary } from "../../components/ErrorBoundary/ErrorBoundary.tsx";
import { LogLevel } from "../../components/LogLevel/LogLevel.tsx";
import { Manifests } from "../../components/Manifests/Manitests.tsx";
import { NodeSpaceAllocation } from "../../components/NodeSpaceAllocation/NodeSpaceAllocation.tsx";
import {
  Card,
  EmptyPlaceholder,
  Upload,
} from "@codex/marketplace-ui-components";
import { CodexSdk } from "../../sdk/codex.ts";

export const Route = createFileRoute("/dashboard/")({
  component: About,
});

function About() {
  return (
    <>
      <div className="dashboard">
        <ErrorBoundary fallback={() => ""}>
          <Card title="Upload a file">
            <Upload
              multiple
              provider={() =>
                CodexSdk.data().then((data) => data.upload.bind(CodexSdk))
              }
            />
          </Card>
        </ErrorBoundary>

        <ErrorBoundary fallback={() => ""}>
          <LogLevel />
        </ErrorBoundary>

        <ErrorBoundary fallback={() => ""}>
          <Card title="Node space allocation">
            <NodeSpaceAllocation />
          </Card>
        </ErrorBoundary>

        <ErrorBoundary fallback={() => ""}>
          <Card title="Empty state">
            <EmptyPlaceholder
              title="Nothing to show"
              message="No data here yet. We will notify you when there's an update."
            />
          </Card>
        </ErrorBoundary>
      </div>

      <div className="container-fluid">
        <ErrorBoundary fallback={() => ""}>
          <Manifests />
        </ErrorBoundary>
      </div>

      <div className="container-fluid">
        <ErrorBoundary fallback={() => ""}>
          <Debug />
        </ErrorBoundary>
      </div>
    </>
  );
}
