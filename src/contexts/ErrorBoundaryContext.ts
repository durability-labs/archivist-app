import { createContext } from "react";

export const ErrorBoundaryContext = createContext<(error: Error) => void>(
  () => ""
);
