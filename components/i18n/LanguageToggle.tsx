'use client'
import { useLocale } from '@/lib/i18n/store'
import { LOCALES } from '@/lib/i18n/config'

export function LanguageToggle() {
  const locale = useLocale((s) => s.locale)
  const setLocale = useLocale((s) => s.setLocale)

  return (
    <div role="group" aria-label="Language" style={{ display: 'inline-flex', gap: '4px' }}>
      {LOCALES.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLocale(l)}
          aria-pressed={locale === l}
          style={{
            minWidth: '48px',
            minHeight: '48px',
            padding: '8px 12px',
            background: locale === l ? '#CE1126' : 'transparent',
            color: '#ffffff',
            border: '1px solid rgba(206,17,38,0.5)',
            borderRadius: '999px',
            cursor: 'pointer',
            fontSize: '12px',
            letterSpacing: '1px',
          }}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
