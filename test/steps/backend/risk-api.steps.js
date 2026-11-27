import { expect } from '@playwright/test'

import { When, Then } from '#steps/fixtures.js'

When('I request the risk list', async ({ riskApi }) => {
  await riskApi.listRisks()
})

When(
  'I request the risk list filtered by status {string}',
  async ({ riskApi }, status) => {
    await riskApi.listRisks({ status })
  }
)

When(
  'I request the risk list filtered by disease code {string}',
  async ({ riskApi }, diseaseCode) => {
    await riskApi.listRisks({ diseaseCode })
  }
)

When('I request the risk with id {string}', async ({ riskApi }, riskId) => {
  await riskApi.getRisk(riskId)
})

Then('the response status is {int}', async ({ riskApi }, status) => {
  expect(riskApi.lastResponse.status()).toBe(status)
})

Then('the response body contains a page of risk items', async ({ riskApi }) => {
  const body = await riskApi.lastResponse.json()

  expect(Array.isArray(body.items)).toBe(true)
  expect(typeof body.page).toBe('number')
  expect(typeof body.pageSize).toBe('number')
  expect(typeof body.totalItems).toBe('number')
  expect(typeof body.totalPages).toBe('number')
})

Then(
  'the risk list contains at least one disease risk',
  async ({ riskApi }) => {
    const body = await riskApi.lastResponse.json()

    expect(body.totalItems).toBeGreaterThan(0)
    expect(body.items.length).toBeGreaterThan(0)
    expect(body.items[0]).toHaveProperty('id')
    expect(body.items[0].disease).toHaveProperty('code')
  }
)

Then(
  'every risk in the list has disease code {string}',
  async ({ riskApi }, diseaseCode) => {
    const body = await riskApi.lastResponse.json()

    expect(body.items.length).toBeGreaterThan(0)
    for (const item of body.items) {
      expect(item.disease.code).toBe(diseaseCode)
    }
  }
)

Then('the response body has an assessment history', async ({ riskApi }) => {
  const body = await riskApi.lastResponse.json()

  expect(Array.isArray(body.riskHistory)).toBe(true)
  expect(body.riskHistory.length).toBeGreaterThan(0)
})
