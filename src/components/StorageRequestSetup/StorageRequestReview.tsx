import { ChangeEvent, useEffect, useState } from "react";
import { WebStorage } from "../../utils/web-storage";
import "./StorageRequestReview.css";
import { Alert } from "@codex/marketplace-ui-components";
import { CardNumbers } from "../CardNumbers/CardNumbers";
import { Range } from "../Range/Range";
import { FileWarning } from "lucide-react";
import { classnames } from "../../utils/classnames";

const plurals = (type: "node" | "token" | "second" | "minute", value: number) =>
  `${value} ${type}` + (value > 1 ? "s" : "");

type Props = {
  onChangeNextState: (value: "enable" | "disable") => void;
};

export type AvailabilityUnit =
  | "days"
  | "months"
  | "years"
  | "minutes"
  | "hours";

type Data = {
  availability: number;
  availabilityUnit: AvailabilityUnit;
  tolerance: number;
  proofProbability: number;
  nodes: number;
  reward: number;
  collateral: number;
  expiration: number;
};

type Durability = {
  nodes: number;
  tolerance: number;
  proofProbability: number;
};

const durabilities = [
  { nodes: 2, tolerance: 0, proofProbability: 1 },
  { nodes: 3, tolerance: 1, proofProbability: 2 },
  { nodes: 4, tolerance: 2, proofProbability: 3 },
  { nodes: 5, tolerance: 3, proofProbability: 4 },
  { nodes: 6, tolerance: 4, proofProbability: 5 },
];

type Price = {
  reward: number;
  collateral: number;
};

const prices = [
  {
    reward: 5,
    collateral: 5,
  },
  {
    reward: 10,
    collateral: 10,
  },
  {
    reward: 50,
    collateral: 20,
  },
];

const findDurabilityIndex = (d: Durability) => {
  const s = JSON.stringify({
    nodes: d.nodes,
    tolerance: d.tolerance,
    proofProbability: d.proofProbability,
  });

  return durabilities.findIndex((d) => JSON.stringify(d) === s);
};

const findPriceIndex = (d: Price) => {
  const s = JSON.stringify({
    reward: d.reward,
    collateral: d.collateral,
  });

  return prices.findIndex((p) => JSON.stringify(p) === s);
};

export function StorageRequestReview({ onChangeNextState }: Props) {
  const [cid, setCid] = useState("");
  const [errors, setErrors] = useState({
    nodes: "",
    tolerance: "",
    proofProbability: "",
  });
  const [durability, setDurability] = useState<number>(1);
  const [price, setPrice] = useState<number>(1);
  const [data, setData] = useState<Data>({
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
      WebStorage.get<Data>("storage-request-criteria"),
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

        const pindex = findPriceIndex({
          reward: d.reward,
          collateral: d.collateral,
        });

        setPrice(pindex + 1);
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

  const updateData = (p: Partial<Data>) => {
    setData((d) => {
      const newData = { ...d, ...p };

      WebStorage.set("storage-request-criteria", newData);

      return newData;
    });
  };

  const onDurabilityRangeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const l = parseInt(e.currentTarget.value, 10);

    const durability = durabilities[l - 1];

    updateData(durability);
    setDurability(l);
    setErrors({ nodes: "", tolerance: "", proofProbability: "" });
  };

  const onPriceRangeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const l = parseInt(e.currentTarget.value, 10);

    const price = prices[l - 1];

    updateData(price);
    setPrice(l);
  };

  const isUnvalidConstrainst = (nodes: number, tolerance: number) => {
    const ecK = nodes - tolerance;
    const ecM = tolerance;

    return ecK <= 1 || ecK < ecM;
  };

  const onNodesChange = (nodes: number) => {
    setErrors((e) => ({ ...e, tolerance: "" }));

    if (isUnvalidConstrainst(nodes, data.tolerance)) {
      setErrors((e) => ({
        ...e,
        nodes:
          "The data does not match Codex contrainst. Try with other values.",
      }));
      return;
    }

    updateData({ nodes });

    const index = findDurabilityIndex({
      nodes: nodes,
      tolerance: data.tolerance,
      proofProbability: data.proofProbability,
    });

    setDurability(index + 1);
  };

  const onToleranceChange = (tolerance: number) => {
    setErrors((e) => ({ ...e, tolerance: "" }));

    if (tolerance > data.nodes) {
      setErrors((e) => ({
        ...e,
        tolerance: "The tolerance cannot be greater than the nodes.",
      }));
      return;
    }

    if (isUnvalidConstrainst(data.nodes, tolerance)) {
      setErrors((e) => ({
        ...e,
        tolerance:
          "The data does not match Codex contrainst. Try with other values.",
      }));
      return;
    }

    updateData({ tolerance });

    const index = findDurabilityIndex({
      nodes: data.nodes,
      tolerance: tolerance,
      proofProbability: data.proofProbability,
    });

    setDurability(index + 1);
  };

  const onProofProbabilityChange = (proofProbability: number) => {
    updateData({ proofProbability });

    const index = findDurabilityIndex({
      nodes: data.nodes,
      tolerance: data.tolerance,
      proofProbability: proofProbability,
    });

    setDurability(index + 1);
  };

  const onAvailabilityChange = (availability: number) =>
    updateData({ availability });

  const onRewardChange = (reward: number) => {
    updateData({ reward });

    const index = findPriceIndex({
      reward,
      collateral: data.collateral,
    });

    setPrice(index + 1);
  };

  const onCollateralChange = (collateral: number) => {
    updateData({ collateral });

    const index = findPriceIndex({
      collateral,
      reward: data.reward,
    });

    setPrice(index + 1);
  };

  return (
    <div>
      <span className="storageRequest-title">Choose your criteria</span>
      <div className="storageRequestReview-numbers">
        <CardNumbers
          title={"Nodes"}
          data={data.nodes.toString()}
          comment={errors.nodes || "Storage nodes required"}
          onChange={onNodesChange}
          hasError={!!errors.nodes}></CardNumbers>
        <CardNumbers
          title={"Tolerance"}
          data={data.tolerance.toString()}
          comment={errors.tolerance || "Failure nodes tolerated"}
          onChange={onToleranceChange}
          hasError={!!errors.tolerance}></CardNumbers>
        <CardNumbers
          title={"Proof probability"}
          data={data.proofProbability.toString()}
          comment={errors.proofProbability || "Proof request frequency"}
          onChange={onProofProbabilityChange}
          hasError={!!errors.proofProbability}></CardNumbers>
      </div>

      <Range
        onChange={onDurabilityRangeChange}
        className={classnames(
          ["storageRequestReview-range"],
          ["storageRequestReview-range--disabled", durability === 0]
        )}
        labels={["Weak", "Low", "Medium", "High", "Confident"]}
        max={5}
        label=""
        value={durability}
      />

      <div className="storageRequestReview-numbers">
        <CardNumbers
          title={"Contract duration"}
          data={data.availability.toString()}
          comment={"Contract duration in " + data.availabilityUnit}
          onChange={onAvailabilityChange}></CardNumbers>

        <CardNumbers
          title={"Reward"}
          data={data.reward.toString()}
          comment={"Reward tokens"}
          onChange={onRewardChange}></CardNumbers>

        <CardNumbers
          title={"Collateral"}
          data={data.reward.toString()}
          comment={"Penality tokens"}
          onChange={onCollateralChange}></CardNumbers>
      </div>
      <Range
        className={classnames(
          ["storageRequestReview-range"],
          ["storageRequestReview-range--disabled", price === 0]
        )}
        labels={["Low", "Average", "Attractive"]}
        max={3}
        label=""
        onChange={onPriceRangeChange}
      />

      <Alert
        Icon={<FileWarning />}
        title="Warning"
        variant="warning"
        className="storageRequestReview-alert">
        This request with CID
        <b> {cid}</b> will expire in
        <b> {plurals("minute", data.expiration)} </b>
        after the start. <br />
        If no suitable hosts are found matching your storage requirements, you
        will incur a charge of X tokens.
      </Alert>
      <hr className="storageRequestReview-hr" />
      <p className="text-center">
        <b className=" storageRequestReview-title">
          Price comparaison with the market
        </b>
      </p>
      <div className="storageRequestReview-legend">
        <div className="storageRequestReview-legendItem">
          <span className="storageRequestReview-legendItemColor storageRequestReview-legendItemColor-cheap"></span>
          <span>Cheap</span>
        </div>

        <div className="storageRequestReview-legendItem">
          <span className="storageRequestReview-legendItemColor storageRequestReview-legendItemColor-average"></span>
          <span>Average</span>
        </div>

        <div className="storageRequestReview-legendItem">
          <span className="storageRequestReview-legendItemColor storageRequestReview-legendItemColor-good"></span>
          <span>Good</span>
        </div>

        <div className="storageRequestReview-legendItem">
          <span className="storageRequestReview-legendItemColor storageRequestReview-legendItemColor-excellent"></span>
          <span>Excellent</span>
        </div>
      </div>
      <div className="storageRequestReview-bar">
        <div className="storageRequestReview-barIndicator"></div>
      </div>
    </div>
  );
}
