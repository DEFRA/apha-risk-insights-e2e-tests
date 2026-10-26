import { expect } from '@playwright/test'

import { Given, Then } from '#steps/fixtures.js'

Given('I am on the home page', async ({ homePage }) => {
  await homePage.open()
})

Given('I am on the risk overview page', async ({ riskOverviewPage }) => {
  await riskOverviewPage.open()
})

Then('I see the heading {string}', async ({ layout }, text) => {
  await expect(layout.heading).toHaveText(text)
})

Then('I am taken to the risk overview page', async ({ page }) => {
  await expect(page).toHaveURL(/\/risk$/)
})

Then('the page URL ends with {string}', async ({ page }, suffix) => {
  await page.waitForURL((url) => url.pathname.endsWith(suffix))
})
