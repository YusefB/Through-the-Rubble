-- Scenes: top-level documentary location records
create table public.scenes (
  id text primary key,
  slug text not null unique,
  title text not null,
  default_before_after text not null check (default_before_after in ('before','after')),
  language text not null default 'en' check (language in ('en','ar')),
  translation_group text,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Chapters: scroll-anchored regions within a scene
create table public.chapters (
  id text primary key,
  scene_id text not null references public.scenes(id) on delete cascade,
  "order" integer not null,
  label text not null,
  scroll_anchor_y double precision not null check (scroll_anchor_y >= 0 and scroll_anchor_y <= 1),
  narration text,
  source_anchor_id text,
  created_at timestamptz not null default now()
);
create index chapters_scene_idx on public.chapters(scene_id, "order");

-- Source registry: normalized source references, deduplicated by URL hash
create table public.source_registry (
  id text primary key,
  publisher text not null,
  title text not null,
  url text not null,
  url_hash text not null unique,
  published_at timestamptz,
  fetched_at timestamptz,
  acquisition_mode text check (acquisition_mode in ('api','rss','manual','licensed')),
  raw_payload jsonb,
  created_at timestamptz not null default now()
);
create index source_registry_publisher_idx on public.source_registry(publisher);

-- Stories: long-form drawer content for hotspots
create table public.stories (
  id text primary key,
  title text not null,
  short_summary text not null,
  body text not null,
  tone text not null default 'documentary' check (tone in ('documentary','reflective','urgent','actionable')),
  language text not null default 'en' check (language in ('en','ar')),
  translation_group text,
  graphic_level text not null default 'none' check (graphic_level in ('none','mild','moderate','blocked')),
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Hotspots: tap zones in a scene that open stories
create table public.hotspots (
  id text primary key,
  scene_id text not null references public.scenes(id) on delete cascade,
  chapter_id text references public.chapters(id) on delete set null,
  story_id text references public.stories(id) on delete set null,
  label text not null,
  geometry_x double precision not null check (geometry_x >= 0 and geometry_x <= 1),
  geometry_y double precision not null check (geometry_y >= 0 and geometry_y <= 1),
  geometry_r double precision not null check (geometry_r >= 0 and geometry_r <= 1),
  type text not null check (type in ('story','stat','timeline','update','action')),
  priority text not null check (priority in ('hero','primary','secondary','optional')),
  visual_state text not null default 'always' check (visual_state in ('always','before-only','after-only')),
  action_category text check (action_category in ('donate','learn','advocate','support','read_more')),
  action_label text,
  action_url text,
  created_at timestamptz not null default now()
);
create index hotspots_scene_idx on public.hotspots(scene_id);
create index hotspots_chapter_idx on public.hotspots(chapter_id);

-- Linking table: many-to-many between stories and source_registry
create table public.story_sources (
  story_id text not null references public.stories(id) on delete cascade,
  source_id text not null references public.source_registry(id) on delete cascade,
  ordering integer not null default 0,
  primary key (story_id, source_id)
);

-- Image metadata: tracks asset variants per scene
create table public.image_metadata (
  id text primary key,
  scene_id text not null references public.scenes(id) on delete cascade,
  variant text not null check (variant in ('before','after','stitched_mobile','desktop_wide','detail','parallax')),
  asset_path text not null,
  width integer not null,
  height integer not null,
  blur_data_url text,
  is_generated boolean not null default false,
  reconstruction_label text,
  credit_line text,
  license_type text,
  source_url text,
  alt_text text not null,
  graphic_level text not null default 'none' check (graphic_level in ('none','mild','moderate','blocked')),
  parallax_factor double precision,
  parallax_opacity double precision,
  parallax_blend_mode text check (parallax_blend_mode in ('normal','screen','multiply','overlay')),
  mobile_crop jsonb,
  desktop_crop jsonb,
  created_at timestamptz not null default now()
);
create index image_metadata_scene_idx on public.image_metadata(scene_id, variant);

-- Timeline events: chronological context, anchored to scenes
create table public.timeline_events (
  id text primary key,
  scene_anchor_id text references public.scenes(id) on delete set null,
  date date not null,
  title text not null,
  summary text not null,
  event_type text not null check (event_type in ('displacement','destruction','aid','report','news','rebuild')),
  weight double precision not null default 0.5,
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);
create index timeline_events_date_idx on public.timeline_events(date);
create index timeline_events_scene_idx on public.timeline_events(scene_anchor_id);

-- Linking: timeline_events ↔ source_registry
create table public.timeline_event_sources (
  event_id text not null references public.timeline_events(id) on delete cascade,
  source_id text not null references public.source_registry(id) on delete cascade,
  primary key (event_id, source_id)
);

-- updated_at triggers for tables that have it
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger scenes_updated_at before update on public.scenes
  for each row execute function public.touch_updated_at();
create trigger stories_updated_at before update on public.stories
  for each row execute function public.touch_updated_at();
