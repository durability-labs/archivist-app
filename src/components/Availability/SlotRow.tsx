import { Cell, Row } from "@durability-labs/archivist-app-components";
import { Bytes } from "../../utils/bytes";
import "./SlotRow.css";
import { classnames } from "../../utils/classnames";
import { attributes } from "../../utils/attributes";
import SlotIcon from "../../assets/icons/slot.svg?react";

type Props = {
  bytes: number;
  id: string;
  active: boolean;
};

export function SlotRow({ bytes, active, id }: Props) {
  // const [className, setClassName] = useState("slot-row--inactive");

  // useEffect(() => {
  //   if (active) {
  //     setClassName("slot-row--opening");

  //     setTimeout(() => {
  //       setClassName("slot-row--active");
  //     }, 15);
  //   } else {
  //     setClassName("slot-row--closing");

  //     setTimeout(() => {
  //       setClassName("slot-row--inactive");
  //     }, 350);
  //   }
  // }, [active]);

  return (
    <Row
      {...attributes({ "aria-expanded": active })}
      className={classnames(
        ["slot-row"],
        ["slot-row--active", active],
        ["slot-row--inactive", !active]
      )}
      cells={[
        <Cell>
          <span></span>
        </Cell>,
        <Cell colSpan={6}>
          <div className={"row gap"}>
            <SlotIcon />
            <div>
              <b>Slot {id}</b>
              <small>{Bytes.pretty(bytes)} allocated for the slot</small>
            </div>
          </div>
        </Cell>,
      ]}></Row>
  );
}
