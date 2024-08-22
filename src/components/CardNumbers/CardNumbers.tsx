import { SimpleText } from "@codex/marketplace-ui-components";
import "./CardNumbers.css";
import { Pencil } from "lucide-react";

type Props = {
  title: string;
  data: string;
  comment?: string;
  editable?: boolean;
};

export function CardNumbers({ title, data, comment, editable }: Props) {
  return (
    <div className="cardNumber">
      <b className="cardNumber-title">{title}</b>
      <div className="cardNumber-dataContainer">
        <p className="cardNumber-data" contentEditable={editable}>
          {data}
        </p>
        {editable && (
          <div className="cardNumber-dataIcon">
            <Pencil size={"0.85rem"} />
          </div>
        )}
      </div>
      {comment && (
        <SimpleText variant="light" size="small">
          {comment}
        </SimpleText>
      )}
    </div>
  );
}
