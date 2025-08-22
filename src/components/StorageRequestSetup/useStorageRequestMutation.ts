import { ArchivistCreateStorageRequestInput } from "@durability-labs/archivist-sdk-js";
import { ArchivistSdk } from "../../sdk/archivist";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Promises } from "../../utils/promises";
import { WebStorage } from "../../utils/web-storage";
import {
  StepperAction,
  StepperState,
} from "@durability-labs/archivist-app-components";
import { Dispatch, useState } from "react";

export function useStorageRequestMutation(
  dispatch: Dispatch<StepperAction>,
  state: StepperState
) {
  const [error, setError] = useState<Error | null>(null);
  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation({
    mutationFn: (input: ArchivistCreateStorageRequestInput) =>
      ArchivistSdk.marketplace()
        .createStorageRequest(input)
        .then((s) => Promises.rejectOnError(s)),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["purchases"] });

      //   if (!requestId.startsWith("0x")) {
      //     requestId = "0x" + requestId;
      //   }

      WebStorage.delete("storage-request-step");
      WebStorage.delete("storage-request-3");

      setError(null);

      //   PurchaseStorage.set(requestId, cid);
      //   WebStorage.set("storage-request-step", SUCCESS_STEP);
      dispatch({
        type: "next",
        step: state.step,
      });
    },
    onError: (error) => {
      setError(error);

      WebStorage.set("storage-request-step", state.step - 1);

      dispatch({
        type: "next",
        step: state.step,
      });
    },
  });

  return { mutateAsync, error };
}
