import { expect } from '@playwright/test'

import { Given, When, Then } from '#steps/fixtures.js'

Given('I am on the back office home page', async ({ backofficeHomePage }) => {
  await backofficeHomePage.open()
})

When('I follow the update risk level link', async ({ backofficeHomePage }) => {
  await backofficeHomePage.updateRiskLevelLink.click()
})

When(
  'I view the risk level changes for {string}',
  async ({ backofficeHomePage }, diseaseName) => {
    await backofficeHomePage.viewChangesFor(diseaseName)
  }
)

Then(
  'I see risk level changes for these diseases:',
  async ({ backofficeHomePage }, dataTable) => {
    for (const [diseaseName] of dataTable.raw()) {
      await expect(backofficeHomePage.tabFor(diseaseName)).toBeVisible()
    }
  }
)

// Each table row is a column heading and the value expected under it
Then(
  'the latest update for {string} shows:',
  async ({ backofficeHomePage }, diseaseName, dataTable) => {
    const row = backofficeHomePage.latestUpdateFor(diseaseName)
    await expect(row).toBeVisible()
    for (const [, value] of dataTable.raw()) {
      await expect(row).toContainText(value)
    }
  }
)
