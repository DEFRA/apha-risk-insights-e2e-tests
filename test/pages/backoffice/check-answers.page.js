/**
 * The back office check your answers page
 * (`/update-risk-level/check-answers`). A summary list of the diseases chosen,
 * then a GOV.UK summary card per disease, titled with the disease name.
 */
export function createCheckAnswersPage(page, baseURL) {
  // Summary cards and their rows have no role or accessible name of their own,
  // so they are found by GOV.UK Frontend class, anchored on the card's title
  // heading and the row's key (a `term`).
  const cardFor = (diseaseName) =>
    page.locator('.govuk-summary-card').filter({
      has: page.getByRole('heading', { name: diseaseName, exact: true })
    })

  const rowFor = (diseaseName, key) =>
    cardFor(diseaseName)
      .locator('.govuk-summary-list__row')
      .filter({ has: page.getByRole('term').filter({ hasText: key }) })

  return {
    page,

    cardFor,

    // The value of the "Diseases to update" row, e.g. "African swine fever, Bluetongue"
    diseasesToUpdate: page
      .locator('.govuk-summary-list__row')
      .filter({
        has: page.getByRole('term').filter({ hasText: 'Diseases to update' })
      })
      .locator('.govuk-summary-list__value'),

    // The value cell of the row whose key is `key`, in a disease's card
    answerFor(diseaseName, key) {
      return rowFor(diseaseName, key).locator('.govuk-summary-list__value')
    },

    async open() {
      await page.goto(new URL('/update-risk-level/check-answers', baseURL).href)
    },

    // Found inside the row rather than by accessible name: GOV.UK appends the
    // card title to the link's hidden text, so the full name is an
    // implementation detail of the app.
    async changeNewRiskLevelFor(diseaseName) {
      await rowFor(diseaseName, 'New risk level')
        .getByRole('link', { name: /^Change/ })
        .click()
    },

    async changeDiseasesToUpdate() {
      await page
        .getByRole('link', { name: 'Change diseases to update', exact: true })
        .click()
    },

    async submit() {
      await page.getByRole('button', { name: 'Submit' }).click()
    }
  }
}
