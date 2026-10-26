// Note: import `test` from playwright-bdd (not @playwright/test) so the
// generated spec files use these fixtures.
import { test as base, createBdd } from 'playwright-bdd'

import { createLayoutPage } from '#pages/layout.page.js'
import { createHomePage } from '#pages/home.page.js'
import { createRiskOverviewPage } from '#pages/risk-overview.page.js'
import { createRiskDetailPage } from '#pages/risk-detail.page.js'
import { createErrorPage } from '#pages/error.page.js'
import { createRiskApiClient } from '#api/risk-api.client.js'

export const test = base.extend({
  // Set from playwright.config.js `use.apiBaseURL`; falls back to the env var.
  apiBaseURL: [process.env.API_BASE_URL || '', { option: true }],

  layout: async ({ page }, use) => {
    await use(createLayoutPage(page))
  },
  homePage: async ({ page }, use) => {
    await use(createHomePage(page))
  },
  riskOverviewPage: async ({ page }, use) => {
    await use(createRiskOverviewPage(page))
  },
  riskDetailPage: async ({ page }, use) => {
    await use(createRiskDetailPage(page))
  },
  errorPage: async ({ page }, use) => {
    await use(createErrorPage(page))
  },
  riskApi: async ({ request, apiBaseURL }, use) => {
    await use(createRiskApiClient(request, apiBaseURL))
  },

  // Skip @api scenarios when the API base URL is not configured (e.g. a bare
  // `playwright test` with no backend running).
  skipApiWhenUnconfigured: [
    async ({ $tags, apiBaseURL }, use, testInfo) => {
      if ($tags.includes('@api') && !apiBaseURL) {
        testInfo.skip(true, 'API_BASE_URL is not configured')
      }
      await use()
    },
    { auto: true }
  ]
})

export const { Given, When, Then } = createBdd(test)
