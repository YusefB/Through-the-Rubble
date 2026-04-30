import { test, expect } from '@playwright/test'

test.describe('Scene engine', () => {
  test('renders the scene with toggle and hotspots', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('switch')).toBeVisible()
    await expect(page.getByRole('button', { name: /Collapsed apartment block/ })).toBeVisible()
  })

  test('toggle changes aria-checked', async ({ page }) => {
    await page.goto('/')
    const toggle = page.getByRole('switch')
    await expect(toggle).toHaveAttribute('aria-checked', 'false')
    await toggle.click()
    await expect(toggle).toHaveAttribute('aria-checked', 'true')
  })

  test('toggle updates URL with ?state=', async ({ page }) => {
    await page.goto('/')
    const toggle = page.getByRole('switch')
    await toggle.click()
    await page.waitForFunction(() => new URL(location.href).searchParams.get('state') === 'before')
    expect(new URL(page.url()).searchParams.get('state')).toBe('before')
  })

  test('?state=before in URL hydrates the toggle', async ({ page }) => {
    await page.goto('/?state=before')
    await expect(page.getByRole('switch')).toHaveAttribute('aria-checked', 'true')
  })

  test('reconstruction label appears in before mode', async ({ page }) => {
    await page.goto('/?state=before')
    await expect(page.getByRole('note', { name: /Visual reconstruction/i })).toBeVisible()
  })

  test('reconstruction label hidden in after mode', async ({ page }) => {
    await page.goto('/?state=after')
    await expect(page.getByRole('note', { name: /Visual reconstruction/i })).not.toBeVisible()
  })

  test('after-only hotspot only visible in after mode', async ({ page }) => {
    await page.goto('/?state=after')
    await expect(page.getByRole('button', { name: /Aid distribution tent/ })).toBeVisible()
    await page.goto('/?state=before')
    await expect(page.getByRole('button', { name: /Aid distribution tent/ })).not.toBeVisible()
  })

  test('hotspot click writes ?hotspot= to URL', async ({ page }) => {
    await page.goto('/?state=after')
    await page.getByRole('button', { name: /Collapsed apartment block/ }).click()
    await page.waitForFunction(() => new URL(location.href).searchParams.get('hotspot') === 'h-apt-block')
    expect(new URL(page.url()).searchParams.get('hotspot')).toBe('h-apt-block')
  })
})
