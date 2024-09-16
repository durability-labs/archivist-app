import { useEffect, useState } from "react";
import { WebStorage } from "../../utils/web-storage";
import "./StorageRequestReview.css";
import { Alert } from "@codex-storage/marketplace-ui-components";
import { CardNumbers } from "../CardNumbers/CardNumbers";
import { FileWarning } from "lucide-react";
import { classnames } from "../../utils/classnames";
import { AvailabilityUnit, StorageRequestCriteria } from "./types";

type Props = {
  onChangeNextState: (value: "enable" | "disable") => void;
};

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

const findDurabilityIndex = (d: Durability) => {
  const s = JSON.stringify({
    nodes: d.nodes,
    tolerance: d.tolerance,
    proofProbability: d.proofProbability,
  });

  return durabilities.findIndex((d) => JSON.stringify(d) === s);
};

const units = ["days", "minutes", "hours", "days", "months", "years"];

export function StorageRequestReview({ onChangeNextState }: Props) {
  const [cid, setCid] = useState("");
  const [durability, setDurability] = useState<number>(1);
  const [data, setData] = useState<StorageRequestCriteria>({
    availabilityUnit: "days",
    availability: 1,
    tolerance: 1,
    proofProbability: 1,
    nodes: 3,
    reward: 10,
    collateral: 10,
    expiration: 300,
  });

  useEffect(() => {
    Promise.all([
      WebStorage.get<StorageRequestCriteria>("storage-request-criteria"),
      WebStorage.get<string>("storage-request-step-1"),
    ]).then(([d, cid]) => {
      if (d) {
        setData(d);

        const index = findDurabilityIndex({
          nodes: d.nodes,
          tolerance: d.tolerance,
          proofProbability: d.proofProbability,
        });

        setDurability(index + 1);
      } else {
        WebStorage.set("storage-request-criteria", {
          availabilityUnit: "days",
          availability: 1,
          tolerance: 1,
          proofProbability: 1,
          nodes: 3,
          reward: 10,
          collateral: 10,
          expiration: 300,
        });
      }

      if (cid) {
        setCid(cid);
      }

      onChangeNextState("enable");
    });
  }, [onChangeNextState]);

  const updateData = (p: Partial<StorageRequestCriteria>) => {
    setData((d) => {
      const newData = { ...d, ...p };

      WebStorage.set("storage-request-criteria", newData);

      return newData;
    });
  };

  const onDurabilityChange = (d: number) => {
    const durability = durabilities[d - 1];

    if (durability) {
      updateData(durability);
      setDurability(d);
    } else {
      setDurability(0);
    }
  };

  const isInvalidConstrainst = (nodes: number, tolerance: number) => {
    const ecK = nodes - tolerance;
    const ecM = tolerance;

    return ecK <= 1 || ecK < ecM;
  };

  const isInvalidNodes = (nodes: string) => {
    const error = isInvalidNumber(nodes);

    if (error) {
      return error;
    }

    const n = Number(nodes);

    if (isInvalidConstrainst(n, data.tolerance)) {
      return "The data does not match Codex contrainst";
    }

    return "";
  };

  const isInvalidTolerance = (tolerance: string) => {
    const error = isInvalidNumber(tolerance);

    if (error) {
      return error;
    }

    const n = Number(tolerance);

    if (n > data.nodes) {
      return "The tolerance cannot be greater than the nodes.";
    }

    if (isInvalidConstrainst(data.nodes, n)) {
      return "The data does not match Codex contrainst.";
    }

    return "";
  };

  const isInvalidAvailability = (data: string) => {
    const [value, unit = "days"] = data.split(" ");

    const error = isInvalidNumber(value);

    if (error) {
      return error;
    }

    // if (!unit.endsWith("s")) {
    //   unit += "s";
    // }

    if (!units.includes(unit)) {
      return "Invalid unit must one of: minutes, hours, days, months, years";
    }

    return "";
  };

  const isInvalidNumber = (value: string) =>
    isNaN(Number(value)) ? "The value is not a number" : "";

  const onNodesChange = (value: string) => {
    const nodes = Number(value);

    updateData({ nodes });

    const index = findDurabilityIndex({
      nodes: nodes,
      tolerance: data.tolerance,
      proofProbability: data.proofProbability,
    });

    setDurability(index + 1);
  };

  const onToleranceChange = (value: string) => {
    const tolerance = Number(value);

    updateData({ tolerance });

    const index = findDurabilityIndex({
      nodes: data.nodes,
      tolerance: tolerance,
      proofProbability: data.proofProbability,
    });

    setDurability(index + 1);
  };

  const onProofProbabilityChange = (value: string) => {
    const proofProbability = Number(value);

    updateData({ proofProbability });

    const index = findDurabilityIndex({
      nodes: data.nodes,
      tolerance: data.tolerance,
      proofProbability: proofProbability,
    });

    setDurability(index + 1);
  };

  const onAvailabilityChange = (value: string) => {
    const [availability, availabilityUnit = "days"] = value.split(" ");

    // if (!availabilityUnit.endsWith("s")) {
    //   availabilityUnit += "s";
    // }

    updateData({
      availability: Number(availability),
      availabilityUnit: availabilityUnit as AvailabilityUnit,
    });
  };

  const onRewardChange = (value: string) => {
    const reward = Number(value);

    updateData({ reward });
  };

  const onExpirationChange = (value: string) => {
    const expiration = Number(value);

    updateData({ expiration });
  };

  const onCollateralChange = (value: string) => {
    const collateral = Number(value);

    updateData({ collateral });
  };

  // const pluralizeUnit = () => {
  //   if (data.availability > 1 && !data.availabilityUnit.endsWith("s")) {
  //     return data.availability + " " +data.availabilityUnit + "s";
  //   }

  //   if (data.availability <= 1 && data.availabilityUnit.endsWith("s")) {
  //     return data.availabilityUnit.slice(0, -1);
  //   }

  //   return data.availabilityUnit;
  // };

  const availability = `${data.availability} ${data.availabilityUnit}`;

  return (
    <div>
      <span className="storageRequest-title">Durability</span>
      <div className="storageRequestReview-numbers">
        <CardNumbers
          title={"Nodes"}
          data={data.nodes.toString()}
          onChange={onNodesChange}
          onValidation={isInvalidNodes}
          helper="Number of storage nodes"></CardNumbers>
        <CardNumbers
          title={"Tolerance"}
          data={data.tolerance.toString()}
          onChange={onToleranceChange}
          onValidation={isInvalidTolerance}
          helper="Failure node tolerated"></CardNumbers>
        <CardNumbers
          title={"Proof probability"}
          data={data.proofProbability.toString()}
          onChange={onProofProbabilityChange}
          helper="Proof request frequency in seconds"></CardNumbers>
      </div>

      <div className="storageRequestReview-presets">
        <div className="storageRequestReview-presets-title">
          <b>Define your durability profile</b>
          <p>
            Select the appropriate level of data storage reliability ensuring
            your information is protected and accessible.
          </p>
        </div>
        <div className="storageRequestReview-presets-blocs">
          <div
            onClick={() => onDurabilityChange(0)}
            className={classnames(
              ["storageRequestReview-presets-bloc"],
              [
                "storageRequestReview-presets--selected",
                durability <= 0 || durability > 3,
              ]
            )}>
            <div className="storageRequestReview-presets-blocIcon">
              <img src="/shape-1.png" width={48} />
            </div>
            <p>Custom</p>
          </div>
          <div
            onClick={() => onDurabilityChange(1)}
            className={classnames(
              ["storageRequestReview-presets-bloc"],
              ["storageRequestReview-presets--selected", durability === 1]
            )}>
            <div className="storageRequestReview-presets-blocIcon">
              <img src="/shape-2.png" width={48} />
            </div>
            <p>Low</p>
          </div>
          <div
            onClick={() => onDurabilityChange(2)}
            className={classnames(
              ["storageRequestReview-presets-bloc"],
              ["storageRequestReview-presets--selected", durability === 2]
            )}>
            <div className="storageRequestReview-presets-blocIcon">
              <img src="/shape-3.png" width={48} />
            </div>
            <p>Medium</p>
          </div>
          <div
            onClick={() => onDurabilityChange(3)}
            className={classnames(
              ["storageRequestReview-presets-bloc"],
              ["storageRequestReview-presets--selected", durability === 3]
            )}>
            <div className="storageRequestReview-presets-blocIcon">
              <img src="/shape-4.png" width={48} />
            </div>
            <p>High</p>
          </div>
        </div>
      </div>

      {/* <Range
        onChange={onDurabilityRangeChange}
        className={classnames(
          ["storageRequestReview-range"],
          ["storageRequestReview-range--disabled", durability === 0]
        )}
        labels={["Weak", "Low", "Medium", "High", "Confident"]}
        max={5}
        label=""
        value={durability}
      /> */}

      <span className="storageRequest-title">Commitment</span>

      <div className="storageRequestReview-numbers">
        <CardNumbers
          title={"Contract duration"}
          data={availability}
          onChange={onAvailabilityChange}
          onValidation={isInvalidAvailability}
          repositionCaret={false}
          helper="Full period of the contract"></CardNumbers>
        <CardNumbers
          title={"Collateral"}
          data={data.collateral.toString()}
          onChange={onCollateralChange}
          onValidation={isInvalidNumber}
          helper="Reward tokens for hosts"></CardNumbers>
        <CardNumbers
          title={"Reward"}
          data={data.reward.toString()}
          onChange={onRewardChange}
          onValidation={isInvalidNumber}
          helper="Penality tokens"></CardNumbers>
        <div className="storageRequest-price"></div>
        {/* <Range
          className={classnames(
            ["storageRequestReview-range"],
            ["storageRequestReview-range--disabled", price === 0]
          )}
          labels={["Low", "Average", "Attractive"]}
          max={100}
          label=""
          onChange={onPriceRangeChange}
        /> */}
      </div>

      <hr className="storageRequestReview-hr" />

      <div className="storageRequestReview-alert">
        <CardNumbers
          title={"Expiration"}
          data={data.expiration.toString()}
          onChange={onExpirationChange}
          className="storageRequestReview-expiration"
          onValidation={isInvalidNumber}
          helper="Request expiration in seconds"></CardNumbers>
        <Alert
          Icon={<FileWarning />}
          title="Warning"
          variant="warning"
          className="storageRequestReview-alert">
          If no suitable hosts are found for the CID {cid} matching your storage
          requirements, you will incur a charge a small amount of tokens.
        </Alert>
      </div>
    </div>
  );
}
