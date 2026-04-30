-- Align seeded parallax layer IDs with the mock fixtures so the same e2e
-- selectors work whether the page reads from Supabase or falls back to mocks.
update public.image_metadata set id = 'haze'  where id = 'img-parallax-haze';
update public.image_metadata set id = 'dust'  where id = 'img-parallax-dust';
update public.image_metadata set id = 'smoke' where id = 'img-parallax-smoke';
