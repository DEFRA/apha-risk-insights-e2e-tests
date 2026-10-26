Feature: Risk overview

  Scenario: The disease risk cards are listed
    Given I am on the risk overview page
    Then I see the heading "Disease risk overview"
    And I see at least one disease risk card

  Scenario: Opening a disease from its card
    Given I am on the risk overview page
    When I open the risk detail for "African Swine Fever"
    Then the page URL ends with "/risk/african-swine-fever"
    And I see the heading "African Swine Fever"
