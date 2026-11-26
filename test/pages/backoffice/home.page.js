/**
 * The back office home page (`/`). Lists each disease's risk level changes in
 * GOV.UK tabs: one tab per disease, holding a table captioned with its name.
 */
export function createBackofficeHomePage(page, baseURL) {
  const main = page.getByRole('main')
  const changesTableFor = (diseaseName) =>
    main.getByRole('table', { name: diseaseName })

  return {
    page,
    updateRiskLevelLink: main.getByRole('link', { name: 'Update risk level' }),

    tabFor(diseaseName) {
      return main.getByRole('tab', { name: diseaseName, exact: true })
    },

    changesTableFor,

    // The row whose header cell reads "Latest update", in a disease's table
    latestUpdateFor(diseaseName) {
      return changesTableFor(diseaseName)
        .getByRole('row')
        .filter({ has: page.getByRole('rowheader', { name: 'Latest update' }) })
    },

    async open() {
      await page.goto(new URL('/', baseURL).href)
    },

    async viewChangesFor(diseaseName) {
      await this.tabFor(diseaseName).click()
    }
  }
}
