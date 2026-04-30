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
    tickFrames(60, 16)
    expect(onTier).toHaveBeenLastCalledWith(0)
    m.stop()
  })

  it('reports tier 1 when avg frame time exceeds ~18ms', () => {
    const onTier = vi.fn()
    const m = createFrameRateMonitor({ windowMs: 1000, onTier })
    m.start()
    tickFrames(60, 22)
    expect(onTier).toHaveBeenLastCalledWith(1)
    m.stop()
  })

  it('escalates tiers as frame time worsens', () => {
    const onTier = vi.fn()
    const m = createFrameRateMonitor({ windowMs: 1000, onTier })
    m.start()
    tickFrames(60, 30)
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
