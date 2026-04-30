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
