export const Dates = {
  format(date: string | Date) {
    if (!date) {
      return "N/A";
    }

    return new Intl.DateTimeFormat("en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(date));
  },
};
