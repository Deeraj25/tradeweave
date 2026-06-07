export type Size = "S" | "M" | "L" | "XL" | "XXL";
export type Channel = "retail" | "wholesale" | "both";

export type WholesaleTier = { minQty: number; pricePerUnit: number };

export type Product = {
  id: string;
  name: string;
  type: string; // e.g. "Saree", "Lehenga", "Kurta", "Dress", "Shirt"
  category: Channel;
  origin: "traditional" | "western";
  image: string; // /catalog/xxx.jpg
  retailPrice: number; // INR
  sizes: Size[];
  colors: string[];
  tags: string[];
  description: string;
  rating: number;
  moq?: number; // wholesale minimum order quantity
  wholesaleTiers?: WholesaleTier[];
};

export type Sale = {
  id: string;
  productId: string;
  type: string; // dress type, for analytics
  channel: "retail" | "wholesale";
  qty: number;
  revenue: number; // INR
  date: string; // ISO date
};
