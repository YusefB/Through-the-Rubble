-- Enable RLS on all content tables
alter table public.scenes              enable row level security;
alter table public.chapters            enable row level security;
alter table public.source_registry     enable row level security;
alter table public.stories             enable row level security;
alter table public.hotspots            enable row level security;
alter table public.story_sources       enable row level security;
alter table public.image_metadata      enable row level security;
alter table public.timeline_events     enable row level security;
alter table public.timeline_event_sources enable row level security;

-- Public read policies for published content only
create policy scenes_public_read on public.scenes
  for select using (is_published = true);

create policy chapters_public_read on public.chapters
  for select using (
    exists (select 1 from public.scenes s where s.id = chapters.scene_id and s.is_published = true)
  );

create policy source_registry_public_read on public.source_registry
  for select using (true);  -- sources themselves are non-sensitive

create policy stories_public_read on public.stories
  for select using (is_published = true and graphic_level <> 'blocked');

create policy hotspots_public_read on public.hotspots
  for select using (
    exists (select 1 from public.scenes s where s.id = hotspots.scene_id and s.is_published = true)
  );

create policy story_sources_public_read on public.story_sources
  for select using (
    exists (select 1 from public.stories st where st.id = story_sources.story_id and st.is_published = true)
  );

create policy image_metadata_public_read on public.image_metadata
  for select using (
    exists (select 1 from public.scenes s where s.id = image_metadata.scene_id and s.is_published = true)
    and graphic_level <> 'blocked'
  );

create policy timeline_events_public_read on public.timeline_events
  for select using (is_published = true);

create policy timeline_event_sources_public_read on public.timeline_event_sources
  for select using (
    exists (select 1 from public.timeline_events e where e.id = timeline_event_sources.event_id and e.is_published = true)
  );

-- Writes are restricted to authenticated users for now; admin policies will land
-- in the admin-pwa sub-project. No write policies = anon cannot write.
