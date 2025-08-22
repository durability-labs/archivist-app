import { useCallback, useEffect, useState } from "react";
import "./StorageRequestReview.css";
import { Alert } from "@durability-labs/archivist-app-components";
import { CardNumbers } from "../CardNumbers/CardNumbers";
import WarningIcon from "../../assets/icons/warning.svg?react";
import { StorageRequest, StorageRequestComponentProps } from "./types";
import DurabilityIcon from "../../assets/icons/durability.svg?react";
import AlphaIcon from "../../assets/icons/alpha.svg?react";
import PresetCustomIcon from "../../assets/icons/durability-custom.svg?react";
import PresetLowIcon from "../../assets/icons/durability-low.svg?react";
import PresetMediumIcon from "../../assets/icons/durability-medium.svg?react";
import PresetHighIcon from "../../assets/icons/durability-high.svg?react";
import CommitmentIcon from "../../assets/icons/commitment.svg?react";
import RequestDurationIcon from "../../assets/icons/request-duration.svg?react";
import { attributes } from "../../utils/attributes";
import { Strings } from "../../utils/strings";
import { Commitment } from "./Commitment";

type Durability = {
  nodes: number;
  tolerance: number;
  proofProbability: number;
};

const durabilities = [
  { nodes: 3, tolerance: 1, proofProbability: 2 },
  { nodes: 4, tolerance: 2, proofProbability: 3 },
  { nodes: 5, tolerance: 2, proofProbability: 4 },
];

const TESTNET_MAX_VALUE = 7;

const findDurabilityIndex = (d: Durability) => {
  const s = JSON.stringify({
    nodes: d.nodes,
    tolerance: d.tolerance,
    proofProbability: d.proofProbability,
  });

  return durabilities.findIndex((d) => JSON.stringify(d) === s);
};

// const units = ["days", "minutes", "hours", "days", "months", "years"];

export function StorageRequestReview({
  dispatch,
  onStorageRequestChange,
  storageRequest,
}: StorageRequestComponentProps) {
  const [durability, setDurability] = useState<number>(2);

  const isInvalidConstrainst = useCallback(
    (nodes: number, tolerance: number) => {
      const ecK = nodes - tolerance;
      const ecM = tolerance;

      return ecK <= 1 || ecK < ecM;
    },
    []
  );

  useEffect(() => {
    const invalid =
      isInvalidConstrainst(storageRequest.nodes, storageRequest.tolerance) ||
      storageRequest.availability > TESTNET_MAX_VALUE ||
      storageRequest.availability == 0;

    dispatch({
      type: "toggle-buttons",
      isNextEnable: !invalid,
      isBackEnable: true,
    });
  }, [isInvalidConstrainst, dispatch, storageRequest]);

  const onUpdateDurability = (data: Partial<StorageRequest>) => {
    onStorageRequestChange(data);

    const merge = { ...storageRequest, ...data };

    const index = findDurabilityIndex({
      nodes: merge.nodes,
      tolerance: merge.tolerance,
      proofProbability: merge.proofProbability,
    });

    setDurability(index + 1);
  };

  const onDurabilityChange = (d: number) => {
    const durability = durabilities[d - 1];

    if (durability) {
      onStorageRequestChange(durability);
      setDurability(d);
    } else {
      setDurability(0);
    }
  };

  const isInvalidNodes = (nodes: string) => {
    const error = isInvalidNumber(nodes);

    if (error) {
      return error;
    }

    const n = Number(nodes);

    if (isInvalidConstrainst(n, storageRequest.tolerance)) {
      return "The data does not match Archivist constraint";
    }

    return "";
  };

  const isInvalidTolerance = (tolerance: string) => {
    const error = isInvalidNumber(tolerance);

    if (error) {
      return error;
    }

    const n = Number(tolerance);

    if (n > storageRequest.nodes) {
      return "The tolerance cannot be greater than the nodes.";
    }

    if (isInvalidConstrainst(storageRequest.nodes, n)) {
      return "The data does not match Archivist constraint.";
    }

    return "";
  };

  const isInvalidAvailability = (data: string) => {
    const [value] = data.split(" ");

    const error =
      isInvalidNumber(value) ||
      isInvalidAvailabilityNumber(value) ||
      isRequiredNumber(value);

    if (error) {
      return error;
    }

    return "";
  };

  const isInvalidNumber = (value: string) =>
    isNaN(Number(value)) ? "The value is not a number" : "";

  const isRequiredNumber = (value: string) =>
    value == "0" ? "The value has to be more than 0." : "";

  const isInvalidAvailabilityNumber = (value: string) =>
    parseInt(value, 10) > TESTNET_MAX_VALUE
      ? "The maximum value is on the current Testnet is 7 days"
      : "";

  const onNodesChange = (value: string) =>
    onUpdateDurability({ nodes: Number(value) });

  const onToleranceChange = (value: string) =>
    onUpdateDurability({ tolerance: Number(value) });

  const onProofProbabilityChange = (value: string) =>
    onUpdateDurability({ proofProbability: Number(value) });

  const onAvailabilityChange = (value: string, unit: "days" | "months") => {
    const [availability] = value.split(" ");

    onStorageRequestChange({
      availability: Number(availability),
      availabilityUnit: unit,
    });
  };

  const onRewardChange = (value: string) =>
    onStorageRequestChange({ reward: Number(value) });

  const onExpirationChange = (value: string) =>
    onStorageRequestChange({ expiration: Number(value) });

  const onCollateralChange = (value: string) =>
    onStorageRequestChange({ collateral: Number(value) });

  const availability = storageRequest.availability;

  return (
    <div className="request-review">
      <header>
        <DurabilityIcon></DurabilityIcon>
        <div>
          <h6>Define your Durability Profile</h6>
          <small>
            Select the appropriate level of data storage reliability ensuring
            your information is protected and accessible.
          </small>
        </div>
      </header>
      <main>
        <div className="presets">
          <div>
            <AlphaIcon width={20} color="#6FCB94"></AlphaIcon>
            <div>
              <span>Durability</span>
              <small>Suggested Defaults</small>
            </div>
          </div>
          <div
            {...attributes({
              "aria-selected": durability <= 0 || durability > 3,
            })}
            onClick={() => onDurabilityChange(0)}>
            <span>Custom</span>
            <PresetCustomIcon></PresetCustomIcon>
          </div>
          <div
            {...attributes({
              "aria-selected": durability == 1,
            })}
            onClick={() => onDurabilityChange(1)}>
            <span>Low</span>
            <PresetLowIcon></PresetLowIcon>
          </div>
          <div
            {...attributes({
              "aria-selected": durability == 2,
            })}
            onClick={() => onDurabilityChange(2)}>
            <span>Medium</span>
            <span>Recommanded</span>
            <PresetMediumIcon></PresetMediumIcon>
          </div>
          <div
            {...attributes({
              "aria-selected": durability == 3,
            })}
            onClick={() => onDurabilityChange(3)}>
            <span>High</span>
            <PresetHighIcon></PresetHighIcon>
          </div>
        </div>

        <div className="grid">
          <CardNumbers
            helper="Minimal number of nodes the content should be stored on."
            id="nodes"
            unit={"Nodes"}
            value={storageRequest.nodes.toString()}
            onChange={onNodesChange}
            onValidation={isInvalidNodes}
            title="Number of storage nodes"></CardNumbers>
          <CardNumbers
            id="tolerance"
            unit={"Tolerance Multiplier"}
            value={storageRequest.tolerance.toString()}
            onChange={onToleranceChange}
            onValidation={isInvalidTolerance}
            title="Failure Node Tolerated"
            helper="Additional number of nodes on top of the nodes property that can be lost before pronouncing the content lost."></CardNumbers>
          <CardNumbers
            helper="How often storage proofs are required."
            id="proof-request"
            unit={"Frequency Level"}
            value={storageRequest.proofProbability.toString()}
            onChange={onProofProbabilityChange}
            title="Proof Request Frequency"></CardNumbers>
        </div>

        <div className="row">
          <CommitmentIcon></CommitmentIcon>
          <h6>Commitment</h6>
        </div>

        <div className="grid">
          <Commitment
            unit={storageRequest.availabilityUnit}
            value={availability.toString()}
            onChange={onAvailabilityChange}
            onValidation={isInvalidAvailability}></Commitment>
          <CardNumbers
            helper="Represents how much collateral is asked from hosts per byte if they don't fulfill the contract."
            id="collateral"
            unit={"Collateral"}
            value={storageRequest.collateral.toString()}
            onChange={onCollateralChange}
            onValidation={isInvalidNumber}
            title="Penality tokens per byte"></CardNumbers>
          <CardNumbers
            helper="The maximum amount of tokens paid per second per byte to hosts the client is willing to pay."
            id="reward"
            unit={"Reward"}
            value={storageRequest.reward.toString()}
            onChange={onRewardChange}
            onValidation={isInvalidNumber}
            title="Price per byte"></CardNumbers>
        </div>

        <div className="row">
          <RequestDurationIcon></RequestDurationIcon>
          <h6>Request Duration</h6>
        </div>

        <footer>
          <CardNumbers
            helper="Represents expiry threshold in minutes from when the Request is submitted. When the threshold is reached and the Request does not find requested amount of nodes to host the data, the Request is voided. "
            id="expiration"
            unit={"Expiration"}
            value={storageRequest.expiration.toString()}
            onChange={onExpirationChange}
            onValidation={isInvalidNumber}
            title="Request expiration in minutes"></CardNumbers>
          <Alert Icon={<WarningIcon />} title="Warning" variant="warning">
            If no suitable hosts are found for the CID{" "}
            {Strings.shortId(storageRequest.cid)} matching your storage
            requirements, you will incur a charge a small amount of tokens.
          </Alert>
        </footer>
      </main>
    </div>
  );
}
