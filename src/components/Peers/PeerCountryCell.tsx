import { Cell } from "@durability-labs/archivist-app-components";
import "./PeerCountryCell.css";
import { PeerGeo, PeerNode, PeerUtils } from "./peers.utils";

export type Props = {
  node: PeerNode;
  geo: PeerGeo | undefined;
};

export function PeerCountryCell({ geo }: Props) {
  return (
    <Cell>
      <div className="peer-country">
        {geo ? (
          <>
            <span> {!!geo && PeerUtils.geCountryEmoji(geo.country_iso)}</span>
            <span>{geo?.country}</span>
          </>
        ) : (
          <span></span>
        )}
      </div>
    </Cell>
  );
}
