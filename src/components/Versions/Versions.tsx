import { useDebug } from "../../hooks/useDebug";
import "./Versions.css";
import { VersionsUtil } from "./versions.utils";
import AlphaIcon from "../../assets/icons/alpha.svg?react";
import AlphaText from "../../assets/icons/alphatext.svg?react";

const throwOnError = false;

export function Versions() {
  const debug = useDebug(throwOnError);

  const version = VersionsUtil.clientVersion(debug.data?.archivist.version);

  return (
    <div className="versions">
      <AlphaIcon color="rgb(204, 108, 108)" width={20} />
      <div>
        <p>Client</p>
        <small>VER. {version}</small>
      </div>
      <div>
        <p>Vault</p>
        <small>VER. {VersionsUtil.archivistVersion()}</small>
        <AlphaText color="rgb(204, 108, 108)" width={37}></AlphaText>
      </div>
    </div>
  );
}
