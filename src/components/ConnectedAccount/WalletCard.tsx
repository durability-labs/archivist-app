import "./WalletCard.css";
import ArrowRightIcon from "../../assets/icons/arrow-right.svg?react";
import ArrowLeftIcon from "../../assets/icons/arrow-left.svg?react";
import WalletChart from "../../assets/icons/chart.svg?react";
import WalletLines from "../../assets/icons/lines.svg?react";
import { useState, ChangeEvent } from "react";

const defaultTokenValue = 1540;

export function WalletCard() {
  const [tokenValue, setTokenValue] = useState(defaultTokenValue);
  const [currency, setCurrency] = useState("USD");

  const onCurrencyChange = async (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.currentTarget.value;
    setCurrency(value);

    if (value === "USD") {
      setTokenValue(1540);
    } else {
      const json = await fetch(
        "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json"
      ).then((res) => res.json());
      setTokenValue(defaultTokenValue * json.usd.eur);
    }
  };

  return (
    <div className="wallet-card">
      <header>
        <h6>Wallet</h6>
        <div>
          <button>
            <ArrowLeftIcon></ArrowLeftIcon>
          </button>
          <button>
            <ArrowRightIcon></ArrowRightIcon>
          </button>
        </div>
      </header>

      <main>
        <section>
          <span>TOKEN</span>
          <var>123,223 CDX</var>
        </section>

        <section>
          <WalletChart></WalletChart>
          <WalletLines></WalletLines>
        </section>
      </main>

      <footer>
        <div>
          <span>TOKEN</span>
          <div className="row">
            <var>
              {tokenValue.toFixed(2)} {currency}
            </var>
            <small>+ 5%</small>
          </div>
        </div>
        <select defaultValue={currency} onChange={onCurrencyChange}>
          <option value={"USD"}>USD</option>
          <option value={"EUR"}>EUR</option>
        </select>
      </footer>
    </div>
  );
}
