import { expect } from '@playwright/test'

import { Given, When, Then } from '#steps/fixtures.js'

Given(
  'I am viewing the risk detail for {string}',
  async ({ riskOverviewPage }, diseaseName) => {
    await riskOverviewPage.open()
    await riskOverviewPage.openDetailFor(diseaseName)
  }
)

When('I go back to the overview', async ({ riskDetailPage }) => {
  await riskDetailPage.goBack()
})

Then('I see the latest assessment card', async ({ riskDetailPage }) => {
  await expect(riskDetailPage.latestAssessmentCard).toContainText(
    'Latest assessment'
  )
})

Then('I see the risk history chart', async ({ riskDetailPage }) => {
  await expect(riskDetailPage.historyChart).toBeVisible()
})

Then('I see the assessment history table', async ({ riskDetailPage }) => {
  await expect(riskDetailPage.historyTable).toBeVisible()
})
