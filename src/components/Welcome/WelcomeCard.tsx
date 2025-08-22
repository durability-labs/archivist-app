import "./WelcomeCard.css";
import { Alert } from "@durability-labs/archivist-app-components";
import { useEffect, useRef, useState } from "react";
import { classnames } from "../../utils/classnames";
import Logotype from "../../assets/icons/logotype.svg?react";
import Logo from "../../assets/icons/logo.svg?react";
import DiscordIcon from "../../assets/icons/discord.svg?react";
import WarningIcon from "../../assets/icons/warning.svg?react";
import ArrowIcon from "../../assets/icons/arrow-onboarding.svg?react";
import { WelcomeImage } from "./WelcomeImage";
import { Link } from "react-router-dom";

export function WelcomeCard() {
  const ref = useRef<HTMLDivElement>(null);
  const [clientWidth, setClientWidth] = useState(0);

  useEffect(() => {
    const onResize = () => {
      setClientWidth(ref.current?.clientWidth || 0);
    };

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, [setClientWidth]);

  return (
    <div className={classnames(["welcome-card card card--main"])} ref={ref}>
      <div className="card">
        <header>
          <div>
            <Logo height={48}></Logo>
            <Logotype height={48}></Logotype>
          </div>
        </header>
        <main>
          <WelcomeImage tiny={clientWidth <= 800}></WelcomeImage>
          <h6>
            Begin your journey with Archivist by uploading new files for testing.
          </h6>
          <p>
            Experience the power of our decentralized data storage platform and
            explore its features. Your feedback is invaluable as we continue to
            improve!
          </p>
          <div>
            <Link to="/dashboard/help" className="welcome-link">
              Learn more <ArrowIcon width={14} height={14}></ArrowIcon>
            </Link>
            <a href={import.meta.env.VITE_DISCORD_LINK}>
              <DiscordIcon></DiscordIcon>
              <span>Join Archivist Discord</span>
            </a>
          </div>
        </main>
        <footer>
          <Alert variant="warning" title="Disclaimer" Icon={<WarningIcon />}>
            The website and the content herein is not intended for public use
            and is for informational and demonstration purposes only.
          </Alert>
        </footer>
      </div>
    </div>
  );
}
