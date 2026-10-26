---
name: e2e-test-writer
description: Write BDD end-to-end journey tests for APHA Risk Insights with playwright-bdd (Gherkin .feature files + Playwright step definitions). Use when adding or changing e2e tests in apha-risk-insights-e2e-tests — creating features, scenarios, step definitions, page objects or the API client. Keeps selectors and implementation detail out of features and steps.
license: OGL-UK-3.0
---

# Expert E2E Test Writer (BDD: playwright-bdd)

Tests are written as **Gherkin features** (business language) backed by
**Playwright step definitions**. Selectors live in **page objects**, not in
features or steps. The runner is Playwright itself (via `playwright-bdd`), so the
HTML/JUnit reporters, BrowserStack and CDP integration all keep working.

## Golden rules

1. **Features describe behaviour, never mechanics.** `When I open the risk
detail for "Bluetongue"`, never `When I click .app-risk-card a`.
2. **No selectors in `.feature` files or `*.steps.js`.** Selectors live only in
   `test/pages/*.page.js` (UI) and `test/api/*.client.js` (API).
3. **Steps are thin.** A step calls a page-object method and/or asserts with
   Playwright's web-first `expect`. No business logic in steps.
4. **Reuse step wording.** Prefer existing steps (e.g. `Then I see the heading
"..."`) before writing new ones. Steps match by text regardless of
   Given/When/Then — never define the same text twice with different keywords.
5. **Use ARIA role locators wherever possible.** In page objects, reach for
   `getByRole(...)` first; fall back to `getByTestId`/CSS only when no role or
   accessible name exists. See [Locators: role first](#locators-role-first).

## Locators: role first

Locate elements the way a user or assistive technology perceives them. In page
objects, prefer in this order:

1. **Role + accessible name** — `getByRole('link', { name: 'Back to overview' })`,
   `getByRole('heading', { level: 1 })`, `getByRole('table')`,
   `getByRole('img', { name: 'Risk level over time' })`.
2. **Role scoped to a region** when a bare role is ambiguous —
   `page.getByRole('main').getByRole('paragraph')`.
3. **`getByLabel` / `getByPlaceholder`** for form fields.
4. **`getByTestId`** only when there is no suitable role or accessible name
   (e.g. a wrapper `<div data-testid="...">` with no semantic role). Prefer
   anchoring to a role _inside_ that element instead where you can.
5. **CSS/XPath** — last resort; avoid.

Tips:

- A `data-testid="app-heading-title"` on an `<h1>` is better located as
  `getByRole('heading', { level: 1 })`.
- GOV.UK summary-card titles render as headings, so a "card" is often best
  located via its title heading (`getByRole('heading', { name: '...' })` or
  `{ level: 2 }`), not a wrapper test id.
- If a role locator is ambiguous, scope it to a landmark role (`main`,
  `navigation`, `banner`, `contentinfo`) rather than dropping to a test id.
- Picking role locators also exercises accessibility: if an element has no role
  or accessible name, that is often a hint to fix the markup, not the test.

## Layout

```
test/
  features/              # Gherkin — the behaviour
    *.feature
    api/*.feature        # tagged @api
  steps/                 # step definitions (thin glue)
    fixtures.js          # base test + page-object/API fixtures + Given/When/Then
    *.steps.js
    api/*.steps.js
  pages/                 # Page Objects — the ONLY place UI selectors live
    *.page.js
  api/                   # API client — the ONLY place API paths live
    risk-api.client.js
```

Generation: `npx bddgen` turns features into Playwright specs under
`.features-gen/` (git-ignored); `npm test` runs `bddgen` then `playwright test`.

Import aliases (from `package.json` `imports`): `#steps/*`, `#pages/*`, `#api/*`.

## Workflow to add a test

1. **Read the app first.** Find the real heading text, link text, `data-testid`s,
   route paths and slug rules in the frontend/backend. Never guess copy or
   selectors — assert what the app actually renders.
2. **Write the scenario** in a `.feature` using existing step wording where you
   can.
3. **Add selectors** to the relevant page object (or a new one) — not the step.
4. **Add/extend step definitions** that call page-object methods and assert.
5. **Register new page objects/clients as fixtures** in `test/steps/fixtures.js`.
6. **Run** `npx bddgen` then the suite.

## Patterns to copy

### Feature (Gherkin)

```gherkin
Feature: Risk overview

  Scenario: Opening a disease from its card
    Given I am on the risk overview page
    When I open the risk detail for "African Swine Fever"
    Then the page URL ends with "/risk/african-swine-fever"
    And I see the heading "African Swine Fever"
```

### Page object (selectors live here)

```js
export class RiskOverviewPage {
  constructor(page) {
    this.page = page
    this.heading = page.getByRole('heading', { level: 1 })
    // Each risk card renders its disease name as a level-2 heading.
    this.riskCards = page.getByRole('heading', { level: 2 })
  }
  async open() {
    await this.page.goto('/risk')
  }
  cardLinkFor(diseaseName) {
    return this.page.getByRole('link', { name: diseaseName, exact: true })
  }
  async openDetailFor(diseaseName) {
    await this.cardLinkFor(diseaseName).click()
  }
}
```

### Step definition (thin glue)

```js
import { expect } from '@playwright/test'
import { When, Then } from '#steps/fixtures.js'

When(
  'I open the risk detail for {string}',
  async ({ riskOverviewPage }, diseaseName) => {
    await riskOverviewPage.openDetailFor(diseaseName)
  }
)

Then('I see at least one disease risk card', async ({ riskOverviewPage }) => {
  await expect(riskOverviewPage.riskCards.first()).toBeVisible()
})
```

### Fixture registration

```js
// test/steps/fixtures.js
import { test as base, createBdd } from 'playwright-bdd'
import { RiskOverviewPage } from '#pages/risk-overview.page.js'

export const test = base.extend({
  riskOverviewPage: async ({ page }, use) => {
    await use(new RiskOverviewPage(page))
  }
})

export const { Given, When, Then } = createBdd(test)
```

### API scenarios

- Tag the feature `@api`. Tagged scenarios auto-skip when `E2E_API_BASE_URL` is not
  configured (handled by the `skipApiWhenUnconfigured` fixture).
- The `riskApi` client remembers the `lastResponse`, so a `When I request ...`
  step and a later `Then the response ...` step share it:

```gherkin
@api
Feature: Risk API
  Scenario: Listing risk summaries
    When I request the risk list
    Then the response status is 200
    And the response body contains a page of risk items
```

```js
When('I request the risk list', async ({ riskApi }) => {
  await riskApi.listRisks()
})
Then('the response status is {int}', async ({ riskApi }, status) => {
  expect(riskApi.lastResponse.status()).toBe(status)
})
```

## Assertion guidance

- UI: assert with Playwright web-first matchers on page-object locators —
  `await expect(page.heading).toHaveText(...)`, `.toBeVisible()`,
  `.toContainText(...)`. These auto-wait; never add `waitForTimeout`.
- Navigation: `await expect(page).toHaveURL(...)` or
  `await page.waitForURL(url => url.pathname.endsWith(suffix))`.
- API: assert on `riskApi.lastResponse.status()` / `.ok()` and the parsed
  `await riskApi.lastResponse.json()`.

## Anti-patterns (reject these)

- Selectors, `page.goto`, or raw paths inside a `.feature` or `*.steps.js`.
- Business logic or conditionals in step definitions.
- Duplicate step text differing only by keyword (Given vs Then) — causes an
  ambiguous/duplicate step error.
- `sleep` / `waitForTimeout` / fixed delays — rely on web-first auto-waiting.
- Hard-coded copy or slugs that were guessed rather than read from the app.
- Reaching for `getByTestId` or CSS when a role locator would work — roles
  first (see [Locators: role first](#locators-role-first)).

## Before you finish

Run `npm run lint`, `npm run format:check`, then `npm run test:local` (with the
frontend and backend running locally) to confirm the new scenarios pass.
