# Tradeweave Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (inline) to implement this plan milestone-by-milestone. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an investor-ready, cinematic front-end prototype for Tradeweave — a retail + wholesale clothing marketplace — with working cart, working wholesale ordering/enquiry, a real-file-picker deterministic AI Try-On, rebranded animated auth, and a Recharts admin dashboard, all driven by realistic mock data.

**Architecture:** Vite + React + TypeScript SPA. Routing via react-router-dom. Global state via zustand (cart + wholesale order + mock session) persisted to localStorage. Animations via motion/react. Charts via recharts. Mock catalog + sales data in `src/data`. Catalog images downloaded into `public/catalog`. Logic with hard acceptance criteria (cart math, deterministic try-on, wholesale order/tiers) is covered by vitest unit tests; visual/cinematic pieces are verified by building and previewing.

**Tech Stack:** Vite, React 18, TypeScript, Tailwind CSS v4, motion/react, lucide-react, react-router-dom, recharts, zustand, vitest.

**Verification approach:** Logic → `npm run test` (vitest). Visual → `npm run build` must pass with no errors, then live preview in browser. Each milestone ends with a commit.

---

## File Structure

```
tradeweave/
  index.html
  package.json  vite.config.ts  tsconfig.json  tsconfig.node.json
  postcss/tailwind config (v4 via @tailwindcss/vite)
  scripts/fetch-images.mjs          # downloads catalog images into public/catalog
  public/catalog/*.jpg
  src/
    main.tsx                        # mounts <App/> with BrowserRouter
    App.tsx                         # routes + layout shell + page transitions
    index.css                       # Tailwind v4 import + theme tokens + fonts + base
    lib/
      format.ts                     # currency/number formatting
      hash.ts                       # stable string->int hash (try-on determinism)
      motion.ts                     # shared motion variants
    data/
      types.ts                      # Product, Sale, WholesaleTier types
      products.ts                   # mock catalog (retail + wholesale)
      sales.ts                      # mock sales dataset for analytics
      tryon.ts                      # size-chart + deterministic prediction logic
    store/
      cart.ts                       # retail cart (zustand, persisted)
      wholesale.ts                  # wholesale order (zustand, persisted)
      auth.ts                       # mock session (zustand, persisted)
    components/
      Navbar.tsx  Footer.tsx
      ProductCard.tsx               # 3D flip card (hover -> sizes -> quick add)
      QuoteModal.tsx                # working wholesale enquiry/quote form
      KpiCard.tsx                   # count-up KPI
      Reveal.tsx                    # scroll-reveal wrapper
      Logo.tsx                      # gold woven monogram SVG
    pages/
      Home.tsx  Signup.tsx  Login.tsx
      Retail.tsx  Wholesale.tsx  ProductDetail.tsx
      Cart.tsx  TryOn.tsx  Admin.tsx
    test/
      cart.test.ts  wholesale.test.ts  tryon.test.ts  format.test.ts
```

---

## Milestone 0: Scaffold & theme

**Files:** `package.json`, `vite.config.ts`, `tsconfig*.json`, `index.html`, `src/main.tsx`, `src/App.tsx`, `src/index.css`

- [ ] **Step 1: Scaffold Vite React-TS project in place**

Run in `C:/Users/DEERAJ/Tradeweave`:
```bash
npm create vite@latest . -- --template react-ts
```
(Keep existing `docs/`, `.git/`. If the CLI refuses on non-empty dir, scaffold in a temp dir and copy `src/`, config files, `index.html`, `package.json` over.)

- [ ] **Step 2: Install dependencies**

```bash
npm install
npm install react-router-dom motion lucide-react recharts zustand
npm install -D @tailwindcss/vite vitest @testing-library/react @testing-library/jest-dom jsdom
```

- [ ] **Step 3: Configure Tailwind v4 + vitest in `vite.config.ts`**

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: { environment: "jsdom", globals: true, setupFiles: ["./src/test/setup.ts"] },
});
```
Create `src/test/setup.ts` with `import "@testing-library/jest-dom";`.
Add scripts to `package.json`: `"test": "vitest run"`, `"test:watch": "vitest"`.

- [ ] **Step 4: Write `src/index.css` — Tailwind v4 import + theme tokens + fonts**

```css
@import "tailwindcss";

@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@500;600;700&display=swap");

@theme {
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-display: "Playfair Display", ui-serif, Georgia, serif;
  --color-ink: #0A0A0A;
  --color-brand-gray: #161616;
  --color-gold: #D4A537;
  --color-gold-soft: #E6C566;
  --color-cream: #F5EFE6;
}

body { @apply font-sans bg-ink text-cream antialiased; }
.text-display { font-family: var(--font-display); }
/* gold shimmer util */
@keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
.shimmer-gold {
  background: linear-gradient(90deg,#D4A537,#F5EFE6,#D4A537);
  background-size:200% 100%; -webkit-background-clip:text; background-clip:text;
  color:transparent; animation:shimmer 4s linear infinite;
}
```

- [ ] **Step 5: Router shell in `src/App.tsx` with page transitions**

`App.tsx` renders `<Navbar/>`, an `<AnimatePresence mode="wait">`-wrapped `<Routes>` (keyed on `location.pathname`), and `<Footer/>`. Routes: `/`, `/signup`, `/login`, `/retail`, `/wholesale`, `/product/:id`, `/cart`, `/try-on`, `/admin`. `main.tsx` wraps `<App/>` in `<BrowserRouter>`. Each page is wrapped in a `motion.div` fade/slide transition. Stub each page to return its name for now.

- [ ] **Step 6: Verify dev server + build**

Run: `npm run build`
Expected: build succeeds, no TS errors. Then `npm run dev` and confirm the app loads (manual preview).

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "feat: scaffold Vite+React+TS, Tailwind v4 gold/black theme, router shell"
```

---

## Milestone 1: Mock data + catalog images

**Files:** `src/data/types.ts`, `src/data/products.ts`, `src/data/sales.ts`, `scripts/fetch-images.mjs`, `public/catalog/*`

- [ ] **Step 1: Define `src/data/types.ts`**

```ts
export type Size = "S" | "M" | "L" | "XL" | "XXL";
export type Channel = "retail" | "wholesale" | "both";
export type WholesaleTier = { minQty: number; pricePerUnit: number };
export type Product = {
  id: string; name: string; type: string; category: Channel;
  image: string; retailPrice: number; sizes: Size[]; colors: string[];
  tags: string[]; moq?: number; wholesaleTiers?: WholesaleTier[];
  description: string;
};
export type Sale = {
  id: string; productId: string; type: string;
  channel: "retail" | "wholesale"; qty: number; revenue: number; date: string;
};
```

- [ ] **Step 2: Image fetch script `scripts/fetch-images.mjs`**

Script downloads ~16 images into `public/catalog/` using Node `fetch` + `fs`. Use Pixabay CDN image URLs for traditional Indian dresses (saree, lehenga, kurta, salwar) and additional free CDN URLs for western/casual (dress, shirt, jacket). Each saved as `public/catalog/<slug>.jpg`. Include a hardcoded array of `{url, file}` pairs. On any failed download, log and continue (don't crash). Add `"images": "node scripts/fetch-images.mjs"` to package.json scripts. Run: `npm run images`. Verify files exist in `public/catalog/`. (If a URL 404s, replace with another working free image URL; the catalog must end with a valid local image per product.)

- [ ] **Step 3: Build `src/data/products.ts`**

Export `products: Product[]` with ~16 items spanning types: Saree, Lehenga, Kurta, Salwar, Anarkali (traditional) and Dress, Shirt, Jacket, Top (western). Each references a local `/catalog/<slug>.jpg`. Retail items have `retailPrice`, `sizes`, `colors`. Wholesale-capable items (`category: "wholesale"` or `"both"`) include `moq` and `wholesaleTiers` (e.g. `[{minQty:10,pricePerUnit:X},{minQty:50,pricePerUnit:X*0.9},{minQty:100,pricePerUnit:X*0.8}]`). Add helpers: `getProduct(id)`, `retailProducts`, `wholesaleProducts`, `productTypes` (unique).

- [ ] **Step 4: Build `src/data/sales.ts`**

Export `sales: Sale[]` (~120 rows) across the last ~6 months, both channels, referencing real product ids/types, with realistic qty/revenue. Add derived helpers used by Admin: `salesByType(channel?)`, `salesOverTime(channel?)`, `categorySplit(channel?)`, `kpis(channel?)` returning `{units, revenue, aov, orders}`.

- [ ] **Step 5: Test data integrity — `src/test/format.test.ts` (data sanity portion)**

```ts
import { describe, it, expect } from "vitest";
import { products, getProduct } from "../data/products";
describe("catalog", () => {
  it("every product has a local catalog image and price", () => {
    for (const p of products) {
      expect(p.image.startsWith("/catalog/")).toBe(true);
      expect(p.retailPrice).toBeGreaterThan(0);
      expect(p.sizes.length).toBeGreaterThan(0);
    }
  });
  it("wholesale products have MOQ and ascending-discount tiers", () => {
    for (const p of products.filter(p => p.wholesaleTiers)) {
      expect(p.moq).toBeGreaterThan(0);
      const tiers = p.wholesaleTiers!;
      for (let i=1;i<tiers.length;i++){
        expect(tiers[i].minQty).toBeGreaterThan(tiers[i-1].minQty);
        expect(tiers[i].pricePerUnit).toBeLessThanOrEqual(tiers[i-1].pricePerUnit);
      }
    }
  });
  it("getProduct returns by id", () => {
    expect(getProduct(products[0].id)?.id).toBe(products[0].id);
  });
});
```

- [ ] **Step 6: Run tests + commit**

Run: `npm run test` → Expected: PASS.
```bash
git add -A && git commit -m "feat: mock catalog + sales data and local catalog images"
```

---

## Milestone 2: State stores + formatting (TDD)

**Files:** `src/lib/format.ts`, `src/store/cart.ts`, `src/store/wholesale.ts`, `src/store/auth.ts`, tests

- [ ] **Step 1: `src/lib/format.ts`**

```ts
export const inr = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
export const num = (n: number) => new Intl.NumberFormat("en-IN").format(n);
```

- [ ] **Step 2: Write failing cart test `src/test/cart.test.ts`**

```ts
import { describe, it, expect, beforeEach } from "vitest";
import { useCart } from "../store/cart";
const reset = () => useCart.setState({ items: [] });
describe("cart store", () => {
  beforeEach(reset);
  it("adds an item and computes count + subtotal", () => {
    useCart.getState().add({ id:"p1", name:"Saree", image:"/catalog/a.jpg", size:"M", price:2000 }, 2);
    const s = useCart.getState();
    expect(s.count()).toBe(2);
    expect(s.subtotal()).toBe(4000);
  });
  it("merges same id+size, separates different size", () => {
    const a = useCart.getState().add;
    a({ id:"p1", name:"Saree", image:"/x.jpg", size:"M", price:2000 }, 1);
    a({ id:"p1", name:"Saree", image:"/x.jpg", size:"M", price:2000 }, 1);
    a({ id:"p1", name:"Saree", image:"/x.jpg", size:"L", price:2000 }, 1);
    expect(useCart.getState().items.length).toBe(2);
    expect(useCart.getState().count()).toBe(3);
  });
  it("updateQty and remove work; qty<=0 removes", () => {
    useCart.getState().add({ id:"p1", name:"S", image:"/x.jpg", size:"M", price:100 }, 3);
    const key = useCart.getState().items[0].key;
    useCart.getState().updateQty(key, 1);
    expect(useCart.getState().count()).toBe(1);
    useCart.getState().updateQty(key, 0);
    expect(useCart.getState().items.length).toBe(0);
  });
});
```

- [ ] **Step 3: Run test → expect FAIL** (`useCart` not defined). Run: `npm run test src/test/cart.test.ts`.

- [ ] **Step 4: Implement `src/store/cart.ts`**

```ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Size } from "../data/types";
export type CartLine = { key: string; id: string; name: string; image: string; size: Size | string; price: number; qty: number };
type CartInput = Omit<CartLine, "key" | "qty">;
type CartState = {
  items: CartLine[];
  add: (item: CartInput, qty?: number) => void;
  updateQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  count: () => number;
  subtotal: () => number;
};
export const useCart = create<CartState>()(persist((set, get) => ({
  items: [],
  add: (item, qty = 1) => set((s) => {
    const key = `${item.id}__${item.size}`;
    const existing = s.items.find(i => i.key === key);
    if (existing) return { items: s.items.map(i => i.key === key ? { ...i, qty: i.qty + qty } : i) };
    return { items: [...s.items, { ...item, key, qty }] };
  }),
  updateQty: (key, qty) => set((s) => ({
    items: qty <= 0 ? s.items.filter(i => i.key !== key) : s.items.map(i => i.key === key ? { ...i, qty } : i),
  })),
  remove: (key) => set((s) => ({ items: s.items.filter(i => i.key !== key) })),
  clear: () => set({ items: [] }),
  count: () => get().items.reduce((n, i) => n + i.qty, 0),
  subtotal: () => get().items.reduce((n, i) => n + i.qty * i.price, 0),
}), { name: "tw-cart" }));
```

- [ ] **Step 5: Run cart test → expect PASS.**

- [ ] **Step 6: Write failing wholesale test `src/test/wholesale.test.ts`**

```ts
import { describe, it, expect, beforeEach } from "vitest";
import { useWholesale, tierPrice } from "../store/wholesale";
const tiers = [{minQty:10,pricePerUnit:100},{minQty:50,pricePerUnit:90},{minQty:100,pricePerUnit:80}];
describe("wholesale", () => {
  beforeEach(() => useWholesale.setState({ items: [] }));
  it("tierPrice picks the right unit price by qty", () => {
    expect(tierPrice(tiers, 10)).toBe(100);
    expect(tierPrice(tiers, 60)).toBe(90);
    expect(tierPrice(tiers, 250)).toBe(80);
  });
  it("addOrder enforces MOQ and computes line + grand total", () => {
    useWholesale.getState().addOrder({ id:"w1", name:"Bulk Kurta", image:"/x.jpg", moq:10, tiers });
    const s = useWholesale.getState();
    expect(s.items[0].qty).toBe(10);            // defaults to MOQ
    expect(s.items[0].unitPrice).toBe(100);
    expect(s.total()).toBe(1000);
  });
  it("raising qty re-prices via tier", () => {
    useWholesale.getState().addOrder({ id:"w1", name:"K", image:"/x.jpg", moq:10, tiers });
    const key = useWholesale.getState().items[0].key;
    useWholesale.getState().setQty(key, 100);
    expect(useWholesale.getState().items[0].unitPrice).toBe(80);
    expect(useWholesale.getState().total()).toBe(8000);
  });
});
```

- [ ] **Step 7: Run → FAIL, then implement `src/store/wholesale.ts`**

```ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { WholesaleTier } from "../data/types";
export const tierPrice = (tiers: WholesaleTier[], qty: number): number => {
  let price = tiers[0].pricePerUnit;
  for (const t of tiers) if (qty >= t.minQty) price = t.pricePerUnit;
  return price;
};
export type WLine = { key: string; id: string; name: string; image: string; qty: number; unitPrice: number; moq: number; tiers: WholesaleTier[] };
type AddInput = { id: string; name: string; image: string; moq: number; tiers: WholesaleTier[] };
type WState = {
  items: WLine[];
  addOrder: (p: AddInput) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  total: () => number;
  count: () => number;
};
export const useWholesale = create<WState>()(persist((set, get) => ({
  items: [],
  addOrder: (p) => set((s) => {
    if (s.items.find(i => i.id === p.id)) return s;
    const qty = p.moq;
    return { items: [...s.items, { key: p.id, ...p, qty, unitPrice: tierPrice(p.tiers, qty) }] };
  }),
  setQty: (key, qty) => set((s) => ({
    items: s.items.map(i => i.key === key
      ? { ...i, qty: Math.max(i.moq, qty), unitPrice: tierPrice(i.tiers, Math.max(i.moq, qty)) }
      : i),
  })),
  remove: (key) => set((s) => ({ items: s.items.filter(i => i.key !== key) })),
  clear: () => set({ items: [] }),
  total: () => get().items.reduce((n, i) => n + i.qty * i.unitPrice, 0),
  count: () => get().items.length,
}), { name: "tw-wholesale" }));
```

- [ ] **Step 8: Run → PASS. Implement `src/store/auth.ts`** (mock session)

```ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
type User = { name: string; email?: string; phone?: string } | null;
type AuthState = { user: User; signIn: (u: NonNullable<User>) => void; signOut: () => void };
export const useAuth = create<AuthState>()(persist((set) => ({
  user: null,
  signIn: (u) => set({ user: u }),
  signOut: () => set({ user: null }),
}), { name: "tw-auth" }));
```

- [ ] **Step 9: Run all tests + commit**

Run: `npm run test` → PASS.
```bash
git add -A && git commit -m "feat: cart, wholesale, auth stores with tests (TDD)"
```

---

## Milestone 3: Shared components

**Files:** `src/lib/motion.ts`, `src/components/{Logo,Navbar,Footer,Reveal,ProductCard,KpiCard}.tsx`

- [ ] **Step 1: `src/lib/motion.ts`** — shared variants: `fadeUp`, `stagger(0.08)`, `scaleIn`. Each is a plain object exported for reuse.

- [ ] **Step 2: `Logo.tsx`** — inline SVG woven monogram (two interlaced gold strokes) + "Tradeweave" wordmark (`text-display`). Accepts `size` prop.

- [ ] **Step 3: `Navbar.tsx`** — sticky translucent bar (blur). Links: Home, Retail, Wholesale, Try-On, Admin. Right side: cart icon with **live badge** from `useCart().count()` and wholesale order badge from `useWholesale().count()`, plus auth state (Sign in / user name). Mobile: animated drawer.

- [ ] **Step 4: `Footer.tsx`** — gold-accented footer with brand, roadmap blurb, social icons (lucide).

- [ ] **Step 5: `Reveal.tsx`** — wraps children in `motion.div` with `whileInView` fadeUp + `viewport={{ once: true }}`.

- [ ] **Step 6: `ProductCard.tsx` — the 3D flip card**

Structure: outer `div` with `[perspective:1200px]`. Inner `motion.div` with `transform-style: preserve-3d`, animates `rotateY` 0→180 on hover (`whileHover` / state). **Front face** (`backface-hidden`): square image, name, type, retail price, a subtle "hover for sizes" hint. **Back face** (`rotateY-180 backface-hidden`): size chips (`S M L XL` from product.sizes) — clicking a chip calls `useCart().add(...)` for that size and fires a quick toast/"Added" micro-animation; plus a "View details" button → `/product/:id`. Clicking the front image (not a chip) also navigates to detail. Props: `product: Product`. Verify the flip is smooth and quick-add updates the navbar badge.

- [ ] **Step 7: `KpiCard.tsx`** — count-up number (animate from 0 to value with `motion` + `useEffect`), label, icon, gold accent.

- [ ] **Step 8: Build check + commit**

Run: `npm run build` → success.
```bash
git add -A && git commit -m "feat: shared components incl. 3D flip ProductCard + navbar cart badges"
```

---

## Milestone 4: Home page (cinematic)

**Files:** `src/pages/Home.tsx`

- [ ] **Step 1:** Hero with parallax (`useScroll` + `useTransform` on background), display headline with `.shimmer-gold` accent, sub-tagline, two big CTAs: **Shop Retail** → `/retail`, **Buy Wholesale** → `/wholesale`.
- [ ] **Step 2:** "Retail vs Wholesale" split section — two large panels describing each path (retail = AI try-on, fast checkout; wholesale = MOQ, tier pricing, direct B2B no middlemen), each linking through.
- [ ] **Step 3:** Featured collections strip using `ProductCard` (first ~6 products), wrapped in `Reveal`.
- [ ] **Step 4:** "Why Tradeweave" value props (no middlemen, real-time tracking *(coming soon)*, warranty support *(coming soon)*) as animated cards — clearly tagged "coming soon" for roadmap items.
- [ ] **Step 5:** Build check + commit `feat: cinematic Home page`.

---

## Milestone 5: Auth (rebranded Aurora) — Google + Mobile

**Files:** `src/pages/Signup.tsx`, `src/pages/Login.tsx`

- [ ] **Step 1: `Signup.tsx`** — two-column layout per the Aurora spec, rebranded:
  - Left (`lg:w-[52%]`, `lg:flex`, hidden on mobile): absolutely-positioned background **video** (fashion/textile). Use a fashion-runway/textile mp4 URL; **if unavailable, fall back to an animated gold-gradient canvas** so the panel is never blank. **No dark overlay** per spec. Over it: `Logo`, "Join Tradeweave" (`text-display`), description "Follow these 3 quick phases to start trading.", and three `StepItem`s: "Create your account" (active), "Tell us your style", "Start trading". Staggered reveal (`staggerChildren:0.15, delayChildren:0.2`; children `y:10→0`).
  - Right: "Create New Profile" header; **two social buttons in a 2-col grid: "Continue with Google" (`Chrome` icon) and "Continue with Mobile" (`Phone` icon)** — NO GitHub. "Or" divider. Form: First/Last name grid, Email, Password (with `Eye` toggle + "Requires at least 8 symbols"), "Create Account" CTA (gold). Footer: "Member of the team? Log in" → `/login`.
  - **"Continue with Mobile"** toggles the form into a phone + OTP mini-flow (enter phone → "Send OTP" → enter 6-digit code → on submit, `useAuth().signIn({ name:"Guest", phone })` and navigate Home). It must visibly change the form (no dead button).
  - "Create Account" / "Continue with Google" also call `useAuth().signIn(...)` (mock) and navigate to `/`.
  - Components `StepItem`, `SocialButton`, `InputGroup` defined at bottom, styled gold/black.
- [ ] **Step 2: `Login.tsx`** — same shell, single "Welcome back" form (email + password OR mobile OTP), Google + Mobile buttons, link to Signup. Mock `signIn` → navigate Home.
- [ ] **Step 3:** Build check + commit `feat: rebranded animated auth with Google + Mobile (no GitHub)`.

---

## Milestone 6: Retail storefront

**Files:** `src/pages/Retail.tsx`

- [ ] **Step 1:** Header band + intro + link to `/try-on`.
- [ ] **Step 2:** Filter bar: by **type** (chips from `productTypes`), by size, and a search box; plus sort (price asc/desc). State in component; filtered list animates with `AnimatePresence` (layout) on change.
- [ ] **Step 3:** Responsive grid of `ProductCard` for `retailProducts` (category retail/both). Confirm hover-flip → size → add updates cart badge; clicking card → detail.
- [ ] **Step 4:** Build check + commit `feat: retail storefront with filters + flip-card quick add`.

---

## Milestone 7: Product detail (the "go inside" path)

**Files:** `src/pages/ProductDetail.tsx`

- [ ] **Step 1:** Read `:id` via `useParams`, `getProduct(id)`; 404-style fallback if missing.
- [ ] **Step 2:** Two-column: large image (with subtle zoom-on-hover) + info (name, type, price, description, color swatches, **size selector**, qty stepper). "Add to Cart" uses selected size+qty → `useCart().add`. Disabled until size chosen. Shows confirmation.
- [ ] **Step 3:** "You may also like" row (same-type products) using `ProductCard`.
- [ ] **Step 4:** Build check + commit `feat: product detail page with size/qty add-to-cart`.

---

## Milestone 8: Cart page (must show items)

**Files:** `src/pages/Cart.tsx`

- [ ] **Step 1:** Read `useCart().items`. Empty state with CTA to `/retail`.
- [ ] **Step 2:** Line items: image, name, size, **qty steppers** (calls `updateQty`), line total (`inr`), remove (X). Animated add/remove via `AnimatePresence`.
- [ ] **Step 3:** Order summary: subtotal, mock shipping, **total** (`subtotal()` + shipping), "Proceed to Checkout" (mock → success toast/confirmation screen, then `clear()`).
- [ ] **Step 4:** Verify against acceptance: add items from flip-card AND detail page → all appear here with correct math; reload page → cart persists (localStorage).
- [ ] **Step 5:** Build check + commit `feat: working cart page with persistence`.

---

## Milestone 9: Wholesale storefront (working actions)

**Files:** `src/pages/Wholesale.tsx`, `src/components/QuoteModal.tsx`

- [ ] **Step 1:** B2B header: "Direct B2B. No middlemen." Intro on MOQ + tier pricing.
- [ ] **Step 2:** Grid of `wholesaleProducts`. Each card shows MOQ + the **tier price table** (qty breaks). Two **working** actions per card:
  - **"Add to Order"** → `useWholesale().addOrder(...)` (defaults qty to MOQ, prices via tier). Visible confirmation + wholesale badge increments.
  - **"Catalog Enquiry"** → opens `QuoteModal` prefilled with that product.
- [ ] **Step 3: `QuoteModal.tsx`** — a real form (business name, GST no., contact email/phone, product, qty, message). **Validates** required fields (and qty ≥ MOQ). On submit: generate ref `TW-Q-` + 6 random alphanumerics, show a success panel with the ref, then close. No dead button — submit always either shows validation errors or success.
- [ ] **Step 4:** **Wholesale order view** — a section/drawer (or `/wholesale` summary panel) listing `useWholesale().items` with editable qty (`setQty`, re-prices via tier), line totals, grand `total()`, remove, and a "Request Quote for Order" → `QuoteModal` prefilled with the whole order. This satisfies "Order" actually working.
- [ ] **Step 5:** Verify acceptance: both wholesale actions produce visible results; added items appear in the order view; modal validates + returns a ref number.
- [ ] **Step 6:** Build check + commit `feat: working wholesale storefront (Add to Order + Catalog Enquiry + order view)`.

---

## Milestone 10: AI Try-On (real file picker + deterministic result, TDD)

**Files:** `src/lib/hash.ts`, `src/data/tryon.ts`, `src/pages/TryOn.tsx`, `src/test/tryon.test.ts`

- [ ] **Step 1: `src/lib/hash.ts`** — stable string hash

```ts
export function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return (h >>> 0);
}
```

- [ ] **Step 2: Write failing test `src/test/tryon.test.ts`**

```ts
import { describe, it, expect } from "vitest";
import { predictFit } from "../data/tryon";
const input = { fileName: "me.jpg", fileSize: 12345, heightCm: 170, weightKg: 65, bodyType: "regular" as const, garmentSizes: ["S","M","L","XL"] as const };
describe("predictFit (deterministic)", () => {
  it("returns identical result for identical input", () => {
    const a = predictFit(input); const b = predictFit({ ...input });
    expect(a).toEqual(b);
  });
  it("recommends a size from the garment's available sizes", () => {
    expect(input.garmentSizes).toContain(predictFit(input).recommendedSize);
  });
  it("suitability score is stable and within 0-100", () => {
    const r = predictFit(input);
    expect(r.suitability).toBeGreaterThanOrEqual(0);
    expect(r.suitability).toBeLessThanOrEqual(100);
    expect(predictFit(input).suitability).toBe(r.suitability);
  });
  it("taller/heavier shifts recommended size up sensibly", () => {
    const small = predictFit({ ...input, heightCm: 155, weightKg: 48 });
    const large = predictFit({ ...input, heightCm: 190, weightKg: 95 });
    const order = ["S","M","L","XL","XXL"];
    expect(order.indexOf(large.recommendedSize)).toBeGreaterThanOrEqual(order.indexOf(small.recommendedSize));
  });
});
```

- [ ] **Step 3: Run → FAIL. Implement `src/data/tryon.ts`**

Deterministic logic: compute a base size index from BMI-ish + height bands (NOT random), clamp to the garment's available sizes; derive `suitability` (0-100) and `colorMatch` from `hashString(fileName + fileSize + measurements)` so the *same input is always the same* but feels data-driven. Provide `bodyType` nudge (slim → -1 index, plus → +1). Return `{ recommendedSize, suitability, colorMatch, fitNote }`.

```ts
import { hashString } from "../lib/hash";
const ORDER = ["S","M","L","XL","XXL"] as const;
export type BodyType = "slim" | "regular" | "plus";
export type FitInput = { fileName: string; fileSize: number; heightCm: number; weightKg: number; bodyType: BodyType; garmentSizes: readonly string[]; };
export type FitResult = { recommendedSize: string; suitability: number; colorMatch: number; fitNote: string; };
export function predictFit(i: FitInput): FitResult {
  const bmi = i.weightKg / Math.pow(i.heightCm / 100, 2);
  let idx = bmi < 18.5 ? 0 : bmi < 23 ? 1 : bmi < 27 ? 2 : bmi < 31 ? 3 : 4;
  if (i.heightCm >= 185) idx += 1;
  if (i.heightCm < 155) idx -= 1;
  idx += i.bodyType === "slim" ? -1 : i.bodyType === "plus" ? 1 : 0;
  idx = Math.max(0, Math.min(ORDER.length - 1, idx));
  // map to a size the garment actually offers (nearest available)
  const available = ORDER.filter(s => i.garmentSizes.includes(s));
  const target = ORDER[idx];
  const recommendedSize = available.reduce((best, s) =>
    Math.abs(ORDER.indexOf(s) - idx) < Math.abs(ORDER.indexOf(best) - idx) ? s : best,
    available[0] ?? target);
  const seed = hashString(`${i.fileName}|${i.fileSize}|${i.heightCm}|${i.weightKg}|${i.bodyType}`);
  const suitability = 72 + (seed % 28);             // 72-99, stable
  const colorMatch = 60 + ((seed >> 8) % 40);       // 60-99, stable
  const fitNote = `Best in ${recommendedSize}. Based on ${i.heightCm}cm / ${i.weightKg}kg (${i.bodyType}).`;
  return { recommendedSize, suitability, colorMatch, fitNote };
}
```

- [ ] **Step 4: Run → PASS.**

- [ ] **Step 5: `TryOn.tsx` — real file picker UI**

- A **hidden** `<input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={...}>`. A styled dropzone/button calls `fileRef.current?.click()` → **opens the OS file manager**. Support drag-and-drop (`onDrop`/`onDragOver`).
- On file selected: `setPreview(URL.createObjectURL(file))`, store `file.name`/`file.size`. Show the image preview with the chosen garment overlaid on a silhouette card.
- Inputs: garment picker (from retail products), height, weight, body-type select.
- "Analyze Fit" calls `predictFit({fileName,fileSize,heightCm,weightKg,bodyType,garmentSizes})` and renders: **recommended size** badge, animated **suitability** gauge, **color-match** meter, `fitNote`. Re-running with same inputs shows same numbers.
- "Add recommended size to cart" → `useCart().add`. Clear "Simulated preview — real AI coming soon" label.

- [ ] **Step 6:** Verify acceptance manually: clicking upload opens file dialog; image renders; same input → identical result; changing height/weight changes size sensibly.
- [ ] **Step 7:** Run tests + commit `feat: AI Try-On with real file picker + deterministic fit (TDD)`.

---

## Milestone 11: Admin analytics dashboard

**Files:** `src/pages/Admin.tsx`

- [ ] **Step 1:** Channel toggle (All / Retail / Wholesale) in component state.
- [ ] **Step 2:** KPI row using `KpiCard` from `kpis(channel)`: Units Sold, Revenue (`inr`), Orders, AOV — count-up animated.
- [ ] **Step 3:** Recharts: **BarChart** = items sold by dress type (`salesByType`), **LineChart/AreaChart** = sales over time (`salesOverTime`), **PieChart/Donut** = category split (`categorySplit`). All recolored to gold/cream on dark, responsive (`ResponsiveContainer`). Charts update when channel toggles.
- [ ] **Step 4:** A "Top sellers" table (type, units, revenue) under the charts.
- [ ] **Step 5:** Verify: charts render, no console errors, toggle changes data. Build check + commit `feat: admin analytics dashboard with Recharts`.

---

## Milestone 12: Polish + final verification

- [ ] **Step 1:** Global pass: consistent spacing, hover states, focus rings, mobile responsiveness of every page; ensure no dead buttons anywhere (especially wholesale).
- [ ] **Step 2:** Add a tiny toast system (or reuse a simple animated toast) for "Added to cart", "Quote submitted", etc., if not already present.
- [ ] **Step 3:** Run full verification:
  - `npm run test` → all PASS.
  - `npm run build` → success, zero errors.
  - `npm run dev` → manually walk all acceptance criteria in §8/§9 of the spec.
- [ ] **Step 4:** Update `README.md` with run instructions + feature list + roadmap.
- [ ] **Step 5:** Final commit `chore: polish pass + README + final verification`.

---

## Self-Review Notes (coverage map)

- Spec §2 theme → M0 (tokens/fonts) + components.
- Spec §3 sitemap → M4–M11 (all 9 routes).
- Spec §4.1 flip cards → M3 ProductCard; §4.2 cinematic → M0/M3/M4; §4.3 try-on → M10; §4.4 admin → M11.
- Spec §5 auth (Google + Mobile, no GitHub) → M5.
- Spec §6 architecture/stack → M0–M2.
- Spec §7 data model → M1.
- Spec §8 success criteria → verified across milestones, final in M12.
- Spec §9.1 wholesale actions → M9 (Add to Order, Catalog Enquiry modal, order view). §9.2 cart → M2 + M8 (persistence + badge + list). §9.3 try-on file picker + deterministic → M10 (hidden input + ref click + `predictFit` tests).
- Type consistency: `useCart` (`add/updateQty/remove/count/subtotal`), `useWholesale` (`addOrder/setQty/remove/total/count`, `tierPrice`), `predictFit` signature used identically in test + page. ✓
