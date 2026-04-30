'use client'
import { createStore, type StoreApi } from 'zustand'

export type SceneStoreState = {
  activeChapterId: string | null
  beforeAfter: 'before' | 'after'
  openHotspotId: string | null
  reducedMotion: boolean
}

export type SceneStoreActions = {
  setActiveChapter: (id: string) => void
  toggleBeforeAfter: () => void
  setBeforeAfter: (state: 'before' | 'after') => void
  openHotspot: (id: string) => void
  closeHotspot: () => void
  setReducedMotion: (value: boolean) => void
}

export type SceneStore = SceneStoreState & SceneStoreActions

export type SceneStoreApi = StoreApi<SceneStore>

export function createSceneStore(initial: SceneStoreState): SceneStoreApi {
  return createStore<SceneStore>((set) => ({
    ...initial,
    setActiveChapter: (id) => set({ activeChapterId: id }),
    toggleBeforeAfter: () =>
      set((s) => ({ beforeAfter: s.beforeAfter === 'before' ? 'after' : 'before' })),
    setBeforeAfter: (state) => set({ beforeAfter: state }),
    openHotspot: (id) => set({ openHotspotId: id }),
    closeHotspot: () => set({ openHotspotId: null }),
    setReducedMotion: (value) => set({ reducedMotion: value }),
  }))
}
