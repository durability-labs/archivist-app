import { createFileRoute } from "@tanstack/react-router";
import "./requests.css";
import { StorageRequestSetup } from "../../components/StorageRequestSetup/StorageRequestSetup";
import { StorageRequestStepper } from "../../components/StorageRequestSetup/StorageRequestStepper";

export const Route = createFileRoute("/dashboard/requests")({
  component: () => {
    return (
      <div className="container requests">
        <div className="stepper-container">
          <StorageRequestStepper />
        </div>

        <StorageRequestSetup />
      </div>
    );
  },
});
