Feature: Navigate to Population Projections Dashboard
    As a user
    I want to login to the Population Projections dashboard
    And see the projections chart

    Background:
      Given I am logged in as a "admin" user
      And I click on the profile link
      And I select the state "Idaho"

    Scenario: Viewing the Projections Chart
        When I'm on the "Facilities" view
        Then I should see the projections chart for "facilities"
        When I'm on the "Community" view
        Then I should see the projections chart for "community"
