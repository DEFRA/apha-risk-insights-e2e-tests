import { expect } from '@playwright/test'

import { Then } from '#steps/fixtures.js'

// Shared by every service's features

Then('I see the heading {string}', async ({ layout }, text) => {
  await expect(layout.heading).toHaveText(text)
})

Then('the page URL ends with {string}', async ({ page }, suffix) => {
  await page.waitForURL((url) => url.pathname.endsWith(suffix))
})
