'use client'
import { useEffect, useState, type CSSProperties } from 'react'

export type ActionLink = {
  category: 'donate' | 'learn' | 'share'
  label: string
  url?: string
  description?: string
}

export type ActionLayerProps = {
  title?: string
  subtitle?: string
  actions?: ActionLink[]
}

const DEFAULT_ACTIONS: ActionLink[] = [
  {
    category: 'donate',
    label: 'Donate to humanitarian relief',
    description: 'Support verified aid organizations',
  },
  {
    category: 'learn',
    label: 'Learn more',
    description: 'Read the source documentation',
  },
  {
    category: 'share',
    label: 'Share this story',
    description: 'Help others see what is happening',
  },
]

const DESKTOP_QUERY = '(min-width: 768px)'

function useIsDesktop(): boolean {
  const [isDesktop, setIsDesktop] = useState<boolean>(false)

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return
    }
    const mql = window.matchMedia(DESKTOP_QUERY)
    setIsDesktop(mql.matches)
    const handler = (event: MediaQueryListEvent) => setIsDesktop(event.matches)
    if (typeof mql.addEventListener === 'function') {
      mql.addEventListener('change', handler)
      return () => mql.removeEventListener('change', handler)
    }
    mql.addListener(handler)
    return () => mql.removeListener(handler)
  }, [])

  return isDesktop
}

function getButtonStyle(category: ActionLink['category']): CSSProperties {
  const base: CSSProperties = {
    display: 'block',
    width: '100%',
    minHeight: '48px',
    padding: '14px 20px',
    borderRadius: '12px',
    textAlign: 'left',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: '16px',
    lineHeight: 1.35,
    textDecoration: 'none',
    boxSizing: 'border-box',
  }

  if (category === 'donate') {
    return {
      ...base,
      background: '#f1c155',
      color: '#15110d',
      border: '1px solid #f1c155',
      fontWeight: 600,
    }
  }

  return {
    ...base,
    background: 'transparent',
    color: '#f5ebd8',
    border: '1px solid rgba(241,193,85,0.4)',
    fontWeight: 500,
  }
}

const labelStyle: CSSProperties = {
  display: 'block',
}

const descriptionStyle: CSSProperties = {
  display: 'block',
  marginTop: '4px',
  fontSize: '13px',
  fontWeight: 400,
  opacity: 0.85,
}

export function ActionLayer({
  title = 'How you can help',
  subtitle = 'These are starting points — every action matters.',
  actions = DEFAULT_ACTIONS,
}: ActionLayerProps) {
  const isDesktop = useIsDesktop()

  const sectionStyle: CSSProperties = {
    background: '#0a0a0a',
    padding: isDesktop ? '64px 32px' : '48px 24px',
  }

  const innerStyle: CSSProperties = {
    maxWidth: '720px',
    margin: '0 auto',
  }

  const titleStyle: CSSProperties = {
    color: '#f5ebd8',
    fontSize: isDesktop ? '32px' : '26px',
    fontWeight: 600,
    lineHeight: 1.2,
    margin: 0,
  }

  const subtitleStyle: CSSProperties = {
    color: '#cdb98c',
    opacity: 0.85,
    fontSize: isDesktop ? '17px' : '15px',
    lineHeight: 1.45,
    margin: '12px 0 0',
  }

  const listStyle: CSSProperties = {
    listStyle: 'none',
    padding: 0,
    margin: '32px 0 0',
    display: 'flex',
    flexDirection: isDesktop ? 'row' : 'column',
    gap: isDesktop ? '16px' : '12px',
  }

  const itemStyle: CSSProperties = {
    flex: isDesktop ? '1 1 0' : '0 0 auto',
    minWidth: 0,
  }

  return (
    <section aria-labelledby="action-title" style={sectionStyle}>
      <div style={innerStyle}>
        <h2 id="action-title" style={titleStyle}>
          {title}
        </h2>
        <p style={subtitleStyle}>{subtitle}</p>
        <ul style={listStyle}>
          {actions.map((action, idx) => (
            <li key={`${action.category}-${idx}`} style={itemStyle}>
              <ActionButton action={action} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function ActionButton({ action }: { action: ActionLink }) {
  const style = getButtonStyle(action.category)

  const content = (
    <>
      <span style={labelStyle}>{action.label}</span>
      {action.description ? (
        <span style={descriptionStyle}>{action.description}</span>
      ) : null}
    </>
  )

  if (action.url) {
    return (
      <a
        href={action.url}
        target="_blank"
        rel="noopener noreferrer"
        style={style}
        data-action-category={action.category}
      >
        {content}
      </a>
    )
  }

  return (
    <button
      type="button"
      style={style}
      data-action-category={action.category}
      onClick={() => {
        // eslint-disable-next-line no-console
        console.log(`[ActionLayer] ${action.category} action triggered: ${action.label}`)
      }}
    >
      {content}
    </button>
  )
}
