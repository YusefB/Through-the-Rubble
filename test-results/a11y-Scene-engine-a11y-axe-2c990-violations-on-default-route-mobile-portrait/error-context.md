# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: a11y.spec.ts >> Scene engine a11y >> axe finds no critical or serious violations on default route
- Location: tests/e2e/a11y.spec.ts:5:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.goto: Test timeout of 30000ms exceeded.
Call log:
  - navigating to "http://localhost:3000/", waiting until "load"

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - main [ref=e2]:
    - group "Language" [ref=e4]:
      - button "EN" [pressed] [ref=e5] [cursor=pointer]
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
    - generic [ref=e55]:
      - text: Compiling
      - generic [ref=e56]:
        - generic [ref=e57]: .
        - generic [ref=e58]: .
        - generic [ref=e59]: .
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test'
  2  | import AxeBuilder from '@axe-core/playwright'
  3  | 
  4  | test.describe('Scene engine a11y', () => {
  5  |   test('axe finds no critical or serious violations on default route', async ({ page }) => {
> 6  |     await page.goto('/')
     |                ^ Error: page.goto: Test timeout of 30000ms exceeded.
  7  |     const result = await new AxeBuilder({ page })
  8  |       .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
  9  |       .analyze()
  10 |     const blockers = result.violations.filter(v => v.impact === 'critical' || v.impact === 'serious')
  11 |     expect(blockers).toEqual([])
  12 |   })
  13 | 
  14 |   test('axe finds no critical or serious violations in before mode', async ({ page }) => {
  15 |     await page.goto('/?state=before')
  16 |     const result = await new AxeBuilder({ page })
  17 |       .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
  18 |       .analyze()
  19 |     const blockers = result.violations.filter(v => v.impact === 'critical' || v.impact === 'serious')
  20 |     expect(blockers).toEqual([])
  21 |   })
  22 | 
  23 |   test('toggle and hotspots are reachable by keyboard', async ({ page }) => {
  24 |     await page.goto('/?state=after')
  25 |     let focused: string | null | undefined = null
  26 |     // Tab until we find the switch, with a generous upper bound
  27 |     // (mock has multiple hotspots before the switch in DOM order).
  28 |     for (let i = 0; i < 20 && focused !== 'switch'; i++) {
  29 |       await page.keyboard.press('Tab')
  30 |       focused = await page.evaluate(() => document.activeElement?.getAttribute('role'))
  31 |     }
  32 |     expect(focused).toBe('switch')
  33 | 
  34 |     await page.keyboard.press(' ')
  35 |     await expect(page.getByRole('switch')).toHaveAttribute('aria-checked', 'true')
  36 |   })
  37 | })
  38 | 
```