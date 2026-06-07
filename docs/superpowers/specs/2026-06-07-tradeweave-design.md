# Tradeweave — Phase 1 Design Spec

**Date:** 2026-06-07
**Status:** Approved (design), pending implementation plan
**Owner:** Deeraj

---

## 1. Vision & Scope

Tradeweave is a direct B2B + retail clothing marketplace ("no middlemen") with an
ambitious long-term vision (offline-store billing/POS, real-time logistics tracking,
warranty support, data monetization, AI-training datasets, delivery-partner & investor
operations).

**Phase 1 deliberately builds only the customer-facing experience**, split into
**Retail** and **Wholesale**, plus a developer/admin analytics dashboard and a rebranded
animated auth flow. Everything is a **polished front-end prototype backed by realistic
mock data** — it looks fully alive and is investor-demo ready, with no server required.

### In scope (Phase 1)
1. Customer storefront — Retail + Wholesale (separated).
2. Admin/developer analytics dashboard with data visualization.
3. AI "Try On Me" — **simulated** suitability/fit experience (retail only).
4. Aurora-style animated auth (sign up / log in), rebranded to Tradeweave.

### Explicitly out of scope (future phases / roadmap)
- In-built billing/POS for offline stores.
- Real backend, real auth, real payments.
- Real-time tracking (packing → shipping → delivery) + warranty support.
- Data monetization / AI-training pipeline.
- Delivery-partner integrations & investor/funding operations.
- Real ML for the AI try-on.

---

## 2. Brand & Theme

- **Name:** Tradeweave — tagline *"Where trade weaves together."*
- **Palette:**
  - Ink black `#0A0A0A` (page bg)
  - Panel gray `#161616` (`--color-brand-gray`)
  - **Warm gold `#D4A537`** (primary accent / CTA)
  - Soft gold `#E6C566`, cream `#F5EFE6` (text highlights)
- **Typography:** `Inter` (300–700) for UI; `Playfair Display` for large display headings → premium/luxe feel.
- **Logo:** custom woven monogram SVG in gold (a stylized interlaced "weave" mark).
- **Motion language:** cinematic — parallax, scroll reveals, 3D flip cards, page transitions, count-up numbers, gold shimmer accents.

---

## 3. Sitemap & Pages

| Route | Page | Purpose |
|-------|------|---------|
| `/` | Home | Cinematic hero, parallax, featured collections, Retail vs Wholesale split entry |
| `/signup` | Sign Up | Aurora two-column layout, rebranded; 3-phase steps for a clothing marketplace |
| `/login` | Log In | Matching auth screen |
| `/retail` | Retail storefront | Product grid, filters, flip-card quick-add, Try-On entry |
| `/wholesale` | Wholesale storefront | B2B grid: tier/bulk pricing, MOQ, GST/business fields, "Request Quote" |
| `/product/:id` | Product detail | Full "go inside & select" path (kept alongside quick-add) |
| `/cart` | Cart | Animated cart + order summary |
| `/try-on` | AI Try On Me | Retail-only simulated fit/suitability experience |
| `/admin` | Admin analytics | Developer dashboard with charts |

---

## 4. Signature Interactions

### 4.1 Flip-card quick add (retail + wholesale grid)
- Card shows the square catalog image by default.
- On hover: **3D `rotateY` flip** reveals size chips `S M L XL` (+ price) for **one-click add to cart**.
- Card body still clickable → opens full `/product/:id` detail (both paths kept).

### 4.2 Cinematic layer (motion/react)
- Parallax hero, scroll-reveal sections (`whileInView`), page transitions (`AnimatePresence`),
  animated count-up numbers, magnetic/hover-scale buttons, gold shimmer accents.

### 4.3 AI Try On Me (simulated, retail)
- User uploads a body photo → shows a **suitability score**, **size recommendation**, and a
  **color-match meter**, with the garment layered over a silhouette/preview.
- Clearly labeled as a preview/simulation. No real ML in Phase 1.

### 4.4 Admin analytics dashboard
- KPI cards (units sold, revenue, AOV) with **count-up** animation.
- **Recharts**: bar = *items sold by dress type*, line = *sales over time*, donut = *category split*.
- Toggle between **Retail / Wholesale** datasets.

---

## 5. Auth Screen (rebranded Aurora)

Based on the user's "Aurora Sign Up" prompt, adapted:
- Two-column layout: left hero (background **fashion/textile video**, no dark overlay),
  right form. Rebranded to **Tradeweave**, gold-on-black theme.
- Left hero: Tradeweave logo + "Join Tradeweave" + 3 staggered `StepItem`s
  (e.g. "Create your account" (active) → "Tell us your style" → "Start trading").
- **Social/auth buttons (CHANGED per user): "Continue with Google" + "Continue with Mobile" (phone + OTP). GitHub removed.**
- Form: First/Last name (grid), Email, Password (with `Eye` toggle + helper text),
  "Create Account" CTA, footer link to Log In.
- Reusable components: `StepItem`, `SocialButton`, `InputGroup` — styled to the gold/black theme.

---

## 6. Tech & Architecture

- **Build:** Vite + React + TypeScript.
- **Styling:** Tailwind CSS v4 + custom theme tokens (gold/black) in `index.css`.
- **Animation:** `motion/react`.
- **Icons:** `lucide-react`.
- **Routing:** `react-router-dom`.
- **Charts:** `recharts`.
- **State:** `zustand` (cart + mock auth/session).

### Proposed structure
```
tradeweave/
  index.html
  package.json
  vite.config.ts
  tsconfig.json
  src/
    main.tsx
    App.tsx                # router + layout shell
    index.css              # Tailwind v4 + theme tokens + fonts
    data/                  # mock catalog, sales, categories
      products.ts
      sales.ts
      categories.ts
    store/
      cart.ts
      auth.ts
    lib/
      motion.ts            # shared animation variants
      format.ts            # currency/number helpers
    components/
      Navbar.tsx Footer.tsx
      ProductCard.tsx      # the 3D flip card
      KpiCard.tsx ...
    pages/
      Home.tsx Login.tsx Signup.tsx
      Retail.tsx Wholesale.tsx ProductDetail.tsx
      Cart.tsx TryOn.tsx Admin.tsx
  public/
    catalog/               # downloaded images (Indian traditional + western)
```

### Images
- Curated **traditional Indian dress** images from Pixabay + western/casual from another
  free source, **downloaded into `public/catalog/`** so the demo is reliable (no broken hotlinks).
- Each product in `products.ts` references a local image path + metadata
  (name, type, retail price, wholesale tiers, MOQ, sizes, category).

---

## 7. Mock Data Model (sketch)

```ts
type Product = {
  id: string;
  name: string;
  type: string;          // e.g. "Saree", "Lehenga", "Kurta", "Dress", "Shirt"
  category: "retail" | "wholesale" | "both";
  image: string;         // /catalog/xxx.jpg
  retailPrice: number;
  wholesaleTiers?: { minQty: number; pricePerUnit: number }[];
  moq?: number;          // wholesale min order qty
  sizes: ("S"|"M"|"L"|"XL"|"XXL")[];
  colors?: string[];
  tags?: string[];
};

type Sale = {
  id: string;
  productId: string;
  type: string;          // dress type, for analytics
  channel: "retail" | "wholesale";
  qty: number;
  revenue: number;
  date: string;          // ISO
};
```

The `sales.ts` dataset powers the admin charts (items sold by type, sales over time,
category split, retail vs wholesale).

---

## 8. Success Criteria

- Site runs locally via `npm run dev` with zero console errors.
- All 9 routes render and navigate with animated transitions.
- Flip-card hover→sizes→add-to-cart works; product detail path also works.
- Cart math (qty, subtotal, total) is correct.
- Admin charts render from the mock sales dataset and toggle retail/wholesale.
- Try-On page accepts an upload and shows a simulated suitability result.
- Auth screen matches the Aurora layout, rebranded, with Google + Mobile options.
- Looks visibly "rich"/cinematic, not a basic template.

---

## 9. Roadmap (post Phase 1)

POS billing for offline stores → real backend + auth → real payments → logistics/tracking
+ warranty → data/AI-training pipeline → delivery-partner & investor operations.
