import { Placeholder } from "@codex-storage/marketplace-ui-components";
import ErrorCircleIcon from "../../assets/icons/error-circle.svg?react";

type Props = {
  subtitle?: string;
  error: unknown;
};

export function ErrorPlaceholder({ subtitle, error }: Props) {
  const message = Object.prototype.hasOwnProperty.call(error, "message")
    ? (error as { message: string }).message
    : `${error}`;

  return (
    <Placeholder
      Icon={<ErrorCircleIcon width={30} />}
      title="Error"
      subtitle={subtitle}
      message={message}></Placeholder>
  );
}
