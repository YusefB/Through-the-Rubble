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
      observers[0]!.cb([{ target, isIntersecting: true } as unknown as IntersectionObserverEntry])
    })
    expect(screen.getByTestId('active')).toHaveTextContent('ch-1')

    const target2 = screen.getByTestId('anchor-ch-2')
    act(() => {
      observers[0]!.cb([{ target: target2, isIntersecting: true } as unknown as IntersectionObserverEntry])
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
      observers[0]!.cb([{ target, isIntersecting: false } as unknown as IntersectionObserverEntry])
    })
    expect(screen.getByTestId('active')).toHaveTextContent('ch-7')
  })
})
