import { expect } from '@playwright/test'

import { Given, When, Then } from '#steps/fixtures.js'

Given(
  'I am choosing which diseases to update',
  async ({ selectDiseasesPage }) => {
    await selectDiseasesPage.open()
  }
)

When(
  'I choose to update these diseases:',
  async ({ selectDiseasesPage }, dataTable) => {
    await selectDiseasesPage.choose(dataTable.raw().map(([name]) => name))
  }
)

Then(
  'these diseases are chosen:',
  async ({ selectDiseasesPage }, dataTable) => {
    for (const [diseaseName] of dataTable.raw()) {
      await expect(
        selectDiseasesPage.diseaseCheckbox(diseaseName)
      ).toBeChecked()
    }
  }
)
