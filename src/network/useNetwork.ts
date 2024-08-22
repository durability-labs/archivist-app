import { useEffect, useState } from "react";

export function useNetwork() {
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    const onOffline = () => setOnline(false);
    window.addEventListener("offline", onOffline);

    const onOnline = () => setOnline(true);
    window.addEventListener("online", onOnline);

    return () => {
      window.removeEventListener("offline", onOffline);
      window.removeEventListener("online", onOnline);
    };
  }, []);

  return online;
}
