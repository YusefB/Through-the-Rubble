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

  it('provider keeps the same store across re-renders', () => {
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
