import { describe, it, expect } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SceneStoreProvider } from '@/lib/scene/SceneStoreContext'
import type { Hotspot } from '@/lib/scene/types'
import { HotspotDrawer } from './HotspotDrawer'

const hotspots: Hotspot[] = [
  {
    id: 'h-with-drawer',
    sceneId: 's',
    label: 'Hotspot with drawer',
    geometry: { x: 0.1, y: 0.1, r: 0.02 },
    type: 'story',
    priority: 'primary',
    visualState: 'always',
    drawer: {
      title: 'Drawer title',
      summary: 'Drawer summary text',
      body: 'Drawer body text',
      sources: [
        { publisher: 'ReliefWeb', title: 'Source one', url: 'https://example.org/one' },
        { publisher: 'UN OCHA', title: 'Source two', url: 'https://example.org/two' },
      ],
      action: {
        category: 'donate',
        label: 'Donate now',
        url: 'https://example.org/donate',
      },
    },
  },
  {
    id: 'h-without-action',
    sceneId: 's',
    label: 'No action hotspot',
    geometry: { x: 0.2, y: 0.2, r: 0.02 },
    type: 'story',
    priority: 'primary',
    visualState: 'always',
    drawer: {
      title: 'No action title',
      summary: 'Summary',
      body: 'Body',
      sources: [],
    },
  },
]

function renderDrawer(openHotspotId: string | null = null, reducedMotion = true) {
  return render(
    <SceneStoreProvider initial={{
      activeChapterId: null,
      beforeAfter: 'after',
      openHotspotId,
      reducedMotion,
    }}>
      <button data-hotspot-id="h-with-drawer">trigger</button>
      <HotspotDrawer hotspots={hotspots} />
    </SceneStoreProvider>,
  )
}

describe('HotspotDrawer', () => {
  it('renders nothing when openHotspotId is null', () => {
    renderDrawer(null)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('renders title and summary when openHotspotId matches a hotspot with drawer content', () => {
    renderDrawer('h-with-drawer')
    expect(screen.getByRole('heading', { name: 'Drawer title' })).toBeInTheDocument()
    expect(screen.getByText('Drawer summary text')).toBeInTheDocument()
    expect(screen.getByText('Drawer body text')).toBeInTheDocument()
  })

  it('has role="dialog" and aria-modal="true"', () => {
    renderDrawer('h-with-drawer')
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    // Title is referenced via aria-labelledby
    const labelledBy = dialog.getAttribute('aria-labelledby')
    expect(labelledBy).toBeTruthy()
    expect(document.getElementById(labelledBy!)?.textContent).toBe('Drawer title')
  })

  it('renders source links', () => {
    renderDrawer('h-with-drawer')
    const linkOne = screen.getByRole('link', { name: /ReliefWeb/ })
    expect(linkOne).toHaveAttribute('href', 'https://example.org/one')
    const linkTwo = screen.getByRole('link', { name: /UN OCHA/ })
    expect(linkTwo).toHaveAttribute('href', 'https://example.org/two')
  })

  it('renders action button when action is present', () => {
    renderDrawer('h-with-drawer')
    const action = screen.getByRole('button', { name: 'Donate now' })
    expect(action).toBeInTheDocument()
  })

  it('does not render action button when action is absent', () => {
    renderDrawer('h-without-action')
    expect(screen.queryByRole('button', { name: /Donate/i })).not.toBeInTheDocument()
  })

  it('calls closeHotspot when backdrop is clicked', async () => {
    const user = userEvent.setup()
    renderDrawer('h-with-drawer')
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    const backdrop = screen.getByTestId('hotspot-drawer-backdrop')
    await user.click(backdrop)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('calls closeHotspot when close button is clicked', async () => {
    const user = userEvent.setup()
    renderDrawer('h-with-drawer')
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    const closeBtn = screen.getByRole('button', { name: 'Close' })
    await user.click(closeBtn)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('closes on Escape key press', async () => {
    const user = userEvent.setup()
    renderDrawer('h-with-drawer')
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    await act(async () => {
      await user.keyboard('{Escape}')
    })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
