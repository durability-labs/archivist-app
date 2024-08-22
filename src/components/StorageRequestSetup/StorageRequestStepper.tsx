import { StorageRequestFileChooser } from "../../components/StorageRequestSetup/StorageRequestFileChooser";
import { useEffect, useRef, useState } from "react";
import { StorageRequestAvailability } from "../../components/StorageRequestSetup/StorageRequestAvailability";
import { StorageRequestDurability } from "../../components/StorageRequestSetup/StorageRequestDurability";
import { StorageRequestPrice } from "../../components/StorageRequestSetup/StorageRequestPrice";
import { WebStorage } from "../../utils/web-storage";
import { STEPPER_DURATION } from "../../utils/constants";
import { StorageRequestReview } from "./StorageRequestReview";
import { CodexCreateStorageRequestInput } from "@codex/sdk-js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CodexSdk } from "../../sdk/codex";
import {
  StorageAvailabilityValue,
  StorageDurabilityStepValue,
  StoragePriceStepValue,
} from "./types";
import { Backdrop, Stepper } from "@codex/marketplace-ui-components";
import { classnames } from "../../utils/classnames";

function calculateAvailability(value: StorageAvailabilityValue) {
  switch (value.unit) {
    case "minutes":
      return 60 * value.value;
    case "hours":
      return 60 * 60 * value.value;
    case "days":
      return 24 * 60 * 60 * value.value;
    case "months":
      return 30 * 24 * 60 * 60 * value.value;
    case "years":
      return 365 * 30 * 60 * 60 * value.value;
  }
}

type Props = {
  open: boolean;
  onClose: () => void;
  className?: string;
};

export function StorageRequestStepper({ className, open, onClose }: Props) {
  const [progress, setProgress] = useState(true);
  const [step, setStep] = useState(0);
  const steps = useRef([
    "File",
    "Availability",
    "Durability",
    "Price",
    "Review",
  ]);
  const [isNextDisable, setIsNextDisable] = useState(true);
  const queryClient = useQueryClient();
  const { mutateAsync, isPending, isError, error } = useMutation({
    mutationKey: ["debug"],
    mutationFn: (input: CodexCreateStorageRequestInput) =>
      CodexSdk.marketplace().then((marketplace) =>
        marketplace.createStorageRequest(input)
      ),
    onSuccess: async (data) => {
      if (data.error) {
        // TODO report error
        console.error(data);
      } else {
        await Promise.all([
          WebStorage.delete("storage-request-step"),
          WebStorage.delete("storage-request-step-1"),
          WebStorage.delete("storage-request-step-2"),
          WebStorage.delete("storage-request-step-3"),
          WebStorage.delete("storage-request-step-4"),
        ]);

        setStep(0);
        queryClient.invalidateQueries({ queryKey: ["purchases"] });
        onClose();
      }
    },
  });

  useEffect(() => {
    WebStorage.get<number>("storage-request-step").then((value) => {
      setStep(value || 0);

      setTimeout(() => {
        setProgress(false);
      }, STEPPER_DURATION);
    });
  }, []);

  if (isError) {
    // TODO Report error
    console.error(error);
    return "";
  }

  const components = [
    StorageRequestFileChooser,
    StorageRequestAvailability,
    StorageRequestDurability,
    StorageRequestPrice,
    StorageRequestReview,
  ];

  const onChangeStep = async (s: number, state: "before" | "end") => {
    if (state === "before") {
      setProgress(true);
      return;
    }

    if (s === -1) {
      setIsNextDisable(true);
      setProgress(false);
      onClose();
      return;
    }

    if (s === steps.current.length) {
      setIsNextDisable(true);
      setProgress(false);

      const [cid, availability, durability, price] = await Promise.all([
        WebStorage.get<string>("storage-request-step-1"),
        WebStorage.get<StorageAvailabilityValue>("storage-request-step-2"),
        WebStorage.get<StorageDurabilityStepValue>("storage-request-step-3"),
        WebStorage.get<StoragePriceStepValue>("storage-request-step-4"),
      ]);

      if (!cid || !availability || !durability || !price) {
        return;
      }

      const { reward, collateral, expiration } = price;
      const { nodes, proofProbability, tolerance } = durability;

      mutateAsync({
        cid,
        collateral,
        duration: calculateAvailability(availability),
        expiry: expiration * 60,
        nodes,
        proofProbability,
        tolerance,
        reward,
      });

      return;
    }

    WebStorage.set("storage-request-step", s);

    setIsNextDisable(true);
    setProgress(false);
    setStep(s);
  };

  const Body = components[step];

  return (
    <>
      <Backdrop open={open} onClose={onClose} />
      <div
        className={classnames(
          ["storageRequest"],
          ["storageRequest-open", open],
          [className || ""]
        )}>
        <Stepper
          titles={steps.current}
          Body={() => <Body onToggleNext={() => setIsNextDisable(false)} />}
          step={step}
          onChangeStep={onChangeStep}
          progress={progress || isPending}
          isNextDisable={progress || isNextDisable}></Stepper>
      </div>
    </>
  );
}
