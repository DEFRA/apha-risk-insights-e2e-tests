@backoffice
Feature: Back office home page

  Scenario: The risk level changes are shown for each disease
    Given I am on the back office home page
    Then I see the heading "IDM Insights"
    And I see risk level changes for these diseases:
      | African swine fever               |
      | Highly pathogenic avian influenza |
      | Bluetongue                        |

  Scenario: Starting a risk level update
    Given I am on the back office home page
    When I follow the update risk level link
    Then I see the heading "Which diseases do you want to update?"
