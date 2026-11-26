import { When } from '#steps/fixtures.js'

When('I follow the {string} link', async ({ confirmationPage }, linkText) => {
  await confirmationPage.follow(linkText)
})
