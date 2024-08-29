import { createFileRoute } from "@tanstack/react-router";
import "./help.css";
import { HelpCircle } from "lucide-react";
import { SimpleText } from "@codex/marketplace-ui-components";

export const Route = createFileRoute("/dashboard/help")({
  component: () => (
    <div className="container">
      <div className="container-fluid">
        <div className="help">
          <h1 className="help-title">You might be wondering...</h1>

          <div className="help-item">
            <HelpCircle className="help-itemIcon" size={"1.5rem"} />
            <div className="help-itemBody">
              <p className="help-itemTitle">Looking for help to build Codex?</p>
              <SimpleText variant="light">
                Yes, you should refer to the documentation. If you do need more
                help, ask to the github project.
              </SimpleText>
            </div>
          </div>

          <div className="help-item">
            <HelpCircle className="help-itemIcon" size={"1rem"} />
            <div className="help-itemBody">
              <p className="help-itemTitle">Looking for help to build Codex?</p>
              <SimpleText variant="light">
                Yes, you should refer to the documentation. If you do need more
                help, ask to the github project.
              </SimpleText>
            </div>
          </div>
        </div>
        {/* <ErrorBoundary fallback={() => ""}>
          <Debug />
        </ErrorBoundary> */}
      </div>
    </div>
  ),
});
