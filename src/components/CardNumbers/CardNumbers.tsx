import { ButtonIcon, Input, Tooltip } from "@codex-storage/marketplace-ui-components";
import "./CardNumbers.css";
import { Check, Info, Pencil, ShieldAlert } from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";
import { classnames } from "../../utils/classnames";

type Props = {
  title: string;
  data: string;
  comment?: string;
  onChange?: (value: number) => void;
  hasError?: boolean;
};

export function CardNumbers({
  title,
  data,
  comment,
  hasError = false,
  onChange,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(data);

  useEffect(() => {
    setValue(data);
  }, [data]);

  const onEditingClick = () => setEditing(!editing);

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.currentTarget.value);
  };

  const onButtonClick = () => {
    setEditing(false);
    onChange?.(parseInt(value, 10));
  };

  if (editing) {
    return (
      <div
        className={classnames(["cardNumber"], ["cardNumber--error", hasError])}>
        <div className="cardNumber-dataContainer">
          <Input
            id={title}
            value={value}
            onChange={onInputChange}
            type="number"></Input>
          <ButtonIcon
            Icon={Check}
            variant="small"
            onClick={onButtonClick}></ButtonIcon>
        </div>
        <div className="cardNumber-info">
          <b className="cardNumber-title">{title}</b>
          {comment && (
            <Tooltip message={comment} className="cardNumber-tooltip">
              {hasError ? (
                <ShieldAlert size={"1rem"} />
              ) : (
                <Info size={"1rem"} />
              )}
            </Tooltip>
          )}
        </div>
      </div>
    );
  }

  const DataContainer = editing ? (
    <>
      <Input
        id={title}
        value={value}
        onChange={onInputChange}
        type="number"></Input>
      <ButtonIcon
        Icon={Check}
        variant="small"
        onClick={onButtonClick}></ButtonIcon>
    </>
  ) : (
    <>
      <p className="cardNumber-data">{data}</p>
      <ButtonIcon
        onClick={onEditingClick}
        variant="small"
        Icon={() => <Pencil size={"1rem"} />}></ButtonIcon>
    </>
  );

  return (
    <div
      className={classnames(["cardNumber"], ["cardNumber--error", hasError])}>
      <div className="cardNumber-dataContainer">{DataContainer}</div>
      <div className="cardNumber-info">
        <b className="cardNumber-title">{title}</b>
        {comment && (
          <Tooltip message={comment} className="cardNumber-tooltip">
            {hasError ? <ShieldAlert size={"1rem"} /> : <Info size={"1rem"} />}
          </Tooltip>
        )}
      </div>
    </div>
  );
}
