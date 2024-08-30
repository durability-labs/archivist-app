import { ChangeEvent, useEffect, useRef, useState } from "react";
import "./StorageRequestAvailability.css";
import { WebStorage } from "../../utils/web-storage";
import { StorageAvailabilityUnit, StorageAvailabilityValue } from "./types";
import { InputGroup } from "@codex-storage/marketplace-ui-components";

type Props = {
  onToggleNext: (next: boolean) => void;
};

export function StorageRequestAvailability({ onToggleNext }: Props) {
  const [unit, setUnit] = useState<StorageAvailabilityUnit>("minutes");
  const [value, setValue] = useState(0);
  const cache = useRef<StorageAvailabilityValue | null>(null);

  useEffect(() => {
    if (cache.current) {
      return;
    }

    WebStorage.get<StorageAvailabilityValue>("storage-request-step-2").then(
      (val) => {
        if (val) {
          cache.current = val;
          setUnit(val.unit);
          setValue(val.value);
          onToggleNext(true);
        }
      }
    );

    return () => {
      WebStorage.set("storage-request-step-2", cache.current);
    };
  }, [onToggleNext]);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!cache.current) {
      cache.current = { unit: "months", value: 0 };
    }

    cache.current.value = parseInt(e.currentTarget.value, 10);

    setValue(parseInt(e.currentTarget.value, 10));
    onToggleNext(!!e.currentTarget.value);
  };

  const onUnitChange = (e: ChangeEvent<HTMLSelectElement>) => {
    if (!cache.current) {
      cache.current = { unit: "months", value: 0 };
    }

    setUnit(e.currentTarget.value as StorageAvailabilityUnit);
    cache.current.unit = e.currentTarget.value as StorageAvailabilityUnit;
  };

  return (
    <>
      <span className="storageRequest-title">
        How long do you want to store your file?
      </span>

      <InputGroup
        id="availability"
        label="Availability"
        type="number"
        className="storageRequestAvailability"
        group={[
          ["years", "Years"],
          ["months", "Months"],
          ["days", "Days"],
          ["hours", "Hours"],
          ["minutes", "Minutes"],
        ]}
        value={value.toString()}
        groupValue={unit}
        onChange={onChange}
        onGroupChange={onUnitChange}
      />
    </>
  );
}
