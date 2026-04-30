import type {
  Scene,
  SceneImage,
  ParallaxLayer,
  Chapter,
  Hotspot,
} from '@/lib/scene/types'

export const mockScene: Scene = {
  id: 'scene-main-street',
  slug: 'main-street',
  title: 'Main Street',
  defaultBeforeAfter: 'after',
}

export const mockImages: SceneImage[] = [
  {
    variant: 'before',
    url: '/scenes/main-street-before.webp',
    width: 1440,
    height: 3840,
    blurDataUrl:
      'data:image/webp;base64,UklGRmoAAABXRUJQVlA4IF4AAADQAwCdASoIABYAPxFysFAsJqSisAgBgCIJZwDE2BtjvdaDImAtZ0AA/tqdWTDcBFumHvFaMihFj5hYehEjkxU05qcPeiM0RMhYUhzJNGnfuGdiHMyAwjMjvjwqwAAA',
    isReconstruction: false,
    altText:
      'Shifa Ezz Eldine AlQassam Street in Gaza, photographed January 5, 2023, before the 2023-2025 war.',
    creditLine: 'Photo: Jaber Jehad Badwan / Wikimedia Commons (CC BY-SA 4.0)',
  },
  {
    variant: 'after',
    url: '/scenes/main-street-after.webp',
    width: 1440,
    height: 3840,
    blurDataUrl:
      'data:image/webp;base64,UklGRmwAAABXRUJQVlA4IGAAAACwAwCdASoIABYAPxFysFAsJqSisAgBgCIJQBOgA8npk8ZWKhJdkAD+VHJ+49txB7QOAoXkzA1MU8AiGtniaPEKnGYwlcmd/kkthm7p+ppsqrFledL3Xn6Si94grobAAAA',
    isReconstruction: false,
    altText:
      'Street-level destruction in Gaza during the 2023-2025 war, photographed February 22, 2025.',
    creditLine: 'Photo: Jaber Jehad Badwan / Wikimedia Commons (CC BY-SA 4.0)',
  },
]

export const mockParallax: ParallaxLayer[] = [
  { id: 'haze',  url: '/scenes/parallax-haze.webp',  width: 1440, height: 3840, parallaxFactor: 0.4, opacity: 0.5, blendMode: 'screen' },
  { id: 'dust',  url: '/scenes/parallax-dust.webp',  width: 1440, height: 3840, parallaxFactor: 0.7, opacity: 0.6, blendMode: 'screen' },
  { id: 'smoke', url: '/scenes/parallax-smoke.webp', width: 1440, height: 3840, parallaxFactor: 0.85, opacity: 0.45, blendMode: 'screen' },
]

export const mockChapters: Chapter[] = [
  {
    id: 'ch-north-block',
    sceneId: 'scene-main-street',
    order: 0,
    label: 'North block',
    scrollAnchorY: 0.12,
    narration:
      'Sample narration — The north block held mid-rise apartment buildings that anchored the neighbourhood for decades. The street level once carried steady foot traffic between the buildings and the small shops along the avenue.',
  },
  {
    id: 'ch-school',
    sceneId: 'scene-main-street',
    order: 1,
    label: 'School ruins',
    scrollAnchorY: 0.34,
    narration:
      'Sample narration — The local school sat at the centre of the block, serving children from the surrounding streets. Its grounds were a familiar gathering place for families before the area was emptied.',
  },
  {
    id: 'ch-shelter',
    sceneId: 'scene-main-street',
    order: 2,
    label: 'Shelter site',
    scrollAnchorY: 0.56,
    narration:
      'Sample narration — A shelter site was established here for residents who could not return home. Conditions are described by aid workers as crowded, with limited resources for those still arriving.',
  },
  {
    id: 'ch-aid',
    sceneId: 'scene-main-street',
    order: 3,
    label: 'Aid distribution',
    scrollAnchorY: 0.78,
    narration:
      'Sample narration — Aid distribution moved to this corner of the street after the original site became inaccessible. Volunteers and humanitarian organisations rotate through the location to meet ongoing need.',
  },
]

export const mockHotspots: Hotspot[] = [
  {
    id: 'h-apt-block',
    sceneId: 'scene-main-street',
    chapterId: 'ch-north-block',
    label: 'Collapsed apartment block',
    geometry: { x: 0.42, y: 0.18, r: 0.035 },
    type: 'story',
    priority: 'hero',
    visualState: 'always',
    drawer: {
      title: 'Collapsed apartment block',
      summary: 'A multi-storey residential building on the north corner reduced to rubble after sustained shelling.',
      body: 'Sample story: this block once housed dozens of families across several floors. Neighbours describe an active street with shops at ground level and balconies strung with laundry. After repeated strikes, the upper floors pancaked into the lower ones, and recovery teams continued working at the site for weeks.',
      sources: [
        { publisher: 'ReliefWeb', title: 'Damage assessment update for residential districts', url: 'https://example.org/reliefweb/damage-assessment-residential' },
        { publisher: 'UN OCHA', title: 'Humanitarian situation report', url: 'https://example.org/ocha/situation-report' },
      ],
      action: {
        category: 'read_more',
        label: 'Read full report',
        url: 'https://example.org/reports/main-street-north-block',
      },
    },
  },
  {
    id: 'h-school-ruins',
    sceneId: 'scene-main-street',
    chapterId: 'ch-school',
    label: 'School building ruins',
    geometry: { x: 0.62, y: 0.36, r: 0.035 },
    type: 'story',
    priority: 'primary',
    visualState: 'always',
    drawer: {
      title: 'School building ruins',
      summary: 'The neighbourhood primary school, damaged in successive strikes, with classrooms exposed to the open air.',
      body: 'Sample story: classes were suspended after the first strike, with students relocated to a temporary shelter. Documentation of attacks on educational facilities has been compiled by independent monitors, who note the long-term impact on access to schooling.',
      sources: [
        { publisher: 'Human Rights Watch', title: 'Attacks on schools: a pattern of harm', url: 'https://example.org/hrw/attacks-on-schools' },
        { publisher: 'UNICEF', title: 'Education under fire briefing', url: 'https://example.org/unicef/education-under-fire' },
        { publisher: 'ReliefWeb', title: 'Education cluster response plan', url: 'https://example.org/reliefweb/education-cluster' },
      ],
      action: {
        category: 'learn',
        label: 'Learn about education protection',
        url: 'https://example.org/learn/education-in-conflict',
      },
    },
  },
  {
    id: 'h-school-before',
    sceneId: 'scene-main-street',
    chapterId: 'ch-school',
    label: 'School playground (2019)',
    geometry: { x: 0.30, y: 0.34, r: 0.025 },
    type: 'story',
    priority: 'secondary',
    visualState: 'before-only',
    drawer: {
      title: 'School playground (2019)',
      summary: 'A view of the playground in its pre-war state, with painted hopscotch squares and a small football pitch.',
      body: 'Sample story: archival photography shows the playground in routine use during recess. Former teachers recall annual end-of-term gatherings here. The space is included in the reconstruction view to anchor the contrast with the present condition.',
      sources: [
        { publisher: 'Amnesty International', title: 'Cultural and educational heritage at risk', url: 'https://example.org/amnesty/cultural-heritage-risk' },
      ],
    },
  },
  {
    id: 'h-shelter',
    sceneId: 'scene-main-street',
    chapterId: 'ch-shelter',
    label: 'Displaced families shelter',
    geometry: { x: 0.50, y: 0.58, r: 0.030 },
    type: 'stat',
    priority: 'primary',
    visualState: 'after-only',
    drawer: {
      title: 'Displaced families shelter',
      summary: 'A makeshift shelter site hosting families displaced from surrounding districts.',
      body: 'Sample story: aid coordinators describe overcrowding, limited sanitation, and a shortage of winter supplies. Updated headcounts are issued weekly as new arrivals continue and onward movement is constrained by checkpoints.',
      sources: [
        { publisher: 'UN OCHA', title: 'Displacement tracking matrix update', url: 'https://example.org/ocha/displacement-tracking' },
        { publisher: 'ReliefWeb', title: 'Shelter cluster bulletin', url: 'https://example.org/reliefweb/shelter-cluster' },
      ],
      action: {
        category: 'support',
        label: 'Support shelter response',
        url: 'https://example.org/support/shelter-response',
      },
    },
  },
  {
    id: 'h-aid-tent',
    sceneId: 'scene-main-street',
    chapterId: 'ch-aid',
    label: 'Aid distribution tent',
    geometry: { x: 0.72, y: 0.80, r: 0.030 },
    type: 'action',
    priority: 'primary',
    visualState: 'after-only',
    drawer: {
      title: 'Aid distribution tent',
      summary: 'Weekly distributions of food parcels, hygiene kits, and infant supplies are run from this location.',
      body: 'Sample story: distributions rotate between this site and two others nearby to manage crowd density. Volunteers note that demand consistently exceeds the available stock, particularly for baby formula and warm clothing.',
      sources: [
        { publisher: 'ReliefWeb', title: 'Food security and distribution overview', url: 'https://example.org/reliefweb/food-security' },
        { publisher: 'Amnesty International', title: 'Access to humanitarian assistance', url: 'https://example.org/amnesty/humanitarian-access' },
      ],
      action: {
        category: 'donate',
        label: 'Donate to aid response',
        url: 'https://example.org/donate/aid-response',
      },
    },
  },
]
