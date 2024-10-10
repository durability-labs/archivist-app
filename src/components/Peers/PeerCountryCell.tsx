import { Cell } from "@codex-storage/marketplace-ui-components";
import { useEffect, useState } from "react";
import { PeerPin } from "./types";
import { countriesCoordinates } from "./countries";

export type Props = {
  address: string;
  onPinAdd: (pin: PeerPin) => void;
};

const getFlagEmoji = (countryCode: string) => {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

export function PeerCountryCell({ address, onPinAdd }: Props) {
  const [country, setCountry] = useState("");

  useEffect(() => {
    const [ip] = address.split(":");

    console.info(ip);

    fetch("https://api.country.is/" + ip)
      .then((res) => res.json())
      .then((json) => {
        setCountry(json.country);

        const coordinate = countriesCoordinates.find(
          (c) => c.iso === json.country
        );

        if (coordinate) {
          onPinAdd({
            lat: parseFloat(coordinate.lat),
            lng: parseFloat(coordinate.lng),
          });
        }
      });
  }, [address]);

  return (
    <Cell>
      {getFlagEmoji(country)} {address}
    </Cell>
  );
}
