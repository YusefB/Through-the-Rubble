import { describe, it, expectTypeOf } from 'vitest'
import type {
  Scene,
  SceneImage,
  ParallaxLayer,
  Chapter,
  Hotspot,
  SceneEngineProps,
} from './types'

describe('scene types', () => {
  it('Scene has the expected shape', () => {
    const s: Scene = {
      id: 's1',
      slug: 'main-street',
      title: 'Main Street',
      defaultBeforeAfter: 'after',
    }
    expectTypeOf(s.defaultBeforeAfter).toEqualTypeOf<'before' | 'after'>()
  })

  it('SceneImage requires altText and isReconstruction', () => {
    const img: SceneImage = {
      variant: 'after',
      url: '/img.webp',
      width: 1440,
      height: 3840,
      isReconstruction: false,
      altText: 'Main street as it stands today',
    }
    expectTypeOf(img.variant).toEqualTypeOf<'before' | 'after'>()
    expectTypeOf(img.isReconstruction).toBeBoolean()
  })

  it('ParallaxLayer has parallaxFactor', () => {
    const p: ParallaxLayer = {
      id: 'dust',
      url: '/dust.webp',
      width: 1440,
      height: 3840,
      parallaxFactor: 0.6,
    }
    expectTypeOf(p.parallaxFactor).toBeNumber()
  })

  it('Chapter normalizes scrollAnchorY to 0..1', () => {
    const c: Chapter = {
      id: 'c1',
      sceneId: 's1',
      order: 0,
      label: 'North block',
      scrollAnchorY: 0.25,
    }
    expectTypeOf(c.scrollAnchorY).toBeNumber()
  })

  it('Hotspot geometry uses normalized coords', () => {
    const h: Hotspot = {
      id: 'h1',
      sceneId: 's1',
      label: 'Collapsed apartment block',
      geometry: { x: 0.42, y: 0.33, r: 0.035 },
      type: 'story',
      priority: 'hero',
      visualState: 'always',
    }
    expectTypeOf(h.geometry.x).toBeNumber()
    expectTypeOf(h.visualState).toEqualTypeOf<
      'always' | 'after-only' | 'before-only'
    >()
  })

  it('SceneEngineProps requires scene + images + arrays', () => {
    type _check = SceneEngineProps['scene'] extends Scene ? true : false
    expectTypeOf<_check>().toEqualTypeOf<true>()
  })
})
