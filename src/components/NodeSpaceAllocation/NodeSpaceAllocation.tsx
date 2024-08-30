import { useQuery } from "@tanstack/react-query";
import Loader from "../../assets/loader.svg";
import { CodexSdk } from "../../sdk/codex";
import { SpaceAllocation } from "@codex-storage/marketplace-ui-components";

export function NodeSpaceAllocation() {
  const { data: space, isPending } = useQuery({
    queryFn: () => CodexSdk.data().then((data) => data.space()),
    queryKey: ["space"],
    refetchOnMount: true,
  });

  if (isPending || !space) {
    return <img src={Loader} width={24} height={24} alt="Loader" />;
  }

  if (space.error) {
    return "";
  }

  const {
    quotaMaxBytes = 0,
    quotaReservedBytes = 0,
    quotaUsedBytes = 0,
  } = space.data;

  return (
    <SpaceAllocation
      data={[
        {
          title: "Maximum storage space used by the node",
          percent: 60,
          size: quotaMaxBytes,
        },
        {
          title: "Amount of storage space currently in use",
          percent: (quotaUsedBytes / quotaMaxBytes) * 100,
          size: quotaUsedBytes,
        },
        {
          title: "Amount of storage space reserved",
          percent: (quotaReservedBytes / quotaMaxBytes) * 100,
          size: quotaReservedBytes,
        },
      ]}></SpaceAllocation>
  );
}
