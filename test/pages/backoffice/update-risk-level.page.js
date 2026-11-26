/**
 * The back office update risk level form (`/update-risk-level/change`). Each
 * chosen disease has a radios fieldset, whose legend is the disease name, and a
 * comment box. The app redirects here from the select diseases page, so there is
 * no `open()`: without a selection the app sends you back to choose diseases.
 */
export function createUpdateRiskLevelPage(page) {
  const directionsFor = (diseaseName) =>
    page.getByRole('group', { name: diseaseName, exact: true })

  return {
    page,
    // GOV.UK error summary: "There is a problem" and a link per error
    errorSummary: page.getByRole('alert'),

    directionsFor,

    directionFor(diseaseName, direction) {
      return directionsFor(diseaseName).getByRole('radio', {
        name: direction,
        exact: true
      })
    },

    commentFor(diseaseName) {
      return page.getByRole('textbox', {
        name: `Comment for ${diseaseName}`,
        exact: true
      })
    },

    errorLink(message) {
      return this.errorSummary.getByRole('link', { name: message })
    },

    async enterChange(diseaseName, direction, comment) {
      await this.directionFor(diseaseName, direction).check()
      await this.commentFor(diseaseName).fill(comment)
    },

    async continue() {
      await page.getByRole('button', { name: 'Continue' }).click()
    }
  }
}
