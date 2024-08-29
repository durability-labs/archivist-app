import { ChangeEvent } from "react";
import "./Range.css";

type Props = {
  label?: string;
  max: number;
  labels: string[];
  className?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  defaultValue?: number | string;
  value?: number | string;
};

export function Range({
  label,
  max,
  labels,
  onChange,
  defaultValue,
  value,
  className = "",
}: Props) {
  return (
    <div className={className}>
      {label}
      <input
        type="range"
        max={max}
        min={1}
        step="1"
        className="range"
        onChange={onChange}
        defaultValue={defaultValue}
        value={value}
      />
      <div className="range-labels">
        {labels.map((l) => (
          <div className="range-label" key={l}>
            {l}
          </div>
        ))}
      </div>
    </div>
  );
}
