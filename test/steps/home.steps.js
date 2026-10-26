import { When } from '#steps/fixtures.js'

When('I follow the risk overview link', async ({ homePage }) => {
  await homePage.riskOverviewLink.click()
})
