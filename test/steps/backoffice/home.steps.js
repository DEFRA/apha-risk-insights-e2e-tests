import { expect } from '@playwright/test'

import { Given, When, Then } from '#steps/fixtures.js'

Given('I am on the back office home page', async ({ backofficeHomePage }) => {
  await backofficeHomePage.open()
})

When('I follow the update risk level link', async ({ backofficeHomePage }) => {
  await backofficeHomePage.updateRiskLevelLink.click()
})

Then(
  'I see risk level changes for these diseases:',
  async ({ backofficeHomePage }, dataTable) => {
    for (const [diseaseName] of dataTable.raw()) {
      await expect(backofficeHomePage.tabFor(diseaseName)).toBeVisible()
    }
  }
)
