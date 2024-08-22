import { useEffect, useState } from "react";
import { WebStorage } from "../../utils/web-storage";
import {
  StorageAvailabilityValue,
  StorageDurabilityStepValue,
  StoragePriceStepValue,
} from "./types";
import "./StorageRequestReview.css";
import { Alert, SimpleText } from "@codex/marketplace-ui-components";
import { CardNumbers } from "../CardNumbers/CardNumbers";

const plurals = (type: "node" | "token" | "second" | "minute", value: number) =>
  `${value} ${type}` + (value > 1 ? "s" : "");

type Props = {
  onToggleNext: (next: boolean) => void;
};

export function StorageRequestReview({ onToggleNext }: Props) {
  const [cid, setCid] = useState("");
  const [availability, setAvailability] = useState<StorageAvailabilityValue>({
    unit: "days",
    value: 0,
  });
  const [durability, setDurability] = useState<StorageDurabilityStepValue>({
    nodes: 0,
    proofProbability: 0,
    tolerance: 0,
  });
  const [price, setPrice] = useState<StoragePriceStepValue>({
    collateral: 0,
    expiration: 0,
    reward: 0,
  });

  useEffect(() => {
    Promise.all([
      WebStorage.get<string>("storage-request-step-1"),
      WebStorage.get<StorageAvailabilityValue>("storage-request-step-2"),
      WebStorage.get<StorageDurabilityStepValue>("storage-request-step-3"),
      WebStorage.get<StoragePriceStepValue>("storage-request-step-4"),
    ]).then(([cid, availability, durability, price]) => {
      setCid(cid || "");

      if (availability) {
        setAvailability(availability);
      }

      if (durability) {
        setDurability(durability);
      }

      if (price) {
        setPrice(price);
      }

      onToggleNext(true);
    });
  }, [onToggleNext]);

  return (
    <div>
      <span className="storageRequest-title">Review your request</span>

      <div className="storageRequestReview-numbers">
        <CardNumbers
          title={"Contract duration"}
          data={availability.value.toString()}
          comment={"Contract duration in " + availability.unit}
          editable></CardNumbers>

        <CardNumbers
          title={"Nodes"}
          data={durability.nodes.toString()}
          comment={"Storage nodes required"}
          editable></CardNumbers>

        <CardNumbers
          title={"Tolerance"}
          data={durability.tolerance.toString()}
          comment={"Failure nodes tolerated"}
          editable></CardNumbers>

        <CardNumbers
          title={"Proof probability"}
          data={durability.proofProbability.toString()}
          comment={"Proof request frequency"}
          editable></CardNumbers>

        <CardNumbers
          title={"Reward"}
          data={price.reward.toString()}
          comment={"Reward tokens"}
          editable></CardNumbers>

        <CardNumbers
          title={"Collateral"}
          data={price.reward.toString()}
          comment={"Penality tokens"}
          editable></CardNumbers>
      </div>

      <p>
        <SimpleText variant="light">This request with CID </SimpleText>{" "}
        <b>{cid}</b> <SimpleText variant="light">will expire in </SimpleText>
        <b>{plurals("minute", price.expiration)} </b>
        <SimpleText variant="light">after the start.</SimpleText>
      </p>

      <Alert
        message="If no suitable hosts are found matching your storage
        requirements, you will incur a charge of X tokens."
        variant="warning"
      />

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
