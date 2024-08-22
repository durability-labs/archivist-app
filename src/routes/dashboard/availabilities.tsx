import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/availabilities")({
  component: () => () => {
    return <div>Hello /dashboard/availabilities!</div>;
  },
});
