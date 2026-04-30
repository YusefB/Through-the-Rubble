# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: a11y.spec.ts >> Scene engine a11y >> toggle and hotspots are reachable by keyboard
- Location: tests/e2e/a11y.spec.ts:23:7

# Error details

```
Test timeout of 30000ms exceeded.
```

# Page snapshot

```yaml
- generic [ref=e1]:
  - main [ref=e2]:
    - group "Language" [ref=e4]:
      - button "EN" [active] [pressed] [ref=e5] [cursor=pointer]
      - button "AR" [ref=e6] [cursor=pointer]
    - region "Ezz Eldine al-Qassam Street, Gaza City" [ref=e7]:
      - paragraph [ref=e8]: Scroll to explore Ezz Eldine al-Qassam Street, Gaza City. Use the toggle to switch between historical and current views. Activate a marker to read about that location.
      - img "Shifa Ezz Eldine AlQassam Street in Gaza, photographed January 5, 2023, before the 2023-2025 war." [ref=e10]
      - img "Street-level destruction in Gaza during the 2023-2025 war, photographed February 22, 2025." [ref=e12]
      - generic "Hotspots":
        - button "Apartments along the al-Shifa frontage. Activate to read story." [ref=e13] [cursor=pointer]
        - button "Schools after the strikes. Activate to read story." [ref=e16] [cursor=pointer]
        - button "Displacement and shelter in Gaza City. Activate to read story." [ref=e19] [cursor=pointer]
        - 'button "After the ceasefire: returns and aid. Activate to read story." [ref=e22] [cursor=pointer]'
      - switch "Showing after view. Toggle to switch." [ref=e25] [cursor=pointer]: BEFORE·AFTER
      - generic [ref=e26]: "Now in chapter: Aid distribution and return"
    - button "Begin guided story" [ref=e27] [cursor=pointer]:
      - generic [ref=e28]: Begin guided story
      - generic [ref=e29]: ‣
    - region "How you can help" [ref=e30]:
      - generic [ref=e31]:
        - heading "How you can help" [level=2] [ref=e32]
        - paragraph [ref=e33]: These are starting points — every action matters.
        - list [ref=e34]:
          - listitem [ref=e35]:
            - button "Donate to humanitarian relief Support verified aid organizations" [ref=e36] [cursor=pointer]:
              - generic [ref=e37]: Donate to humanitarian relief
              - generic [ref=e38]: Support verified aid organizations
          - listitem [ref=e39]:
            - button "Learn more Read the source documentation" [ref=e40] [cursor=pointer]:
              - generic [ref=e41]: Learn more
              - generic [ref=e42]: Read the source documentation
          - listitem [ref=e43]:
            - button "Share this story Help others see what is happening" [ref=e44] [cursor=pointer]:
              - generic [ref=e45]: Share this story
              - generic [ref=e46]: Help others see what is happening
  - button "Open Next.js Dev Tools" [ref=e52] [cursor=pointer]:
    - img [ref=e53]
  - alert [ref=e56]
```