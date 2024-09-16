import { ChangeEvent, FormEvent, useState } from "react";
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
  onChange,
  defaultValue,
  value,
  className = "",
}: Props) {
  const [val, setVal] = useState(value);

  const onInput = (e: FormEvent<HTMLInputElement>) => {
    setVal(parseInt(e.currentTarget.value, 10));
  };

  return (
    <div className={className}>
      {label}
      <input
        type="range"
        max={max}
        min={1}
        className="range glow"
        onChange={onChange}
        defaultValue={defaultValue}
        value={value}
        style={{ "--val": val } as React.CSSProperties}
        onInput={onInput}
      />
      {/* <div className="range-labels">
        {labels.map((l) => (
          <div className="range-label" key={l}>
            {l}
          </div>
        ))}
      </div> */}
    </div>
  );
}
