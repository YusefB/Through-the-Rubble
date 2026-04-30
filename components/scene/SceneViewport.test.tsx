import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type {
  Scene,
  SceneImage,
  ParallaxLayer,
  Chapter,
  Hotspot,
} from '@/lib/scene/types'
import { SceneViewport } from './SceneViewport'

vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(''),
}))

const scene: Scene = { id: 's', slug: 'main', title: 'Main Street', defaultBeforeAfter: 'after' }

const images: SceneImage[] = [
  { variant: 'before', url: '/before.webp', width: 1440, height: 3840, isReconstruction: true, reconstructionLabel: 'Reconstruction', altText: 'Main street in 2019' },
  { variant: 'after',  url: '/after.webp',  width: 1440, height: 3840, isReconstruction: false, altText: 'Main street today' },
]

const parallax: ParallaxLayer[] = [
  { id: 'dust', url: '/dust.webp', width: 1440, height: 3840, parallaxFactor: 0.6, opacity: 0.7, blendMode: 'screen' },
]

const chapters: Chapter[] = [
  { id: 'ch-1', sceneId: 's', order: 0, label: 'North block', scrollAnchorY: 0.2 },
  { id: 'ch-2', sceneId: 's', order: 1, label: 'Main road', scrollAnchorY: 0.6 },
]

const hotspots: Hotspot[] = [
  { id: 'h1', sceneId: 's', label: 'School', geometry: { x: 0.4, y: 0.3, r: 0.04 }, type: 'story', priority: 'hero', visualState: 'always' },
]

describe('SceneViewport', () => {
  it('renders before and after master layers', () => {
    render(<SceneViewport scene={scene} images={images} parallaxLayers={parallax} chapters={chapters} hotspots={hotspots} />)
    expect(screen.getByTestId('master-layer-before')).toBeInTheDocument()
    expect(screen.getByTestId('master-layer-after')).toBeInTheDocument()
  })

  it('renders parallax layers', () => {
    render(<SceneViewport scene={scene} images={images} parallaxLayers={parallax} chapters={chapters} hotspots={hotspots} />)
    expect(screen.getByTestId('parallax-layer-dust')).toBeInTheDocument()
  })

  it('renders chapter anchors for each chapter', () => {
    render(<SceneViewport scene={scene} images={images} parallaxLayers={parallax} chapters={chapters} hotspots={hotspots} />)
    expect(screen.getByTestId('chapter-anchor-ch-1')).toBeInTheDocument()
    expect(screen.getByTestId('chapter-anchor-ch-2')).toBeInTheDocument()
  })

  it('renders hotspots', () => {
    render(<SceneViewport scene={scene} images={images} parallaxLayers={parallax} chapters={chapters} hotspots={hotspots} />)
    expect(screen.getByRole('button', { name: /School/ })).toBeInTheDocument()
  })

  it('renders before/after toggle', () => {
    render(<SceneViewport scene={scene} images={images} parallaxLayers={parallax} chapters={chapters} hotspots={hotspots} />)
    expect(screen.getByRole('switch')).toBeInTheDocument()
  })

  it('renders reconstruction label when current image is a reconstruction', async () => {
    const user = userEvent.setup()
    render(<SceneViewport scene={{ ...scene, defaultBeforeAfter: 'before' }} images={images} parallaxLayers={parallax} chapters={chapters} hotspots={hotspots} />)
    expect(screen.getByRole('note', { name: /Visual reconstruction/i })).toBeInTheDocument()
    await user.click(screen.getByRole('switch'))
    expect(screen.queryByRole('note', { name: /Visual reconstruction/i })).not.toBeInTheDocument()
  })

  it('fires onHotspotOpen callback when a hotspot is clicked', async () => {
    const user = userEvent.setup()
    const onHotspotOpen = vi.fn()
    render(<SceneViewport scene={scene} images={images} parallaxLayers={parallax} chapters={chapters} hotspots={hotspots} onHotspotOpen={onHotspotOpen} />)
    await user.click(screen.getByRole('button', { name: /School/ }))
    expect(onHotspotOpen).toHaveBeenCalledWith('h1')
  })

  it('fires onToggleBeforeAfter when toggle is clicked', async () => {
    const user = userEvent.setup()
    const onToggle = vi.fn()
    render(<SceneViewport scene={scene} images={images} parallaxLayers={parallax} chapters={chapters} hotspots={hotspots} onToggleBeforeAfter={onToggle} />)
    await user.click(screen.getByRole('switch'))
    expect(onToggle).toHaveBeenCalledWith('before')
  })

  it('uses defaultBeforeAfter from scene when no initialBeforeAfter prop', () => {
    render(<SceneViewport scene={{ ...scene, defaultBeforeAfter: 'before' }} images={images} parallaxLayers={parallax} chapters={chapters} hotspots={hotspots} />)
    const sw = screen.getByRole('switch')
    expect(sw).toHaveAttribute('aria-checked', 'true')
  })

  it('initialBeforeAfter prop overrides scene default', () => {
    render(<SceneViewport scene={{ ...scene, defaultBeforeAfter: 'after' }} images={images} parallaxLayers={parallax} chapters={chapters} hotspots={hotspots} initialBeforeAfter="before" />)
    const sw = screen.getByRole('switch')
    expect(sw).toHaveAttribute('aria-checked', 'true')
  })
})
