/**
 * The error page, shown for 404s and other Boom errors. The heading shows the
 * status code; the paragraph shows the message.
 */
export function createErrorPage(page) {
  return {
    page,
    heading: page.getByRole('heading', { level: 1 }),
    message: page.getByRole('main').getByRole('paragraph')
  }
}
