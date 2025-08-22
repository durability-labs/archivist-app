import {
  ArchivistCreateStorageRequestInput,
  ArchivistData,
  ArchivistMarketplace,
  SafeValue,
} from "@durability-labs/archivist-sdk-js";
import { ArchivistSdk as Sdk } from "./sdk/archivist";
import { WebStorage } from "./utils/web-storage";

class ArchivistDataMock extends ArchivistData {}

class ArchivistMarketplaceMock extends ArchivistMarketplace {
  // override async purchases(): Promise<SafeValue<ArchivistPurchase[]>> {
  //   const res = await super.purchases()

  //   if (res.error) {
  //     return res
  //   }

  //   const defaultDate = new Date(0, 0, 0, 0, 0, 0).toJSON()
  //   const dates = await Promise.all(res.data.map(p => PurchaseDatesStorage.get(p.requestId)))

  //   return {
  //     error: false, data: res.data
  //       .map((p, index) => ({ ...p, createdAt: new Date(dates[index] || defaultDate).getTime() }))
  //       .sort((a, b) => b.createdAt - a.createdAt)
  //   }
  // }

  /**
   * Maintains a temporary link between the CID and the file metadata.
   * When the metadata is available in the manifest, the CID link
   * should still be maintained, but the metadata should be retrieved
   * using a REST API call.
   */
  override async createStorageRequest(
    input: ArchivistCreateStorageRequestInput
  ): Promise<SafeValue<string>> {
    console.info(input);
    const res = await super.createStorageRequest(input);

    if (res.error) {
      console.error(res.data);
      return res;
    }

    await WebStorage.purchases.set("0x" + res.data, input.cid);

    // await PurchaseDatesStorage.set(res.data, new Date().toJSON())

    return res;
  }

  // override createStorageRequest(
  //   input: ArchivistCreateStorageRequestInput
  // ): Promise<SafeValue<string>> {
  //   return Promise.resolve({
  //     error: true,
  //     data: {
  //       message: "C'est balo",
  //     },
  //   });
  // }
  // override createAvailability(): Promise<
  //   SafeValue<ArchivistAvailabilityCreateResponse>
  // > {
  //   return Promise.resolve({
  //     error: true,
  //     data: {
  //       message: "C'est balo",
  //     },
  //   });
  // }
  // override reservations(): Promise<SafeValue<ArchivistReservation[]>> {
  //   return Promise.resolve({
  //     error: false,
  //     data: [
  //       {
  //         id: "0x123456789",
  //         availabilityId: "0x12345678910",
  //         requestId: "0x1234567891011",
  //         /**
  //          * Size in bytes
  //          */
  //         size: 500_000_000 + "",
  //         /**
  //          * Slot Index as hexadecimal string
  //          */
  //         slotIndex: "2",
  //       },
  //       {
  //         id: "0x987654321",
  //         availabilityId: "0x9876543210",
  //         requestId: "0x98765432100",
  //         /**
  //          * Size in bytes
  //          */
  //         size: 500_000_000 + "",
  //         /**
  //          * Slot Index as hexadecimal string
  //          */
  //         slotIndex: "1",
  //       },
  //     ],
  //   });
  // }

  // override reservations(): Promise<SafeValue<ArchivistReservation[]>> {
  //   return Promise.resolve({
  //     error: false,
  //     data: [
  //       {
  //         id: "0x123456789",
  //         availabilityId: "0x12345678910",
  //         requestId: "0x1234567891011",
  //         size: GB * 0.5 + "",
  //         slotIndex: "2",
  //       },
  //       {
  //         id: "0x987654321",
  //         availabilityId: "0x9876543210",
  //         requestId: "0x98765432100",
  //         /**
  //          * Size in bytes
  //          */
  //         size: GB * 0.25 + "",
  //         /**
  //          * Slot Index as hexadecimal string
  //          */
  //         slotIndex: "1",
  //       },
  //     ],
  //   });
  // }
}

export const ArchivistSdk = {
  ...Sdk,
  marketplace: () => new ArchivistMarketplaceMock(ArchivistSdk.url()),
  data: () => new ArchivistDataMock(ArchivistSdk.url()),
};
