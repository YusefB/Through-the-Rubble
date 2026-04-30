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
  title: 'Ezz Eldine al-Qassam Street, Gaza City',
  defaultBeforeAfter: 'after',
}

export const mockImages: SceneImage[] = [
  {
    variant: 'before',
    url: '/scenes/main-street-before.webp',
    width: 1440,
    height: 1800,
    blurDataUrl:
      'data:image/webp;base64,UklGRkgAAABXRUJQVlA4IDwAAADQAQCdASoIAAoABABoJZQC7ADzfuKjQAD45UdKT53aYzQBkFStSoy1pQVtqlXbjFkjFzbLAXOFr6XwAAA=',
    isReconstruction: false,
    altText:
      'Shifa Ezz Eldine AlQassam Street in Gaza, photographed January 5, 2023, before the 2023-2025 war.',
    creditLine: 'Photo: Jaber Jehad Badwan / Wikimedia Commons (CC BY-SA 4.0)',
  },
  {
    variant: 'after',
    url: '/scenes/main-street-after.webp',
    width: 1440,
    height: 1800,
    blurDataUrl:
      'data:image/webp;base64,UklGRkwAAABXRUJQVlA4IEAAAADwAQCdASoIAAoABABoJZACdAEO7o3M1oAA/eNg/liXIEYR68hGpg2qd5MYAgq//XeHLzCymaej04Ij1FWfAAAA',
    isReconstruction: false,
    altText:
      'Street-level destruction in Gaza during the 2023-2025 war, photographed February 22, 2025.',
    creditLine: 'Photo: Jaber Jehad Badwan / Wikimedia Commons (CC BY-SA 4.0)',
  },
]

export const mockParallax: ParallaxLayer[] = [
  { id: 'haze',  url: '/scenes/parallax-haze.webp',  width: 1440, height: 1800, parallaxFactor: 0.4, opacity: 0.5, blendMode: 'screen' },
  { id: 'dust',  url: '/scenes/parallax-dust.webp',  width: 1440, height: 1800, parallaxFactor: 0.7, opacity: 0.6, blendMode: 'screen' },
  { id: 'smoke', url: '/scenes/parallax-smoke.webp', width: 1440, height: 1800, parallaxFactor: 0.85, opacity: 0.45, blendMode: 'screen' },
]

export const mockChapters: Chapter[] = [
  {
    id: 'ch-north-block',
    sceneId: 'scene-main-street',
    order: 0,
    label: 'al-Shifa Medical Complex quarter',
    scrollAnchorY: 0.12,
    narration:
      'The northern stretch of the street runs alongside the al-Shifa Medical Complex, established in 1946 and Gaza’s largest hospital before the war. A WHO-led assessment on 5 April 2024 found most buildings "largely damaged or destroyed" and most equipment "unusable or burned to ashes."',
  },
  {
    id: 'ch-school',
    sceneId: 'scene-main-street',
    order: 1,
    label: 'Schools and shelter blocks',
    scrollAnchorY: 0.34,
    narration:
      'Further south, the corridor is dotted with schools that, since October 2023, have served as displacement shelters. UNRWA reported in mid-2024 that two-thirds of its schools across Gaza had been hit, and that 95 percent of those struck were sheltering displaced families at the time.',
  },
  {
    id: 'ch-shelter',
    sceneId: 'scene-main-street',
    order: 2,
    label: 'Residential blocks and shelter sites',
    scrollAnchorY: 0.56,
    narration:
      'Per Human Rights Watch, citing UN figures, roughly 87 percent of housing units and schools across Gaza had been damaged or destroyed by October 2024, and about 1.9 million of Gaza’s 2.2 million Palestinians had been displaced at least once since October 2023.',
  },
  {
    id: 'ch-aid',
    sceneId: 'scene-main-street',
    order: 3,
    label: 'Aid distribution and return',
    scrollAnchorY: 0.78,
    narration:
      'Following the 19 January 2025 ceasefire, OCHA reported over 376,000 people returned to northern Gaza after Israeli forces withdrew from the Netzarim corridor. Aid access expanded, but humanitarian partners described the shelter and food deficit as severe.',
  },
]

export const mockHotspots: Hotspot[] = [
  {
    id: 'h-apt-block',
    sceneId: 'scene-main-street',
    chapterId: 'ch-north-block',
    label: 'Apartments along the al-Shifa frontage',
    geometry: { x: 0.42, y: 0.18, r: 0.035 },
    type: 'story',
    priority: 'hero',
    visualState: 'always',
    drawer: {
      title: 'Apartments along the al-Shifa frontage',
      summary:
        'Residential blocks immediately adjacent to the al-Shifa Medical Complex were damaged during two prolonged military operations in late 2023 and again in March-April 2024.',
      body:
        'Al-Shifa Medical Complex, founded in 1946, sits on Izz al-Din al-Qassam Street in Gaza City’s Rimal district. The hospital and surrounding blocks were the focus of two extended Israeli military operations: an 11 to 24 November 2023 siege and a second operation from 18 March to 1 April 2024. On 5 April 2024, a WHO-led assessment mission described most buildings as "largely damaged or destroyed." Reporting cited in the same Wikipedia summary describes the surrounding residential area as having been "rendered beyond recognition." In December 2024, Amnesty International published a 296-page report concluding that Israel was committing genocide against Palestinians in Gaza, drawing on satellite imagery and 212 interviews.',
      sources: [
        { publisher: 'Wikipedia', title: 'Al-Shifa Hospital', url: 'https://en.wikipedia.org/wiki/Al-Shifa_Hospital' },
        { publisher: 'Wikipedia', title: 'Al-Shifa Hospital siege', url: 'https://en.wikipedia.org/wiki/Al-Shifa_Hospital_siege' },
        { publisher: 'Wikipedia', title: 'Rimal', url: 'https://en.wikipedia.org/wiki/Rimal' },
        {
          publisher: 'Amnesty International',
          title: 'Amnesty International concludes Israel is committing genocide against Palestinians in Gaza',
          url: 'https://www.amnesty.org/en/latest/news/2024/12/amnesty-international-concludes-israel-is-committing-genocide-against-palestinians-in-gaza/',
        },
      ],
      action: { category: 'learn', label: 'Read the al-Shifa siege summary', url: 'https://en.wikipedia.org/wiki/Al-Shifa_Hospital_siege' },
    },
  },
  {
    id: 'h-school-ruins',
    sceneId: 'scene-main-street',
    chapterId: 'ch-school',
    label: 'Schools after the strikes',
    geometry: { x: 0.62, y: 0.36, r: 0.035 },
    type: 'story',
    priority: 'primary',
    visualState: 'always',
    drawer: {
      title: 'Schools after the strikes',
      summary:
        'By August 2025, Human Rights Watch reported that 97 percent of Gaza’s school buildings (547 of 564) had sustained damage and 76 percent had been directly hit since October 2023.',
      body:
        'On 21 September 2024, an Israeli strike on al-Zeitoun C School in Gaza City reportedly killed at least 34 people, including at least 21 children, with munition remnants identified by Human Rights Watch as a US-produced GBU-39 Small Diameter Bomb. HRW found no military targets at either of the two schools it investigated in detail. By July 2024, UNRWA said "two thirds of UNRWA schools in Gaza have been hit, some were bombed out, many severely damaged." UNRWA Commissioner-General Philippe Lazzarini noted that at peak, around one million displaced people had sheltered in UNRWA schools. Most schools, UNRWA stated, can no longer be used for education.',
      sources: [
        {
          publisher: 'Human Rights Watch',
          title: 'Gaza: Israeli School Strikes Magnify Civilian Peril',
          url: 'https://www.hrw.org/news/2025/08/07/gaza-israeli-school-strikes-magnify-civilian-peril',
        },
        {
          publisher: 'UN News',
          title: 'Schools "bombed-out" in latest Gaza escalation, says UNRWA chief',
          url: 'https://news.un.org/en/story/2024/07/1151921',
        },
      ],
      action: { category: 'learn', label: 'HRW: school strikes investigation', url: 'https://www.hrw.org/news/2025/08/07/gaza-israeli-school-strikes-magnify-civilian-peril' },
    },
  },
  {
    id: 'h-school-before',
    sceneId: 'scene-main-street',
    chapterId: 'ch-school',
    label: 'Schools as shelters',
    geometry: { x: 0.30, y: 0.34, r: 0.025 },
    type: 'story',
    priority: 'secondary',
    visualState: 'before-only',
    drawer: {
      title: 'Schools as shelters',
      summary:
        'From October 2023 onward, UNRWA closed its schools and converted most of them into shelters; at the peak, roughly one million displaced people stayed in these buildings.',
      body:
        'Before the war, UNRWA operated schools across Gaza serving hundreds of thousands of children. After 7 October 2023, the agency closed schools and turned most into emergency shelters for displaced families. UNRWA has since reported that 95 percent of schools that were used as shelters have been hit while sheltering displaced people. Where buildings remain partially intact, UNRWA has tried to resume informal learning. According to the agency, by 2025 it was running approximately 251 Temporary Learning Spaces, including in Gaza City and North Gaza, reaching over 38,000 children. Per HRW, by August 2025, 97 percent of Gaza’s school buildings had sustained damage.',
      sources: [
        { publisher: 'UN News', title: 'Schools "bombed-out" in latest Gaza escalation, says UNRWA chief', url: 'https://news.un.org/en/story/2024/07/1151921' },
        {
          publisher: 'UNRWA',
          title: 'UNRWA Situation Report #204',
          url: 'https://www.unrwa.org/resources/reports/unrwa-situation-report-204-situation-gaza-strip-and-west-bank-including-east-jerusalem',
        },
        {
          publisher: 'Human Rights Watch',
          title: 'Gaza: Israeli School Strikes Magnify Civilian Peril',
          url: 'https://www.hrw.org/news/2025/08/07/gaza-israeli-school-strikes-magnify-civilian-peril',
        },
      ],
    },
  },
  {
    id: 'h-shelter',
    sceneId: 'scene-main-street',
    chapterId: 'ch-shelter',
    label: 'Displacement and shelter in Gaza City',
    geometry: { x: 0.50, y: 0.58, r: 0.030 },
    type: 'stat',
    priority: 'primary',
    visualState: 'after-only',
    drawer: {
      title: 'Displacement and shelter in Gaza City',
      summary:
        'OCHA recorded more than 246,800 displacement movements in Gaza between mid-August and 17 September 2025 amid intensified operations in Gaza City, with most people moving from north to south.',
      body:
        'Gaza City has seen repeated cycles of displacement since October 2023. Per Human Rights Watch, citing UN figures, by October 2024 about 1.9 million of Gaza’s 2.2 million Palestinians had been displaced and roughly 87 percent of housing units and schools were damaged or destroyed. UNOSAT’s December 2024 satellite assessment counted more than 170,000 affected structures across Gaza, with over 60,000 destroyed. In September 2025, OCHA reported that on 10 September Israeli authorities ordered all civilians in Gaza City to relocate to Al Mawasi; in the following week alone roughly 125,600 displacement movements were recorded. Eleven UNRWA premises sheltering an estimated 11,000 people sustained damage between 11 and 16 September 2025.',
      sources: [
        {
          publisher: 'Human Rights Watch',
          title: 'North Gaza: Between Death and Displacement',
          url: 'https://www.hrw.org/news/2024/10/18/north-gaza-between-death-and-displacement',
        },
        {
          publisher: 'UNOSAT (via ReliefWeb)',
          title: 'UNOSAT Gaza Strip 8th Comprehensive Damage Assessment - July 2024',
          url: 'https://reliefweb.int/map/occupied-palestinian-territory/unosat-gaza-strip-8th-comprehensive-damage-assessment-july-2024',
        },
        { publisher: 'UN OCHA', title: 'Humanitarian Situation Update #323 | Gaza Strip', url: 'https://www.ochaopt.org/content/humanitarian-situation-update-323-gaza-strip' },
      ],
      action: { category: 'support', label: 'Support UNRWA shelter response', url: 'https://donate.unrwa.org/' },
    },
  },
  {
    id: 'h-aid-tent',
    sceneId: 'scene-main-street',
    chapterId: 'ch-aid',
    label: 'After the ceasefire: returns and aid',
    geometry: { x: 0.72, y: 0.80, r: 0.030 },
    type: 'action',
    priority: 'primary',
    visualState: 'after-only',
    drawer: {
      title: 'After the ceasefire: returns and aid',
      summary:
        'Following the 19 January 2025 ceasefire, OCHA reported that over 376,000 people returned to northern Gaza, and access for humanitarian agencies expanded.',
      body:
        'OCHA reported that a ceasefire between Israel and Palestinian armed groups took effect at 11:15 on 19 January 2025, mediated by Egypt, Qatar, and the United States. After Israeli forces withdrew from the Netzarim corridor, more than 376,000 displaced people walked north toward their homes; OCHA cited media reports indicating that 250 people had been admitted to hospital for exhaustion during the journey, and one elderly man reportedly died on the way. Coordination requirements for most aid missions were eased, allowing partners to reach areas previously inaccessible. Shelter remained scarce: a later OCHA update for 28 September to 11 October 2025 described approximately 1.5 million people still in need of shelter assistance.',
      sources: [
        { publisher: 'UN OCHA', title: 'Humanitarian Situation Update #259 | Gaza Strip', url: 'https://www.ochaopt.org/content/humanitarian-situation-update-259-gaza-strip' },
        {
          publisher: 'UN OCHA',
          title: 'Gaza Humanitarian Response Update | 28 September - 11 October 2025',
          url: 'https://www.unocha.org/publications/report/occupied-palestinian-territory/gaza-humanitarian-response-update-28-september-11-october-2025',
        },
      ],
      action: { category: 'donate', label: 'Donate to humanitarian relief', url: 'https://donate.unrwa.org/' },
    },
  },
]
