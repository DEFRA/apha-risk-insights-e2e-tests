import { expect } from '@playwright/test'

import { Given, Then } from '#steps/fixtures.js'

Given('I am on the home page', async ({ homePage }) => {
  await homePage.open()
})

Given('I am on the risk overview page', async ({ riskOverviewPage }) => {
  await riskOverviewPage.open()
})

Then('I am taken to the risk overview page', async ({ page }) => {
  await expect(page).toHaveURL(/\/risk$/)
})
