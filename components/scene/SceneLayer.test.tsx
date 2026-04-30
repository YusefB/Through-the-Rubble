import { describe, it, expect } from 'vitest'
import { act, render, screen } from '@testing-library/react'
import { SceneStoreProvider, useSceneStoreApi } from '@/lib/scene/SceneStoreContext'
import { MasterLayer } from './SceneLayer'
import type { SceneImage } from '@/lib/scene/types'
import type { SceneStoreApi } from '@/lib/scene/store'

const beforeImg: SceneImage = {
  variant: 'before',
  url: '/before.webp',
  width: 1440,
  height: 3840,
  isReconstruction: true,
  reconstructionLabel: 'Reconstruction based on archival sources',
  altText: 'Main street in 2019',
}

const afterImg: SceneImage = {
  variant: 'after',
  url: '/after.webp',
  width: 1440,
  height: 3840,
  isReconstruction: false,
  altText: 'Main street today, after destruction',
}

function renderLayer(image: SceneImage, beforeAfter: 'before' | 'after') {
  return render(
    <SceneStoreProvider initial={{
      activeChapterId: null,
      beforeAfter,
      openHotspotId: null,
      reducedMotion: false,
    }}>
      <MasterLayer image={image} priority={image.variant === 'after'} />
    </SceneStoreProvider>
  )
}

describe('MasterLayer', () => {
  it('renders an img with the correct alt text', () => {
    renderLayer(afterImg, 'after')
    const img = screen.getByAltText('Main street today, after destruction')
    expect(img).toBeInTheDocument()
  })

  it('layer wrapper opacity is 1 when variant matches beforeAfter state', () => {
    renderLayer(afterImg, 'after')
    const wrapper = screen.getByTestId('master-layer-after')
    expect(wrapper.style.opacity).toBe('1')
  })

  it('layer wrapper opacity is 0 when variant does not match state', () => {
    renderLayer(beforeImg, 'after')
    const wrapper = screen.getByTestId('master-layer-before')
    expect(wrapper.style.opacity).toBe('0')
  })

  it('toggling store state flips opacity', () => {
    let storeApi: SceneStoreApi | null = null
    function StoreCapture() {
      storeApi = useSceneStoreApi()
      return null
    }

    render(
      <SceneStoreProvider initial={{
        activeChapterId: null,
        beforeAfter: 'after',
        openHotspotId: null,
        reducedMotion: false,
      }}>
        <StoreCapture />
        <MasterLayer image={beforeImg} />
      </SceneStoreProvider>
    )

    let wrapper = screen.getByTestId('master-layer-before')
    expect(wrapper.style.opacity).toBe('0')

    act(() => {
      storeApi!.getState().setBeforeAfter('before')
    })

    wrapper = screen.getByTestId('master-layer-before')
    expect(wrapper.style.opacity).toBe('1')
  })
})
