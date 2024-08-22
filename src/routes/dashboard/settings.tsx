import { createFileRoute } from "@tanstack/react-router";
import { ErrorBoundary } from "../../components/ErrorBoundary/ErrorBoundary";
import "./settings.css";

export const Route = createFileRoute("/dashboard/settings")({
  component: () => (
    <>
      <ErrorBoundary fallback={() => ""}>
        <div className="container">
          <p>Settings</p>

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
        </div>
      </ErrorBoundary>
    </>
  ),
});
