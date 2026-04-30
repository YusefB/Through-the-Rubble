import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { ActionLayer, type ActionLink } from './ActionLayer'

describe('ActionLayer', () => {
  it('renders the default title when no title prop is passed', () => {
    render(<ActionLayer />)
    expect(
      screen.getByRole('heading', { level: 2, name: /How you can help/ }),
    ).toBeInTheDocument()
  })

  it('renders a custom title when passed', () => {
    render(<ActionLayer title="Take action now" />)
    expect(
      screen.getByRole('heading', { level: 2, name: /Take action now/ }),
    ).toBeInTheDocument()
  })

  it('renders 3 default actions when no actions prop is passed', () => {
    render(<ActionLayer />)
    const region = screen.getByRole('region', { name: /How you can help/ })
    const items = within(region).getAllByRole('listitem')
    expect(items).toHaveLength(3)
    expect(within(region).getByText(/Donate to humanitarian relief/)).toBeInTheDocument()
    expect(within(region).getByText('Learn more')).toBeInTheDocument()
    expect(within(region).getByText(/Share this story/)).toBeInTheDocument()
  })

  it('renders custom actions when passed', () => {
    const custom: ActionLink[] = [
      { category: 'donate', label: 'Give to charity X' },
      { category: 'learn', label: 'Read the report' },
    ]
    render(<ActionLayer actions={custom} />)
    const region = screen.getByRole('region', { name: /How you can help/ })
    const items = within(region).getAllByRole('listitem')
    expect(items).toHaveLength(2)
    expect(within(region).getByText('Give to charity X')).toBeInTheDocument()
    expect(within(region).getByText('Read the report')).toBeInTheDocument()
  })

  it('renders <a> with target="_blank" and rel="noopener noreferrer" when url is set', () => {
    const actions: ActionLink[] = [
      { category: 'donate', label: 'Donate now', url: 'https://example.org/donate' },
    ]
    render(<ActionLayer actions={actions} />)
    const link = screen.getByRole('link', { name: /Donate now/ })
    expect(link).toHaveAttribute('href', 'https://example.org/donate')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('renders <button type="button"> when no url is set', () => {
    const actions: ActionLink[] = [
      { category: 'share', label: 'Share now' },
    ]
    render(<ActionLayer actions={actions} />)
    const btn = screen.getByRole('button', { name: /Share now/ })
    expect(btn.tagName).toBe('BUTTON')
    expect(btn).toHaveAttribute('type', 'button')
  })

  it('each interactive element has min-height of at least 48px', () => {
    const actions: ActionLink[] = [
      { category: 'donate', label: 'Donate', url: 'https://example.org' },
      { category: 'learn', label: 'Learn' },
      { category: 'share', label: 'Share' },
    ]
    render(<ActionLayer actions={actions} />)
    const link = screen.getByRole('link', { name: /Donate/ })
    const learnBtn = screen.getByRole('button', { name: /Learn/ })
    const shareBtn = screen.getByRole('button', { name: /Share/ })

    for (const el of [link, learnBtn, shareBtn]) {
      const minHeight = parseInt(window.getComputedStyle(el).minHeight, 10)
      expect(minHeight).toBeGreaterThanOrEqual(48)
    }
  })

  it('exposes a region with aria-labelledby pointing to the title', () => {
    render(<ActionLayer />)
    const region = screen.getByRole('region', { name: /How you can help/ })
    const title = screen.getByRole('heading', { level: 2, name: /How you can help/ })
    expect(region).toHaveAttribute('aria-labelledby', 'action-title')
    expect(title).toHaveAttribute('id', 'action-title')
  })
})
