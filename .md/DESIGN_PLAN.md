# Design plan — Sachin Rawal portfolio

**Identity:** Sachin Rawal — AI & Machine Learning Engineer + Vibecoder
**Positioning statement:** "I train intelligence — then vibecode it into working software."

This is the source of truth for the site's visual system. Every color, font,
and motion decision in the code should trace back to this document. If you
change one here, change it in `src/styles/index.css` (design tokens) too.

---

## 1. Color palette

| Token | Hex | Role |
|---|---|---|
| `void` | `#0A0D12` | Primary background — deep charcoal-blue-black, the base canvas |
| `graphite` | `#12161D` | Surface / card background — one step up from void, still near-black |
| `hairline` | `#232A35` | Borders, dividers, card edges — barely-there structural lines |
| `signal` (accent) | `#F2914B` | The one accent — used sparingly: CTAs, active states, key-light glow, packet trails in the 3D scene |
| `foam` | `#EDEFF2` | Primary text — high-contrast off-white for body copy |
| `mist` | `#8A93A3` | Secondary text — labels, timestamps, stack tags, muted captions |

**Why signal amber, not blue or green:** electric blue reads as generic
"AI startup" default; phosphor/terminal green is an even more common
AI-portfolio cliché. Amber reads as an indicator light on a machine — a
status LED, a warning glow — which fits a systems aesthetic without
borrowing AI-industry visual shorthand. It's also the natural complement
to a cool charcoal-blue base, which is what makes the single-key-light
logic (Section 3) read as cinematic rather than flat.

## 2. Typography

| Role | Typeface | Why | License |
|---|---|---|---|
| Display (restrained — hero name, section titles only) | Space Grotesk (variable) | Neo-grotesk with unusual proportions — wide apertures, monospace-influenced numerals | SIL OFL 1.1 — self-hostable/redistributable |
| Body | Inter (variable) | Highly readable at small sizes on dark backgrounds; neutral enough not to compete with the display face | SIL OFL 1.1 |
| Mono (code, labels, stack tags, timestamps) | JetBrains Mono (variable) | Built for code legibility; doubles as the "terminal/systems" voice for structural labels | SIL OFL 1.1 |

All three ship as self-hosted variable fonts via `@fontsource-variable/*`
(bundled by Vite — no external font CDN). See `src/styles/index.css`.

## 3. Light source logic

Single key light origin: **upper-right, slightly behind the subject**.

- 3D scene: `directionalLight` at `[4, 5, 3]`, warm-white; low ambient fill
- Hero glow: radial gradient in `signal`, low opacity, anchored upper-right
- Card edges: top-right hairline→signal highlight on hover/focus
- Every shadow/gradient in the app traces back to this one origin

## 4. Layout concepts

See ASCII wireframes in the Notion Implementation Plan / DESIGN_PLAN page.
Sections: Hero (signature 3D + identity), About (bio + data-readout panel),
Selected Work (scroll-revealed project cards), Skills/Stack (grouped:
Ships With / Under the Hood / Tools), Contact (direct, no form), Footer
(minimal, build/version tag). Experience/Timeline was **cut** — no real
chronological story to tell.

## 5. Signature element — computational architecture

A minimal 3D "machine": a layered node cluster (dense input/hidden layers
narrowing into a sparse output layer — see `src/three/machineData.js`)
connected by edges carrying animated packets. On load the camera takes in
the whole structure; on first scroll it dollies through the cluster
(`src/three/ScrollCamera.jsx`), which is the site's one major scroll-driven
3D transition.

**Why this concept:** the layered, narrowing structure is a literal
restatement of the positioning line — many trained parameters resolving
into a small number of shipped outputs — not a decorative network diagram.
Rigid module geometry (ML rigor) + a smooth camera path and flowing
packets (vibecoding speed) embodies the tension in "train intelligence,
then vibecode software" through motion itself.

- **Perf budget:** ≤40 modules (17 in use), instanced-cheap geometry, DPR
  capped at 2 (1.5 on low-power), no post-processing.
- **Mobile fallback:** simplified 9-node subset, idle rotation only, no
  camera travel (`lowPower` prop throughout `src/three/`).
- **Reduced-motion fallback:** machine renders fully assembled, static —
  no rotation, no dolly (`usePrefersReducedMotion` gates both).
- **No-WebGL / error fallback:** `HeroFallback.jsx`, a static SVG with the
  same layered structure.
- **Text equivalent:** visually-hidden paragraph next to the canvas
  describing the visualization's meaning for assistive tech.

## 6. Self-critique vs. generic AI-portfolio defaults

| Generic default | What we did instead |
|---|---|
| Cream + serif + terracotta | Not remotely close — dark charcoal-blue, grotesk/sans/mono trio, amber accent |
| Near-black + neon accent + stock particle hero | Near-black *with depth*; amber accent, not neon; hero is a justified computational-architecture scene |
| Numbered "01/02/03" eyebrows | None anywhere — no real sequence exists; structural labels use real content (build/version tags, status labels, stack tags) |
| "Particles reform into a name" on load | Avoided — the machine is present and legible from frame one |
| Icon-soup skills grid | Grouped by actual usage: Ships With / Under the Hood / Tools |
| Big stat + gradient hero | No fabricated stats — hero leads with the positioning statement and the 3D thesis |
| Decorative gradients from arbitrary directions | Every gradient/shadow traces to the single upper-right key light |

---

*Approved by Sachin Rawal — Phase 1 sign-off. Do not deviate from this
plan without updating this file first.*
