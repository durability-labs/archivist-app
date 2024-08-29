import { SimpleText } from "@codex/marketplace-ui-components";
import "./Welcome.css";
import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

export function Welcome() {
  return (
    <div className="welcome">
      <p className="welcome-title">Welcome to Codex Marketplace</p>
      <div className="welcome-body">
        <SimpleText variant="light">
          You can start using Codex for testing purpose by uploading new files.
        </SimpleText>
      </div>

      <Link to="/dashboard/help" className="welcome-link">
        Explore more content <ChevronRight size={"1.5rem"} />
      </Link>
    </div>
  );
}
