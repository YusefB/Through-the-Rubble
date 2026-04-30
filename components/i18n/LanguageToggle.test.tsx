import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LanguageToggle } from './LanguageToggle'
import { useLocale } from '@/lib/i18n/store'
import { DEFAULT_LOCALE, LOCALES } from '@/lib/i18n/config'

describe('LanguageToggle', () => {
  beforeEach(() => {
    // Reset store + persisted storage so each test starts clean
    if (typeof window !== 'undefined') {
      window.localStorage.clear()
    }
    useLocale.setState({ locale: DEFAULT_LOCALE })
  })

  it('renders one button per locale', () => {
    render(<LanguageToggle />)
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(LOCALES.length)
    for (const l of LOCALES) {
      expect(screen.getByRole('button', { name: l.toUpperCase() })).toBeInTheDocument()
    }
  })

  it('exposes a group with aria-label="Language"', () => {
    render(<LanguageToggle />)
    const group = screen.getByRole('group', { name: 'Language' })
    expect(group).toBeInTheDocument()
  })

  it('marks the default locale as pressed and the others as not pressed', () => {
    render(<LanguageToggle />)
    const en = screen.getByRole('button', { name: 'EN' })
    const ar = screen.getByRole('button', { name: 'AR' })
    expect(en).toHaveAttribute('aria-pressed', 'true')
    expect(ar).toHaveAttribute('aria-pressed', 'false')
  })

  it('flips aria-pressed when a different locale button is clicked', async () => {
    const user = userEvent.setup()
    render(<LanguageToggle />)
    const en = screen.getByRole('button', { name: 'EN' })
    const ar = screen.getByRole('button', { name: 'AR' })

    await user.click(ar)
    expect(ar).toHaveAttribute('aria-pressed', 'true')
    expect(en).toHaveAttribute('aria-pressed', 'false')

    await user.click(en)
    expect(en).toHaveAttribute('aria-pressed', 'true')
    expect(ar).toHaveAttribute('aria-pressed', 'false')
  })

  it('updates the persisted locale store when clicked', async () => {
    const user = userEvent.setup()
    render(<LanguageToggle />)
    expect(useLocale.getState().locale).toBe('en')

    await user.click(screen.getByRole('button', { name: 'AR' }))
    expect(useLocale.getState().locale).toBe('ar')
  })

  it('renders each button with min-width and min-height of at least 48px', () => {
    render(<LanguageToggle />)
    for (const l of LOCALES) {
      const btn = screen.getByRole('button', { name: l.toUpperCase() })
      const styles = window.getComputedStyle(btn)
      expect(parseInt(styles.minWidth, 10)).toBeGreaterThanOrEqual(48)
      expect(parseInt(styles.minHeight, 10)).toBeGreaterThanOrEqual(48)
    }
  })

  it('renders buttons of type="button" so they do not submit forms', () => {
    render(<LanguageToggle />)
    for (const l of LOCALES) {
      const btn = screen.getByRole('button', { name: l.toUpperCase() })
      expect(btn).toHaveAttribute('type', 'button')
    }
  })
})
