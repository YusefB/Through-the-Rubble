# Scene Engine — Design Spec

**Date:** 2026-04-30
**Status:** Draft (post-brainstorm, awaiting user review)
**Project:** Through the Rubble
**Sub-project:** Scene Engine (1 of 6)

---

## Context

Through the Rubble is a mobile-first interactive documentary website. The user scrolls through a stitched scene of a destroyed location, taps hotspots that open story content, and toggles between historical ("before") and current ("after") views. The site's emotional weight comes from the contrast — same place, different reality — and from the verified content surfaced through hotspots.

The full project decomposes into six sub-projects: scene engine, content schema + Supabase, source pipeline (`official-sources` MCP), Story Mode player, admin PWA + deploy control, and sourcing governance. Each is its own design spec → implementation plan cycle.

**This spec covers the scene engine only.** It defines the rendering layer that every other piece composes against. It is the load-bearing visible MVP.

## Scope

**In scope:**

- Rendering one stitched scene as a tall scrollable region
- Stacked layers: before-master, after-master, 5–7 parallax layers, hotspot overlay, sticky UI affordances
- Crossfading the master images on global before/after toggle
- Detecting and reporting the active chapter from scroll position
- Showing reconstruction labels when the visible master is AI-generated
- Forking to a reduced-motion variant when `prefers-reduced-motion: reduce` is set
- Emitting host-wired events: `onHotspotOpen`, `onChapterChange`, `onToggleBeforeAfter`
- Deep-link contract: `?chapter=`, `?state=`, `?hotspot=` URL params
- Automatic frame-rate degradation on low-end hardware

**Not in scope (deferred to other specs):**

- The drawer/bottom-sheet that renders hotspot story content when a hotspot opens
- The desktop sidebar content rendering (subscribes to engine events; rendered separately)
- Story Mode player (separate spec; will drive scroll programmatically and consume chapter events)
- Source registry, content fetching, admin UI, live updates, action layer
- Bilingual translations (engine sets `dir="rtl"` when locale is `ar`; does not own translations)
- Asset generation pipeline (engine consumes typed image data, doesn't generate it)

## Decisions (from brainstorming)

| # | Decision | Implication |
|---|---|---|
| 1 | Continuous stitched scene (one tall image, scroll = movement) | One master image per state, hotspots scattered along scroll height |
| 2 | Desktop = mobile image + context sidebar (not custom desktop layout) | One image set; sidebar is rendered by host, subscribes to engine events |
| 3 | Global before/after crossfade (not per-hotspot, not slider) | Two complete master images per scene; toggle state preserved across scroll |
| 4 | One stitched scene for v1 | Engine designed for single-scene render; multi-scene is data-only later |
| 5 | Chapters as first-class data | `Chapter` records with `scrollAnchorY`; Story Mode iterates them |
| 6 | Cinematic by default with reduced-motion fallback | Full motion vocabulary on default path; reduced fork only on user OS preference |
| 7 | Pre-load before-master after first paint via `<link rel="preload">` | LCP is after-master alone; toggle feels instant |
| 8 | Approach 1: Layered DOM + Motion for React | Native DOM semantics, accessible by default, debuggable, Next.js Image |

## Component boundaries

```
components/scene/
  SceneViewport.tsx        Top-level: scroll container, store provider, layer mounting
  SceneLayer.tsx           One image layer with optional parallax transform
  HotspotOverlay.tsx       Container for all hotspot buttons
  Hotspot.tsx              Single focusable hotspot with visible dot + tap target
  BeforeAfterToggle.tsx    The toggle button affordance
  ReconstructionLabel.tsx  Sticky badge shown when current master is reconstruction
  ChapterAnchor.tsx        Invisible scroll-anchor element (drives chapter detection)

lib/scene/
  store.ts                 Zustand store: { activeChapterId, beforeAfter, openHotspotId, reducedMotion }
  useSceneScroll.ts        Hook wrapping Motion's useScroll for scene-relative progress
  reducedMotion.ts         OS preference detection + manual override
  framerate.ts             Frame-rate monitor that drives auto-degradation
  types.ts                 Scene, Chapter, Hotspot, SceneImage, ParallaxLayer
```

## Data shapes (TypeScript)

```ts
type Scene = {
  id: string
  slug: string                            // for URL deep links
  title: string                           // for SEO, a11y, sidebar
  defaultBeforeAfter: 'before' | 'after'  // initial toggle state
}

type SceneImage = {
  variant: 'before' | 'after'
  url: string
  width: number
  height: number
  blurDataUrl?: string                    // LQIP for first paint
  isReconstruction: boolean
  reconstructionLabel?: string            // shown when isReconstruction === true
  altText: string                         // required, non-empty
  creditLine?: string
}

type ParallaxLayer = {
  id: string
  url: string
  width: number
  height: number
  parallaxFactor: number                  // 0=fixed, 1=natural, <1=slow, >1=fast
  opacity?: number                        // default 1
  blendMode?: 'normal' | 'screen' | 'multiply' | 'overlay'
}

type Chapter = {
  id: string
  sceneId: string
  order: number
  label: string
  scrollAnchorY: number                   // 0..1 normalized to scene height
  narration?: string                      // pass-through for Story Mode
  sourceAnchorId?: string                 // pass-through
}

type Hotspot = {
  id: string
  sceneId: string
  chapterId?: string
  label: string
  geometry: {
    x: number                             // 0..1 normalized to scene width
    y: number                             // 0..1 normalized to scene height
    r: number                             // 0..1 normalized to scene width
  }
  type: 'story' | 'stat' | 'timeline' | 'update' | 'action'
  priority: 'hero' | 'primary' | 'secondary' | 'optional'
  visualState: 'always' | 'after-only' | 'before-only'
}

type SceneEngineProps = {
  scene: Scene
  images: SceneImage[]                    // expect both 'before' and 'after' for v1
  parallaxLayers: ParallaxLayer[]
  chapters: Chapter[]
  hotspots: Hotspot[]
  initialBeforeAfter?: 'before' | 'after'
  onHotspotOpen?: (hotspotId: string) => void
  onChapterChange?: (chapterId: string) => void
  onToggleBeforeAfter?: (state: 'before' | 'after') => void
}
```

**Three deliberate decisions:**

1. Hotspot `r` is normalized to scene width, not height. Otherwise circles deform when the 9:24 image renders at any non-square ratio.
2. Geometry is 0..1 normalized, not pixel-based — locking to a single resolution would make responsive rendering brittle.
3. `visualState` lets a hotspot exist only in the before view or only in the after view (a school no longer standing makes sense in `after-only`; an empty plot makes sense in `before-only`).

## State management

**Store: Zustand.** Multiple consumers (sidebar, toggle, drawer host, Story Mode), and React context would cause re-render storms when fast-changing scroll values flow through. Zustand selectors keep subscriptions narrow.

**Critical separation: Motion values never go in the store.** `useScroll()` returns a `MotionValue` that bypasses React's render cycle. Parallax transforms read from it via `useTransform`. The store only holds discrete state that an event consumer cares about.

```ts
type SceneStore = {
  activeChapterId: string | null
  beforeAfter: 'before' | 'after'
  openHotspotId: string | null
  reducedMotion: boolean

  setActiveChapter: (id: string) => void
  toggleBeforeAfter: () => void
  setBeforeAfter: (state: 'before' | 'after') => void
  openHotspot: (id: string) => void
  closeHotspot: () => void
  setReducedMotion: (value: boolean) => void
}
```

**State partitioning:**

| State | Where | Why |
|---|---|---|
| `activeChapterId` | Zustand | Multiple subscribers (sidebar, URL writer, narration cards) |
| `beforeAfter` | Zustand | Multiple subscribers (toggle button, scene layers, hotspot visibility filter) |
| `openHotspotId` | Zustand | Drawer host subscribes; URL writer subscribes; Story Mode driver subscribes |
| `reducedMotion` | Zustand | Layer renderer reads it once per render |
| Scroll progress | Motion `useScroll()` MotionValue | 60×/sec; never goes through React state |
| Layer transforms | `useTransform` derived | Computed, not stored |
| Image load state | Local `useState` per layer | Doesn't need to be global |

**URL deep-link contract** (Next.js `useSearchParams`):

| Param | Effect on mount | Updated when |
|---|---|---|
| `?chapter=<slug>` | Engine scrolls to that chapter on mount | `activeChapterId` changes (debounced 500ms, `replaceState`) |
| `?state=before\|after` | `beforeAfter` initialized to this value | Toggle is clicked |
| `?hotspot=<id>` | `openHotspot(id)` called after scene is laid out | Hotspot opens or closes |

URL writes use `history.replaceState` — no new history entry per scroll, no back-button noise. Hydration only happens on initial mount; user navigation owns the URL after that.

**Reduced-motion detection:**

```ts
const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
useSceneStore.setState({ reducedMotion: mq.matches })
mq.addEventListener('change', e => useSceneStore.setState({ reducedMotion: e.matches }))
```

A future settings drawer can override via a `'system' | 'reduce' | 'no-preference'` triple, so "follow system" remains a real choice.

**Engine-emitted events:** the store updates → engine fires host callbacks via `useEffect` watching the relevant store values. Host can ignore events it doesn't care about.

## Rendering and motion

**Layer stack (z-order, bottom to top):**

```
0. Background fill (CSS color matching after-image tone — prevents flash)
1. Before-master <img>   opacity: beforeAfter === 'before' ? 1 : 0
2. After-master <img>    opacity: beforeAfter === 'after'  ? 1 : 0
3. Parallax layers (5–7) translateY driven by scroll progress; multi-axis on some
4. Hotspot layer         absolutely-positioned <button>s
5. Sticky UI             toggle button, reconstruction label, chapter indicator
```

The scene container has the full intrinsic height (CSS `aspect-ratio`). Layers 1–4 are `position: absolute; inset: 0` inside it. Layer 5 is `position: sticky` outside the transform context.

**Crossfade:**

```tsx
<motion.div
  className="absolute inset-0"
  animate={{ opacity: beforeAfter === 'before' ? 1 : 0 }}
  transition={{ duration: reducedMotion ? 0 : 0.6, ease: 'easeOut' }}
>
  <Image src={beforeImg.url} alt={beforeImg.altText} fill priority={false}
         placeholder="blur" blurDataURL={beforeImg.blurDataUrl} sizes="..." />
</motion.div>
```

Both masters mounted from start. After-master gets `priority` (LCP candidate). Before-master is preloaded via `<link rel="preload" as="image">` injected after first paint, so the toggle feels instant.

**Parallax:**

```tsx
const { scrollYProgress } = useScroll({ target: sceneRef })
const y = useTransform(
  scrollYProgress,
  [0, 1],
  [0, sceneHeightPx * (1 - layer.parallaxFactor)]
)

<motion.div style={{ y }}>
  <Image src={layer.url} alt="" role="presentation" fill />
</motion.div>
```

Decorative — empty `alt`, `role="presentation"`. Renders as `<motion.div>` so transform stays on GPU. **Not rendered at all under reduced motion.**

**Expanded motion vocabulary (default cinematic path):**

| Layer / element | Motion |
|---|---|
| Parallax — 5 to 7 layers | Multi-axis: `translateY` × `parallaxFactor`, plus tiny `translateX` drift on slow background layers, plus subtle scale on foreground layer |
| Master images | Low-amplitude breathing scale (1.00 → 1.015) tied to scroll velocity — held-camera feel |
| Atmospheric (1 dust, 1 ember, 1 volumetric haze) | CSS keyframe loops at varying speeds; particles drift continuously, untethered to scroll |
| Smoke wisps | Animated SVG `<path>` morphing on slow loop, OR PNG frame sequence cross-faded |
| God rays / light shafts | Radial gradient layer with slow rotational drift; intensity tied to scroll position |
| Crossfade transition | 600ms ease-out + brief "dust storm" overlay (~120ms peak) — sells temporal shift |
| Hotspots | Continuous breathing pulse (2s loop, ~6% scale). Staggered reveal as chapter activates. Scale + glow on hover/focus-in |
| Sticky UI | Small parallax — toggle button drifts ~4px counter to scroll for depth |
| Scroll velocity | Fast scroll → parallax layers gain hint of motion blur (interpolated `filter: blur()`). Slow scroll → settles |
| Chapter transitions | When `activeChapter` changes, soft "lens breath" — entire scene scales 1.00 → 1.005 → 1.00 over 800ms |

**Reduced-motion fork (only when OS preference is `reduce`):**

| Element | Reduced |
|---|---|
| Crossfade | 0ms instant swap (no dust burst) |
| Parallax / atmospheric / particles / god rays | Not rendered at all |
| Hotspot pulse | Removed; static dots |
| Hotspot reveal | Instant |
| Chapter "lens breath" | Removed |
| Master breathing | Removed |
| Velocity blur | Removed |

**Hotspot rendering — absolute-positioned `<button>`s, no SVG layer for v1:**

```tsx
<button
  className="hotspot-button"
  style={{
    left: `${hotspot.geometry.x * 100}%`,
    top:  `${hotspot.geometry.y * 100}%`,
    '--visible-size': `${hotspot.geometry.r * 100}cqw`,
  }}
  onClick={() => openHotspot(hotspot.id)}
  aria-label={`${hotspot.label}. Activate to read story.`}
  aria-haspopup="dialog"
>
  <span className="visible-dot" aria-hidden="true" />
  <span className="tap-target" aria-hidden="true" />  {/* min 48×48 CSS px */}
</button>
```

Visibility filtered by `visualState` against `beforeAfter`. Filter happens in `<HotspotOverlay>` to avoid re-rendering all hotspots when toggle changes. Container query unit `cqw` keeps hotspot sizing proportional to scene width across breakpoints.

**Chapter detection — IntersectionObserver:**

```tsx
const obs = new IntersectionObserver(
  entries => entries.forEach(e => {
    if (e.isIntersecting) setActiveChapter(e.target.dataset.chapter)
  }),
  { rootMargin: '-40% 0px -40% 0px' }   // narrow band around viewport center
)
```

`<ChapterAnchor>` is invisible (1px height, `visibility: hidden`), placed inline at `top: ${scrollAnchorY * 100}%`. Active-chapter switch fires when the anchor crosses viewport center, not as soon as it enters — prevents jitter.

**Reconstruction label:** sticky-positioned, conditionally rendered when the visible master has `isReconstruction === true`. Text reads e.g., "Visual reconstruction — based on archival sources." Tap to expand; expanded form shows full `reconstructionLabel`. Toggle change → label updates with the now-visible image.

## Loading and performance budget

**Asset specs:**

| Asset | Dimensions | Format priority | Approx weight | Loading |
|---|---|---|---|---|
| After-master | 1440×3840 (9:24) | AVIF → WebP → JPEG | ~600 KB AVIF | Eager, `priority`, in initial HTML |
| Before-master | 1440×3840 (9:24) | AVIF → WebP → JPEG | ~600 KB AVIF | `<link rel="preload" as="image">` after first paint |
| Parallax layers (5–7) | 1440×3840 with transparency | WebP → PNG | ~120 KB each | Lazy via `requestIdleCallback` |
| Particle/dust sprites | 32×32 to 256×256 | SVG or WebP | <20 KB | Lazy with parallax bundle |
| God rays / radial gradients | — | CSS only | 0 | Inline |

Total cinematic asset weight, fully streamed: **~2.5 MB over the first 20–30 seconds.** First paint payload is the after-master + critical CSS only.

**Container sizing — CSS `aspect-ratio`:**

```tsx
<div ref={sceneRef} className="scene-container"
     style={{ aspectRatio: `${img.width} / ${img.height}` }}>
  {/* layers absolute-positioned inside */}
</div>
```

No CLS: height is reserved before image loads.

**Bundle splitting:**

| Code | Bundle | Reason |
|---|---|---|
| Scene engine core (rendering, store, types) | Main route bundle | Needed for first paint |
| Motion library — basic transforms | Main bundle | Used by initial crossfade |
| Parallax module (`useTransform`, particle systems) | Lazy-imported via `dynamic()` | Not needed until first scroll |
| Atmospheric / particle effects | Lazy-imported, code-split | Pure enhancement |

Target: scene engine main bundle <50 KB gzipped (excluding the master image itself).

**LCP path:**

1. Server renders document with scene container's `aspect-ratio` set, `blurDataURL` placeholder, and after-master `<img>` with `priority`.
2. Browser fetches after-master in parallel with HTML parsing.
3. After-master paints → LCP fires.
4. After first paint, `useEffect` injects `<link rel="preload" as="image">` for before-master.
5. After `requestIdleCallback` (or 1s, whichever first), parallax module dynamically imports and mounts.
6. Particles/atmospheric module imports last.

**Performance acceptance:**

| Metric | Target | How met |
|---|---|---|
| LCP | <2.5s | After-master eager + `priority` + `blurDataURL` + CDN |
| INP | <200ms | Hotspot taps go to Zustand store (sync); toggle is single state flip |
| CLS | <0.1 | `aspect-ratio` reserves height; sticky UI doesn't reflow content |
| Time-to-cinematic | <3s after LCP | Parallax + particles arrive within idle window |
| Toggle responsiveness | <50ms | Both masters loaded; flip is opacity-only |

**Frame-rate degradation (device-driven, separate from `prefers-reduced-motion`):**

Frame-rate monitor tracks frame timing. If average frame time exceeds ~18ms (55fps) over a 1s window, engine downgrades effects in this order:

1. Drop velocity blur on parallax layers
2. Drop scene "breathing" scale
3. Drop hotspot pulse animation
4. Drop one parallax layer at a time (lightest first)
5. Floor: master images + 1 parallax + static hotspots

Reversible: if scroll stops and frame time recovers, dropped layers reinstate. **Silent to the user** — no "performance mode" indicator. (Can be revisited if telemetry shows users are confused.)

## Accessibility

**Keyboard:**

| Key | Action |
|---|---|
| `Tab` | Skip link → toggle → hotspots in scroll order → reconstruction label |
| `Enter` / `Space` | Activate focused hotspot |
| `Escape` | Engine doesn't handle; drawer host owns. Engine ensures focus returns to activating hotspot on drawer close |
| `T` | Optional: toggle before/after (documented but unobtrusive) |

`:focus-visible` only — focus rings show on keyboard focus, hidden on pointer/touch.

**Screen reader:**

```tsx
<section aria-label={scene.title} aria-describedby="scene-desc">
  <p id="scene-desc" className="sr-only">
    Scroll to explore {scene.title}. Use the toggle to switch between historical and
    current views. Activate a marker to read about that location.
  </p>

  <button role="switch"
          aria-checked={beforeAfter === 'before'}
          aria-label={`Showing ${beforeAfter} view. Toggle to switch.`}>...</button>

  {hotspots.map(h => (
    <button key={h.id}
            aria-label={`${h.label}. Activate to read story.`}
            aria-haspopup="dialog">...</button>
  ))}

  <div aria-live="polite" className="sr-only">
    {activeChapter && `Now in chapter: ${activeChapter.label}`}
  </div>
</section>
```

Parallax: `role="presentation"`, empty `alt`. Reduced-motion fork is silent — never announced.

Reconstruction label: `role="note"` with `aria-label="Visual reconstruction"`.

**Touch targets** (WCAG 2.2 + web.dev):

| Element | Minimum |
|---|---|
| Hotspot tap area | 48×48 CSS px |
| Toggle button | 48×48 CSS px |
| Reconstruction label tap zone | 44×44 CSS px |
| Hotspot-to-hotspot spacing | 8px gap minimum between tap zones |

Visible hotspot dot can be small (subtle, cinematic) while invisible tap target stays large.

**Color contrast:**

| Pair | Ratio target |
|---|---|
| Hotspot visible dot vs scene | 3:1 (WCAG 1.4.11 non-text UI) plus translucent backing ring |
| Toggle button text | 4.5:1 (AA normal) |
| Reconstruction label | 4.5:1 (AA normal) |

## Testing

| Layer | Tools | Coverage |
|---|---|---|
| Unit | Vitest | Store reducers, geometry math, `visualState` filter, reduced-motion fork selection |
| Component | React Testing Library | `<SceneViewport>` mounts all layers; `<HotspotOverlay>` filters correctly; `<BeforeAfterToggle>` fires callback; `<ReconstructionLabel>` conditionally renders |
| Integration | Playwright | Scroll → hotspot positions correct; tap → `onHotspotOpen` fires; toggle → opacity flips; deep links work on mount |
| A11y | `@axe-core/playwright` + manual | Automated axe pass (zero criticals); manual VoiceOver iOS, TalkBack Android, NVDA Windows; keyboard-only walk |
| Reduced motion | Playwright `emulateMedia` | Verifies parallax/particles not rendered, transitions instant |
| Visual regression | Playwright snapshots | Mobile portrait, tablet, desktop sidebar; before/after/transitioning |
| Performance | Lighthouse CI + Vercel Speed Insights | Mobile Lighthouse ≥85, RUM thresholds in production |

## Browser / device targets

| Tier | Targets | Behavior |
|---|---|---|
| 1 | iOS Safari 17+, Chrome Android last-2, desktop Chrome/Safari/Firefox/Edge last-2 | Full cinematic |
| 2 | Pixel 6a–class Androids | Full cinematic with frame-rate auto-degradation as needed |
| 3 | iOS 16 Safari | Drops particles, parallax limited to 2 layers |

## Release gates

1. All automated test layers pass
2. Axe pass on Playwright with zero criticals
3. Lighthouse mobile ≥85
4. **Manual editorial QA**: someone with editorial authority confirms the rendered scene is dignity-compliant before each deploy. Hotspot positioning, image content, reconstruction labeling all reviewed. Cannot be enforced by automation.

## Open questions / risks

- **Frame-rate degradation visibility.** Currently silent. If telemetry shows confusion ("things keep disappearing"), expose a small indicator. Decide post-launch from RUM.
- **Reduced-motion settings override UI.** A future settings drawer (separate spec) will offer `'system' | 'reduce' | 'no-preference'`. The store and `reducedMotion.ts` should accept a triple, but the UI is out of scope for this spec.
- **Multi-scene future.** Engine handles one scene cleanly; routing to multiple scenes is a follow-on spec. The current `Scene.slug` field anticipates this.
- **Live updates impact on hotspots.** When a hotspot's underlying story or source updates (separate live-updates spec), engine doesn't need to re-render — drawer host handles content. But if a hotspot is **added or removed** dynamically, engine must support `hotspots` prop changes without remounting layers. Worth a unit test.

## Out of scope (deferred to other specs)

- Drawer/bottom-sheet content rendering
- Desktop sidebar (subscribes to engine events)
- Story Mode player (drives scroll, opens hotspots programmatically via store)
- Source pipeline (`official-sources` MCP)
- Admin PWA + deploy control
- Sourcing governance (image policy, graphic_level, dignity review workflow)
- Bilingual translations and RTL UI
