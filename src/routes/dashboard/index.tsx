import { createFileRoute } from "@tanstack/react-router";
import { ErrorBoundary } from "../../components/ErrorBoundary/ErrorBoundary.tsx";
import { Files } from "../../components/Files/Files.tsx";
import { Card, Upload } from "@codex/marketplace-ui-components";
import { CodexSdk } from "../../sdk/codex.ts";
import { Welcome } from "../../components/Welcome/Welcome.tsx";
import { FilesStorage } from "../../utils/file-storage.ts";

export const Route = createFileRoute("/dashboard/")({
  component: About,
});

const onSuccess = (cid: string, file: File) => {
  FilesStorage.set(cid, {
    name: file.name,
    mimetype: file.type,
    uploadedAt: new Date(),
  });
};

function About() {
  return (
    <>
      <div className="dashboard">
        <ErrorBoundary fallback={() => ""}>
          <Card title="Upload a file">
            <Upload
              multiple
              provider={() =>
                CodexSdk.data().then((data) => data.upload.bind(data))
              }
              onSuccess={onSuccess}
            />
          </Card>
        </ErrorBoundary>

        <ErrorBoundary fallback={() => ""}>
          <Welcome />
        </ErrorBoundary>
      </div>

      <div className="container-fluid">
        <ErrorBoundary fallback={() => ""}>
          <Files />
        </ErrorBoundary>
      </div>
    </>
  );
}
