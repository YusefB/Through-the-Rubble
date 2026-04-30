import { describe, it, expect, beforeEach } from 'vitest'
import { createSceneStore, type SceneStoreApi } from './store'

describe('sceneStore', () => {
  let useStore: SceneStoreApi

  beforeEach(() => {
    useStore = createSceneStore({
      activeChapterId: null,
      beforeAfter: 'after',
      openHotspotId: null,
      reducedMotion: false,
    })
  })

  it('initializes with provided values', () => {
    const s = useStore.getState()
    expect(s.beforeAfter).toBe('after')
    expect(s.activeChapterId).toBeNull()
    expect(s.openHotspotId).toBeNull()
    expect(s.reducedMotion).toBe(false)
  })

  it('initializes story mode defaults when not provided', () => {
    const s = useStore.getState()
    expect(s.storyModeActive).toBe(false)
    expect(s.storyModeChapterIndex).toBe(-1)
  })

  it('toggleBeforeAfter flips between before and after', () => {
    useStore.getState().toggleBeforeAfter()
    expect(useStore.getState().beforeAfter).toBe('before')
    useStore.getState().toggleBeforeAfter()
    expect(useStore.getState().beforeAfter).toBe('after')
  })

  it('setBeforeAfter sets explicit value', () => {
    useStore.getState().setBeforeAfter('before')
    expect(useStore.getState().beforeAfter).toBe('before')
    useStore.getState().setBeforeAfter('after')
    expect(useStore.getState().beforeAfter).toBe('after')
  })

  it('setActiveChapter updates active chapter', () => {
    useStore.getState().setActiveChapter('chapter-1')
    expect(useStore.getState().activeChapterId).toBe('chapter-1')
  })

  it('openHotspot and closeHotspot update openHotspotId', () => {
    useStore.getState().openHotspot('h1')
    expect(useStore.getState().openHotspotId).toBe('h1')
    useStore.getState().closeHotspot()
    expect(useStore.getState().openHotspotId).toBeNull()
  })

  it('setReducedMotion updates value', () => {
    useStore.getState().setReducedMotion(true)
    expect(useStore.getState().reducedMotion).toBe(true)
  })

  it('startStoryMode sets active=true and index=0', () => {
    useStore.getState().startStoryMode()
    const s = useStore.getState()
    expect(s.storyModeActive).toBe(true)
    expect(s.storyModeChapterIndex).toBe(0)
  })

  it('stopStoryMode sets active=false and index=-1', () => {
    useStore.getState().startStoryMode()
    useStore.getState().stopStoryMode()
    const s = useStore.getState()
    expect(s.storyModeActive).toBe(false)
    expect(s.storyModeChapterIndex).toBe(-1)
  })

  it('nextStoryChapter increments index and clamps at total - 1', () => {
    useStore.getState().startStoryMode()
    useStore.getState().nextStoryChapter(3)
    expect(useStore.getState().storyModeChapterIndex).toBe(1)
    useStore.getState().nextStoryChapter(3)
    expect(useStore.getState().storyModeChapterIndex).toBe(2)
    useStore.getState().nextStoryChapter(3)
    expect(useStore.getState().storyModeChapterIndex).toBe(2)
  })

  it('prevStoryChapter decrements index and clamps at 0', () => {
    useStore.getState().setStoryChapterIndex(2)
    useStore.getState().prevStoryChapter()
    expect(useStore.getState().storyModeChapterIndex).toBe(1)
    useStore.getState().prevStoryChapter()
    expect(useStore.getState().storyModeChapterIndex).toBe(0)
    useStore.getState().prevStoryChapter()
    expect(useStore.getState().storyModeChapterIndex).toBe(0)
  })

  it('setStoryChapterIndex sets explicit value', () => {
    useStore.getState().setStoryChapterIndex(2)
    expect(useStore.getState().storyModeChapterIndex).toBe(2)
    useStore.getState().setStoryChapterIndex(0)
    expect(useStore.getState().storyModeChapterIndex).toBe(0)
  })

  it('multiple stores are independent', () => {
    const a = createSceneStore({ activeChapterId: null, beforeAfter: 'after', openHotspotId: null, reducedMotion: false })
    const b = createSceneStore({ activeChapterId: null, beforeAfter: 'after', openHotspotId: null, reducedMotion: false })
    a.getState().setBeforeAfter('before')
    expect(a.getState().beforeAfter).toBe('before')
    expect(b.getState().beforeAfter).toBe('after')
  })
})
