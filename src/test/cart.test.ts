import { describe, it, expect, beforeEach } from "vitest";
import { useCart } from "../store/cart";

const reset = () => useCart.setState({ items: [] });

describe("cart store", () => {
  beforeEach(reset);

  it("adds an item and computes count + subtotal", () => {
    useCart.getState().add({ id: "p1", name: "Saree", image: "/catalog/a.jpg", size: "M", price: 2000 }, 2);
    const s = useCart.getState();
    expect(s.count()).toBe(2);
    expect(s.subtotal()).toBe(4000);
  });

  it("merges same id+size, separates different size", () => {
    const a = useCart.getState().add;
    a({ id: "p1", name: "Saree", image: "/x.jpg", size: "M", price: 2000 }, 1);
    a({ id: "p1", name: "Saree", image: "/x.jpg", size: "M", price: 2000 }, 1);
    a({ id: "p1", name: "Saree", image: "/x.jpg", size: "L", price: 2000 }, 1);
    expect(useCart.getState().items.length).toBe(2);
    expect(useCart.getState().count()).toBe(3);
  });

  it("updateQty and remove work; qty<=0 removes", () => {
    useCart.getState().add({ id: "p1", name: "S", image: "/x.jpg", size: "M", price: 100 }, 3);
    const key = useCart.getState().items[0].key;
    useCart.getState().updateQty(key, 1);
    expect(useCart.getState().count()).toBe(1);
    useCart.getState().updateQty(key, 0);
    expect(useCart.getState().items.length).toBe(0);
  });
});
