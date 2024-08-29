export const Files = {
  isImage(type: string) {
    return type.startsWith("image");
  },
};

export type CodexFileMetadata = {
  type: string;
  name: string;
};
