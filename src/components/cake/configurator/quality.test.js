import { describe, expect, it } from "vitest";
import { isLiteDevice } from "./quality";

describe("isLiteDevice", () => {
  it("treats a touch screen as a phone, whatever else it reports", () => {
    expect(isLiteDevice({ coarsePointer: true, deviceMemory: 16, hardwareConcurrency: 16 })).toBe(true);
  });

  it("treats a device with 4 GB of memory or less as weak", () => {
    expect(isLiteDevice({ deviceMemory: 4 })).toBe(true);
    expect(isLiteDevice({ deviceMemory: 2 })).toBe(true);
    expect(isLiteDevice({ deviceMemory: 8 })).toBe(false);
  });

  it("treats two CPU cores or fewer as weak, but not a four-core laptop", () => {
    expect(isLiteDevice({ hardwareConcurrency: 2 })).toBe(true);
    expect(isLiteDevice({ hardwareConcurrency: 4 })).toBe(false);
    expect(isLiteDevice({ hardwareConcurrency: 8 })).toBe(false);
  });

  it("keeps full quality when the browser says nothing (Safari reports no memory)", () => {
    expect(isLiteDevice({})).toBe(false);
    expect(isLiteDevice()).toBe(false);
  });
});
