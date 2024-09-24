import {
  Stepper,
  useStepperReducer,
  Button,
  Modal,
} from "@codex-storage/marketplace-ui-components";
import { useEffect, useRef, useState } from "react";
import { AvailabilityForm } from "./AvailabilityForm";
import { Plus } from "lucide-react";
import { CodexNodeSpace } from "@codex-storage/sdk-js";
import { AvailabilityConfirm } from "./AvailabilityConfirmation";
import { WebStorage } from "../../utils/web-storage";
import { UIAvailability } from "./types";
import { STEPPER_DURATION } from "../../utils/constants";
import { useAvailabilityMutation } from "./useAvailabilityMutation";
import { AvailabilitySuccess } from "./AvailabilitySuccess";
import { ErrorPlaceholder } from "../ErrorPlaceholder/ErrorPlaceholder";

type Props = {
  space: CodexNodeSpace;
};

const CONFIRM_STATE = 2;
const STEPS = 3;

export function AvailabilityCreate({ space }: Props) {
  const steps = useRef(["Availability", "Confirmation", "Success"]);
  const [availability, setAvailability] = useState<UIAvailability>({
    totalSize: 1,
    duration: 1,
    minPrice: 0,
    maxCollateral: 0,
    totalSizeUnit: "gb",
    durationUnit: "days",
  });
  const { state, dispatch } = useStepperReducer(STEPS);
  const { mutateAsync, error } = useAvailabilityMutation(dispatch, state);
  const components = [
    AvailabilityForm,
    AvailabilityConfirm,
    error
      ? () => (
          <ErrorPlaceholder
            subtitle="Error when trying to create availability."
            error={error}
          />
        )
      : AvailabilitySuccess,
  ];

  useEffect(() => {
    Promise.all([
      WebStorage.get<number>("availability-step"),
      WebStorage.get<UIAvailability>("availability"),
    ]).then(([s, a]) => {
      if (s) {
        dispatch({
          type: "next",
          step: s,
        });
      }

      if (a) {
        setAvailability(a);
      }

      dispatch({
        type: "toggle-next",
        isNextEnable: true,
      });
    });
  }, [dispatch]);

  const onNextStep = async (step: number) => {
    WebStorage.set("availability-step", step);

    if (step == CONFIRM_STATE) {
      mutateAsync(availability);
    } else {
      dispatch({
        step,
        type: "next",
      });

      if (step === components.length) {
        setAvailability({
          totalSize: 1,
          duration: 1,
          minPrice: 0,
          maxCollateral: 0,
          totalSizeUnit: "gb",
          durationUnit: "days",
        });
      }
    }
  };

  const onAvailabilityChange = (data: Partial<UIAvailability>) => {
    const val = { ...availability, ...data };

    WebStorage.set("availability", val);

    setAvailability(val);
  };

  const onOpen = () =>
    dispatch({
      type: "open",
    });

  const onClose = () => dispatch({ type: "close" });

  const Body = components[state.step] || (() => <span />);
  const backLabel = state.step ? "Back" : "Close";
  const nextLabel = state.step === steps.current.length - 1 ? "Finish" : "Next";

  return (
    <>
      <Button
        label="Availability"
        Icon={Plus}
        onClick={onOpen}
        variant="primary"
      />

      <Modal open={state.open} onClose={onClose} displayCloseButton={false}>
        <Stepper
          titles={steps.current}
          state={state}
          dispatch={dispatch}
          duration={STEPPER_DURATION}
          onNextStep={onNextStep}
          backLabel={backLabel}
          nextLabel={nextLabel}>
          <Body
            dispatch={dispatch}
            state={state}
            onAvailabilityChange={onAvailabilityChange}
            availability={availability}
            space={space}
          />
        </Stepper>
      </Modal>
    </>
  );
}
