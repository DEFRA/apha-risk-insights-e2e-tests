# apha-risk-insights-e2e-tests

Playwright end-to-end journey tests for the APHA Risk Insights service, written
as **BDD** with [playwright-bdd](https://vitalets.github.io/playwright-bdd/):
Gherkin `.feature` files describe behaviour in plain English, Playwright step
definitions implement them, and page objects keep selectors out of the tests.

- [Local development](#local-development)
  - [Requirements](#requirements)
  - [Setup](#setup)
  - [Running tests locally](#running-tests-locally)
  - [Debugging](#debugging)
- [How the tests are structured (BDD)](#how-the-tests-are-structured-bdd)
- [Writing new tests](#writing-new-tests)
- [Reporting](#reporting)
- [Running on GitHub](#running-on-github)
- [Production (CDP portal)](#production-cdp-portal)
- [BrowserStack](#browserstack)
- [Licence](#licence)

## Local development

### Requirements

Node.js `>= v24` (see [.nvmrc](.nvmrc)). With [nvm](https://github.com/nvm-sh/nvm):

```bash
nvm use
```

### Setup

```bash
npm install
npm run install:browsers   # one-off: installs Chromium for Playwright
```

### Running tests locally

The services run from
[apha-incubator-core](https://github.com/DEFRA/apha-incubator-core). With the
repos cloned side by side:

```bash
# in apha-incubator-core
npm start            # dev stack, your source mounted
npm run start:ci     # or: production images, exactly as CI runs them

# in this repo
npm run seed         # load the test data (safe to rerun)
npm run test:local
```

`test:local` targets `http://localhost:3000` (frontend), `http://localhost:3001`
(API) and `http://localhost:3003` (back office). The `@api` scenarios skip
automatically if `E2E_API_BASE_URL` is not set, and the `@backoffice` scenarios
if `E2E_BACKOFFICE_BASE_URL` is not set.
Pass Playwright options after `--`, e.g. `npm run test:local -- --grep @api`.

> **Data flow today.** The frontend serves static sample data (it does not call
> the backend yet — see the frontend's `accessing-risk-data-through-repository`
> ADR). So the UI scenarios exercise the frontend, and the `@api` scenarios
> exercise the backend and its Mongo independently. The `@api` scenarios need
> the records in [seed/disease-risks.mongo.js](seed/disease-risks.mongo.js),
> which `npm run seed` loads into the backend's MongoDB. It replaces the
> `disease_risks` collection, so reseed your dev data afterwards if you need it.

### Debugging

```bash
npm run test:local:debug   # Playwright Inspector, no timeouts
npm run test:local:ui      # Playwright UI mode (time-travel, watch)
```

## How the tests are structured (BDD)

Gherkin features describe behaviour; step definitions are thin glue; page
objects hold the selectors.

```
test/
  features/            # Gherkin — the behaviour, one folder per service under test:
    frontend/          #   the public frontend
    backend/           #   the backend API, tagged @api
    backoffice/        #   the back office, tagged @backoffice
  steps/               # step definitions (thin glue), same folders as features/
    fixtures.js        # base test + page-object/API fixtures + Given/When/Then
    common/            #   steps shared by every service, e.g. "I see the heading"
  pages/               # Page Objects — the only place UI selectors live
    frontend/ backoffice/ common/
  api/                 # API client — the only place API paths live
```

A scenario reads like this:

```gherkin
Feature: Risk overview

  Scenario: Opening a disease from its card
    Given I am on the risk overview page
    When I open the risk detail for "African Swine Fever"
    Then the page URL ends with "/risk/asf"
    And I see the heading "African Swine Fever"
```

Backed by a page object and a thin step:

```js
// test/pages/frontend/risk-overview.page.js
export class RiskOverviewPage {
  constructor(page) {
    this.page = page
    this.riskCards = page.getByTestId('app-risk-card')
  }
  async openDetailFor(diseaseName) {
    await this.page
      .getByRole('link', { name: diseaseName, exact: true })
      .click()
  }
}

// test/steps/frontend/risk-overview.steps.js
When(
  'I open the risk detail for {string}',
  async ({ riskOverviewPage }, diseaseName) => {
    await riskOverviewPage.openDetailFor(diseaseName)
  }
)
```

- **Features** (`*.feature`) — behaviour in Gherkin, no selectors.
- **Steps** (`*.steps.js`) — call page-object methods and assert with Playwright's
  web-first `expect`; no selectors, no business logic.
- **Page objects / API client** — the only place selectors and API paths live.
- **Fixtures** (`test/steps/fixtures.js`) — expose page objects and the API
  client to steps, and auto-skip `@api` scenarios when no API URL is set.

`npx bddgen` generates Playwright specs from the features into `.features-gen/`
(git-ignored); `npm test` runs `bddgen` then `playwright test`.

## Writing new tests

Follow the `e2e-test-writer` skill in
[.github/skills/e2e-test-writer/SKILL.md](.github/skills/e2e-test-writer/SKILL.md).
In short: read the app for real headings/test-ids/URLs → write the scenario
reusing existing step wording → put selectors in a page object → add thin steps
→ run `npx bddgen` and the suite.

## Reporting

Playwright produces:

- an **HTML report** in `playwright-report/` (published to S3 on CDP), and
- **JUnit XML** in `junit/results.xml` (machine-readable, for CDP).

View the HTML report locally:

```bash
npm run report
```

## Running on GitHub

The [run-journey-tests](run-journey-tests/action.yml) composite action:

1. checks out apha-incubator-core, every service and this repo side by side.
   The repo that called the action is checked out at the exact commit that
   triggered the run: for a pull request, its merge with `main`. Every other
   repo is checked out at `main`
2. starts the stack with `npm run start:ci` in core: each service's production
   image built from that checkout
3. loads the test data with `npm run seed` and runs `npm run test:github`
4. uploads the Playwright report, traces and the service logs as artefacts

Add it to a service's pull request workflow as its own job, with no other
checkout:

```yaml
journey-tests:
  name: Run Journey Tests
  runs-on: ubuntu-latest
  permissions:
    contents: read
    id-token: write
  steps:
    - uses: DEFRA/apha-risk-insights-e2e-tests/run-journey-tests@<commit SHA> # main
```

Pin the action to a commit on `main`, as with the other actions, and update the
SHA to pick up changes. `id-token: write` lets it log in to Docker Hub through
the repo's CDP build role, avoiding Docker Hub's rate limits. Without it, or
in a repo with no CDP build role, it pulls anonymously instead.

Inputs (all optional):

| Input                                                                                   | Use                                                           |
| --------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| `core-ref`, `backend-ref`, `frontend-ref`, `ingestion-ref`, `backoffice-ref`, `e2e-ref` | Test against a branch of another repo                         |
| `playwright-args`                                                                       | Extra `playwright test` arguments, e.g. `--grep @smoke`       |
| `artifact-name`                                                                         | Artefact name prefix, if a run uses the action more than once |

This repo's own pull requests run it from the branch, so changes to the action
are tested before merge. [journey-tests.yml](.github/workflows/journey-tests.yml)
runs it against `main` of everything, by hand or from another workflow.

## Production (CDP portal)

Tests run from the CDP Portal under **Test Suites**. On merge to `main` a Docker
image is built via `.github/workflows/publish.yml`.

Requirements kept from the CDP template:

1. The suite builds as a Docker image (see [Dockerfile](Dockerfile)).
2. [entrypoint.sh](entrypoint.sh) returns `0` on pass and `1` on failure (and
   writes a `FAILED` marker file).
3. The report is published to S3 via [bin/publish-tests.sh](bin/publish-tests.sh)
   using `RESULTS_OUTPUT_S3_PATH`.

The base URLs are derived from the `ENVIRONMENT` variable
(`https://apha-risk-insights-frontend.<env>.cdp-int.defra.cloud`, and the
backend and back office equivalents), and can be overridden with
`E2E_BASE_URL` / `E2E_API_BASE_URL` / `E2E_BACKOFFICE_BASE_URL`.

## BrowserStack

Configured for the Playwright BrowserStack SDK in
[browserstack.yml](browserstack.yml). Credentials come from
`BROWSERSTACK_USERNAME` and `BROWSERSTACK_ACCESS_KEY` (never commit them).

```bash
npm run test:browserstack          # from the CDP portal
npm run test:github:browserstack   # from a GitHub runner
```

## Licence

THIS INFORMATION IS LICENSED UNDER THE CONDITIONS OF THE OPEN GOVERNMENT LICENCE
found at:

<http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3>

The following attribution statement MUST be cited in your products and
applications when using this information.

> Contains public sector information licensed under the Open Government licence v3

### About the licence

The Open Government Licence (OGL) was developed by the Controller of Her
Majesty's Stationery Office (HMSO) to enable information providers in the public
sector to license the use and re-use of their information under a common open
licence.

It is designed to encourage use and re-use of information freely and flexibly,
with only a few conditions.
