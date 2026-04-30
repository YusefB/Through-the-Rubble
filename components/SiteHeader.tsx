'use client'

import type { CSSProperties } from 'react'

type Props = {
  title: string
  subtitle?: string
}

export function SiteHeader({ title, subtitle }: Props) {
  return (
    <header
      style={{
        background: '#000000',
        padding: '32px 24px 24px',
        textAlign: 'center',
        position: 'relative',
      }}
    >
      {/* Thin Palestine flag accent stripe along the bottom edge */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: '4px',
          display: 'flex',
        }}
      >
        <span style={{ flex: 1, background: '#000000' }} />
        <span style={{ flex: 1, background: '#ffffff' }} />
        <span style={{ flex: 1, background: '#007A3D' }} />
      </div>
      {/* Red triangle indicator at the left edge */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: 0,
          bottom: 0,
          width: '0',
          height: '0',
          borderTop: '14px solid transparent',
          borderBottom: '14px solid transparent',
          borderLeft: '14px solid #CE1126',
        }}
      />

      <h1
        style={
          {
            margin: 0,
            fontSize: 'clamp(20px, 5vw, 28px)',
            fontWeight: 600,
            letterSpacing: '0.02em',
            color: '#ffffff',
          } satisfies CSSProperties
        }
      >
        {title}
      </h1>
      {subtitle ? (
        <p
          style={{
            margin: '8px 0 0',
            fontSize: 'clamp(13px, 3.5vw, 15px)',
            color: 'rgba(255,255,255,0.75)',
            letterSpacing: '0.02em',
          }}
        >
          {subtitle}
        </p>
      ) : null}
    </header>
  )
}
