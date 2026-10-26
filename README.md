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

Start the frontend (`:3000`) and backend (`:3001`) you want to test, then:

```bash
npm run test:local
```

`test:local` targets `http://localhost:3000` (UI) and `http://localhost:3001`
(API). The `@api` scenarios skip automatically if `API_BASE_URL` is not set.

> **Data flow today.** The frontend serves static sample data (it does not call
> the backend yet — see the frontend's `accessing-risk-data-through-repository`
> ADR). So the UI scenarios exercise the frontend, and the `@api` scenarios
> exercise the backend and its Mongo independently. The `@api` real-data
> scenarios need the backend's `disease_risks` collection seeded. The GitHub run
> seeds it automatically ([docker/scripts/mongodb/10-seed-disease-risks.js](docker/scripts/mongodb/10-seed-disease-risks.js));
> for a local dev backend, load that same seed into its Mongo, e.g.:
>
> ```bash
> docker exec -i <backend-mongo-container> mongosh --quiet \
>   < docker/scripts/mongodb/10-seed-disease-risks.js
> ```

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
  features/            # Gherkin — the behaviour (*.feature), api/ tagged @api
  steps/               # step definitions (thin glue)
    fixtures.js        # base test + page-object/API fixtures + Given/When/Then
    *.steps.js
  pages/               # Page Objects — the only place UI selectors live
  api/                 # API client — the only place API paths live
```

A scenario reads like this:

```gherkin
Feature: Risk overview

  Scenario: Opening a disease from its card
    Given I am on the risk overview page
    When I open the risk detail for "African Swine Fever"
    Then the page URL ends with "/risk/african-swine-fever"
    And I see the heading "African Swine Fever"
```

Backed by a page object and a thin step:

```js
// test/pages/risk-overview.page.js
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

// test/steps/risk-overview.steps.js
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
In short: read the app for real headings/test-ids/slugs → write the scenario
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

The suite runs against the services in [compose.yml](compose.yml) (frontend,
backend, mongodb, redis, localstack). Playwright runs its browsers in-process,
so no browser container is needed.

```bash
docker compose up --wait -d
npm run test:github
```

The composite action in [run-journey-tests](run-journey-tests/action.yml) wires
this up for CI and uploads the Playwright report as an artefact.

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
(`https://apha-risk-insights-frontend.<env>.cdp-int.defra.cloud` and the backend
equivalent), and can be overridden with `BASE_URL` / `API_BASE_URL`.

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
