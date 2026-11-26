Feature: Unknown disease

  Scenario: Viewing a disease that does not exist
    When I open the risk detail page for an unknown disease
    Then I see the heading "404"
    And I see the error message "Page not found"
