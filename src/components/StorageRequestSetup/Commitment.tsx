import { InputGroup, Tooltip } from "@codex-storage/marketplace-ui-components";
import "../CardNumbers/CardNumbers.css";
import "./Commitment.css";

import { ChangeEvent, useState } from "react";
import { classnames } from "../../utils/classnames";
import InfoIcon from "../../assets/icons/info.svg?react";
import { attributes } from "../../utils/attributes";
import { Times } from "../../utils/times";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onValidation?: (value: string) => string;
};

export function Commitment({ value, onValidation, onChange }: Props) {
  const [error, setError] = useState("");

  const unitValue = Times.unit(parseFloat(value));
  const val = parseFloat(value) / Times.value(unitValue);

  const onValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.info("e.currentTarget.value", e.currentTarget.value);
    onValueOrUnitChange(
      (parseFloat(e.currentTarget.value) * Times.value(unitValue)).toFixed(1)
    );
  };
  const onUnitChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onValueOrUnitChange(
      Times.value(e.currentTarget.value as "days" | "months").toFixed(1)
    );
  };

  const onValueOrUnitChange = (val: string) => {
    onChange(val);

    const msg = onValidation?.(val);

    if (msg) {
      setError(msg);
      return;
    }

    setError("");
  };

  console.info(val);

  return (
    <div
      className={classnames(["card-number cardNumber-container commitment"])}
      {...attributes({ "aria-invalid": !!error })}>
      <InputGroup
        id="duration"
        name="duration"
        type="number"
        label="Full period of the contract"
        isInvalid={!!error}
        onChange={onValueChange}
        onGroupChange={onUnitChange}
        value={Number.isInteger(val) ? val.toString() : val.toFixed(1)}
        group={[
          ["days", "days"],
          ["months", "months"],
        ]}
        groupValue={unitValue}
      />

      <Tooltip message={error || "The duration of the request in months"}>
        <InfoIcon></InfoIcon>
      </Tooltip>
      <span>{"Contract duration"}</span>
    </div>
  );
}
