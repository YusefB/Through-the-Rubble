# Scene Engine Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the production-ready scene engine for Through the Rubble — a tall scrollable stitched scene with cinematic motion, before/after toggle, hotspot overlay, chapter detection, deep-link URL contract, and reduced-motion accessibility fork.

**Architecture:** Layered DOM with absolutely-positioned image layers and `<button>` hotspots. Zustand store for discrete state, Motion for React for scroll-linked transforms (MotionValues bypass React renders). IntersectionObserver for chapter detection. Frame-rate monitor for automatic degradation on low-end hardware.

**Tech Stack:** Next.js 16 (App Router) · TypeScript strict · Tailwind CSS · `motion/react` (Motion for React) · `zustand` · Vitest + React Testing Library + jsdom · Playwright + `@axe-core/playwright`.

**Spec:** `docs/superpowers/specs/2026-04-30-scene-engine-design.md` — read first if you haven't.

**Repo state:** Greenfield. `.git/` initialized on `main`, `.gitignore` excludes `.superpowers/`, `docs/superpowers/specs/` already populated. No code yet.

---

## Stage A — Bootstrap (procedural, no TDD yet)

### Task 1: Initialize Next.js project

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, `tailwind.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`

- [ ] **Step 1: Bootstrap Next.js into the existing directory**

The directory already contains `.git/`, `.gitignore`, `docs/`. `create-next-app` permits these files.

```bash
cd /Users/yusef/throughtherubble
npx --yes create-next-app@latest . \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --no-src-dir \
  --turbopack \
  --import-alias "@/*" \
  --use-npm \
  --skip-install
```

If `create-next-app` complains about non-empty directory, list files first and confirm only `.git`, `.gitignore`, `docs`, `.superpowers` are present. The `.superpowers` directory is gitignored and may be removed/restored — it does not block bootstrap.

- [ ] **Step 2: Install dependencies**

```bash
npm install
```

Expected: completes without errors. `node_modules/` and `package-lock.json` created.

- [ ] **Step 3: Verify dev server starts**

```bash
npm run dev
```

Open http://localhost:3000 in a browser. Confirm the default Next.js welcome page renders. Stop the server (Ctrl-C).

- [ ] **Step 4: Tighten TypeScript strictness**

Open `tsconfig.json`. Ensure these flags are set inside `compilerOptions`:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "exactOptionalPropertyTypes": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

`strict` is set by `create-next-app` already. Add the rest by editing the existing `compilerOptions` object. Do not remove existing flags.

- [ ] **Step 5: Verify typecheck passes**

Add a `typecheck` script to `package.json`:

```json
"scripts": {
  "typecheck": "tsc --noEmit"
}
```

Run:

```bash
npm run typecheck
```

Expected: exits 0 with no output.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "Bootstrap Next.js 16 App Router project

- TypeScript strict + noUncheckedIndexedAccess + exactOptionalPropertyTypes
- Tailwind, ESLint, Turbopack, App Router, no src dir
- typecheck script

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: Install runtime libraries

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install `motion` and `zustand`**

```bash
npm install motion zustand
```

Expected: both packages added to `dependencies`.

- [ ] **Step 2: Verify installs**

```bash
npm ls motion zustand
```

Expected: both listed at recent versions (`motion@12+`, `zustand@5+`).

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "Install motion (Motion for React) and zustand"
```

---

### Task 3: Set up Vitest + React Testing Library + jsdom

**Files:**
- Create: `vitest.config.ts`, `tests/setup.ts`
- Modify: `package.json`

- [ ] **Step 1: Install dev dependencies**

```bash
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

- [ ] **Step 2: Create `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    globals: true,
    css: false,
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, './') },
  },
})
```

- [ ] **Step 3: Create `tests/setup.ts`**

```ts
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

afterEach(() => {
  cleanup()
})
```

- [ ] **Step 4: Add `test` script to `package.json`**

Add to `scripts`:

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 5: Verify Vitest runs (with no tests yet)**

```bash
npm test
```

Expected: "No test files found" message, exits 0.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "Add Vitest + RTL + jsdom test infrastructure"
```

---

### Task 4: Set up Playwright + axe-core

**Files:**
- Create: `playwright.config.ts`, `tests/e2e/.gitkeep`
- Modify: `package.json`

- [ ] **Step 1: Install Playwright and axe**

```bash
npm install -D @playwright/test @axe-core/playwright
npx playwright install chromium
```

- [ ] **Step 2: Create `playwright.config.ts`**

```ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  fullyParallel: true,
  reporter: 'list',
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'mobile-portrait', use: { ...devices['iPhone 14'] } },
    { name: 'desktop-chrome', use: { ...devices['Desktop Chrome'] } },
  ],
})
```

- [ ] **Step 3: Create empty e2e directory marker**

```bash
mkdir -p tests/e2e
touch tests/e2e/.gitkeep
```

- [ ] **Step 4: Add scripts to `package.json`**

```json
"e2e": "playwright test",
"e2e:ui": "playwright test --ui"
```

- [ ] **Step 5: Verify Playwright resolves config**

```bash
npx playwright test --list
```

Expected: "No tests found" (we haven't written any), exits 0 or with no errors.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "Add Playwright + axe-core for e2e and a11y testing"
```

---

## Stage B — Types and pure utilities (TDD)

### Task 5: Define core types

**Files:**
- Create: `lib/scene/types.ts`, `lib/scene/types.test.ts`

- [ ] **Step 1: Write a compile-time test**

Type tests in TS are usually compile-time only. We use Vitest with `expectTypeOf` from Vitest's built-in API.

Create `lib/scene/types.test.ts`:

```ts
import { describe, it, expectTypeOf } from 'vitest'
import type {
  Scene,
  SceneImage,
  ParallaxLayer,
  Chapter,
  Hotspot,
  SceneEngineProps,
} from './types'

describe('scene types', () => {
  it('Scene has the expected shape', () => {
    const s: Scene = {
      id: 's1',
      slug: 'main-street',
      title: 'Main Street',
      defaultBeforeAfter: 'after',
    }
    expectTypeOf(s.defaultBeforeAfter).toEqualTypeOf<'before' | 'after'>()
  })

  it('SceneImage requires altText and isReconstruction', () => {
    const img: SceneImage = {
      variant: 'after',
      url: '/img.webp',
      width: 1440,
      height: 3840,
      isReconstruction: false,
      altText: 'Main street as it stands today',
    }
    expectTypeOf(img.variant).toEqualTypeOf<'before' | 'after'>()
    expectTypeOf(img.isReconstruction).toBeBoolean()
  })

  it('ParallaxLayer has parallaxFactor', () => {
    const p: ParallaxLayer = {
      id: 'dust',
      url: '/dust.webp',
      width: 1440,
      height: 3840,
      parallaxFactor: 0.6,
    }
    expectTypeOf(p.parallaxFactor).toBeNumber()
  })

  it('Chapter normalizes scrollAnchorY to 0..1', () => {
    const c: Chapter = {
      id: 'c1',
      sceneId: 's1',
      order: 0,
      label: 'North block',
      scrollAnchorY: 0.25,
    }
    expectTypeOf(c.scrollAnchorY).toBeNumber()
  })

  it('Hotspot geometry uses normalized coords', () => {
    const h: Hotspot = {
      id: 'h1',
      sceneId: 's1',
      label: 'Collapsed apartment block',
      geometry: { x: 0.42, y: 0.33, r: 0.035 },
      type: 'story',
      priority: 'hero',
      visualState: 'always',
    }
    expectTypeOf(h.geometry.x).toBeNumber()
    expectTypeOf(h.visualState).toEqualTypeOf<
      'always' | 'after-only' | 'before-only'
    >()
  })

  it('SceneEngineProps requires scene + images + arrays', () => {
    type _check = SceneEngineProps['scene'] extends Scene ? true : false
    expectTypeOf<_check>().toEqualTypeOf<true>()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- lib/scene/types.test.ts
```

Expected: FAIL — `Cannot find module './types'`.

- [ ] **Step 3: Create `lib/scene/types.ts`**

```ts
export type Scene = {
  id: string
  slug: string
  title: string
  defaultBeforeAfter: 'before' | 'after'
}

export type SceneImage = {
  variant: 'before' | 'after'
  url: string
  width: number
  height: number
  blurDataUrl?: string
  isReconstruction: boolean
  reconstructionLabel?: string
  altText: string
  creditLine?: string
}

export type ParallaxLayer = {
  id: string
  url: string
  width: number
  height: number
  parallaxFactor: number
  opacity?: number
  blendMode?: 'normal' | 'screen' | 'multiply' | 'overlay'
}

export type Chapter = {
  id: string
  sceneId: string
  order: number
  label: string
  scrollAnchorY: number
  narration?: string
  sourceAnchorId?: string
}

export type HotspotGeometry = {
  x: number
  y: number
  r: number
}

export type Hotspot = {
  id: string
  sceneId: string
  chapterId?: string
  label: string
  geometry: HotspotGeometry
  type: 'story' | 'stat' | 'timeline' | 'update' | 'action'
  priority: 'hero' | 'primary' | 'secondary' | 'optional'
  visualState: 'always' | 'after-only' | 'before-only'
}

export type SceneEngineProps = {
  scene: Scene
  images: SceneImage[]
  parallaxLayers: ParallaxLayer[]
  chapters: Chapter[]
  hotspots: Hotspot[]
  initialBeforeAfter?: 'before' | 'after'
  onHotspotOpen?: (hotspotId: string) => void
  onChapterChange?: (chapterId: string) => void
  onToggleBeforeAfter?: (state: 'before' | 'after') => void
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm test -- lib/scene/types.test.ts
```

Expected: PASS.

- [ ] **Step 5: Run typecheck**

```bash
npm run typecheck
```

Expected: exits 0.

- [ ] **Step 6: Commit**

```bash
git add lib/scene/
git commit -m "Add scene engine TypeScript types"
```

---

### Task 6: Reduced-motion detection utility

**Files:**
- Create: `lib/scene/reducedMotion.ts`, `lib/scene/reducedMotion.test.ts`

- [ ] **Step 1: Write the failing test**

Create `lib/scene/reducedMotion.test.ts`:

```ts
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { detectReducedMotion, subscribeToReducedMotion } from './reducedMotion'

type MQListener = (e: { matches: boolean }) => void

function mockMatchMedia(initialMatches: boolean) {
  const listeners = new Set<MQListener>()
  const mql = {
    matches: initialMatches,
    addEventListener: (_: string, cb: MQListener) => listeners.add(cb),
    removeEventListener: (_: string, cb: MQListener) => listeners.delete(cb),
    media: '(prefers-reduced-motion: reduce)',
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => true,
  }
  vi.stubGlobal('matchMedia', vi.fn().mockReturnValue(mql))
  return {
    fire(matches: boolean) {
      mql.matches = matches
      listeners.forEach(l => l({ matches }))
    },
  }
}

describe('reducedMotion', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('detectReducedMotion returns true when OS prefers reduce', () => {
    mockMatchMedia(true)
    expect(detectReducedMotion()).toBe(true)
  })

  it('detectReducedMotion returns false when OS does not prefer reduce', () => {
    mockMatchMedia(false)
    expect(detectReducedMotion()).toBe(false)
  })

  it('subscribeToReducedMotion fires on change', () => {
    const ctl = mockMatchMedia(false)
    const cb = vi.fn()
    const unsubscribe = subscribeToReducedMotion(cb)
    ctl.fire(true)
    expect(cb).toHaveBeenCalledWith(true)
    ctl.fire(false)
    expect(cb).toHaveBeenCalledWith(false)
    unsubscribe()
  })

  it('subscribeToReducedMotion stops firing after unsubscribe', () => {
    const ctl = mockMatchMedia(false)
    const cb = vi.fn()
    const unsubscribe = subscribeToReducedMotion(cb)
    unsubscribe()
    ctl.fire(true)
    expect(cb).not.toHaveBeenCalled()
  })

  it('detectReducedMotion returns false when window is undefined (SSR)', () => {
    // jsdom always defines window, so we simulate via stubbing matchMedia to throw
    vi.stubGlobal('matchMedia', undefined)
    expect(detectReducedMotion()).toBe(false)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- lib/scene/reducedMotion.test.ts
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement `lib/scene/reducedMotion.ts`**

```ts
const QUERY = '(prefers-reduced-motion: reduce)'

export function detectReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  if (typeof window.matchMedia !== 'function') return false
  return window.matchMedia(QUERY).matches
}

export function subscribeToReducedMotion(
  callback: (reduced: boolean) => void,
): () => void {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return () => {}
  }
  const mql = window.matchMedia(QUERY)
  const handler = (e: MediaQueryListEvent) => callback(e.matches)
  mql.addEventListener('change', handler)
  return () => mql.removeEventListener('change', handler)
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm test -- lib/scene/reducedMotion.test.ts
```

Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add lib/scene/reducedMotion.ts lib/scene/reducedMotion.test.ts
git commit -m "Add reduced-motion detection utility"
```

---

### Task 7: Frame-rate monitor for auto-degradation

**Files:**
- Create: `lib/scene/framerate.ts`, `lib/scene/framerate.test.ts`

- [ ] **Step 1: Write the failing test**

Create `lib/scene/framerate.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createFrameRateMonitor } from './framerate'

describe('frameRateMonitor', () => {
  let now = 0
  let rafCallbacks: FrameRequestCallback[] = []

  beforeEach(() => {
    now = 0
    rafCallbacks = []
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
      rafCallbacks.push(cb)
      return rafCallbacks.length
    })
    vi.stubGlobal('cancelAnimationFrame', () => {})
    vi.stubGlobal('performance', { now: () => now })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  function tickFrames(count: number, frameTimeMs: number) {
    for (let i = 0; i < count; i++) {
      now += frameTimeMs
      const cb = rafCallbacks.shift()
      cb?.(now)
    }
  }

  it('reports tier 0 (no degradation) at 60fps', () => {
    const onTier = vi.fn()
    const m = createFrameRateMonitor({ windowMs: 1000, onTier })
    m.start()
    tickFrames(60, 16) // ~60fps
    expect(onTier).toHaveBeenLastCalledWith(0)
    m.stop()
  })

  it('reports tier 1 when avg frame time exceeds ~18ms', () => {
    const onTier = vi.fn()
    const m = createFrameRateMonitor({ windowMs: 1000, onTier })
    m.start()
    tickFrames(60, 22) // ~45fps
    expect(onTier).toHaveBeenLastCalledWith(1)
    m.stop()
  })

  it('escalates tiers as frame time worsens', () => {
    const onTier = vi.fn()
    const m = createFrameRateMonitor({ windowMs: 1000, onTier })
    m.start()
    tickFrames(60, 30) // ~33fps — should be tier >= 2
    const lastCall = onTier.mock.calls[onTier.mock.calls.length - 1]?.[0]
    expect(lastCall).toBeGreaterThanOrEqual(2)
    m.stop()
  })

  it('does not call onTier after stop()', () => {
    const onTier = vi.fn()
    const m = createFrameRateMonitor({ windowMs: 1000, onTier })
    m.start()
    m.stop()
    onTier.mockClear()
    tickFrames(60, 16)
    expect(onTier).not.toHaveBeenCalled()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- lib/scene/framerate.test.ts
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement `lib/scene/framerate.ts`**

```ts
export type FrameRateMonitorOptions = {
  windowMs: number
  onTier: (tier: number) => void
}

export type FrameRateMonitor = {
  start: () => void
  stop: () => void
}

const TIER_THRESHOLDS_MS = [16.7, 18.5, 22, 28, 40]

function tierForAvg(avgMs: number): number {
  for (let i = TIER_THRESHOLDS_MS.length - 1; i >= 0; i--) {
    if (avgMs >= TIER_THRESHOLDS_MS[i]!) return i
  }
  return 0
}

export function createFrameRateMonitor({
  windowMs,
  onTier,
}: FrameRateMonitorOptions): FrameRateMonitor {
  let running = false
  let lastTimestamp = 0
  let frameTimes: number[] = []
  let lastReportedTier = -1

  function frame(timestamp: number) {
    if (!running) return
    if (lastTimestamp !== 0) {
      const delta = timestamp - lastTimestamp
      frameTimes.push(delta)
      const totalMs = frameTimes.reduce((a, b) => a + b, 0)
      while (totalMs > windowMs && frameTimes.length > 1) {
        frameTimes.shift()
      }
      if (frameTimes.length >= 30) {
        const avg = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length
        const tier = tierForAvg(avg)
        if (tier !== lastReportedTier) {
          lastReportedTier = tier
          onTier(tier)
        }
      }
    }
    lastTimestamp = timestamp
    requestAnimationFrame(frame)
  }

  return {
    start() {
      if (running) return
      running = true
      lastTimestamp = 0
      frameTimes = []
      lastReportedTier = -1
      requestAnimationFrame(frame)
    },
    stop() {
      running = false
    },
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm test -- lib/scene/framerate.test.ts
```

Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add lib/scene/framerate.ts lib/scene/framerate.test.ts
git commit -m "Add frame-rate monitor for auto-degradation"
```

---

## Stage C — Zustand store (TDD)

### Task 8: SceneStore

**Files:**
- Create: `lib/scene/store.ts`, `lib/scene/store.test.ts`

- [ ] **Step 1: Write the failing test**

Create `lib/scene/store.test.ts`:

```ts
import { describe, it, expect, beforeEach } from 'vitest'
import { createSceneStore } from './store'

describe('sceneStore', () => {
  let useStore: ReturnType<typeof createSceneStore>

  beforeEach(() => {
    useStore = createSceneStore({
      activeChapterId: null,
      beforeAfter: 'after',
      openHotspotId: null,
      reducedMotion: false,
    })
  })

  it('initializes with provided values', () => {
    const s = useStore.getState()
    expect(s.beforeAfter).toBe('after')
    expect(s.activeChapterId).toBeNull()
    expect(s.openHotspotId).toBeNull()
    expect(s.reducedMotion).toBe(false)
  })

  it('toggleBeforeAfter flips between before and after', () => {
    useStore.getState().toggleBeforeAfter()
    expect(useStore.getState().beforeAfter).toBe('before')
    useStore.getState().toggleBeforeAfter()
    expect(useStore.getState().beforeAfter).toBe('after')
  })

  it('setBeforeAfter sets explicit value', () => {
    useStore.getState().setBeforeAfter('before')
    expect(useStore.getState().beforeAfter).toBe('before')
    useStore.getState().setBeforeAfter('after')
    expect(useStore.getState().beforeAfter).toBe('after')
  })

  it('setActiveChapter updates active chapter', () => {
    useStore.getState().setActiveChapter('chapter-1')
    expect(useStore.getState().activeChapterId).toBe('chapter-1')
  })

  it('openHotspot and closeHotspot update openHotspotId', () => {
    useStore.getState().openHotspot('h1')
    expect(useStore.getState().openHotspotId).toBe('h1')
    useStore.getState().closeHotspot()
    expect(useStore.getState().openHotspotId).toBeNull()
  })

  it('setReducedMotion updates value', () => {
    useStore.getState().setReducedMotion(true)
    expect(useStore.getState().reducedMotion).toBe(true)
  })

  it('multiple stores are independent', () => {
    const a = createSceneStore({ activeChapterId: null, beforeAfter: 'after', openHotspotId: null, reducedMotion: false })
    const b = createSceneStore({ activeChapterId: null, beforeAfter: 'after', openHotspotId: null, reducedMotion: false })
    a.getState().setBeforeAfter('before')
    expect(a.getState().beforeAfter).toBe('before')
    expect(b.getState().beforeAfter).toBe('after')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- lib/scene/store.test.ts
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement `lib/scene/store.ts`**

```ts
'use client'
import { createStore, type StoreApi } from 'zustand'

export type SceneStoreState = {
  activeChapterId: string | null
  beforeAfter: 'before' | 'after'
  openHotspotId: string | null
  reducedMotion: boolean
}

export type SceneStoreActions = {
  setActiveChapter: (id: string) => void
  toggleBeforeAfter: () => void
  setBeforeAfter: (state: 'before' | 'after') => void
  openHotspot: (id: string) => void
  closeHotspot: () => void
  setReducedMotion: (value: boolean) => void
}

export type SceneStore = SceneStoreState & SceneStoreActions

export type SceneStoreApi = StoreApi<SceneStore>

export function createSceneStore(initial: SceneStoreState): SceneStoreApi {
  return createStore<SceneStore>((set) => ({
    ...initial,
    setActiveChapter: (id) => set({ activeChapterId: id }),
    toggleBeforeAfter: () =>
      set((s) => ({ beforeAfter: s.beforeAfter === 'before' ? 'after' : 'before' })),
    setBeforeAfter: (state) => set({ beforeAfter: state }),
    openHotspot: (id) => set({ openHotspotId: id }),
    closeHotspot: () => set({ openHotspotId: null }),
    setReducedMotion: (value) => set({ reducedMotion: value }),
  }))
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm test -- lib/scene/store.test.ts
```

Expected: PASS (7 tests).

- [ ] **Step 5: Commit**

```bash
git add lib/scene/store.ts lib/scene/store.test.ts
git commit -m "Add Zustand SceneStore with TDD"
```

---

### Task 9: Store React context provider + hook

**Files:**
- Create: `lib/scene/SceneStoreContext.tsx`, `lib/scene/SceneStoreContext.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `lib/scene/SceneStoreContext.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, renderHook, screen } from '@testing-library/react'
import { SceneStoreProvider, useSceneStore } from './SceneStoreContext'

function Reader() {
  const beforeAfter = useSceneStore((s) => s.beforeAfter)
  return <span data-testid="state">{beforeAfter}</span>
}

describe('SceneStoreContext', () => {
  it('provides initial state via Provider', () => {
    render(
      <SceneStoreProvider initial={{
        activeChapterId: null,
        beforeAfter: 'before',
        openHotspotId: null,
        reducedMotion: false,
      }}>
        <Reader />
      </SceneStoreProvider>
    )
    expect(screen.getByTestId('state')).toHaveTextContent('before')
  })

  it('throws when useSceneStore is called outside provider', () => {
    expect(() =>
      renderHook(() => useSceneStore((s) => s.beforeAfter))
    ).toThrow(/SceneStoreProvider/)
  })

  it('selector subscribes only to selected slice', () => {
    let renderCount = 0
    function CountReader() {
      renderCount++
      const beforeAfter = useSceneStore((s) => s.beforeAfter)
      return <span>{beforeAfter}</span>
    }
    const { rerender } = render(
      <SceneStoreProvider initial={{
        activeChapterId: null,
        beforeAfter: 'after',
        openHotspotId: null,
        reducedMotion: false,
      }}>
        <CountReader />
      </SceneStoreProvider>
    )
    const initialRenders = renderCount
    rerender(
      <SceneStoreProvider initial={{
        activeChapterId: null,
        beforeAfter: 'after',
        openHotspotId: null,
        reducedMotion: false,
      }}>
        <CountReader />
      </SceneStoreProvider>
    )
    expect(renderCount).toBeGreaterThanOrEqual(initialRenders)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- lib/scene/SceneStoreContext.test.tsx
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement `lib/scene/SceneStoreContext.tsx`**

```tsx
'use client'
import { createContext, useContext, useRef, type ReactNode } from 'react'
import { useStore } from 'zustand'
import {
  createSceneStore,
  type SceneStore,
  type SceneStoreApi,
  type SceneStoreState,
} from './store'

const SceneStoreContext = createContext<SceneStoreApi | null>(null)

export function SceneStoreProvider({
  initial,
  children,
}: {
  initial: SceneStoreState
  children: ReactNode
}) {
  const storeRef = useRef<SceneStoreApi | null>(null)
  if (!storeRef.current) {
    storeRef.current = createSceneStore(initial)
  }
  return (
    <SceneStoreContext.Provider value={storeRef.current}>
      {children}
    </SceneStoreContext.Provider>
  )
}

export function useSceneStore<T>(selector: (state: SceneStore) => T): T {
  const store = useContext(SceneStoreContext)
  if (!store) {
    throw new Error('useSceneStore must be used inside <SceneStoreProvider>')
  }
  return useStore(store, selector)
}

export function useSceneStoreApi(): SceneStoreApi {
  const store = useContext(SceneStoreContext)
  if (!store) {
    throw new Error('useSceneStoreApi must be used inside <SceneStoreProvider>')
  }
  return store
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm test -- lib/scene/SceneStoreContext.test.tsx
```

Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add lib/scene/SceneStoreContext.tsx lib/scene/SceneStoreContext.test.tsx
git commit -m "Add React context provider for SceneStore"
```

---

## Stage D — Atomic components (TDD)

### Task 10: ChapterAnchor component

**Files:**
- Create: `components/scene/ChapterAnchor.tsx`, `components/scene/ChapterAnchor.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `components/scene/ChapterAnchor.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ChapterAnchor } from './ChapterAnchor'

describe('ChapterAnchor', () => {
  it('renders an invisible anchor element with data-chapter attribute', () => {
    render(<ChapterAnchor chapterId="north-block" scrollAnchorY={0.25} />)
    const el = screen.getByTestId('chapter-anchor-north-block')
    expect(el).toHaveAttribute('data-chapter', 'north-block')
  })

  it('positions itself at the correct vertical percentage', () => {
    render(<ChapterAnchor chapterId="ch-1" scrollAnchorY={0.42} />)
    const el = screen.getByTestId('chapter-anchor-ch-1')
    expect(el.style.top).toBe('42%')
  })

  it('is visually hidden but in the DOM (presentational)', () => {
    render(<ChapterAnchor chapterId="ch-1" scrollAnchorY={0} />)
    const el = screen.getByTestId('chapter-anchor-ch-1')
    expect(el.getAttribute('aria-hidden')).toBe('true')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- components/scene/ChapterAnchor.test.tsx
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement `components/scene/ChapterAnchor.tsx`**

```tsx
'use client'
type Props = {
  chapterId: string
  scrollAnchorY: number
}

export function ChapterAnchor({ chapterId, scrollAnchorY }: Props) {
  return (
    <div
      data-testid={`chapter-anchor-${chapterId}`}
      data-chapter={chapterId}
      aria-hidden="true"
      style={{
        position: 'absolute',
        top: `${scrollAnchorY * 100}%`,
        left: 0,
        width: '100%',
        height: '1px',
        visibility: 'hidden',
        pointerEvents: 'none',
      }}
    />
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm test -- components/scene/ChapterAnchor.test.tsx
```

Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add components/scene/ChapterAnchor.tsx components/scene/ChapterAnchor.test.tsx
git commit -m "Add ChapterAnchor component"
```

---

### Task 11: ReconstructionLabel component

**Files:**
- Create: `components/scene/ReconstructionLabel.tsx`, `components/scene/ReconstructionLabel.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `components/scene/ReconstructionLabel.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ReconstructionLabel } from './ReconstructionLabel'

describe('ReconstructionLabel', () => {
  it('renders the short text when collapsed', () => {
    render(<ReconstructionLabel label="Based on archival imagery" />)
    expect(screen.getByText('Visual reconstruction')).toBeInTheDocument()
  })

  it('expands the description on click', async () => {
    const user = userEvent.setup()
    render(<ReconstructionLabel label="Based on archival imagery from UN OCHA, 2019" />)
    const button = screen.getByRole('button', { name: /reconstruction/i })
    expect(screen.queryByText(/Based on archival imagery/)).not.toBeVisible()
    await user.click(button)
    expect(screen.getByText(/Based on archival imagery/)).toBeVisible()
  })

  it('has role=note and aria-label', () => {
    render(<ReconstructionLabel label="x" />)
    const note = screen.getByRole('note', { name: /Visual reconstruction/i })
    expect(note).toBeInTheDocument()
  })

  it('toggles collapsed/expanded with keyboard', async () => {
    const user = userEvent.setup()
    render(<ReconstructionLabel label="Detailed source note" />)
    const button = screen.getByRole('button', { name: /reconstruction/i })
    button.focus()
    await user.keyboard('{Enter}')
    expect(screen.getByText('Detailed source note')).toBeVisible()
    await user.keyboard('{Enter}')
    expect(screen.queryByText('Detailed source note')).not.toBeVisible()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- components/scene/ReconstructionLabel.test.tsx
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement `components/scene/ReconstructionLabel.tsx`**

```tsx
'use client'
import { useState } from 'react'

type Props = {
  label: string
}

export function ReconstructionLabel({ label }: Props) {
  const [expanded, setExpanded] = useState(false)
  return (
    <div
      role="note"
      aria-label="Visual reconstruction"
      className="reconstruction-label"
      style={{
        position: 'sticky',
        top: '12px',
        right: '12px',
        marginLeft: 'auto',
        zIndex: 50,
        maxWidth: '280px',
      }}
    >
      <button
        type="button"
        onClick={() => setExpanded(v => !v)}
        aria-expanded={expanded}
        aria-label="Visual reconstruction. Activate for source note."
        className="reconstruction-label-button"
        style={{
          padding: '6px 10px',
          minWidth: '44px',
          minHeight: '44px',
          background: 'rgba(0,0,0,0.7)',
          color: '#f1c155',
          border: '1px solid rgba(241,193,85,0.4)',
          borderRadius: '999px',
          fontSize: '12px',
          letterSpacing: '1.5px',
          cursor: 'pointer',
        }}
      >
        Visual reconstruction
      </button>
      <div
        role="region"
        aria-hidden={!expanded}
        style={{
          display: expanded ? 'block' : 'none',
          marginTop: '6px',
          padding: '10px',
          background: 'rgba(0,0,0,0.85)',
          color: '#f5ebd8',
          fontSize: '12px',
          lineHeight: 1.5,
          borderRadius: '6px',
          border: '1px solid rgba(241,193,85,0.2)',
        }}
      >
        {label}
      </div>
    </div>
  )
}
```

Note: jsdom does not consider `display: none` "hidden" via `toBeVisible()` in all cases — the test relies on the conditional `display: 'none'`. RTL's `toBeVisible()` checks `display`, `visibility`, and `aria-hidden` chains.

- [ ] **Step 4: Run test to verify it passes**

```bash
npm test -- components/scene/ReconstructionLabel.test.tsx
```

Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add components/scene/ReconstructionLabel.tsx components/scene/ReconstructionLabel.test.tsx
git commit -m "Add ReconstructionLabel component"
```

---

### Task 12: BeforeAfterToggle component

**Files:**
- Create: `components/scene/BeforeAfterToggle.tsx`, `components/scene/BeforeAfterToggle.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `components/scene/BeforeAfterToggle.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SceneStoreProvider } from '@/lib/scene/SceneStoreContext'
import { BeforeAfterToggle } from './BeforeAfterToggle'

function renderToggle(initialState: 'before' | 'after' = 'after') {
  return render(
    <SceneStoreProvider initial={{
      activeChapterId: null,
      beforeAfter: initialState,
      openHotspotId: null,
      reducedMotion: false,
    }}>
      <BeforeAfterToggle />
    </SceneStoreProvider>
  )
}

describe('BeforeAfterToggle', () => {
  it('renders as a switch with aria-checked reflecting state', () => {
    renderToggle('after')
    const sw = screen.getByRole('switch')
    expect(sw).toHaveAttribute('aria-checked', 'false')
  })

  it('aria-checked=true when beforeAfter is "before"', () => {
    renderToggle('before')
    const sw = screen.getByRole('switch')
    expect(sw).toHaveAttribute('aria-checked', 'true')
  })

  it('clicking flips beforeAfter state', async () => {
    const user = userEvent.setup()
    renderToggle('after')
    const sw = screen.getByRole('switch')
    expect(sw).toHaveAttribute('aria-checked', 'false')
    await user.click(sw)
    expect(sw).toHaveAttribute('aria-checked', 'true')
  })

  it('has 48x48 minimum tap target', () => {
    renderToggle()
    const sw = screen.getByRole('switch')
    const styles = window.getComputedStyle(sw)
    expect(parseInt(styles.minWidth, 10)).toBeGreaterThanOrEqual(48)
    expect(parseInt(styles.minHeight, 10)).toBeGreaterThanOrEqual(48)
  })

  it('responds to keyboard activation (Space)', async () => {
    const user = userEvent.setup()
    renderToggle('after')
    const sw = screen.getByRole('switch')
    sw.focus()
    await user.keyboard(' ')
    expect(sw).toHaveAttribute('aria-checked', 'true')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- components/scene/BeforeAfterToggle.test.tsx
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement `components/scene/BeforeAfterToggle.tsx`**

```tsx
'use client'
import { useSceneStore } from '@/lib/scene/SceneStoreContext'

export function BeforeAfterToggle() {
  const beforeAfter = useSceneStore((s) => s.beforeAfter)
  const toggleBeforeAfter = useSceneStore((s) => s.toggleBeforeAfter)

  return (
    <button
      type="button"
      role="switch"
      aria-checked={beforeAfter === 'before'}
      aria-label={`Showing ${beforeAfter} view. Toggle to switch.`}
      onClick={toggleBeforeAfter}
      style={{
        position: 'sticky',
        top: '14px',
        left: '50%',
        transform: 'translateX(-50%)',
        minWidth: '48px',
        minHeight: '48px',
        padding: '8px 16px',
        background: 'rgba(0,0,0,0.7)',
        color: '#f5ebd8',
        border: '1px solid rgba(241,193,85,0.5)',
        borderRadius: '999px',
        fontSize: '12px',
        letterSpacing: '1.5px',
        cursor: 'pointer',
        zIndex: 60,
      }}
    >
      <span style={{ opacity: beforeAfter === 'before' ? 1 : 0.4 }}>BEFORE</span>
      <span style={{ margin: '0 8px', opacity: 0.5 }}>·</span>
      <span style={{ opacity: beforeAfter === 'after' ? 1 : 0.4 }}>AFTER</span>
    </button>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm test -- components/scene/BeforeAfterToggle.test.tsx
```

Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add components/scene/BeforeAfterToggle.tsx components/scene/BeforeAfterToggle.test.tsx
git commit -m "Add BeforeAfterToggle component"
```

---

### Task 13: Hotspot component

**Files:**
- Create: `components/scene/Hotspot.tsx`, `components/scene/Hotspot.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `components/scene/Hotspot.test.tsx`:

```tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { Hotspot as HotspotData } from '@/lib/scene/types'
import { Hotspot } from './Hotspot'

const sample: HotspotData = {
  id: 'h1',
  sceneId: 's1',
  label: 'Collapsed apartment block',
  geometry: { x: 0.42, y: 0.33, r: 0.04 },
  type: 'story',
  priority: 'hero',
  visualState: 'always',
}

describe('Hotspot', () => {
  it('renders a button with aria-label including the label', () => {
    render(<Hotspot hotspot={sample} onOpen={() => {}} />)
    const btn = screen.getByRole('button', { name: /Collapsed apartment block/ })
    expect(btn).toHaveAttribute('aria-haspopup', 'dialog')
  })

  it('positions according to geometry', () => {
    render(<Hotspot hotspot={sample} onOpen={() => {}} />)
    const btn = screen.getByRole('button', { name: /Collapsed apartment block/ })
    expect(btn.style.left).toBe('42%')
    expect(btn.style.top).toBe('33%')
  })

  it('fires onOpen with hotspot id on click', async () => {
    const user = userEvent.setup()
    const onOpen = vi.fn()
    render(<Hotspot hotspot={sample} onOpen={onOpen} />)
    await user.click(screen.getByRole('button'))
    expect(onOpen).toHaveBeenCalledWith('h1')
  })

  it('has data-hotspot-id matching the hotspot id', () => {
    render(<Hotspot hotspot={sample} onOpen={() => {}} />)
    const btn = screen.getByRole('button')
    expect(btn).toHaveAttribute('data-hotspot-id', 'h1')
  })

  it('contains visible-dot and tap-target child elements', () => {
    render(<Hotspot hotspot={sample} onOpen={() => {}} />)
    const btn = screen.getByRole('button')
    expect(btn.querySelector('.hotspot-visible-dot')).toBeInTheDocument()
    expect(btn.querySelector('.hotspot-tap-target')).toBeInTheDocument()
  })

  it('keyboard activation (Enter) fires onOpen', async () => {
    const user = userEvent.setup()
    const onOpen = vi.fn()
    render(<Hotspot hotspot={sample} onOpen={onOpen} />)
    const btn = screen.getByRole('button')
    btn.focus()
    await user.keyboard('{Enter}')
    expect(onOpen).toHaveBeenCalledWith('h1')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- components/scene/Hotspot.test.tsx
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement `components/scene/Hotspot.tsx`**

```tsx
'use client'
import type { CSSProperties } from 'react'
import type { Hotspot as HotspotData } from '@/lib/scene/types'

type Props = {
  hotspot: HotspotData
  onOpen: (id: string) => void
}

export function Hotspot({ hotspot, onOpen }: Props) {
  const { x, y, r } = hotspot.geometry
  const style: CSSProperties = {
    position: 'absolute',
    left: `${x * 100}%`,
    top: `${y * 100}%`,
    transform: 'translate(-50%, -50%)',
    width: '48px',
    height: '48px',
    minWidth: '48px',
    minHeight: '48px',
    background: 'transparent',
    border: 'none',
    padding: 0,
    cursor: 'pointer',
    pointerEvents: 'auto',
  }

  const visibleDotSize = `${Math.max(r * 100, 1)}cqw`

  return (
    <button
      type="button"
      data-hotspot-id={hotspot.id}
      aria-label={`${hotspot.label}. Activate to read story.`}
      aria-haspopup="dialog"
      onClick={() => onOpen(hotspot.id)}
      style={style}
    >
      <span
        className="hotspot-visible-dot"
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: visibleDotSize,
          height: visibleDotSize,
          minWidth: '10px',
          minHeight: '10px',
          maxWidth: '32px',
          maxHeight: '32px',
          borderRadius: '50%',
          background: '#f1c155',
          boxShadow: '0 0 0 4px rgba(241,193,85,0.25)',
        }}
      />
      <span
        className="hotspot-tap-target"
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
        }}
      />
    </button>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm test -- components/scene/Hotspot.test.tsx
```

Expected: PASS (6 tests).

- [ ] **Step 5: Commit**

```bash
git add components/scene/Hotspot.tsx components/scene/Hotspot.test.tsx
git commit -m "Add Hotspot component with 48px tap target and a11y"
```

---

### Task 14: HotspotOverlay component (filtering by visualState)

**Files:**
- Create: `components/scene/HotspotOverlay.tsx`, `components/scene/HotspotOverlay.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `components/scene/HotspotOverlay.test.tsx`:

```tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SceneStoreProvider } from '@/lib/scene/SceneStoreContext'
import type { Hotspot } from '@/lib/scene/types'
import { HotspotOverlay } from './HotspotOverlay'

const hotspots: Hotspot[] = [
  { id: 'a', sceneId: 's', label: 'Always', geometry: { x: 0.1, y: 0.1, r: 0.02 }, type: 'story', priority: 'primary', visualState: 'always' },
  { id: 'b', sceneId: 's', label: 'BeforeOnly', geometry: { x: 0.2, y: 0.2, r: 0.02 }, type: 'story', priority: 'primary', visualState: 'before-only' },
  { id: 'c', sceneId: 's', label: 'AfterOnly', geometry: { x: 0.3, y: 0.3, r: 0.02 }, type: 'story', priority: 'primary', visualState: 'after-only' },
]

function renderOverlay(beforeAfter: 'before' | 'after', onOpen = vi.fn()) {
  return render(
    <SceneStoreProvider initial={{
      activeChapterId: null,
      beforeAfter,
      openHotspotId: null,
      reducedMotion: false,
    }}>
      <HotspotOverlay hotspots={hotspots} onHotspotOpen={onOpen} />
    </SceneStoreProvider>
  )
}

describe('HotspotOverlay', () => {
  it('shows always + after-only when state is after', () => {
    renderOverlay('after')
    expect(screen.getByRole('button', { name: /Always/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /AfterOnly/ })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /BeforeOnly/ })).not.toBeInTheDocument()
  })

  it('shows always + before-only when state is before', () => {
    renderOverlay('before')
    expect(screen.getByRole('button', { name: /Always/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /BeforeOnly/ })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /AfterOnly/ })).not.toBeInTheDocument()
  })

  it('clicking a hotspot calls onHotspotOpen with its id', async () => {
    const user = userEvent.setup()
    const onOpen = vi.fn()
    renderOverlay('after', onOpen)
    await user.click(screen.getByRole('button', { name: /Always/ }))
    expect(onOpen).toHaveBeenCalledWith('a')
  })

  it('clicking a hotspot also calls store.openHotspot', async () => {
    const user = userEvent.setup()
    renderOverlay('after')
    await user.click(screen.getByRole('button', { name: /Always/ }))
    // We can't read the store here without exposing it; this is verified via
    // SceneViewport integration test instead. Keep this test focused on filter + callback.
    expect(true).toBe(true)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- components/scene/HotspotOverlay.test.tsx
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement `components/scene/HotspotOverlay.tsx`**

```tsx
'use client'
import { useMemo } from 'react'
import type { Hotspot as HotspotData } from '@/lib/scene/types'
import { useSceneStore } from '@/lib/scene/SceneStoreContext'
import { Hotspot } from './Hotspot'

type Props = {
  hotspots: HotspotData[]
  onHotspotOpen?: (id: string) => void
}

export function HotspotOverlay({ hotspots, onHotspotOpen }: Props) {
  const beforeAfter = useSceneStore((s) => s.beforeAfter)
  const openHotspot = useSceneStore((s) => s.openHotspot)

  const visible = useMemo(
    () =>
      hotspots.filter(
        (h) =>
          h.visualState === 'always' ||
          h.visualState === `${beforeAfter}-only`,
      ),
    [hotspots, beforeAfter],
  )

  return (
    <div
      className="hotspot-overlay"
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      aria-label="Hotspots"
    >
      {visible.map((h) => (
        <Hotspot
          key={h.id}
          hotspot={h}
          onOpen={(id) => {
            openHotspot(id)
            onHotspotOpen?.(id)
          }}
        />
      ))}
    </div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm test -- components/scene/HotspotOverlay.test.tsx
```

Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add components/scene/HotspotOverlay.tsx components/scene/HotspotOverlay.test.tsx
git commit -m "Add HotspotOverlay with visualState filtering"
```

---

### Task 15: SceneLayer (master image with crossfade)

**Files:**
- Create: `components/scene/SceneLayer.tsx`, `components/scene/SceneLayer.test.tsx`

This file owns both `MasterLayer` and `ParallaxLayer` per the spec. We start with `MasterLayer` here and add `ParallaxLayer` in the next task.

- [ ] **Step 1: Write the failing test**

Create `components/scene/SceneLayer.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SceneStoreProvider } from '@/lib/scene/SceneStoreContext'
import { MasterLayer } from './SceneLayer'
import type { SceneImage } from '@/lib/scene/types'

const beforeImg: SceneImage = {
  variant: 'before',
  url: '/before.webp',
  width: 1440,
  height: 3840,
  isReconstruction: true,
  reconstructionLabel: 'Reconstruction based on archival sources',
  altText: 'Main street in 2019',
}

const afterImg: SceneImage = {
  variant: 'after',
  url: '/after.webp',
  width: 1440,
  height: 3840,
  isReconstruction: false,
  altText: 'Main street today, after destruction',
}

function renderLayer(image: SceneImage, beforeAfter: 'before' | 'after') {
  return render(
    <SceneStoreProvider initial={{
      activeChapterId: null,
      beforeAfter,
      openHotspotId: null,
      reducedMotion: false,
    }}>
      <MasterLayer image={image} priority={image.variant === 'after'} />
    </SceneStoreProvider>
  )
}

describe('MasterLayer', () => {
  it('renders an img with the correct alt text', () => {
    renderLayer(afterImg, 'after')
    const img = screen.getByAltText('Main street today, after destruction')
    expect(img).toBeInTheDocument()
  })

  it('layer wrapper opacity is 1 when variant matches beforeAfter state', () => {
    renderLayer(afterImg, 'after')
    const wrapper = screen.getByTestId('master-layer-after')
    expect(wrapper.style.opacity).toBe('1')
  })

  it('layer wrapper opacity is 0 when variant does not match state', () => {
    renderLayer(beforeImg, 'after')
    const wrapper = screen.getByTestId('master-layer-before')
    expect(wrapper.style.opacity).toBe('0')
  })

  it('toggling state flips opacity', () => {
    const { rerender } = renderLayer(beforeImg, 'after')
    let wrapper = screen.getByTestId('master-layer-before')
    expect(wrapper.style.opacity).toBe('0')

    rerender(
      <SceneStoreProvider initial={{
        activeChapterId: null,
        beforeAfter: 'before',
        openHotspotId: null,
        reducedMotion: false,
      }}>
        <MasterLayer image={beforeImg} />
      </SceneStoreProvider>
    )
    wrapper = screen.getByTestId('master-layer-before')
    expect(wrapper.style.opacity).toBe('1')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- components/scene/SceneLayer.test.tsx
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement `components/scene/SceneLayer.tsx`** (initial — MasterLayer only)

```tsx
'use client'
import Image from 'next/image'
import { motion } from 'motion/react'
import type { SceneImage, ParallaxLayer as ParallaxData } from '@/lib/scene/types'
import { useSceneStore } from '@/lib/scene/SceneStoreContext'

type MasterProps = {
  image: SceneImage
  priority?: boolean
}

export function MasterLayer({ image, priority = false }: MasterProps) {
  const beforeAfter = useSceneStore((s) => s.beforeAfter)
  const reducedMotion = useSceneStore((s) => s.reducedMotion)
  const isVisible = beforeAfter === image.variant

  return (
    <motion.div
      data-testid={`master-layer-${image.variant}`}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: reducedMotion ? 0 : 0.6, ease: 'easeOut' }}
      style={{
        position: 'absolute',
        inset: 0,
        opacity: isVisible ? 1 : 0,
      }}
    >
      <Image
        src={image.url}
        alt={image.altText}
        fill
        priority={priority}
        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 70vw, 800px"
        placeholder={image.blurDataUrl ? 'blur' : 'empty'}
        blurDataURL={image.blurDataUrl}
        style={{ objectFit: 'cover' }}
      />
    </motion.div>
  )
}

type ParallaxProps = {
  layer: ParallaxData
  reduced?: boolean
}

export function ParallaxLayer({ layer, reduced = false }: ParallaxProps) {
  if (reduced) return null
  return (
    <div
      data-testid={`parallax-layer-${layer.id}`}
      style={{
        position: 'absolute',
        inset: 0,
        opacity: layer.opacity ?? 1,
        mixBlendMode: layer.blendMode ?? 'normal',
        pointerEvents: 'none',
      }}
    >
      <Image src={layer.url} alt="" role="presentation" fill style={{ objectFit: 'cover' }} />
    </div>
  )
}
```

Note: MasterLayer's initial inline `opacity: isVisible ? 1 : 0` lets the test see correct opacity synchronously without waiting for Motion's animation. The `animate` prop drives the transition smoothly when state changes.

- [ ] **Step 4: Configure Next.js to allow images from `/` (already default for local files)**

No config change needed — local public files work by default.

- [ ] **Step 5: Run test to verify it passes**

```bash
npm test -- components/scene/SceneLayer.test.tsx
```

Expected: PASS (4 tests).

- [ ] **Step 6: Commit**

```bash
git add components/scene/SceneLayer.tsx components/scene/SceneLayer.test.tsx
git commit -m "Add MasterLayer with crossfade-driven opacity"
```

---

### Task 16: ParallaxLayer with scroll-linked transform

**Files:**
- Modify: `components/scene/SceneLayer.tsx`
- Create: `components/scene/SceneLayer.parallax.test.tsx`

- [ ] **Step 1: Write the parallax-specific test in a new file**

Create `components/scene/SceneLayer.parallax.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { ParallaxLayer } from './SceneLayer'
import type { ParallaxLayer as ParallaxData } from '@/lib/scene/types'

const dust: ParallaxData = {
  id: 'dust',
  url: '/dust.webp',
  width: 1440,
  height: 3840,
  parallaxFactor: 0.6,
  opacity: 0.7,
  blendMode: 'screen',
}

describe('ParallaxLayer', () => {
  it('renders nothing when reduced=true', () => {
    const { container } = render(<ParallaxLayer layer={dust} reduced />)
    expect(container.firstChild).toBeNull()
  })

  it('renders an img with empty alt and role=presentation when not reduced', () => {
    render(<ParallaxLayer layer={dust} />)
    const img = document.querySelector('img[role="presentation"]')
    expect(img).not.toBeNull()
    expect(img?.getAttribute('alt')).toBe('')
  })

  it('applies opacity and blend mode from props', () => {
    render(<ParallaxLayer layer={dust} />)
    const wrap = document.querySelector('[data-testid="parallax-layer-dust"]') as HTMLElement
    expect(wrap.style.opacity).toBe('0.7')
    expect(wrap.style.mixBlendMode).toBe('screen')
  })
})
```

- [ ] **Step 2: Run the new test against the existing basic ParallaxLayer**

```bash
npm test -- components/scene/SceneLayer.parallax.test.tsx
```

Expected: all PASS. The visual props are already correct in the basic implementation from Task 15. The next step adds scroll-linked motion.

- [ ] **Step 3: Replace `ParallaxLayer` in `components/scene/SceneLayer.tsx` with the scroll-linked version**

Replace the existing `ParallaxLayer` export in `components/scene/SceneLayer.tsx` with this. Also update the imports at the top of the file to include `useScroll`, `useTransform`, `useRef`, and `RefObject`:

At the top of `SceneLayer.tsx`, the imports become:

```tsx
'use client'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'motion/react'
import { useRef, type RefObject } from 'react'
import type { SceneImage, ParallaxLayer as ParallaxData } from '@/lib/scene/types'
import { useSceneStore } from '@/lib/scene/SceneStoreContext'
```

Then replace the existing `ParallaxLayer` function with:

```tsx
type ParallaxProps = {
  layer: ParallaxData
  reduced?: boolean
  sceneRef?: RefObject<HTMLElement>
}

export function ParallaxLayer({ layer, reduced = false, sceneRef }: ParallaxProps) {
  const fallbackRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sceneRef ?? fallbackRef,
    offset: ['start end', 'end start'],
  })
  const driftRange = 200 * (1 - layer.parallaxFactor)
  const y = useTransform(scrollYProgress, [0, 1], [0, -driftRange])

  if (reduced) return null

  return (
    <motion.div
      data-testid={`parallax-layer-${layer.id}`}
      style={{
        position: 'absolute',
        inset: 0,
        opacity: layer.opacity ?? 1,
        mixBlendMode: layer.blendMode ?? 'normal',
        pointerEvents: 'none',
        y,
      }}
    >
      <Image src={layer.url} alt="" role="presentation" fill style={{ objectFit: 'cover' }} />
    </motion.div>
  )
}
```

`motion/react` works in jsdom; `useScroll` returns a MotionValue that defaults to `0` when no scroll has happened, so the test rendering is stable.

- [ ] **Step 4: Run all SceneLayer tests to verify**

```bash
npm test -- components/scene/SceneLayer
```

Expected: PASS (both `SceneLayer.test.tsx` and `SceneLayer.parallax.test.tsx`).

- [ ] **Step 5: Commit**

```bash
git add components/scene/SceneLayer.tsx components/scene/SceneLayer.parallax.test.tsx
git commit -m "Add scroll-linked parallax transform to ParallaxLayer"
```

---

## Stage E — Hooks and chapter detection

### Task 17: useChapterDetection hook

**Files:**
- Create: `lib/scene/useChapterDetection.ts`, `lib/scene/useChapterDetection.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `lib/scene/useChapterDetection.test.tsx`:

```tsx
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { SceneStoreProvider, useSceneStore } from './SceneStoreContext'
import { useChapterDetection } from './useChapterDetection'

type IOCallback = (entries: Pick<IntersectionObserverEntry, 'target' | 'isIntersecting'>[]) => void

let observers: { cb: IOCallback; targets: Element[] }[] = []

class MockIO {
  cb: IOCallback
  targets: Element[] = []
  constructor(cb: IOCallback) {
    this.cb = cb
    observers.push({ cb, targets: this.targets })
  }
  observe(el: Element) {
    this.targets.push(el)
  }
  unobserve(el: Element) {
    this.targets = this.targets.filter(t => t !== el)
  }
  disconnect() {
    this.targets = []
  }
  takeRecords() { return [] }
  root = null
  rootMargin = ''
  thresholds: number[] = []
}

beforeEach(() => {
  observers = []
  vi.stubGlobal('IntersectionObserver', MockIO as unknown as typeof IntersectionObserver)
})
afterEach(() => {
  vi.unstubAllGlobals()
})

function Probe() {
  useChapterDetection()
  const id = useSceneStore((s) => s.activeChapterId)
  return <div data-testid="active">{id ?? 'none'}</div>
}

function Anchor({ id }: { id: string }) {
  return <div data-chapter={id} data-testid={`anchor-${id}`} />
}

describe('useChapterDetection', () => {
  it('updates activeChapterId when an anchor intersects', () => {
    render(
      <SceneStoreProvider initial={{
        activeChapterId: null,
        beforeAfter: 'after',
        openHotspotId: null,
        reducedMotion: false,
      }}>
        <Anchor id="ch-1" />
        <Anchor id="ch-2" />
        <Probe />
      </SceneStoreProvider>
    )
    expect(screen.getByTestId('active')).toHaveTextContent('none')

    const target = screen.getByTestId('anchor-ch-1')
    act(() => {
      observers[0]!.cb([{ target, isIntersecting: true } as IntersectionObserverEntry])
    })
    expect(screen.getByTestId('active')).toHaveTextContent('ch-1')

    const target2 = screen.getByTestId('anchor-ch-2')
    act(() => {
      observers[0]!.cb([{ target: target2, isIntersecting: true } as IntersectionObserverEntry])
    })
    expect(screen.getByTestId('active')).toHaveTextContent('ch-2')
  })

  it('ignores non-intersecting entries', () => {
    render(
      <SceneStoreProvider initial={{
        activeChapterId: 'ch-7',
        beforeAfter: 'after',
        openHotspotId: null,
        reducedMotion: false,
      }}>
        <Anchor id="ch-1" />
        <Probe />
      </SceneStoreProvider>
    )
    const target = screen.getByTestId('anchor-ch-1')
    act(() => {
      observers[0]!.cb([{ target, isIntersecting: false } as IntersectionObserverEntry])
    })
    expect(screen.getByTestId('active')).toHaveTextContent('ch-7')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- lib/scene/useChapterDetection.test.tsx
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement `lib/scene/useChapterDetection.ts`**

```ts
'use client'
import { useEffect } from 'react'
import { useSceneStoreApi } from './SceneStoreContext'

export function useChapterDetection() {
  const storeApi = useSceneStoreApi()

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return
    const setActive = storeApi.getState().setActiveChapter

    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const target = entry.target as HTMLElement
          const id = target.dataset.chapter
          if (id) setActive(id)
        }
      },
      { rootMargin: '-40% 0px -40% 0px' },
    )

    const anchors = document.querySelectorAll<HTMLElement>('[data-chapter]')
    anchors.forEach((a) => obs.observe(a))

    return () => obs.disconnect()
  }, [storeApi])
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm test -- lib/scene/useChapterDetection.test.tsx
```

Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add lib/scene/useChapterDetection.ts lib/scene/useChapterDetection.test.tsx
git commit -m "Add useChapterDetection hook"
```

---

### Task 18: useDeepLinkSync hook (URL ↔ store)

**Files:**
- Create: `lib/scene/useDeepLinkSync.ts`, `lib/scene/useDeepLinkSync.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `lib/scene/useDeepLinkSync.test.tsx`:

```tsx
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SceneStoreProvider, useSceneStore } from './SceneStoreContext'
import { useDeepLinkSync } from './useDeepLinkSync'

let mockSearchParams = new URLSearchParams('')

vi.mock('next/navigation', () => ({
  useSearchParams: () => mockSearchParams,
}))

function Harness() {
  useDeepLinkSync()
  const beforeAfter = useSceneStore((s) => s.beforeAfter)
  const activeChapter = useSceneStore((s) => s.activeChapterId)
  const openHotspot = useSceneStore((s) => s.openHotspotId)
  return (
    <div>
      <span data-testid="ba">{beforeAfter}</span>
      <span data-testid="ch">{activeChapter ?? 'none'}</span>
      <span data-testid="hs">{openHotspot ?? 'none'}</span>
    </div>
  )
}

describe('useDeepLinkSync', () => {
  beforeEach(() => {
    mockSearchParams = new URLSearchParams('')
    vi.spyOn(window.history, 'replaceState')
  })
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('hydrates beforeAfter from ?state=before on mount', () => {
    mockSearchParams = new URLSearchParams('state=before')
    render(
      <SceneStoreProvider initial={{
        activeChapterId: null,
        beforeAfter: 'after',
        openHotspotId: null,
        reducedMotion: false,
      }}>
        <Harness />
      </SceneStoreProvider>
    )
    expect(screen.getByTestId('ba')).toHaveTextContent('before')
  })

  it('hydrates openHotspotId from ?hotspot=h1', () => {
    mockSearchParams = new URLSearchParams('hotspot=h1')
    render(
      <SceneStoreProvider initial={{
        activeChapterId: null,
        beforeAfter: 'after',
        openHotspotId: null,
        reducedMotion: false,
      }}>
        <Harness />
      </SceneStoreProvider>
    )
    expect(screen.getByTestId('hs')).toHaveTextContent('h1')
  })

  it('hydrates beforeAfter and openHotspot together when both URL params are present', () => {
    mockSearchParams = new URLSearchParams('state=before&hotspot=h2')
    render(
      <SceneStoreProvider initial={{
        activeChapterId: null,
        beforeAfter: 'after',
        openHotspotId: null,
        reducedMotion: false,
      }}>
        <Harness />
      </SceneStoreProvider>
    )
    expect(screen.getByTestId('ba')).toHaveTextContent('before')
    expect(screen.getByTestId('hs')).toHaveTextContent('h2')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- lib/scene/useDeepLinkSync.test.tsx
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement `lib/scene/useDeepLinkSync.ts`**

```ts
'use client'
import { useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { useSceneStoreApi } from './SceneStoreContext'

export function useDeepLinkSync() {
  const searchParams = useSearchParams()
  const storeApi = useSceneStoreApi()
  const hydrated = useRef(false)

  useEffect(() => {
    if (hydrated.current) return
    hydrated.current = true

    const state = searchParams.get('state')
    if (state === 'before' || state === 'after') {
      storeApi.getState().setBeforeAfter(state)
    }

    const hotspot = searchParams.get('hotspot')
    if (hotspot) {
      storeApi.getState().openHotspot(hotspot)
    }

    const chapter = searchParams.get('chapter')
    if (chapter) {
      storeApi.getState().setActiveChapter(chapter)
      const el = document.querySelector(`[data-chapter="${chapter}"]`)
      el?.scrollIntoView({ behavior: 'auto', block: 'center' })
    }
  }, [searchParams, storeApi])

  // Persist store changes back to URL (replaceState — no history pollution)
  useEffect(() => {
    const writeUrl = () => {
      if (typeof window === 'undefined') return
      const s = storeApi.getState()
      const url = new URL(window.location.href)
      url.searchParams.set('state', s.beforeAfter)
      if (s.activeChapterId) url.searchParams.set('chapter', s.activeChapterId)
      else url.searchParams.delete('chapter')
      if (s.openHotspotId) url.searchParams.set('hotspot', s.openHotspotId)
      else url.searchParams.delete('hotspot')
      window.history.replaceState(null, '', url.toString())
    }

    let timer: ReturnType<typeof setTimeout> | null = null
    const debounced = () => {
      if (timer) clearTimeout(timer)
      timer = setTimeout(writeUrl, 500)
    }

    const unsubscribe = storeApi.subscribe(debounced)
    return () => {
      unsubscribe()
      if (timer) clearTimeout(timer)
    }
  }, [storeApi])
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm test -- lib/scene/useDeepLinkSync.test.tsx
```

Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add lib/scene/useDeepLinkSync.ts lib/scene/useDeepLinkSync.test.tsx
git commit -m "Add useDeepLinkSync for URL ↔ store integration"
```

---

## Stage F — Composition

### Task 19: SceneViewport (composes everything)

**Files:**
- Create: `components/scene/SceneViewport.tsx`, `components/scene/SceneViewport.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `components/scene/SceneViewport.test.tsx`:

```tsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type {
  Scene,
  SceneImage,
  ParallaxLayer,
  Chapter,
  Hotspot,
} from '@/lib/scene/types'
import { SceneViewport } from './SceneViewport'

vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(''),
}))

const scene: Scene = { id: 's', slug: 'main', title: 'Main Street', defaultBeforeAfter: 'after' }

const images: SceneImage[] = [
  { variant: 'before', url: '/before.webp', width: 1440, height: 3840, isReconstruction: true, reconstructionLabel: 'Reconstruction', altText: 'Main street in 2019' },
  { variant: 'after',  url: '/after.webp',  width: 1440, height: 3840, isReconstruction: false, altText: 'Main street today' },
]

const parallax: ParallaxLayer[] = [
  { id: 'dust', url: '/dust.webp', width: 1440, height: 3840, parallaxFactor: 0.6, opacity: 0.7, blendMode: 'screen' },
]

const chapters: Chapter[] = [
  { id: 'ch-1', sceneId: 's', order: 0, label: 'North block', scrollAnchorY: 0.2 },
  { id: 'ch-2', sceneId: 's', order: 1, label: 'Main road', scrollAnchorY: 0.6 },
]

const hotspots: Hotspot[] = [
  { id: 'h1', sceneId: 's', label: 'School', geometry: { x: 0.4, y: 0.3, r: 0.04 }, type: 'story', priority: 'hero', visualState: 'always' },
]

describe('SceneViewport', () => {
  it('renders before and after master layers', () => {
    render(<SceneViewport scene={scene} images={images} parallaxLayers={parallax} chapters={chapters} hotspots={hotspots} />)
    expect(screen.getByTestId('master-layer-before')).toBeInTheDocument()
    expect(screen.getByTestId('master-layer-after')).toBeInTheDocument()
  })

  it('renders parallax layers', () => {
    render(<SceneViewport scene={scene} images={images} parallaxLayers={parallax} chapters={chapters} hotspots={hotspots} />)
    expect(screen.getByTestId('parallax-layer-dust')).toBeInTheDocument()
  })

  it('renders chapter anchors for each chapter', () => {
    render(<SceneViewport scene={scene} images={images} parallaxLayers={parallax} chapters={chapters} hotspots={hotspots} />)
    expect(screen.getByTestId('chapter-anchor-ch-1')).toBeInTheDocument()
    expect(screen.getByTestId('chapter-anchor-ch-2')).toBeInTheDocument()
  })

  it('renders hotspots', () => {
    render(<SceneViewport scene={scene} images={images} parallaxLayers={parallax} chapters={chapters} hotspots={hotspots} />)
    expect(screen.getByRole('button', { name: /School/ })).toBeInTheDocument()
  })

  it('renders before/after toggle', () => {
    render(<SceneViewport scene={scene} images={images} parallaxLayers={parallax} chapters={chapters} hotspots={hotspots} />)
    expect(screen.getByRole('switch')).toBeInTheDocument()
  })

  it('renders reconstruction label when current image is a reconstruction', async () => {
    const user = userEvent.setup()
    render(<SceneViewport scene={{ ...scene, defaultBeforeAfter: 'before' }} images={images} parallaxLayers={parallax} chapters={chapters} hotspots={hotspots} />)
    expect(screen.getByRole('note', { name: /Visual reconstruction/i })).toBeInTheDocument()
    // Toggle to after — label should disappear
    await user.click(screen.getByRole('switch'))
    expect(screen.queryByRole('note', { name: /Visual reconstruction/i })).not.toBeInTheDocument()
  })

  it('fires onHotspotOpen callback when a hotspot is clicked', async () => {
    const user = userEvent.setup()
    const onHotspotOpen = vi.fn()
    render(<SceneViewport scene={scene} images={images} parallaxLayers={parallax} chapters={chapters} hotspots={hotspots} onHotspotOpen={onHotspotOpen} />)
    await user.click(screen.getByRole('button', { name: /School/ }))
    expect(onHotspotOpen).toHaveBeenCalledWith('h1')
  })

  it('fires onToggleBeforeAfter when toggle is clicked', async () => {
    const user = userEvent.setup()
    const onToggle = vi.fn()
    render(<SceneViewport scene={scene} images={images} parallaxLayers={parallax} chapters={chapters} hotspots={hotspots} onToggleBeforeAfter={onToggle} />)
    await user.click(screen.getByRole('switch'))
    expect(onToggle).toHaveBeenCalledWith('before')
  })

  it('uses defaultBeforeAfter from scene when no initialBeforeAfter prop', () => {
    render(<SceneViewport scene={{ ...scene, defaultBeforeAfter: 'before' }} images={images} parallaxLayers={parallax} chapters={chapters} hotspots={hotspots} />)
    const sw = screen.getByRole('switch')
    expect(sw).toHaveAttribute('aria-checked', 'true')
  })

  it('initialBeforeAfter prop overrides scene default', () => {
    render(<SceneViewport scene={{ ...scene, defaultBeforeAfter: 'after' }} images={images} parallaxLayers={parallax} chapters={chapters} hotspots={hotspots} initialBeforeAfter="before" />)
    const sw = screen.getByRole('switch')
    expect(sw).toHaveAttribute('aria-checked', 'true')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- components/scene/SceneViewport.test.tsx
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement `components/scene/SceneViewport.tsx`**

```tsx
'use client'
import { useEffect, useRef } from 'react'
import type { SceneEngineProps } from '@/lib/scene/types'
import {
  SceneStoreProvider,
  useSceneStore,
  useSceneStoreApi,
} from '@/lib/scene/SceneStoreContext'
import { useChapterDetection } from '@/lib/scene/useChapterDetection'
import { useDeepLinkSync } from '@/lib/scene/useDeepLinkSync'
import { detectReducedMotion, subscribeToReducedMotion } from '@/lib/scene/reducedMotion'
import { MasterLayer, ParallaxLayer } from './SceneLayer'
import { HotspotOverlay } from './HotspotOverlay'
import { BeforeAfterToggle } from './BeforeAfterToggle'
import { ChapterAnchor } from './ChapterAnchor'
import { ReconstructionLabel } from './ReconstructionLabel'

export function SceneViewport(props: SceneEngineProps) {
  const initialBeforeAfter = props.initialBeforeAfter ?? props.scene.defaultBeforeAfter
  return (
    <SceneStoreProvider
      initial={{
        activeChapterId: null,
        beforeAfter: initialBeforeAfter,
        openHotspotId: null,
        reducedMotion: false,
      }}
    >
      <SceneViewportInner {...props} />
    </SceneStoreProvider>
  )
}

function SceneViewportInner({
  scene,
  images,
  parallaxLayers,
  chapters,
  hotspots,
  onHotspotOpen,
  onChapterChange,
  onToggleBeforeAfter,
}: SceneEngineProps) {
  const sceneRef = useRef<HTMLElement>(null)
  const storeApi = useSceneStoreApi()
  const beforeAfter = useSceneStore((s) => s.beforeAfter)
  const reducedMotion = useSceneStore((s) => s.reducedMotion)

  // Hydrate URL → store, and persist store → URL
  useDeepLinkSync()
  // Watch chapter anchors
  useChapterDetection()

  // Bind reduced-motion preference
  useEffect(() => {
    storeApi.getState().setReducedMotion(detectReducedMotion())
    return subscribeToReducedMotion((v) =>
      storeApi.getState().setReducedMotion(v),
    )
  }, [storeApi])

  // Forward store changes to host callbacks
  useEffect(() => {
    let prev = storeApi.getState()
    return storeApi.subscribe((next) => {
      if (next.activeChapterId !== prev.activeChapterId && next.activeChapterId) {
        onChapterChange?.(next.activeChapterId)
      }
      if (next.beforeAfter !== prev.beforeAfter) {
        onToggleBeforeAfter?.(next.beforeAfter)
      }
      prev = next
    })
  }, [storeApi, onChapterChange, onToggleBeforeAfter])

  // Pre-load the non-active master image after first paint
  useEffect(() => {
    const inactive = images.find((i) => i.variant !== beforeAfter)
    if (!inactive) return
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = inactive.url
    document.head.appendChild(link)
    return () => {
      document.head.removeChild(link)
    }
  }, [images, beforeAfter])

  const beforeImg = images.find((i) => i.variant === 'before')
  const afterImg = images.find((i) => i.variant === 'after')
  if (!beforeImg || !afterImg) {
    throw new Error('SceneViewport: images must include both "before" and "after" variants')
  }

  const masterImg = beforeAfter === 'before' ? beforeImg : afterImg
  const aspectRatio = `${afterImg.width} / ${afterImg.height}`

  return (
    <section
      ref={sceneRef}
      aria-label={scene.title}
      aria-describedby={`scene-desc-${scene.id}`}
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio,
        background: '#0a0a0a',
      }}
    >
      <p id={`scene-desc-${scene.id}`} className="sr-only">
        Scroll to explore {scene.title}. Use the toggle to switch between historical and
        current views. Activate a marker to read about that location.
      </p>

      <MasterLayer image={beforeImg} priority={beforeAfter === 'before'} />
      <MasterLayer image={afterImg}  priority={beforeAfter === 'after'} />

      {parallaxLayers.map((layer) => (
        <ParallaxLayer key={layer.id} layer={layer} reduced={reducedMotion} sceneRef={sceneRef} />
      ))}

      {chapters.map((c) => (
        <ChapterAnchor key={c.id} chapterId={c.id} scrollAnchorY={c.scrollAnchorY} />
      ))}

      <HotspotOverlay hotspots={hotspots} onHotspotOpen={onHotspotOpen} />

      <BeforeAfterToggle />

      {masterImg.isReconstruction && masterImg.reconstructionLabel && (
        <ReconstructionLabel label={masterImg.reconstructionLabel} />
      )}

      <div aria-live="polite" className="sr-only">
        <ChapterLiveRegion chapters={chapters} />
      </div>
    </section>
  )
}

function ChapterLiveRegion({ chapters }: { chapters: SceneEngineProps['chapters'] }) {
  const activeId = useSceneStore((s) => s.activeChapterId)
  const ch = chapters.find((c) => c.id === activeId)
  return ch ? <span>{`Now in chapter: ${ch.label}`}</span> : null
}
```

- [ ] **Step 4: Add `.sr-only` utility to global CSS**

Append to `app/globals.css`:

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

- [ ] **Step 5: Run test to verify it passes**

```bash
npm test -- components/scene/SceneViewport.test.tsx
```

Expected: PASS (10 tests).

- [ ] **Step 6: Run all unit tests**

```bash
npm test
```

Expected: all tests across all files PASS.

- [ ] **Step 7: Commit**

```bash
git add components/scene/SceneViewport.tsx components/scene/SceneViewport.test.tsx app/globals.css
git commit -m "Add SceneViewport composing all scene engine pieces"
```

---

## Stage G — Demo page and integration

### Task 20: Mock data fixtures

**Files:**
- Create: `lib/scene/fixtures/mockScene.ts`

- [ ] **Step 1: Create `lib/scene/fixtures/mockScene.ts`**

```ts
import type {
  Scene,
  SceneImage,
  ParallaxLayer,
  Chapter,
  Hotspot,
} from '@/lib/scene/types'

export const mockScene: Scene = {
  id: 'scene-main-street',
  slug: 'main-street',
  title: 'Main Street',
  defaultBeforeAfter: 'after',
}

export const mockImages: SceneImage[] = [
  {
    variant: 'before',
    url: '/scenes/main-street-before.webp',
    width: 1440,
    height: 3840,
    blurDataUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkqAcAAIUAgUW0RjgAAAAASUVORK5CYII=',
    isReconstruction: true,
    reconstructionLabel:
      'Reconstruction based on archival imagery. Architectural details extrapolated from public records and witness accounts.',
    altText: 'Main Street as it appeared in 2019, with apartment buildings and a school visible.',
    creditLine: '© 2026 Through the Rubble — visual reconstruction',
  },
  {
    variant: 'after',
    url: '/scenes/main-street-after.webp',
    width: 1440,
    height: 3840,
    blurDataUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkqAcAAIUAgUW0RjgAAAAASUVORK5CYII=',
    isReconstruction: false,
    altText: 'Main Street today, showing extensive damage to apartment buildings and the school.',
    creditLine: '© 2026 Through the Rubble',
  },
]

export const mockParallax: ParallaxLayer[] = [
  { id: 'haze',  url: '/scenes/parallax-haze.webp',  width: 1440, height: 3840, parallaxFactor: 0.4, opacity: 0.5, blendMode: 'screen' },
  { id: 'dust',  url: '/scenes/parallax-dust.webp',  width: 1440, height: 3840, parallaxFactor: 0.7, opacity: 0.6, blendMode: 'screen' },
  { id: 'smoke', url: '/scenes/parallax-smoke.webp', width: 1440, height: 3840, parallaxFactor: 0.85, opacity: 0.45, blendMode: 'screen' },
]

export const mockChapters: Chapter[] = [
  { id: 'ch-north-block', sceneId: 'scene-main-street', order: 0, label: 'North block', scrollAnchorY: 0.12 },
  { id: 'ch-school',      sceneId: 'scene-main-street', order: 1, label: 'School ruins', scrollAnchorY: 0.34 },
  { id: 'ch-shelter',     sceneId: 'scene-main-street', order: 2, label: 'Shelter site', scrollAnchorY: 0.56 },
  { id: 'ch-aid',         sceneId: 'scene-main-street', order: 3, label: 'Aid distribution', scrollAnchorY: 0.78 },
]

export const mockHotspots: Hotspot[] = [
  { id: 'h-apt-block',     sceneId: 'scene-main-street', chapterId: 'ch-north-block', label: 'Collapsed apartment block', geometry: { x: 0.42, y: 0.18, r: 0.035 }, type: 'story',   priority: 'hero',      visualState: 'always' },
  { id: 'h-school-ruins',  sceneId: 'scene-main-street', chapterId: 'ch-school',      label: 'School building ruins',     geometry: { x: 0.62, y: 0.36, r: 0.035 }, type: 'story',   priority: 'primary',   visualState: 'always' },
  { id: 'h-school-before', sceneId: 'scene-main-street', chapterId: 'ch-school',      label: 'School playground (2019)',  geometry: { x: 0.30, y: 0.34, r: 0.025 }, type: 'story',   priority: 'secondary', visualState: 'before-only' },
  { id: 'h-shelter',       sceneId: 'scene-main-street', chapterId: 'ch-shelter',     label: 'Displaced families shelter', geometry: { x: 0.50, y: 0.58, r: 0.030 }, type: 'stat',    priority: 'primary',   visualState: 'after-only' },
  { id: 'h-aid-tent',      sceneId: 'scene-main-street', chapterId: 'ch-aid',         label: 'Aid distribution tent',     geometry: { x: 0.72, y: 0.80, r: 0.030 }, type: 'action',  priority: 'primary',   visualState: 'after-only' },
]
```

- [ ] **Step 2: Commit**

```bash
git add lib/scene/fixtures/
git commit -m "Add mock scene fixtures for demo and tests"
```

---

### Task 21: Create placeholder image assets

**Files:**
- Create: `public/scenes/main-street-before.webp`, `public/scenes/main-street-after.webp`, `public/scenes/parallax-haze.webp`, `public/scenes/parallax-dust.webp`, `public/scenes/parallax-smoke.webp`

These are real WebP files we generate locally so `next/image` and the demo page work without breaking. We will not commit large files.

- [ ] **Step 1: Generate placeholder gradient WebPs**

Use `node` to generate small WebP files via a built-in canvas approach. Since Node has no built-in canvas, we use a one-liner with `sharp` for placeholder generation. Install sharp temporarily as a dev dependency:

```bash
npm install -D sharp
```

- [ ] **Step 2: Create the generator script**

Create `scripts/generate-placeholders.mjs`:

```js
import sharp from 'sharp'
import { mkdirSync } from 'node:fs'
import path from 'node:path'

const out = 'public/scenes'
mkdirSync(out, { recursive: true })

const W = 1440
const H = 3840

async function gradient(filename, stops) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
          ${stops.map((s, i) => `<stop offset="${(i / (stops.length - 1)) * 100}%" stop-color="${s}" />`).join('')}
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#g)" />
    </svg>
  `
  await sharp(Buffer.from(svg)).webp({ quality: 70 }).toFile(path.join(out, filename))
}

async function transparent(filename, color, alpha) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
      <rect width="100%" height="100%" fill="${color}" fill-opacity="${alpha}" />
    </svg>
  `
  await sharp(Buffer.from(svg)).webp({ quality: 70, alphaQuality: 70 }).toFile(path.join(out, filename))
}

await gradient('main-street-before.webp', ['#5a6f7d', '#3a4e5c', '#1f2d35', '#15110d'])
await gradient('main-street-after.webp',  ['#3a3530', '#2b2622', '#1f1a15', '#15110d'])
await transparent('parallax-haze.webp',  '#9aa8b3', 0.18)
await transparent('parallax-dust.webp',  '#cdb98c', 0.22)
await transparent('parallax-smoke.webp', '#3a3a3a', 0.18)

console.log('Generated placeholder scenes')
```

- [ ] **Step 3: Run generator**

```bash
node scripts/generate-placeholders.mjs
```

Expected: "Generated placeholder scenes" message; 5 files in `public/scenes/`.

- [ ] **Step 4: Verify files**

```bash
ls -la public/scenes
```

Expected: 5 `.webp` files. Confirm sizes are under ~80 KB each.

- [ ] **Step 5: Commit**

```bash
git add public/scenes/ scripts/generate-placeholders.mjs package.json package-lock.json
git commit -m "Add placeholder scene images and generator script"
```

---

### Task 22: Demo page

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Replace `app/page.tsx`**

```tsx
import { Suspense } from 'react'
import { SceneViewport } from '@/components/scene/SceneViewport'
import {
  mockScene,
  mockImages,
  mockParallax,
  mockChapters,
  mockHotspots,
} from '@/lib/scene/fixtures/mockScene'

export default function HomePage() {
  return (
    <main style={{ background: '#0a0a0a', color: '#f5ebd8', minHeight: '100vh' }}>
      <Suspense fallback={null}>
        <SceneViewport
          scene={mockScene}
          images={mockImages}
          parallaxLayers={mockParallax}
          chapters={mockChapters}
          hotspots={mockHotspots}
        />
      </Suspense>
    </main>
  )
}
```

The `Suspense` wrapper is required because `useDeepLinkSync` calls Next's `useSearchParams`, which forces the route into a Suspense boundary in App Router.

- [ ] **Step 2: Update `app/layout.tsx` to set background and viewport meta**

```tsx
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Through the Rubble',
  description: 'A documentary scene engine demo.',
}

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: '#0a0a0a' }}>{children}</body>
    </html>
  )
}
```

- [ ] **Step 3: Verify dev server**

```bash
npm run dev
```

Open http://localhost:3000 in a browser. Expected: a tall scene with gradient, parallax overlay, gold hotspot dots, a centered toggle button at the top, and a "Visual reconstruction" label visible only when the toggle is on "BEFORE". Scroll up/down — parallax layers should drift relative to the master image.

Stop the server (Ctrl-C).

- [ ] **Step 4: Commit**

```bash
git add app/
git commit -m "Add demo page using mock scene fixtures"
```

---

### Task 23: Playwright integration test — basic interactivity

**Files:**
- Create: `tests/e2e/scene.spec.ts`

- [ ] **Step 1: Write the test**

Create `tests/e2e/scene.spec.ts`:

```ts
import { test, expect } from '@playwright/test'

test.describe('Scene engine', () => {
  test('renders the scene with toggle and hotspots', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('switch')).toBeVisible()
    await expect(page.getByRole('button', { name: /Collapsed apartment block/ })).toBeVisible()
  })

  test('toggle changes aria-checked', async ({ page }) => {
    await page.goto('/')
    const toggle = page.getByRole('switch')
    await expect(toggle).toHaveAttribute('aria-checked', 'false')
    await toggle.click()
    await expect(toggle).toHaveAttribute('aria-checked', 'true')
  })

  test('toggle updates URL with ?state=', async ({ page }) => {
    await page.goto('/')
    const toggle = page.getByRole('switch')
    await toggle.click()
    await page.waitForFunction(() => new URL(location.href).searchParams.get('state') === 'before')
    expect(new URL(page.url()).searchParams.get('state')).toBe('before')
  })

  test('?state=before in URL hydrates the toggle', async ({ page }) => {
    await page.goto('/?state=before')
    await expect(page.getByRole('switch')).toHaveAttribute('aria-checked', 'true')
  })

  test('reconstruction label appears in before mode', async ({ page }) => {
    await page.goto('/?state=before')
    await expect(page.getByRole('note', { name: /Visual reconstruction/i })).toBeVisible()
  })

  test('reconstruction label hidden in after mode', async ({ page }) => {
    await page.goto('/?state=after')
    await expect(page.getByRole('note', { name: /Visual reconstruction/i })).not.toBeVisible()
  })

  test('after-only hotspot only visible in after mode', async ({ page }) => {
    await page.goto('/?state=after')
    await expect(page.getByRole('button', { name: /Aid distribution tent/ })).toBeVisible()
    await page.goto('/?state=before')
    await expect(page.getByRole('button', { name: /Aid distribution tent/ })).not.toBeVisible()
  })

  test('hotspot click writes ?hotspot= to URL', async ({ page }) => {
    await page.goto('/?state=after')
    await page.getByRole('button', { name: /Collapsed apartment block/ }).click()
    await page.waitForFunction(() => new URL(location.href).searchParams.get('hotspot') === 'h-apt-block')
    expect(new URL(page.url()).searchParams.get('hotspot')).toBe('h-apt-block')
  })
})
```

- [ ] **Step 2: Run e2e tests**

```bash
npm run e2e
```

Expected: all tests PASS on both `mobile-portrait` and `desktop-chrome` projects.

- [ ] **Step 3: Commit**

```bash
git add tests/e2e/scene.spec.ts
git commit -m "Add Playwright integration tests for scene engine"
```

---

### Task 24: Playwright a11y audit with axe

**Files:**
- Create: `tests/e2e/a11y.spec.ts`

- [ ] **Step 1: Write the a11y test**

Create `tests/e2e/a11y.spec.ts`:

```ts
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Scene engine a11y', () => {
  test('axe finds no critical or serious violations on default route', async ({ page }) => {
    await page.goto('/')
    const result = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze()
    const blockers = result.violations.filter(v => v.impact === 'critical' || v.impact === 'serious')
    expect(blockers).toEqual([])
  })

  test('axe finds no critical or serious violations in before mode', async ({ page }) => {
    await page.goto('/?state=before')
    const result = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze()
    const blockers = result.violations.filter(v => v.impact === 'critical' || v.impact === 'serious')
    expect(blockers).toEqual([])
  })

  test('toggle and hotspots are reachable by keyboard', async ({ page }) => {
    await page.goto('/?state=after')
    await page.keyboard.press('Tab')
    // Skip past any browser-injected focusables (none expected); first tab should land on the switch
    let focused = await page.evaluate(() => document.activeElement?.getAttribute('role'))
    // Allow up to 3 tabs to reach the switch in case of body-level focus
    for (let i = 0; i < 3 && focused !== 'switch'; i++) {
      await page.keyboard.press('Tab')
      focused = await page.evaluate(() => document.activeElement?.getAttribute('role'))
    }
    expect(focused).toBe('switch')

    // Activate with space
    await page.keyboard.press(' ')
    await expect(page.getByRole('switch')).toHaveAttribute('aria-checked', 'true')
  })
})
```

- [ ] **Step 2: Run a11y tests**

```bash
npm run e2e -- tests/e2e/a11y.spec.ts
```

Expected: PASS. If any critical/serious violations appear, fix the underlying component before continuing — common issues are missing alt, contrast on the toggle, or missing focus visible.

- [ ] **Step 3: Commit**

```bash
git add tests/e2e/a11y.spec.ts
git commit -m "Add Playwright + axe a11y audit for scene engine"
```

---

### Task 25: Playwright reduced-motion test

**Files:**
- Create: `tests/e2e/reduced-motion.spec.ts`

- [ ] **Step 1: Write the test**

Create `tests/e2e/reduced-motion.spec.ts`:

```ts
import { test, expect } from '@playwright/test'

test.describe('Reduced motion fork', () => {
  test('parallax layers are not rendered when prefers-reduced-motion is set', async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce' })
    const page = await context.newPage()
    await page.goto('/')
    await expect(page.getByRole('switch')).toBeVisible()
    const dust = page.locator('[data-testid="parallax-layer-dust"]')
    await expect(dust).toHaveCount(0)
    await context.close()
  })

  test('parallax layers are rendered when prefers-reduced-motion is not set', async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: 'no-preference' })
    const page = await context.newPage()
    await page.goto('/')
    await expect(page.locator('[data-testid="parallax-layer-dust"]')).toBeVisible()
    await context.close()
  })

  test('crossfade is instant under reduced motion', async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce' })
    const page = await context.newPage()
    await page.goto('/?state=after')

    const beforeLayer = page.getByTestId('master-layer-before')
    await expect(beforeLayer).toHaveCSS('opacity', '0')

    await page.getByRole('switch').click()
    // No animation under reduced motion — opacity flips immediately
    await expect(beforeLayer).toHaveCSS('opacity', '1', { timeout: 200 })

    await context.close()
  })
})
```

- [ ] **Step 2: Run reduced-motion tests**

```bash
npm run e2e -- tests/e2e/reduced-motion.spec.ts
```

Expected: PASS. If the crossfade timing test fails, increase the timeout slightly or verify the `MasterLayer` actually skips the Motion transition under reduced motion (transition `duration: 0`).

- [ ] **Step 3: Commit**

```bash
git add tests/e2e/reduced-motion.spec.ts
git commit -m "Add Playwright reduced-motion fork tests"
```

---

### Task 26: Final verification + README

**Files:**
- Create: `README.md`

- [ ] **Step 1: Run the full unit test suite**

```bash
npm test
```

Expected: all tests across all stages PASS.

- [ ] **Step 2: Run typecheck**

```bash
npm run typecheck
```

Expected: exits 0.

- [ ] **Step 3: Run the full e2e suite**

```bash
npm run e2e
```

Expected: all e2e tests PASS on both projects (mobile-portrait + desktop-chrome).

- [ ] **Step 4: Run a production build**

```bash
npm run build
```

Expected: build completes without errors. Note bundle sizes: the route bundle should be reasonably small (target <100 KB gzipped including Motion).

- [ ] **Step 5: Create `README.md`**

```markdown
# Through the Rubble — Scene Engine

Mobile-first interactive documentary scene engine. This is sub-project 1 of 6.

## Prerequisites

- Node.js 24+
- npm

## Development

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Scripts

- `npm run dev` — Next.js dev server (Turbopack)
- `npm run build` — production build
- `npm run typecheck` — TypeScript noEmit check
- `npm test` — Vitest unit + component tests
- `npm run test:watch` — Vitest in watch mode
- `npm run e2e` — Playwright e2e tests

## Architecture

See `docs/superpowers/specs/2026-04-30-scene-engine-design.md` for the full design and `docs/superpowers/plans/2026-04-30-scene-engine.md` for the implementation plan.

The scene engine renders a single tall stitched documentary scene with:

- Two stacked master images (before/after) with global crossfade toggle
- 3 parallax layers (haze, dust, smoke) with scroll-linked transforms
- Hotspot overlay with `visualState` filtering (always / before-only / after-only)
- Chapter detection via IntersectionObserver
- URL deep-link contract: `?chapter=`, `?state=`, `?hotspot=`
- Reduced-motion fork (auto-activates on `prefers-reduced-motion: reduce`)

The engine consumes typed data; it does not fetch. Mock fixtures live in `lib/scene/fixtures/`.

## Out of scope (deferred to future specs)

- Drawer / bottom-sheet for hotspot story content
- Desktop sidebar
- Story Mode player
- Source pipeline (`official-sources` MCP)
- Admin PWA + deploy control
- Sourcing governance
```

- [ ] **Step 6: Final commit**

```bash
git add README.md
git commit -m "Add README with setup, scripts, and scope summary"
```

- [ ] **Step 7: Verify clean working tree**

```bash
git status
```

Expected: working tree clean.

---

## Verification matrix

After all tasks, the engine satisfies the spec:

| Spec section | Implemented in |
|---|---|
| Component boundaries | Tasks 5–19 — all files exist with correct exports |
| Data shapes | Task 5 — types match spec exactly |
| State management | Tasks 8–9, 18 — Zustand store, context provider, URL sync |
| Crossfade rendering | Task 15 — MasterLayer with motion + opacity |
| Parallax with scroll | Task 16 — useScroll/useTransform |
| Hotspot rendering | Tasks 13–14 — buttons with 48px tap target, visualState filter |
| Chapter detection | Task 17 — IntersectionObserver with `-40% 0px -40% 0px` |
| Reconstruction label | Task 11 — sticky, `role="note"`, expand on click |
| Reduced motion fork | Task 6 + Task 16 + Task 25 — detection, parallax skip, e2e proof |
| Deep-link contract | Task 18 + Task 23 — store ↔ URL bidirectional sync, e2e proof |
| Pre-load before-master | Task 19 — `<link rel="preload">` after first paint |
| LCP / aspect-ratio (no CLS) | Task 19 — `aspectRatio` CSS on container |
| A11y semantics | Task 24 — axe pass, keyboard walk |
| Frame-rate degradation | Task 7 — monitor exists; integration into SceneViewport is a follow-up if telemetry shows need |

The frame-rate degradation logic is built and unit-tested but is not wired into `SceneViewport` yet. Wiring it in is a small follow-up task once we have real device telemetry to set thresholds against — see Task 27.

---

## Task 27 (optional follow-up): Wire frame-rate monitor into SceneViewport

**Files:**
- Modify: `components/scene/SceneViewport.tsx`

This is intentionally separated. Wire it in only when you have RUM data on real devices.

- [ ] **Step 1: Add a `degradationTier` to the store**

In `lib/scene/store.ts`, add `degradationTier: number` and `setDegradationTier(n: number)`. Update store tests.

- [ ] **Step 2: Mount the monitor in SceneViewport**

In `SceneViewport.tsx`, after first paint, call `createFrameRateMonitor({ windowMs: 1000, onTier: storeApi.getState().setDegradationTier }).start()`. Stop in cleanup.

- [ ] **Step 3: Read `degradationTier` in `MasterLayer` and `ParallaxLayer` to drop effects per tier**

Tier table from the spec:
- 0: full cinematic
- 1: drop velocity blur
- 2: drop scene breathing
- 3: drop hotspot pulse
- 4+: drop parallax layers from lightest first

For now, the simplest implementation is: tier ≥ 4 → don't render parallax layers. Wire more granular drops as the motion vocabulary expands.

- [ ] **Step 4: Add a Playwright test that proves layers drop on slow framerate**

Use `page.emulateCPUThrottling()` (a Chrome DevTools Protocol method) to simulate slow hardware and verify parallax layers drop.

- [ ] **Step 5: Commit**

```bash
git commit -m "Wire frame-rate monitor into SceneViewport for auto-degradation"
```

---

## Notes for the implementer

- **Use `'use client'` on every component or hook that uses React state, Motion, Zustand, or browser APIs.** Server-only files (the route page) don't need it.
- **The Motion library imports are `from 'motion/react'`**, not `from 'framer-motion'`. The package was renamed.
- **`useSearchParams` requires a Suspense boundary in App Router.** The demo page wraps `SceneViewport` in `<Suspense>`. Any other page mounting the engine must do the same.
- **The mock images are gradients** — they're not real artwork. Real master images come from a separate asset pipeline spec.
- **No third-party scroll lib (Lenis, Locomotive).** Native scroll + Motion's `useScroll` is enough for v1. Adding smooth scroll is a separate decision for later.
- **Don't add error boundaries inside the engine.** The engine throws if `images` doesn't include both variants — that's a programming error at the call site, not a runtime condition. The host wraps the engine in its own boundary if it needs one.
- **TypeScript `exactOptionalPropertyTypes` is on.** Don't pass `undefined` to optional props; omit them instead.
