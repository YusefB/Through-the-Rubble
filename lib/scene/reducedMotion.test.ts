import { describe, it, expect, vi, afterEach } from 'vitest'
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

  it('detectReducedMotion returns false when matchMedia is unavailable', () => {
    vi.stubGlobal('matchMedia', undefined)
    expect(detectReducedMotion()).toBe(false)
  })
})
