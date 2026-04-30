-- Seed the demo scene with mock content. All published so anon read works.
-- Mirrors lib/scene/fixtures/mockScene.ts shape.

insert into public.scenes (id, slug, title, default_before_after, language, is_published)
values ('scene-main-street', 'main-street', 'Main Street', 'after', 'en', true);

insert into public.chapters (id, scene_id, "order", label, scroll_anchor_y, narration) values
  ('ch-north-block', 'scene-main-street', 0, 'North block',         0.12, 'Sample narration — The north block held four-storey apartment buildings home to roughly 240 families. By late 2023, most had been displaced.'),
  ('ch-school',      'scene-main-street', 1, 'School ruins',        0.34, 'Sample narration — A neighbourhood school that served children from across the area. Classrooms once filled with families now stand exposed to weather.'),
  ('ch-shelter',     'scene-main-street', 2, 'Shelter site',        0.56, 'Sample narration — Displaced families gathered here when permanent homes were lost. Aid workers describe overcrowding and limited supplies.'),
  ('ch-aid',         'scene-main-street', 3, 'Aid distribution',    0.78, 'Sample narration — A distribution point for food, water, and medical supplies. Operations depend on access through controlled crossings.');

insert into public.source_registry (id, publisher, title, url, url_hash, acquisition_mode) values
  ('src-relief-1', 'ReliefWeb', 'Sample placeholder report on north block displacement',           'https://example.org/reliefweb/north-block', 'h-relief-1', 'manual'),
  ('src-ocha-1',   'UN OCHA',   'Sample placeholder humanitarian update for the area',             'https://example.org/ocha/main-street',      'h-ocha-1',   'manual'),
  ('src-hrw-1',    'Human Rights Watch', 'Sample placeholder rights documentation for the school', 'https://example.org/hrw/school',            'h-hrw-1',    'manual'),
  ('src-amnesty-1','Amnesty International', 'Sample placeholder report on shelter conditions',     'https://example.org/amnesty/shelter',       'h-amnesty-1','manual');

insert into public.stories (id, title, short_summary, body, tone, language, graphic_level, is_published) values
  ('story-apt-block',   'Collapsed apartment block',
    'A four-storey apartment block that housed about 60 families before its destruction in late 2023.',
    'Sample drawer body — The block was one of several mid-rise residential buildings on the north side of the street. Residents describe leaving suddenly with what they could carry. Verified accounts indicate the structure was no longer habitable by the end of the year. Numbers and timing here are placeholder.',
    'documentary', 'en', 'none', true),
  ('story-school-ruins', 'School building ruins',
    'A neighbourhood school that served roughly 600 children from kindergarten through middle grades.',
    'Sample drawer body — The school stood on the corner adjacent to a playground. Aerial assessments published by humanitarian sources record extensive damage to the western wing. The figure of 600 students is a placeholder pending verified enrollment data.',
    'documentary', 'en', 'none', true),
  ('story-school-before', 'School playground (2019)',
    'Reconstructed view of the school playground as it appeared in 2019, based on archival imagery.',
    'Sample drawer body — This view is a visual reconstruction, not a documentary photograph. Sources include public school records and witness accounts. The intent is to convey what was lost, not to claim photographic accuracy.',
    'reflective', 'en', 'none', true),
  ('story-shelter', 'Displaced families shelter',
    'A makeshift shelter site receiving families displaced from the surrounding blocks.',
    'Sample drawer body — Aid coordinators describe rotating populations as families move between this site and others. Conditions vary with seasonal weather and aid access.',
    'documentary', 'en', 'none', true),
  ('story-aid-tent', 'Aid distribution tent',
    'A distribution point for food parcels, water, and basic medical supplies.',
    'Sample drawer body — Distribution depends on humanitarian access, which has been intermittent. Coordinators report waiting lists for non-acute medical cases.',
    'actionable', 'en', 'none', true);

insert into public.story_sources (story_id, source_id, ordering) values
  ('story-apt-block',    'src-relief-1', 0),
  ('story-apt-block',    'src-ocha-1',   1),
  ('story-school-ruins', 'src-hrw-1',    0),
  ('story-school-ruins', 'src-relief-1', 1),
  ('story-school-before','src-hrw-1',    0),
  ('story-shelter',      'src-amnesty-1',0),
  ('story-shelter',      'src-ocha-1',   1),
  ('story-aid-tent',     'src-ocha-1',   0);

insert into public.hotspots (id, scene_id, chapter_id, story_id, label, geometry_x, geometry_y, geometry_r, type, priority, visual_state, action_category, action_label, action_url) values
  ('h-apt-block',     'scene-main-street', 'ch-north-block', 'story-apt-block',    'Collapsed apartment block',  0.42, 0.18, 0.035, 'story',  'hero',      'always',      null,       null,                    null),
  ('h-school-ruins',  'scene-main-street', 'ch-school',      'story-school-ruins', 'School building ruins',      0.62, 0.36, 0.035, 'story',  'primary',   'always',      null,       null,                    null),
  ('h-school-before', 'scene-main-street', 'ch-school',      'story-school-before','School playground (2019)',   0.30, 0.34, 0.025, 'story',  'secondary', 'before-only', null,       null,                    null),
  ('h-shelter',       'scene-main-street', 'ch-shelter',     'story-shelter',      'Displaced families shelter', 0.50, 0.58, 0.030, 'stat',   'primary',   'after-only',  null,       null,                    null),
  ('h-aid-tent',      'scene-main-street', 'ch-aid',         'story-aid-tent',     'Aid distribution tent',      0.72, 0.80, 0.030, 'action', 'primary',   'after-only',  'donate',   'Donate',                'https://example.org/donate');

insert into public.image_metadata (id, scene_id, variant, asset_path, width, height, blur_data_url, is_generated, reconstruction_label, alt_text, credit_line, graphic_level) values
  ('img-main-street-before', 'scene-main-street', 'before', '/scenes/main-street-before.webp', 1440, 3840,
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkqAcAAIUAgUW0RjgAAAAASUVORK5CYII=',
    true, 'Reconstruction based on archival imagery. Architectural details extrapolated from public records and witness accounts.',
    'Main Street as it appeared in 2019, with apartment buildings and a school visible.',
    '© 2026 Through the Rubble — visual reconstruction', 'none'),
  ('img-main-street-after', 'scene-main-street', 'after', '/scenes/main-street-after.webp', 1440, 3840,
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkqAcAAIUAgUW0RjgAAAAASUVORK5CYII=',
    false, null,
    'Main Street today, showing extensive damage to apartment buildings and the school.',
    '© 2026 Through the Rubble', 'none');

insert into public.image_metadata (id, scene_id, variant, asset_path, width, height, is_generated, alt_text, parallax_factor, parallax_opacity, parallax_blend_mode, graphic_level) values
  ('img-parallax-haze',  'scene-main-street', 'parallax', '/scenes/parallax-haze.webp',  1440, 3840, false, '', 0.4,  0.5,  'screen', 'none'),
  ('img-parallax-dust',  'scene-main-street', 'parallax', '/scenes/parallax-dust.webp',  1440, 3840, false, '', 0.7,  0.6,  'screen', 'none'),
  ('img-parallax-smoke', 'scene-main-street', 'parallax', '/scenes/parallax-smoke.webp', 1440, 3840, false, '', 0.85, 0.45, 'screen', 'none');
