import { describe, it, expect, beforeEach } from "vitest";
import { useWholesale, tierPrice } from "../store/wholesale";

const tiers = [
  { minQty: 10, pricePerUnit: 100 },
  { minQty: 50, pricePerUnit: 90 },
  { minQty: 100, pricePerUnit: 80 },
];

describe("wholesale", () => {
  beforeEach(() => useWholesale.setState({ items: [] }));

  it("tierPrice picks the right unit price by qty", () => {
    expect(tierPrice(tiers, 10)).toBe(100);
    expect(tierPrice(tiers, 60)).toBe(90);
    expect(tierPrice(tiers, 250)).toBe(80);
  });

  it("addOrder enforces MOQ and computes line + grand total", () => {
    useWholesale.getState().addOrder({ id: "w1", name: "Bulk Kurta", image: "/x.jpg", moq: 10, tiers });
    const s = useWholesale.getState();
    expect(s.items[0].qty).toBe(10);
    expect(s.items[0].unitPrice).toBe(100);
    expect(s.total()).toBe(1000);
  });

  it("does not add the same product twice", () => {
    const add = useWholesale.getState().addOrder;
    add({ id: "w1", name: "K", image: "/x.jpg", moq: 10, tiers });
    add({ id: "w1", name: "K", image: "/x.jpg", moq: 10, tiers });
    expect(useWholesale.getState().items.length).toBe(1);
  });

  it("raising qty re-prices via tier; cannot go below MOQ", () => {
    useWholesale.getState().addOrder({ id: "w1", name: "K", image: "/x.jpg", moq: 10, tiers });
    const key = useWholesale.getState().items[0].key;
    useWholesale.getState().setQty(key, 100);
    expect(useWholesale.getState().items[0].unitPrice).toBe(80);
    expect(useWholesale.getState().total()).toBe(8000);
    useWholesale.getState().setQty(key, 2);
    expect(useWholesale.getState().items[0].qty).toBe(10); // clamped to MOQ
  });
});
