'use client'
import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import type { Chapter } from '@/lib/scene/types'
import { useSceneStore } from '@/lib/scene/SceneStoreContext'

const AUTO_ADVANCE_MS = 10000

type Props = {
  chapters: Chapter[]
}

export function StoryModePlayer({ chapters }: Props) {
  const storyModeActive = useSceneStore((s) => s.storyModeActive)
  const storyModeChapterIndex = useSceneStore((s) => s.storyModeChapterIndex)
  const reducedMotion = useSceneStore((s) => s.reducedMotion)
  const startStoryMode = useSceneStore((s) => s.startStoryMode)
  const stopStoryMode = useSceneStore((s) => s.stopStoryMode)
  const nextStoryChapter = useSceneStore((s) => s.nextStoryChapter)
  const prevStoryChapter = useSceneStore((s) => s.prevStoryChapter)

  const [isPaused, setIsPaused] = useState(false)

  const totalChapters = chapters.length
  const currentChapter =
    storyModeChapterIndex >= 0 && storyModeChapterIndex < totalChapters
      ? chapters[storyModeChapterIndex]
      : null

  // Scroll to chapter on index change (only when active)
  useEffect(() => {
    if (!storyModeActive || !currentChapter) return
    if (typeof document === 'undefined') return
    const target = document.querySelector<HTMLElement>(
      `[data-chapter="${currentChapter.id}"]`,
    )
    if (target && typeof target.scrollIntoView === 'function') {
      target.scrollIntoView({
        behavior: reducedMotion ? 'auto' : 'smooth',
        block: 'center',
      })
    }
  }, [storyModeActive, currentChapter, reducedMotion])

  // Reset pause when story mode exits
  useEffect(() => {
    if (!storyModeActive && isPaused) {
      setIsPaused(false)
    }
  }, [storyModeActive, isPaused])

  // Auto-advance timer
  useEffect(() => {
    if (!storyModeActive) return
    if (isPaused) return
    if (storyModeChapterIndex < 0) return

    const timer = setTimeout(() => {
      const isLast = storyModeChapterIndex >= totalChapters - 1
      if (isLast) {
        stopStoryMode()
        if (typeof document !== 'undefined') {
          const action = document.querySelector<HTMLElement>(
            'section[aria-labelledby="action-title"]',
          )
          if (action && typeof action.scrollIntoView === 'function') {
            action.scrollIntoView({
              behavior: reducedMotion ? 'auto' : 'smooth',
              block: 'start',
            })
          } else if (typeof window !== 'undefined') {
            window.scrollTo({
              top: document.body.scrollHeight,
              behavior: reducedMotion ? 'auto' : 'smooth',
            })
          }
        }
      } else {
        nextStoryChapter(totalChapters)
      }
    }, AUTO_ADVANCE_MS)

    return () => clearTimeout(timer)
  }, [
    storyModeActive,
    isPaused,
    storyModeChapterIndex,
    totalChapters,
    nextStoryChapter,
    stopStoryMode,
    reducedMotion,
  ])

  const handleBegin = useCallback(() => {
    setIsPaused(false)
    startStoryMode()
  }, [startStoryMode])

  const handleExit = useCallback(() => {
    setIsPaused(false)
    stopStoryMode()
  }, [stopStoryMode])

  const handlePrev = useCallback(() => {
    prevStoryChapter()
  }, [prevStoryChapter])

  const handleNext = useCallback(() => {
    nextStoryChapter(totalChapters)
  }, [nextStoryChapter, totalChapters])

  const handlePauseToggle = useCallback(() => {
    setIsPaused((p) => !p)
  }, [])

  if (!storyModeActive) {
    return (
      <button
        type="button"
        onClick={handleBegin}
        data-testid="story-mode-begin"
        style={{
          position: 'fixed',
          bottom: '20px',
          left: '20px',
          minWidth: '48px',
          minHeight: '48px',
          padding: '12px 20px',
          background: '#15110d',
          color: '#f1c155',
          border: '1px solid rgba(241,193,85,0.6)',
          borderRadius: '999px',
          fontSize: '14px',
          fontWeight: 600,
          letterSpacing: '0.02em',
          cursor: 'pointer',
          zIndex: 70,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
        }}
      >
        <span>Begin guided story</span>
        <span aria-hidden="true">‣</span>
      </button>
    )
  }

  const transition = reducedMotion
    ? { duration: 0 }
    : { duration: 0.3, ease: 'easeOut' as const }

  return (
    <AnimatePresence>
      <motion.div
        key="story-mode-card"
        role="region"
        aria-label="Story Mode narration"
        aria-live="polite"
        data-testid="story-mode-card"
        initial={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={transition}
        style={{
          position: 'sticky',
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          maxHeight: '40vh',
          overflowY: 'auto',
          background: '#15110d',
          color: '#f5ebd8',
          borderTop: '2px solid #f1c155',
          borderRadius: '16px 16px 0 0',
          padding: '24px',
          zIndex: 70,
          boxSizing: 'border-box',
        }}
      >
        {currentChapter ? (
          <>
            <h2
              style={{
                margin: '0 0 8px 0',
                fontSize: '18px',
                fontWeight: 600,
                color: '#f1c155',
                letterSpacing: '0.02em',
              }}
            >
              {currentChapter.label}
            </h2>
            <p
              style={{
                margin: '0 0 16px 0',
                fontSize: '15px',
                lineHeight: 1.55,
              }}
            >
              {currentChapter.narration ?? ''}
            </p>
          </>
        ) : null}

        <div
          role="presentation"
          style={{
            display: 'flex',
            gap: '4px',
            margin: '0 0 16px 0',
          }}
        >
          {chapters.map((c, i) => {
            const isActive = i === storyModeChapterIndex
            return (
              <span
                key={c.id}
                data-testid={`story-mode-dot-${i}`}
                data-active={isActive ? 'true' : 'false'}
                aria-hidden="true"
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '999px',
                  background: isActive ? '#f1c155' : 'transparent',
                  border: '1px solid #f1c155',
                  display: 'inline-block',
                }}
              />
            )
          })}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            flexWrap: 'wrap',
          }}
        >
          <button
            type="button"
            aria-label="Prev"
            onClick={handlePrev}
            disabled={storyModeChapterIndex <= 0}
            style={controlButtonStyle(storyModeChapterIndex <= 0)}
          >
            <span aria-hidden="true">‹</span>
          </button>
          <button
            type="button"
            aria-label={isPaused ? 'Resume' : 'Pause'}
            onClick={handlePauseToggle}
            style={controlButtonStyle(false)}
          >
            <span aria-hidden="true">{isPaused ? '▶' : '❚❚'}</span>
          </button>
          <button
            type="button"
            aria-label="Next"
            onClick={handleNext}
            disabled={storyModeChapterIndex >= totalChapters - 1}
            style={controlButtonStyle(
              storyModeChapterIndex >= totalChapters - 1,
            )}
          >
            <span aria-hidden="true">›</span>
          </button>
          <button
            type="button"
            aria-label="Exit"
            onClick={handleExit}
            style={{
              ...controlButtonStyle(false),
              marginLeft: 'auto',
            }}
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

function controlButtonStyle(disabled: boolean) {
  return {
    minWidth: '48px',
    minHeight: '48px',
    padding: '8px 14px',
    background: 'transparent',
    color: '#f5ebd8',
    border: '1px solid rgba(241,193,85,0.4)',
    borderRadius: '999px',
    fontSize: '16px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  } as const
}
