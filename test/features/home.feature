Feature: Home page

  Scenario: The service heading is shown
    Given I am on the home page
    Then I see the heading "APHA-risk insights frontend"

  Scenario: Navigating to the risk overview
    Given I am on the home page
    When I follow the risk overview link
    Then I am taken to the risk overview page
    And I see the heading "Disease risk overview"
