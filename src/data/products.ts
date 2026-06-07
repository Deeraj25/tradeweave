import type { Product, Size } from "./types";

const tiers = (base: number) => [
  { minQty: 10, pricePerUnit: Math.round(base * 0.7) },
  { minQty: 50, pricePerUnit: Math.round(base * 0.6) },
  { minQty: 100, pricePerUnit: Math.round(base * 0.52) },
];

const ALL: Size[] = ["S", "M", "L", "XL", "XXL"];
const WOMEN: Size[] = ["S", "M", "L", "XL"];

export const products: Product[] = [
  // ── Traditional Indian ──────────────────────────────────────────────
  {
    id: "kanjeevaram-saree",
    name: "Kanjeevaram Silk Saree",
    type: "Saree",
    category: "both",
    origin: "traditional",
    image: "/catalog/kanjeevaram-saree.jpg",
    retailPrice: 8499,
    sizes: ["M", "L", "XL"],
    colors: ["Maroon", "Gold", "Teal"],
    tags: ["silk", "bridal", "handloom"],
    description:
      "Pure mulberry-silk Kanjeevaram with a contrast zari border and temple motifs — woven by South Indian master weavers.",
    rating: 4.8,
    moq: 10,
    wholesaleTiers: tiers(8499),
  },
  {
    id: "banarasi-saree",
    name: "Banarasi Zari Saree",
    type: "Saree",
    category: "both",
    origin: "traditional",
    image: "/catalog/banarasi-saree.jpg",
    retailPrice: 6299,
    sizes: ["M", "L", "XL"],
    colors: ["Red", "Royal Blue", "Emerald"],
    tags: ["silk", "festive", "zari"],
    description:
      "Classic Banarasi weave with intricate gold zari brocade — the heirloom drape for weddings and festivals.",
    rating: 4.7,
    moq: 10,
    wholesaleTiers: tiers(6299),
  },
  {
    id: "bridal-lehenga",
    name: "Bridal Velvet Lehenga",
    type: "Lehenga",
    category: "retail",
    origin: "traditional",
    image: "/catalog/bridal-lehenga.jpg",
    retailPrice: 18999,
    sizes: WOMEN,
    colors: ["Crimson", "Wine", "Rust"],
    tags: ["bridal", "embroidered", "velvet"],
    description:
      "Hand-embroidered velvet bridal lehenga with sequin and dori work, a flared can-can skirt and dupatta.",
    rating: 4.9,
  },
  {
    id: "festive-lehenga",
    name: "Festive Georgette Lehenga",
    type: "Lehenga",
    category: "both",
    origin: "traditional",
    image: "/catalog/festive-lehenga.jpg",
    retailPrice: 9499,
    sizes: WOMEN,
    colors: ["Pink", "Mustard", "Sea Green"],
    tags: ["festive", "lightweight", "mirror-work"],
    description:
      "Flowy georgette lehenga with mirror and thread work — easy to drape and perfect for sangeet nights.",
    rating: 4.6,
    moq: 10,
    wholesaleTiers: tiers(9499),
  },
  {
    id: "anarkali-gown",
    name: "Floor-Length Anarkali Gown",
    type: "Anarkali",
    category: "retail",
    origin: "traditional",
    image: "/catalog/anarkali-gown.jpg",
    retailPrice: 7299,
    sizes: WOMEN,
    colors: ["Navy", "Wine", "Black"],
    tags: ["gown", "embroidered", "party"],
    description:
      "Regal floor-length Anarkali with a fitted yoke, flared silhouette and matching dupatta.",
    rating: 4.5,
  },
  {
    id: "salwar-kameez",
    name: "Embroidered Salwar Kameez",
    type: "Salwar",
    category: "both",
    origin: "traditional",
    image: "/catalog/salwar-kameez.jpg",
    retailPrice: 3499,
    sizes: ALL,
    colors: ["Peach", "Sky", "Olive"],
    tags: ["daily", "cotton", "comfort"],
    description:
      "Breathable cotton-blend salwar kameez with neckline embroidery — an everyday ethnic staple.",
    rating: 4.4,
    moq: 20,
    wholesaleTiers: tiers(3499),
  },
  {
    id: "silk-kurta",
    name: "Men's Silk Kurta",
    type: "Kurta",
    category: "both",
    origin: "traditional",
    image: "/catalog/silk-kurta.jpg",
    retailPrice: 2799,
    sizes: ALL,
    colors: ["Cream", "Maroon", "Indigo"],
    tags: ["men", "silk", "festive"],
    description:
      "Dupion-silk kurta with a mandarin collar and subtle sheen — pair with a Nehru jacket for festivities.",
    rating: 4.6,
    moq: 20,
    wholesaleTiers: tiers(2799),
  },
  {
    id: "cotton-kurta-set",
    name: "Cotton Kurta Pyjama Set",
    type: "Kurta",
    category: "both",
    origin: "traditional",
    image: "/catalog/cotton-kurta-set.jpg",
    retailPrice: 1999,
    sizes: ALL,
    colors: ["White", "Beige", "Sage"],
    tags: ["men", "cotton", "daily"],
    description:
      "Soft handloom cotton kurta with a matching pyjama — light, breathable and made for Indian summers.",
    rating: 4.3,
    moq: 25,
    wholesaleTiers: tiers(1999),
  },
  {
    id: "royal-sherwani",
    name: "Royal Groom Sherwani",
    type: "Sherwani",
    category: "retail",
    origin: "traditional",
    image: "/catalog/royal-sherwani.jpg",
    retailPrice: 15999,
    sizes: ALL,
    colors: ["Ivory", "Gold", "Maroon"],
    tags: ["groom", "wedding", "embroidered"],
    description:
      "Regal embroidered sherwani with a structured silhouette and matching stole — for the groom's big day.",
    rating: 4.9,
  },

  // ── Western / casual ────────────────────────────────────────────────
  {
    id: "floral-summer-dress",
    name: "Floral Summer Dress",
    type: "Dress",
    category: "both",
    origin: "western",
    image: "/catalog/floral-summer-dress.jpg",
    retailPrice: 2299,
    sizes: WOMEN,
    colors: ["Red Floral", "Blue Floral", "Black"],
    tags: ["women", "casual", "summer"],
    description:
      "Breezy floral wrap dress in soft rayon with a flattering V-neck — effortless warm-weather style.",
    rating: 4.5,
    moq: 20,
    wholesaleTiers: tiers(2299),
  },
  {
    id: "evening-gown",
    name: "Satin Evening Gown",
    type: "Dress",
    category: "retail",
    origin: "western",
    image: "/catalog/evening-gown.jpg",
    retailPrice: 5499,
    sizes: WOMEN,
    colors: ["Emerald", "Burgundy", "Midnight"],
    tags: ["women", "party", "formal"],
    description:
      "Floor-sweeping satin gown with a draped bodice and thigh-high slit — red-carpet ready.",
    rating: 4.7,
  },
  {
    id: "denim-jacket",
    name: "Classic Denim Jacket",
    type: "Jacket",
    category: "both",
    origin: "western",
    image: "/catalog/denim-jacket.jpg",
    retailPrice: 2599,
    sizes: ALL,
    colors: ["Washed Blue", "Black", "Stone"],
    tags: ["unisex", "casual", "denim"],
    description:
      "A timeless mid-wash denim trucker jacket with a relaxed fit — layer it over anything.",
    rating: 4.6,
    moq: 20,
    wholesaleTiers: tiers(2599),
  },
  {
    id: "classic-white-shirt",
    name: "Classic White Shirt",
    type: "Shirt",
    category: "both",
    origin: "western",
    image: "/catalog/classic-white-shirt.jpg",
    retailPrice: 1499,
    sizes: ALL,
    colors: ["White", "Sky", "Black"],
    tags: ["men", "formal", "cotton"],
    description:
      "Crisp wrinkle-resistant cotton shirt with a tailored fit — the backbone of any wardrobe.",
    rating: 4.4,
    moq: 30,
    wholesaleTiers: tiers(1499),
  },
  {
    id: "linen-coord-set",
    name: "Linen Co-ord Set",
    type: "Co-ord",
    category: "both",
    origin: "western",
    image: "/catalog/linen-coord-set.jpg",
    retailPrice: 3299,
    sizes: WOMEN,
    colors: ["Sand", "Olive", "White"],
    tags: ["women", "resort", "linen"],
    description:
      "Relaxed two-piece linen co-ord with a cropped shirt and wide-leg trousers — elevated vacation dressing.",
    rating: 4.5,
    moq: 15,
    wholesaleTiers: tiers(3299),
  },
  {
    id: "knit-sweater",
    name: "Ribbed Knit Sweater",
    type: "Sweater",
    category: "both",
    origin: "western",
    image: "/catalog/knit-sweater.jpg",
    retailPrice: 1899,
    sizes: ALL,
    colors: ["Camel", "Charcoal", "Cream"],
    tags: ["unisex", "winter", "knit"],
    description:
      "Cozy ribbed-knit pullover in a soft acrylic-wool blend — warm without the weight.",
    rating: 4.3,
    moq: 25,
    wholesaleTiers: tiers(1899),
  },
  {
    id: "tailored-blazer",
    name: "Tailored Wool Blazer",
    type: "Blazer",
    category: "retail",
    origin: "western",
    image: "/catalog/tailored-blazer.jpg",
    retailPrice: 4999,
    sizes: ALL,
    colors: ["Charcoal", "Navy", "Camel"],
    tags: ["men", "formal", "wool"],
    description:
      "Sharp single-breasted wool-blend blazer with a structured shoulder — instant boardroom polish.",
    rating: 4.6,
  },
];

// ── Helpers ───────────────────────────────────────────────────────────
export const getProduct = (id: string): Product | undefined =>
  products.find((p) => p.id === id);

export const retailProducts = products.filter(
  (p) => p.category === "retail" || p.category === "both",
);

export const wholesaleProducts = products.filter(
  (p) => p.category === "wholesale" || p.category === "both",
);

export const productTypes = Array.from(new Set(products.map((p) => p.type)));

export const relatedProducts = (p: Product, limit = 4): Product[] =>
  products.filter((x) => x.id !== p.id && x.type === p.type).slice(0, limit);
