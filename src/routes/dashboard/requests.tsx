import { createFileRoute } from "@tanstack/react-router";
import "./requests.css";
import { StorageRequestSetup } from "../../components/StorageRequestSetup/StorageRequestSetup";

export const Route = createFileRoute("/dashboard/requests")({
  component: () => {
    return (
      <div className="container requests">
        <div className="stepper-container"></div>

        <StorageRequestSetup />
      </div>
    );
  },
});
