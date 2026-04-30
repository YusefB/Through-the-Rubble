'use client'
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
} from 'react'
import { AnimatePresence, motion } from 'motion/react'
import type { Hotspot as HotspotData } from '@/lib/scene/types'
import { useSceneStore } from '@/lib/scene/SceneStoreContext'

type Props = {
  hotspots: HotspotData[]
}

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function HotspotDrawer({ hotspots }: Props) {
  const openHotspotId = useSceneStore((s) => s.openHotspotId)
  const closeHotspot = useSceneStore((s) => s.closeHotspot)
  const reducedMotion = useSceneStore((s) => s.reducedMotion)

  const [isDesktop, setIsDesktop] = useState(false)
  const dialogRef = useRef<HTMLDivElement | null>(null)
  const closeButtonRef = useRef<HTMLButtonElement | null>(null)
  const previouslyFocusedHotspotIdRef = useRef<string | null>(null)
  const titleId = useId()

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const mql = window.matchMedia('(min-width: 768px)')
    const update = () => setIsDesktop(mql.matches)
    update()
    if (mql.addEventListener) {
      mql.addEventListener('change', update)
      return () => mql.removeEventListener('change', update)
    }
    // Fallback for older browsers
    mql.addListener(update)
    return () => mql.removeListener(update)
  }, [])

  const hotspot = openHotspotId
    ? hotspots.find((h) => h.id === openHotspotId)
    : null
  const isOpen = Boolean(openHotspotId)

  // Track which hotspot was open so we can return focus when closed.
  useEffect(() => {
    if (openHotspotId) {
      previouslyFocusedHotspotIdRef.current = openHotspotId
    }
  }, [openHotspotId])

  // Focus management: move focus into the drawer on open, return it on close.
  useEffect(() => {
    if (isOpen) {
      // Defer to next frame so the drawer is mounted.
      const id = window.requestAnimationFrame(() => {
        if (closeButtonRef.current) {
          closeButtonRef.current.focus()
        } else if (dialogRef.current) {
          const first = dialogRef.current.querySelector<HTMLElement>(FOCUSABLE_SELECTOR)
          first?.focus()
        }
      })
      return () => window.cancelAnimationFrame(id)
    }
    // Closed: return focus to the hotspot button.
    const previousId = previouslyFocusedHotspotIdRef.current
    if (previousId && typeof document !== 'undefined') {
      const target = document.querySelector<HTMLElement>(
        `[data-hotspot-id="${previousId}"]`,
      )
      target?.focus()
    }
    previouslyFocusedHotspotIdRef.current = null
    return undefined
  }, [isOpen])

  // Escape to close + simple focus trap.
  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        closeHotspot()
        return
      }
      if (e.key === 'Tab' && dialogRef.current) {
        const focusables = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
        ).filter((el) => !el.hasAttribute('disabled'))
        if (focusables.length === 0) {
          e.preventDefault()
          return
        }
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        const active = document.activeElement as HTMLElement | null
        if (e.shiftKey) {
          if (active === first || !dialogRef.current.contains(active)) {
            e.preventDefault()
            last?.focus()
          }
        } else {
          if (active === last) {
            e.preventDefault()
            first?.focus()
          }
        }
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isOpen, closeHotspot])

  const handleAction = useCallback((url?: string) => {
    if (!url) return
    if (typeof window !== 'undefined') {
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  }, [])

  const drawer = hotspot?.drawer
  const backdropStyle: CSSProperties = {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.7)',
    zIndex: 1000,
  }

  const dialogBaseStyle: CSSProperties = isDesktop
    ? {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        maxWidth: '480px',
        width: 'calc(100% - 32px)',
        maxHeight: '80vh',
        overflowY: 'auto',
        background: '#000000',
        color: '#ffffff',
        border: '1px solid rgba(206,17,38,0.3)',
        borderRadius: '12px',
        padding: '24px',
        zIndex: 1001,
      }
    : {
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        maxHeight: '80vh',
        overflowY: 'auto',
        background: '#000000',
        color: '#ffffff',
        borderTop: '1px solid rgba(206,17,38,0.3)',
        borderRadius: '16px 16px 0 0',
        padding: '24px',
        zIndex: 1001,
      }

  const initial = isDesktop ? { opacity: 0, scale: 0.96 } : { y: '100%', opacity: 1 }
  const animate = isDesktop ? { opacity: 1, scale: 1 } : { y: 0, opacity: 1 }
  const exit = isDesktop ? { opacity: 0, scale: 0.96 } : { y: '100%', opacity: 1 }
  const transition = reducedMotion
    ? { duration: 0 }
    : { duration: 0.3, ease: 'easeOut' as const }

  return (
    <AnimatePresence>
      {isOpen && hotspot ? (
        <div key="hotspot-drawer-root">
          <motion.div
            data-testid="hotspot-drawer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={transition}
            style={backdropStyle as Record<string, unknown>}
            onClick={closeHotspot}
          />
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            data-testid="hotspot-drawer"
            initial={initial}
            animate={animate}
            exit={exit}
            transition={transition}
            style={dialogBaseStyle as Record<string, unknown>}
          >
            <button
              ref={closeButtonRef}
              type="button"
              aria-label="Close"
              onClick={closeHotspot}
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                width: '40px',
                height: '40px',
                minWidth: '40px',
                minHeight: '40px',
                background: 'transparent',
                color: '#ffffff',
                border: 'none',
                fontSize: '24px',
                lineHeight: 1,
                cursor: 'pointer',
                padding: 0,
              }}
            >
              <span aria-hidden="true">×</span>
            </button>

            {drawer ? (
              <div style={{ paddingRight: '40px' }}>
                <h2
                  id={titleId}
                  style={{
                    margin: '0 0 8px 0',
                    fontSize: '20px',
                    fontWeight: 600,
                    color: '#CE1126',
                  }}
                >
                  {drawer.title}
                </h2>
                <p style={{ margin: '0 0 16px 0', fontSize: '15px', opacity: 0.9 }}>
                  {drawer.summary}
                </p>
                <p style={{ margin: '0 0 16px 0', fontSize: '14px', lineHeight: 1.5 }}>
                  {drawer.body}
                </p>
                {drawer.sources.length > 0 ? (
                  <>
                    <h3
                      style={{
                        margin: '16px 0 8px 0',
                        fontSize: '13px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                        opacity: 0.7,
                      }}
                    >
                      Sources
                    </h3>
                    <ul
                      style={{
                        listStyle: 'none',
                        padding: 0,
                        margin: '0 0 16px 0',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                      }}
                    >
                      {drawer.sources.map((source) => (
                        <li key={source.url}>
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              color: '#CE1126',
                              textDecoration: 'underline',
                              fontSize: '14px',
                            }}
                          >
                            {source.publisher}
                            <span style={{ opacity: 0.7 }}>{` — ${source.title}`}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : null}
                {drawer.action ? (
                  <button
                    type="button"
                    data-action-category={drawer.action.category}
                    onClick={() => handleAction(drawer.action?.url)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minHeight: '44px',
                      padding: '0 20px',
                      background: '#CE1126',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: 600,
                      fontSize: '15px',
                      cursor: 'pointer',
                    }}
                  >
                    {drawer.action.label}
                  </button>
                ) : null}
              </div>
            ) : (
              <div style={{ paddingRight: '40px' }}>
                <h2
                  id={titleId}
                  style={{
                    margin: '0 0 8px 0',
                    fontSize: '20px',
                    fontWeight: 600,
                    color: '#CE1126',
                  }}
                >
                  {hotspot.label}
                </h2>
              </div>
            )}
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  )
}
