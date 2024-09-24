import { Placeholder } from "@codex-storage/marketplace-ui-components";
import { ErrorIcon } from "../ErrorIcon/ErrorIcon";

type Props = {
  error: Error;
};

export function AvailabilityError({ error }: Props) {
  return (
    <Placeholder
      Icon={<ErrorIcon />}
      title="Error"
      subtitle={"Got an error when trying to create the availability."}
      message={error.message}></Placeholder>
  );
}
