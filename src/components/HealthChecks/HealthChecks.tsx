import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useDebug } from "../../hooks/useDebug";
import { usePersistence } from "../../hooks/usePersistence";
import { usePortForwarding } from "../../hooks/usePortForwarding";
import { Input, Spinner } from "@durability-labs/archivist-app-components";
import { classnames } from "../../utils/classnames";
import "./HealthChecks.css";
import { ArchivistSdk } from "../../sdk/archivist";
import { HealthCheckUtils } from "./health-check.utils";
import SuccessCircleIcon from "../../assets/icons/success-circle.svg?react";
import ErrorCircleIcon from "../../assets/icons/error-circle.svg?react";
import DeviceIcon from "../../assets/icons/device.svg?react";
import RefreshIcon from "../../assets/icons/refresh.svg?react";
import WarningIcon from "../../assets/icons/warning-circle.svg?react";

type Props = {
  online: boolean;
  onStepValid: (valid: boolean) => void;
};

const throwOnError = false;

export function HealthChecks({ online, onStepValid }: Props) {
  const archivist = useDebug(throwOnError);
  const portForwarding = usePortForwarding(archivist.data);
  const persistence = usePersistence(archivist.isSuccess);
  const [isAddressInvalid, setIsAddressInvalid] = useState(false);
  const [isPortInvalid, setIsPortInvalid] = useState(false);
  const [address, setAddress] = useState(
    HealthCheckUtils.removePort(ArchivistSdk.url())
  );
  const [port, setPort] = useState(HealthCheckUtils.getPort(ArchivistSdk.url()));
  const queryClient = useQueryClient();

  useEffect(
    () => {
      persistence.refetch();
      portForwarding.refetch();

      onStepValid(archivist.isSuccess);
    },
    // We really do not want to add persistence and portForwarding as
    // dependencies because it will cause a re-render every time.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [persistence.refetch, onStepValid, portForwarding.refetch, archivist.isSuccess]
  );

  const onAddressChange = (e: React.FormEvent<HTMLInputElement>) => {
    const element = e.currentTarget;
    const value = e.currentTarget.value;

    setIsAddressInvalid(!element.checkValidity());

    setAddress(value);

    if (HealthCheckUtils.containsPort(value)) {
      const address = HealthCheckUtils.removePort(value);
      setAddress(address);

      const p = HealthCheckUtils.getPort(value);
      setPort(p);
    } else {
      setAddress(value);
    }
  };

  const onPortChange = (e: React.FormEvent<HTMLInputElement>) => {
    const element = e.currentTarget;
    const value = element.value;

    setIsPortInvalid(!element.checkValidity());
    setPort(parseInt(value, 10));
  };

  const onSave = () => {
    const url = address + ":" + port;

    if (HealthCheckUtils.isUrlInvalid(url)) {
      return;
    }

    ArchivistSdk.updateURL(url)
      .then(() => queryClient.invalidateQueries())
      .then(() => archivist.refetch());
  };

  return (
    <div className="health-checks">
      <div
        className={classnames(
          ["address"],
          ["address--fetching", portForwarding.isFetching || archivist.isPending]
        )}>
        <div>
          <Input
            id="url"
            type="url"
            label="Address"
            required
            isInvalid={isAddressInvalid}
            onChange={onAddressChange}
            value={address}
            placeholder="127.0.0.1"></Input>
          {isAddressInvalid ? (
            <ErrorCircleIcon width={16} />
          ) : (
            <SuccessCircleIcon width={20} />
          )}
        </div>

        <div>
          <Input
            id="port"
            label="Port"
            type="number"
            onChange={onPortChange}
            value={port}
            isInvalid={isPortInvalid}
            placeholder="8080"></Input>
          <SuccessCircleIcon width={20}></SuccessCircleIcon>
        </div>

        <div className="refresh">
          <RefreshIcon
            color={isAddressInvalid || isPortInvalid ? "#494949" : "#6FCB94"}
            onClick={onSave}></RefreshIcon>
        </div>
      </div>

      <p>
        <li>Ensure that port forwarding is enabled for your settings.</li>
      </p>

      <ul>
        <li>
          <span>
            <DeviceIcon color="#6FCB94" />
          </span>
          Health Check
        </li>
        <li>
          <span>
            {online ? (
              <SuccessCircleIcon width={16} height={16}></SuccessCircleIcon>
            ) : (
              <ErrorCircleIcon width={16} height={16} />
            )}
          </span>
          Internet connection
        </li>
        <li>
          <span>
            {archivist.isFetching ? (
              <Spinner></Spinner>
            ) : archivist.isSuccess ? (
              <SuccessCircleIcon width={16} height={16}></SuccessCircleIcon>
            ) : (
              <ErrorCircleIcon width={16} height={16} />
            )}
          </span>
          Archivist connection
        </li>
        <li>
          <span>
            {portForwarding.isFetching ? (
              <Spinner></Spinner>
            ) : portForwarding.enabled ? (
              <SuccessCircleIcon width={16} height={16}></SuccessCircleIcon>
            ) : (
              <WarningIcon width={16} height={16} />
            )}
          </span>
          Port forwarding
        </li>
        <li>
          <span>
            {persistence.isFetching ? (
              <Spinner></Spinner>
            ) : persistence.enabled ? (
              <SuccessCircleIcon width={16} height={16}></SuccessCircleIcon>
            ) : (
              <WarningIcon width={16} height={16} />
            )}
          </span>
          Marketplace
        </li>
      </ul>
    </div>
  );
}
