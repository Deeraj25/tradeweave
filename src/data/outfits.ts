// Mock outfit feed. Images are the repo's locally-downloaded CC-licensed photos
// (public/catalog) so the demo never shows a broken image. Each palette is a set
// of hexes that the colour-theory engine scores against the user's profile.

export type Source = "Vogue" | "Pinterest" | "Instagram" | "Runway" | "Lookbook";
export type Category = "Casual" | "Formal" | "Street" | "Evening";

export type OutfitItem = { name: string; color: string };

export type Outfit = {
  id: string;
  title: string;
  image: string;
  source: Source;
  category: Category;
  palette: string[];
  items: OutfitItem[];
};

export const CATEGORIES = ["All", "Casual", "Formal", "Street", "Evening"] as const;
export const SOURCES: Source[] = ["Vogue", "Pinterest", "Instagram", "Runway", "Lookbook"];

export const outfits: Outfit[] = [
  {
    id: "kanjeevaram-saree",
    title: "Kanjeevaram in Burgundy & Gold",
    image: "/catalog/kanjeevaram-saree.jpg",
    source: "Vogue",
    category: "Evening",
    palette: ["#6e2230", "#d4a537", "#1f6f6b", "#f5efe6"],
    items: [
      { name: "Kanjeevaram silk saree", color: "burgundy" },
      { name: "Temple-gold jhumkas", color: "gold" },
      { name: "Embroidered potli clutch", color: "teal" },
    ],
  },
  {
    id: "royal-sherwani",
    title: "Ivory Sherwani, Gold Detailing",
    image: "/catalog/royal-sherwani.jpg",
    source: "Runway",
    category: "Formal",
    palette: ["#f3e9d2", "#d4a537", "#6e2230"],
    items: [
      { name: "Raw-silk sherwani", color: "ivory" },
      { name: "Brocade nehru jacket", color: "gold" },
      { name: "Velvet mojaris", color: "burgundy" },
    ],
  },
  {
    id: "cotton-kurta-set",
    title: "Sage & Cream Cotton Co-ord",
    image: "/catalog/cotton-kurta-set.jpg",
    source: "Pinterest",
    category: "Casual",
    palette: ["#f5efe6", "#9caf88", "#c19a6b"],
    items: [
      { name: "Handloom cotton kurta", color: "cream" },
      { name: "Block-print dupatta", color: "sage" },
      { name: "Tan kolhapuris", color: "camel" },
    ],
  },
  {
    id: "anarkali-gown",
    title: "Wine Anarkali, Floor-Sweeping",
    image: "/catalog/anarkali-gown.jpg",
    source: "Instagram",
    category: "Evening",
    palette: ["#6e2230", "#c19a6b", "#f3e9d2"],
    items: [
      { name: "Floor-length anarkali", color: "burgundy" },
      { name: "Gold-dust dupatta", color: "camel" },
      { name: "Pearl drops", color: "ivory" },
    ],
  },
  {
    id: "knit-sweater",
    title: "Camel Knit, Chocolate Layering",
    image: "/catalog/knit-sweater.jpg",
    source: "Lookbook",
    category: "Casual",
    palette: ["#c19a6b", "#f5efe6", "#5a3a2e"],
    items: [
      { name: "Lambswool knit", color: "camel" },
      { name: "Cream wide trouser", color: "cream" },
      { name: "Suede chelsea boots", color: "chocolate" },
    ],
  },
  {
    id: "silk-kurta",
    title: "Mustard Silk Kurta, Tonal",
    image: "/catalog/silk-kurta.jpg",
    source: "Vogue",
    category: "Formal",
    palette: ["#c9a227", "#f5efe6", "#5a3a2e"],
    items: [
      { name: "Mustard silk kurta", color: "mustard" },
      { name: "Cream churidar", color: "cream" },
      { name: "Brown leather sandals", color: "chocolate" },
    ],
  },
  {
    id: "linen-coord-set",
    title: "Stone Linen, Olive Notes",
    image: "/catalog/linen-coord-set.jpg",
    source: "Pinterest",
    category: "Formal",
    palette: ["#b8ac9c", "#f3e9d2", "#6b7536"],
    items: [
      { name: "Linen blazer", color: "stone" },
      { name: "Wide linen trouser", color: "ivory" },
      { name: "Olive woven belt", color: "olive" },
    ],
  },
  {
    id: "denim-jacket",
    title: "Denim & Rust Street Layer",
    image: "/catalog/denim-jacket.jpg",
    source: "Instagram",
    category: "Street",
    palette: ["#3e5c76", "#f5efe6", "#a6492b", "#2b2b2b"],
    items: [
      { name: "Washed denim jacket", color: "denim" },
      { name: "Cream graphic tee", color: "cream" },
      { name: "Rust beanie", color: "rust" },
    ],
  },
  {
    id: "salwar-kameez",
    title: "Teal Salwar, Gold Trim",
    image: "/catalog/salwar-kameez.jpg",
    source: "Pinterest",
    category: "Casual",
    palette: ["#1f6f6b", "#d4a537", "#f5efe6"],
    items: [
      { name: "Teal cotton kameez", color: "teal" },
      { name: "Gold gota dupatta", color: "gold" },
      { name: "Cream juttis", color: "cream" },
    ],
  },
  {
    id: "tailored-blazer",
    title: "Charcoal Blazer, Camel Base",
    image: "/catalog/tailored-blazer.jpg",
    source: "Runway",
    category: "Formal",
    palette: ["#2b2b2b", "#c19a6b", "#f5efe6"],
    items: [
      { name: "Charcoal wool blazer", color: "charcoal" },
      { name: "Camel turtleneck", color: "camel" },
      { name: "Cream tailored trouser", color: "cream" },
    ],
  },
  {
    id: "floral-summer-dress",
    title: "Blush Floral, Soft Daywear",
    image: "/catalog/floral-summer-dress.jpg",
    source: "Lookbook",
    category: "Casual",
    palette: ["#e6b7a9", "#9caf88", "#f5efe6"],
    items: [
      { name: "Blush floral midi", color: "blush" },
      { name: "Sage cardigan", color: "sage" },
      { name: "Cream espadrilles", color: "cream" },
    ],
  },
  {
    id: "bridal-lehenga",
    title: "Bridal Lehenga, Deep Red & Gold",
    image: "/catalog/bridal-lehenga.jpg",
    source: "Vogue",
    category: "Evening",
    palette: ["#8c3b2b", "#d4a537", "#6e2230"],
    items: [
      { name: "Hand-embroidered lehenga", color: "brick" },
      { name: "Zardozi gold odhani", color: "gold" },
      { name: "Kundan choker", color: "burgundy" },
    ],
  },
  {
    id: "banarasi-saree",
    title: "Banarasi, Emerald & Gold",
    image: "/catalog/banarasi-saree.jpg",
    source: "Runway",
    category: "Evening",
    palette: ["#1e5c3a", "#d4a537", "#f3e9d2"],
    items: [
      { name: "Banarasi silk saree", color: "emerald" },
      { name: "Zari gold border", color: "gold" },
      { name: "Ivory silk blouse", color: "ivory" },
    ],
  },
  {
    id: "classic-white-shirt",
    title: "Crisp White Shirt, Denim",
    image: "/catalog/classic-white-shirt.jpg",
    source: "Pinterest",
    category: "Casual",
    palette: ["#ffffff", "#3e5c76", "#2b2b2b"],
    items: [
      { name: "Poplin white shirt", color: "white" },
      { name: "Straight indigo jean", color: "denim" },
      { name: "Charcoal loafers", color: "charcoal" },
    ],
  },
  {
    id: "festive-lehenga",
    title: "Festive Lehenga, Fuchsia Pop",
    image: "/catalog/festive-lehenga.jpg",
    source: "Instagram",
    category: "Evening",
    palette: ["#c2247f", "#d4a537", "#f3e9d2"],
    items: [
      { name: "Georgette lehenga", color: "fuchsia" },
      { name: "Mirror-work blouse", color: "gold" },
      { name: "Ivory net dupatta", color: "ivory" },
    ],
  },
  {
    id: "evening-gown",
    title: "Silver Column Evening Gown",
    image: "/catalog/evening-gown.jpg",
    source: "Runway",
    category: "Evening",
    palette: ["#0a0a0a", "#c4c8cc", "#50607a"],
    items: [
      { name: "Satin column gown", color: "black" },
      { name: "Crystal drop earrings", color: "silver" },
      { name: "Slate satin clutch", color: "slate" },
    ],
  },
];
