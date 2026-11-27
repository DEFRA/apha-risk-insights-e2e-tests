/**
 * The back office home page (`/`). Lists each disease's risk level changes in
 * GOV.UK tabs: one tab per disease, holding a history table captioned with its
 * name.
 */
export function createBackofficeHomePage(page, baseURL) {
  const main = page.getByRole('main')
  return {
    page,
    updateRiskLevelLink: main.getByRole('link', { name: 'Update risk level' }),

    tabFor(diseaseName) {
      return main.getByRole('tab', { name: diseaseName, exact: true })
    },

    async open() {
      await page.goto(new URL('/', baseURL).href)
    }
  }
}
