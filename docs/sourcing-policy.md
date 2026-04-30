# Sourcing & Editorial Policy

This project is an interactive documentary about destruction in Palestinian
territory. Its credibility rests entirely on **verified sourcing**, the
**dignity** of the people whose lives and homes are depicted, and **editorial
review** before publication. This document is the canonical governance policy.
Engineering rules in `lib/governance/policy.ts` express a subset of these
rules as code.

## 1. Source ladder

Every fact, image, and story card must be traceable to at least one source.
Sources are ranked. When sources conflict, prefer the higher rank; when in
doubt, escalate to editorial.

| Rank | Tier                      | Examples                                       |
| ---- | ------------------------- | ---------------------------------------------- |
| 1    | Official / UN agencies    | UN OCHA, UNRWA, ReliefWeb, WHO                 |
| 2    | Human-rights organisations | Human Rights Watch, Amnesty International      |
| 3    | Established news wires    | Associated Press, Reuters, Al Jazeera          |
| 4    | Other / curated           | Anything not in the above lists (default)      |

A scene that relies *only* on rank-4 sources requires editorial sign-off and
must be flagged in the audit trail.

### What does **not** count as a source

- Anonymous social-media posts.
- Screenshots whose origin cannot be re-verified.
- "Personal communication" without an editor on file.
- AI-generated text, regardless of model or provider.

## 2. Acquisition modes

Each ingested item must record one of the following `acquisition_mode` values:

- **`api`** - pulled from a documented API (e.g. ReliefWeb).
- **`rss`** - pulled from a published feed.
- **`licensed`** - obtained under a wire / agency licence the project holds.
- **`manual`** - manually curated and entered by an editor.

`api` and `rss` items must store the upstream identifier and the original URL.
`licensed` items must record the licence terms in the source metadata.
`manual` items must record the editor's user id.

## 3. Image rights

Images are subject to a stricter ladder than text. Use the highest-ranked
option that is genuinely available:

1. **Own / partner-cleared** - photography produced for the project, or by a
   partner under a written agreement.
2. **Agency-cleared with credit** - images released by UN agencies or NGOs
   for editorial reuse, with the required credit line attached.
3. **Licensed wire** - AP, Reuters, AJ images covered by an active licence.
4. **Wikimedia / open** - per-file licence check (CC-BY, CC-BY-SA, public
   domain). The licence string and author must be stored on the asset.
5. **AI reconstruction** - allowed *only* for "before" imagery that no
   longer exists, and **must** carry the visible reconstruction badge.
6. **Forbidden** - social-media imagery without explicit consent, images of
   bodies or gore, identifiable suffering of children or other vulnerable
   adults without consent on file.

If none of 1-5 apply, the scene is not publishable.

## 4. Consent

We follow the **UNICEF principles for ethical reporting on children** and
the **ICRC professional standards for protection work**. The operative
rules for this project:

- No identifiable minor may appear in published imagery without written
  consent from a parent or guardian on file.
- No identifiable vulnerable adult (injured, detained, displaced under
  duress, mentally incapacitated) without written consent on file.
- Names of minors are pseudonymised by default; the real name appears only
  if consent specifically authorises it.
- Consent records live in the admin system and must be linked from the
  scene's audit trail.

When in doubt, do not publish the image. A scene can almost always be told
without an identifiable face.

## 5. Reconstruction labelling

Some "before" images are AI reconstructions of buildings or streets that
have since been destroyed. These are valuable - they let the viewer see
what was lost - but they are **not photographs**.

- Every AI-reconstructed asset must have `is_generated = true` in metadata.
- The UI **must** render a visible "Reconstruction" badge on the asset
  whenever it is displayed. This is enforced by
  `RECONSTRUCTION_LABEL_REQUIRED` in `lib/governance/policy.ts`.
- The scene's caption must say in plain language that the image is a
  reconstruction and identify the source material it was based on.
- A reconstruction may never be presented as documentary evidence of a
  specific event.

## 6. Graphic-content levels

Every story card and image carries a `graphic_level`:

| Level      | Meaning                                                        | Auto-publish? |
| ---------- | -------------------------------------------------------------- | ------------- |
| `none`     | Default. No graphic content.                                   | Yes           |
| `mild`     | Damage, rubble, distress at a distance. No identifiable harm.  | Yes           |
| `moderate` | Visible injury, close distress, or disturbing context.         | **No** - manual editorial unblock and viewer warning required |
| `blocked`  | Bodies, gore, exploitative framing. Never published.           | **No - ever** |

These rules are encoded in `GRAPHIC_PUBLISH_ALLOWED`. The publish pipeline
(`checkStoryReadyToPublish`) refuses to flip `is_published` to `true` for
`moderate` or `blocked` content without an explicit editorial action that
is recorded in the audit trail.

## 7. Editorial review

A scene cannot move from `is_published = false` to `is_published = true`
unless **all** of the following are true:

1. At least one source is attached.
2. `graphic_level` is `none` or `mild`, **or** an editor has manually
   approved a `moderate` scene with a viewer warning configured.
3. An editor has marked the scene as editorially approved.
4. Every reconstructed image carries the required label.
5. Consent records are linked for any identifiable subject.
6. The dignity checklist (`docs/dignity-checklist.md`) is recorded as
   complete for the publishing event.

The `checkStoryReadyToPublish` helper is the machine-readable subset of
items 1-3.

## 8. Audit trail

The admin PWA (specced separately) writes an immutable audit row for:

- Source attached / detached.
- Image asset added, including its rights tier.
- `graphic_level` changes.
- `is_published` toggles, with the editor's user id and the dignity-check
  hash.
- Reconstruction label added or removed.
- Takedown actions (see below).

Audit rows are append-only. Editing or deleting them is not a supported
operation.

## 9. Takedown & correction

If a published scene is challenged - by a subject, a partner, a fact-check,
or a 404'd source URL:

1. An editor sets `is_published = false` immediately.
2. The challenge is logged in the audit trail with the challenger and the
   nature of the issue.
3. Within 7 days, the editorial team either:
   - publishes a correction (the scene returns with a visible correction
     note and the original audit history preserved), or
   - permanently retires the scene (audit history preserved; the scene
     never reappears under the same id).
4. If a subject withdraws consent, takedown is **immediate** and the
   asset is purged from the public CDN; the audit row records the
   withdrawal.

Source URLs are re-validated on a schedule (the validation job is part of
the admin spec). A 404 does not by itself force a takedown, but it does
force a re-verification pass before the scene can remain published.
