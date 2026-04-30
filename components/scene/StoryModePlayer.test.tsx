import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { act, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SceneStoreProvider } from '@/lib/scene/SceneStoreContext'
import { StoryModePlayer } from './StoryModePlayer'
import type { Chapter } from '@/lib/scene/types'

const chapters: Chapter[] = [
  {
    id: 'ch-a',
    sceneId: 'scene-test',
    order: 0,
    label: 'Chapter A',
    scrollAnchorY: 0.1,
    narration: 'Narration for chapter A.',
  },
  {
    id: 'ch-b',
    sceneId: 'scene-test',
    order: 1,
    label: 'Chapter B',
    scrollAnchorY: 0.4,
    narration: 'Narration for chapter B.',
  },
  {
    id: 'ch-c',
    sceneId: 'scene-test',
    order: 2,
    label: 'Chapter C',
    scrollAnchorY: 0.7,
    narration: 'Narration for chapter C.',
  },
]

function renderPlayer() {
  return render(
    <SceneStoreProvider
      initial={{
        activeChapterId: null,
        beforeAfter: 'after',
        openHotspotId: null,
        reducedMotion: false,
      }}
    >
      <StoryModePlayer chapters={chapters} />
    </SceneStoreProvider>,
  )
}

describe('StoryModePlayer', () => {
  beforeEach(() => {
    // Stub scrollIntoView since jsdom does not implement it
    if (!Element.prototype.scrollIntoView) {
      Object.defineProperty(Element.prototype, 'scrollIntoView', {
        configurable: true,
        writable: true,
        value: vi.fn(),
      })
    } else {
      vi.spyOn(Element.prototype, 'scrollIntoView').mockImplementation(() => {})
    }
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders Begin guided story button when story mode is inactive', () => {
    renderPlayer()
    expect(
      screen.getByRole('button', { name: /begin guided story/i }),
    ).toBeInTheDocument()
    expect(screen.queryByTestId('story-mode-card')).not.toBeInTheDocument()
  })

  it('clicking begin button activates story mode', async () => {
    const user = userEvent.setup()
    renderPlayer()
    await user.click(
      screen.getByRole('button', { name: /begin guided story/i }),
    )
    expect(screen.getByTestId('story-mode-card')).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: /begin guided story/i }),
    ).not.toBeInTheDocument()
  })

  it('shows current chapter label and narration text', async () => {
    const user = userEvent.setup()
    renderPlayer()
    await user.click(
      screen.getByRole('button', { name: /begin guided story/i }),
    )
    const card = screen.getByTestId('story-mode-card')
    expect(card).toHaveTextContent('Chapter A')
    expect(card).toHaveTextContent('Narration for chapter A.')
  })

  it('Next button advances index', async () => {
    const user = userEvent.setup()
    renderPlayer()
    await user.click(
      screen.getByRole('button', { name: /begin guided story/i }),
    )
    expect(screen.getByTestId('story-mode-card')).toHaveTextContent('Chapter A')
    await user.click(screen.getByRole('button', { name: /^next$/i }))
    expect(screen.getByTestId('story-mode-card')).toHaveTextContent('Chapter B')
  })

  it('Prev button decrements index', async () => {
    const user = userEvent.setup()
    renderPlayer()
    await user.click(
      screen.getByRole('button', { name: /begin guided story/i }),
    )
    await user.click(screen.getByRole('button', { name: /^next$/i }))
    expect(screen.getByTestId('story-mode-card')).toHaveTextContent('Chapter B')
    await user.click(screen.getByRole('button', { name: /^prev$/i }))
    expect(screen.getByTestId('story-mode-card')).toHaveTextContent('Chapter A')
  })

  it('Exit button stops story mode', async () => {
    const user = userEvent.setup()
    renderPlayer()
    await user.click(
      screen.getByRole('button', { name: /begin guided story/i }),
    )
    expect(screen.getByTestId('story-mode-card')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /^exit$/i }))
    expect(screen.queryByTestId('story-mode-card')).not.toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /begin guided story/i }),
    ).toBeInTheDocument()
  })

  it('renders progress dots equal to chapters length', async () => {
    const user = userEvent.setup()
    renderPlayer()
    await user.click(
      screen.getByRole('button', { name: /begin guided story/i }),
    )
    chapters.forEach((_, i) => {
      expect(screen.getByTestId(`story-mode-dot-${i}`)).toBeInTheDocument()
    })
    expect(screen.getByTestId('story-mode-dot-0')).toHaveAttribute(
      'data-active',
      'true',
    )
    expect(screen.getByTestId('story-mode-dot-1')).toHaveAttribute(
      'data-active',
      'false',
    )
  })

  it('auto-advances to the next chapter after 10 seconds', () => {
    vi.useFakeTimers()
    try {
      renderPlayer()
      // Use fireEvent (synchronous) under fake timers to avoid userEvent hangs
      fireEvent.click(
        screen.getByRole('button', { name: /begin guided story/i }),
      )
      expect(screen.getByTestId('story-mode-card')).toHaveTextContent(
        'Chapter A',
      )
      act(() => {
        vi.advanceTimersByTime(10000)
      })
      expect(screen.getByTestId('story-mode-card')).toHaveTextContent(
        'Chapter B',
      )
    } finally {
      vi.useRealTimers()
    }
  })

  it('Pause stops the auto-advance timer', () => {
    vi.useFakeTimers()
    try {
      renderPlayer()
      fireEvent.click(
        screen.getByRole('button', { name: /begin guided story/i }),
      )
      // Pause before timer fires
      fireEvent.click(screen.getByRole('button', { name: /^pause$/i }))
      // Pause button should now read "Resume"
      expect(
        screen.getByRole('button', { name: /^resume$/i }),
      ).toBeInTheDocument()
      // Advance timers; index should not change
      act(() => {
        vi.advanceTimersByTime(15000)
      })
      expect(screen.getByTestId('story-mode-card')).toHaveTextContent(
        'Chapter A',
      )
    } finally {
      vi.useRealTimers()
    }
  })
})
