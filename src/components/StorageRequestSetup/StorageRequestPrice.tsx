import { useState, useRef, useEffect, ChangeEvent } from "react";
import { WebStorage } from "../../utils/web-storage";
import { StoragePriceStepValue } from "./types";
import { InputGroup } from "@codex-storage/marketplace-ui-components";

type Props = {
  onToggleNext: (next: boolean) => void;
};

export function StorageRequestPrice({ onToggleNext }: Props) {
  const [reward, setReward] = useState("");
  const [collateral, setCollateral] = useState("");
  const [expiration, setExpiration] = useState("");
  const cache = useRef<StoragePriceStepValue | null>(null);

  useEffect(() => {
    if (cache.current) {
      return;
    }

    WebStorage.get<StoragePriceStepValue>("storage-request-step-4").then(
      (val) => {
        if (val) {
          cache.current = val;
          setReward(val.reward.toString());
          setCollateral(val.collateral.toString());
          setExpiration(val.expiration.toString());
          onToggleNext(shouldEnableNext());
        }
      }
    );

    return () => {
      WebStorage.set("storage-request-step-4", cache.current);
    };
  }, [onToggleNext]);

  const updateCache = (data: Partial<StoragePriceStepValue>) => {
    if (!cache.current) {
      cache.current = { collateral: 0, expiration: 0, reward: 0 };
    }

    cache.current = { ...cache.current, ...data };
  };

  const shouldEnableNext = () => {
    return (
      !!cache.current?.reward &&
      !!cache.current.collateral &&
      !!cache.current.expiration
    );
  };

  const onChangeReward = (e: ChangeEvent<HTMLInputElement>) => {
    setReward(e.currentTarget.value);
    updateCache({ reward: parseFloat(e.currentTarget.value || "0") });
    onToggleNext(shouldEnableNext());
  };

  const onChangeCollateral = (e: ChangeEvent<HTMLInputElement>) => {
    setCollateral(e.currentTarget.value);
    updateCache({ collateral: parseFloat(e.currentTarget.value || "0") });
    onToggleNext(shouldEnableNext());
  };

  const onChangeExpiration = (e: ChangeEvent<HTMLInputElement>) => {
    setExpiration(e.currentTarget.value);
    updateCache({ expiration: parseFloat(e.currentTarget.value || "0") });
    onToggleNext(shouldEnableNext());
  };

  return (
    <div>
      <span className="storageRequest-title">
        Define your criteria for the payments
      </span>
      <div className="input-spacing">
        <InputGroup
          label="Reward"
          id="reward"
          value={reward}
          onChange={onChangeReward}
          group={"tokens"}
          type={"number"}
          step="0.1"
        />
        <div>
          <span className="input-helper-text text-secondary">
            The maximum amount of tokens paid per second per slot to hosts the
            client is willing to pay
          </span>
        </div>
      </div>

      <div className="input-spacing">
        <InputGroup
          label="Collateral"
          id="collateral"
          value={collateral}
          onChange={onChangeCollateral}
          group={"tokens"}
          type={"number"}
          step="0.1"
        />
        <div>
          <span className="input-helper-text text-secondary">
            Number as decimal string that represents how much collateral is
            asked from hosts that wants to fill a slots
          </span>
        </div>
      </div>

      <div className="input-spacing">
        <InputGroup
          label="Expiration"
          id="expiration"
          value={expiration}
          onChange={onChangeExpiration}
          group={"minutes"}
          type={"number"}
        />
        <div>
          <span className="input-helper-text text-secondary">
            Number as decimal string that represents expiry threshold in seconds
            from when the Request is submitted. When the threshold is reached
            and the Request does not find requested amount of nodes to host the
            data, the Request is voided. The number of seconds can not be higher
            then the Request's duration itself.
          </span>
        </div>
      </div>
    </div>
  );
}
