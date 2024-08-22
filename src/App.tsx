import { ReactNode, useEffect } from "react";
import "./App.css";
import { useNetwork } from "./network/useNetwork.ts";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

interface Props {
  children: ReactNode;
}

function App({ children }: Props) {
  const online = useNetwork();

  useEffect(() => {
    console.info("The network is now", online ? "online" : "offline");
  }, [online]);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

export default App;
