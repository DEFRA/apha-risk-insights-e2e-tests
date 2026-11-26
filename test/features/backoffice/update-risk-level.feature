@backoffice
Feature: Update risk level

  Background:
    Given I am choosing which diseases to update

  Scenario: Recording a risk level change for each disease
    When I choose to update these diseases:
      | African swine fever               |
      | Highly pathogenic avian influenza |
      | Bluetongue                        |
    And I continue
    And I enter these risk level changes:
      | disease                           | direction     | comment                             |
      | African swine fever               | Increase      | New outbreaks reported near borders |
      | Highly pathogenic avian influenza | Stay the same | No change in the latest assessment  |
      | Bluetongue                        | Decrease      | Vector season has ended             |
    And I continue
    Then I see the heading "Check your answers"
    And the diseases to update are "African swine fever, Highly pathogenic avian influenza, Bluetongue"
    And my answers show these new risk levels:
      | disease                           | new risk level |
      | African swine fever               | High           |
      | Highly pathogenic avian influenza | High           |
      | Bluetongue                        | Very low       |
    When I submit my answers
    Then I see the heading "Submission received"
    When I follow the "Home" link
    And I view the risk level changes for "African swine fever"
    Then the latest update for "African swine fever" shows:
      | Risk level | High                                |
      | Change     | Increase                            |
      | Comment    | New outbreaks reported near borders |

  Scenario: Only the chosen diseases are asked about
    When I choose to update these diseases:
      | African swine fever |
      | Bluetongue          |
    And I continue
    Then I see the heading "Update risk level"
    And I am asked about "African swine fever"
    And I am asked about "Bluetongue"
    And I am not asked about "Highly pathogenic avian influenza"

  Scenario: Continuing without choosing a disease
    When I continue
    Then I see the error "Select at least one disease to update"

  Scenario: Continuing without answering
    When I choose to update these diseases:
      | African swine fever |
      | Bluetongue          |
    And I continue
    And I continue
    Then I see the error "Select whether the risk level for African swine fever increases, decreases or stays the same"
    And I see the error "Enter a comment for Bluetongue"

  Scenario: Changing an answer before submitting
    When I choose to update these diseases:
      | African swine fever |
      | Bluetongue          |
    And I continue
    And I enter these risk level changes:
      | disease             | direction | comment                             |
      | African swine fever | Increase  | New outbreaks reported near borders |
      | Bluetongue          | Decrease  | Vector season has ended             |
    And I continue
    And I change the new risk level for "Bluetongue"
    Then I see the heading "Update risk level"
    And "Decrease" is selected for "Bluetongue"
    When I select "Stay the same" for "Bluetongue"
    And I continue
    Then my answers show these new risk levels:
      | disease    | new risk level |
      | Bluetongue | Low            |

  Scenario: Removing a disease before submitting keeps the other answers
    When I choose to update these diseases:
      | African swine fever |
      | Bluetongue          |
    And I continue
    And I enter these risk level changes:
      | disease             | direction | comment                             |
      | African swine fever | Increase  | New outbreaks reported near borders |
      | Bluetongue          | Decrease  | Vector season has ended             |
    And I continue
    And I change the diseases to update
    Then these diseases are chosen:
      | African swine fever |
      | Bluetongue          |
    When I choose to update these diseases:
      | African swine fever |
    And I continue
    Then "Increase" is selected for "African swine fever"
    When I continue
    Then the diseases to update are "African swine fever"
    And my answers show these new risk levels:
      | disease             | new risk level |
      | African swine fever | High           |
    And my answers do not include "Bluetongue"

  Scenario: Checking answers before choosing any diseases
    When I go straight to check your answers
    Then I see the heading "Which diseases do you want to update?"
