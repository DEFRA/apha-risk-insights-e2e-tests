/**
 * The shared page layout. Holds elements that appear on every page, such as the
 * page heading (`app-heading-title`). Keeping it here lets a single "I see the
 * heading" step work across all pages without repeating the selector.
 */
export function createLayoutPage(page) {
  return {
    page,
    heading: page.getByRole('heading', { level: 1 })
  }
}
