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
- `node scripts/generate-placeholders.mjs` — regenerate placeholder scene images

## Architecture

See [`docs/superpowers/specs/2026-04-30-scene-engine-design.md`](docs/superpowers/specs/2026-04-30-scene-engine-design.md) for the full design and [`docs/superpowers/plans/2026-04-30-scene-engine.md`](docs/superpowers/plans/2026-04-30-scene-engine.md) for the implementation plan.

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
