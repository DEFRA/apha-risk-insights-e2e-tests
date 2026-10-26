import { defineConfig, devices } from '@playwright/test'
import { defineBddConfig } from 'playwright-bdd'

const oneMinute = 60 * 1000

// The frontend is the service under test. On CDP each service is reachable at
// `https://<service>.<environment>.cdp-int.defra.cloud`. Locally and in the
// GitHub docker-compose run the URLs are supplied through BASE_URL / API_BASE_URL.
const { ENVIRONMENT, BASE_URL, API_BASE_URL, HTTP_PROXY, CI, DEBUG } =
  process.env

const cdpUrl = (service) =>
  ENVIRONMENT && `https://${service}.${ENVIRONMENT}.cdp-int.defra.cloud`

const baseURL = BASE_URL || cdpUrl('apha-risk-insights-frontend')
const apiBaseURL = API_BASE_URL || cdpUrl('apha-risk-insights-backend')

const proxy = HTTP_PROXY
  ? { server: HTTP_PROXY, bypass: '127.0.0.1,localhost' }
  : undefined

// Generate Playwright specs from the Gherkin features + step definitions.
const testDir = defineBddConfig({
  features: 'test/features/**/*.feature',
  steps: 'test/steps/**/*.js'
})

export default defineConfig({
  testDir,
  // Fail the CI build if a test.only is committed by mistake.
  forbidOnly: Boolean(CI),
  retries: CI ? 1 : 0,
  workers: 1,
  timeout: DEBUG ? 0 : oneMinute,
  expect: { timeout: 10 * 1000 },

  // HTML report for humans; JUnit XML is the machine-readable artefact the CDP
  // portal consumes. `list` gives rolling progress in the terminal and CI logs.
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['junit', { outputFile: 'junit/results.xml' }]
  ],

  use: {
    baseURL,
    // Exposed to the API client fixture so backend steps can target the API.
    apiBaseURL,
    proxy,
    ignoreHTTPSErrors: true,
    actionTimeout: 10 * 1000,
    navigationTimeout: 30 * 1000,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure'
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 }
      }
    }
  ]
})
