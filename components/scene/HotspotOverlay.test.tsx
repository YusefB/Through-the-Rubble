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
})
