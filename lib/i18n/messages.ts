import en from '@/messages/en.json'
import ar from '@/messages/ar.json'
import type { Locale } from './config'

export const MESSAGES = { en, ar } as const

export function getMessages(locale: Locale) {
  return MESSAGES[locale]
}
