import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/help")({
  component: () => <div className="container">Hello /dashboard/help!</div>,
});
