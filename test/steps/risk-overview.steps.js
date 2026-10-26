import { expect } from '@playwright/test'

import { When, Then } from '#steps/fixtures.js'

When(
  'I open the risk detail for {string}',
  async ({ riskOverviewPage }, diseaseName) => {
    await riskOverviewPage.openDetailFor(diseaseName)
  }
)

Then('I see at least one disease risk card', async ({ riskOverviewPage }) => {
  await expect(riskOverviewPage.riskCards.first()).toBeVisible()
  expect(await riskOverviewPage.riskCards.count()).toBeGreaterThan(0)
})
