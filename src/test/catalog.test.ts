import { describe, it, expect } from "vitest";
import { products, getProduct, retailProducts, wholesaleProducts } from "../data/products";
import { sales, kpis, salesByType, categorySplit } from "../data/sales";

describe("catalog", () => {
  it("every product has a local catalog image, price and sizes", () => {
    for (const p of products) {
      expect(p.image.startsWith("/catalog/")).toBe(true);
      expect(p.retailPrice).toBeGreaterThan(0);
      expect(p.sizes.length).toBeGreaterThan(0);
      expect(p.colors.length).toBeGreaterThan(0);
    }
  });

  it("wholesale products have MOQ and ascending-qty, descending-price tiers", () => {
    for (const p of products.filter((p) => p.wholesaleTiers)) {
      expect(p.moq).toBeGreaterThan(0);
      const t = p.wholesaleTiers!;
      for (let i = 1; i < t.length; i++) {
        expect(t[i].minQty).toBeGreaterThan(t[i - 1].minQty);
        expect(t[i].pricePerUnit).toBeLessThanOrEqual(t[i - 1].pricePerUnit);
      }
    }
  });

  it("getProduct returns by id and splits are non-empty", () => {
    expect(getProduct(products[0].id)?.id).toBe(products[0].id);
    expect(retailProducts.length).toBeGreaterThan(0);
    expect(wholesaleProducts.length).toBeGreaterThan(0);
  });
});

describe("sales analytics", () => {
  it("generates a stable, non-empty dataset", () => {
    expect(sales.length).toBeGreaterThan(60);
  });

  it("kpis are internally consistent", () => {
    const all = kpis("all");
    const r = kpis("retail");
    const w = kpis("wholesale");
    expect(all.orders).toBe(r.orders + w.orders);
    expect(all.units).toBe(r.units + w.units);
    expect(all.aov).toBeGreaterThan(0);
  });

  it("salesByType is sorted by units desc and categorySplit sums to total units", () => {
    const byType = salesByType("all");
    for (let i = 1; i < byType.length; i++) {
      expect(byType[i].units).toBeLessThanOrEqual(byType[i - 1].units);
    }
    const split = categorySplit("all");
    const total = split.reduce((n, s) => n + s.value, 0);
    expect(total).toBe(kpis("all").units);
  });
});
