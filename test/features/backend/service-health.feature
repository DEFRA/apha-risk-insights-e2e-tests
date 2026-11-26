@api
Feature: Service health

  Scenario: The backend reports healthy
    When I request the health endpoint
    Then the response is successful

  Scenario: The OpenAPI documentation is served
    When I request the documentation endpoint
    Then the response is successful
