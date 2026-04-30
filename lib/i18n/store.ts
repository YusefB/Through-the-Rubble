import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { DEFAULT_LOCALE, type Locale } from './config'

type LocaleStore = {
  locale: Locale
  setLocale: (l: Locale) => void
}

export const useLocale = create<LocaleStore>()(
  persist(
    (set) => ({
      locale: DEFAULT_LOCALE,
      setLocale: (l) => set({ locale: l }),
    }),
    { name: 'ttr-locale' },
  ),
)
