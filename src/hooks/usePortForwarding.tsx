import { useQuery } from "@tanstack/react-query";
import { Errors } from "../utils/errors";
import { ArchivistDebugInfo } from "@durability-labs/archivist-sdk-js";
import { PortForwardingUtil } from "./port-forwarding.util";
import { HealthCheckUtils } from "../components/HealthChecks/health-check.utils";

type PortForwardingResponse = { reachable: boolean };

export function usePortForwarding(info: ArchivistDebugInfo | undefined) {
  const { data, isFetching, refetch } = useQuery({
    queryFn: (): Promise<PortForwardingResponse> => {
      const port = PortForwardingUtil.getTcpPort(info!);

      if (port.error) {
        Errors.report(port);
        return Promise.resolve({ reachable: false });
      } else {
        const ip = HealthCheckUtils.extractAnnounceAddresses(
          info!.announceAddresses
        );
        if (ip.error) {
          Errors.report(ip);
          return Promise.resolve({ reachable: false });
        }

        return PortForwardingUtil.check(ip.data, port.data).catch(
          Errors.report
        );
      }
    },
    queryKey: ["port-forwarding"],

    initialData: { reachable: false },

    // Enable only when the use has an internet connection
    enabled: !!info,

    // No need to retry because we provide a retry button
    retry: false,

    // The data should not be cached
    staleTime: 0,

    // The user may try to change the port forwarding and go back
    // to the tab
    refetchOnWindowFocus: true,

    throwOnError: false,
  });

  return { enabled: data.reachable, isFetching, refetch };
}
