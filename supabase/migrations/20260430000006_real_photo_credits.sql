-- Replace placeholder credits + LQIP with real Wikimedia Commons photographs
-- by Jaber Jehad Badwan (CC BY-SA 4.0). The before image is "Shifa Ezz Eldine
-- AlQassam Street in Gaza before war 23-25" (2023-01-05). The after image is
-- a vertical crop of "Images of war 23-25 from Gaza, by Jaber Badwen, IMG_5923"
-- (2025-02-22). Same photographer, same license; the before/after toggle
-- shows representative neighborhood states, not the same exact location.

update public.image_metadata
set
  blur_data_url = 'data:image/webp;base64,UklGRmoAAABXRUJQVlA4IF4AAADQAwCdASoIABYAPxFysFAsJqSisAgBgCIJZwDE2BtjvdaDImAtZ0AA/tqdWTDcBFumHvFaMihFj5hYehEjkxU05qcPeiM0RMhYUhzJNGnfuGdiHMyAwjMjvjwqwAAA',
  is_generated = false,
  reconstruction_label = null,
  alt_text = 'Shifa Ezz Eldine AlQassam Street in Gaza, photographed January 5, 2023, before the 2023-2025 war.',
  credit_line = 'Photo: Jaber Jehad Badwan / Wikimedia Commons (CC BY-SA 4.0)',
  source_url = 'https://commons.wikimedia.org/wiki/File:Shifa_Ezz_Eldine_AlQassam_Street_in_Gaza_before_war_23-25.jpg',
  license_type = 'CC-BY-SA-4.0'
where id = 'img-main-street-before';

update public.image_metadata
set
  blur_data_url = 'data:image/webp;base64,UklGRmwAAABXRUJQVlA4IGAAAACwAwCdASoIABYAPxFysFAsJqSisAgBgCIJQBOgA8npk8ZWKhJdkAD+VHJ+49txB7QOAoXkzA1MU8AiGtniaPEKnGYwlcmd/kkthm7p+ppsqrFledL3Xn6Si94grobAAAA',
  alt_text = 'Street-level destruction in Gaza during the 2023-2025 war, photographed February 22, 2025.',
  credit_line = 'Photo: Jaber Jehad Badwan / Wikimedia Commons (CC BY-SA 4.0)',
  source_url = 'https://commons.wikimedia.org/wiki/File:Images_of_war_23-25_from_Gaza,_by_Jaber_Badwen,_IMG_5923.jpg',
  license_type = 'CC-BY-SA-4.0'
where id = 'img-main-street-after';
