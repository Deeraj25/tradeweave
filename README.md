# Tradeweave

> *Where trade weaves together.* — a direct **B2B + retail** clothing marketplace (no middlemen).

A cinematic, investor-ready **Phase 1 prototype**: a polished front-end backed by realistic
mock data. Everything you can click works; nothing needs a server.

![theme](https://img.shields.io/badge/theme-luxe%20black%20%2B%20gold-D4A537) ![stack](https://img.shields.io/badge/Vite%20%2B%20React%20%2B%20TS-informational) ![tests](https://img.shields.io/badge/tests-19%20passing-success)

---

## Run it

```bash
npm install
npm run images   # (optional) re-download catalog images into public/catalog
npm run dev      # http://localhost:5173
```

Other scripts:

```bash
npm run build    # type-check + production build
npm run test     # vitest (cart, wholesale, try-on, catalog/sales)
```

---

## Features

### Customer
- **Cinematic Home** — parallax hero, scroll reveals, featured 3D flip-cards, value props.
- **Retail storefront** — search, type/origin filters, sort, animated grid.
- **3D flip product cards** — hover (or tap) to rotate the card and **quick-add by size**;
  click to open the full product page.
- **Product detail** — colour/size/quantity selectors and add-to-cart (the "go inside" path).
- **Working cart** — persistent (localStorage), live navbar badge, quantity steppers, totals,
  mock checkout.
- **Wholesale (B2B)** — tiered bulk pricing + MOQ per product, **Add to Order** with a live,
  editable bulk-order panel (auto re-prices by quantity tier), and a **Catalog Enquiry / Quote**
  modal that validates inputs and returns a `TW-Q-XXXXXX` reference.
- **AI Try-On Me** *(simulated)* — opens your **real file picker** (or drag & drop), previews your
  photo, and gives a **deterministic** recommended size + fit-suitability + colour-match from your
  measurements (same input → same result; no randomness).
- **Rebranded animated auth** — two-column sign-up/login with a fashion slideshow hero and
  **Google + Mobile (OTP)** sign-in (no GitHub).

### Seller / developer
- **Admin analytics** (`/admin`) — KPI cards with count-up, a **units-sold-by-dress-type** bar
  chart, traditional-vs-western donut, sales-over-time area chart, and a top-sellers table, with a
  **Retail / Wholesale / All** toggle. (Recharts, code-split.)

---

## Tech

Vite · React 19 · TypeScript · Tailwind CSS v4 · motion/react · lucide-react · react-router-dom ·
recharts · zustand (persisted) · vitest.

Catalog images are real CC-licensed photos (LoremFlickr / Wikimedia Commons) downloaded into
`public/catalog/` so the demo is self-contained.

---

## What's mocked vs real

| Real & working | Mocked (looks real) |
| --- | --- |
| All UI, routing, animations | Accounts / login / OTP |
| Cart + wholesale order math & persistence | Payments / checkout |
| Filters, flip-card add, quote validation | The AI try-on ML (it's deterministic, not a model) |
| Analytics charts from the mock sales dataset | Real-time tracking, warranty, POS billing |

---

## Roadmap (future phases)

In-built **POS billing for offline stores** → real backend + auth → real payments →
**real-time tracking** (packing → shipping → delivery) + **warranty support** →
data / AI-training pipeline → **delivery-partner** network & investor operations.

---

*Phase 1 prototype. Design spec: `docs/superpowers/specs/` · plan: `docs/superpowers/plans/`.*
