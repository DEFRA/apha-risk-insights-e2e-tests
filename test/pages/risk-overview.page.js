/**
 * The disease risk overview page (`/risk`).
 */
export function createRiskOverviewPage(page) {
  const cardLinkFor = (diseaseName) =>
    page.getByRole('link', { name: diseaseName, exact: true })

  return {
    page,
    heading: page.getByRole('heading', { level: 1 }),
    // Each risk card renders its disease name as a level-2 heading.
    riskCards: page.getByRole('heading', { level: 2 }),

    cardLinkFor,

    async open() {
      await page.goto('/risk')
    },

    async openDetailFor(diseaseName) {
      await cardLinkFor(diseaseName).click()
    }
  }
}
