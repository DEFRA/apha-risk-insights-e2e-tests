@api
Feature: Risk API

  Scenario: Listing risk summaries
    When I request the risk list
    Then the response status is 200
    And the response body contains a page of risk items
    And the risk list contains at least one disease risk

  Scenario: Filtering the risk list by disease code
    When I request the risk list filtered by disease code "ASF"
    Then the response status is 200
    And every risk in the list has disease code "ASF"

  Scenario: Fetching a known disease risk by id
    When I request the risk with id "5b0f7a52-3c1e-4d6a-9a47-0e8d2f1c6b05"
    Then the response status is 200
    And the response body has an assessment history

  Scenario: Rejecting an invalid status filter
    When I request the risk list filtered by status "not-a-real-status"
    Then the response status is 400

  Scenario: Rejecting a risk id that is not a GUID
    When I request the risk with id "not-a-guid"
    Then the response status is 400

  Scenario: Returning not found for an unknown risk id
    When I request the risk with id "11111111-1111-4111-8111-111111111111"
    Then the response status is 404
