import { expect } from '@playwright/test'

import { When, Then } from '#steps/fixtures.js'

When(
  'I open the risk detail page for an unknown disease',
  async ({ riskDetailPage }) => {
    await riskDetailPage.openBySlug('not-a-real-disease')
  }
)

Then('I see the error message {string}', async ({ errorPage }, text) => {
  await expect(errorPage.message).toHaveText(text)
})
