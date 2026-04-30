import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ChapterAnchor } from './ChapterAnchor'

describe('ChapterAnchor', () => {
  it('renders an invisible anchor element with data-chapter attribute', () => {
    render(<ChapterAnchor chapterId="north-block" scrollAnchorY={0.25} />)
    const el = screen.getByTestId('chapter-anchor-north-block')
    expect(el).toHaveAttribute('data-chapter', 'north-block')
  })

  it('positions itself at the correct vertical percentage', () => {
    render(<ChapterAnchor chapterId="ch-1" scrollAnchorY={0.42} />)
    const el = screen.getByTestId('chapter-anchor-ch-1')
    expect(el.style.top).toBe('42%')
  })

  it('is visually hidden but in the DOM (presentational)', () => {
    render(<ChapterAnchor chapterId="ch-1" scrollAnchorY={0} />)
    const el = screen.getByTestId('chapter-anchor-ch-1')
    expect(el.getAttribute('aria-hidden')).toBe('true')
  })
})
