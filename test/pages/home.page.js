/**
 * The home page (`/`).
 */
export function createHomePage(page) {
  return {
    page,
    heading: page.getByRole('heading', { level: 1 }),
    riskOverviewLink: page
      .getByTestId('app-page-body')
      .getByRole('link', { name: 'Risk overview' }),

    async open() {
      await page.goto('/')
    }
  }
}
