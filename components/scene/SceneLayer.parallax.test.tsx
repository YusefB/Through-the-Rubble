import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { ParallaxLayer } from './SceneLayer'
import type { ParallaxLayer as ParallaxData } from '@/lib/scene/types'

const dust: ParallaxData = {
  id: 'dust',
  url: '/dust.webp',
  width: 1440,
  height: 3840,
  parallaxFactor: 0.6,
  opacity: 0.7,
  blendMode: 'screen',
}

describe('ParallaxLayer', () => {
  it('renders nothing when reduced=true', () => {
    const { container } = render(<ParallaxLayer layer={dust} reduced />)
    expect(container.firstChild).toBeNull()
  })

  it('renders an img with empty alt and role=presentation when not reduced', () => {
    render(<ParallaxLayer layer={dust} />)
    const img = document.querySelector('img[role="presentation"]')
    expect(img).not.toBeNull()
    expect(img?.getAttribute('alt')).toBe('')
  })

  it('applies opacity and blend mode from props', () => {
    render(<ParallaxLayer layer={dust} />)
    const wrap = document.querySelector('[data-testid="parallax-layer-dust"]') as HTMLElement
    expect(wrap.style.opacity).toBe('0.7')
    expect(wrap.style.mixBlendMode).toBe('screen')
  })
})
