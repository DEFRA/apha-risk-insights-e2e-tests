/**
 * A disease risk detail page (`/risk/{diseaseCode}`).
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

    async openByDiseaseCode(diseaseCode) {
      await page.goto(`/risk/${diseaseCode}`)
    },

    async goBack() {
      await backLink.click()
    }
  }
}
