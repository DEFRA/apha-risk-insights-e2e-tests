/**
 * A thin client for the backend risk API. It remembers the last response so a
 * "When I request ..." step and a later "Then the response ..." step can share
 * it without passing data around explicitly.
 */
export function createRiskApiClient(request, baseURL) {
  const client = {
    lastResponse: null,

    async get(path, options) {
      client.lastResponse = await request.get(`${baseURL}${path}`, options)
      return client.lastResponse
    },

    listRisks(query) {
      return client.get('/risks', query ? { params: query } : undefined)
    },

    getRisk(riskId) {
      return client.get(`/risks/${riskId}`)
    },

    health() {
      return client.get('/health')
    },

    documentation() {
      return client.get('/documentation')
    }
  }

  return client
}
