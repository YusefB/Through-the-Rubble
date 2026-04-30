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

  it('multiple stores are independent', () => {
    const a = createSceneStore({ activeChapterId: null, beforeAfter: 'after', openHotspotId: null, reducedMotion: false })
    const b = createSceneStore({ activeChapterId: null, beforeAfter: 'after', openHotspotId: null, reducedMotion: false })
    a.getState().setBeforeAfter('before')
    expect(a.getState().beforeAfter).toBe('before')
    expect(b.getState().beforeAfter).toBe('after')
  })
})
