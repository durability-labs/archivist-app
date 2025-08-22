import { TabSortState } from "@durability-labs/archivist-app-components";
import { ArchivistPurchase, ArchivistStorageRequest } from "@durability-labs/archivist-sdk-js";

export const PurchaseUtils = {
  sortById: (state: TabSortState) => (a: ArchivistPurchase, b: ArchivistPurchase) => {
    return state === "desc"
      ? b.requestId
          .toLocaleLowerCase()
          .localeCompare(a.requestId.toLocaleLowerCase())
      : a.requestId
          .toLocaleLowerCase()
          .localeCompare(b.requestId.toLocaleLowerCase());
  },
  sortByState: (state: TabSortState) => (a: ArchivistPurchase, b: ArchivistPurchase) =>
    state === "desc"
      ? b.state.toLocaleLowerCase().localeCompare(a.state.toLocaleLowerCase())
      : a.state.toLocaleLowerCase().localeCompare(b.state.toLocaleLowerCase()),
  sortByDuration:
    (state: TabSortState) => (a: ArchivistPurchase, b: ArchivistPurchase) =>
      state === "desc"
        ? Number(b.request.ask.duration) - Number(a.request.ask.duration)
        : Number(a.request.ask.duration) - Number(b.request.ask.duration),
  sortByReward:
    (state: TabSortState) => (a: ArchivistPurchase, b: ArchivistPurchase) => {
      const aPrice = parseInt(a.request.ask.pricePerBytePerSecond, 10);
      const bPrice = parseInt(b.request.ask.pricePerBytePerSecond, 10);
      return state === "desc" ? bPrice - aPrice : aPrice - bPrice;
    },
  sortByUploadedAt:
    (state: TabSortState, table: Record<string, number>) =>
    (a: ArchivistPurchase, b: ArchivistPurchase) => {
      return state === "desc"
        ? (table[b.requestId] || 0) - (table[a.requestId] || 0)
        : (table[a.requestId] || 0) - (table[b.requestId] || 0);
    },
  calculatePrice(request: ArchivistStorageRequest) {
    return (
      parseInt(request.ask.slotSize, 10) *
      parseInt(request.ask.pricePerBytePerSecond, 10)
    );
  },
};
