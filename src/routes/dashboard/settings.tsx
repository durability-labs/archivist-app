import { createFileRoute } from "@tanstack/react-router";
import { ErrorBoundary } from "../../components/ErrorBoundary/ErrorBoundary";
import "./settings.css";
import { LogLevel } from "../../components/LogLevel/LogLevel";
import { CodexUrlSettings } from "../../CodexUrllSettings/CodexUrlSettings";
import { Debug } from "../../components/Debug/Debug";

export const Route = createFileRoute("/dashboard/settings")({
  component: () => (
    <>
      <div className="settings">
        <ErrorBoundary card={true}>
          <LogLevel />
        </ErrorBoundary>
      </div>

      <div className="settings">
        <ErrorBoundary card={true}>
          <CodexUrlSettings />
        </ErrorBoundary>
      </div>

      <div className="settings">
        <ErrorBoundary card={true}>
          <Debug />
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
    </>
  ),
});
