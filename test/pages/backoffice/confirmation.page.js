/**
 * The back office confirmation page (`/update-risk-level/confirmation`). Its
 * GOV.UK panel title is the level-1 heading, so the shared heading step covers
 * it.
 */
export function createConfirmationPage(page) {
  return {
    page,

    async follow(linkText) {
      await page
        .getByRole('main')
        .getByRole('link', { name: linkText, exact: true })
        .click()
    }
  }
}
