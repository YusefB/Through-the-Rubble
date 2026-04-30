# Satellite Imagery Sources for Gaza Before/After Pairs

This document inventories the satellite imagery sources that are usable for documentary before/after comparisons in this project, along with licensing notes and integration paths. It is the output of an open-source imagery audit conducted on 2026-04-30.

## TL;DR

| Source | Best for | License | Practical for this project |
|---|---|---|---|
| **NASA Earth Observatory** | Macro/regional context, night lights, infrastructure visibility | Public domain | ✅ Use directly with credit |
| **NASA Black Marble (VIIRS)** | Night-lights "lights out" comparisons | Public domain | ✅ Use directly |
| **Copernicus Sentinel-2 / Sentinel-1** | Multispectral & SAR imagery, free archival access | CC-BY-SA 3.0 IGO | ✅ Use with attribution |
| **UNOSAT (UNITAR)** | Damage assessment maps, agricultural impact, shelter analysis | CC-BY-NC 3.0 IGO (most products) | ✅ For non-commercial use; this project qualifies |
| **NASA Worldview** | Snapshot UI for any date / band | Underlying data public domain | ✅ Generate exports |
| **Maxar / Planet Labs** | High-resolution street-level (sub-meter) | Proprietary; free press license available | ⚠ Email request for permission |
| **Tomnod / Crowd-sourced** | Various | Mixed | ❌ Skip unless source-verified |

## Concrete starting points

### NASA Black Marble — the iconic Gaza night-lights comparison

NASA's VIIRS Day/Night Band has produced widely-circulated "before vs. after" night-light images of Gaza. The decline in nighttime illumination after October 2023 is dramatic and visually unambiguous.

- **Where to find:** [Black Marble product on NASA Earthdata](https://earthdata.nasa.gov/learn/find-data/near-real-time/firms/products) (search "VNP46A1 Gaza")
- **License:** Public domain (NASA)
- **Recommended pair:**
  - `before`: VIIRS night composite for September 2023 (last full pre-war month)
  - `after`: VIIRS night composite for November 2023 (first full month with grid disruption)
- **Format:** GeoTIFF; needs reprojection + cropping to a Gaza bounding box for display

### Copernicus Sentinel-2 — natural color comparison

ESA's Sentinel-2 satellites provide free 10m-resolution multispectral imagery on a 5-day revisit cadence. Pre-war and post-war scenes of the same Gaza locations exist for many dates.

- **Where to find:** [Copernicus Browser](https://browser.dataspace.copernicus.eu/) — search by date + bounding box
- **License:** Free and open use under [Copernicus terms](https://sentinels.copernicus.eu/web/sentinel/terms-conditions); attribution required
- **Recommended pair:**
  - `before`: Sentinel-2 L2A image, August 2023
  - `after`: Sentinel-2 L2A image, late 2024 or 2025
- **Credit line:** "Contains modified Copernicus Sentinel data [year], processed by [your name]"

### UNOSAT damage assessments

UNOSAT (the UN's geospatial unit) has published a series of damage analyses for Gaza specifically. These are vector overlays + summary statistics rather than raw imagery, but the underlying maps include before/after components.

- **Where to find:** [UNOSAT product browser](https://unosat.org/products) — filter by location
- **License:** CC-BY-NC 3.0 IGO for most products; non-commercial documentary use is permitted with credit
- **Useful products:**
  - "Comprehensive Damage Assessment in the Gaza Strip" (multiple iterations published 2023–2025)
  - Agricultural land impact assessments
  - Shelter density layers
- **Credit line:** "© UNITAR/UNOSAT [year] — used under CC-BY-NC 3.0 IGO"

### NASA Worldview snapshots

Worldview is a web app over MODIS/VIIRS imagery. You can pin a date, draw a bounding box, and export a PNG. The exports are public domain.

- **App:** [worldview.earthdata.nasa.gov](https://worldview.earthdata.nasa.gov/)
- **Workflow:** Set date → select MODIS Aqua/Terra Corrected Reflectance layer → zoom to Gaza → export

## Integration paths for this project

### Path A: Static images per scene (lowest effort)

For each scene that has a satellite "macro" component, store two `image_metadata` rows with `variant: 'satellite-before'` and `variant: 'satellite-after'`. Render them in a separate Timeline page or as a fold-out section above the main scene. Ship as static WebPs in `public/scenes/satellite/`.

This requires expanding the `image_metadata.variant` enum check constraint:

```sql
alter table public.image_metadata
  drop constraint image_metadata_variant_check;
alter table public.image_metadata
  add constraint image_metadata_variant_check
  check (variant in ('before','after','stitched_mobile','desktop_wide','detail','parallax','satellite-before','satellite-after'));
```

### Path B: Live Worldview snapshot embed

Use NASA's Worldview snapshot URL with date params for an iframe embed that always reflects current data. No image storage needed but loses control over framing and adds an external dependency.

### Path C: Sentinel Hub Process API integration

Use Sentinel Hub (paid tier) or the free Copernicus Process API to render dynamic before/after composites server-side and cache results. Most flexible, highest engineering cost — out of scope for v1.

## Recommendation

**For v1 demo, do nothing here.** The Badwan ground-level photos already shipped in `image_metadata` for `scene-main-street` are the right primary content. Satellite imagery is a follow-up that would live on a separate `/timeline` or `/macro` page — not the main scene viewport.

**For follow-up:** Path A (static images per scene) is the cleanest. Start with one Sentinel-2 pair (free, open license, easy attribution) of the area covered by the demo scene. Drop into the schema with the new variants and render in a side panel.

## Why this matters legally

The current Wikimedia images by Jaber Jehad Badwan are CC BY-SA 4.0 — usable, but ShareAlike means any derivative works of those *specific images* must also be CC BY-SA 4.0. Satellite imagery from Copernicus and NASA does not impose ShareAlike, so deriving infographics from them is unencumbered. Mixing the two on the same page is fine; the credit lines apply per-image.

## Contact information for permissions

If you decide to commission specific imagery beyond what these public archives provide:

- **NASA Earth Observatory editorial:** [eo-feedback@earthobservatory.nasa.gov](mailto:eo-feedback@earthobservatory.nasa.gov) — for high-res custom renders
- **Copernicus help desk:** [info@copernicus.eu](mailto:info@copernicus.eu) — for processing assistance
- **UNOSAT requests:** [unosat@unitar.org](mailto:unosat@unitar.org) — for tailored damage assessments
- **Maxar press licensing:** [press@maxar.com](mailto:press@maxar.com) — for sub-meter imagery; usually free for documentary projects with credit
- **Planet Education and Research:** [education-and-research@planet.com](mailto:education-and-research@planet.com) — non-commercial Planet imagery
