# Source Verification — 2026-04-30

This document records what was verified vs. inferred for the demo scene, so future work can audit and challenge any claim.

## Photographs

| Field | Before photo | After photo |
|---|---|---|
| **Wikimedia file** | [Shifa_Ezz_Eldine_AlQassam_Street_in_Gaza_before_war_23-25.jpg](https://commons.wikimedia.org/wiki/File:Shifa_Ezz_Eldine_AlQassam_Street_in_Gaza_before_war_23-25.jpg) | [Images_of_war_23-25_from_Gaza,_by_Jaber_Badwen,_IMG_5923.jpg](https://commons.wikimedia.org/wiki/File:Images_of_war_23-25_from_Gaza,_by_Jaber_Badwen,_IMG_5923.jpg) |
| **Photographer** | Jaber Jehad Badwan | Jaber Jehad Badwan |
| **License** | CC BY-SA 4.0 | CC BY-SA 4.0 |
| **Camera EXIF** | iPhone 12 Pro Max | iPhone 12 Pro Max |
| **Date/time (EXIF)** | 2023-01-05 14:55 | 2025-02-22 13:54 |
| **Location (file caption)** | "Shifa Ezz Eldine AlQassam Street in Gaza" | "District of Sheikh Radwan, Gaza-city, destroyed by Israeli bombing, February 22, 2025." |
| **GPS coordinates** | Not embedded | 31°32′02″N, 34°27′37″E |
| **Confirmed location** | ✅ al-Qassam Street, Gaza City (file title is explicit) | ✅ Sheikh Radwan district, Gaza City (file caption + GPS) |

**Two-neighborhood reality:** The before and after photos are NOT the same street. The before is on Ezz Eldine al-Qassam Street near the al-Shifa Medical Complex (Rimal area). The after is in the Sheikh Radwan district, roughly 2km north. Both are in Gaza City, both by the same photographer, but they show different neighborhoods. The scene title was updated from "Ezz Eldine al-Qassam Street" to "Gaza City: two streets, 2023 → 2025" to reflect this.

## Source URLs (HTTP-checked 2026-04-30)

All 22 cited sources returned HTTP 200:

- ✅ Wikimedia Commons (both photo file pages)
- ✅ Wikipedia: Al-Shifa Hospital, Al-Shifa Hospital siege, Rimal, Rashad Shawa Cultural Center, Assassination of Anas Al-Sharif, Killing of Hind Rajab
- ✅ WHO: 6 April 2024 al-Shifa assessment, 22 August 2025 famine confirmation
- ✅ Human Rights Watch: North Gaza (Oct 2024), Schools (Aug 2025)
- ✅ Amnesty International: Genocide finding (Dec 2024)
- ✅ UNICEF: Two years of war (Oct 2025)
- ✅ UN Women: Six months into war (Apr 2024)
- ✅ Save the Children: 20,000 children (Sept 2025)
- ✅ Oxfam: Water 94 percent (July 2024)
- ✅ UN News: UNRWA schools (July 2024)
- ✅ UN OCHA: Situation Update #259
- ✅ CPJ: Gaza war casualties tracker
- ✅ NRC: Shelter aid blocked (Oct 2025)
- ✅ Al Jazeera: Anas al-Sharif killing

Verification command (re-runnable):

```bash
for url in <list>; do
  curl -sSL -o /dev/null -w "%{http_code}  $url\n" --max-time 15 \
       -H "User-Agent: Mozilla/5.0" "$url"
done
```

## Story content provenance

Each story body cites at least 2 of the verified sources above. The content is direct quotation or close paraphrase of the cited reports — no fabricated figures.

| Story | Key claims | Citation count |
|---|---|---|
| Apartments along the al-Shifa frontage | Two siege windows, WHO assessment, Amnesty genocide finding | 4 |
| Schools after the strikes | HRW 97% schools damaged, UNRWA two-thirds hit, Lazzarini quote | 2 |
| Schools as shelters | UNRWA closure + 1M displaced, 251 Temporary Learning Spaces | 3 |
| Displacement and shelter | HRW 87% housing, UNOSAT 170k structures, OCHA 246,800 movements | 3 |
| Ceasefire returns and aid | OCHA ceasefire timing, 376k returned, 1.5M still need shelter | 2 |
| Children's loss (WCNSF) | UNICEF 64,000 + 1,000 babies, UN Women 19,000 orphaned, MSF WCNSF, StC 20,000 | 5 |
| Medical staff | WHO empty-shell quote, OHCHR 136 strikes, MSF voice note | 5 |
| Journalists at al-Shifa gate | Five Al Jazeera staff named, CPJ 200+ killed | 4 |
| Rashad al-Shawa Cultural Center | Architect, opened 1988, Mandela/Chirac/Clinton, Nov 2023 destruction | 3 |
| Water and sanitation | Oxfam 4.74L/person, ICRC quote | 3 |
| Famine | IPC 22 Aug 2025, Tedros + Guterres quotes, IPC Dec 2025 update | 4 |
| Women and girls | UN Women 10,000 + 6,000 mothers, Mikhail quote | 2 |
| Shelter aid blocked | NRC 23 rejected requests, OCHA evacuation order | 3 |

## Verbatim witness quotes (captured for future use)

Nine real, verifiable quotes from named speakers in published sources:

- Dr. Mohammed Obeid (MSF surgeon at al-Shifa, Nov 2023)
- Susanne Mikhail (UN Women Regional Director, Apr 2024)
- Dr. Tedros Adhanom Ghebreyesus (WHO DG, Aug 2025)
- Catherine Russell (UNICEF Executive Director, Oct 2025)
- Ahmad Alhendawi (Save the Children Regional Director, Sept 2025)
- William Schomburg (ICRC Gaza head, Oct 2023)
- Sara Qudah (CPJ Regional Director)
- Anas al-Sharif (posthumous, Aug 2025)
- Dr. Hussam Abu Safiya (Kamal Adwan Hospital director, Oct 2024)

These are preserved in `supabase/migrations/research-source-2026-04-30-deeper.json` for use in a future quote-rendering UI element.

## What I deliberately did NOT do

- **No fabricated casualty figures.** Where a specific number couldn't be sourced to a real published report, the copy stayed at general-pattern level.
- **No invented quotes.** Every quote in the demo content is verbatim from a named speaker in a real published source.
- **No false same-street framing.** After learning the after photo is in Sheikh Radwan rather than on al-Qassam Street, the scene title and copy were updated.
- **No identification of named civilians from social media.** All named individuals (Hind Rajab, Anas al-Sharif, Dr. Hussam Abu Safiya, etc.) are referenced via established mainstream coverage.
