import { StorageRequestFileChooser } from "../../components/StorageRequestSetup/StorageRequestFileChooser";
import { useCallback, useEffect, useRef, useState } from "react";
import { WebStorage } from "../../utils/web-storage";
import { STEPPER_DURATION } from "../../utils/constants";
import { StorageRequestReview } from "./StorageRequestReview";
import { CodexCreateStorageRequestInput } from "@codex/sdk-js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CodexSdk } from "../../sdk/codex";
import { StorageAvailabilityUnit } from "./types";
import { Backdrop, Stepper } from "@codex/marketplace-ui-components";
import { classnames } from "../../utils/classnames";
import { StorageRequestDone } from "./StorageRequestDone";
import { PurchaseStorage } from "../../utils/purchases-storage";

function calculateAvailability(value: number, unit: StorageAvailabilityUnit) {
  switch (unit) {
    case "minutes":
      return 60 * value;
    case "hours":
      return 60 * 60 * value;
    case "days":
      return 24 * 60 * 60 * value;
    case "months":
      return 30 * 24 * 60 * 60 * value;
    case "years":
      return 365 * 30 * 60 * 60 * value;
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
  const steps = useRef(["File", "Criteria", "Success"]);
  const [isNextDisable, setIsNextDisable] = useState(true);
  const queryClient = useQueryClient();

  const { mutateAsync, isPending, isError, error } = useMutation({
    mutationKey: ["debug"],
    mutationFn: (input: CodexCreateStorageRequestInput) =>
      CodexSdk.marketplace().then((marketplace) =>
        marketplace.createStorageRequest(input)
      ),
    onSuccess: async (data, { cid }) => {
      if (data.error) {
        // TODO report error
        console.error(data);
      } else {
        // setStep((s) => (s = 1));
        queryClient.invalidateQueries({ queryKey: ["purchases"] });

        let requestId = data.data;

        if (!requestId.startsWith("0x")) {
          console.debug("No prefix detected");
          requestId = "0x" + requestId;
        }

        PurchaseStorage.set(requestId, cid);
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

  const onChangeNextState = useCallback(
    (s: "enable" | "disable") => setIsNextDisable(s === "disable"),
    []
  );

  if (isError) {
    // TODO Report error
    console.error(error);
    return "";
  }

  const components = [
    StorageRequestFileChooser,
    // StorageRequestAvailability,
    // StorageRequestDurability,
    // StorageRequestPrice,
    StorageRequestReview,
    StorageRequestDone,
  ];

  const onChangeStep = async (s: number, state: "before" | "end") => {
    if (s === -1) {
      setStep(0);
      setIsNextDisable(true);
      onClose();
      return;
    }

    if (state === "before") {
      setProgress(true);
      return;
    }

    if (s >= steps.current.length) {
      setIsNextDisable(true);
      setProgress(false);

      if (s >= steps.current.length) {
        setStep(0);
        WebStorage.delete("storage-request-step");
        WebStorage.delete("storage-request-criteria");
      }

      onClose();

      return;
    }

    WebStorage.set("storage-request-step", s);

    setIsNextDisable(true);
    setProgress(false);
    setStep(s);

    if (s == 2) {
      setIsNextDisable(true);
      setProgress(false);

      const [cid, criteria] = await Promise.all([
        WebStorage.get<string>("storage-request-step-1"),
        // TODO define criteria interface
        // eslint-disable-next-line
        WebStorage.get<any>("storage-request-criteria"),
      ]);

      if (!cid || !criteria) {
        return;
      }

      const {
        availabilityUnit = "days",
        availability,
        reward,
        collateral,
        expiration,
        nodes,
        proofProbability,
        tolerance,
      } = criteria;

      mutateAsync({
        cid,
        collateral,
        duration: calculateAvailability(availability, availabilityUnit),
        expiry: expiration * 60,
        nodes,
        proofProbability,
        tolerance,
        reward,
      });
    } else {
      setIsNextDisable(false);
    }
  };

  const Body = components[step] || components[0];

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
          Body={<Body onChangeNextState={onChangeNextState} />}
          step={step}
          onChangeStep={onChangeStep}
          progress={progress || isPending}
          isNextDisable={progress || isNextDisable}></Stepper>
      </div>
    </>
  );
}
