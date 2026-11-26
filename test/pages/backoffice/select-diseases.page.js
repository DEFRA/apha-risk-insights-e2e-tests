/**
 * The back office select diseases page (`/update-risk-level`), the first step
 * of the update risk level journey. One checkbox per disease, labelled with its
 * name.
 */
export function createSelectDiseasesPage(page, baseURL) {
  return {
    page,

    diseaseCheckbox(diseaseName) {
      return page.getByRole('checkbox', { name: diseaseName, exact: true })
    },

    async open() {
      await page.goto(new URL('/update-risk-level', baseURL).href)
    },

    // Ticks exactly these diseases, unticking any others
    async choose(diseaseNames) {
      const checkboxes = page.getByRole('main').getByRole('checkbox')
      for (const checkbox of await checkboxes.all()) {
        await checkbox.uncheck()
      }
      for (const diseaseName of diseaseNames) {
        await this.diseaseCheckbox(diseaseName).check()
      }
    }
  }
}
