import { describe, it, expect, beforeEach } from "vitest";
import { useOrders, nextStatus, stageIndex, ORDER_STAGES } from "../store/orders";
import type { CartLine } from "../store/cart";

const items: CartLine[] = [
  { key: "p1__M", id: "p1", name: "Saree", image: "/x.jpg", size: "M", price: 2000, qty: 2 },
];

describe("orders store", () => {
  beforeEach(() => useOrders.setState({ orders: [] }));

  it("placeOrder creates an order with a TW-ORD id and snapshot", () => {
    const o = useOrders.getState().placeOrder(items, 4000);
    expect(o.id).toMatch(/^TW-ORD-\d+$/);
    expect(o.status).toBe("placed");
    expect(o.total).toBe(4000);
    expect(o.items.length).toBe(1);
    expect(o.warrantyMonths).toBeGreaterThan(0);
    expect(o.stageTimes.placed).toBeTruthy();
    expect(useOrders.getState().orders[0].id).toBe(o.id);
  });

  it("advance walks through every stage and stops at delivered", () => {
    const o = useOrders.getState().placeOrder(items, 4000);
    const seen = [o.status];
    for (let i = 0; i < 10; i++) {
      useOrders.getState().advance(o.id);
      seen.push(useOrders.getState().getOrder(o.id)!.status);
    }
    expect(useOrders.getState().getOrder(o.id)!.status).toBe("delivered");
    // every stage recorded a timestamp once reached
    const order = useOrders.getState().getOrder(o.id)!;
    for (const s of ORDER_STAGES) expect(order.stageTimes[s.key]).toBeTruthy();
  });

  it("nextStatus / stageIndex are consistent", () => {
    expect(stageIndex("placed")).toBe(0);
    expect(nextStatus("placed")).toBe("packing");
    expect(nextStatus("delivered")).toBeNull();
  });

  it("raiseClaim attaches a warranty claim with a reference", () => {
    const o = useOrders.getState().placeOrder(items, 4000);
    const ref = useOrders.getState().raiseClaim(o.id, "Loose stitching");
    expect(ref).toMatch(/^TW-WC-/);
    expect(useOrders.getState().getOrder(o.id)!.claim?.reason).toBe("Loose stitching");
  });
});
