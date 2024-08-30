import { useQuery } from "@tanstack/react-query";
import { FilesStorage } from "../utils/file-storage";
import { CodexSdk } from "../sdk/codex";

export function useData() {
  const { data = [] } = useQuery({
    queryFn: () =>
      CodexSdk.data().then(async (data) => {
        const res = await data.cids();

        if (res.error) {
          // TODO Sentry
          return [];
        }

        const metadata = await FilesStorage.list();

        return res.data.content.map((content, index) => {
          const value = metadata.find(([cid]) => content.cid === cid);

          if (!value) {
            return {
              ...content,
              mimetype: "N/A",
              uploadedAt: new Date(0, 0, 0, 0, 0, 0),
              name: "N/A" + index,
            };
          }

          const {
            mimetype = "",
            name = "",
            uploadedAt = new Date(0, 0, 0, 0, 0, 0),
          } = value[1];

          return {
            ...content,
            mimetype,
            name,
            uploadedAt,
          };
        });
      }),
    queryKey: ["cids"],
    refetchOnWindowFocus: false,
  });

  return data;
}
