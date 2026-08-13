# Sachin Rawal — portfolio

Dark, cinematic developer portfolio. React (Vite) + React Three Fiber +
GSAP/ScrollTrigger + Lenis + Tailwind CSS v4. See `DESIGN_PLAN.md` for the
full design rationale — read that before changing colors, type, or the
3D scene.

## Status: RAWAL.AI Interactive 3D Pipeline & Un-blocked Canvas Complete

- [x] Phase 1 — Foundation & design system tokens, `d3` setup, data layer (`identity`, `skills`, `projects`, `trainingRun`)
- [x] Phase 2 — Persistent 3D neural network (`AIWorld`, `NeuralNodes`, `NeuralConnections`, `DataParticles`, full-page `ScrollCamera`)
- [x] Phase 3 — System boot terminal sequence (`TerminalBoot`) & surface reveal (`SystemIntro`)
- [x] Phase 4 — Stage 1 Data Ingestion (`About`), Stage 2 Feature Extraction (`Skills`), Stage 3 Training (**Showstopper Loss Curve** via D3)
- [x] Phase 5 — Stage 4 Inference (`Projects` with pipeline flow), Stage 5 Model Card (`ModelCard`), Stage 6 Deployment (`Contact` with CTA pulse)
- [x] Phase 6 — Transparent glass panel un-blocking (`glass-hero`, `glass-body`, `glass-telemetry`) & pointer-events layering
- [x] Phase 7 — Group drag rotation & damping (left click hold & drag 360° inspection + section-aware base rotation) + `DragIndicator` prompt
- [x] Phase 8 — Performance & accessibility pass (`npx oxlint` 0 errors/0 warnings, Vite production build clean)

## Verified so far

- `npx oxlint` — 0 warnings, 0 errors
- `npm run build` — clean production build
- Full keyboard tab order checked programmatically end-to-end (skip link →
  nav → all 4 project links → email → socials → résumé download), every
  stop has a visible signal-colored focus ring
- Contrast ratios computed directly (not eyeballed): body text ≥ 6.2:1,
  primary text ~16.9:1, accent text ~8.3:1 — all clear of WCAG AA's 4.5:1
- Reduced-motion verified with two screenshots 2s apart — pixel-identical
- Zero console errors across every screenshot run

## Run it

```bash
npm install
npm run dev       # http://localhost:5173
```

## Build

```bash
npm run build      # outputs to dist/
npm run preview    # serve the production build locally
```

Static output in `dist/` deploys as-is to Vercel, Netlify, or any static
host — no server-side code, no environment variables required.

## Project structure

```
src/
  components/
    hero/            Hero section: layout + text + canvas mount
    layout/           SmoothScroll (Lenis, owns all smooth-scroll wiring)
    sections/          About / Work / Skills / Contact / Footer + project data
  three/
    machineData.js     Node/edge data for the signature 3D scene
    ComputationalMachine.jsx   The 3D scene itself
    ScrollCamera.jsx    Scroll-driven camera dolly (GSAP ScrollTrigger)
    HeroCanvas.jsx      Canvas wrapper: DPR cap, Suspense, WebGL check, mobile/reduced-motion routing
    CanvasErrorBoundary.jsx
  lib/
    motion.js           Shared easing constants + reduced-motion / low-power hooks
  styles/
    index.css           Tailwind v4 theme + design tokens (colors, fonts, motion)
public/
  favicon.svg
  og-image.png          Open Graph card (regenerate via /home/claude/og/generate_og.py if copy changes)
```

## Animation ownership (don't break this)

- **GSAP + ScrollTrigger** owns all scroll-driven choreography and the
  camera dolly through the 3D scene.
- **Lenis** owns smooth-scroll only (`SmoothScroll.jsx`) — never
  instantiate a second Lenis instance or a competing scroll listener.
- **Framer Motion** isn't wired in yet; reserve it for small UI
  micro-interactions only (e.g. a project-card hover), never for anything
  ScrollTrigger already owns.

A transition should be driven by exactly one of these systems, never
split across two.

## Swapping in real content (Phase 3 — currently blocked)

## Content status

Built from `Sachin_Rawal_latest_new.pdf` — nothing here is fabricated.

- [x] Bio — **drafted** from your résumé's Objective + project bullets;
      flagged `[DRAFT — please review]` in the UI, edit `About.jsx` directly
- [x] 4 real projects (title, description, stack, link) → `projectsData.js`
      — project visuals are deliberately abstract SVG motifs, not fake
      screenshots, since no project images were supplied. Swap in real
      screenshots/video loops in `ProjectVisual.jsx` if you have them.
- [x] Real stack list, grouped Ships With / Under the Hood / Tools → `Skills.jsx`
- [x] Contact email, socials, résumé download (`public/resume.pdf`) → `Contact.jsx`
- [ ] Phone number — intentionally **left off** the public page (it's in
      the downloadable résumé); add to `Contact.jsx` if you'd rather it be visible
- [ ] Profile photo — none supplied, none used

## Accessibility notes

- The 3D canvas is `aria-hidden`; a visually-hidden paragraph right below
  it (`.sr-only` in `Hero.jsx`) is the text equivalent screen readers get.
- `prefers-reduced-motion` disables the camera dolly and idle rotation
  (scene renders once, static) and is also respected globally via CSS in
  `styles/index.css`.
- Focus rings are visible everywhere (`:focus-visible` in
  `styles/index.css`) — don't add `outline: none` anywhere without
  replacing it with an equally visible alternative.
- A skip-to-content link is the first focusable element on the page.

## Known gaps before Phase 4 sign-off

- No Lighthouse run yet (needs a deployed or locally-served build, not
  just `npm run dev`).
- No cross-browser/device pass yet.
- `og-image.png` was generated from the same design tokens as the site
  but should be regenerated if the name, role, or positioning statement
  ever changes.
