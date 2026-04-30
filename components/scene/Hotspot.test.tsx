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
