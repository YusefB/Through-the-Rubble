-- Re-process photos at 4:5 aspect (1440 x 1800) instead of 9:24 — keeps more
-- of each photo's content visible. The previous 9:24 crop was too aggressive,
-- showing only ~21% of horizontal content for the landscape "after" photo.
-- 4:5 with center-crop preserves ~45% horizontal context and ~70% vertical.
update public.image_metadata
set
  width = 1440,
  height = 1800,
  blur_data_url = 'data:image/webp;base64,UklGRkgAAABXRUJQVlA4IDwAAADQAQCdASoIAAoABABoJZQC7ADzfuKjQAD45UdKT53aYzQBkFStSoy1pQVtqlXbjFkjFzbLAXOFr6XwAAA='
where id = 'img-main-street-before';

update public.image_metadata
set
  width = 1440,
  height = 1800,
  blur_data_url = 'data:image/webp;base64,UklGRkwAAABXRUJQVlA4IEAAAADwAQCdASoIAAoABABoJZACdAEO7o3M1oAA/eNg/liXIEYR68hGpg2qd5MYAgq//XeHLzCymaej04Ij1FWfAAAA'
where id = 'img-main-street-after';
