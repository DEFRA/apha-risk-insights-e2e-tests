// Note: import `test` from playwright-bdd (not @playwright/test) so the
// generated spec files use these fixtures.
import { test as base, createBdd } from 'playwright-bdd'

import { createLayoutPage } from '#pages/common/layout.page.js'
import { createHomePage } from '#pages/frontend/home.page.js'
import { createRiskOverviewPage } from '#pages/frontend/risk-overview.page.js'
import { createRiskDetailPage } from '#pages/frontend/risk-detail.page.js'
import { createErrorPage } from '#pages/frontend/error.page.js'
import { createRiskApiClient } from '#api/risk-api.client.js'
import { createBackofficeHomePage } from '#pages/backoffice/home.page.js'
import { createSelectDiseasesPage } from '#pages/backoffice/select-diseases.page.js'
import { createUpdateRiskLevelPage } from '#pages/backoffice/update-risk-level.page.js'
import { createCheckAnswersPage } from '#pages/backoffice/check-answers.page.js'
import { createConfirmationPage } from '#pages/backoffice/confirmation.page.js'

export const test = base.extend({
  // Set from playwright.config.js `use.apiBaseURL`; falls back to the env var.
  apiBaseURL: [process.env.E2E_API_BASE_URL || '', { option: true }],
  // Set from playwright.config.js `use.backofficeBaseURL`; falls back to the env var.
  backofficeBaseURL: [
    process.env.E2E_BACKOFFICE_BASE_URL || '',
    { option: true }
  ],

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

  // Back office pages. The back office has its own base URL, so these page
  // objects navigate by absolute URL rather than relying on `use.baseURL`.
  backofficeHomePage: async ({ page, backofficeBaseURL }, use) => {
    await use(createBackofficeHomePage(page, backofficeBaseURL))
  },
  selectDiseasesPage: async ({ page, backofficeBaseURL }, use) => {
    await use(createSelectDiseasesPage(page, backofficeBaseURL))
  },
  updateRiskLevelPage: async ({ page }, use) => {
    await use(createUpdateRiskLevelPage(page))
  },
  checkAnswersPage: async ({ page, backofficeBaseURL }, use) => {
    await use(createCheckAnswersPage(page, backofficeBaseURL))
  },
  confirmationPage: async ({ page }, use) => {
    await use(createConfirmationPage(page))
  },

  // Skip @api scenarios when the API base URL is not configured (e.g. a bare
  // `playwright test` with no backend running).
  skipApiWhenUnconfigured: [
    async ({ $tags, apiBaseURL }, use, testInfo) => {
      if ($tags.includes('@api') && !apiBaseURL) {
        testInfo.skip(true, 'E2E_API_BASE_URL is not configured')
      }
      await use()
    },
    { auto: true }
  ],

  // Skip @backoffice scenarios when the back office URL is not configured.
  skipBackofficeWhenUnconfigured: [
    async ({ $tags, backofficeBaseURL }, use, testInfo) => {
      if ($tags.includes('@backoffice') && !backofficeBaseURL) {
        testInfo.skip(true, 'E2E_BACKOFFICE_BASE_URL is not configured')
      }
      await use()
    },
    { auto: true }
  ]
})

export const { Given, When, Then } = createBdd(test)
