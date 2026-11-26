import { expect } from '@playwright/test'

import { When, Then } from '#steps/fixtures.js'

When('I request the health endpoint', async ({ riskApi }) => {
  await riskApi.health()
})

When('I request the documentation endpoint', async ({ riskApi }) => {
  await riskApi.documentation()
})

Then('the response is successful', async ({ riskApi }) => {
  expect(riskApi.lastResponse.ok()).toBeTruthy()
})
