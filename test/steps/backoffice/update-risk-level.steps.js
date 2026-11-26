import { expect } from '@playwright/test'

import { When, Then } from '#steps/fixtures.js'

When(
  'I enter these risk level changes:',
  async ({ updateRiskLevelPage }, dataTable) => {
    for (const { disease, direction, comment } of dataTable.hashes()) {
      await updateRiskLevelPage.enterChange(disease, direction, comment)
    }
  }
)

When(
  'I select {string} for {string}',
  async ({ updateRiskLevelPage }, direction, diseaseName) => {
    await updateRiskLevelPage.directionFor(diseaseName, direction).check()
  }
)

When('I continue', async ({ updateRiskLevelPage }) => {
  await updateRiskLevelPage.continue()
})

Then(
  '{string} is selected for {string}',
  async ({ updateRiskLevelPage }, direction, diseaseName) => {
    await expect(
      updateRiskLevelPage.directionFor(diseaseName, direction)
    ).toBeChecked()
  }
)

Then(
  'I am asked about {string}',
  async ({ updateRiskLevelPage }, diseaseName) => {
    await expect(updateRiskLevelPage.directionsFor(diseaseName)).toBeVisible()
  }
)

Then(
  'I am not asked about {string}',
  async ({ updateRiskLevelPage }, diseaseName) => {
    await expect(updateRiskLevelPage.directionsFor(diseaseName)).toHaveCount(0)
  }
)

Then('I see the error {string}', async ({ updateRiskLevelPage }, message) => {
  await expect(updateRiskLevelPage.errorSummary).toContainText(
    'There is a problem'
  )
  await expect(updateRiskLevelPage.errorLink(message)).toBeVisible()
})
