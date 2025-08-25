import "./help.css";
import { useEffect } from "react";
import * as Sentry from "@sentry/react";
import HelpIcon from "../../assets/icons/help.svg?react";

export const HelpRoute = () => {
  useEffect(() => {
    const feedback = Sentry.feedbackIntegration({
      // Additional SDK configuration goes in here, for example:
      colorScheme: "dark",
      triggerLabel: "",
    });
    const widget = feedback.createWidget();
    return () => {
      return widget.removeFromDom();
    };
  }, []);

  return (
    <div className="help">
      <h1>You might be wondering...</h1>

      <div>
        <HelpIcon />
        <div>
          <h2>What's Archivist?</h2>
          <p>
            Archivist is a decentralised data storage platform that provides
            exceptionally strong censorship resistance and durability
            guarantees.
          </p>
        </div>
      </div>

      <div>
        <HelpIcon />
        <div>
          <h2>What is the purpose of this web application?</h2>
          <p>
            This application allows you to interact with the Archivist Marketplace
            network in a user-friendly manner.
          </p>
        </div>
      </div>

      <div>
        <HelpIcon />
        <div>
          <h2>Can Archivist handle big files?</h2>
          <p>
            Archivist can handle very large files, which is its main purpose.
            However, for this UI, the files used should not be too large.
          </p>
        </div>
      </div>

      <div>
        <HelpIcon />
        <div>
          <h2>Is it production ready?</h2>
          <p>
            Not at all! This is a very early alpha version. You should expect to
            encounter bugs, but don't worry—feel free to reach out to us if you
            need assistance.
          </p>
        </div>
      </div>

      <div>
        <HelpIcon />
        <div>
          <h2>How can I reach you if I am stuck?</h2>
          <p>
            Please create a new issue on our GitHub repository&nbsp;
            <a
              href="https://github.com/durability-labs/archivist-app"
              className="help-link"
              target="_blank">
              https://github.com/durability-labs/archivist-app
            </a>
            .
          </p>
        </div>
      </div>

      <div>
        <HelpIcon />
        <div>
          <h2>How can I build and run Archivist?</h2>
          <p>
            For instructions, please visit{" "}
            <a
              href="https://docs.archivist.storage"
              className="help-link"
              target="_blank">
              https://docs.archivist.storage
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
};
