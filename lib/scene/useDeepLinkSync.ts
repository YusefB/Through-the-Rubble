'use client'
import { useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { useSceneStoreApi } from './SceneStoreContext'

export function useDeepLinkSync() {
  const searchParams = useSearchParams()
  const storeApi = useSceneStoreApi()
  const hydrated = useRef(false)

  useEffect(() => {
    if (hydrated.current) return
    hydrated.current = true

    const state = searchParams.get('state')
    if (state === 'before' || state === 'after') {
      storeApi.getState().setBeforeAfter(state)
    }

    const hotspot = searchParams.get('hotspot')
    if (hotspot) {
      storeApi.getState().openHotspot(hotspot)
    }

    const chapter = searchParams.get('chapter')
    if (chapter) {
      storeApi.getState().setActiveChapter(chapter)
      const el = document.querySelector(`[data-chapter="${chapter}"]`)
      el?.scrollIntoView({ behavior: 'auto', block: 'center' })
    }
  }, [searchParams, storeApi])

  // Persist store changes back to URL (replaceState — no history pollution)
  useEffect(() => {
    const writeUrl = () => {
      if (typeof window === 'undefined') return
      const s = storeApi.getState()
      const url = new URL(window.location.href)
      url.searchParams.set('state', s.beforeAfter)
      if (s.activeChapterId) url.searchParams.set('chapter', s.activeChapterId)
      else url.searchParams.delete('chapter')
      if (s.openHotspotId) url.searchParams.set('hotspot', s.openHotspotId)
      else url.searchParams.delete('hotspot')
      window.history.replaceState(null, '', url.toString())
    }

    let timer: ReturnType<typeof setTimeout> | null = null
    const debounced = () => {
      if (timer) clearTimeout(timer)
      timer = setTimeout(writeUrl, 500)
    }

    const unsubscribe = storeApi.subscribe(debounced)
    return () => {
      unsubscribe()
      if (timer) clearTimeout(timer)
    }
  }, [storeApi])
}
