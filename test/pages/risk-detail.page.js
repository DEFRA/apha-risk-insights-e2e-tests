/**
 * A disease risk detail page (`/risk/{slug}`).
 */
export function createRiskDetailPage(page) {
  const backLink = page.getByRole('link', { name: 'Back to overview' })

  return {
    page,
    heading: page.getByRole('heading', { level: 1 }),
    backLink,
    latestAssessmentCard: page.getByRole('heading', {
      name: 'Latest assessment'
    }),
    historyChart: page.getByRole('img', { name: 'Risk level over time' }),
    historyTable: page.getByRole('table'),

    async openBySlug(slug) {
      await page.goto(`/risk/${slug}`)
    },

    async goBack() {
      await backLink.click()
    }
  }
}
