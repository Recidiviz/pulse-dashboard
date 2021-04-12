Feature: Login with Auth0
    As a user on the homepage
    I want to login with Auth0
    Because I want to access the dashboard

    Background:
        Given I am on the login page

    Scenario: Logging in with Auth0
        When I login as an "admin" user
        Then I should see the Lantern landing page
