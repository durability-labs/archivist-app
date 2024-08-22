import { CircleCheck, Database, Server } from "lucide-react";
import { ICON_SIZE } from "../../utils/constants";
import "./StorageRequestSetup.css";

export function StorageRequestSetup() {
  return (
    <div className="storageRequest">
      <h2 className="storageRequest-title">Storage setup</h2>
      <p className="text-secondary storageRequest-intro">
        You need to follow these steps to start a new request storage.
      </p>
      <p>
        <b>3 of 5 completed</b>
      </p>
      <div className="storageRequest-steps">
        <div className="storageRequest-step">
          <CircleCheck
            size={ICON_SIZE}
            fill="currentColor"
            className="primary upload-progress-check"
            stroke="var(--codex-background)"></CircleCheck>
          <span className="storageRequest-stepText storageRequest-step-completed">
            Offers storage for sale
          </span>
          <button className="storageRequest-stepDisabled" disabled>
            Action
          </button>
        </div>
        <div className="storageRequest-step">
          <CircleCheck
            size={ICON_SIZE}
            fill="currentColor"
            className="primary upload-progress-check"
            stroke="var(--codex-background)"></CircleCheck>
          <span className="storageRequest-stepText storageRequest-step-completed">
            Updates availability
          </span>
          <button className="storageRequest-stepDisabled" disabled>
            Action
          </button>
        </div>
        <div className="storageRequest-step">
          <CircleCheck
            size={ICON_SIZE}
            fill="currentColor"
            className="primary upload-progress-check"
            stroke="var(--codex-background)"></CircleCheck>
          <span className="storageRequest-stepText storageRequest-step-completed">
            Get availability's reservations
          </span>
          <button className="storageRequest-stepDisabled" disabled>
            Action
          </button>
        </div>
        <div className="storageRequest-step">
          <Database
            size={ICON_SIZE}
            fill="currentColor"
            className="upload-progress-check"
            stroke="var(--codex-background)"></Database>
          <span className="storageRequest-stepText">
            Check list of purchase IDs
          </span>
          <button className="storageRequest-step-action" disabled>
            Action
          </button>
        </div>
        <div className="storageRequest-step">
          <Server
            size={ICON_SIZE}
            fill="currentColor"
            className="upload-progress-check"
            stroke="var(--codex-background)"></Server>
          <span className="storageRequest-stepText">
            Check storage that is for sale
          </span>
          <button className="storageRequest-step-action" disabled>
            Action
          </button>
        </div>
      </div>
    </div>
  );
}
