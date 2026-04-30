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
