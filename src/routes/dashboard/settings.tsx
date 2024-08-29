import { createFileRoute } from "@tanstack/react-router";
import { ErrorBoundary } from "../../components/ErrorBoundary/ErrorBoundary";
import "./settings.css";
import { LogLevel } from "../../components/LogLevel/LogLevel";
import { CodexUrlSettings } from "../../CodexUrllSettings/CodexUrlSettings";

export const Route = createFileRoute("/dashboard/settings")({
  component: () => (
    <>
      <ErrorBoundary fallback={() => ""}>
        <div className="settings">
          <ErrorBoundary fallback={() => ""}>
            <LogLevel />
          </ErrorBoundary>
        </div>

        <div className="settings">
          <ErrorBoundary fallback={() => ""}>
            <CodexUrlSettings />
          </ErrorBoundary>
        </div>

        {/* <div className="input-floating">
              <input
                className="input input-floating-input"
                id="input-floating"
                placeholder=""
              />
              <label className="input-floating-label" htmlFor="input-floating">
                Floating
              </label>
            </div>

            <div className="input-floating">
              <input
                className="input input-floating-input"
                id="input-floating-with-value"
                placeholder=""
                value="Some value"
              />
              <label
                className="input-floating-label"
                htmlFor="input-floating-with-value">
                Floating
              </label>
            </div> */}
      </ErrorBoundary>
    </>
  ),
});
