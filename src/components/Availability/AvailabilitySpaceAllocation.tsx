import { CodexNodeSpace } from "@codex-storage/sdk-js";
import { AvailabilityState } from "./types";
import { SpaceAllocation } from "@codex-storage/marketplace-ui-components";
import "./AvailabilitySpaceAllocation.css";
import { availabilityUnit } from "./availability.domain";
import { nodeSpaceAllocationColors } from "../NodeSpaceAllocation/nodeSpaceAllocation.domain";

type Props = {
  space: CodexNodeSpace;
  availability: AvailabilityState;
};

export function AvailabilitySpaceAllocation({ availability, space }: Props) {
  const unit = availabilityUnit(availability.totalSizeUnit);
  const { quotaMaxBytes, quotaReservedBytes } = space;
  const size = availability.totalSize * unit;
  const isUpdating = !!availability.id;
  const allocated = isUpdating ? quotaReservedBytes - size : quotaReservedBytes;
  const remaining =
    size > quotaMaxBytes - allocated
      ? quotaMaxBytes - allocated
      : quotaMaxBytes - allocated - size;

  const spaceData = [
    {
      title: "Space allocated",
      size: Math.trunc(allocated),
      color: nodeSpaceAllocationColors[0],
    },
    {
      title: "New space allocation",
      size: size > remaining ? 0 : Math.trunc(size),
      color: nodeSpaceAllocationColors[1],
    },
    {
      title: "Remaining space",
      size: Math.trunc(remaining),
      color: nodeSpaceAllocationColors[nodeSpaceAllocationColors.length - 1],
    },
  ];

  return (
    <>
      <b className="availabilitySpaceAllocation-title">Node space allocation</b>

      <SpaceAllocation data={spaceData} />
    </>
  );
}
