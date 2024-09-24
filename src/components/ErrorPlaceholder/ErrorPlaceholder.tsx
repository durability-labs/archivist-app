import { Placeholder } from "@codex-storage/marketplace-ui-components";
import { ErrorIcon } from "../ErrorIcon/ErrorIcon";

type Props = {
  subtitle?: string;
  error: unknown;
};

export function ErrorPlaceholder({ subtitle, error }: Props) {
  const message =
    error instanceof Object && error.hasOwnProperty("message")
      ? // @ts-ignore
        error.message
      : `${error}`;

  console.info(message, error);

  return (
    <Placeholder
      Icon={<ErrorIcon />}
      title="Error"
      subtitle={subtitle}
      message={message}></Placeholder>
  );
}
