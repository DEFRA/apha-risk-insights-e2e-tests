import { expect } from '@playwright/test'

import { When, Then } from '#steps/fixtures.js'

When('I go straight to check your answers', async ({ checkAnswersPage }) => {
  await checkAnswersPage.open()
})

When(
  'I change the new risk level for {string}',
  async ({ checkAnswersPage }, diseaseName) => {
    await checkAnswersPage.changeNewRiskLevelFor(diseaseName)
  }
)

When('I submit my answers', async ({ checkAnswersPage }) => {
  await checkAnswersPage.submit()
})

Then(
  'my answers show these new risk levels:',
  async ({ checkAnswersPage }, dataTable) => {
    for (const row of dataTable.hashes()) {
      await expect(
        checkAnswersPage.answerFor(row.disease, 'New risk level')
      ).toHaveText(row['new risk level'])
    }
  }
)

When('I change the diseases to update', async ({ checkAnswersPage }) => {
  await checkAnswersPage.changeDiseasesToUpdate()
})

Then(
  'the diseases to update are {string}',
  async ({ checkAnswersPage }, diseaseNames) => {
    await expect(checkAnswersPage.diseasesToUpdate).toHaveText(diseaseNames)
  }
)

Then(
  'my answers do not include {string}',
  async ({ checkAnswersPage }, diseaseName) => {
    await expect(checkAnswersPage.cardFor(diseaseName)).toHaveCount(0)
  }
)
