# Aura — outfits in your colour

> An **AI-powered personalised outfit recommendation** feed. A dark editorial
> wall of looks, each scored and explained against *your* colouring — skin
> undertone, contrast, face shape and hair.

![theme](https://img.shields.io/badge/theme-near--black%20%2B%20warm%20gold-D4A537)
![stack](https://img.shields.io/badge/Vite%20%2B%20React%20%2B%20TS-informational)
![engine](https://img.shields.io/badge/colour--theory-deterministic-success)

This repository contains **Phase 1 — the Main Feed (Page 1)**, built to maximum
polish. The recommendation engine is a deterministic, pure-function stand-in for
a multimodal vision model, so the whole thing runs with **no server and no API
key** — and is structured so real AI can be dropped in later without touching the UI.

---

## ⚡ Quickest look — one file, zero setup

Open **[`aura.html`](aura.html)** directly in any modern browser
(double-click it). It is a fully self-contained build: the entire app, all 16
look photos (base64-inlined) and the colour-theory engine in a single file.

> Needs an internet connection on first load (React + Tailwind are pulled from a
> CDN). Everything else — images, logic, styling — is embedded.

---

## 🛠 Run the full project (dev)

```bash
npm install
npm run dev        # http://localhost:5173
```

Other scripts:

```bash
npm run build       # type-check (tsc) + production build → dist/
npm run preview     # serve the production build
npm run test        # vitest — includes the colour-theory engine tests
npm run standalone  # regenerate the self-contained aura.html
```

---

## ✨ What's built (Page 1 — Main Feed)

- **Dark editorial layout** — near-black canvas, warm-gold accents, Playfair
  display headings.
- **Top navigation** — category tabs (All / Casual / Formal / Street / Evening)
  with an animated active pill, a prominent **Upload Garments** CTA, and the
  user avatar.
- **Hero** — personalised headline (*"Outfits curated for your colour &
  structure"*), a subline naming the user's season / face shape / hair, and
  toggleable **source filter chips** (Vogue, Pinterest, Instagram, Runway,
  Lookbook).
- **Grid header** — live matched **count**, **saved** count, and a sort control
  (best match / highest contrast / warmest palette / newest).
- **Outfit cards** (responsive 4 → 2 → 1 columns) — each shows:
  - the look photo (3:4),
  - a **match-% badge**,
  - **colour-palette swatches**,
  - a **save / heart** action (persisted to `localStorage`),
  - and on **hover**, an overlay with the user's avatar and a short, specific
    note on **why the outfit suits their features**, plus undertone / contrast /
    season verdict chips.
- **Detail drawer** (click any card) — a Page-2 preview: the full rationale, the
  individual pieces, the named palette, and step-by-step *how to wear it*.
- **Upload modal** — a real OS file picker + drag-and-drop that previews chosen
  photos and shows **simulated auto-tagging** (type · colour · fit). No dead
  buttons anywhere.

---

## 🧠 The colour-theory engine

[`src/lib/colorTheory.ts`](src/lib/colorTheory.ts) (with the colour maths in
[`src/lib/color.ts`](src/lib/color.ts)) is the heart of the product. Given a
user's [`StyleProfile`](src/data/profile.ts) and an outfit's palette it returns:

- a **match score** (0–100),
- **undertone / contrast / season** verdicts,
- a human-readable **rationale** that references the user's own skin, hair and
  face shape,
- and deterministic **how-to-wear** styling tips.

It works by converting each swatch to a **warmth** (hue/chroma) and **lightness**
value, comparing the palette's average warmth, depth and internal contrast to
targets derived from the user's seasonal type (here, *Warm Autumn*), and nudging
for loved / avoided colours.

It is **pure and deterministic** — the same outfit + profile always yields the
same result (no `Math.random`). That's the seam for production: swap the body of
`analyseOutfit` for a call to a multimodal model (Claude / GPT-4o) plus a
colour-theory system prompt, and the entire UI keeps working unchanged.

Covered by tests in [`src/test/engine.test.ts`](src/test/engine.test.ts)
(determinism, score range, warm-palette > cool-palette, rationale content).

---

## 🗺 Scope & roadmap

**In this build (Phase 1):** the Main Feed and the colour-theory engine, driven
by a fixed mock profile and 16 mock looks.

**Designed but stubbed for later phases** (the detail drawer and upload modal
hint at these):

1. **Individual Outfit page** — components with wardrobe swaps, styling
   variations, colour-theory panel, full how-to-wear.
2. **Outfit Builder sidebar** — chat-style, natural-language → outfit cards.
3. **Onboarding** — 3-step face + wardrobe analysis that produces the profile.
4. Extras — style calendar, wardrobe gap analysis, season profile page,
   occasion planner, re-wear history.
5. **Real AI** — replace the deterministic engine with live multimodal calls.

---

## 🧱 Tech

Vite · React · TypeScript · Tailwind CSS v4 · `motion/react` (Framer Motion) ·
`lucide-react` · `zustand`-ready · vitest.

The standalone `aura.html` re-implements the same UI with CDN React + Tailwind,
CSS animations and inline SVG icons so it can run from a single file.

Look photos are the project's locally-stored CC-licensed images in
`public/catalog/` (no external hotlinks), reused as the feed imagery.

---

*Phase 1 prototype — Main Feed. Design notes live in `docs/superpowers/`.*
