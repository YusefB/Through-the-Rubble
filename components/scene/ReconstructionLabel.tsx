'use client'
import { useState } from 'react'

type Props = {
  label: string
}

export function ReconstructionLabel({ label }: Props) {
  const [expanded, setExpanded] = useState(false)
  return (
    <div
      role="note"
      aria-label="Visual reconstruction"
      className="reconstruction-label"
      style={{
        position: 'sticky',
        top: '12px',
        right: '12px',
        marginLeft: 'auto',
        zIndex: 50,
        maxWidth: '280px',
      }}
    >
      <button
        type="button"
        onClick={() => setExpanded(v => !v)}
        aria-expanded={expanded}
        aria-label="Visual reconstruction. Activate for source note."
        className="reconstruction-label-button"
        style={{
          padding: '6px 10px',
          minWidth: '44px',
          minHeight: '44px',
          background: 'rgba(0,0,0,0.7)',
          color: '#f1c155',
          border: '1px solid rgba(241,193,85,0.4)',
          borderRadius: '999px',
          fontSize: '12px',
          letterSpacing: '1.5px',
          cursor: 'pointer',
        }}
      >
        Visual reconstruction
      </button>
      <div
        role="region"
        aria-hidden={!expanded}
        style={{
          display: expanded ? 'block' : 'none',
          marginTop: '6px',
          padding: '10px',
          background: 'rgba(0,0,0,0.85)',
          color: '#f5ebd8',
          fontSize: '12px',
          lineHeight: 1.5,
          borderRadius: '6px',
          border: '1px solid rgba(241,193,85,0.2)',
        }}
      >
        {label}
      </div>
    </div>
  )
}
