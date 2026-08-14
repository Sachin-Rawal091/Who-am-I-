# 3D Portfolio Website — Complete Optimization Audit Prompt
You are a senior 3D web performance engineer and UX specialist with deep expertise in Three.js/React Three Fiber/WebGL, browser rendering pipelines, and interaction design. Audit my 3D portfolio website end-to-end and give me a prioritized, actionable optimization plan.

Run a complete audit across the following areas. For each finding, tell me: (1) the specific issue, (2) why it hurts performance or UX, (3) the exact fix (code-level if possible), and (4) priority (Critical / High / Medium / Low).

### 1. Load Performance
- Initial bundle size (JS/WASM), code-splitting opportunities, lazy-loading of 3D assets
- Time to First Meaningful Render vs Time to Interactive
- Texture, model (GLTF/GLB), and HDRI file sizes — compression (Draco, Meshopt, KTX2/Basis) opportunities
- Preloading strategy, loading screen/progress indicator quality, and perceived-performance tricks
- CDN usage and caching headers for static 3D assets

### 2. Runtime Rendering Performance
- FPS stability across scenes (target 60fps desktop, 30fps+ mobile) — identify frame drops and their causes
- Draw call count and geometry/material batching or instancing opportunities
- Polygon count vs LOD (level of detail) usage
- Shadow map resolution/count, post-processing stack cost (bloom, SSAO, DOF, etc.)
- Texture resolution vs mipmap/anisotropic filtering settings
- Memory leaks — check dispose() calls on geometries, materials, textures, and render targets on unmount/route change
- Renderer settings: pixel ratio capping, antialiasing method, tone mapping cost

### 3. Responsiveness & Device Adaptation
- Behavior on low-end/mid-tier mobile GPUs — is there a quality tier/fallback system?
- Adaptive resolution/DPR scaling based on device performance
- Touch vs mouse vs keyboard interaction parity
- Battery/thermal impact on mobile (frame capping when idle)
- Fallback experience for devices without WebGL/WebGPU support

### 4. UX & Interaction Design
- Camera controls: are they intuitive, bounded, and free of jarring snaps or clipping?
- Navigation clarity — can users tell what's interactive vs decorative?
- Scroll-jacking or custom scroll behavior — does it feel natural or fight the user?
- Transition smoothness between sections/scenes (easing curves, duration)
- Loading state UX — is the wait justified and communicated well?
- Motion sickness / vestibular considerations (excessive camera shake, FOV changes, auto-rotation)
- Reduced-motion support (`prefers-reduced-motion`) with a genuinely lighter alternative

### 5. Accessibility
- Keyboard navigability of all interactive 3D elements
- Screen reader fallback content (accessible DOM alternative describing the 3D content)
- Color contrast for any overlaid UI/text
- Focus indicators and skip-to-content options for non-3D navigation

### 6. Code & Architecture Quality
- Unnecessary re-renders (React Three Fiber: useFrame overuse, state causing full scene re-renders)
- Asset loading architecture (suspense boundaries, loader caching, singleton loaders)
- Event listener cleanup and memory management
- Bundle analysis: unused Three.js modules being imported

### 7. SEO & Core Web Vitals
- LCP, CLS, INP scores specifically as affected by 3D canvas loading
- Meta tags, Open Graph previews (since 3D canvases render nothing to crawlers)
- Server-side/static fallback content for indexing

### 8. Cross-Browser & Stability
- WebGL context loss handling (and recovery)
- Safari/iOS-specific WebGL quirks
- Console errors/warnings related to shaders, textures, or deprecated APIs

---

## Deliverable format I want:
1. **Executive summary** — overall health score and top 5 issues
2. **Prioritized fix list** — Critical → Low, with effort estimate (S/M/L) for each
3. **Code snippets** for the top 3 highest-impact fixes
4. **Quick wins** I can ship today vs **structural changes** needing more time

Be specific and technical — cite exact file/line references if you have access to the code, exact settings to change, and realistic performance targets.
