'use client'
import { useEffect } from 'react'
import { NextIntlClientProvider } from 'next-intl'
import { useLocale } from './store'
import { getMessages } from './messages'
import { isRtl } from './config'

export function IntlProvider({ children }: { children: React.ReactNode }) {
  const locale = useLocale((s) => s.locale)
  const messages = getMessages(locale)

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale
      document.documentElement.dir = isRtl(locale) ? 'rtl' : 'ltr'
    }
  }, [locale])

  return (
    <NextIntlClientProvider locale={locale} messages={messages} timeZone="UTC">
      {children}
    </NextIntlClientProvider>
  )
}
