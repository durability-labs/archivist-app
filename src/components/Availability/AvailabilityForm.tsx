import {
  Input,
  InputGroup,
  SpaceAllocation,
  Tooltip,
} from "@durability-labs/archivist-app-components";
import { ChangeEvent, useEffect, useState } from "react";
import "./AvailabilityForm.css";
import { AvailabilityComponentProps } from "./types";
import NodesIcon from "../../assets/icons/nodes.svg?react";
import InfoIcon from "../../assets/icons/info.svg?react";
import { attributes } from "../../utils/attributes";
import { AvailabilityUtils } from "./availability.utils";
import { GB } from "../../utils/constants";

export function AvailabilityForm({
  dispatch,
  onAvailabilityChange,
  availability,
  space,
  editAvailabilityValue,
}: AvailabilityComponentProps) {
  const [isTotalCollateralDirty, setIsTotalCollateralDirty] = useState(false);

  useEffect(() => {
    let max = AvailabilityUtils.maxValue(space);
    if (availability.id && editAvailabilityValue) {
      max += editAvailabilityValue;
    }

    const isValid = AvailabilityUtils.isValid(availability, max);

    dispatch({
      type: "toggle-buttons",
      isNextEnable: isValid,
      isBackEnable: true,
    });
  }, [dispatch, space, availability, editAvailabilityValue]);

  const onTotalSizeUnitChange = async (e: ChangeEvent<HTMLSelectElement>) => {
    const element = e.currentTarget;

    onAvailabilityChange({
      totalSizeUnit: element.value as "tb" | "gb",
    });
  };

  const onDurationChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const element = e.currentTarget;

    onAvailabilityChange({
      duration: parseInt(element.value),
    });
  };

  const onDurationUnitChange = async (e: ChangeEvent<HTMLSelectElement>) => {
    const element = e.currentTarget;
    const unit = element.value as "hours" | "days" | "months";

    onAvailabilityChange({
      duration: availability.duration,
      durationUnit: unit,
    });
  };

  const onAvailablityChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const element = e.currentTarget;
    const v = element.value;
    const totalSize = parseFloat(v);

    onAvailabilityChange({
      totalSize: totalSize,
      totalCollateral: isTotalCollateralDirty
        ? availability.totalCollateral
        : Math.round(totalSize * GB),
    });
  };

  const onInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const element = e.currentTarget;

    if (element.name === "totalCollateral") {
      setIsTotalCollateralDirty(true);
    }

    onAvailabilityChange({
      [element.name]:
        element.name === "name" ? element.value : parseFloat(element.value),
    });
  };

  const onMaxSize = () => {
    const available = AvailabilityUtils.maxValue(space);
    const totalSize =
      Math.floor(
        ((available - 1) /
          AvailabilityUtils.unitValue(availability.totalSizeUnit)) *
          10
      ) / 10;

    onAvailabilityChange({
      totalSize,
      totalCollateral: isTotalCollateralDirty
        ? availability.totalCollateral
        : Math.round(totalSize * GB),
    });
  };

  let available = AvailabilityUtils.maxValue(space);
  if (availability.id && editAvailabilityValue) {
    available += editAvailabilityValue;
  }

  const totalSizeInBytes =
    availability.totalSize *
    AvailabilityUtils.unitValue(availability.totalSizeUnit);

  const isValid = totalSizeInBytes > 0 && available >= totalSizeInBytes;

  const helper = isValid
    ? "Total size of sale's storage in bytes"
    : "The total size cannot exceed the space available.";

  const duration = availability.duration;

  return (
    <div className="availability-form">
      <header>
        <NodesIcon width={20}></NodesIcon>
        <h6>Disk</h6>
      </header>
      <SpaceAllocation
        data={[
          {
            title: "Allocated",
            size: space.quotaUsedBytes,
            color: "#FF6E61",
          },
          {
            title: "Available",
            size: space.quotaReservedBytes,
            color: "#34A0FF",
          },
          {
            title: "Free",
            size: isValid ? available - availability.totalSize : available,
            color: "#6F6F6F",
          },
        ]}></SpaceAllocation>

      <div className="row gap">
        <div className="group" {...attributes({ "aria-invalid": !isValid })}>
          <InputGroup
            id="totalSize"
            name="totalSize"
            type="number"
            label="Total size"
            isInvalid={!isValid}
            max={available.toFixed(2)}
            onChange={onAvailablityChange}
            onGroupChange={onTotalSizeUnitChange}
            value={availability.totalSize.toFixed(2)}
            min={"0"}
            group={[
              ["gb", "GB"],
              // ["tb", "TB"],
            ]}
            step="0.1"
            groupValue={availability.totalSizeUnit}
            extra={<a onClick={onMaxSize}>Use max size</a>}
          />
          <Tooltip message={helper}>
            <InfoIcon></InfoIcon>
          </Tooltip>
        </div>

        <div className="group">
          <InputGroup
            id="duration"
            name="duration"
            type="number"
            label="Duration"
            min={1}
            onChange={onDurationChange}
            onGroupChange={onDurationUnitChange}
            group={[
              ["hours", "Hours"],
              ["days", "Days"],
              ["months", "Months"],
            ]}
            value={duration.toString()}
            groupValue={availability.durationUnit}
          />
          <Tooltip message={"The duration of the request in seconds"}>
            <InfoIcon></InfoIcon>
          </Tooltip>
        </div>
      </div>

      <div className="row gap">
        <div className="group">
          <Input
            id="minPricePerBytePerSecond"
            name="minPricePerBytePerSecond"
            type="number"
            label="Min price per byte per second"
            min={0}
            onChange={onInputChange}
            value={availability.minPricePerBytePerSecond.toString()}
          />
          <Tooltip
            message={
              "inimal price per byte per second paid (in amount of tokens) for the hosted request's slot for the request's duration"
            }>
            <InfoIcon></InfoIcon>
          </Tooltip>
        </div>

        <div className="group">
          <Input
            id="totalCollateral"
            name="totalCollateral"
            type="number"
            label="Total collateral"
            min={0}
            onChange={onInputChange}
            value={availability.totalCollateral.toString()}
          />
          <Tooltip
            message={
              "Total collateral (in amount of tokens) that can be used for matching requests"
            }>
            <InfoIcon></InfoIcon>
          </Tooltip>
        </div>
      </div>

      <div className="group">
        <Input
          id="name"
          name="name"
          type="string"
          label="Nickname"
          max={9}
          onChange={onInputChange}
          value={availability.name?.toString() || ""}
          maxLength={9}
          autoComplete="falsep"
        />
        <Tooltip
          message={"You can add a custom name to easily retrieve your sale."}>
          <InfoIcon></InfoIcon>
        </Tooltip>
      </div>
    </div>
  );
}
