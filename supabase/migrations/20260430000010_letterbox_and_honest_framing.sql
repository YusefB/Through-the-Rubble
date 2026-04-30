-- Honest editorial framing fix.
--
-- The BEFORE photo is on Ezz Eldine al-Qassam Street (near al-Shifa Hospital,
-- Gaza City) per the Wikimedia file title.
-- The AFTER photo is in the Sheikh Radwan district of Gaza City (~2km north
-- of al-Shifa) per the Wikimedia file description, with GPS coordinates
-- 31°32'02"N, 34°27'37"E. They are NOT the same street.
--
-- Both photos by Jaber Jehad Badwan, both CC BY-SA 4.0. Editorial framing
-- updated to acknowledge the two-neighborhood reality rather than implying
-- same-street continuity. Photos now letterboxed at native aspect inside the
-- 4:5 frame so no content is cropped (~213 px black on the sides of the
-- portrait BEFORE; ~495 px above and below the landscape AFTER).

update public.scenes
  set title = 'Gaza City: two streets, 2023 → 2025'
where id = 'scene-main-street';

update public.image_metadata
  set
    alt_text = 'Ezz Eldine al-Qassam Street in Gaza City, photographed January 5, 2023, before the 2023-2025 war.',
    blur_data_url = 'data:image/webp;base64,UklGRkAAAABXRUJQVlA4IDQAAACwAQCdASoIAAoABABoJZwAAp11gLuAAP7Spvg1IN5rh5UMCRX9srpeffrS5QW8Xt4BbgAA'
where id = 'img-main-street-before';

update public.image_metadata
  set
    alt_text = 'Sheikh Radwan district of Gaza City, photographed February 22, 2025, after Israeli bombardment.',
    credit_line = 'Photo: Jaber Jehad Badwan / Wikimedia Commons (CC BY-SA 4.0). GPS 31°32'' 02"N, 34°27'' 37"E.',
    blur_data_url = 'data:image/webp;base64,UklGRkQAAABXRUJQVlA4IDgAAADQAQCdASoIAAoABABoJYwCw7EO4adAAAD+6V/1s5/wy0R3t1CW6rkq538L+b58koCeiUk2owAAAA=='
where id = 'img-main-street-after';
