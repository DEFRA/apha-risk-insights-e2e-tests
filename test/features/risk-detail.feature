Feature: Disease risk detail

  Background:
    Given I am viewing the risk detail for "Bluetongue"

  Scenario: The latest assessment, chart and history are shown
    Then I see the heading "Bluetongue"
    And I see the latest assessment card
    And I see the risk history chart
    And I see the assessment history table

  Scenario: Returning to the overview
    When I go back to the overview
    Then I am taken to the risk overview page
    And I see the heading "Disease risk overview"
