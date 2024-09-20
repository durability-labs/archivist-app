import {
  Input,
  InputGroup,
  StepperAction,
  StepperState,
} from "@codex-storage/marketplace-ui-components";
import { ChangeEvent, Dispatch, useState } from "react";
import "./AvailabilityForm.css";
import { CodexNodeSpace } from "@codex-storage/sdk-js";
import { UIAvailability } from "./types";
import { GB, TB } from "../../utils/constants";
import { classnames } from "../../utils/classnames";
import { AvailabilityConfirm } from "./AvailabilityConfirmation";

type Props = {
  dispatch: Dispatch<StepperAction>;
  state: StepperState;
  space: CodexNodeSpace;
  onAvailabilityChange: (data: Partial<UIAvailability>, valid: boolean) => void;
  availability: UIAvailability;
};

export function AvailabilityForm({
  dispatch,
  onAvailabilityChange,
  availability,
  space,
}: Props) {
  const [totalSizeError, setTotalSizeError] = useState("");

  const onTotalSizeUnitChange = async (e: ChangeEvent<HTMLSelectElement>) => {
    const element = e.currentTarget;
    const valid = element.value === "tb" || element.value === "gb";

    dispatch({
      type: "toggle-next",
      isNextEnable: false,
    });

    onAvailabilityChange(
      {
        totalSize: 0,
        totalSizeUnit: element.value as "tb" | "gb",
      },
      valid
    );
  };

  const onDurationUnitChange = async (e: ChangeEvent<HTMLSelectElement>) => {
    const element = e.currentTarget;
    const valid =
      element.value === "hours" ||
      element.value === "days" ||
      element.value === "months";

    onAvailabilityChange(
      {
        duration: 1,
        durationUnit: element.value as "hours" | "days" | "months",
      },
      valid
    );
  };

  const onAvailablityChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const element = e.currentTarget;
    const valid = element.checkValidity();
    const val = parseFloat(element.value);
    const unit = availability.totalSizeUnit === "gb" ? GB : TB;

    if (val * unit > space.quotaMaxBytes - space.quotaReservedBytes) {
      setTotalSizeError(
        "You cannot allocate more space than the remaining space."
      );
      dispatch({
        type: "toggle-next",
        isNextEnable: false,
      });
      return;
    }

    onAvailabilityChange(
      {
        [element.name]: parseFloat(element.value),
      },
      valid
    );
    setTotalSizeError(valid ? "" : element.validationMessage);
    dispatch({
      type: "toggle-next",
      isNextEnable: valid && parseFloat(e.target.value) > 0,
    });
  };

  const onInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const element = e.currentTarget;
    const valid = element.checkValidity();

    onAvailabilityChange(
      {
        [element.name]: parseFloat(element.value),
      },
      valid
    );
  };

  const unit = availability.totalSizeUnit === "gb" ? GB : TB;
  const max = space.quotaMaxBytes / unit - space.quotaReservedBytes / unit;

  return (
    <>
      <AvailabilityConfirm
        availability={availability}
        dispatch={dispatch}
        space={space}
        enableNext={false}
      />

      <InputGroup
        id="totalSize"
        name="totalSize"
        type="number"
        label="Total size"
        helper={
          totalSizeError || "Total size of availability's storage in bytes"
        }
        className={classnames(
          ["availabilityForm-item"],
          ["availabilityForm-item--error", !!totalSizeError]
        )}
        inputClassName="availabilityForm-itemInput"
        min={0.01}
        max={max}
        onChange={onAvailablityChange}
        onGroupChange={onTotalSizeUnitChange}
        value={availability.totalSize.toString()}
        step={"0.01"}
        group={[
          ["gb", "GB"],
          ["tb", "TB"],
        ]}
        groupValue={availability.totalSizeUnit}
      />

      <div className="availabilityForm-item">
        <InputGroup
          id="duration"
          name="duration"
          type="number"
          label="Duration"
          helper="The duration of the request in seconds"
          inputClassName="availabilityForm-itemInput"
          min={1}
          onChange={onInputChange}
          onGroupChange={onDurationUnitChange}
          group={[
            ["hours", "Hours"],
            ["days", "Days"],
            ["months", "Months"],
          ]}
          value={availability.duration.toString()}
          groupValue={availability.durationUnit}
        />
      </div>

      <div className="availabilityForm-row">
        <div className="availabilityForm-item">
          <Input
            id="minPrice"
            name="minPrice"
            type="number"
            label="Min price"
            min={0}
            helper="Minimum price to be paid (in amount of tokens)"
            inputClassName="availabilityForm-itemInput"
            onChange={onInputChange}
            value={availability.minPrice.toString()}
          />
        </div>

        <div className="availabilityForm-item">
          <Input
            id="maxCollateral"
            name="maxCollateral"
            type="number"
            label="Max collateral"
            min={0}
            helper="Maximum collateral user is willing to pay per filled Slot (in amount of tokens)"
            inputClassName="availabilityForm-itemInput"
            onChange={onInputChange}
            value={availability.maxCollateral.toString()}
          />
        </div>
      </div>
    </>
  );
}
