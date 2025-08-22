import "./RequireAssitance.css";
import DiscordIcon from "../../assets/icons/discord.svg?react";
import { AssistanceImage } from "./AssistanceImage";

export function RequireAssitance() {
  return (
    <a
      href={import.meta.env.VITE_DISCORD_LINK}
      className="require-assistance"
      target="_blank">
      <h5>Require Assistance?</h5>

      <DiscordIcon></DiscordIcon>

      <div>
        <h6>Join Archivist Discord</h6>
        <small>Get direct access to the Core Team.</small>
      </div>

      <AssistanceImage></AssistanceImage>
    </a>
  );
}
