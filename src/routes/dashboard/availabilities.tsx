import { createFileRoute } from "@tanstack/react-router";
import "./availabilities.css";
import { Availabilities } from "../../components/Availailibities/Availabilities";

export const Route = createFileRoute("/dashboard/availabilities")({
  component: Availabilities,
});
