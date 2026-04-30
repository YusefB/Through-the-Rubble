import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Scene engine a11y', () => {
  test('axe finds no critical or serious violations on default route', async ({ page }) => {
    await page.goto('/')
    const result = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze()
    const blockers = result.violations.filter(v => v.impact === 'critical' || v.impact === 'serious')
    expect(blockers).toEqual([])
  })

  test('axe finds no critical or serious violations in before mode', async ({ page }) => {
    await page.goto('/?state=before')
    const result = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze()
    const blockers = result.violations.filter(v => v.impact === 'critical' || v.impact === 'serious')
    expect(blockers).toEqual([])
  })

  test('toggle and hotspots are reachable by keyboard', async ({ page }) => {
    await page.goto('/?state=after')
    let focused: string | null | undefined = null
    // Tab until we find the switch, with a generous upper bound
    // (mock has multiple hotspots before the switch in DOM order).
    for (let i = 0; i < 20 && focused !== 'switch'; i++) {
      await page.keyboard.press('Tab')
      focused = await page.evaluate(() => document.activeElement?.getAttribute('role'))
    }
    expect(focused).toBe('switch')

    await page.keyboard.press(' ')
    await expect(page.getByRole('switch')).toHaveAttribute('aria-checked', 'true')
  })
})
