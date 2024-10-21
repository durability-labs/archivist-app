import { useQuery } from "@tanstack/react-query";
import { Errors } from "../utils/errors";

type PortForwardingResponse = { reachable: boolean };

export function usePortForwarding(online: boolean) {
  const { data, isFetching, refetch } = useQuery({
    queryFn: (): Promise<PortForwardingResponse> =>
      fetch(import.meta.env.VITE_ECHO_URL + "/port/8070")
        .then((res) => res.json())
        .catch((e) => Errors.report(e)),
    queryKey: ["port-forwarding"],

    initialData: { reachable: false },

    // Enable only when the use has an internet connection
    enabled: !!online,

    // No need to retry because we provide a retry button
    retry: false,

    // The data should not be cached
    staleTime: 0,

    // The user may try to change the port forwarding and go back
    // to the tab
    refetchOnWindowFocus: true,
  });

  return { enabled: data.reachable, isFetching, refetch };
}
