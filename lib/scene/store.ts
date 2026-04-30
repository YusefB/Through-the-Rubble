'use client'
import { createStore, type StoreApi } from 'zustand'

export type SceneStoreState = {
  activeChapterId: string | null
  beforeAfter: 'before' | 'after'
  openHotspotId: string | null
  reducedMotion: boolean
  storyModeActive: boolean
  storyModeChapterIndex: number
}

export type SceneStoreInitialState = Omit<
  SceneStoreState,
  'storyModeActive' | 'storyModeChapterIndex'
> &
  Partial<Pick<SceneStoreState, 'storyModeActive' | 'storyModeChapterIndex'>>

export type SceneStoreActions = {
  setActiveChapter: (id: string) => void
  toggleBeforeAfter: () => void
  setBeforeAfter: (state: 'before' | 'after') => void
  openHotspot: (id: string) => void
  closeHotspot: () => void
  setReducedMotion: (value: boolean) => void
  startStoryMode: () => void
  stopStoryMode: () => void
  nextStoryChapter: (total: number) => void
  prevStoryChapter: () => void
  setStoryChapterIndex: (i: number) => void
}

export type SceneStore = SceneStoreState & SceneStoreActions

export type SceneStoreApi = StoreApi<SceneStore>

export function createSceneStore(initial: SceneStoreInitialState): SceneStoreApi {
  return createStore<SceneStore>((set) => ({
    storyModeActive: false,
    storyModeChapterIndex: -1,
    ...initial,
    setActiveChapter: (id) => set({ activeChapterId: id }),
    toggleBeforeAfter: () =>
      set((s) => ({ beforeAfter: s.beforeAfter === 'before' ? 'after' : 'before' })),
    setBeforeAfter: (state) => set({ beforeAfter: state }),
    openHotspot: (id) => set({ openHotspotId: id }),
    closeHotspot: () => set({ openHotspotId: null }),
    setReducedMotion: (value) => set({ reducedMotion: value }),
    startStoryMode: () =>
      set({ storyModeActive: true, storyModeChapterIndex: 0 }),
    stopStoryMode: () =>
      set({ storyModeActive: false, storyModeChapterIndex: -1 }),
    nextStoryChapter: (total) =>
      set((s) => ({
        storyModeChapterIndex: Math.min(
          s.storyModeChapterIndex + 1,
          Math.max(total - 1, 0),
        ),
      })),
    prevStoryChapter: () =>
      set((s) => ({
        storyModeChapterIndex: Math.max(s.storyModeChapterIndex - 1, 0),
      })),
    setStoryChapterIndex: (i) => set({ storyModeChapterIndex: i }),
  }))
}
