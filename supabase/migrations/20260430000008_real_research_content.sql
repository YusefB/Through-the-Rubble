-- Replace placeholder demo content with real, sourced documentary text.
-- Research output preserved at supabase/migrations/research-source-2026-04-30.json
-- Tone: documentary, restrained, attribution-first.
-- All claims trace to UN OCHA, UN News, UNRWA, ReliefWeb/UNOSAT, HRW, Amnesty,
-- or English Wikipedia. Date stamps preserved where given by sources.
--
-- Location: Ezz Eldine al-Qassam Street in Gaza City, near the al-Shifa
-- Medical Complex (Rimal district). The 'before' photograph by Jaber Jehad
-- Badwan was taken on this street in January 2023. The hospital and surrounding
-- blocks were the focus of two prolonged Israeli military operations
-- (November 2023 siege; March-April 2024 second operation), and a January
-- 2025 ceasefire allowed displaced people to return to northern Gaza.

update public.scenes
  set title = 'Ezz Eldine al-Qassam Street, Gaza City'
where id = 'scene-main-street';

update public.chapters set
  label = 'al-Shifa Medical Complex quarter',
  narration = 'The northern stretch of the street runs alongside the al-Shifa Medical Complex, established in 1946 and Gaza''s largest hospital before the war. A WHO-led assessment on 5 April 2024 found most buildings "largely damaged or destroyed" and most equipment "unusable or burned to ashes."'
where id = 'ch-north-block';

update public.chapters set
  label = 'Schools and shelter blocks',
  narration = 'Further south, the corridor is dotted with schools that, since October 2023, have served as displacement shelters. UNRWA reported in mid-2024 that two-thirds of its schools across Gaza had been hit, and that 95 percent of those struck were sheltering displaced families at the time.'
where id = 'ch-school';

update public.chapters set
  label = 'Residential blocks and shelter sites',
  narration = 'Per Human Rights Watch, citing UN figures, roughly 87 percent of housing units and schools across Gaza had been damaged or destroyed by October 2024, and about 1.9 million of Gaza''s 2.2 million Palestinians had been displaced at least once since October 2023.'
where id = 'ch-shelter';

update public.chapters set
  label = 'Aid distribution and return',
  narration = 'Following the 19 January 2025 ceasefire, OCHA reported over 376,000 people returned to northern Gaza after Israeli forces withdrew from the Netzarim corridor. Aid access expanded, but humanitarian partners described the shelter and food deficit as severe.'
where id = 'ch-aid';

delete from public.story_sources;
delete from public.source_registry;

insert into public.source_registry (id, publisher, title, url, url_hash, published_at, acquisition_mode) values
  ('src-wiki-shifa',           'Wikipedia',                  'Al-Shifa Hospital',                                                                                       'https://en.wikipedia.org/wiki/Al-Shifa_Hospital',                                                              'wiki-shifa',           null,                       'manual'),
  ('src-wiki-shifa-siege',     'Wikipedia',                  'Al-Shifa Hospital siege',                                                                                 'https://en.wikipedia.org/wiki/Al-Shifa_Hospital_siege',                                                        'wiki-shifa-siege',     null,                       'manual'),
  ('src-wiki-rimal',           'Wikipedia',                  'Rimal',                                                                                                   'https://en.wikipedia.org/wiki/Rimal',                                                                          'wiki-rimal',           null,                       'manual'),
  ('src-un-news-schools',      'UN News (citing UNRWA)',     'Schools "bombed-out" in latest Gaza escalation, says UNRWA chief',                                        'https://news.un.org/en/story/2024/07/1151921',                                                                 'un-news-schools',      '2024-07-10T00:00:00Z',     'manual'),
  ('src-hrw-north-gaza',       'Human Rights Watch',         'North Gaza: Between Death and Displacement',                                                              'https://www.hrw.org/news/2024/10/18/north-gaza-between-death-and-displacement',                                'hrw-north-gaza',       '2024-10-18T00:00:00Z',     'manual'),
  ('src-hrw-northern-offensive','Human Rights Watch',        'Gaza: Israel''s Northern Offensive Endangering Hundreds of Thousands of Civilians',                       'https://www.hrw.org/news/2024/10/26/gaza-israels-northern-offensive-endangering-hundreds-thousands-civilians', 'hrw-northern-off',     '2024-10-26T00:00:00Z',     'manual'),
  ('src-hrw-school-strikes',   'Human Rights Watch',         'Gaza: Israeli School Strikes Magnify Civilian Peril',                                                     'https://www.hrw.org/news/2025/08/07/gaza-israeli-school-strikes-magnify-civilian-peril',                       'hrw-school-strikes',   '2025-08-07T00:00:00Z',     'manual'),
  ('src-amnesty-genocide',     'Amnesty International',      'Amnesty International concludes Israel is committing genocide against Palestinians in Gaza',              'https://www.amnesty.org/en/latest/news/2024/12/amnesty-international-concludes-israel-is-committing-genocide-against-palestinians-in-gaza/', 'amnesty-genocide', '2024-12-05T00:00:00Z', 'manual'),
  ('src-ocha-323',             'UN OCHA',                    'Humanitarian Situation Update #323 | Gaza Strip',                                                         'https://www.ochaopt.org/content/humanitarian-situation-update-323-gaza-strip',                                 'ocha-323',             '2025-09-18T00:00:00Z',     'manual'),
  ('src-ocha-259',             'UN OCHA',                    'Humanitarian Situation Update #259 | Gaza Strip',                                                         'https://www.ochaopt.org/content/humanitarian-situation-update-259-gaza-strip',                                 'ocha-259',             '2025-01-22T00:00:00Z',     'manual'),
  ('src-ocha-oct-2025',        'UN OCHA',                    'Gaza Humanitarian Response Update | 28 September - 11 October 2025',                                      'https://www.unocha.org/publications/report/occupied-palestinian-territory/gaza-humanitarian-response-update-28-september-11-october-2025', 'ocha-oct-2025', '2025-10-15T00:00:00Z', 'manual'),
  ('src-unosat-jul-2024',      'UNOSAT (via ReliefWeb)',     'UNOSAT Gaza Strip 8th Comprehensive Damage Assessment - July 2024',                                       'https://reliefweb.int/map/occupied-palestinian-territory/unosat-gaza-strip-8th-comprehensive-damage-assessment-july-2024', 'unosat-jul-2024', '2024-07-31T00:00:00Z', 'api'),
  ('src-unrwa-sitrep-204',     'UNRWA',                      'UNRWA Situation Report #204 on the Humanitarian Crisis in the Gaza Strip and the occupied West Bank, including East Jerusalem', 'https://www.unrwa.org/resources/reports/unrwa-situation-report-204-situation-gaza-strip-and-west-bank-including-east-jerusalem', 'unrwa-sitrep-204', null, 'manual'),
  ('src-hrw-world-report-2024','Human Rights Watch',         'World Report 2024: Israel and Palestine',                                                                 'https://www.hrw.org/world-report/2024/country-chapters/israel-and-palestine',                                  'hrw-world-2024',       '2024-01-11T00:00:00Z',     'manual');

update public.stories set
  title = 'Apartments along the al-Shifa frontage',
  short_summary = 'Residential blocks immediately adjacent to the al-Shifa Medical Complex were damaged during two prolonged military operations in late 2023 and again in March-April 2024.',
  body = 'Al-Shifa Medical Complex, founded in 1946, sits on Izz al-Din al-Qassam Street in Gaza City''s Rimal district. The hospital and surrounding blocks were the focus of two extended Israeli military operations: an 11 to 24 November 2023 siege and a second operation from 18 March to 1 April 2024. On 5 April 2024, a WHO-led assessment mission described most buildings as "largely damaged or destroyed." Reporting cited in the same Wikipedia summary describes the surrounding residential area as having been "rendered beyond recognition." In December 2024, Amnesty International published a 296-page report concluding that Israel was committing genocide against Palestinians in Gaza, drawing on satellite imagery and 212 interviews.',
  tone = 'documentary'
where id = 'story-apt-block';

update public.stories set
  title = 'Schools after the strikes',
  short_summary = 'By August 2025, Human Rights Watch reported that 97 percent of Gaza''s school buildings (547 of 564) had sustained damage and 76 percent had been directly hit since October 2023.',
  body = 'On 21 September 2024, an Israeli strike on al-Zeitoun C School in Gaza City reportedly killed at least 34 people, including at least 21 children, with munition remnants identified by Human Rights Watch as a US-produced GBU-39 Small Diameter Bomb. HRW found no military targets at either of the two schools it investigated in detail. By July 2024, UNRWA said "two thirds of UNRWA schools in Gaza have been hit, some were bombed out, many severely damaged." UNRWA Commissioner-General Philippe Lazzarini noted that at peak, around one million displaced people had sheltered in UNRWA schools. Most schools, UNRWA stated, can no longer be used for education.',
  tone = 'documentary'
where id = 'story-school-ruins';

update public.stories set
  title = 'Schools as shelters',
  short_summary = 'From October 2023 onward, UNRWA closed its schools and converted most of them into shelters; at the peak, roughly one million displaced people stayed in these buildings.',
  body = 'Before the war, UNRWA operated schools across Gaza serving hundreds of thousands of children. After 7 October 2023, the agency closed schools and turned most into emergency shelters for displaced families. UNRWA has since reported that 95 percent of schools that were used as shelters have been hit while sheltering displaced people. Where buildings remain partially intact, UNRWA has tried to resume informal learning. According to the agency, by 2025 it was running approximately 251 Temporary Learning Spaces, including in Gaza City and North Gaza, reaching over 38,000 children. Per HRW, by August 2025, 97 percent of Gaza''s school buildings had sustained damage.',
  tone = 'reflective'
where id = 'story-school-before';

update public.stories set
  title = 'Displacement and shelter in Gaza City',
  short_summary = 'OCHA recorded more than 246,800 displacement movements in Gaza between mid-August and 17 September 2025 amid intensified operations in Gaza City, with most people moving from north to south.',
  body = 'Gaza City has seen repeated cycles of displacement since October 2023. Per Human Rights Watch, citing UN figures, by October 2024 about 1.9 million of Gaza''s 2.2 million Palestinians had been displaced and roughly 87 percent of housing units and schools were damaged or destroyed. UNOSAT''s December 2024 satellite assessment counted more than 170,000 affected structures across Gaza, with over 60,000 destroyed. In September 2025, OCHA reported that on 10 September Israeli authorities ordered all civilians in Gaza City to relocate to Al Mawasi; in the following week alone roughly 125,600 displacement movements were recorded. Eleven UNRWA premises sheltering an estimated 11,000 people sustained damage between 11 and 16 September 2025.',
  tone = 'documentary'
where id = 'story-shelter';

update public.stories set
  title = 'After the ceasefire: returns and aid',
  short_summary = 'Following the 19 January 2025 ceasefire, OCHA reported that over 376,000 people returned to northern Gaza, and access for humanitarian agencies expanded.',
  body = 'OCHA reported that a ceasefire between Israel and Palestinian armed groups took effect at 11:15 on 19 January 2025, mediated by Egypt, Qatar, and the United States. After Israeli forces withdrew from the Netzarim corridor, more than 376,000 displaced people walked north toward their homes; OCHA cited media reports indicating that 250 people had been admitted to hospital for exhaustion during the journey, and one elderly man reportedly died on the way. Coordination requirements for most aid missions were eased, allowing partners to reach areas previously inaccessible. Shelter remained scarce: a later OCHA update for 28 September to 11 October 2025 described approximately 1.5 million people still in need of shelter assistance.',
  tone = 'actionable'
where id = 'story-aid-tent';

insert into public.story_sources (story_id, source_id, ordering) values
  ('story-apt-block',     'src-wiki-shifa',         0),
  ('story-apt-block',     'src-wiki-shifa-siege',   1),
  ('story-apt-block',     'src-wiki-rimal',         2),
  ('story-apt-block',     'src-amnesty-genocide',   3),
  ('story-school-ruins',  'src-hrw-school-strikes', 0),
  ('story-school-ruins',  'src-un-news-schools',    1),
  ('story-school-before', 'src-un-news-schools',    0),
  ('story-school-before', 'src-unrwa-sitrep-204',   1),
  ('story-school-before', 'src-hrw-school-strikes', 2),
  ('story-shelter',       'src-hrw-north-gaza',     0),
  ('story-shelter',       'src-unosat-jul-2024',    1),
  ('story-shelter',       'src-ocha-323',           2),
  ('story-aid-tent',      'src-ocha-259',           0),
  ('story-aid-tent',      'src-ocha-oct-2025',      1);

update public.hotspots set label = 'Apartments along the al-Shifa frontage'    where id = 'h-apt-block';
update public.hotspots set label = 'Schools after the strikes'                 where id = 'h-school-ruins';
update public.hotspots set label = 'Schools as shelters (2019)'                where id = 'h-school-before';
update public.hotspots set label = 'Displacement and shelter in Gaza City'     where id = 'h-shelter';
update public.hotspots set label = 'After the ceasefire: returns and aid',
                          action_label = 'Donate to humanitarian relief',
                          action_url = 'https://donate.unrwa.org/'
where id = 'h-aid-tent';
