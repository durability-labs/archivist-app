import { CodexNodeSpace } from "@codex-storage/sdk-js";
import { UIAvailability } from "./types";
import { GB, TB } from "../../utils/constants";
import { SpaceAllocation } from "@codex-storage/marketplace-ui-components";
import "./AvailabilitySpaceAllocation.css";

type Props = {
  space: CodexNodeSpace;
  availability: UIAvailability;
};

export function AvailabilitySpaceAllocation({ availability, space }: Props) {
  const unit = availability.totalSizeUnit === "gb" ? GB : TB;
  const { quotaMaxBytes, quotaReservedBytes } = space;
  const size = availability.totalSize * unit;
  const isUpdating = !!availability.id;
  const allocated = isUpdating ? quotaReservedBytes - size : quotaReservedBytes;
  const remaining = quotaMaxBytes - allocated - size;

  const spaceData = [
    {
      title: "Space allocated",
      size: allocated,
    },
    {
      title: "New space allocation",
      size: size,
    },
    {
      title: "Remaining space",
      size: remaining < 0 ? 0 : remaining,
    },
  ];

  return (
    <>
      <b className="availabilitySpaceAllocation-title">Node space allocation</b>

      <SpaceAllocation data={spaceData} />
    </>
  );
}
