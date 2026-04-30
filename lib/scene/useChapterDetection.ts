'use client'
import { useEffect } from 'react'
import { useSceneStoreApi } from './SceneStoreContext'

export function useChapterDetection() {
  const storeApi = useSceneStoreApi()

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return
    const setActive = storeApi.getState().setActiveChapter

    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const target = entry.target as HTMLElement
          const id = target.dataset.chapter
          if (id) setActive(id)
        }
      },
      { rootMargin: '-40% 0px -40% 0px' },
    )

    const anchors = document.querySelectorAll<HTMLElement>('[data-chapter]')
    anchors.forEach((a) => obs.observe(a))

    return () => obs.disconnect()
  }, [storeApi])
}
