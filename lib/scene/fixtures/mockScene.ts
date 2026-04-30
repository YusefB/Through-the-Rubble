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
  {
    id: 'ch-children',
    sceneId: 'scene-main-street',
    order: 4,
    label: 'Children of Gaza City',
    scrollAnchorY: 0.18,
    narration:
      'By October 2025, UNICEF reported that an estimated 64,000 children had been killed or maimed across Gaza, including more than 1,000 babies, in two years of war. Save the Children’s clinics counted a tenfold rise in acute malnutrition during the months of total siege.',
  },
  {
    id: 'ch-medical',
    sceneId: 'scene-main-street',
    order: 5,
    label: 'Medical staff and patients',
    scrollAnchorY: 0.42,
    narration:
      'On 5 April 2024, a WHO mission to al-Shifa found the once largest referral hospital in Gaza an "empty shell." By December 2024, the UN Human Rights Office documented at least 136 strikes on 27 hospitals across Gaza, with most facilities pushed to the brink of collapse.',
  },
  {
    id: 'ch-press',
    sceneId: 'scene-main-street',
    order: 6,
    label: 'Journalists in Gaza City',
    scrollAnchorY: 0.62,
    narration:
      'On the night of 10 August 2025, an Israeli strike on a press tent at the main gate of al-Shifa Hospital killed Al Jazeera correspondent Anas al-Sharif and four colleagues — part of a CPJ-documented toll of more than 200 journalists killed in Gaza since October 2023.',
  },
  {
    id: 'ch-water',
    sceneId: 'scene-main-street',
    order: 7,
    label: 'Water, food, and survival',
    scrollAnchorY: 0.74,
    narration:
      'On 22 August 2025, the IPC declared famine for the first time in Gaza Governorate, the area that includes Gaza City. Oxfam reported in 2024 that water available to Gazans had fallen by 94 percent — to less than a single toilet flush per person per day.',
  },
  {
    id: 'ch-rebuild',
    sceneId: 'scene-main-street',
    order: 8,
    label: 'What rebuilding looks like',
    scrollAnchorY: 0.90,
    narration:
      'After the October 2025 ceasefire, the Norwegian Refugee Council reported that aid agencies had been able to bring in tents for only a fraction of the 1.29 million Gazans needing shelter. UNRWA had documented some 282,904 housing units damaged or destroyed across the strip.',
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
  {
    id: 'h-children',
    sceneId: 'scene-main-street',
    chapterId: 'ch-children',
    label: "Children's loss in Gaza City",
    geometry: { x: 0.20, y: 0.22, r: 0.030 },
    type: 'stat',
    priority: 'primary',
    visualState: 'always',
    drawer: {
      title: "Children's loss and the WCNSF generation",
      summary:
        "By October 2025, UNICEF said an estimated 64,000 children had been killed or maimed across the Gaza Strip in two years of war.",
      body:
        'On 8 October 2025, marking two years since the war began, UNICEF Executive Director Catherine Russell stated that "a staggering 64,000 children have reportedly been killed or maimed across the Gaza Strip, including at least 1,000 babies." UN Women reported on 16 April 2024 that more than 10,000 Palestinian women had been killed, including an estimated 6,000 mothers, leaving roughly 19,000 children orphaned. MSF clinicians coined the acronym "WCNSF" — Wounded Child, No Surviving Family — to identify children arriving alone for medical care. On 6 September 2025, Save the Children reported that at least 20,000 Gaza children had been killed in 23 months — an average of more than one child every hour.',
      sources: [
        { publisher: 'UNICEF', title: "Two years of hellish war have devastated Gaza's children", url: 'https://www.unicef.org/press-releases/two-years-hellish-war-have-devastated-gazas-children' },
        { publisher: 'UN Women', title: 'Six months into the war on Gaza, over 10,000 women have been killed', url: 'https://www.unwomen.org/en/news-stories/press-release/2024/04/six-months-into-the-war-on-gaza-over-10000-women-have-been-killed' },
        { publisher: 'Save the Children', title: 'GAZA: 20,000 children killed in 23 months of war', url: 'https://www.savethechildren.net/news/gaza-20000-children-killed-23-months-war-more-one-child-killed-every-hour' },
      ],
      action: { category: 'learn', label: 'UNICEF: two years of war', url: 'https://www.unicef.org/press-releases/two-years-hellish-war-have-devastated-gazas-children' },
    },
  },
  {
    id: 'h-medical-staff',
    sceneId: 'scene-main-street',
    chapterId: 'ch-medical',
    label: 'Medical staff at al-Shifa',
    geometry: { x: 0.36, y: 0.30, r: 0.034 },
    type: 'stat',
    priority: 'primary',
    visualState: 'always',
    drawer: {
      title: 'Medical staff under siege at al-Shifa',
      summary:
        'WHO assessed al-Shifa Medical Complex as an "empty shell" on 5 April 2024 after the second siege; OHCHR documented at least 136 strikes on 27 hospitals across Gaza by 30 June 2024.',
      body:
        'On 5 April 2024, a WHO-led mission to al-Shifa Medical Complex on Izz al-Din al-Qassam Street described the hospital as "an empty shell," counting at least 115 burned beds and 14 destroyed incubators. On 31 December 2024, the UN Human Rights Office published a thematic report finding "at least 136 strikes on at least 27 hospitals and 12 other medical facilities" between 7 October 2023 and 30 June 2024. MSF reported its surgeon Dr. Mohammed Obeid sending a voice note from al-Shifa during the November 2023 siege: "We are alone now. No one hears us."',
      sources: [
        { publisher: 'WHO', title: 'Six months of war leave Al-Shifa hospital in ruins', url: 'https://www.who.int/news/item/06-04-2024-six-months-of-war-leave-al-shifa-hospital-in-ruins--who-mission-reports' },
        { publisher: 'OHCHR', title: 'Pattern of Israeli attacks on Gaza hospitals raises grave concerns', url: 'https://www.ohchr.org/en/press-releases/2024/12/pattern-israeli-attacks-gaza-hospitals-raises-grave-concerns-report' },
        { publisher: 'MSF', title: "A voice from Gaza's Al-Shifa Hospital", url: 'https://www.doctorswithoutborders.org/latest/voice-gazas-al-shifa-hospital-we-are-alone-now-no-one-hears-us' },
      ],
      action: { category: 'learn', label: 'WHO: al-Shifa assessment', url: 'https://www.who.int/news/item/06-04-2024-six-months-of-war-leave-al-shifa-hospital-in-ruins--who-mission-reports' },
    },
  },
  {
    id: 'h-press',
    sceneId: 'scene-main-street',
    chapterId: 'ch-press',
    label: 'Journalists killed at al-Shifa gate',
    geometry: { x: 0.52, y: 0.36, r: 0.030 },
    type: 'story',
    priority: 'primary',
    visualState: 'always',
    drawer: {
      title: 'Journalists killed at the al-Shifa gate',
      summary:
        'On 10 August 2025, an Israeli strike on a press tent at the main gate of al-Shifa Hospital killed five Al Jazeera staff.',
      body:
        'On the night of 10 August 2025, an Israeli strike hit a media tent at the main gate of al-Shifa Hospital in Gaza City, killing Al Jazeera correspondents Anas al-Sharif and Mohammed Qreiqeh, and cameramen Ibrahim Zaher, Mohammed Noufal and Moamen Aliwa. According to the Committee to Protect Journalists, more than 200 journalists and media workers had been killed in Gaza since October 2023, the deadliest period for the press in CPJ records since 1992. CPJ Regional Director Sara Qudah said journalists "cannot carry out their work — let alone survive — while being deliberately starved and denied life-saving aid."',
      sources: [
        { publisher: 'Wikipedia', title: 'Assassination of Anas Al-Sharif', url: 'https://en.wikipedia.org/wiki/Assassination_of_Anas_Al-Sharif' },
        { publisher: 'Al Jazeera English', title: 'Anas al-Sharif among four Al Jazeera journalists killed', url: 'https://www.aljazeera.com/news/2025/8/10/al-jazeera-journalist-anas-al-sharif-killed-in-israeli-attack-in-gaza-city' },
        { publisher: 'CPJ', title: 'Journalist casualties in the Israel-Gaza war', url: 'https://cpj.org/2023/10/journalist-casualties-in-the-israel-gaza-conflict/' },
      ],
      action: { category: 'learn', label: 'CPJ: Gaza press casualties', url: 'https://cpj.org/2023/10/journalist-casualties-in-the-israel-gaza-conflict/' },
    },
  },
  {
    id: 'h-cultural-center',
    sceneId: 'scene-main-street',
    chapterId: 'ch-rebuild',
    label: 'Rashad al-Shawa Cultural Center',
    geometry: { x: 0.66, y: 0.30, r: 0.028 },
    type: 'story',
    priority: 'secondary',
    visualState: 'always',
    drawer: {
      title: 'The Rashad al-Shawa Cultural Center',
      summary:
        "The Rashad Shawa Cultural Center, a 1985 landmark in Gaza City's Rimal district, was found reduced to rubble during the November 2023 humanitarian pause.",
      body:
        "The Rashad Shawa Cultural Center, completed in 1988 in Gaza City's Rimal district, housed the Tamari Sabbagh Library, a stage for films and performances and a hall used for civic life. It was named for Rashad al-Shawa, a former mayor of Gaza, and designed by Syrian architect Sa'ad Mohaffel. International leaders including Nelson Mandela, Jacques Chirac and Bill Clinton spoke there. During a brief humanitarian pause in November 2023, journalists and residents found the building had been reduced to rubble. On 14 January 2024, Al Jazeera published an inventory of damaged or destroyed Gaza heritage sites.",
      sources: [
        { publisher: 'Wikipedia', title: 'Rashad Shawa Cultural Center', url: 'https://en.wikipedia.org/wiki/Rashad_Shawa_Cultural_Center' },
        { publisher: 'Anadolu Agency', title: 'Humanitarian pause reveals destruction of Rashad Al-Shawwa Cultural Center', url: 'https://www.aa.com.tr/en/middle-east/humanitarian-pause-reveals-destruction-of-rashad-al-shawwa-cultural-center-in-gaza-by-israel/3064948' },
        { publisher: 'Al Jazeera English', title: "A 'cultural genocide': Which of Gaza's heritage sites have been destroyed?", url: 'https://www.aljazeera.com/news/2024/1/14/a-cultural-genocide-which-of-gazas-heritage-sites-have-been-destroyed' },
      ],
      action: { category: 'learn', label: 'Wikipedia: Rashad Shawa Center', url: 'https://en.wikipedia.org/wiki/Rashad_Shawa_Cultural_Center' },
    },
  },
  {
    id: 'h-water',
    sceneId: 'scene-main-street',
    chapterId: 'ch-water',
    label: 'Water and sanitation',
    geometry: { x: 0.30, y: 0.62, r: 0.030 },
    type: 'stat',
    priority: 'primary',
    visualState: 'always',
    drawer: {
      title: 'Water and sanitation collapse',
      summary:
        'Oxfam reported in July 2024 that water available to people in Gaza had fallen by 94 percent, to roughly 4.74 liters per person per day.',
      body:
        'On 17 July 2024, Oxfam published its Water War Crimes report, finding water available to people in Gaza had been reduced by 94 percent, to about 4.74 liters per person per day — "less than a single toilet flush" and just under a third of the WHO emergency minimum. Oxfam documented water and sanitation infrastructure damaged or destroyed at a rate of five sites every three days. The ICRC stated, through Gaza sub-delegation head William Schomburg on 11 October 2023, that "the destruction affecting hospitals in Gaza is becoming unbearable and needs to stop."',
      sources: [
        { publisher: 'Oxfam International', title: 'Israel using water as weapon of war', url: 'https://www.oxfam.org/en/press-releases/israel-using-water-weapon-war-gaza-supply-plummets-94-creating-deadly-health' },
        { publisher: 'Oxfam International', title: 'Less than seven percent of pre-conflict water levels available', url: 'https://www.oxfam.org/en/press-releases/less-seven-percent-pre-conflict-water-levels-available-rafah-and-north-gaza' },
        { publisher: 'ICRC', title: 'ICRC demands protection of patients, healthcare workers, medical facilities', url: 'https://www.icrc.org/en/document/israel-and-occupied-territories-icrc-demands-protection-patients-healthcare-workers-medical-facilities-in-gaza' },
      ],
      action: { category: 'learn', label: 'Oxfam: water down 94 percent', url: 'https://www.oxfam.org/en/press-releases/israel-using-water-weapon-war-gaza-supply-plummets-94-creating-deadly-health' },
    },
  },
  {
    id: 'h-famine',
    sceneId: 'scene-main-street',
    chapterId: 'ch-water',
    label: 'Famine declared in Gaza Governorate',
    geometry: { x: 0.46, y: 0.66, r: 0.034 },
    type: 'stat',
    priority: 'primary',
    visualState: 'always',
    drawer: {
      title: 'Famine declared in Gaza Governorate',
      summary:
        'On 22 August 2025, the IPC confirmed famine in Gaza Governorate — the area that includes Gaza City — the first time famine has been officially declared in the Middle East.',
      body:
        'On 22 August 2025, the Integrated Food Security Phase Classification (IPC) confirmed famine in Gaza Governorate, with projections that Deir al-Balah and Khan Yunis would meet the threshold within a month. WHO Director-General Dr. Tedros Adhanom Ghebreyesus said: "A ceasefire is an absolute and moral imperative now." UN Secretary-General António Guterres called the famine "a failure of humanity itself." On 19 December 2025, after the October ceasefire and increased aid, the IPC reported no part of Gaza was currently classified in famine, although roughly 1.6 million people still faced high levels of acute food insecurity.',
      sources: [
        { publisher: 'WHO', title: 'Famine confirmed for first time in Gaza', url: 'https://www.who.int/news/item/22-08-2025-famine-confirmed-for-first-time-in-gaza' },
        { publisher: 'IPC', title: 'GAZA STRIP: Famine confirmed in Gaza Governorate, projected to expand', url: 'https://www.ipcinfo.org/ipcinfo-website/countries-in-focus-archive/issue-134/en/' },
        { publisher: 'UN News', title: 'Famine in Gaza: A failure of humanity itself', url: 'https://news.un.org/en/story/2025/08/1165702' },
      ],
      action: { category: 'learn', label: 'IPC: famine confirmed', url: 'https://www.ipcinfo.org/ipcinfo-website/countries-in-focus-archive/issue-134/en/' },
    },
  },
  {
    id: 'h-women',
    sceneId: 'scene-main-street',
    chapterId: 'ch-children',
    label: 'Women and girls in Gaza',
    geometry: { x: 0.62, y: 0.62, r: 0.030 },
    type: 'stat',
    priority: 'secondary',
    visualState: 'always',
    drawer: {
      title: 'Women, mothers, and girls',
      summary:
        'By April 2024, UN Women reported that more than 10,000 Palestinian women had been killed in Gaza, including an estimated 6,000 mothers, leaving roughly 19,000 children orphaned.',
      body:
        'On 16 April 2024, UN Women issued a Gender Alert finding that "more than 10,000 women have been killed" in Gaza, including "an estimated 6,000 mothers, leaving 19,000 children orphaned." UN Women\'s Regional Director for the Arab States, Susanne Mikhail, stated: "the war in Gaza is no doubt a war on women." The same release said more than one million Palestinian women and girls were facing "catastrophic hunger." UN Women\'s January 2024 Gender Alert documented a near-total absence of safe water, sanitation, and menstrual hygiene supplies for women and girls.',
      sources: [
        { publisher: 'UN Women', title: 'Six months into the war on Gaza, over 10,000 women have been killed', url: 'https://www.unwomen.org/en/news-stories/press-release/2024/04/six-months-into-the-war-on-gaza-over-10000-women-have-been-killed' },
        { publisher: 'UN Women', title: 'Gender alert: The gendered impact of the crisis in Gaza', url: 'https://www.unwomen.org/en/digital-library/publications/2024/01/gender-alert-the-gendered-impact-of-the-crisis-in-gaza' },
      ],
      action: { category: 'learn', label: 'UN Women: 6,000 mothers killed', url: 'https://www.unwomen.org/en/news-stories/press-release/2024/04/six-months-into-the-war-on-gaza-over-10000-women-have-been-killed' },
    },
  },
  {
    id: 'h-shelter-tent',
    sceneId: 'scene-main-street',
    chapterId: 'ch-rebuild',
    label: 'Shelter aid blocked',
    geometry: { x: 0.78, y: 0.66, r: 0.030 },
    type: 'stat',
    priority: 'secondary',
    visualState: 'always',
    drawer: {
      title: 'After the ceasefire: shelter aid blocked',
      summary:
        'Three weeks into the October 2025 ceasefire, the Norwegian Refugee Council reported that 23 requests from nine aid agencies for shelter supplies had been rejected, leaving roughly 260,000 families without adequate cover.',
      body:
        'On 30 October 2025, the Norwegian Refugee Council reported that three weeks into the ceasefire, Israeli authorities had rejected 23 requests from nine aid agencies to bring in "urgently needed shelter supplies such as tents, sealing and framing kits, bedding, kitchen sets, and blankets, amounting to nearly 4,000 pallets," leaving "around 260,000 Palestinian families, equal to nearly 1.5 million people, exposed to worsening conditions." NRC\'s June 2025 update described the shelter response as "on the brink of total breakdown." OCHA reported that on 9 September 2025 the Israeli military had ordered all residents of Gaza City to evacuate via the coastal road to Al Mawasi.',
      sources: [
        { publisher: 'NRC', title: 'Three weeks into ceasefire, Gaza shelter aid still blocked', url: 'https://www.nrc.no/news/2025/october/three-weeks-into-ceasefire-gaza-shelter-aid-still-blocked-as-winter-nears' },
        { publisher: 'NRC', title: 'Three months since ceasefire collapse, the shelter response faces total breakdown', url: 'https://www.nrc.no/news/2025/june/gaza-three-months-since-ceasefire-collapse-the-shelter-response-faces-total-breakdown' },
        { publisher: 'UN OCHA', title: 'Humanitarian Situation Update #321', url: 'https://www.ochaopt.org/content/humanitarian-situation-update-321-gaza-strip' },
      ],
      action: { category: 'support', label: 'NRC: shelter aid blocked', url: 'https://www.nrc.no/news/2025/october/three-weeks-into-ceasefire-gaza-shelter-aid-still-blocked-as-winter-nears' },
    },
  },
]
