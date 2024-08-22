import { ReactNode, useEffect, useRef } from "react";
import "./Dialog.css";
import { Button } from "@codex/marketplace-ui-components";

type Props = {
  open: boolean;
  children: ReactNode;
  onClose: () => void;
};

export function Dialog({ open, children, onClose }: Props) {
  const ref = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    if (open) {
      ref.current?.showModal();
    } else {
      ref.current?.close();
    }
  }, [open]);

  return (
    <dialog ref={ref} onCancel={onClose} className="dialog">
      <div>{children}</div>
      <Button onClick={onClose} label="Close"></Button>
    </dialog>
  );
}
