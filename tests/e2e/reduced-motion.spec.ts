import { test, expect } from '@playwright/test'

test.describe('Reduced motion fork', () => {
  test('parallax layers are not rendered when prefers-reduced-motion is set', async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce' })
    const page = await context.newPage()
    await page.goto('/')
    await expect(page.getByRole('switch')).toBeVisible()
    const dust = page.locator('[data-testid="parallax-layer-dust"]')
    await expect(dust).toHaveCount(0)
    await context.close()
  })

  test('parallax layers are rendered when prefers-reduced-motion is not set', async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: 'no-preference' })
    const page = await context.newPage()
    await page.goto('/')
    await expect(page.locator('[data-testid="parallax-layer-dust"]')).toBeVisible()
    await context.close()
  })

  test('crossfade is instant under reduced motion', async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce' })
    const page = await context.newPage()
    await page.goto('/?state=after')

    const beforeLayer = page.getByTestId('master-layer-before')
    await expect(beforeLayer).toHaveCSS('opacity', '0')

    await page.getByRole('switch').click()
    await expect(beforeLayer).toHaveCSS('opacity', '1', { timeout: 200 })

    await context.close()
  })
})
