# Dignity Checklist

Run this checklist before flipping any scene from `is_published = false` to
`is_published = true`. The full policy lives in `docs/sourcing-policy.md`.
A "yes" to every item is required. A single "no" blocks publication.

## Facts & sourcing

- [ ] Every claim in the story card is cross-referenced to **at least one**
      verified source on the source ladder (rank 1-3 preferred; rank 4
      requires editorial sign-off).
- [ ] Each source URL has been opened in the last 7 days and resolves
      (no 404, no paywall that hides the cited claim).
- [ ] No claim relies on AI-generated text or unattributed social media.

## People

- [ ] No identifiable minor appears in any image without written consent
      on file (UNICEF standard).
- [ ] No identifiable vulnerable adult appears without written consent on
      file (ICRC standard).
- [ ] Names of minors are pseudonymised unless consent explicitly permits
      the real name.

## Imagery

- [ ] Every image is credited correctly (photographer / agency / licence).
- [ ] Every AI-reconstructed asset has `is_generated = true` and the
      visible reconstruction badge is rendering in the UI.
- [ ] The caption for any reconstruction states that it is a reconstruction
      and identifies its source material.
- [ ] No image shows bodies, gore, or otherwise crosses into the
      `blocked` tier.

## Tone

- [ ] The story-card copy is documentary, not sensational. No war-fetish
      framing, no rhetorical flourish standing in for evidence.
- [ ] The before/after toggle does not aestheticise destruction (e.g. no
      dramatic music cue, no "shock" reveal animation).
- [ ] Captions name people, places, and dates rather than abstractions
      ("a child", "somewhere in Gaza") wherever the source allows.

## Classification

- [ ] `graphic_level` is set explicitly (`none`, `mild`, `moderate`, or
      `blocked`).
- [ ] If `graphic_level = moderate`, an editorial unblock is recorded and
      a viewer warning is configured.
- [ ] `graphic_level = blocked` content is **not** being published. (If
      you reached this line with `blocked` content queued, stop.)

## Audit

- [ ] The publishing editor's user id is attached to this publishing event.
- [ ] The audit row will record the dignity-check completion.

When every box is ticked, publish.
