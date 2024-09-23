export type TimeUnit = "days" | "months" | "years" | "minutes" | "hours";

export const Times = {
  toMs(value: number, unit: TimeUnit) {
    switch (unit) {
      case "minutes":
        return 60 * value;
      case "hours":
        return 60 * 60 * value;
      case "days":
        return 24 * 60 * 60 * value;
      case "months":
        return 30 * 24 * 60 * 60 * value;
      case "years":
        return 365 * 24 * 60 * 60 * value;
    }
  },
};
