Feature: Switch Tenants on Lantern
    As an admin user
    I want to login to the Lantern dashboard
    And click on my user profile to switch to a different state's page

    Background:
        Given I am logged in as a "admin" user

    Scenario: Navigating to the Profile page
        When I click on the profile link
        Then I should see the Profile page

    Scenario: Navigating from the Profile page to a different state
        When I am on the Profile page
        And I select the state "Pennsylvania"
        Then I should see the Pennsylvania dashboard
