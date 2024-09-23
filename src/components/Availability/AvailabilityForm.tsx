import {
  Input,
  InputGroup,
  StepperAction,
  StepperState,
} from "@codex-storage/marketplace-ui-components";
import { ChangeEvent, Dispatch, useCallback, useEffect, useState } from "react";
import "./AvailabilityForm.css";
import { CodexNodeSpace } from "@codex-storage/sdk-js";
import { UIAvailability } from "./types";
import { GB, TB } from "../../utils/constants";
import { classnames } from "../../utils/classnames";
import { AvailabilitySpaceAllocation } from "./AvailabilitySpaceAllocation";

type Props = {
  dispatch: Dispatch<StepperAction>;
  state: StepperState;
  space: CodexNodeSpace;
  onAvailabilityChange: (data: Partial<UIAvailability>) => void;
  availability: UIAvailability;
};

export function AvailabilityForm({
  dispatch,
  onAvailabilityChange,
  availability,
  space,
}: Props) {
  const [totalSizeError, setTotalSizeError] = useState("");

  const isAvailabilityInvalid = useCallback(
    (value: number) => {
      const unit = availability.totalSizeUnit === "gb" ? GB : TB;
      return value * unit > space.quotaMaxBytes - space.quotaReservedBytes;
    },
    [space, availability]
  );

  useEffect(() => {
    if (isAvailabilityInvalid(availability.totalSize)) {
      setTotalSizeError(
        "You cannot allocate more space than the remaining space."
      );
    } else {
      setTotalSizeError("");
    }
  }, [availability, isAvailabilityInvalid]);

  const onTotalSizeUnitChange = async (e: ChangeEvent<HTMLSelectElement>) => {
    const element = e.currentTarget;

    dispatch({
      type: "toggle-next",
      isNextEnable: false,
    });

    onAvailabilityChange({
      totalSize: 0,
      totalSizeUnit: element.value as "tb" | "gb",
    });
  };

  const onDurationUnitChange = async (e: ChangeEvent<HTMLSelectElement>) => {
    const element = e.currentTarget;

    onAvailabilityChange({
      duration: 1,
      durationUnit: element.value as "hours" | "days" | "months",
    });
  };

  const onAvailablityChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const element = e.currentTarget;
    const v = element.value;
    const value = parseFloat(v);
    const valid = element.checkValidity() && !isAvailabilityInvalid(value);

    onAvailabilityChange({
      [element.name]: v,
    });

    if (valid) {
      setTotalSizeError("");
      dispatch({
        type: "toggle-next",
        isNextEnable: true,
      });
    } else {
      setTotalSizeError(
        element.validationMessage ||
          "You cannot allocate more space than the remaining space."
      );
      dispatch({
        type: "toggle-next",
        isNextEnable: false,
      });
    }
  };

  const onInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const element = e.currentTarget;

    onAvailabilityChange({
      [element.name]: parseFloat(element.value),
    });
  };

  const unit = availability.totalSizeUnit === "gb" ? GB : TB;
  const max = (
    space.quotaMaxBytes / unit -
    space.quotaReservedBytes / unit
  ).toFixed(2);

  return (
    <>
      <AvailabilitySpaceAllocation availability={availability} space={space} />

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
