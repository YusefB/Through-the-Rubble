-- Admin write policies: authenticated users can write to all content tables.
-- This is a permissive v1; a future iteration will gate on a `role` claim or
-- a separate admins table once we have multi-user editorial workflows.

-- scenes
create policy scenes_admin_insert on public.scenes
  for insert to authenticated with check (true);
create policy scenes_admin_update on public.scenes
  for update to authenticated using (true) with check (true);
create policy scenes_admin_delete on public.scenes
  for delete to authenticated using (true);
create policy scenes_admin_read_all on public.scenes
  for select to authenticated using (true);

-- chapters
create policy chapters_admin_insert on public.chapters
  for insert to authenticated with check (true);
create policy chapters_admin_update on public.chapters
  for update to authenticated using (true) with check (true);
create policy chapters_admin_delete on public.chapters
  for delete to authenticated using (true);
create policy chapters_admin_read_all on public.chapters
  for select to authenticated using (true);

-- source_registry
create policy source_registry_admin_write on public.source_registry
  for insert to authenticated with check (true);
create policy source_registry_admin_update on public.source_registry
  for update to authenticated using (true) with check (true);
create policy source_registry_admin_delete on public.source_registry
  for delete to authenticated using (true);

-- stories
create policy stories_admin_insert on public.stories
  for insert to authenticated with check (true);
create policy stories_admin_update on public.stories
  for update to authenticated using (true) with check (true);
create policy stories_admin_delete on public.stories
  for delete to authenticated using (true);
create policy stories_admin_read_all on public.stories
  for select to authenticated using (true);

-- hotspots
create policy hotspots_admin_insert on public.hotspots
  for insert to authenticated with check (true);
create policy hotspots_admin_update on public.hotspots
  for update to authenticated using (true) with check (true);
create policy hotspots_admin_delete on public.hotspots
  for delete to authenticated using (true);
create policy hotspots_admin_read_all on public.hotspots
  for select to authenticated using (true);

-- story_sources
create policy story_sources_admin_write on public.story_sources
  for insert to authenticated with check (true);
create policy story_sources_admin_delete on public.story_sources
  for delete to authenticated using (true);

-- image_metadata
create policy image_metadata_admin_insert on public.image_metadata
  for insert to authenticated with check (true);
create policy image_metadata_admin_update on public.image_metadata
  for update to authenticated using (true) with check (true);
create policy image_metadata_admin_delete on public.image_metadata
  for delete to authenticated using (true);
create policy image_metadata_admin_read_all on public.image_metadata
  for select to authenticated using (true);

-- timeline_events
create policy timeline_events_admin_insert on public.timeline_events
  for insert to authenticated with check (true);
create policy timeline_events_admin_update on public.timeline_events
  for update to authenticated using (true) with check (true);
create policy timeline_events_admin_delete on public.timeline_events
  for delete to authenticated using (true);
create policy timeline_events_admin_read_all on public.timeline_events
  for select to authenticated using (true);

-- timeline_event_sources
create policy timeline_event_sources_admin_write on public.timeline_event_sources
  for insert to authenticated with check (true);
create policy timeline_event_sources_admin_delete on public.timeline_event_sources
  for delete to authenticated using (true);
